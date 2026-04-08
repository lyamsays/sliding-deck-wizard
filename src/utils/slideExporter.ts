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

// PowerPoint dimensions: 10" x 5.625" (16:9)
const W = 10;
const H = 5.625;

// ─── PPTX EXPORT — matches StyledSlide preview exactly ───────────────────────
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

      const bg = slide.style?.backgroundColor || '#fdfaf5';
      const textColor = (slide.style?.textColor || '#111827').replace('#', '');
      const accentColor = (slide.style?.accentColor || '#7c3aed').replace('#', '');
      const solidBg = extractHexFromGradient(bg);
      const isTitle = slide.slideType === 'title' || i === 0;
      const hasImage = !!slide.imageUrl;
      const bullets = slide.bullets || [];

      // Background fill
      pSlide.background = { fill: solidBg };

      // ── Full-height left accent bar (matches CSS: absolute left-0 top-0 bottom-0 w-1.5)
      pSlide.addShape(pptx.ShapeType.rect, {
        x: 0, y: 0, w: 0.08, h: H,
        fill: { color: accentColor },
        line: { color: accentColor, transparency: 100 },
      });

      // ── Right-side image (matches CSS: absolute right-0 top-0 bottom-0 w-2/5)
      if (hasImage && slide.imageUrl?.startsWith('http')) {
        try {
          // Image occupies right 40%
          pSlide.addImage({
            path: slide.imageUrl,
            x: W * 0.6, y: 0, w: W * 0.4, h: H,
          });
          // Gradient overlay: left edge of image fades to background color
          pSlide.addShape(pptx.ShapeType.rect, {
            x: W * 0.6, y: 0, w: W * 0.08, h: H,
            fill: { color: solidBg, transparency: 0 },
            line: { color: solidBg, transparency: 100 },
          });
        } catch { /* skip if image fails */ }
      }

      // ── Content area (matches CSS: paddingLeft 6%, paddingRight 45% if image else 8%)
      const contentX = 0.45;  // 6% of 10" ≈ 0.45" (after accent bar)
      const contentW = hasImage ? W * 0.54 : W * 0.86;  // leave room for image

      if (isTitle) {
        // ── TITLE SLIDE LAYOUT ──────────────────────────────────
        // Eyebrow subtitle above main title
        if (slide.subtitle) {
          pSlide.addText(slide.subtitle.toUpperCase(), {
            x: contentX, y: H * 0.28, w: contentW, h: 0.4,
            fontSize: 9,
            bold: true,
            color: accentColor,
            fontFace: 'Calibri',
            charSpacing: 3,
          });
        }

        // Main title — large, left-aligned
        pSlide.addText(slide.title || '', {
          x: contentX, y: H * 0.38, w: contentW, h: H * 0.4,
          fontSize: 32,
          bold: true,
          color: textColor,
          fontFace: 'Calibri',
          valign: 'top',
          wrap: true,
        });

      } else {
        // ── CONTENT SLIDE LAYOUT ──────────────────────────────────
        // Title
        pSlide.addText(slide.title || '', {
          x: contentX, y: 0.35, w: contentW, h: 0.85,
          fontSize: 22,
          bold: true,
          color: textColor,
          fontFace: 'Calibri',
          valign: 'middle',
          wrap: true,
        });

        // Thin separator line under title
        pSlide.addShape(pptx.ShapeType.line, {
          x: contentX, y: 1.28, w: Math.min(contentW, 3.5), h: 0,
          line: { color: accentColor, width: 1.5, transparency: 60 },
        });

        // Bullets — one text box per bullet for clean layout
        const bulletStartY = 1.45;
        const bulletSpacing = Math.min((H - bulletStartY - 0.4) / Math.max(bullets.length, 1), 0.85);

        bullets.forEach((bullet, bi) => {
          const colonIdx = bullet.indexOf(':');
          const hasColon = colonIdx > 0 && colonIdx < 45;

          const textParts = hasColon
            ? [
                { text: bullet.substring(0, colonIdx), options: { bold: true, color: accentColor, fontSize: 13 } as any },
                { text: bullet.substring(colonIdx), options: { bold: false, color: textColor, fontSize: 13 } as any },
              ]
            : [{ text: bullet, options: { bold: false, color: textColor, fontSize: 13 } as any }];

          pSlide.addText([
            { text: '▸  ', options: { bold: true, color: accentColor, fontSize: 11 } as any },
            ...textParts,
          ], {
            x: contentX, y: bulletStartY + (bi * bulletSpacing),
            w: contentW, h: bulletSpacing * 0.92,
            fontFace: 'Calibri',
            valign: 'middle',
            wrap: true,
          });
        });
      }

      // ── Slide number (bottom-right, subtle)
      pSlide.addText(`${i + 1}`, {
        x: W - 0.6, y: H - 0.35, w: 0.5, h: 0.25,
        fontSize: 8,
        color: 'AAAAAA',
        fontFace: 'Calibri',
        align: 'right',
      });

      // ── Speaker notes
      if (slide.speakerNotes) {
        pSlide.addNotes(slide.speakerNotes);
      }
    }

    await pptx.writeFile({ fileName: `${deckTitle || 'presentation'}.pptx` });
    onSuccess?.(`PowerPoint downloaded — ${slides.length} slides with speaker notes`);

  } catch (error) {
    onError?.(error instanceof Error ? error.message : 'PowerPoint export failed');
    throw error;
  }
};

