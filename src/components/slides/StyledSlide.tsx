import React, { useState } from 'react';
import { Slide } from '@/types/deck';
import { Image, Pencil, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import SlideEditDialog from './SlideEditDialog';

interface StyledSlideProps {
  slide: Slide;
  index: number;
  onSlideUpdate: (index: number, updatedSlide: Slide) => void;
  onRemoveImage?: () => void;
}

const StyledSlide: React.FC<StyledSlideProps> = ({ slide, index, onSlideUpdate }) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const { toast } = useToast();

  const bg = slide.style?.backgroundColor || '#1e1b4b';
  const textColor = slide.style?.textColor || '#ffffff';
  const accentColor = slide.style?.accentColor || '#7c3aed';
  const titleFont = slide.style?.titleFont || '"Inter", sans-serif';
  const bodyFont = slide.style?.bodyFont || '"Inter", sans-serif';
  const isDark = textColor === '#ffffff' || textColor.startsWith('#f') || textColor.startsWith('#e');

  const isTitle = slide.slideType === 'title' || index === 0;
  const isQuote = slide.slideType === 'quote';
  const bullets = slide.bullets || [];

  // Determine if background is a gradient or solid
  const backgroundStyle = bg.includes('gradient') || bg.includes('linear') || bg.includes('radial')
    ? { background: bg }
    : { backgroundColor: bg };

  return (
    <>
      <div
        id={`slide-content-${index}`}
        className="relative overflow-hidden rounded-xl select-none"
        style={{
          ...backgroundStyle,
          aspectRatio: '16/9',
          width: '100%',
          fontFamily: bodyFont,
        }}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        {/* Accent bar — left edge */}
        <div
          className="absolute left-0 top-0 bottom-0 w-1.5"
          style={{ backgroundColor: accentColor }}
        />

        {/* Image — right half if present */}
        {slide.imageUrl && (
          <div className="absolute right-0 top-0 bottom-0 w-2/5">
            <img
              src={slide.imageUrl}
              alt={slide.title}
              className="w-full h-full object-cover"
              crossOrigin="anonymous"
            />
            {/* Gradient overlay for text readability */}
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(to right, ${bg.startsWith('#') ? bg : '#0d1b2a'} 0%, transparent 40%)`
              }}
            />
          </div>
        )}

        {/* Content */}
        <div
          className="absolute inset-0 flex flex-col justify-center"
          style={{
            padding: '8% 10%',
            paddingLeft: '6%',
            paddingRight: slide.imageUrl ? '45%' : '8%',
          }}
        >
          {/* Eyebrow label for title slides */}
          {isTitle && slide.subtitle && (
            <div
              className="text-xs font-semibold uppercase tracking-widest mb-3 opacity-70"
              style={{ color: accentColor, fontFamily: bodyFont }}
            >
              {slide.subtitle}
            </div>
          )}

          {/* Title */}
          <h2
            className="leading-tight mb-0"
            style={{
              color: textColor,
              fontFamily: titleFont,
              fontWeight: 700,
              fontSize: isTitle ? 'clamp(20px, 4vw, 36px)' : 'clamp(16px, 2.8vw, 26px)',
              marginBottom: bullets.length > 0 ? '6%' : 0,
              letterSpacing: isTitle ? '-0.02em' : '-0.01em',
            }}
          >
            {slide.title}
          </h2>

          {/* Quote style */}
          {isQuote && bullets.length > 0 && (
            <div style={{ marginTop: '4%' }}>
              <div
                className="text-4xl font-bold opacity-30 leading-none"
                style={{ color: accentColor, fontFamily: 'Georgia, serif' }}
              >
                "
              </div>
              <p
                className="italic leading-relaxed"
                style={{
                  color: textColor,
                  fontFamily: 'Georgia, serif',
                  fontSize: 'clamp(13px, 2vw, 18px)',
                  opacity: 0.95,
                }}
              >
                {bullets[0]}
              </p>
            </div>
          )}

          {/* Bullets */}
          {!isTitle && !isQuote && bullets.length > 0 && (
            <ul className="space-y-0" style={{ margin: 0, padding: 0, listStyle: 'none' }}>
              {bullets.map((bullet, bi) => {
                // Bold the first phrase before a colon if present
                const colonIdx = bullet.indexOf(':');
                const hasColon = colonIdx > 0 && colonIdx < 40;
                return (
                  <li
                    key={bi}
                    className="flex items-start"
                    style={{
                      marginBottom: 'clamp(6px, 1.2vw, 14px)',
                      fontSize: 'clamp(11px, 1.6vw, 15px)',
                      lineHeight: 1.5,
                      color: textColor,
                    }}
                  >
                    <span
                      className="flex-shrink-0 mr-3 mt-0.5 text-sm font-bold"
                      style={{ color: accentColor }}
                    >
                      ▸
                    </span>
                    <span>
                      {hasColon ? (
                        <>
                          <strong style={{ color: accentColor, fontWeight: 600 }}>
                            {bullet.substring(0, colonIdx)}
                          </strong>
                          <span style={{ opacity: 0.9 }}>{bullet.substring(colonIdx)}</span>
                        </>
                      ) : (
                        bullet
                      )}
                    </span>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Slide number */}
        <div
          className="absolute bottom-3 right-4 text-xs opacity-40 font-mono"
          style={{ color: textColor }}
        >
          {index + 1}
        </div>

        {/* Hover edit overlay */}
        {isHovering && (
          <div className="absolute top-3 right-3 flex gap-2 z-20">
            <button
              onClick={() => setIsEditDialogOpen(true)}
              className="p-1.5 rounded-lg bg-black/40 hover:bg-black/60 transition-colors"
            >
              <Pencil className="h-3.5 w-3.5 text-white" />
            </button>
          </div>
        )}
      </div>

      {isEditDialogOpen && (
        <SlideEditDialog
          slide={slide}
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onSlideUpdate={(updatedSlide) => {
            onSlideUpdate(index, updatedSlide);
            setIsEditDialogOpen(false);
          }}
        />
      )}
    </>
  );
};

export default StyledSlide;
