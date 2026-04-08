const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';
const ANTHROPIC_MODEL = 'claude-sonnet-4-6';

function buildSystemPrompt(role: string, audience: string, tone: string, purpose: string): string {
  const roleContext: Record<string, string> = {
    'Professor': 'a university professor preparing lecture slides for higher education students',
    'K-12 Teacher': 'a K-12 classroom teacher creating engaging lesson presentations',
    'Corporate Trainer': 'a corporate trainer developing professional development content',
    'Researcher': 'an academic researcher presenting findings to a scholarly audience',
    'Consultant': 'a management consultant preparing client-facing strategy presentations',
  };

  const audienceContext: Record<string, string> = {
    'Undergraduates': 'undergraduate students (ages 18-22) who need foundational concepts explained clearly with concrete examples',
    'Graduate Students': 'graduate-level students with strong domain knowledge who expect rigorous, detailed content',
    'PhD Students': 'doctoral researchers who expect precise academic language, citations, and methodological depth',
    'High School Students': 'high school students (ages 14-18) who need engaging, accessible explanations with relatable examples',
    'Middle School Students': 'middle school students (ages 11-14) who need simple, visual, and highly engaging content',
    'Corporate Professionals': 'business professionals who value concise, data-driven insights with clear action items',
    'Executive Leadership': 'C-suite executives who need high-level strategic summaries with strong ROI framing',
    'General Audience': 'a general mixed audience — use clear, jargon-free language and strong visuals',
  };

  const purposeContext: Record<string, string> = {
    'Lecture / Class': 'a classroom lecture — structure content for progressive learning with clear takeaways per slide',
    'Research Presentation': 'an academic research presentation — include methodology, findings, and implications',
    'Course Introduction': 'a course/syllabus introduction — set expectations, outline topics, and motivate the subject',
    'Exam Review': 'an exam review session — emphasize key concepts, definitions, formulas, and common pitfalls',
    'Workshop': 'an interactive workshop — include activities, discussion prompts, and hands-on exercises',
    'Keynote / Talk': 'a keynote presentation — build a compelling narrative arc with memorable moments',
    'Consulting Report': 'a client-facing consulting presentation — lead with the insight, support with data, end with recommendations',
    'Conference Paper': 'an academic conference presentation — concise, precise, and peer-credible',
  };

  const toneMap: Record<string, string> = {
    'Academic': 'Use formal academic language, precise terminology, and cite evidence where relevant.',
    'Conversational': 'Use a warm, accessible tone. Write as if speaking directly to the audience.',
    'Professional': 'Use clear, polished business language. Confident and authoritative.',
    'Engaging': 'Use dynamic, energetic language. Ask rhetorical questions. Create curiosity.',
    'Formal': 'Use strictly formal language, appropriate for official or institutional settings.',
  };

  const roleDesc = roleContext[role] || `a professional creating a ${purpose || 'presentation'}`;
  const audienceDesc = audienceContext[audience] || 'a general audience';
  const purposeDesc = purposeContext[purpose] || 'a professional presentation';
  const toneDesc = toneMap[tone] || 'Use a professional, clear tone.';

  return `You are an expert presentation designer and educator working as ${roleDesc}.

YOUR TASK: Transform the provided content into a polished, professional slide deck tailored for ${audienceDesc}.

This presentation is for ${purposeDesc}.

TONE: ${toneDesc}

SLIDE DESIGN PRINCIPLES:
- Each slide covers ONE clear idea with substance. Do not over-simplify.
- Titles: maximum 8 words, punchy and specific — a claim or question, not a generic label.
- Bullets: 3-4 per content slide. Each bullet is one concrete, evidence-based insight under 20 words.
- Use real numbers, specific findings, and named researchers/studies — never vague generalities.
- Bullets should be dense with value: a professor should be able to teach from them directly.
- First slide: compelling title slide that frames the lecture's central argument.
- Last slide: actionable synthesis — what students should walk away knowing/doing.
- Vary slide types: title, content, data/stat, quote, summary.

WHAT GOES ON SLIDES vs IN SPEAKER NOTES:
SLIDES get: the key facts, statistics, named concepts, and evidence that anchor the lecture.
  Good bullet: "Spaced repetition yields 80% better retention than massed practice (Cepeda et al., 2006)"
  Good bullet: "70% of wrongful convictions involve mistaken eyewitness identification"

SPEAKER NOTES get: the elaboration, stories, transitions, and pedagogical moves — NOT a restatement of the bullets.
  Bad notes: "As I mentioned on this slide, spaced repetition is better than cramming..."
  Good notes: "Draw a forgetting curve on the board here. Ask: how many of you crammed for your last exam? Then tell them about Ebbinghaus testing himself on nonsense syllables..."

SPEAKER NOTES — 3-4 sentences max per slide:
- Write in first person as the professor speaking.
- One concrete example or story not already on the slide.
- A specific pedagogical move (discussion question, activity, pause point).
- A transition sentence to the next slide.

IMAGE SUGGESTIONS:
- Suggest a specific, concrete Unsplash-searchable photograph or illustration
- Example: "aerial view of university campus at sunset" not "education image"
- Example: "data scientist working at computer with multiple screens" not "technology"
- Be specific enough that a photo search will return a great, relevant result

OUTPUT FORMAT — Return ONLY valid JSON, no markdown, no backticks, no explanation text before or after:
{
  "deckTitle": "The main title of the presentation",
  "slides": [
    {
      "title": "Slide title max 8 words",
      "subtitle": "Optional subtitle for title slides or null",
      "bullets": [
        "First specific evidence-based bullet point",
        "Second bullet with concrete detail",
        "Third bullet that is actionable or insightful"
      ],
      "speakerNotes": "Speaker notes that help the presenter teach this slide effectively. Include transitions, examples, and pedagogical cues for the specific audience.",
      "visualSuggestion": "Specific searchable Unsplash photo description",
      "slideType": "title"
    }
  ]
}

slideType must be one of: title, content, data, quote, summary, split`;
}

