
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Function to search for images using Unsplash API
async function searchUnsplashImages(query: string, page = 1, perPage = 9) {
  const accessKey = Deno.env.get('UNSPLASH_ACCESS_KEY');
  
  if (!accessKey) {
    throw new Error('UNSPLASH_ACCESS_KEY is not set');
  }

  const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}`;
  
  const response = await fetch(url, {
    headers: {
      'Authorization': `Client-ID ${accessKey}`
    }
  });

  if (!response.ok) {
    throw new Error(`Unsplash API error: ${response.status}`);
  }

  const data = await response.json();
  
  // Transform the data to include only what we need
  return data.results.map((img: any) => ({
    id: img.id,
    url: img.urls.regular,
    smallUrl: img.urls.small,
    thumbUrl: img.urls.thumb,
    description: img.description || img.alt_description || 'Image from Unsplash',
    authorName: img.user.name,
    authorUsername: img.user.username,
    downloadUrl: img.links.download
  }));
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    console.log("search-images: Handling CORS preflight");
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { searchQuery, page, perPage } = await req.json();
    console.log("search-images: Received search query:", searchQuery);
    
    if (!searchQuery || searchQuery.trim() === '') {
      return new Response(
        JSON.stringify({ error: 'Search query cannot be empty' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const images = await searchUnsplashImages(
      searchQuery, 
      page || 1,
      perPage || 9
    );
    
    console.log(`search-images: Found ${images.length} images for query "${searchQuery}"`);
    
    return new Response(
      JSON.stringify({ images }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error("search-images: Error searching for images:", error);
    
    return new Response(
      JSON.stringify({ error: error.message || 'An error occurred during image search' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
