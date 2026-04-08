import React, { useState, useEffect, useCallback } from 'react';
import { Slide } from '@/types/deck';
import { X, ChevronLeft, ChevronRight, MessageSquare } from 'lucide-react';

interface PresentModeProps {
  slides: Slide[];
  startIndex?: number;
  onClose: () => void;
}

const PresentMode: React.FC<PresentModeProps> = ({ slides, startIndex = 0, onClose }) => {
  const [current, setCurrent] = useState(startIndex);
  const [showNotes, setShowNotes] = useState(false);
  const [showControls, setShowControls] = useState(true);

  const slide = slides[current];
  const bg = slide?.style?.backgroundColor || '#1e1b4b';
  const textColor = slide?.style?.textColor || '#ffffff';
  const accentColor = slide?.style?.accentColor || '#7c3aed';
  const titleFont = slide?.style?.titleFont || '"Inter", sans-serif';
  const bodyFont = slide?.style?.bodyFont || '"Inter", sans-serif';
  const bullets = slide?.bullets || [];
  const isTitle = slide?.slideType === 'title' || current === 0;
  const backgroundStyle = bg.includes('gradient') || bg.includes('linear')
    ? { background: bg } : { backgroundColor: bg };

  const prev = useCallback(() => setCurrent(c => Math.max(0, c - 1)), []);
  const next = useCallback(() => setCurrent(c => Math.min(slides.length - 1, c + 1)), [slides.length]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown' || e.key === ' ') { e.preventDefault(); next(); }
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') { e.preventDefault(); prev(); }
      if (e.key === 'n' || e.key === 'N') setShowNotes(s => !s);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [next, prev, onClose]);

  // Touch swipe support for mobile
  useEffect(() => {
    let startX = 0;
    const onTouchStart = (e: TouchEvent) => { startX = e.touches[0].clientX; };
    const onTouchEnd = (e: TouchEvent) => {
      const dx = e.changedTouches[0].clientX - startX;
      if (Math.abs(dx) > 50) dx < 0 ? next() : prev();
    };
    window.addEventListener('touchstart', onTouchStart, { passive: true });
    window.addEventListener('touchend', onTouchEnd, { passive: true });
    return () => { window.removeEventListener('touchstart', onTouchStart); window.removeEventListener('touchend', onTouchEnd); };
  }, [next, prev]);

  // Auto-hide controls
  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const show = () => { setShowControls(true); clearTimeout(t); t = setTimeout(() => setShowControls(false), 3000); };
    window.addEventListener('mousemove', show);
    t = setTimeout(() => setShowControls(false), 3000);
    return () => { window.removeEventListener('mousemove', show); clearTimeout(t); };
  }, []);

  const progress = ((current + 1) / slides.length) * 100;

  return (
    <div
      className="fixed inset-0 z-50 flex flex-col"
      style={{ backgroundColor: '#000' }}
      onClick={next}
    >
      {/* Slide area */}
      <div className="flex-1 flex items-center justify-center p-0">
        <div
          className="relative overflow-hidden"
          style={{
            ...backgroundStyle,
            width: `min(100vw, calc(${showNotes ? '70vh' : '100vh'} * 16 / 9))`,
            aspectRatio: '16/9',
            maxWidth: showNotes ? '70vw' : '100vw',
          }}
          onClick={e => e.stopPropagation()}
        >
          {/* Left accent bar */}
          <div className="absolute left-0 top-0 bottom-0 w-2" style={{ backgroundColor: accentColor }} />

          {/* Image */}
          {slide?.imageUrl && (
            <div className="absolute right-0 top-0 bottom-0" style={{ width: '40%' }}>
              <img src={slide.imageUrl} alt="" className="w-full h-full object-cover" crossOrigin="anonymous" />
              <div className="absolute inset-0" style={{ background: `linear-gradient(to right, ${bg.startsWith('#') ? bg : '#0d1b2a'} 0%, transparent 50%)` }} />
            </div>
          )}

          {/* Content */}
          <div
            className="absolute inset-0 flex flex-col justify-center"
            style={{ padding: '8% 10% 8% 6%', paddingRight: slide?.imageUrl ? '44%' : '8%', fontFamily: bodyFont }}
          >
            {isTitle && slide?.subtitle && (
              <div style={{ color: accentColor, fontSize: 'clamp(10px, 1.4vw, 18px)', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '3%', opacity: 0.85 }}>
                {slide.subtitle}
              </div>
            )}
            <h1 style={{ color: textColor, fontFamily: titleFont, fontWeight: 800, fontSize: isTitle ? 'clamp(24px, 5vw, 64px)' : 'clamp(18px, 3.5vw, 48px)', lineHeight: 1.1, marginBottom: bullets.length ? '5%' : 0, letterSpacing: '-0.02em' }}>
              {slide?.title}
            </h1>
            {!isTitle && bullets.length > 0 && (
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 'clamp(8px, 1.5vh, 20px)' }}>
                {bullets.map((b, i) => {
                  const ci = b.indexOf(':');
                  const hc = ci > 0 && ci < 45;
                  return (
                    <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '1.2%', fontSize: 'clamp(12px, 1.8vw, 24px)', color: textColor, lineHeight: 1.4 }}>
                      <span style={{ color: accentColor, fontWeight: 700, flexShrink: 0, marginTop: '0.1em' }}>▸</span>
                      <span>{hc ? <><strong style={{ color: accentColor }}>{b.substring(0, ci)}</strong>{b.substring(ci)}</> : b}</span>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>

          {/* Slide counter */}
          <div className="absolute bottom-3 right-4 font-mono" style={{ color: textColor, opacity: 0.4, fontSize: 'clamp(10px, 1.2vw, 16px)' }}>
            {current + 1} / {slides.length}
          </div>

          {/* Progress bar */}
          <div className="absolute bottom-0 left-0 right-0 h-1" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
            <div className="h-full transition-all duration-300" style={{ width: `${progress}%`, backgroundColor: accentColor }} />
          </div>
        </div>

        {/* Speaker notes panel */}
        {showNotes && slide?.speakerNotes && (
          <div
            className="flex-shrink-0 overflow-y-auto rounded-lg ml-4 hidden sm:block"
            style={{ width: '28vw', maxHeight: '80vh', backgroundColor: 'rgba(255,255,255,0.08)', padding: '20px', color: 'rgba(255,255,255,0.85)', fontSize: '14px', lineHeight: 1.7 }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', opacity: 0.5, marginBottom: '12px' }}>Speaker Notes</div>
            <p style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{slide.speakerNotes}</p>
          </div>
        )}
      </div>

      {/* Controls overlay — auto-hides */}
      <div className="absolute inset-0 pointer-events-none" style={{ opacity: showControls ? 1 : 0, transition: 'opacity 0.3s' }}>
        {/* Close */}
        <button
          className="absolute top-4 right-4 pointer-events-auto rounded-full p-2 transition-colors"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)', color: '#fff' }}
          onClick={e => { e.stopPropagation(); onClose(); }}
        >
          <X className="h-5 w-5" />
        </button>

        {/* Notes toggle */}
        <button
          className="absolute top-4 right-16 pointer-events-auto rounded-full p-2 transition-colors"
          style={{ backgroundColor: showNotes ? 'rgba(109,40,217,0.8)' : 'rgba(0,0,0,0.5)', color: '#fff' }}
          onClick={e => { e.stopPropagation(); setShowNotes(s => !s); }}
          title="Toggle speaker notes (N)"
        >
          <MessageSquare className="h-5 w-5" />
        </button>

        {/* Prev */}
        <button
          className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-auto rounded-full p-2"
          style={{ backgroundColor: 'rgba(0,0,0,0.4)', color: '#fff', opacity: current === 0 ? 0.2 : 1 }}
          onClick={e => { e.stopPropagation(); prev(); }}
          disabled={current === 0}
        >
          <ChevronLeft className="h-7 w-7" />
        </button>

        {/* Next */}
        <button
          className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-auto rounded-full p-2"
          style={{ backgroundColor: 'rgba(0,0,0,0.4)', color: '#fff', opacity: current === slides.length - 1 ? 0.2 : 1 }}
          onClick={e => { e.stopPropagation(); next(); }}
          disabled={current === slides.length - 1}
        >
          <ChevronRight className="h-7 w-7" />
        </button>

        {/* Keyboard hint — desktop only */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-none hidden sm:block" style={{ color: 'rgba(255,255,255,0.35)', fontSize: '12px', letterSpacing: '0.05em' }}>
          ← → navigate · N notes · Esc exit
        </div>
        {/* Mobile hint */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 pointer-events-none sm:hidden" style={{ color: 'rgba(255,255,255,0.35)', fontSize: '11px' }}>
          swipe to navigate · tap × to exit
        </div>
      </div>
    </div>
  );
};

export default PresentMode;
