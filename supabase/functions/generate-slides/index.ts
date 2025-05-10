
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { content } = await req.json();
    
    // Return 400 if content is empty
    if (!content || content.trim() === '') {
      return new Response(
        JSON.stringify({ error: 'Content cannot be empty' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OPENAI_API_KEY is not set');
    }

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // Using gpt-4o-mini for cost-effectiveness
        messages: [
          {
            role: 'system',
            content: `
              You are a slide generation assistant. Convert the provided content into well-structured presentation slides.
              Return ONLY a JSON object with the following structure:
              {
                "slides": [
                  {
                    "title": "Clear and concise slide title",
                    "bullets": ["Key point 1", "Key point 2", "Key point 3"]
                  }
                ]
              }
              
              Create between 3-7 slides based on the content length and complexity.
              Each slide should have a clear title and 2-5 bullet points.
              Ensure the content is well-organized and follows a logical flow.
              DO NOT include any explanations or notes outside the JSON structure.
            `
          },
          {
            role: 'user',
            content: content
          }
        ],
        temperature: 0.5,
      }),
    });

    const data = await response.json();
    const slidesContent = data.choices[0].message.content;
    
    // Parse the JSON from the OpenAI response
    let slides;
    try {
      // Clean the response in case OpenAI returns markdown code blocks
      const jsonStr = slidesContent.replace(/```json|```/g, '').trim();
      slides = JSON.parse(jsonStr);
    } catch (e) {
      console.error("Error parsing OpenAI response:", e);
      console.log("Response content:", slidesContent);
      return new Response(
        JSON.stringify({ error: 'Failed to parse slide content' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log("Generated slides:", slides);
    
    return new Response(
      JSON.stringify(slides),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error("Error generating slides:", error);
    
    return new Response(
      JSON.stringify({ error: error.message || 'An error occurred during slide generation' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
