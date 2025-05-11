
import React from 'react';
import { Slide } from '@/types/deck';
import OutlineSlide from '@/components/slides/OutlineSlide';
import StyledSlide from '@/components/slides/StyledSlide';
import { motion } from 'framer-motion';

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
  
  // Use the slides directly without transforming them
  // This is important - we want to respect the style settings from SlideInput.tsx
  const optimizedSlides = editedSlides.map((slide, index) => {
    // Only set layout if not already manually set by user
    if (!slide.style?.layout) {
      return {
        ...slide,
        style: {
          ...slide.style,
          layout: optimizeSlideLayout(slide, index),
        }
      };
    }
    return slide;
  });

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
    >
      {optimizedSlides.map((slide, index) => (
        <motion.div 
          key={index} 
          className="card-enhanced hover-lift transition-all duration-300 overflow-hidden"
          variants={slideVariants}
          whileHover={{ scale: 1.02, boxShadow: "0 10px 25px rgba(0,0,0,0.08)" }}
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
        </motion.div>
      ))}
    </motion.div>
  );
};

export default SlideGrid;
