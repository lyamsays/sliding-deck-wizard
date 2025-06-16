
export interface Slide {
  title: string;
  bullets: string[];
  visualSuggestion?: string;
  imageUrl?: string;
  revisedPrompt?: string;
  style?: {
    backgroundColor?: string;
    iconType?: string;
    layout?: 'right-image' | 'left-image';
    colorScheme?: string;
    accentColor?: string;
    textColor?: string;
    titleFont?: string;
    bodyFont?: string;
    cardDesign?: string;
  };
}

export interface SlideDeck {
  id: string;
  title: string;
  slides: Slide[];
  created_at: string;
  updated_at: string;
  user_id: string;
}

export const convertDbSlidesToTypedSlides = (dbSlides: any): Slide[] => {
  if (!Array.isArray(dbSlides)) return [];
  
  return dbSlides.map((slide: any) => ({
    title: slide.title || '',
    bullets: Array.isArray(slide.bullets) ? slide.bullets : [],
    visualSuggestion: slide.visualSuggestion,
    imageUrl: slide.imageUrl,
    revisedPrompt: slide.revisedPrompt,
    style: slide.style
  }));
};

export const getRandomPastelColor = (): string => {
  const colors = [
    '#FFE5E5', '#E5F3FF', '#E5FFE5', '#FFF5E5', '#F0E5FF',
    '#FFE5F5', '#E5FFFF', '#F5FFE5', '#FFE5EF', '#E5F0FF'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

export const getIconSuggestion = (title: string, visualSuggestion?: string): string => {
  const text = (title + ' ' + (visualSuggestion || '')).toLowerCase();
  
  if (text.includes('finance') || text.includes('money') || text.includes('cost')) return 'DollarSign';
  if (text.includes('growth') || text.includes('increase') || text.includes('up')) return 'TrendingUp';
  if (text.includes('team') || text.includes('people') || text.includes('group')) return 'Users';
  if (text.includes('idea') || text.includes('innovation') || text.includes('light')) return 'Lightbulb';
  if (text.includes('target') || text.includes('goal') || text.includes('aim')) return 'Target';
  if (text.includes('time') || text.includes('schedule') || text.includes('clock')) return 'Clock';
  if (text.includes('chart') || text.includes('data') || text.includes('analytics')) return 'BarChart3';
  if (text.includes('security') || text.includes('protect') || text.includes('safe')) return 'Shield';
  if (text.includes('world') || text.includes('global') || text.includes('earth')) return 'Globe';
  if (text.includes('star') || text.includes('award') || text.includes('quality')) return 'Star';
  
  return 'Circle';
};
