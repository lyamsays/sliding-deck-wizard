import { supabase } from "@/integrations/supabase/client";
import { PromptEnhancer } from "./promptEnhancer";

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
}

interface ImageGenerationResponse extends GeneratedImage {
  error?: string;
}

export class ImageGenerationService {
  private static readonly DEFAULT_TIMEOUT = 45000; // 45 seconds
  private static readonly DEFAULT_RETRIES = 3;

  static async generateImage(options: ImageGenerationOptions): Promise<GeneratedImage> {
    const { 
      prompt, 
      slideTitle, 
      slideContext, 
      retries = this.DEFAULT_RETRIES,
      timeout = this.DEFAULT_TIMEOUT 
    } = options;

    // Enhanced prompt engineering with context
    const enhancedPrompt = this.enhancePrompt(prompt, slideTitle, slideContext);
    // Pass slideTitle separately for better Unsplash search

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        console.log(`Image generation attempt ${attempt}/${retries} for prompt:`, enhancedPrompt);
        
        const result = await Promise.race([
          this.callGenerateImageFunction(enhancedPrompt, slideTitle),
          this.createTimeoutPromise(timeout)
        ]);

        // Result is already validated in callGenerateImageFunction

        console.log(`Successfully generated image on attempt ${attempt}`);
        return result;
      } catch (error) {
        console.error(`Image generation attempt ${attempt} failed:`, error);
        
        if (attempt === retries) {
          throw new Error(`Failed to generate image after ${retries} attempts: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
        
        // Exponential backoff
        await this.delay(Math.pow(2, attempt) * 1000);
      }
    }

    throw new Error('Image generation failed after all retries');
  }

  private static enhancePrompt(prompt: string, slideTitle?: string, slideContext?: string): string {
    // Use the advanced prompt enhancer
    const context = {
      slideTitle: slideTitle || '',
      slideContent: slideContext ? slideContext.split(', ') : [],
      presentationType: 'business' as const,
      industry: PromptEnhancer.detectIndustry(slideTitle || '', slideContext ? slideContext.split(', ') : []),
      audience: 'executives' as const
    };

    // If we have a basic prompt, enhance it; otherwise generate contextually
    if (prompt && prompt.trim().length > 10) {
      return PromptEnhancer.enhancePrompt(prompt, context);
    } else {
      return PromptEnhancer.generateContextualPrompt(context);
    }
  }

  private static async callGenerateImageFunction(prompt: string, slideTitle?: string): Promise<GeneratedImage> {
    const { data, error } = await supabase.functions.invoke('generate-image', {
      body: { prompt, slideTitle }
    });

    if (error) {
      throw new Error(`Function error: ${error.message}`);
    }

    if (!data || data.error) {
      throw new Error(data?.error || 'No image found');
    }

    if (!data.imageUrl) {
      throw new Error('No image URL returned');
    }

    return {
      imageUrl: data.imageUrl,
      revisedPrompt: data.altDescription || prompt,
    };
  }

  private static createTimeoutPromise(timeout: number): Promise<never> {
    return new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error('Image generation timeout'));
      }, timeout);
    });
  }

  private static delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Quality assessment helper
  static assessImageQuality(imageUrl: string): Promise<boolean> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        // Basic quality checks
        const hasGoodDimensions = img.width >= 1024 && img.height >= 512;
        const hasGoodAspectRatio = (img.width / img.height) >= 1.2 && (img.width / img.height) <= 2.0;
        
        resolve(hasGoodDimensions && hasGoodAspectRatio);
      };
      img.onerror = () => resolve(false);
      img.src = imageUrl;
    });
  }
}