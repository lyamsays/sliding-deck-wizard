import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { SlideDeck, convertDbSlidesToTypedSlides } from '@/types/deck';
import StyledSlide from '@/components/slides/StyledSlide';
import PresentMode from '@/components/slides/PresentMode';
import { Play, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import Logo from '@/components/Logo';

const SharedDeck = () => {
  const { deckId } = useParams<{ deckId: string }>();
  const [deck, setDeck] = useState<SlideDeck | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [presenting, setPresenting] = useState(false);

  useEffect(() => {
    if (!deckId) { setNotFound(true); setLoading(false); return; }
    supabase
      .from('slide_decks')
      .select('*')
      .eq('id', deckId)
      .single()
      .then(({ data, error }) => {
        if (error || !data) { setNotFound(true); }
        else {
          setDeck({
            id: data.id, title: data.title,
            created_at: data.created_at, updated_at: data.updated_at, user_id: data.user_id,
            slides: data.slides ? convertDbSlidesToTypedSlides(data.slides as unknown[]) : []
          });
        }
        setLoading(false);
      });
  }, [deckId]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary border-t-transparent" />
    </div>
  );

  if (notFound || !deck) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background text-center px-4">
      <h1 className="text-2xl font-bold mb-2">Presentation not found</h1>
      <p className="text-muted-foreground mb-6">This link may have expired or the deck was deleted.</p>
      <Link to="/" className="bg-primary text-primary-foreground px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors">
        Create your own slides
      </Link>
    </div>
  );

  const slide = deck.slides[currentIndex];
  const total = deck.slides.length;

  return (
    <>
      {presenting && <PresentMode slides={deck.slides} startIndex={currentIndex} onClose={() => setPresenting(false)} />}

      <div className="min-h-screen bg-gray-50 flex flex-col">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-100 px-4 py-3 flex items-center justify-between">
          <div className="min-w-0 flex-1">
            <h1 className="font-semibold text-sm text-gray-900 truncate">{deck.title}</h1>
            <p className="text-xs text-gray-400">{total} slides</p>
          </div>
          <div className="flex items-center gap-2 ml-4">
            <button
              onClick={() => setPresenting(true)}
              className="flex items-center gap-1.5 bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
            >
              <Play className="h-3.5 w-3.5" /> Present
            </button>
          </div>
        </header>

        {/* Slide viewer */}
        <main className="flex-1 flex flex-col items-center justify-center p-4 md:p-8">
          <div className="w-full max-w-4xl">
            <StyledSlide slide={slide} index={currentIndex} onSlideUpdate={() => {}} />

            {/* Speaker notes */}
            {slide?.speakerNotes && (
              <div className="mt-3 p-4 bg-white rounded-xl border border-gray-100 shadow-sm">
                <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-1.5">Speaker Notes</div>
                <p className="text-sm text-gray-600 leading-relaxed">{slide.speakerNotes}</p>
              </div>
            )}

            {/* Navigation */}
            <div className="flex items-center justify-between mt-4">
              <button
                onClick={() => setCurrentIndex(i => Math.max(0, i - 1))}
                disabled={currentIndex === 0}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium disabled:opacity-30 hover:bg-gray-50 transition-colors"
              >
                <ChevronLeft className="h-4 w-4" /> Prev
              </button>

              {/* Dot navigation */}
              <div className="flex items-center gap-1.5 flex-wrap justify-center">
                {deck.slides.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentIndex(i)}
                    className={`rounded-full transition-all ${i === currentIndex ? 'w-5 h-2 bg-purple-600' : 'w-2 h-2 bg-gray-300 hover:bg-gray-400'}`}
                  />
                ))}
              </div>

              <button
                onClick={() => setCurrentIndex(i => Math.min(total - 1, i + 1))}
                disabled={currentIndex === total - 1}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-gray-200 text-sm font-medium disabled:opacity-30 hover:bg-gray-50 transition-colors"
              >
                Next <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </main>

        {/* Footer watermark */}
        <footer className="py-4 text-center">
          <Link to="/" className="inline-flex items-center gap-2 text-xs text-gray-400 hover:text-gray-600 transition-colors">
            Made with <span className="flex items-center gap-1 font-semibold text-purple-600"><Sparkles className="h-3 w-3" /> Sliding.io</span>
          </Link>
        </footer>
      </div>
    </>
  );
};

export default SharedDeck;
