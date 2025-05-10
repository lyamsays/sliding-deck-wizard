
export interface Slide {
  title: string;
  bullets: string[];
  visualSuggestion?: string;
}

export interface SlideDeck {
  id: string;
  title: string;
  slides: Slide[];
  created_at: string;
  updated_at?: string;
  user_id?: string;
}

// Helper function to convert database slides (Json) to strongly typed Slide[]
export const convertDbSlidesToTypedSlides = (dbSlides: any): Slide[] => {
  if (Array.isArray(dbSlides)) {
    return dbSlides.map(slide => ({
      title: slide.title || '',
      bullets: Array.isArray(slide.bullets) ? slide.bullets : [],
      visualSuggestion: slide.visualSuggestion || undefined
    }));
  }
  // Handle case when slides might be stored as stringified JSON
  if (typeof dbSlides === 'string') {
    try {
      const parsed = JSON.parse(dbSlides);
      return Array.isArray(parsed) ? parsed.map(slide => ({
        title: slide.title || '',
        bullets: Array.isArray(slide.bullets) ? slide.bullets : [],
        visualSuggestion: slide.visualSuggestion || undefined
      })) : [];
    } catch (e) {
      console.error('Error parsing slides:', e);
      return [];
    }
  }
  return [];
};

// Helper function to prepare slides for database storage
export const prepareDbSlides = (slides: Slide[]): any => {
  return slides;
};
