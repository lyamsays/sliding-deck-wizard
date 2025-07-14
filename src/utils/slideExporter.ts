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
  console.log(`Attempting to capture slide ${index}:`, slideElement);
  
  // Scroll the element into view and ensure it's visible
  slideElement.scrollIntoView({ behavior: 'instant', block: 'center' });
  
  // Wait longer for content to stabilize
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Temporarily hide hover elements and buttons
  const actionButtons = slideElement.querySelectorAll('.slide-ui-elements-not-for-export');
  actionButtons.forEach(el => {
    (el as HTMLElement).style.display = 'none';
  });

  // Log slide dimensions and styles before capture
  const computedStyle = window.getComputedStyle(slideElement);
  console.log(`Slide ${index} dimensions:`, {
    width: slideElement.offsetWidth,
    height: slideElement.offsetHeight,
    background: computedStyle.background,
    backgroundColor: computedStyle.backgroundColor,
    backgroundImage: computedStyle.backgroundImage
  });

  try {
    const canvas = await html2canvas(slideElement, {
      backgroundColor: null, // Let the slide's own background show through
      scale: 1, // Reduce scale to avoid memory issues
      useCORS: true,
      allowTaint: true,
      foreignObjectRendering: false, // Disable to avoid SVG issues
      logging: true, // Enable logging to debug
      width: slideElement.offsetWidth,
      height: slideElement.offsetHeight,
      windowWidth: window.innerWidth,
      windowHeight: window.innerHeight,
      scrollX: 0,
      scrollY: 0,
      ignoreElements: (element) => {
        // Ignore overlay elements that shouldn't be in export
        return element.classList.contains('slide-ui-elements-not-for-export');
      },
      onclone: (clonedDoc, clonedElement) => {
        console.log(`Cloning slide ${index}`, clonedElement);
        
        // Find the cloned slide element
        const clonedSlide = clonedDoc.getElementById(`slide-content-${index}`);
        if (clonedSlide && slideElement) {
          console.log('Found cloned slide, applying styles...');
          
          // Copy ALL computed styles more aggressively
          const originalStyles = window.getComputedStyle(slideElement);
          
          // Apply background styles directly
          clonedSlide.style.background = originalStyles.background;
          clonedSlide.style.backgroundImage = originalStyles.backgroundImage;
          clonedSlide.style.backgroundColor = originalStyles.backgroundColor;
          clonedSlide.style.backgroundSize = originalStyles.backgroundSize;
          clonedSlide.style.backgroundPosition = originalStyles.backgroundPosition;
          clonedSlide.style.backgroundRepeat = originalStyles.backgroundRepeat;
          
          // Force minimum dimensions
          clonedSlide.style.minHeight = '400px';
          clonedSlide.style.width = '100%';
          clonedSlide.style.height = '100%';
          
          // Apply all styles to all child elements
          const walkElements = (original: Element, cloned: Element) => {
            const originalEl = original as HTMLElement;
            const clonedEl = cloned as HTMLElement;
            
            if (originalEl && clonedEl) {
              const styles = window.getComputedStyle(originalEl);
              
              // Copy essential styles
              clonedEl.style.color = styles.color;
              clonedEl.style.fontFamily = styles.fontFamily;
              clonedEl.style.fontSize = styles.fontSize;
              clonedEl.style.fontWeight = styles.fontWeight;
              clonedEl.style.lineHeight = styles.lineHeight;
              clonedEl.style.textAlign = styles.textAlign;
              clonedEl.style.padding = styles.padding;
              clonedEl.style.margin = styles.margin;
              clonedEl.style.background = styles.background;
              clonedEl.style.backgroundColor = styles.backgroundColor;
              clonedEl.style.border = styles.border;
              clonedEl.style.borderRadius = styles.borderRadius;
              clonedEl.style.display = styles.display;
              clonedEl.style.flexDirection = styles.flexDirection;
              clonedEl.style.justifyContent = styles.justifyContent;
              clonedEl.style.alignItems = styles.alignItems;
              clonedEl.style.position = styles.position;
              clonedEl.style.width = styles.width;
              clonedEl.style.height = styles.height;
            }
            
            // Process children
            for (let i = 0; i < original.children.length && i < cloned.children.length; i++) {
              walkElements(original.children[i], cloned.children[i]);
            }
          };
          
          walkElements(slideElement, clonedSlide);
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

// Find all slide elements with improved detection
const findSlideElements = (): HTMLElement[] => {
  console.log('Starting slide detection...');
  
  // Wait a moment for slides to fully render
  const slideContainer = document.querySelector('#slides-grid-container, .slides-container');
  if (slideContainer) {
    console.log('Found slide container:', slideContainer);
  }
  
  // Strategy 1: Look for slide-content elements specifically
  let elements = document.querySelectorAll('[id^="slide-content-"]') as NodeListOf<HTMLElement>;
  if (elements.length > 0) {
    console.log(`Found ${elements.length} slides using slide-content IDs`);
    return Array.from(elements).filter(el => {
      // Ensure the element is visible and has content
      const rect = el.getBoundingClientRect();
      const hasContent = el.offsetHeight > 0 && el.offsetWidth > 0;
      console.log(`Slide ${el.id}:`, { width: rect.width, height: rect.height, hasContent });
      return hasContent;
    });
  }
  
  // Strategy 2: Look for slide containers and find their content
  const slideContainers = document.querySelectorAll('[id^="slide-"], .slide-container') as NodeListOf<HTMLElement>;
  if (slideContainers.length > 0) {
    console.log(`Found ${slideContainers.length} slide containers`);
    const slideContents: HTMLElement[] = [];
    
    slideContainers.forEach((container, index) => {
      // Look for the actual slide content within each container
      const contentElement = container.querySelector('[id^="slide-content-"]') as HTMLElement;
      if (contentElement) {
        slideContents.push(contentElement);
        console.log(`Found content in container ${index}:`, contentElement.id);
      }
    });
    
    if (slideContents.length > 0) {
      return slideContents;
    }
  }
  
  // Strategy 3: Look for StyledSlide component elements
  const styledSlides = document.querySelectorAll('.group.relative.overflow-hidden') as NodeListOf<HTMLElement>;
  if (styledSlides.length > 0) {
    console.log(`Found ${styledSlides.length} styled slide elements`);
    return Array.from(styledSlides).filter(el => {
      const hasSlideContent = el.offsetHeight > 200; // Slides should be reasonably tall
      return hasSlideContent;
    });
  }

  console.error('No slides found with any detection strategy');
  throw new Error('No slides found on the page. Please ensure slides are visible and fully loaded.');
};

export const exportToPDF = async (options: ExportOptions): Promise<void> => {
  const { deckTitle, onProgress, onSuccess, onError } = options;

  try {
    console.log('Starting PDF export...');
    await waitForContent();
    
    // Wait additional time for slides to fully load
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const slideElements = findSlideElements();
    console.log(`PDF Export: Found ${slideElements.length} slides to export`);
    
    if (slideElements.length === 0) {
      throw new Error('No slides found to export. Please ensure slides are visible and try again.');
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
    console.log('Starting PowerPoint export...');
    await waitForContent();
    
    // Wait additional time for slides to fully load
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const slideElements = findSlideElements();
    console.log(`PowerPoint Export: Found ${slideElements.length} slides to export`);
    
    if (slideElements.length === 0) {
      throw new Error('No slides found to export. Please ensure slides are visible and try again.');
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
    console.log('Starting Images export...');
    await waitForContent();
    
    // Wait additional time for slides to fully load
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const slideElements = findSlideElements();
    console.log(`Images Export: Found ${slideElements.length} slides to export`);
    
    if (slideElements.length === 0) {
      throw new Error('No slides found to export. Please ensure slides are visible and try again.');
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