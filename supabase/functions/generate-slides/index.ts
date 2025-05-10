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
    const requestBody = await req.json();
    
    // Check if this is a regular slide generation or an edit request
    const isEditMode = requestBody.mode === 'edit';
    const isSingleSlideEdit = isEditMode && requestBody.singleSlide === true;
    
    if (isEditMode) {
      console.log(`generate-slides: Edit mode requested with instruction: ${requestBody.editInstruction}`);
      // Extract content, instruction, etc. for edit mode
      const { content, editInstruction } = requestBody;
      
      // Return 400 if content or instruction is empty
      if (!content || !editInstruction) {
        console.error("generate-slides: Empty content or instruction provided for edit");
        return new Response(
          JSON.stringify({ error: 'Content and edit instruction cannot be empty' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      // Handle the edit request
      return await handleEditRequest(content, editInstruction, isSingleSlideEdit, corsHeaders);
    } else {
      // Regular slide generation
      const { content, profession, purpose, tone } = requestBody;
      
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
      
      // Continue with regular slide generation logic
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
    }
  } catch (error) {
    console.error("generate-slides: Error generating slides:", error);
    
    return new Response(
      JSON.stringify({ error: error.message || 'An error occurred during slide generation' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

// Helper function to handle slide edit requests
async function handleEditRequest(content, instruction, isSingleSlide, corsHeaders) {
  console.log(`generate-slides: Processing edit request for ${isSingleSlide ? 'single slide' : 'slides'}`);
  
  const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
  if (!openAIApiKey) {
    console.error("generate-slides: Missing OPENAI_API_KEY for edit request");
    throw new Error('OPENAI_API_KEY is not set');
  }
  
  try {
    // Parse the content (should be a JSON string of slide data)
    const slideData = typeof content === 'string' ? JSON.parse(content) : content;
    
    console.log("generate-slides: Parsed slide data for editing:", JSON.stringify(slideData).substring(0, 100) + "...");
    console.log("generate-slides: Edit instruction:", instruction);
    
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `
              You are an expert presentation slide editor that improves slides for clarity, engagement, and impact.
              
              You will receive a slide with a title and bullet points.
              Apply the user's edit instruction to improve the slide.
              
              GUIDANCE:
              - Keep the same general meaning and topic of the slide
              - Make bullet points concise, clear, and impactful
              - Add relevant examples or clarifications if requested
              - Adjust tone as requested (more formal/academic or more casual/conversational)
              - Keep to 3-5 bullet points usually, unless clearly instructed otherwise
              - Consider adding speaker notes if appropriate for context or additional details
              
              Return ONLY a JSON object with this structure:
              {
                "slides": [
                  {
                    "title": "Original or improved title",
                    "bullets": ["Improved bullet 1", "Improved bullet 2", "Improved bullet 3"],
                    "speakerNotes": "Optional speaker notes to supplement the slide content"
                  }
                ]
              }
              
              DO NOT include any explanations or notes outside the JSON structure.
            `
          },
          {
            role: 'user',
            content: `
              SLIDE CONTENT:
              ${JSON.stringify(slideData, null, 2)}
              
              EDIT INSTRUCTION:
              ${instruction}
              
              Please improve this slide content according to the instruction.
            `
          }
        ],
        temperature: 0.5,
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error("generate-slides: OpenAI API Error during edit:", errorData);
      throw new Error(`API error during edit: ${response.status} - ${errorData.error?.message || 'Unknown error'}`);
    }
    
    const data = await response.json();
    const editedContent = data.choices[0].message.content;
    
    // Parse the JSON from the OpenAI response
    let edited;
    try {
      // Clean the response in case OpenAI returns markdown code blocks
      const jsonStr = editedContent.replace(/```json|```/g, '').trim();
      console.log("generate-slides: Attempting to parse JSON response from edit");
      edited = JSON.parse(jsonStr);
    } catch (e) {
      console.error("generate-slides: Error parsing OpenAI edit response:", e);
      console.log("generate-slides: Edit response content preview:", editedContent.substring(0, 200));
      throw new Error('Failed to parse edited slide content');
    }
    
    console.log("generate-slides: Successfully edited slide content");
    
    // Validate the response structure
    if (!edited.slides || !Array.isArray(edited.slides) || edited.slides.length === 0) {
      console.error("generate-slides: Invalid edit response format from AI");
      throw new Error('Invalid response format from AI during edit');
    }
    
    return new Response(
      JSON.stringify(edited),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error("generate-slides: Error during slide edit:", error);
    throw error;
  }
}
