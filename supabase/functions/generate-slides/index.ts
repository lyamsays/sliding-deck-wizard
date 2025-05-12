import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Configuration, OpenAIApi } from "https://esm.sh/openai@3.2.1";

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
    const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY');
    if (!OPENAI_API_KEY) {
      throw new Error('Missing OpenAI API key');
    }

    const configuration = new Configuration({
      apiKey: OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);

    const requestData = await req.json();
    const { content, mode } = requestData;

    // Handle narrative mode generation
    if (mode === "narrative") {
      console.log("Generating narrative for slides...");

      const completion = await openai.createChatCompletion({
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content: `You are a professional AI presentation coach that helps create compelling narratives for slide decks.`
          },
          {
            role: "user",
            content
          }
        ],
        temperature: 0.7,
        max_tokens: 2000,
      });

      const response = completion.data.choices[0].message?.content || '';
      console.log("Generated narrative response");

      // Parse the response to separate pitch summary and slide notes
      const pitchSummaryMatch = response.match(/🎙 Pitch Summary:([\s\S]*?)(?:📝 Speaker Notes:)/);
      const pitchSummary = pitchSummaryMatch ? pitchSummaryMatch[1].trim() : '';

      // Extract individual slide notes
      const slideNotesSection = response.split('📝 Speaker Notes:')[1] || '';
      const slideNoteMatches = slideNotesSection.match(/\*\*Slide \d+ – .*?\*\*:([\s\S]*?)(?=\*\*Slide \d+|$)/g) || [];
      
      const slideNotes = slideNoteMatches.map(match => {
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

    // For all other modes, continue with existing implementation
    const {
      profession,
      purpose,
      tone,
      framework,
      themeId,
      editInstruction,
      singleSlide,
      autoGenerateImages
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

    const completion = await openai.createChatCompletion({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a professional presentation creator.
          You create slide decks from content.
          You are an expert in visual design and presentation structure.
          You always return valid JSON.
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
          Here is an example of the JSON you should return:
          \`\`\`json
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
          }
          \`\`\``,
        },
        { role: "user", content: prompt },
      ],
      temperature: 0.7,
      max_tokens: 2048,
    });

    const response = completion.data.choices[0].message?.content;

    if (!response) {
      throw new Error("No response from OpenAI");
    }

    console.log("Response from OpenAI", response);

    // try {
    const parsedResponse = JSON.parse(response);
    // } catch (error) {
    //   console.error("Error parsing JSON response:", error);
    //   console.error("Raw response from OpenAI:", response);
    //   throw new Error("Failed to parse JSON response from OpenAI. Check the console for the raw response.");
    // }

    if (!parsedResponse || !parsedResponse.slides) {
      throw new Error("Invalid response format from OpenAI");
    }

    if (singleSlide) {
      return new Response(
        JSON.stringify(parsedResponse),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify(parsedResponse),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("Error processing request:", error);
    return new Response(
      JSON.stringify({
        error: error.message || "An error occurred during processing."
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