function buildNarrativeSystemPrompt(): string {
  return `You are a professional presentation coach and academic writing expert.

Analyze the provided slide deck and generate two things:

1. A PITCH SUMMARY (2-3 paragraphs) — an opening monologue the presenter uses to introduce the entire presentation. Written in first person, as if the presenter is speaking. Persuasive, clear, and appropriate for the audience.

2. SLIDE-BY-SLIDE SPEAKER NOTES — for each slide, 2-4 sentences the presenter should say. Written in first person, natural spoken language. Expand on the bullets rather than repeating them. Include transitions between slides. For educational content, include moments to pause or check understanding.

Return ONLY this exact format:

🎙 Pitch Summary:
[Your pitch summary paragraphs]

📝 Speaker Notes:

**Slide 1 – [Title]:**
[Notes written in first person]

**Slide 2 – [Title]:**
[Notes written in first person]`;
}

(globalThis as any).Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const ANTHROPIC_API_KEY = (globalThis as any).Deno?.env?.get('ANTHROPIC_API_KEY');
    if (!ANTHROPIC_API_KEY) {
      console.error('Missing ANTHROPIC_API_KEY');
      throw new Error('Missing ANTHROPIC_API_KEY — add it to Supabase Edge Function secrets');
    }

    const requestData = await req.json();
    const { content, mode } = requestData;

    if (!content || content.trim() === '') {
      throw new Error('Content is required to generate slides');
    }

    // ── NARRATIVE MODE ──────────────────────────────────────────────
    if (mode === 'narrative') {
      console.log('generate-slides: narrative mode');
      const response = await fetch(ANTHROPIC_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': ANTHROPIC_API_KEY,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: ANTHROPIC_MODEL,
          max_tokens: 2048,
          system: buildNarrativeSystemPrompt(),
          messages: [{ role: 'user', content }],
        }),
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(`Claude API error: ${err.error?.message || 'Unknown error'}`);
      }

      const result = await response.json();
      const responseText = result.content?.[0]?.text || '';

      const pitchSummaryMatch = responseText.match(/🎙 Pitch Summary:([\s\S]*?)(?:📝 Speaker Notes:)/);
      const pitchSummary = pitchSummaryMatch ? pitchSummaryMatch[1].trim() : '';
      const slideNotesSection = responseText.split('📝 Speaker Notes:')[1] || '';
      const slideNoteMatches = slideNotesSection.match(/\*\*Slide \d+ – .*?\*\*:([\s\S]*?)(?=\*\*Slide \d+|$)/g) || [];
      const slideNotes = slideNoteMatches.map((match: string) => {
        return (match.split('*:')[1] || '').trim();
      });

      return new Response(
        JSON.stringify({ narrative: { pitchSummary, slideNotes } }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // ── SLIDE GENERATION MODE ────────────────────────────────────────
    const {
      role = 'Professor',
      audience = 'Undergraduates',
      tone = 'Academic',
      purpose = 'Lecture / Class',
      numSlides = 8,
    } = requestData;

    console.log(`generate-slides: role=${role} | audience=${audience} | purpose=${purpose} | tone=${tone}`);

    const systemPrompt = buildSystemPrompt(role, audience, tone, purpose);
    const userMessage = `Create a ${numSlides}-slide presentation from the content below. Extract key ideas, structure them logically, and write slides that genuinely help the audience learn and retain this material.

CONTENT:
---
${content}
---

Return ONLY valid JSON. No markdown. No extra text outside the JSON object.`;

    const response = await fetch(ANTHROPIC_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: ANTHROPIC_MODEL,
        max_tokens: 4096,
        system: systemPrompt,
        messages: [{ role: 'user', content: userMessage }],
      }),
    });

    if (!response.ok) {
      const err = await response.json();
      console.error('Claude API error:', err);
      throw new Error(`Claude API error (${response.status}): ${err.error?.message || 'Unknown error'}`);
    }

    const result = await response.json();
    const rawText = result.content?.[0]?.text || '';
    console.log('generate-slides: response length:', rawText.length);

    let cleanedText = rawText.trim();
    const fenceMatch = cleanedText.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
    if (fenceMatch) cleanedText = fenceMatch[1];

    let parsed: any;
    try {
      parsed = JSON.parse(cleanedText);
    } catch (parseErr) {
      console.error('JSON parse failed. Raw:', rawText.substring(0, 300));
      throw new Error('Failed to parse response from Claude. Please try again.');
    }

    if (!parsed.slides || !Array.isArray(parsed.slides) || parsed.slides.length === 0) {
      throw new Error('Invalid response from Claude — no slides found');
    }

    console.log('generate-slides: success —', parsed.slides.length, 'slides generated');

    return new Response(
      JSON.stringify(parsed),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('generate-slides error:', error);
    return new Response(
      JSON.stringify({ error: (error as Error).message || 'An error occurred during slide generation.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
