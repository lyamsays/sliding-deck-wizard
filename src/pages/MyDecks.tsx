import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { SlideDeck, convertDbSlidesToTypedSlides } from '@/types/deck';
import DeckList from '@/components/decks/DeckList';
import { Sparkles, Zap } from 'lucide-react';
import { usePlan, FREE_DECK_LIMIT } from '@/hooks/usePlan';

const MyDecks = () => {
  const { user, loading: authLoading } = useAuth();
  const [decks, setDecks] = useState<SlideDeck[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const { isPro, deckCount } = usePlan();

  useEffect(() => {
    if (authLoading) return;
    if (!user) { navigate('/sign-in'); return; }
    fetchDecks();
  }, [user, authLoading]);

  const fetchDecks = async () => {
    try {
      const { data, error } = await supabase
        .from('slide_decks')
        .select('*')
        .order('updated_at', { ascending: false });
      if (error) throw error;
      setDecks(data.map(d => ({
        id: d.id, title: d.title,
        created_at: d.created_at, updated_at: d.updated_at, user_id: d.user_id,
        slides: d.slides ? convertDbSlidesToTypedSlides(d.slides as unknown[]) : []
      })));
    } catch (err: any) {
      toast({ title: 'Failed to load decks', description: err.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteDeck = async (id: string) => {
    setDeleting(id);
    try {
      const { error } = await supabase.from('slide_decks').delete().eq('id', id);
      if (error) throw error;
      setDecks(d => d.filter(deck => deck.id !== id));
      toast({ title: 'Deck deleted' });
    } catch (err: any) {
      toast({ title: 'Delete failed', description: err.message, variant: 'destructive' });
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 py-10 px-4">
        <div className="max-w-6xl mx-auto">

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-foreground">My Presentations</h1>
              <p className="text-sm text-muted-foreground mt-0.5">
                {loading ? 'Loading...' : `${decks.length} saved deck${decks.length !== 1 ? 's' : ''}`}
              </p>
            </div>
            <button
              onClick={() => navigate('/create')}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-xl text-sm font-medium transition-colors shadow-sm"
            >
              <Sparkles className="h-4 w-4" />
              New presentation
            </button>
          </div>

          {/* Upgrade banner — show when at or near free limit */}
          {!isPro && deckCount >= FREE_DECK_LIMIT && (
            <div className="mb-6 bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-center justify-between gap-4">
              <div>
                <div className="font-semibold text-amber-800 text-sm">You've used {deckCount} of {FREE_DECK_LIMIT} free presentations this month</div>
                <div className="text-amber-700 text-xs mt-0.5">Upgrade to Educator Pro for unlimited presentations.</div>
              </div>
              <a href="/pricing" className="flex-shrink-0 flex items-center gap-1.5 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors">
                <Zap className="h-3.5 w-3.5" /> Upgrade
              </a>
            </div>
          )}
          {!isPro && deckCount === FREE_DECK_LIMIT - 1 && (
            <div className="mb-6 bg-blue-50 border border-blue-100 rounded-xl p-3 flex items-center justify-between gap-4">
              <div className="text-blue-700 text-xs">1 free presentation remaining this month.</div>
              <a href="/pricing" className="flex-shrink-0 text-blue-600 text-xs font-semibold hover:underline">See Pro →</a>
            </div>
          )}

          {/* Content */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="rounded-2xl border border-border overflow-hidden animate-pulse">
                  <div className="bg-muted" style={{ aspectRatio: '16/9' }} />
                  <div className="p-3 space-y-2">
                    <div className="h-4 bg-muted rounded w-3/4" />
                    <div className="h-3 bg-muted rounded w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <DeckList
              decks={decks}
              onViewDeck={() => {}}
              onDeleteDeck={handleDeleteDeck}
              deleting={deleting}
              onDecksChange={setDecks}
            />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MyDecks;
