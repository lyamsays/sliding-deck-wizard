const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function extractSearchQuery(prompt: string, slideTitle: string): string {
  // Use slide title as primary search signal, clean it up for Unsplash
  const base = slideTitle && slideTitle.trim().length > 3 ? slideTitle : prompt;
  
  // Remove academic/presentation-specific words that won't help image search
  const cleaned = base
    .replace(/\b(slide|presentation|lecture|chapter|module|section|week|part)\b/gi, '')
    .replace(/\b(introduction|overview|summary|conclusion|review)\b/gi, '')
    .replace(/[^a-zA-Z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  return cleaned.length > 3 ? cleaned : prompt.substring(0, 60);
}

(globalThis as any).Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const UNSPLASH_ACCESS_KEY = (globalThis as any).Deno?.env?.get('UNSPLASH_ACCESS_KEY');
    if (!UNSPLASH_ACCESS_KEY) {
      throw new Error('Missing UNSPLASH_ACCESS_KEY — add it to Supabase Edge Function secrets');
    }

    const { prompt, slideTitle } = await req.json();

    if (!prompt && !slideTitle) {
      return new Response(
        JSON.stringify({ error: 'prompt or slideTitle is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const searchQuery = extractSearchQuery(prompt || '', slideTitle || '');
    console.log(`generate-image: searching Unsplash for: "${searchQuery}"`);

    const url = new URL('https://api.unsplash.com/search/photos');
    url.searchParams.set('query', searchQuery);
    url.searchParams.set('per_page', '5');
    url.searchParams.set('orientation', 'landscape');
    url.searchParams.set('content_filter', 'high');

    const response = await fetch(url.toString(), {
      headers: {
        'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`,
        'Accept-Version': 'v1',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Unsplash API error:', response.status, errorText);
      throw new Error(`Unsplash API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.results || data.results.length === 0) {
      // Fallback: try a simpler, broader search
      console.log('generate-image: no results, trying fallback search');
      const fallbackQuery = searchQuery.split(' ').slice(0, 2).join(' ');
      const fallbackUrl = new URL('https://api.unsplash.com/search/photos');
      fallbackUrl.searchParams.set('query', fallbackQuery || 'education professional');
      fallbackUrl.searchParams.set('per_page', '3');
      fallbackUrl.searchParams.set('orientation', 'landscape');

      const fallbackResponse = await fetch(fallbackUrl.toString(), {
        headers: { 'Authorization': `Client-ID ${UNSPLASH_ACCESS_KEY}`, 'Accept-Version': 'v1' },
      });

      if (fallbackResponse.ok) {
        const fallbackData = await fallbackResponse.json();
        if (fallbackData.results && fallbackData.results.length > 0) {
          const photo = fallbackData.results[0];
          return new Response(
            JSON.stringify({
              imageUrl: photo.urls.regular,
              imageThumb: photo.urls.small,
              photographer: photo.user.name,
              photographerUrl: photo.user.links.html,
              unsplashUrl: photo.links.html,
            }),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
      }

      return new Response(
        JSON.stringify({ imageUrl: null, error: 'No images found' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Pick the best result — prefer photos with good dimensions
    const photo = data.results[0];

    console.log(`generate-image: found photo by ${photo.user.name} — ${photo.urls.regular}`);

    return new Response(
      JSON.stringify({
        imageUrl: photo.urls.regular,    // 1080px wide — perfect for slides
        imageThumb: photo.urls.small,    // 400px — for previews
        photographer: photo.user.name,
        photographerUrl: photo.user.links.html,
        unsplashUrl: photo.links.html,
        altDescription: photo.alt_description,
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('generate-image error:', error);
    return new Response(
      JSON.stringify({ error: (error as Error).message || 'Image fetch failed', imageUrl: null }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
