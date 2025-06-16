
export interface Slide {
  title: string;
  bullets: string[];
  visualSuggestion?: string;
  imageUrl?: string;
  revisedPrompt?: string;
  style?: {
    backgroundColor: string;
    iconType: string;
    layout: 'right-image' | 'left-image';
    colorScheme: string;
    accentColor: string;
    textColor: string;
    titleFont: string;
    bodyFont: string;
    cardDesign: string;
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

// Utility functions for slide styling
export const getRandomPastelColor = (): string => {
  const colors = [
    '#F8F8FF', '#F0F8FF', '#F5FFFA', '#F0FFF0', '#FFFAF0',
    '#FFF8DC', '#FFFACD', '#FFE4E1', '#F0E68C', '#E6E6FA'
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

export const getIconSuggestion = (title: string, visualSuggestion?: string): string => {
  const text = (title + ' ' + (visualSuggestion || '')).toLowerCase();
  
  if (text.includes('chart') || text.includes('graph') || text.includes('data')) return 'chart';
  if (text.includes('team') || text.includes('people') || text.includes('group')) return 'users';
  if (text.includes('growth') || text.includes('increase') || text.includes('trend')) return 'trending-up';
  if (text.includes('goal') || text.includes('target') || text.includes('aim')) return 'target';
  if (text.includes('strategy') || text.includes('plan') || text.includes('roadmap')) return 'map';
  if (text.includes('innovation') || text.includes('idea') || text.includes('creative')) return 'lightbulb';
  if (text.includes('communication') || text.includes('message') || text.includes('talk')) return 'message-circle';
  if (text.includes('security') || text.includes('protection') || text.includes('safe')) return 'shield';
  if (text.includes('time') || text.includes('schedule') || text.includes('deadline')) return 'clock';
  if (text.includes('money') || text.includes('revenue') || text.includes('profit')) return 'dollar-sign';
  
  return 'presentation';
};
