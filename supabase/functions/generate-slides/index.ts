import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const OPENAI_API_KEY = (globalThis as any).Deno?.env?.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      console.error('Missing OpenAI API key');
      throw new Error('Missing OpenAI API key');
    }

    const requestData = await req.json();
    console.log('Received request data:', JSON.stringify(requestData, null, 2));
    
    const { content, mode } = requestData;

    // Handle narrative mode generation
    if (mode === "narrative") {
      console.log("Generating narrative for slides...");

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            {
              role: "system",
              content: `You are a professional AI presentation coach that helps create compelling narratives for slide decks.

When a user activates Narrative Mode, your task is to analyze the slide deck they created.

You must return two outputs:

---

1. 🎙 **Pitch Summary** (2–3 paragraphs)  
This is an opening monologue the presenter can use to introduce the entire presentation.  
It should:
- Summarize the topic and purpose of the deck
- Flow naturally, using persuasive and confident language
- Be clear and professional — suitable for clients, investors, or students

---

2. 📝 **Slide-by-Slide Speaker Notes**  
For each slide:
- Write a short paragraph (1–3 sentences) of what to say while presenting the slide
- Write in first person perspective as if you are the presenter
- Use language that is engaging and easy to deliver verbally
- Maintain a consistent and logical tone across slides
- Include natural transitions between slides

---

**Tone Guidelines:**  
- Always professional, clear, and natural to speak  
- Adapt slightly to the content (academic, consulting, business pitch)  
- Avoid repeating bullet points verbatim — *expand, explain, or reframe them*
- Focus on what the presenter should SAY, not what they should DO
- Write in first person perspective, as if the presenter is speaking

Your response must follow this exact format:

🎙 Pitch Summary:
[Your pitch summary paragraphs]

📝 Speaker Notes:

**Slide 1 – [Title]:**
[Notes written in first person as if the presenter is speaking]

**Slide 2 – [Title]:**
[Notes written in first person as if the presenter is speaking]

And so on for all slides.`
            },
            {
              role: "user",
              content
            }
          ],
          temperature: 0.7,
          max_tokens: 2000,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        console.error('OpenAI API error:', error);
        throw new Error(`OpenAI API error: ${error.error?.message || 'Unknown error'}`);
      }

      const result = await response.json();
      const responseText = result.choices[0].message?.content || '';

      console.log("Generated narrative response");

      // Parse the response to separate pitch summary and slide notes
      const pitchSummaryMatch = responseText.match(/🎙 Pitch Summary:([\s\S]*?)(?:📝 Speaker Notes:)/);
      const pitchSummary = pitchSummaryMatch ? pitchSummaryMatch[1].trim() : '';

      // Extract individual slide notes
      const slideNotesSection = responseText.split('📝 Speaker Notes:')[1] || '';
      const slideNoteMatches = slideNotesSection.match(/\*\*Slide \d+ – .*?\*\*:([\s\S]*?)(?=\*\*Slide \d+|$)/g) || [];
      
      const slideNotes = slideNoteMatches.map((match: string) => {
        const noteContent = match.split('*:')[1] || '';
        return noteContent.trim();
      });

      return new Response(
        JSON.stringify({
          narrative: {
            pitchSummary,
            slideNotes,
          }
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // For all other modes, continue with regular slide generation
    const {
      profession = "Consultant",
      purpose = "",
      tone = "Professional", 
      framework,
      themeId = "creme",
      editInstruction,
      singleSlide,
      autoGenerateImages = true
    } = requestData;

    console.log("generate-slides: mode", mode);
    console.log("generate-slides: profession", profession);
    console.log("generate-slides: purpose", purpose);
    console.log("generate-slides: tone", tone);
    console.log("generate-slides: framework", framework);
    console.log("generate-slides: themeId", themeId);
    console.log("generate-slides: editInstruction", editInstruction);
    console.log("generate-slides: singleSlide", singleSlide);
    console.log("generate-slides: autoGenerateImages", autoGenerateImages);

    if (!content || content.trim() === '') {
      console.error('No content provided');
      throw new Error('Content is required to generate slides');
    }

    let prompt = `You are a professional ${profession}-level expert presentation creator.
      The presentation's purpose is to ${purpose}.
      The tone of the presentation should be ${tone}.
      Create a slide deck from the following content: ${content}.`;

    if (framework && profession === "Consultant") {
      prompt += ` Use the ${framework} framework.`;
    }

    if (editInstruction) {
      prompt = `You are a professional presentation editor. Edit the following content: ${content}.
        Here are the instructions: ${editInstruction}.
        Return the edited content.`;
    }

    console.log("Prompt being used:", prompt);

    // Using the fetch API directly instead of the OpenAI SDK
    const completion = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are a professional presentation creator.
            You create slide decks from content.
            You are an expert in visual design and presentation structure.
            YOU MUST RETURN VALID JSON WITHOUT ANY MARKDOWN FORMATTING.
            DO NOT WRAP THE JSON IN CODE BLOCKS OR BACKTICKS.
            Each slide should have a title and an array of bullets.
            Include a visualSuggestion field that suggests an image for the slide.
            Include a speakerNotes field that contains notes for the speaker.
            The slide deck should be engaging and persuasive.
            The slide deck should be visually appealing.
            The slide deck should be well-structured.
            The slide deck should be easy to follow.
            The slide deck should be memorable.
            Each slide should have a title and an array of bullets.
            Each slide should have a visualSuggestion field that suggests an image for the slide.
            Each slide should have a speakerNotes field that contains notes for the speaker.
            The slide deck should be no more than 7 slides.
            The slide deck should be no less than 3 slides.
            Here is the content: ${content}.
            Here are the instructions: ${prompt}.
            Here is the theme id: ${themeId}.
            Here is an example of the JSON you should return (WITHOUT ANY MARKDOWN FORMATTING OR CODE BLOCKS):
            {
              "slides": [
                {
                  "title": "Slide 1 Title",
                  "bullets": [
                    "Bullet 1",
                    "Bullet 2",
                    "Bullet 3"
                  ],
                  "visualSuggestion": "A picture of a cat",
                  "speakerNotes": "This is a slide about cats."
                }
              ]
            }`
          },
          { role: "user", content: prompt },
        ],
        temperature: 0.7,
        max_tokens: 2048,
      }),
    });

    if (!completion.ok) {
      const error = await completion.json();
      console.error('OpenAI API error:', error);
      throw new Error(`OpenAI API error: ${error.error?.message || 'Unknown error'}`);
    }

    const result = await completion.json();
    const response = result.choices[0].message?.content;

    if (!response) {
      console.error('No response from OpenAI');
      throw new Error("No response from OpenAI");
    }

    console.log("Response from OpenAI:", response);

    try {
      // Clean the response before parsing to handle cases where it might be wrapped in markdown code blocks
      let cleanedResponse = response;
      // Remove markdown code block formatting if present
      const codeBlockMatch = response.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (codeBlockMatch) {
        cleanedResponse = codeBlockMatch[1];
        console.log("Cleaned response from markdown:", cleanedResponse);
      }

      const parsedResponse = JSON.parse(cleanedResponse);

      if (!parsedResponse || !parsedResponse.slides) {
        console.error('Invalid response format:', parsedResponse);
        throw new Error("Invalid response format from OpenAI");
      }

      console.log("Successfully parsed response, returning slides:", parsedResponse.slides.length);

      return new Response(
        JSON.stringify(parsedResponse),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    } catch (parseError) {
      console.error("Error parsing JSON response:", parseError);
      console.error("Raw response from OpenAI:", response);
      throw new Error("Failed to parse JSON response from OpenAI");
    }
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(
      JSON.stringify({
        error: (error as Error).message || "An error occurred during processing."
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
