
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
  // Generate visually appealing background colors if not already set
  editedSlides = editedSlides.map(slide => {
    if (!slide.style?.backgroundColor) {
      return {
        ...slide,
        style: {
          ...slide.style,
          backgroundColor: getRandomGradientBackground()
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
      {editedSlides.map((slide, index) => (
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

// Function to generate visually appealing gradient backgrounds
const getRandomGradientBackground = (): string => {
  const gradients = [
    'linear-gradient(120deg, #f6d365 0%, #fda085 100%)',
    'linear-gradient(to right, #fa709a 0%, #fee140 100%)',
    'linear-gradient(to top, #a8edea 0%, #fed6e3 100%)',
    'linear-gradient(to top, #d299c2 0%, #fef9d7 100%)',
    'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
    'linear-gradient(120deg, #e0c3fc 0%, #8ec5fc 100%)',
    'linear-gradient(to right, #ebc0fd 0%, #d9ded8 100%)',
    'linear-gradient(to top, #accbee 0%, #e7f0fd 100%)',
    'linear-gradient(to top, #c1dfc4 0%, #deecdd 100%)',
    'linear-gradient(to right, #d4fc79 0%, #96e6a1 100%)'
  ];
  
  return gradients[Math.floor(Math.random() * gradients.length)];
};

export default SlideGrid;
