
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.3.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
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

    console.log("generate-image: Calling DALL-E API");
    const response = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "dall-e-3",
        prompt: prompt,
        n: 1,
        size: "1024x1024",
        quality: "standard",
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
    
    return new Response(
      JSON.stringify({ 
        imageUrl: data.data[0].url,
        revisedPrompt: data.data[0].revised_prompt 
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
