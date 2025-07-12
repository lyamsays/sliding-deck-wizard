import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import PptxGenJs from 'pptxgenjs';
import { Slide } from '@/types/deck';

export interface ExportOptions {
  deckTitle: string;
  slides: Slide[];
  onProgress?: (current: number, total: number) => void;
  onSuccess?: (message: string) => void;
  onError?: (error: string) => void;
}

// Wait for all images and fonts to load
const waitForContent = async (): Promise<void> => {
  return new Promise((resolve) => {
    // Wait for fonts to load
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        // Wait a bit more for any remaining content
        setTimeout(resolve, 500);
      });
    } else {
      setTimeout(resolve, 1000);
    }
  });
};

// Enhanced slide capture function
const captureSlide = async (slideElement: HTMLElement, index: number): Promise<string> => {
  // Scroll the element into view
  slideElement.scrollIntoView({ behavior: 'instant', block: 'center' });
  
  // Wait for content to stabilize
  await new Promise(resolve => setTimeout(resolve, 200));

  // Temporarily hide hover elements and buttons
  const actionButtons = slideElement.querySelectorAll('.slide-ui-elements-not-for-export');
  actionButtons.forEach(el => {
    (el as HTMLElement).style.display = 'none';
  });

  try {
    const canvas = await html2canvas(slideElement, {
      backgroundColor: '#ffffff',
      scale: 2,
      useCORS: true,
      allowTaint: true,
      foreignObjectRendering: true,
      logging: false,
      width: slideElement.offsetWidth,
      height: slideElement.offsetHeight,
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
      scrollX: 0,
      scrollY: 0,
      onclone: (clonedDoc) => {
        // Ensure the cloned document has all styles
        const clonedSlide = clonedDoc.getElementById(`slide-content-${index}`);
        if (clonedSlide && slideElement) {
          // Copy computed styles
          const originalStyles = window.getComputedStyle(slideElement);
          clonedSlide.style.background = originalStyles.background;
          clonedSlide.style.backgroundImage = originalStyles.backgroundImage;
          clonedSlide.style.backgroundColor = originalStyles.backgroundColor;
          
          // Ensure all text has proper colors
          const textElements = clonedSlide.querySelectorAll('*');
          textElements.forEach(el => {
            const element = el as HTMLElement;
            const originalEl = slideElement.querySelector(`#${element.id}`) || 
                             slideElement.querySelector(`.${Array.from(element.classList).join('.')}`);
            if (originalEl) {
              const styles = window.getComputedStyle(originalEl);
              element.style.color = styles.color;
              element.style.fontFamily = styles.fontFamily;
              element.style.fontSize = styles.fontSize;
              element.style.fontWeight = styles.fontWeight;
            }
          });
        }
      }
    });

    return canvas.toDataURL('image/png', 1.0);
  } finally {
    // Restore hidden elements
    actionButtons.forEach(el => {
      (el as HTMLElement).style.display = '';
    });
  }
};

// Find all slide elements with better detection
const findSlideElements = (): HTMLElement[] => {
  // Try multiple selectors to find slides
  const selectors = [
    '[id^="slide-content-"]',  // Primary selector for StyledSlide
    '.group.relative.overflow-hidden',  // Fallback based on StyledSlide classes
    '[data-slide-content]',  // Alternative data attribute
    '.styled-slide'  // Generic slide class
  ];

  for (const selector of selectors) {
    const elements = document.querySelectorAll(selector) as NodeListOf<HTMLElement>;
    if (elements.length > 0) {
      console.log(`Found ${elements.length} slides using selector: ${selector}`);
      return Array.from(elements);
    }
  }

  throw new Error('No slides found on the page. Please ensure slides are visible.');
};

export const exportToPDF = async (options: ExportOptions): Promise<void> => {
  const { deckTitle, onProgress, onSuccess, onError } = options;

  try {
    await waitForContent();
    
    const slideElements = findSlideElements();
    
    if (slideElements.length === 0) {
      throw new Error('No slides found to export');
    }

    onProgress?.(0, slideElements.length);

    // Initialize PDF with landscape orientation for presentations
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'pt',
      format: [1920, 1080]
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    for (let i = 0; i < slideElements.length; i++) {
      if (i > 0) {
        pdf.addPage();
      }

      onProgress?.(i + 1, slideElements.length);

      const imageData = await captureSlide(slideElements[i], i);
      
      // Add image to PDF, maintaining aspect ratio
      pdf.addImage(
        imageData,
        'PNG',
        0,
        0,
        pageWidth,
        pageHeight,
        '',
        'FAST'
      );
    }

    // Save the PDF
    pdf.save(`${deckTitle || 'presentation'}.pdf`);
    onSuccess?.('PDF exported successfully');

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to export PDF';
    onError?.(errorMessage);
    throw error;
  }
};

export const exportToPowerPoint = async (options: ExportOptions): Promise<void> => {
  const { deckTitle, onProgress, onSuccess, onError } = options;

  try {
    await waitForContent();
    
    const slideElements = findSlideElements();
    
    if (slideElements.length === 0) {
      throw new Error('No slides found to export');
    }

    onProgress?.(0, slideElements.length);

    // Create new PowerPoint presentation
    const pptx = new PptxGenJs();
    pptx.layout = 'LAYOUT_16x9';

    for (let i = 0; i < slideElements.length; i++) {
      onProgress?.(i + 1, slideElements.length);

      const imageData = await captureSlide(slideElements[i], i);
      
      // Add slide to presentation
      const slide = pptx.addSlide();
      
      // Add the captured slide as background image
      slide.addImage({
        data: imageData,
        x: 0,
        y: 0,
        w: '100%',
        h: '100%'
      });
    }

    // Save the presentation
    await pptx.writeFile({ fileName: `${deckTitle || 'presentation'}.pptx` });
    onSuccess?.('PowerPoint exported successfully');

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to export PowerPoint';
    onError?.(errorMessage);
    throw error;
  }
};

export const exportToImages = async (options: ExportOptions): Promise<void> => {
  const { deckTitle, onProgress, onSuccess, onError } = options;

  try {
    await waitForContent();
    
    const slideElements = findSlideElements();
    
    if (slideElements.length === 0) {
      throw new Error('No slides found to export');
    }

    onProgress?.(0, slideElements.length);

    const images: string[] = [];

    for (let i = 0; i < slideElements.length; i++) {
      onProgress?.(i + 1, slideElements.length);
      
      const imageData = await captureSlide(slideElements[i], i);
      images.push(imageData);
    }

    // Create ZIP file with all images
    const JSZip = (await import('jszip')).default;
    const zip = new JSZip();
    const folder = zip.folder(deckTitle || 'presentation');

    images.forEach((imageData, index) => {
      const base64Data = imageData.split(',')[1];
      folder?.file(`slide-${index + 1}.png`, base64Data, { base64: true });
    });

    const content = await zip.generateAsync({ type: 'blob' });
    
    // Download ZIP file
    const url = URL.createObjectURL(content);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${deckTitle || 'presentation'}-slides.zip`;
    document.body.appendChild(link);
    link.click();
    
    URL.revokeObjectURL(url);
    document.body.removeChild(link);

    onSuccess?.('Images exported successfully');

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to export images';
    onError?.(errorMessage);
    throw error;
  }
};