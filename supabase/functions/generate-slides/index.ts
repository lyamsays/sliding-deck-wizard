
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log("generate-slides: Function invoked");
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log("generate-slides: Handling CORS preflight");
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const requestStart = Date.now();
    console.log("generate-slides: Parsing request body");
    const { content, profession, purpose, tone } = await req.json();
    
    console.log(`generate-slides: Received parameters - Profession: ${profession}, Purpose: ${purpose}, Tone: ${tone}`);
    
    // Return 400 if content is empty
    if (!content || content.trim() === '') {
      console.error("generate-slides: Empty content provided");
      return new Response(
        JSON.stringify({ error: 'Content cannot be empty' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log("generate-slides: Content received, length:", content.length);
    
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      console.error("generate-slides: Missing OPENAI_API_KEY");
      throw new Error('OPENAI_API_KEY is not set');
    }

    // Add a timeout to the OpenAI API call
    const controller = new AbortController();
    const timeoutId = setTimeout(() => {
      console.warn("generate-slides: Request timeout triggered");
      controller.abort();
    }, 25000); // 25 second timeout

    try {
      // Mock response for testing when API quota is an issue
      // Uncomment the next block and comment out the fetch call to use mock data
      /*
      console.log("generate-slides: Using mock data due to API quota issues");
      const mockSlides = {
        slides: [
          {
            title: "Introduction to " + (profession || "Presentation"),
            bullets: [
              "Overview of key concepts",
              "Background information",
              "Goals and objectives"
            ],
            visualSuggestion: "Use a gradient background with profession-related icon"
          },
          {
            title: "Main Points",
            bullets: [
              "First key point from your content",
              "Second important concept",
              "Supporting evidence"
            ],
            visualSuggestion: "Split screen layout with bullet points on left, illustration on right"
          },
          {
            title: "Conclusion",
            bullets: [
              "Summary of main points",
              "Recommendations",
              "Next steps"
            ],
            visualSuggestion: "Use a call-to-action box at bottom with arrow graphic"
          }
        ]
      };
      
      clearTimeout(timeoutId);
      console.log("generate-slides: Mock data generated successfully");
      
      return new Response(
        JSON.stringify(mockSlides),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
      */

      console.log("generate-slides: Calling OpenAI API");
      // Call OpenAI API with abort controller for timeout
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
                You are an expert presentation designer specialized in creating highly effective slides.
                
                Convert the provided content into well-structured presentation slides following these specific guidelines:
                
                SLIDE STRUCTURE:
                - Create clean, logically structured slides that flow naturally from introduction to conclusion
                - Include 3-7 slides total, based on content length and complexity
                - Each slide should contribute to a cohesive narrative
                
                SLIDE CONTENT:
                - Create engaging, concise titles that capture the essence of each slide
                - Include 3-5 bullet points per slide, each being clear and concise
                - Add examples, analogies, or insightful perspectives that enrich the content
                - For each slide, suggest a visual element that would enhance the content (icon, chart type, diagram style, layout)
                
                ADAPTATION:
                - Adapt the vocabulary, tone, and complexity based on the user's profession (${profession}) and purpose (${purpose})
                - Maintain a consistent ${tone} tone throughout the presentation
                - If the profession is technical, use appropriate terminology; if non-technical, use accessible language
                - Consider the purpose (${purpose}) when determining what to emphasize
                
                VISUAL SUGGESTIONS:
                - For each slide, provide a specific visual suggestion like:
                  * Recommended icons or icon style
                  * Background color or gradient that complements the content
                  * Layout structure (e.g., split screen, grid, centered)
                  * Chart or diagram type if data is presented
                  * Image concept that would reinforce the message
                
                Return ONLY a JSON object with the following structure:
                {
                  "slides": [
                    {
                      "title": "Clear and concise slide title",
                      "bullets": ["Key point 1", "Key point 2", "Key point 3"],
                      "visualSuggestion": "Brief description of recommended visual element or layout"
                    }
                  ]
                }
                
                DO NOT include any explanations or notes outside the JSON structure.
                ENSURE the presentation flows logically and maintains coherence throughout.
              `
            },
            {
              role: 'user',
              content: content
            }
          ],
          temperature: 0.5,
        }),
        signal: controller.signal,
      });
      
      clearTimeout(timeoutId); // Clear timeout if API call completes
      
      const apiDuration = Date.now() - requestStart;
      console.log(`generate-slides: OpenAI API call completed in ${apiDuration}ms`);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error("generate-slides: OpenAI API Error:", errorData);
        
        // Special handling for quota errors
        if (errorData.error?.type === 'insufficient_quota') {
          console.error("generate-slides: OpenAI quota exceeded");
          return new Response(
            JSON.stringify({ 
              error: 'OpenAI API quota exceeded. Please check your billing details or try again later.',
              code: 'quota_exceeded'
            }),
            { 
              status: 429, 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
            }
          );
        }
        
        throw new Error(`API error: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
      }

      const data = await response.json();
      const slidesContent = data.choices[0].message.content;
      
      console.log("generate-slides: Raw response from OpenAI:", slidesContent.substring(0, 100) + "...");
      
      // Parse the JSON from the OpenAI response
      let slides;
      try {
        // Clean the response in case OpenAI returns markdown code blocks
        const jsonStr = slidesContent.replace(/```json|```/g, '').trim();
        console.log("generate-slides: Attempting to parse JSON response");
        slides = JSON.parse(jsonStr);
      } catch (e) {
        console.error("generate-slides: Error parsing OpenAI response:", e);
        console.log("generate-slides: Response content preview:", slidesContent.substring(0, 200));
        return new Response(
          JSON.stringify({ error: 'Failed to parse slide content' }),
          { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      console.log("generate-slides: Successfully generated slides:", slides.slides?.length || 0);
      
      // Validate the response structure
      if (!slides.slides || !Array.isArray(slides.slides) || slides.slides.length === 0) {
        console.error("generate-slides: Invalid response format from AI");
        throw new Error('Invalid response format from AI');
      }
      
      const totalDuration = Date.now() - requestStart;
      console.log(`generate-slides: Total function execution time: ${totalDuration}ms`);
      
      return new Response(
        JSON.stringify(slides),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (fetchError) {
      clearTimeout(timeoutId);
      if (fetchError.name === 'AbortError') {
        console.error("generate-slides: Request timed out");
        throw new Error('Generation request timed out. Please try again.');
      }
      console.error("generate-slides: Fetch error:", fetchError);
      throw fetchError;
    }
  } catch (error) {
    console.error("generate-slides: Error generating slides:", error);
    
    return new Response(
      JSON.stringify({ error: error.message || 'An error occurred during slide generation' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
