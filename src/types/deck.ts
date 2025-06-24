

export interface Slide {
  id: string;
  title: string;
  bullets: string[];
  visualSuggestion?: string;
  speakerNotes?: string;
  imageUrl?: string;
  revisedPrompt?: string;
  style?: {
<<<<<<< HEAD
    backgroundColor?: string;
    textColor?: string;
    accentColor?: string;
    titleFont?: string;
    bodyFont?: string;
    layout?: 'left-image' | 'right-image' | 'centered' | 'title-focus';
    colorScheme?: string;
    cardDesign?: string;
  };
  cropData?: any;
}

export function prepareDbSlides(rawSlides: any[]): Slide[] {
  return rawSlides.map((slide, index) => ({
    title: slide.title ?? `Slide ${index + 1}`,
    bullets: slide.bullets ?? [],
    visualSuggestion: slide.visualSuggestion ?? "",
    speakerNotes: slide.speakerNotes ?? "",
    imageUrl: slide.imageUrl ?? "",
    revisedPrompt: slide.revisedPrompt ?? "",
    style: slide.style ?? {},
    cropData: slide.cropData ?? null,
  }));
}

// Helper functions
export function getRandomPastelColor(): string {
  const hue = Math.floor(Math.random() * 360);
  return `hsl(${hue}, 70%, 80%)`;
}

export function getIconSuggestion(title: string, visualSuggestion?: string): string {
  const combinedText = (title + ' ' + (visualSuggestion || '')).toLowerCase();
  
  // Simple icon mapping based on keywords
  if (combinedText.includes('growth') || combinedText.includes('increase')) return 'trending-up';
  if (combinedText.includes('decline') || combinedText.includes('decrease')) return 'trending-down';
  if (combinedText.includes('time') || combinedText.includes('schedule')) return 'clock';
  if (combinedText.includes('setting') || combinedText.includes('config')) return 'settings';
  if (combinedText.includes('user') || combinedText.includes('person')) return 'user';
  if (combinedText.includes('message') || combinedText.includes('chat')) return 'message-circle';
  if (combinedText.includes('file') || combinedText.includes('document')) return 'file';
  if (combinedText.includes('image') || combinedText.includes('photo')) return 'image';
  
  // Default icon
  return 'chevron-right';
}
export function convertDbSlidesToTypedSlides(dbSlides: any[]): Slide[] {
  return dbSlides.map((slide, index) => ({
    title: slide.title ?? `Slide ${index + 1}`,
    bullets: slide.bullets ?? [],
    visualSuggestion: slide.visualSuggestion ?? "",
    speakerNotes: slide.speakerNotes ?? "",
    imageUrl: slide.imageUrl ?? "",
    revisedPrompt: slide.revisedPrompt ?? "",
    style: slide.style ?? {},
    cropData: slide.cropData ?? null,
  }));
}
=======
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

export interface Deck {
  id: string;
  title: string;
  description?: string;
  slides: Slide[];
  created_at: string;
  updated_at: string;
  user_id?: string;
  theme?: string;
}

export interface SlideGenerationRequest {
  topic: string;
  slideCount: number;
  audience?: string;
  tone?: string;
  additionalInstructions?: string;
}

export interface GenerationProgress {
  step: number;
  totalSteps: number;
  currentStep: string;
  isComplete: boolean;
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

>>>>>>> 0586fc0ddfcb662ea18ceb0a567de8e4d6b73122
