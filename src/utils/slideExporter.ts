import PptxGenJs from 'pptxgenjs';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { Slide } from '@/types/deck';

export interface ExportOptions {
  deckTitle: string;
  slides: Slide[];
  onProgress?: (current: number, total: number) => void;
  onSuccess?: (message: string) => void;
  onError?: (error: string) => void;
}

// ─── NATIVE PPTX EXPORT (no screenshots — real editable PowerPoint) ───────────
export const exportToPowerPoint = async (options: ExportOptions): Promise<void> => {
  const { deckTitle, slides, onProgress, onSuccess, onError } = options;

  try {
    const pptx = new PptxGenJs();
    pptx.layout = 'LAYOUT_16x9';
    pptx.title = deckTitle || 'Sliding Presentation';
    pptx.author = 'Sliding.io';

    for (let i = 0; i < slides.length; i++) {
      onProgress?.(i + 1, slides.length);
      const slide = slides[i];
      const pSlide = pptx.addSlide();

      // ── Background ────────────────────────────────────────────
      const bg = slide.style?.backgroundColor || '#FFFFFF';
      const isDark = bg.includes('gradient') ||
        bg === '#0d1b2a' || bg === '#111111' || bg === '#0f2318' ||
        bg.startsWith('#0') || bg.startsWith('#1');

      const textColor = slide.style?.textColor || (isDark ? '#FFFFFF' : '#111827');
      const accentColor = slide.style?.accentColor || '#7C3AED';

      // Solid background (gradients are converted to their start color)
      const solidBg = bg.startsWith('#') ? bg : extractHexFromGradient(bg);
      pSlide.background = { fill: solidBg.replace('#', '') };

      // ── Background image (if available) ──────────────────────
      if (slide.imageUrl && slide.imageUrl.startsWith('http')) {
        try {
          pSlide.addImage({
            path: slide.imageUrl,
            x: '55%', y: 0, w: '45%', h: '100%',
          });
          // Overlay for readability
          pSlide.addShape(pptx.ShapeType.rect, {
            x: '55%', y: 0, w: '45%', h: '100%',
            fill: { color: solidBg.replace('#', ''), transparency: 20 },
            line: { color: 'FFFFFF', transparency: 100 },
          });
        } catch {
          // Image failed to load — skip silently
        }
      }

      // ── Accent bar ────────────────────────────────────────────
      pSlide.addShape(pptx.ShapeType.rect, {
        x: 0.3, y: 1.1, w: 0.05, h: 0.5,
        fill: { color: accentColor.replace('#', '') },
        line: { color: accentColor.replace('#', ''), transparency: 100 },
      });

      // ── Title ─────────────────────────────────────────────────
      const isTitle = slide.slideType === 'title' || i === 0;
      pSlide.addText(slide.title || '', {
        x: isTitle ? '10%' : 0.5,
        y: isTitle ? '30%' : 0.35,
        w: slide.imageUrl ? '52%' : (isTitle ? '80%' : '90%'),
        h: isTitle ? 1.5 : 0.75,
        fontSize: isTitle ? 36 : 26,
        bold: true,
        color: textColor.replace('#', ''),
        fontFace: 'Calibri',
        align: isTitle ? 'center' : 'left',
        valign: 'middle',
        wrap: true,
      });

      // ── Subtitle (title slides) ───────────────────────────────
      if (isTitle && slide.subtitle) {
        pSlide.addText(slide.subtitle, {
          x: '10%', y: '55%', w: '80%', h: 0.5,
          fontSize: 16,
          color: accentColor.replace('#', ''),
          fontFace: 'Calibri',
          align: 'center',
          italic: true,
        });
      }

      // ── Bullets ───────────────────────────────────────────────
      const bullets = slide.bullets || [];
      if (bullets.length > 0 && !isTitle) {
        const bulletY = 1.25;
        const availableH = slide.imageUrl ? 3.5 : 4.5;
        const bulletH = availableH / Math.max(bullets.length, 1);

        bullets.forEach((bullet, bi) => {
          pSlide.addText([
            { text: '• ', options: { color: accentColor.replace('#', ''), bold: true, fontSize: 14 } },
            { text: bullet, options: { color: textColor.replace('#', ''), fontSize: 14 } },
          ], {
            x: 0.5,
            y: bulletY + (bi * bulletH),
            w: slide.imageUrl ? '52%' : '90%',
            h: bulletH * 0.9,
            fontFace: 'Calibri',
            valign: 'middle',
            wrap: true,
          });
        });
      }

      // ── Speaker notes ─────────────────────────────────────────
      if (slide.speakerNotes) {
        pSlide.addNotes(slide.speakerNotes);
      }

      // ── Slide number ──────────────────────────────────────────
      pSlide.addText(`${i + 1} / ${slides.length}`, {
        x: '88%', y: '93%', w: '10%', h: 0.25,
        fontSize: 9,
        color: isDark ? 'AAAAAA' : '999999',
        fontFace: 'Calibri',
        align: 'right',
      });
    }

    await pptx.writeFile({ fileName: `${deckTitle || 'presentation'}.pptx` });
    onSuccess?.(`PowerPoint exported — ${slides.length} slides`);

  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Failed to export PowerPoint';
    onError?.(msg);
    throw error;
  }
};

