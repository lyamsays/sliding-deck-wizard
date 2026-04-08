import React from 'react';
import { themes } from '@/components/themes/theme-data';
import { Slide } from '@/types/deck';
import { Check } from 'lucide-react';

interface ThemeSwitcherProps {
  slides: Slide[];
  currentThemeId: string;
  onThemeChange: (newSlides: Slide[], themeId: string) => void;
  onClose: () => void;
}

const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({ slides, currentThemeId, onThemeChange, onClose }) => {
  const applyTheme = (themeId: string) => {
    const theme = themes.find(t => t.id === themeId) || themes[0];
    const updated = slides.map(slide => ({
      ...slide,
      style: {
        ...slide.style,
        backgroundColor: theme.background,
        textColor: theme.textColor,
        accentColor: theme.accentColor,
        titleFont: theme.titleFont,
        bodyFont: theme.bodyFont,
        cardDesign: theme.cardDesign,
        colorScheme: theme.id,
      }
    }));
    onThemeChange(updated, themeId);
    onClose();
  };

  // Educator themes first
  const sorted = [
    ...themes.filter(t => t.categories.includes('educator')),
    ...themes.filter(t => !t.categories.includes('educator')),
  ];

  return (
    <div className="absolute top-full right-0 mt-2 z-50 rounded-xl border border-border bg-background shadow-xl p-4" style={{ width: '360px' }}>
      <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">Switch Theme</div>
      <div className="grid grid-cols-3 gap-2 max-h-80 overflow-y-auto pr-1">
        {sorted.map(theme => {
          const bg = theme.background;
          const bs = bg.includes('gradient') ? { background: bg } : { backgroundColor: bg };
          const isActive = theme.id === currentThemeId;
          return (
            <button
              key={theme.id}
              onClick={() => applyTheme(theme.id)}
              className="relative rounded-lg overflow-hidden text-left transition-transform hover:scale-[1.04]"
              style={{ border: isActive ? `2px solid ${theme.accentColor}` : '1.5px solid transparent', outline: 'none' }}
            >
              {/* Mini slide preview */}
              <div className="relative" style={{ ...bs, aspectRatio: '16/9' }}>
                <div className="absolute left-0 top-0 bottom-0 w-0.5" style={{ backgroundColor: theme.accentColor }} />
                <div className="absolute inset-0 flex flex-col justify-center" style={{ padding: '12% 10% 10% 8%' }}>
                  <div style={{ color: theme.textColor, fontSize: '5.5px', fontWeight: 700, lineHeight: 1.2, fontFamily: theme.titleFont, marginBottom: '4px' }}>
                    {theme.name}
                  </div>
                  <div style={{ color: theme.textColor, fontSize: '4.5px', opacity: 0.7, lineHeight: 1.4 }}>
                    <div style={{ display: 'flex', gap: '2px', alignItems: 'center' }}>
                      <span style={{ color: theme.accentColor }}>▸</span> Lecture content here
                    </div>
                    <div style={{ display: 'flex', gap: '2px', alignItems: 'center', marginTop: '2px' }}>
                      <span style={{ color: theme.accentColor }}>▸</span> Evidence-based slides
                    </div>
                  </div>
                </div>
                {isActive && (
                  <div className="absolute top-1 right-1 rounded-full flex items-center justify-center" style={{ width: '12px', height: '12px', backgroundColor: theme.accentColor }}>
                    <Check style={{ width: '7px', height: '7px', color: '#fff' }} />
                  </div>
                )}
              </div>
              <div className="text-center py-0.5" style={{ fontSize: '8px', fontWeight: 600, backgroundColor: 'rgba(0,0,0,0.06)', color: 'var(--color-text-secondary)' }}>
                {theme.name}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default ThemeSwitcher;
