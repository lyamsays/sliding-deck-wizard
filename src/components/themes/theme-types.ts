
export type ThemeCategory = 'all' | 'dark' | 'consulting' | 'academic' | 'modern' | 'educator';

export interface Theme {
  id: string;
  name: string;
  description: string;
  background: string;
  accentColor: string;
  textColor: string;
  titleFont: string;
  bodyFont: string;
  cardDesign: string;
  isDark: boolean;
  categories: ThemeCategory[];
}
