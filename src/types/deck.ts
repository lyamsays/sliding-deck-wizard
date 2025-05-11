
export interface Slide {
  title: string;
  bullets: string[];
  visualSuggestion?: string;
  imageUrl?: string;
  revisedPrompt?: string;
  speakerNotes?: string;
  style?: {
    backgroundColor?: string;
    layout?: 'left-image' | 'right-image' | 'centered' | 'title-focus';
    iconType?: string;
    colorScheme?: string;
    accentColor?: string;
    textColor?: string;
    titleFont?: string;
    bodyFont?: string;
    cardDesign?: string;
  };
  cropData?: {
    x: number;
    y: number;
    width: number;
    height: number;
    scale: number;
  };
}

export interface SlideDeck {
  id: string;
  title: string;
  slides: Slide[];
  created_at: string;
  updated_at?: string;
  user_id?: string;
}

// Determine optimal layout based on slide content
const determineOptimalLayout = (slide: any, index: number): 'left-image' | 'right-image' | 'centered' | 'title-focus' => {
  const title = slide.title || '';
  const bullets = Array.isArray(slide.bullets) ? slide.bullets : [];
  
  // For slides with no bullets, centered looks elegant
  if (bullets.length === 0) {
    return 'centered';
  }
  
  // For longer titles or text-heavy slides, title-focus provides better structure
  if (title.length > 35 || bullets.length > 4) {
    return 'title-focus';
  }
  
  // Alternate layouts for visual rhythm in the presentation
  return index % 2 === 0 ? 'left-image' : 'right-image';
};

// Helper function to convert database slides (Json) to strongly typed Slide[]
export const convertDbSlidesToTypedSlides = (dbSlides: any): Slide[] => {
  // Define a consistent professional background
  const professionalBackground = 'linear-gradient(109.6deg, rgba(223,234,247,1) 11.2%, rgba(244,248,252,1) 91.1%)';
  
  if (Array.isArray(dbSlides)) {
    return dbSlides.map((slide, index) => ({
      title: slide.title || '',
      bullets: Array.isArray(slide.bullets) ? slide.bullets : [],
      visualSuggestion: slide.visualSuggestion || undefined,
      imageUrl: slide.imageUrl || undefined,
      revisedPrompt: slide.revisedPrompt || undefined,
      speakerNotes: slide.speakerNotes || undefined,
      style: slide.style || {
        backgroundColor: professionalBackground,
        layout: determineOptimalLayout(slide, index),
        colorScheme: 'professional'
      }
    }));
  }
  // Handle case when slides might be stored as stringified JSON
  if (typeof dbSlides === 'string') {
    try {
      const parsed = JSON.parse(dbSlides);
      return Array.isArray(parsed) ? parsed.map((slide, index) => ({
        title: slide.title || '',
        bullets: Array.isArray(slide.bullets) ? slide.bullets : [],
        visualSuggestion: slide.visualSuggestion || undefined,
        imageUrl: slide.imageUrl || undefined,
        revisedPrompt: slide.revisedPrompt || undefined,
        speakerNotes: slide.speakerNotes || undefined,
        style: slide.style || {
          backgroundColor: professionalBackground,
          layout: determineOptimalLayout(slide, index),
          colorScheme: 'professional'
        }
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

// Helper function to generate pastel colors for slides (keeping for compatibility)
export const getRandomPastelColor = (): string => {
  // Return our consistent professional background instead
  return 'linear-gradient(109.6deg, rgba(223,234,247,1) 11.2%, rgba(244,248,252,1) 91.1%)';
};

// Get icon suggestion based on keywords in title or visual suggestion
export const getIconSuggestion = (title: string, visualSuggestion?: string): string => {
  const text = (title + ' ' + (visualSuggestion || '')).toLowerCase();
  
  // Simple keyword matching
  if (text.includes('economics') || text.includes('money') || text.includes('finance')) {
    return 'dollar-sign';
  } else if (text.includes('growth') || text.includes('increase') || text.includes('trend')) {
    return 'trending-up';
  } else if (text.includes('decision') || text.includes('choice') || text.includes('select')) {
    return 'git-branch';
  } else if (text.includes('idea') || text.includes('innovation') || text.includes('creative')) {
    return 'lightbulb';
  } else if (text.includes('data') || text.includes('statistics') || text.includes('analysis')) {
    return 'bar-chart';
  } else if (text.includes('team') || text.includes('people') || text.includes('group')) {
    return 'users';
  } else if (text.includes('time') || text.includes('schedule') || text.includes('planning')) {
    return 'clock';
  } else if (text.includes('target') || text.includes('goal') || text.includes('aim')) {
    return 'target';
  } else {
    // Default icons
    const defaultIcons = ['file-text', 'layout', 'layers', 'check-circle', 'award', 'star'];
    return defaultIcons[Math.floor(Math.random() * defaultIcons.length)];
  }
};
