
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SlideDeck } from '@/types/deck';
import DeckList from '@/components/decks/DeckList';
import DeckViewer from '@/components/decks/DeckViewer';
import EmptyDeckState from '@/components/decks/EmptyDeckState';
import LoadingDecks from '@/components/decks/LoadingDecks';

const MyDecks = () => {
  const { user } = useAuth();
  const [decks, setDecks] = useState<SlideDeck[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDeck, setSelectedDeck] = useState<SlideDeck | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/signin');
      return;
    }

    const fetchDecks = async () => {
      try {
        const { data, error } = await supabase
          .from('slide_decks')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        setDecks(data as SlideDeck[]);
      } catch (error: any) {
        console.error('Error fetching decks:', error);
        toast({
          title: "Failed to load decks",
          description: error.message || "An error occurred while fetching your slide decks.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDecks();
  }, [user, navigate, toast]);

  const handleViewDeck = (deck: SlideDeck) => {
    setSelectedDeck(deck);
  };

  const handleDeleteDeck = async (id: string) => {
    setDeleting(id);
    
    try {
      const { error } = await supabase
        .from('slide_decks')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      // Remove the deleted deck from the state
      setDecks(decks.filter(deck => deck.id !== id));
      
      // If the deleted deck was being viewed, close the view
      if (selectedDeck && selectedDeck.id === id) {
        setSelectedDeck(null);
      }
      
      toast({
        title: "Deck deleted",
        description: "The slide deck was successfully deleted.",
      });
    } catch (error: any) {
      console.error('Error deleting deck:', error);
      toast({
        title: "Delete failed",
        description: error.message || "Failed to delete the slide deck. Please try again.",
        variant: "destructive"
      });
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-12 md:py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10 animate-fade-in">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
              My Slide <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-400">Decks</span>
            </h1>
            <p className="mt-4 text-lg text-gray-600">
              View and manage all your saved slide decks.
            </p>
          </div>
          
          <div className="mt-8">
            {loading ? (
              <LoadingDecks />
            ) : decks.length === 0 ? (
              <EmptyDeckState />
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className={`lg:col-span-${selectedDeck ? '1' : '3'}`}>
                  <Card>
                    <CardHeader>
                      <CardTitle>Your Slide Decks</CardTitle>
                      <CardDescription>
                        You have {decks.length} saved {decks.length === 1 ? 'deck' : 'decks'}.
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <DeckList 
                        decks={decks} 
                        onViewDeck={handleViewDeck} 
                        onDeleteDeck={handleDeleteDeck}
                        deleting={deleting}
                      />
                    </CardContent>
                    <CardFooter>
                      <Button onClick={() => navigate('/create')}>
                        Create New Slides
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
                
                {selectedDeck && (
                  <div className="lg:col-span-2">
                    <DeckViewer 
                      deck={selectedDeck} 
                      onClose={() => setSelectedDeck(null)}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default MyDecks;
