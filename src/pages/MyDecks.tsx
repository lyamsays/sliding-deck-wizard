
import React, { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from "@/components/ui/table";
import { Eye, Loader, Trash } from "lucide-react";
import { format } from "date-fns";

interface SlideDeck {
  id: string;
  title: string;
  slides: any[];
  created_at: string;
}

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
        
        setDecks(data || []);
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
              <div className="flex justify-center items-center py-20">
                <Loader className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-3 text-lg">Loading your slide decks...</span>
              </div>
            ) : decks.length === 0 ? (
              <div className="text-center py-20 bg-gray-50 rounded-lg border border-gray-100">
                <h3 className="text-xl font-medium text-gray-900">No slide decks yet</h3>
                <p className="mt-2 text-gray-600">
                  You haven't created any slide decks yet. Generate some slides to get started.
                </p>
                <Button 
                  className="mt-4" 
                  onClick={() => navigate('/create')}
                >
                  Create New Slides
                </Button>
              </div>
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
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Date Created</TableHead>
                            <TableHead>Slides</TableHead>
                            <TableHead>Actions</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {decks.map((deck) => (
                            <TableRow key={deck.id}>
                              <TableCell className="font-medium">{deck.title}</TableCell>
                              <TableCell>{format(new Date(deck.created_at), 'MMM d, yyyy')}</TableCell>
                              <TableCell>{deck.slides.length}</TableCell>
                              <TableCell>
                                <div className="flex space-x-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleViewDeck(deck)}
                                    className="flex items-center"
                                  >
                                    <Eye className="h-4 w-4 mr-1" />
                                    View
                                  </Button>
                                  <Button
                                    variant="destructive"
                                    size="sm"
                                    onClick={() => handleDeleteDeck(deck.id)}
                                    disabled={deleting === deck.id}
                                    className="flex items-center"
                                  >
                                    {deleting === deck.id ? (
                                      <Loader className="h-3 w-3 animate-spin mr-1" />
                                    ) : (
                                      <Trash className="h-3 w-3 mr-1" />
                                    )}
                                    Delete
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
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
                    <Card className="h-full">
                      <CardHeader>
                        <div className="flex justify-between items-center">
                          <div>
                            <CardTitle>{selectedDeck.title}</CardTitle>
                            <CardDescription>
                              Created on {format(new Date(selectedDeck.created_at), 'MMMM d, yyyy')}
                            </CardDescription>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => setSelectedDeck(null)}
                          >
                            Close
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-8 max-h-[700px] overflow-y-auto">
                        {selectedDeck.slides.map((slide, index) => (
                          <Card key={index} className="overflow-hidden shadow-sm">
                            <CardHeader className="bg-primary/5 py-4">
                              <CardTitle className="text-lg">
                                {slide.title}
                              </CardTitle>
                            </CardHeader>
                            <CardContent className="pt-4">
                              <ul className="space-y-2">
                                {slide.bullets.map((bullet: string, i: number) => (
                                  <li key={i} className="flex items-start">
                                    <span className="text-primary mr-2 mt-1">•</span>
                                    <span>{bullet}</span>
                                  </li>
                                ))}
                              </ul>
                            </CardContent>
                          </Card>
                        ))}
                      </CardContent>
                    </Card>
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
