import React, { useState } from 'react';
import { Slide } from '@/types/deck';
import { Pencil } from 'lucide-react';
import SlideEditDialog from './SlideEditDialog';

interface StyledSlideProps {
  slide: Slide;
  index: number;
  onSlideUpdate: (index: number, updatedSlide: Slide) => void;
  onRemoveImage?: () => void;
}

const StyledSlide: React.FC<StyledSlideProps> = ({ slide, index, onSlideUpdate }) => {
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);

  const bg       = slide.style?.backgroundColor || '#1e1b4b';
  const text     = slide.style?.textColor       || '#ffffff';
  const accent   = slide.style?.accentColor     || '#7c3aed';
  const tfont    = slide.style?.titleFont        || '"Inter", sans-serif';
  const bfont    = slide.style?.bodyFont         || '"Inter", sans-serif';
  const layout   = slide.style?.layout          || 'right-image';
  const bullets  = slide.bullets || [];
  const isTitle  = slide.slideType === 'title' || index === 0;
  const hasImage = !!slide.imageUrl;

  const bgStyle = bg.includes('gradient') || bg.includes('linear') || bg.includes('radial')
    ? { background: bg } : { backgroundColor: bg };

  // ── Bullet renderer (shared) ───────────────────────────────────────────────
  const renderBullets = (fontSize = '1.55vw', gap = '1.1vh') => (
    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column' as const, gap }}>
      {bullets.map((b, i) => {
        const ci = b.indexOf(':');
        const hc = ci > 0 && ci < 45;
        return (
          <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6%', color: text, fontSize, lineHeight: 1.45 }}>
            <span style={{ color: accent, fontWeight: 700, flexShrink: 0, marginTop: '0.12em' }}>▸</span>
            <span>{hc
              ? <><strong style={{ color: accent }}>{b.substring(0, ci)}</strong>{b.substring(ci)}</>
              : b}
            </span>
          </li>
        );
      })}
    </ul>
  );

  // ── Title renderer ─────────────────────────────────────────────────────────
  const renderTitle = (size: string, mb = '4%') => (
    <h2 style={{ color: text, fontFamily: tfont, fontWeight: 800, fontSize: size, lineHeight: 1.1, letterSpacing: '-0.02em', marginBottom: bullets.length ? mb : 0, margin: 0, marginBottom: bullets.length ? mb : 0 }}>
      {slide.title}
    </h2>
  );

  const renderEyebrow = () => slide.subtitle
    ? <div style={{ color: accent, fontSize: '1vw', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' as const, marginBottom: '3%', opacity: 0.85 }}>{slide.subtitle}</div>
    : null;

  // ── LAYOUT: title-focus ────────────────────────────────────────────────────
  // Large centred title + subtitle eyebrow. Image as soft right panel if present.
  if (isTitle || layout === 'title-focus') {
    return (
      <>
        <div id={`slide-content-${index}`} className="relative overflow-hidden rounded-xl"
          style={{ ...bgStyle, aspectRatio: '16/9', width: '100%', fontFamily: bfont }}
          onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
          <div className="absolute left-0 top-0 bottom-0 w-1.5" style={{ backgroundColor: accent }} />
          {hasImage && (
            <div className="absolute right-0 top-0 bottom-0" style={{ width: '38%' }}>
              <img src={slide.imageUrl} alt="" className="w-full h-full object-cover" crossOrigin="anonymous" />
              <div className="absolute inset-0" style={{ background: `linear-gradient(to right, ${bg.startsWith('#') ? bg : '#0d1b2a'} 0%, transparent 55%)` }} />
            </div>
          )}
          <div className="absolute inset-0 flex flex-col justify-center"
            style={{ padding: '8% 8% 8% 6%', paddingRight: hasImage ? '44%' : '8%' }}>
            {renderEyebrow()}
            <h1 style={{ color: text, fontFamily: tfont, fontWeight: 800, fontSize: 'clamp(20px, 4.2vw, 52px)', lineHeight: 1.1, letterSpacing: '-0.025em', margin: 0 }}>{slide.title}</h1>
          </div>
          <SlideNum index={index} text={text} />
          {isHovering && <EditBtn onClick={() => setIsEditOpen(true)} />}
        </div>
        <EditDialog slide={slide} open={isEditOpen} onClose={() => setIsEditOpen(false)} onSave={s => { onSlideUpdate(index, s); setIsEditOpen(false); }} />
      </>
    );
  }

  // ── LAYOUT: text-only ─────────────────────────────────────────────────────
  // Full-width layout, no image panel. Larger text. Good for data/concept slides.
  if (layout === 'text-only' || !hasImage) {
    return (
      <>
        <div id={`slide-content-${index}`} className="relative overflow-hidden rounded-xl"
          style={{ ...bgStyle, aspectRatio: '16/9', width: '100%', fontFamily: bfont }}
          onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
          <div className="absolute left-0 top-0 bottom-0 w-1.5" style={{ backgroundColor: accent }} />
          {/* Subtle accent shape top-right */}
          <div className="absolute top-0 right-0 w-32 h-32 rounded-bl-full opacity-10" style={{ backgroundColor: accent }} />
          <div className="absolute inset-0 flex flex-col justify-center" style={{ padding: '7% 10% 7% 6%' }}>
            {renderEyebrow()}
            {renderTitle('clamp(15px, 2.4vw, 30px)', '5%')}
            {bullets.length > 0 && (
              <div style={{ marginTop: '4%' }}>
                <div style={{ width: '40px', height: '2px', backgroundColor: accent, marginBottom: '4%', opacity: 0.6 }} />
                {renderBullets('clamp(11px, 1.55vw, 18px)', '1.2vh')}
              </div>
            )}
          </div>
          <SlideNum index={index} text={text} />
          {isHovering && <EditBtn onClick={() => setIsEditOpen(true)} />}
        </div>
        <EditDialog slide={slide} open={isEditOpen} onClose={() => setIsEditOpen(false)} onSave={s => { onSlideUpdate(index, s); setIsEditOpen(false); }} />
      </>
    );
  }

  // ── LAYOUT: centered ──────────────────────────────────────────────────────
  // Centred text, no image. Perfect for quote / key-insight slides.
  if (layout === 'centered') {
    return (
      <>
        <div id={`slide-content-${index}`} className="relative overflow-hidden rounded-xl"
          style={{ ...bgStyle, aspectRatio: '16/9', width: '100%', fontFamily: bfont }}
          onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
          <div className="absolute left-0 top-0 bottom-0 w-1.5" style={{ backgroundColor: accent }} />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center" style={{ padding: '8% 12%' }}>
            <div style={{ width: '40px', height: '3px', backgroundColor: accent, marginBottom: '5%', opacity: 0.8 }} />
            <h2 style={{ color: text, fontFamily: tfont, fontWeight: 800, fontSize: 'clamp(16px, 2.6vw, 34px)', lineHeight: 1.2, letterSpacing: '-0.02em', margin: '0 0 5% 0' }}>{slide.title}</h2>
            {bullets.length > 0 && (
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '1.2vh', textAlign: 'left' }}>
                {bullets.map((b, i) => {
                  const ci = b.indexOf(':'); const hc = ci > 0 && ci < 45;
                  return (
                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.6%', color: text, fontSize: 'clamp(10px, 1.45vw, 17px)', lineHeight: 1.45 }}>
                      <span style={{ color: accent, fontWeight: 700, flexShrink: 0 }}>▸</span>
                      <span>{hc ? <><strong style={{ color: accent }}>{b.substring(0, ci)}</strong>{b.substring(ci)}</> : b}</span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
          <SlideNum index={index} text={text} />
          {isHovering && <EditBtn onClick={() => setIsEditOpen(true)} />}
        </div>
        <EditDialog slide={slide} open={isEditOpen} onClose={() => setIsEditOpen(false)} onSave={s => { onSlideUpdate(index, s); setIsEditOpen(false); }} />
      </>
    );
  }

  // ── LAYOUT: full-bleed ────────────────────────────────────────────────────
  // Image fills entire slide. Text overlaid bottom-left on dark gradient.
  if (layout === 'full-bleed' && hasImage) {
    return (
      <>
        <div id={`slide-content-${index}`} className="relative overflow-hidden rounded-xl"
          style={{ aspectRatio: '16/9', width: '100%', fontFamily: bfont }}
          onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
          <img src={slide.imageUrl} alt="" className="absolute inset-0 w-full h-full object-cover" crossOrigin="anonymous" />
          {/* Dark gradient bottom two-thirds */}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.45) 50%, rgba(0,0,0,0.0) 100%)' }} />
          <div className="absolute left-0 top-0 bottom-0 w-1.5" style={{ backgroundColor: accent }} />
          <div className="absolute bottom-0 left-0 right-0" style={{ padding: '5% 8% 6% 6%' }}>
            <h2 style={{ color: '#fff', fontFamily: tfont, fontWeight: 800, fontSize: 'clamp(14px, 2.2vw, 28px)', lineHeight: 1.2, letterSpacing: '-0.02em', marginBottom: bullets.length ? '3%' : 0 }}>{slide.title}</h2>
            {bullets.length > 0 && renderBullets('clamp(10px, 1.3vw, 16px)', '0.8vh')}
          </div>
          <SlideNum index={index} text="#ffffff" />
          {isHovering && <EditBtn onClick={() => setIsEditOpen(true)} />}
        </div>
        <EditDialog slide={slide} open={isEditOpen} onClose={() => setIsEditOpen(false)} onSave={s => { onSlideUpdate(index, s); setIsEditOpen(false); }} />
      </>
    );
  }

  // ── LAYOUT: left-image ────────────────────────────────────────────────────
  // Image on left 40%, text on right.
  if (layout === 'left-image' && hasImage) {
    return (
      <>
        <div id={`slide-content-${index}`} className="relative overflow-hidden rounded-xl"
          style={{ ...bgStyle, aspectRatio: '16/9', width: '100%', fontFamily: bfont }}
          onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
          {/* Image left 40% */}
          <div className="absolute left-0 top-0 bottom-0" style={{ width: '40%' }}>
            <img src={slide.imageUrl} alt="" className="w-full h-full object-cover" crossOrigin="anonymous" />
            <div className="absolute inset-0" style={{ background: `linear-gradient(to left, ${bg.startsWith('#') ? bg : '#0d1b2a'} 0%, transparent 55%)` }} />
          </div>
          {/* Accent bar on right edge of image */}
          <div className="absolute top-0 bottom-0" style={{ left: '39.5%', width: '3px', backgroundColor: accent, opacity: 0.8 }} />
          <div className="absolute inset-0 flex flex-col justify-center" style={{ padding: '7% 6% 7% 46%' }}>
            {renderEyebrow()}
            {renderTitle('clamp(14px, 2.2vw, 28px)', '5%')}
            {bullets.length > 0 && (
              <>
                <div style={{ width: '36px', height: '2px', backgroundColor: accent, marginBottom: '4%', opacity: 0.6 }} />
                {renderBullets()}
              </>
            )}
          </div>
          <SlideNum index={index} text={text} />
          {isHovering && <EditBtn onClick={() => setIsEditOpen(true)} />}
        </div>
        <EditDialog slide={slide} open={isEditOpen} onClose={() => setIsEditOpen(false)} onSave={s => { onSlideUpdate(index, s); setIsEditOpen(false); }} />
      </>
    );
  }

  // ── LAYOUT: right-image (default) ─────────────────────────────────────────
  // Image on right 40%, text on left.
  return (
    <>
      <div id={`slide-content-${index}`} className="relative overflow-hidden rounded-xl"
        style={{ ...bgStyle, aspectRatio: '16/9', width: '100%', fontFamily: bfont }}
        onMouseEnter={() => setIsHovering(true)} onMouseLeave={() => setIsHovering(false)}>
        <div className="absolute left-0 top-0 bottom-0 w-1.5" style={{ backgroundColor: accent }} />
        {hasImage && (
          <div className="absolute right-0 top-0 bottom-0" style={{ width: '40%' }}>
            <img src={slide.imageUrl} alt="" className="w-full h-full object-cover" crossOrigin="anonymous" />
            <div className="absolute inset-0" style={{ background: `linear-gradient(to right, ${bg.startsWith('#') ? bg : '#0d1b2a'} 0%, transparent 50%)` }} />
          </div>
        )}
        <div className="absolute inset-0 flex flex-col justify-center"
          style={{ padding: '7% 8% 7% 6%', paddingRight: hasImage ? '44%' : '8%' }}>
          {renderEyebrow()}
          {renderTitle('clamp(14px, 2.2vw, 28px)', '5%')}
          {bullets.length > 0 && (
            <>
              <div style={{ width: '36px', height: '2px', backgroundColor: accent, marginBottom: '4%', opacity: 0.6 }} />
              {renderBullets()}
            </>
          )}
        </div>
        <SlideNum index={index} text={text} />
        {isHovering && <EditBtn onClick={() => setIsEditOpen(true)} />}
      </div>
      <EditDialog slide={slide} open={isEditOpen} onClose={() => setIsEditOpen(false)} onSave={s => { onSlideUpdate(index, s); setIsEditOpen(false); }} />
    </>
  );
};

// ── Shared sub-components ─────────────────────────────────────────────────────
const SlideNum = ({ index, text }: { index: number; text: string }) => (
  <div className="absolute bottom-2 right-3 font-mono" style={{ color: text, opacity: 0.35, fontSize: 'clamp(8px, 0.9vw, 12px)' }}>
    {index + 1}
  </div>
);

const EditBtn = ({ onClick }: { onClick: () => void }) => (
  <button onClick={onClick}
    className="absolute top-2.5 right-2.5 p-1.5 rounded-lg transition-colors z-20"
    style={{ backgroundColor: 'rgba(0,0,0,0.45)' }}>
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  </button>
);

const EditDialog = ({ slide, open, onClose, onSave }: any) => {
  if (!open) return null;
  const SlideEditDialog = require('./SlideEditDialog').default;
  return <SlideEditDialog slide={slide} open={open} onOpenChange={(v: boolean) => { if (!v) onClose(); }} onSlideUpdate={onSave} />;
};

export default StyledSlide;
