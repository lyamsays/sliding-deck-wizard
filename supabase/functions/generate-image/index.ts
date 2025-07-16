

import "https://deno.land/x/xhr@0.3.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

(globalThis as any).Deno.serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log("generate-image: Handling CORS preflight");
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { prompt } = await req.json();
    console.log("generate-image: Received prompt:", prompt);
    
    if (!prompt || prompt.trim() === '') {
      console.error("generate-image: Empty prompt provided");
      return new Response(
        JSON.stringify({ error: 'Prompt cannot be empty' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Use globalThis to access Deno in a more compatible way
    const openAIApiKey = (globalThis as any).Deno?.env?.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      console.error("generate-image: Missing OPENAI_API_KEY");
      throw new Error('OPENAI_API_KEY is not set');
    }

    // Enhanced prompt engineering for professional presentations
    const enhancedPrompt = `Professional presentation image: ${prompt}. Style: Clean, modern, corporate aesthetic with sophisticated color palette. High resolution, photorealistic quality suitable for business presentations. Minimal distractions, focus on clarity and professional appeal.`;
    
    console.log("generate-image: Calling GPT-Image-1 API with enhanced prompt");
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "gpt-image-1",
        prompt: enhancedPrompt,
        size: "1536x1024",
        quality: "high",
        background: "auto",
        output_format: "webp",
        output_compression: 90,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("generate-image: DALL-E API Error:", errorData);
      return new Response(
        JSON.stringify({ 
          error: `DALL-E API error: ${errorData.error?.message || 'Unknown error'}`,
          code: 'api_error'
        }),
        { status: response.status, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const data = await response.json();
    console.log("generate-image: Image generated successfully");
    
    // GPT-Image-1 returns base64 directly, no need for data wrapper
    const imageData = data.data || data;
    const base64Image = typeof imageData === 'string' ? imageData : imageData[0];
    
    return new Response(
      JSON.stringify({ 
        imageUrl: `data:image/webp;base64,${base64Image}`,
        revisedPrompt: data.revised_prompt || enhancedPrompt
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error("generate-image: Error generating image:", error);
    
    return new Response(
      JSON.stringify({ error: (error as Error).message || 'An error occurred during image generation' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
