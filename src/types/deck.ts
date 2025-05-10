
export interface Slide {
  title: string;
  bullets: string[];
}

export interface SlideDeck {
  id: string;
  title: string;
  slides: Slide[];
  created_at: string;
}
