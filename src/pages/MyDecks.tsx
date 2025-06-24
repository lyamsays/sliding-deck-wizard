
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { SlideDeck, convertDbSlidesToTypedSlides } from '@/types/deck';
import DeckList from '@/components/decks/DeckList';
import DeckViewer from '@/components/decks/DeckViewer';
import EmptyDeckState from '@/components/decks/EmptyDeckState';
import LoadingDecks from '@/components/decks/LoadingDecks';

// Define interface for user feedback data
interface UserFeedback {
  id: string;
  user_id: string;
  feedback: string;
  created_at: string;
}

const MyDecks = () => {
  const { user } = useAuth();
  const [decks, setDecks] = useState<SlideDeck[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDeck, setSelectedDeck] = useState<SlideDeck | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [feedbackSubmitted, setFeedbackSubmitted] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [submittingFeedback, setSubmittingFeedback] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/signin');
      return;
    }

    const fetchDecks = async () => {
      try {
        const { data: decksData, error: decksError } = await supabase
          .from('slide_decks')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (decksError) throw decksError;
        
        // Convert the database results to the properly typed SlideDeck[]
        const typedDecks: SlideDeck[] = decksData.map(deck => ({
          id: deck.id,
          title: deck.title,
          created_at: deck.created_at,
          updated_at: deck.updated_at,
          user_id: deck.user_id,
          slides: convertDbSlidesToTypedSlides(deck.slides)
        }));
        
        setDecks(typedDecks);
        
        // Check if feedback has been submitted
        const { data: feedbackData, error: feedbackError } = await supabase
          .from('user_feedback')
          .select('*')
          .eq('user_id', user.id);
        
        if (feedbackError) {
          console.error('Error checking feedback:', feedbackError);
          setFeedbackSubmitted(false);
        } else if (feedbackData && feedbackData.length > 0) {
          setFeedbackSubmitted(true);
        } else {
          setFeedbackSubmitted(false);
        }
        
        // Show feedback dialog if they have one deck and haven't submitted feedback yet
        if (typedDecks.length === 1 && !feedbackSubmitted && !localStorage.getItem('feedbackShown')) {
          localStorage.setItem('feedbackShown', 'true');
          setFeedbackOpen(true);
        }
        
      } catch (error) {
        const err = error as Error;
        console.error('Error fetching decks:', err);
        toast({
          title: "Failed to load decks",
          description: err.message || "An error occurred while fetching your slide decks.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDecks();
  }, [user, navigate, toast, feedbackSubmitted]);

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
    } catch (error) {
      const err = error as Error;
      console.error('Error deleting deck:', err);
      toast({
        title: "Delete failed",
        description: err.message || "Failed to delete the slide deck. Please try again.",
        variant: "destructive"
      });
    } finally {
      setDeleting(null);
    }
  };

  const handleSubmitFeedback = async () => {
    if (!feedback.trim() || !user) return;
    
    setSubmittingFeedback(true);
    
    try {
      const { error } = await supabase
        .from('user_feedback')
        .insert([
          { user_id: user.id, feedback, created_at: new Date().toISOString() }
        ]);
      
      if (error) throw error;
      
      setFeedbackSubmitted(true);
      setFeedbackOpen(false);
      
      toast({
        title: "Thank you for your feedback!",
        description: "Your input helps us improve Sliding.io.",
      });
    } catch (error) {
      const err = error as Error;
      console.error('Error submitting feedback:', err);
      toast({
        title: "Failed to submit feedback",
        description: err.message || "An error occurred while submitting your feedback. Please try again.",
        variant: "destructive"
      });
    } finally {
      setSubmittingFeedback(false);
    }
  };

  const canCreateMoreDecks = decks.length < 3 || feedbackSubmitted;

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
            
            {decks.length >= 3 && !feedbackSubmitted && (
              <div className="mt-4 bg-amber-50 text-amber-800 p-4 rounded-md inline-block">
                <p className="font-medium">
                  You've reached the limit of 3 slide decks. Please provide feedback to create more.
                </p>
                <Button 
                  variant="outline" 
                  className="mt-2 border-amber-400 hover:bg-amber-100"
                  onClick={() => setFeedbackOpen(true)}
                >
                  Provide Feedback
                </Button>
              </div>
            )}
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
                      <Button 
                        onClick={() => navigate('/create')}
                        disabled={!canCreateMoreDecks}
                      >
                        Create New Slides
                      </Button>
                      {decks.length > 0 && !feedbackSubmitted && (
                        <Button 
                          variant="outline" 
                          className="ml-2"
                          onClick={() => setFeedbackOpen(true)}
                        >
                          Provide Feedback
                        </Button>
                      )}
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
      
      <Dialog open={feedbackOpen} onOpenChange={setFeedbackOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Help us improve Sliding.io</DialogTitle>
            <DialogDescription>
              Your feedback helps us make Sliding.io better. After submitting feedback, you'll be able to create more than 3 slide decks.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="feedback">Your feedback</Label>
              <Textarea 
                id="feedback" 
                placeholder="What did you like? What could be improved?" 
                className="h-32"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setFeedbackOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmitFeedback} 
              disabled={!feedback.trim() || submittingFeedback}
            >
              {submittingFeedback ? 'Submitting...' : 'Submit Feedback'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Footer />
    </div>
  );
};

export default MyDecks;
