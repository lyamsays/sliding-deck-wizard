import { supabase } from "@/integrations/supabase/client";

export interface ImageGenerationOptions {
  prompt: string;
  slideTitle?: string;
  slideContext?: string;
  retries?: number;
  timeout?: number;
}

export interface GeneratedImage {
  imageUrl: string;
  revisedPrompt?: string;
  photographer?: string;
}

export class ImageGenerationService {
  static async generateImage(options: ImageGenerationOptions): Promise<GeneratedImage> {
    const { prompt, slideTitle, retries = 2 } = options;

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const { data, error } = await supabase.functions.invoke('generate-image', {
          body: { prompt, slideTitle }
        });

        if (error) throw new Error(`Function error: ${error.message}`);
        if (!data || data.error) throw new Error(data?.error || 'No image returned');
        if (!data.imageUrl) throw new Error('No image URL in response');

        return {
          imageUrl: data.imageUrl,
          revisedPrompt: data.altDescription || slideTitle || prompt,
          photographer: data.photographer,
        };
      } catch (error) {
        if (attempt === retries) throw error;
        await new Promise(r => setTimeout(r, 1000 * attempt));
      }
    }
    throw new Error('Image generation failed');
  }

  // Keep for compatibility
  static assessImageQuality(_imageUrl: string): Promise<boolean> {
    return Promise.resolve(true);
  }
}
