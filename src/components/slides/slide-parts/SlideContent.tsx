
import React from 'react';
import { Slide } from '@/types/deck';
import * as LucideIcons from 'lucide-react';

interface SlideContentProps {
  slide: Slide;
  layout: 'left-image' | 'right-image' | 'centered' | 'title-focus';
  handleBulletChange: (bulletIndex: number, e: React.FormEvent<HTMLLIElement>) => void;
  textColor?: string;
  accentColor?: string;
}

const SlideContent: React.FC<SlideContentProps> = ({ 
  slide, 
  layout, 
  handleBulletChange,
  textColor = '#333333',
  accentColor = '#6E59A5'
}) => {
  // Ensure text is readable by enforcing contrast with background
  const ensureReadableText = (bgColor: string, txtColor: string) => {
    // Default to dark text for light backgrounds and light text for dark backgrounds
    if (!txtColor) {
      // Simple brightness calculation (0-255)
      const isLightBg = getBrightness(bgColor) > 160;
      return isLightBg ? '#333333' : '#FFFFFF';
    }
    
    // If contrast is poor, enforce better defaults
    if (getContrast(bgColor, txtColor) < 4.5) {
      const isLightBg = getBrightness(bgColor) > 160;
      return isLightBg ? '#333333' : '#FFFFFF';
    }
    
    return txtColor;
  };
  
  // Calculate brightness (0-255) - higher values are lighter
  const getBrightness = (color: string) => {
    // Handle background colors like linear gradients
    if (color.includes('linear-gradient') || color.includes('rgba')) {
      return 200; // Assume light background for gradients
    }
    
    // Convert hex to RGB
    const hex = color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16) || 200;
    const g = parseInt(hex.substring(2, 4), 16) || 200;
    const b = parseInt(hex.substring(4, 6), 16) || 200;
    
    return (r * 299 + g * 587 + b * 114) / 1000;
  };
  
  // Calculate contrast ratio
  const getContrast = (bg: string, txt: string) => {
    const bgBrightness = getBrightness(bg);
    const txtBrightness = getBrightness(txt);
    
    return Math.abs((bgBrightness - txtBrightness) / 255);
  };
  
  // Get background color
  const backgroundColor = slide.style?.backgroundColor || '#F1F0FB';
  
  // Enforce readable colors
  const readableTextColor = ensureReadableText(backgroundColor, textColor);
  
  // If we have an image, display it instead of the icon
  const iconName = slide.style?.iconType || "FileText";
  const IconComponent = (LucideIcons as any)[iconName] || LucideIcons.FileText;
  
  const imageElement = slide.imageUrl ? (
    <div className="relative overflow-hidden rounded-lg">
      <img 
        src={slide.imageUrl} 
        alt={slide.title} 
        className="object-cover w-full h-full rounded-lg border border-gray-200"
        crossOrigin="anonymous"
        onError={(e) => {
          // Fallback for image errors
          e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 24 24' fill='none' stroke='%23666' stroke-width='1' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='3' width='18' height='18' rx='2' ry='2'%3E%3C/rect%3E%3Ccircle cx='8.5' cy='8.5' r='1.5'%3E%3C/circle%3E%3Cpolyline points='21 15 16 10 5 21'%3E%3C/polyline%3E%3C/svg%3E";
          e.currentTarget.classList.add("bg-gray-100");
        }}
      />
    </div>
  ) : (
    <div className="w-20 h-20 flex items-center justify-center bg-primary/10 rounded-full">
      <IconComponent className="h-10 w-10" style={{ color: accentColor }} />
    </div>
  );
  
  // Style for bullet points
  const bulletStyle = {
    color: readableTextColor,
  };
  
  // Style for bullet markers
  const bulletMarkerStyle = {
    color: accentColor,
  };
  
  // Add speaker notes display if available - now with proper export hiding
  const speakerNotesElement = slide.speakerNotes ? (
    <div className="mt-4 pt-4 border-t border-dashed border-gray-200 slide-ui-elements-not-for-export">
      <p className="text-sm font-medium" style={{ color: readableTextColor }}>Speaker Notes:</p>
      <p className="text-sm italic" style={{ color: readableTextColor }}>
        {slide.speakerNotes}
      </p>
    </div>
  ) : null;
  
  switch(layout) {
    case 'left-image':
      return (
        <>
          <div className="flex flex-row-reverse">
            <div className="flex-grow">
              <ul className="space-y-3">
                {slide.bullets.map((bullet, bulletIndex) => (
                  <li 
                    key={bulletIndex} 
                    className="flex items-start"
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => handleBulletChange(bulletIndex, e)}
                    role="textbox"
                    aria-label={`Bullet point ${bulletIndex + 1}`}
                    style={bulletStyle}
                  >
                    <span style={bulletMarkerStyle} className="mr-2 mt-1">•</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mr-6 flex items-center justify-center">
              {imageElement}
            </div>
          </div>
          {speakerNotesElement}
        </>
      );
    case 'right-image':
      return (
        <>
          <div className="flex flex-row">
            <div className="flex-grow">
              <ul className="space-y-3">
                {slide.bullets.map((bullet, bulletIndex) => (
                  <li 
                    key={bulletIndex} 
                    className="flex items-start"
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => handleBulletChange(bulletIndex, e)}
                    role="textbox"
                    aria-label={`Bullet point ${bulletIndex + 1}`}
                    style={bulletStyle}
                  >
                    <span style={bulletMarkerStyle} className="mr-2 mt-1">•</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="ml-6 flex items-center justify-center">
              {imageElement}
            </div>
          </div>
          {speakerNotesElement}
        </>
      );
    case 'centered':
      return (
        <>
          <div className="flex flex-col items-center">
            <div className={`mb-6 ${slide.imageUrl ? 'w-64 h-64' : 'w-24 h-24'} flex items-center justify-center ${!slide.imageUrl ? 'bg-primary/10 rounded-full' : ''}`}>
              {imageElement}
            </div>
            <div className="w-full">
              <ul className="space-y-3">
                {slide.bullets.map((bullet, bulletIndex) => (
                  <li 
                    key={bulletIndex} 
                    className="flex items-center justify-center text-center"
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => handleBulletChange(bulletIndex, e)}
                    role="textbox"
                    aria-label={`Bullet point ${bulletIndex + 1}`}
                    style={bulletStyle}
                  >
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {speakerNotesElement}
        </>
      );
    case 'title-focus':
      return (
        <>
          <div className="flex flex-col">
            <div className="mb-8 py-4 rounded-lg text-center" style={{ backgroundColor: `${accentColor}30` }}>
              <h2 className="text-3xl font-bold" style={{ color: textColor }}>{slide.title}</h2>
            </div>
            <div className="flex items-start">
              <div className="mr-6 flex-shrink-0">
                <div className="w-16 h-16 flex items-center justify-center rounded-full" style={{ backgroundColor: `${accentColor}20` }}>
                  <IconComponent className="h-8 w-8" style={{ color: accentColor }} />
                </div>
              </div>
              <ul className="space-y-3 flex-grow">
                {slide.bullets.map((bullet, bulletIndex) => (
                  <li 
                    key={bulletIndex} 
                    className="flex items-start"
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => handleBulletChange(bulletIndex, e)}
                    role="textbox"
                    aria-label={`Bullet point ${bulletIndex + 1}`}
                    style={bulletStyle}
                  >
                    <span style={bulletMarkerStyle} className="mr-2 mt-1">•</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {speakerNotesElement}
        </>
      );
    default:
      return (
        <>
          <div className="flex flex-row">
            <div className="flex-grow">
              <ul className="space-y-3">
                {slide.bullets.map((bullet, bulletIndex) => (
                  <li 
                    key={bulletIndex} 
                    className="flex items-start"
                    contentEditable
                    suppressContentEditableWarning
                    onBlur={(e) => handleBulletChange(bulletIndex, e)}
                    role="textbox"
                    aria-label={`Bullet point ${bulletIndex + 1}`}
                    style={bulletStyle}
                  >
                    <span style={bulletMarkerStyle} className="mr-2 mt-1">•</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="ml-6 flex items-center justify-center">
              <div className="w-20 h-20 flex items-center justify-center rounded-full" style={{ backgroundColor: `${accentColor}20` }}>
                <IconComponent className="h-10 w-10" style={{ color: accentColor }} />
              </div>
            </div>
          </div>
          {speakerNotesElement}
        </>
      );
  }
};

export default SlideContent;
