
export interface Slide {
  id: string;
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
    iconType?: string;
  };
  cropData?: unknown;
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

interface RawSlide {
  title?: string;
  bullets?: string[];
  visualSuggestion?: string;
  speakerNotes?: string;
  imageUrl?: string;
  revisedPrompt?: string;
  style?: Slide["style"];
  cropData?: unknown;
}

export function prepareDbSlides(rawSlides: unknown[]): Slide[] {
  return (rawSlides as RawSlide[]).map((slide, index: number) => ({
    id: `slide-${index}`,
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

export function convertDbSlidesToTypedSlides(dbSlides: unknown[]): Slide[] {
  return (dbSlides as RawSlide[]).map((slide, index: number) => ({
    id: `slide-${index}`,
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
