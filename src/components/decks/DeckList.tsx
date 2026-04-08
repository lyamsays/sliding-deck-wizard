import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import { Play, Pencil, Trash2, Copy, Link2, MoreHorizontal, Plus } from 'lucide-react';
import { SlideDeck } from '@/types/deck';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import PresentMode from '@/components/slides/PresentMode';

interface DeckListProps {
  decks: SlideDeck[];
  onViewDeck: (deck: SlideDeck) => void;
  onDeleteDeck: (id: string) => void;
  deleting: string | null;
  onDecksChange?: (decks: SlideDeck[]) => void;
}

const DeckList = ({ decks, onViewDeck, onDeleteDeck, deleting, onDecksChange }: DeckListProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [presentingDeck, setPresentingDeck] = useState<SlideDeck | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [duplicating, setDuplicating] = useState<string | null>(null);
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  const handleContinueEditing = (deck: SlideDeck) => {
    navigate('/create', { state: { deck } });
  };

  const handleCopyLink = (deck: SlideDeck) => {
    const url = `${window.location.origin}/deck/${deck.id}`;
    navigator.clipboard.writeText(url).then(() => {
      toast({ title: 'Link copied!', description: 'Share this link with anyone.' });
    });
    setOpenMenu(null);
  };

  const handleDuplicate = async (deck: SlideDeck) => {
    setDuplicating(deck.id);
    setOpenMenu(null);
    try {
      const { data, error } = await supabase
        .from('slide_decks')
        .insert({ title: `${deck.title} (copy)`, slides: deck.slides as any, user_id: deck.user_id })
        .select()
        .single();
      if (error) throw error;
      const newDeck: SlideDeck = { ...deck, id: data.id, title: data.title, created_at: data.created_at, updated_at: data.updated_at };
      onDecksChange?.([newDeck, ...decks]);
      toast({ title: 'Deck duplicated' });
    } catch (err: any) {
      toast({ title: 'Duplicate failed', description: err.message, variant: 'destructive' });
    } finally {
      setDuplicating(null);
    }
  };

  const handleDeleteConfirm = (id: string) => {
    setConfirmDelete(null);
    setOpenMenu(null);
    onDeleteDeck(id);
  };

  if (decks.length === 0) return null;

  return (
    <>
      {presentingDeck && (
        <PresentMode slides={presentingDeck.slides} onClose={() => setPresentingDeck(null)} />
      )}

      {/* Delete confirm modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setConfirmDelete(null)}>
          <div className="bg-background rounded-2xl p-6 shadow-xl border border-border max-w-sm mx-4" onClick={e => e.stopPropagation()}>
            <h3 className="font-semibold text-foreground mb-2">Delete this deck?</h3>
            <p className="text-sm text-muted-foreground mb-4">This can't be undone.</p>
            <div className="flex gap-2 justify-end">
              <button onClick={() => setConfirmDelete(null)} className="px-4 py-2 rounded-lg border border-border text-sm hover:bg-muted transition-colors">Cancel</button>
              <button onClick={() => handleDeleteConfirm(confirmDelete)} className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm hover:bg-red-700 transition-colors" disabled={deleting === confirmDelete}>
                {deleting === confirmDelete ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {decks.map(deck => {
          const firstSlide = deck.slides?.[0];
          const bg = firstSlide?.style?.backgroundColor || '#1e1b4b';
          const accent = firstSlide?.style?.accentColor || '#7c3aed';
          const textColor = firstSlide?.style?.textColor || '#ffffff';
          const bgStyle = bg.includes('gradient') ? { background: bg } : { backgroundColor: bg };

          return (
            <div key={deck.id} className="group relative bg-background rounded-2xl border border-border hover:border-primary/40 hover:shadow-md transition-all overflow-hidden">
              {/* Slide thumbnail */}
              <div
                className="relative cursor-pointer"
                style={{ ...bgStyle, aspectRatio: '16/9' }}
                onClick={() => handleContinueEditing(deck)}
              >
                <div className="absolute left-0 top-0 bottom-0 w-1" style={{ backgroundColor: accent }} />
                <div className="absolute inset-0 flex flex-col justify-center" style={{ padding: '8% 8% 8% 6%' }}>
                  {firstSlide?.subtitle && (
                    <div style={{ color: accent, fontSize: '5px', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '5px', opacity: 0.85 }}>
                      {firstSlide.subtitle}
                    </div>
                  )}
                  <div style={{ color: textColor, fontSize: '9px', fontWeight: 800, lineHeight: 1.2, fontFamily: firstSlide?.style?.titleFont || 'Inter, sans-serif' }}>
                    {firstSlide?.title || deck.title}
                  </div>
                  {deck.slides.length > 1 && (
                    <div style={{ color: textColor, fontSize: '5px', opacity: 0.5, marginTop: '5px' }}>
                      {deck.slides.length} slides
                    </div>
                  )}
                </div>
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="bg-white/90 rounded-lg px-3 py-1.5 text-xs font-semibold text-gray-800 flex items-center gap-1.5">
                    <Pencil className="h-3 w-3" /> Continue editing
                  </div>
                </div>
              </div>

              {/* Card footer */}
              <div className="p-3">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-sm text-foreground truncate">{deck.title}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {deck.slides.length} slides · {formatDistanceToNow(new Date(deck.updated_at || deck.created_at), { addSuffix: true })}
                    </p>
                  </div>

                  {/* Action menu */}
                  <div className="relative">
                    <button
                      onClick={() => setOpenMenu(openMenu === deck.id ? null : deck.id)}
                      className="p-1.5 rounded-lg hover:bg-muted transition-colors"
                    >
                      <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                    </button>

                    {openMenu === deck.id && (
                      <>
                        <div className="fixed inset-0 z-30" onClick={() => setOpenMenu(null)} />
                        <div className="absolute right-0 top-full mt-1 z-40 bg-background border border-border rounded-xl shadow-xl py-1 w-44">
                          <button onClick={() => handleContinueEditing(deck)} className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted transition-colors">
                            <Pencil className="h-3.5 w-3.5" /> Continue editing
                          </button>
                          <button onClick={() => { setPresentingDeck(deck); setOpenMenu(null); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted transition-colors">
                            <Play className="h-3.5 w-3.5" /> Present
                          </button>
                          <button onClick={() => handleCopyLink(deck)} className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted transition-colors">
                            <Link2 className="h-3.5 w-3.5" /> Copy share link
                          </button>
                          <button onClick={() => handleDuplicate(deck)} disabled={duplicating === deck.id} className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted transition-colors disabled:opacity-50">
                            <Copy className="h-3.5 w-3.5" /> {duplicating === deck.id ? 'Duplicating...' : 'Duplicate'}
                          </button>
                          <div className="my-1 border-t border-border" />
                          <button onClick={() => { setConfirmDelete(deck.id); setOpenMenu(null); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-red-50 text-red-600 transition-colors">
                            <Trash2 className="h-3.5 w-3.5" /> Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Quick actions */}
                <div className="flex gap-2 mt-2.5">
                  <button onClick={() => handleContinueEditing(deck)} className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors">
                    <Pencil className="h-3 w-3" /> Edit
                  </button>
                  <button onClick={() => { setPresentingDeck(deck); }} className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg border border-border text-xs font-medium hover:bg-muted transition-colors">
                    <Play className="h-3 w-3" /> Present
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {/* Create new deck card */}
        <button
          onClick={() => navigate('/create')}
          className="relative bg-background rounded-2xl border-2 border-dashed border-border hover:border-primary/50 hover:bg-primary/5 transition-all flex flex-col items-center justify-center gap-3 p-8 text-center group"
          style={{ minHeight: '200px' }}
        >
          <div className="w-10 h-10 rounded-full bg-primary/10 group-hover:bg-primary/20 flex items-center justify-center transition-colors">
            <Plus className="h-5 w-5 text-primary" />
          </div>
          <div>
            <div className="font-semibold text-sm text-foreground">New presentation</div>
            <div className="text-xs text-muted-foreground mt-0.5">Generate from your notes</div>
          </div>
        </button>
      </div>
    </>
  );
};

export default DeckList;
