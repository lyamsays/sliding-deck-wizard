import { useMemo, useCallback } from 'react';
import { Slide } from '@/types/deck';

// Cache for slide searches and filters
const slideCache = new Map<string, Slide[]>();

export const useSlideSearch = (slides: Slide[], searchTerm: string) => {
  return useMemo(() => {
    if (!searchTerm.trim()) return slides;
    
    const cacheKey = `${slides.length}-${searchTerm}`;
    if (slideCache.has(cacheKey)) {
      return slideCache.get(cacheKey)!;
    }
    
    const filtered = slides.filter(slide => 
      slide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (slide.bulletPoints || slide.bullets || []).some(point => 
        point.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
    
    slideCache.set(cacheKey, filtered);
    return filtered;
  }, [slides, searchTerm]);
};

export const useSlideFilter = (slides: Slide[], filter: 'all' | 'recent' | 'title-az' | 'title-za') => {
  return useMemo(() => {
    const cacheKey = `filter-${slides.length}-${filter}`;
    if (slideCache.has(cacheKey)) {
      return slideCache.get(cacheKey)!;
    }
    
    let filtered = [...slides];
    
    switch (filter) {
      case 'recent':
        filtered = slides.slice().sort((a, b) => (b.slideNumber || 0) - (a.slideNumber || 0));
        break;
      case 'title-az':
        filtered = slides.slice().sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'title-za':
        filtered = slides.slice().sort((a, b) => b.title.localeCompare(a.title));
        break;
      default:
        filtered = slides;
    }
    
    slideCache.set(cacheKey, filtered);
    return filtered;
  }, [slides, filter]);
};

export const useDebouncedSearch = (callback: (value: string) => void, delay: number = 300) => {
  return useCallback(
    debounce(callback, delay),
    [callback, delay]
  );
};

// Debounce function for search performance
function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

// Clear cache when slides change significantly
export const clearSlideCache = () => {
  slideCache.clear();
};