
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
  // Gamma-style grid layout
  const containerClass = viewMode === 'outline' 
    ? "space-y-6"
    : "grid grid-cols-1 lg:grid-cols-2 gap-8";

  // Animation variants for smooth entrance
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  const slideVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    show: { 
      opacity: 1, 
      y: 0,
      scale: 1,
      transition: {
        type: "spring" as const,
        damping: 20,
        stiffness: 300
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
      {editedSlides.map((slide, index) => (
        <motion.div 
          key={slide.id || index} 
          variants={slideVariants}
          whileHover={{ 
            scale: 1.02,
            transition: { duration: 0.2 }
          }}
          id={`slide-${index}`}
          data-slide-index={index}
          className="slide-container"
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
