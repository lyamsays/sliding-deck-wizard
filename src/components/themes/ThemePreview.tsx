
import React from 'react';
import { themes } from '@/components/themes/theme-data';
import { Palette } from 'lucide-react';

interface ThemePreviewProps {
  themeId: string;
}

const ThemePreview = ({ themeId }: ThemePreviewProps) => {
  // Find the selected theme from the themes data
  const theme = themes.find(t => t.id === themeId) || themes[0];

  return (
    <div className="mt-2 overflow-hidden transition-all bg-white rounded-md shadow-md">
      <div 
        className="h-36 w-full relative" 
        style={{ 
          background: theme.background,
          fontFamily: theme.titleFont
        }}
      >
        {/* Theme preview */}
        <div className="absolute inset-0 p-3 flex flex-col">
          {/* Title area */}
          <div 
            className="text-md font-bold mb-1"
            style={{ 
              color: theme.textColor,
              fontFamily: theme.titleFont
            }}
          >
            Sample Slide Title
          </div>
          
          {/* Content area with accent */}
          <div className="flex-1 flex gap-2">
            <div 
              className="w-1 h-full rounded-full"
              style={{ backgroundColor: theme.accentColor }}
            ></div>
            <div 
              className="text-xs"
              style={{ 
                color: theme.textColor,
                fontFamily: theme.bodyFont
              }}
            >
              • First bullet point<br />
              • Second bullet point
            </div>
          </div>
          
          {/* Card-like element in the preview */}
          <div 
            className="absolute bottom-2 right-2 w-12 h-12 rounded-lg flex items-center justify-center"
            style={{ 
              background: theme.cardDesign,
              boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
            }}
          >
            <Palette 
              className="h-4 w-4" 
              style={{ color: theme.accentColor }} 
            />
          </div>
        </div>
      </div>
      <div className="p-2 text-xs text-gray-500 bg-gray-50 border-t">
        {theme.name}
      </div>
    </div>
  );
};

export default ThemePreview;