// ─── PDF EXPORT — screenshot-based (pixel-perfect match to browser preview) ──
export const exportToPDF = async (options: ExportOptions): Promise<void> => {
  const { deckTitle, onProgress, onSuccess, onError } = options;
  try {
    await new Promise<void>(r => document.fonts?.ready ? document.fonts.ready.then(() => setTimeout(r, 600)) : setTimeout(r, 1200));

    const slideEls = getSlideElements();
    const pdf = new jsPDF({ orientation: 'landscape', unit: 'pt', format: [1920, 1080] });
    const pw = pdf.internal.pageSize.getWidth();
    const ph = pdf.internal.pageSize.getHeight();

    for (let i = 0; i < slideEls.length; i++) {
      if (i > 0) pdf.addPage();
      onProgress?.(i + 1, slideEls.length);
      slideEls[i].scrollIntoView({ behavior: 'instant', block: 'center' });
      await delay(350);
      const canvas = await html2canvas(slideEls[i], {
        backgroundColor: null, scale: 2, useCORS: true, allowTaint: true,
        width: slideEls[i].offsetWidth, height: slideEls[i].offsetHeight,
        logging: false,
      });
      pdf.addImage(canvas.toDataURL('image/png', 0.95), 'PNG', 0, 0, pw, ph, '', 'FAST');
    }

    pdf.save(`${deckTitle || 'presentation'}.pdf`);
    onSuccess?.('PDF downloaded');
  } catch (error) {
    onError?.(error instanceof Error ? error.message : 'PDF export failed');
    throw error;
  }
};

// ─── IMAGES ZIP EXPORT ────────────────────────────────────────────────────────
export const exportToImages = async (options: ExportOptions): Promise<void> => {
  const { deckTitle, onProgress, onSuccess, onError } = options;
  try {
    await delay(800);
    const slideEls = getSlideElements();
    const JSZip = (await import('jszip')).default;
    const zip = new JSZip();
    const folder = zip.folder(deckTitle || 'slides');

    for (let i = 0; i < slideEls.length; i++) {
      onProgress?.(i + 1, slideEls.length);
      slideEls[i].scrollIntoView({ behavior: 'instant', block: 'center' });
      await delay(350);
      const canvas = await html2canvas(slideEls[i], {
        backgroundColor: null, scale: 2, useCORS: true, allowTaint: true, logging: false,
      });
      folder?.file(`slide-${String(i + 1).padStart(2, '0')}.png`, canvas.toDataURL('image/png').split(',')[1], { base64: true });
    }

    const blob = await zip.generateAsync({ type: 'blob' });
    const url = URL.createObjectURL(blob);
    const a = Object.assign(document.createElement('a'), { href: url, download: `${deckTitle || 'slides'}.zip` });
    document.body.appendChild(a); a.click();
    URL.revokeObjectURL(url); document.body.removeChild(a);

    onSuccess?.(`${slideEls.length} slide images downloaded as ZIP`);
  } catch (error) {
    onError?.(error instanceof Error ? error.message : 'Image export failed');
    throw error;
  }
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function getSlideElements(): HTMLElement[] {
  const byId = document.querySelectorAll('[id^="slide-content-"]') as NodeListOf<HTMLElement>;
  if (byId.length > 0) return Array.from(byId).filter(el => el.offsetHeight > 0);
  throw new Error('No slides found. Please ensure slides are visible before exporting.');
}

function extractHexFromGradient(bg: string): string {
  // Try to extract hex from the background string
  const matches = bg.match(/#([0-9a-fA-F]{6})/g);
  if (matches && matches.length > 0) {
    // For gradients, use the middle color if available, otherwise first
    const mid = matches[Math.floor(matches.length / 2)];
    return mid.replace('#', '');
  }
  return 'FFFFFF';
}

function delay(ms: number): Promise<void> {
  return new Promise(r => setTimeout(r, ms));
}
