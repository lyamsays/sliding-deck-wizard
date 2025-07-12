import { Suspense, lazy, memo } from 'react';
import { LucideProps } from 'lucide-react';

// Performance optimization: Lazy load components
export const LazyRealTimePreview = lazy(() => import('../RealTimePreview'));
export const LazyDraggableSlideList = lazy(() => import('../DraggableSlideList'));
export const LazyQuickSlideCreator = lazy(() => import('../QuickSlideCreator'));

// Loading fallbacks for better UX
export const ComponentLoader = memo(() => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
  </div>
));

export const SlideLoader = memo(() => (
  <div className="space-y-4">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="animate-pulse">
        <div className="h-24 bg-muted rounded-lg"></div>
      </div>
    ))}
  </div>
));

// Touch-friendly icon wrapper for mobile
interface TouchIconProps extends LucideProps {
  icon: React.ComponentType<LucideProps>;
  label?: string;
  touchSize?: 'sm' | 'md' | 'lg';
}

export const TouchIcon = memo<TouchIconProps>(({ 
  icon: Icon, 
  label, 
  touchSize = 'md',
  ...props 
}) => {
  const sizeClasses = {
    sm: 'p-2 min-h-[40px] min-w-[40px]',
    md: 'p-3 min-h-[44px] min-w-[44px]', 
    lg: 'p-4 min-h-[48px] min-w-[48px]'
  };

  return (
    <div 
      className={`inline-flex items-center justify-center rounded-lg ${sizeClasses[touchSize]} touch-manipulation`}
      role="button"
      aria-label={label}
    >
      <Icon {...props} />
    </div>
  );
});

TouchIcon.displayName = 'TouchIcon';