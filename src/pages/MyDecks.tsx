import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { SlideDeck, convertDbSlidesToTypedSlides } from '@/types/deck';
import DeckList from '@/components/decks/DeckList';
import { Sparkles } from 'lucide-react';

const MyDecks = () => {
  const { user } = useAuth();
  const [decks, setDecks] = useState<SlideDeck[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) { navigate('/sign-in'); return; }
    fetchDecks();
  }, [user]);

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
