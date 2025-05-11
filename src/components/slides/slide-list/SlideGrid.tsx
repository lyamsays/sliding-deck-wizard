
import React from 'react';
import { Slide } from '@/types/deck';
import OutlineSlide from '@/components/slides/OutlineSlide';
import StyledSlide from '@/components/slides/StyledSlide';
import { motion } from 'framer-motion';
import { themes } from '@/components/themes/theme-data';

interface SlideGridProps {
  editedSlides: Slide[];
  viewMode: 'outline' | 'slide';
  handleSlideUpdate: (index: number, updatedSlide: Slide) => void;
  handleRemoveImage: (index: number) => void;
}

const SlideGrid: React.FC<SlideGridProps> = ({ 
  editedSlides, 
  viewMode, 
  handleSlideUpdate, 
  handleRemoveImage 
}) => {
  // Determine optimal layout for each slide based on content
  const optimizeSlideLayout = (slide: Slide, index: number): 'left-image' | 'right-image' | 'centered' | 'title-focus' => {
    // If slide has image, optimize layout based on content
    if (slide.imageUrl) {
      // For slides with short title and few bullets, centered layout looks best
      if (slide.title.length < 30 && slide.bullets.length <= 3) {
        return 'centered';
      }
      
      // For slide with lots of text/bullets, use right-image to balance
      if (slide.bullets.length >= 4 || slide.bullets.join('').length > 200) {
        return 'right-image';
      }
      
      // Alternate layouts for visual interest in the presentation
      return index % 2 === 0 ? 'left-image' : 'right-image';
    } 
    
    // For text-heavy slides with no image, title-focus often looks best
    if (slide.bullets.length >= 5 || slide.title.length > 40) {
      return 'title-focus';
    }
    
    // Default to right-image as it's generally well balanced
    return 'right-image';
  };
  
  // Enhance slides with theme information if not already present and ensure readability
  const optimizedSlides = editedSlides.map((slide, index) => {
    // Get theme data if a theme is specified
    const slideTheme = slide.style?.colorScheme ? 
      themes.find(t => t.id === slide.style?.colorScheme) : null;
    
    // Create a new slide object with optimized style settings
    const optimizedSlide = { ...slide };
    
    // Initialize style object if it doesn't exist
    if (!optimizedSlide.style) {
      optimizedSlide.style = {};
    }
    
    // Only set layout if not already manually set by user
    if (!optimizedSlide.style.layout) {
      optimizedSlide.style.layout = optimizeSlideLayout(slide, index);
    }
    
    // Apply theme styles if a theme is specified
    if (slideTheme) {
      // Set theme properties but ensure text contrast is good
      const isLightBg = isLightBackground(slideTheme.background);
      
      optimizedSlide.style = {
        ...optimizedSlide.style,
        backgroundColor: optimizedSlide.style.backgroundColor || slideTheme.background,
        textColor: ensureReadableTextColor(
          optimizedSlide.style.backgroundColor || slideTheme.background,
          optimizedSlide.style.textColor || slideTheme.textColor
        ),
        accentColor: optimizedSlide.style.accentColor || slideTheme.accentColor,
        titleFont: optimizedSlide.style.titleFont || slideTheme.titleFont,
        bodyFont: optimizedSlide.style.bodyFont || slideTheme.bodyFont,
        cardDesign: optimizedSlide.style.cardDesign || slideTheme.cardDesign
      };
    }
    
    return optimizedSlide;
  });
  
  // Helper function to determine if a background color is light
  function isLightBackground(bgColor: string): boolean {
    // For gradients or complex backgrounds, make a best guess
    if (bgColor.includes('gradient') || bgColor.includes('rgba')) {
      // Check for predominantly dark colors in the string
      const hasDarkColors = [
        'black', '#000', '#111', '#222', '#333', '#444',
        'rgb(0,', 'rgb(1,', 'rgb(2,', 'rgb(3,', 'rgb(4,',
        'rgba(0,', 'rgba(1,', 'rgba(2,', 'rgba(3,', 'rgba(4,'
      ].some(dark => bgColor.includes(dark));
      
      return !hasDarkColors;
    }
    
    // For hex colors
    if (bgColor.startsWith('#')) {
      const hex = bgColor.replace('#', '');
      const r = parseInt(hex.substring(0, 2), 16) || 200;
      const g = parseInt(hex.substring(2, 4), 16) || 200;
      const b = parseInt(hex.substring(4, 6), 16) || 200;
      
      // Calculate perceived brightness using the formula: (R * 299 + G * 587 + B * 114) / 1000
      const brightness = (r * 299 + g * 587 + b * 114) / 1000;
      return brightness > 125; // threshold for light/dark
    }
    
    // Default to assuming light background
    return true;
  }

  // Helper function to ensure text is readable on the background
  function ensureReadableTextColor(bgColor: string, textColor: string): string {
    // Default text colors based on background
    const isLight = isLightBackground(bgColor);
    
    // If no text color specified, pick appropriate default
    if (!textColor) {
      return isLight ? '#333333' : '#FFFFFF';
    }
    
    // Simple check for dark text on dark background or light text on light background
    const isTextDark = !isLightBackground(textColor);
    
    // If both background and text are light or both are dark, fix it
    if ((isLight && isTextDark === false) || (!isLight && isTextDark === true)) {
      return isLight ? '#333333' : '#FFFFFF';
    }
    
    return textColor;
  }

  // Masonry grid container style for visual interest
  const containerClass = viewMode === 'outline' 
    ? "grid grid-cols-1 gap-8 md:gap-10"
    : "grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-10";

  // Animation variants for staggered slide entrance
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const slideVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        damping: 15
      }
    }
  };

  return (
    <motion.div 
      className={containerClass}
      variants={containerVariants}
      initial="hidden"
      animate="show"
      id="slides-grid-container"
    >
      {optimizedSlides.map((slide, index) => (
        <motion.div 
          key={index} 
          className="card-enhanced hover-lift transition-all duration-300 overflow-hidden"
          variants={slideVariants}
          whileHover={{ scale: 1.02, boxShadow: "0 10px 25px rgba(0,0,0,0.08)" }}
          id={`slide-${index}`} // Explicit ID for export capture
          data-slide-index={index} // Additional data attribute for backup
        >
          {/* The slide content itself, which will be exported */}
          <div className="slide-content-for-export relative overflow-hidden rounded-lg" 
            style={{
              backgroundColor: slide.style?.backgroundColor || '#ffffff',
            }}
            id={`slide-content-${index}`} // Add specific ID for content area
          >
            {viewMode === 'outline' ? (
              <OutlineSlide 
                slide={slide} 
                index={index} 
                onSlideUpdate={handleSlideUpdate} 
              />
            ) : (
              <StyledSlide 
                slide={slide} 
                index={index} 
                onSlideUpdate={handleSlideUpdate}
                onRemoveImage={() => handleRemoveImage(index)}
              />
            )}
          </div>
          
          {/* UI elements that should not be exported - rendered outside the exportable content */}
          <div className="slide-ui-elements-not-for-export mt-2">
            {/* Any UI controls would go here */}
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};

export default SlideGrid;
