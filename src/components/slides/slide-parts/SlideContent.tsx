
import React from 'react';
import { Slide } from '@/types/deck';
import * as LucideIcons from 'lucide-react';

interface SlideContentProps {
  slide: Slide;
  layout: 'left-image' | 'right-image' | 'centered' | 'title-focus';
  handleBulletChange: (bulletIndex: number, e: React.FormEvent<HTMLLIElement>) => void;
}

const SlideContent: React.FC<SlideContentProps> = ({ 
  slide, 
  layout, 
  handleBulletChange 
}) => {
  // If we have an image, display it instead of the icon
  const iconName = slide.style?.iconType || "FileText";
  const IconComponent = (LucideIcons as any)[iconName] || LucideIcons.FileText;
  
  const imageElement = slide.imageUrl ? (
    <div className="relative overflow-hidden rounded-lg">
      <img 
        src={slide.imageUrl} 
        alt={slide.title} 
        className="object-cover w-full h-full"
      />
    </div>
  ) : (
    <div className="w-20 h-20 flex items-center justify-center bg-primary/10 rounded-full">
      <IconComponent className="h-10 w-10 text-primary" />
    </div>
  );
  
  // Add speaker notes display if available
  const speakerNotesElement = slide.speakerNotes ? (
    <div className="mt-4 pt-4 border-t border-dashed border-gray-200">
      <p className="text-sm font-medium text-gray-700">Speaker Notes:</p>
      <p className="text-sm text-gray-600 italic">{slide.speakerNotes}</p>
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
                  >
                    <span className="text-primary mr-2 mt-1">•</span>
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
                  >
                    <span className="text-primary mr-2 mt-1">•</span>
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
            <div className="mb-8 py-4 bg-primary/30 rounded-lg text-center">
              <h2 className="text-3xl font-bold text-gray-800">{slide.title}</h2>
            </div>
            <div className="flex items-start">
              <div className="mr-6 flex-shrink-0">
                <div className="w-16 h-16 flex items-center justify-center bg-primary/10 rounded-full">
                  <IconComponent className="h-8 w-8 text-primary" />
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
                  >
                    <span className="text-primary mr-2 mt-1">•</span>
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
                  >
                    <span className="text-primary mr-2 mt-1">•</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="ml-6 flex items-center justify-center">
              <div className="w-20 h-20 flex items-center justify-center bg-primary/10 rounded-full">
                <IconComponent className="h-10 w-10 text-primary" />
              </div>
            </div>
          </div>
          {speakerNotesElement}
        </>
      );
  }
};

export default SlideContent;
