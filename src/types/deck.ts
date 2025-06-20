
export interface Slide {
  id: string;
  title: string;
  content: string;
  bulletPoints?: string[];
  imageUrl?: string;
  order: number;
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
