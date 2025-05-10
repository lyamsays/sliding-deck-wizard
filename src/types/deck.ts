
export interface Slide {
  title: string;
  bullets: string[];
  visualSuggestion?: string;
  imageUrl?: string;
  revisedPrompt?: string;
  style?: {
    backgroundColor?: string;
    iconType?: string; 
    layout?: 'left-image' | 'right-image' | 'centered' | 'title-focus';
    colorScheme?: string;
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

// Helper function to convert database slides (Json) to strongly typed Slide[]
export const convertDbSlidesToTypedSlides = (dbSlides: any): Slide[] => {
  if (Array.isArray(dbSlides)) {
    return dbSlides.map(slide => ({
      title: slide.title || '',
      bullets: Array.isArray(slide.bullets) ? slide.bullets : [],
      visualSuggestion: slide.visualSuggestion || undefined,
      imageUrl: slide.imageUrl || undefined,
      revisedPrompt: slide.revisedPrompt || undefined,
      style: slide.style || {
        backgroundColor: getRandomPastelColor(),
        layout: 'right-image',
        colorScheme: 'professional'
      }
    }));
  }
  // Handle case when slides might be stored as stringified JSON
  if (typeof dbSlides === 'string') {
    try {
      const parsed = JSON.parse(dbSlides);
      return Array.isArray(parsed) ? parsed.map(slide => ({
        title: slide.title || '',
        bullets: Array.isArray(slide.bullets) ? slide.bullets : [],
        visualSuggestion: slide.visualSuggestion || undefined,
        imageUrl: slide.imageUrl || undefined,
        revisedPrompt: slide.revisedPrompt || undefined,
        style: slide.style || {
          backgroundColor: getRandomPastelColor(),
          layout: 'right-image',
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

// Helper function to generate pastel colors for slides
export const getRandomPastelColor = (): string => {
  const pastelColors = [
    '#F2FCE2', // Soft Green
    '#FEF7CD', // Soft Yellow
    '#FEC6A1', // Soft Orange
    '#E5DEFF', // Soft Purple
    '#FFDEE2', // Soft Pink
    '#FDE1D3', // Soft Peach
    '#D3E4FD', // Soft Blue
    '#F1F0FB', // Soft Gray
  ];
  
  return pastelColors[Math.floor(Math.random() * pastelColors.length)];
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

