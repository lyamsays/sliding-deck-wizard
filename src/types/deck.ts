
export interface Slide {
  title: string;
  bullets: string[];
  visualSuggestion?: string;
  speakerNotes?: string;
  imageUrl?: string;
  revisedPrompt?: string;
  style?: {
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