// ─── PDF EXPORT (screenshot-based, reliable) ─────────────────────────────────
const waitForContent = () =>
  new Promise<void>(resolve => {
    if (document.fonts?.ready) {
      document.fonts.ready.then(() => setTimeout(resolve, 500));
    } else {
      setTimeout(resolve, 1000);
    }
  });

const findSlideElements = (): HTMLElement[] => {
  let els = document.querySelectorAll('[id^="slide-content-"]') as NodeListOf<HTMLElement>;
  if (els.length > 0) return Array.from(els).filter(el => el.offsetHeight > 0);

  const containers = document.querySelectorAll('[id^="slide-"]') as NodeListOf<HTMLElement>;
  const found: HTMLElement[] = [];
  containers.forEach(c => {
    const inner = c.querySelector('[id^="slide-content-"]') as HTMLElement;
    if (inner) found.push(inner);
  });
  if (found.length > 0) return found;

  throw new Error('No slides found. Please ensure slides are visible and fully loaded.');
};

export const exportToPDF = async (options: ExportOptions): Promise<void> => {
  const { deckTitle, onProgress, onSuccess, onError } = options;
  try {
    await waitForContent();
    await new Promise(r => setTimeout(r, 1500));

    const slideElements = findSlideElements();
    if (slideElements.length === 0) throw new Error('No slides found to export.');

    onProgress?.(0, slideElements.length);

    const pdf = new jsPDF({ orientation: 'landscape', unit: 'pt', format: [1920, 1080] });
    const pw = pdf.internal.pageSize.getWidth();
    const ph = pdf.internal.pageSize.getHeight();

    for (let i = 0; i < slideElements.length; i++) {
      if (i > 0) pdf.addPage();
      onProgress?.(i + 1, slideElements.length);
      slideElements[i].scrollIntoView({ behavior: 'instant', block: 'center' });
      await new Promise(r => setTimeout(r, 400));
      const canvas = await html2canvas(slideElements[i], {
        backgroundColor: null, scale: 1, useCORS: true, allowTaint: true,
        width: slideElements[i].offsetWidth, height: slideElements[i].offsetHeight,
      });
      pdf.addImage(canvas.toDataURL('image/png', 0.95), 'PNG', 0, 0, pw, ph, '', 'FAST');
    }

    pdf.save(`${deckTitle || 'presentation'}.pdf`);
    onSuccess?.('PDF exported successfully');
  } catch (error) {
    onError?.(error instanceof Error ? error.message : 'Failed to export PDF');
    throw error;
  }
};

export const exportToImages = async (options: ExportOptions): Promise<void> => {
  const { deckTitle, onProgress, onSuccess, onError } = options;
  try {
    await waitForContent();
    const slideElements = findSlideElements();
    onProgress?.(0, slideElements.length);

    const JSZip = (await import('jszip')).default;
    const zip = new JSZip();
    const folder = zip.folder(deckTitle || 'presentation');

    for (let i = 0; i < slideElements.length; i++) {
      onProgress?.(i + 1, slideElements.length);
      slideElements[i].scrollIntoView({ behavior: 'instant', block: 'center' });
      await new Promise(r => setTimeout(r, 400));
      const canvas = await html2canvas(slideElements[i], {
        backgroundColor: null, scale: 2, useCORS: true, allowTaint: true,
      });
      const b64 = canvas.toDataURL('image/png').split(',')[1];
      folder?.file(`slide-${i + 1}.png`, b64, { base64: true });
    }

    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `${deckTitle || 'presentation'}-slides.zip`;
    document.body.appendChild(a); a.click();
    URL.revokeObjectURL(url); document.body.removeChild(a);

    onSuccess?.('Images exported successfully');
  } catch (error) {
    onError?.(error instanceof Error ? error.message : 'Failed to export images');
    throw error;
  }
};

// ─── Helper ───────────────────────────────────────────────────────────────────
function extractHexFromGradient(gradient: string): string {
  const match = gradient.match(/#([0-9a-fA-F]{6}|[0-9a-fA-F]{3})/);
  return match ? match[0] : '#1a1a2e';
}
