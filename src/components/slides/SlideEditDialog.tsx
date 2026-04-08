import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { RefreshCw, Wand2, Pencil, ChevronRight } from "lucide-react";
import { Slide } from '@/types/deck';

interface SlideEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  slide: Slide;
  onSlideUpdate: (updatedSlide: Slide) => void;
}

const QUICK_ACTIONS = [
  { id: 'refine',      label: 'Make bullets more concise',         icon: '✂️' },
  { id: 'examples',   label: 'Add real-world examples',            icon: '🔬' },
  { id: 'academic',   label: 'More academic & formal tone',        icon: '📖' },
  { id: 'accessible', label: 'Simpler language for undergrads',    icon: '🎓' },
  { id: 'evidence',   label: 'Add statistics & citations',         icon: '📊' },
  { id: 'notes',      label: 'Improve speaker notes',              icon: '🎤' },
];

const SlideEditDialog: React.FC<SlideEditDialogProps> = ({ open, onOpenChange, slide, onSlideUpdate }) => {
  const [mode, setMode] = useState<'choose' | 'custom' | 'regenerate'>('choose');
  const [instruction, setInstruction] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const { toast } = useToast();

  const reset = () => { setMode('choose'); setInstruction(''); };

  const runEdit = async (instr: string, fullRegenerate = false) => {
    setIsProcessing(true);
    try {
      toast({ title: fullRegenerate ? 'Regenerating slide...' : 'Applying edit...' });

      const { data, error } = await supabase.functions.invoke('generate-slides', {
        body: {
          content: fullRegenerate
            ? `Slide title: "${slide.title}"\n\nInstruction: ${instr}\n\nOriginal bullets:\n${(slide.bullets || []).map(b => `- ${b}`).join('\n')}`
            : JSON.stringify({ title: slide.title, bullets: slide.bullets, speakerNotes: slide.speakerNotes }),
          editInstruction: instr,
          mode: 'edit',
          singleSlide: true,
        }
      });

      if (error) throw new Error(error.message);
      if (!data?.slides?.[0]) throw new Error('No slide returned');

      const updated: Slide = {
        ...slide,
        ...(data.slides[0].title && fullRegenerate ? { title: data.slides[0].title } : {}),
        bullets: data.slides[0].bullets || slide.bullets,
        speakerNotes: data.slides[0].speakerNotes || slide.speakerNotes,
      };

      onSlideUpdate(updated);
      toast({ title: 'Slide updated ✓' });
      onOpenChange(false);
    } catch (err: any) {
      toast({ title: 'Edit failed', description: err.message, variant: 'destructive' });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) { reset(); } onOpenChange(v); }}>
      <DialogContent className="sm:max-w-[460px]">
        <DialogHeader>
          <DialogTitle className="text-base">
            {mode === 'choose' ? 'Edit slide' : mode === 'regenerate' ? 'Regenerate slide' : 'Custom instruction'}
          </DialogTitle>
        </DialogHeader>

        {mode === 'choose' && (
          <div className="space-y-4 mt-2">
            {/* Current slide preview */}
            <div className="rounded-xl p-3 border border-border bg-muted/30 text-sm">
              <div className="font-semibold text-foreground mb-1 text-xs">{slide.title}</div>
              {(slide.bullets || []).slice(0, 2).map((b, i) => (
                <div key={i} className="text-muted-foreground text-xs truncate">▸ {b}</div>
              ))}
              {(slide.bullets || []).length > 2 && <div className="text-muted-foreground text-xs">+{(slide.bullets||[]).length - 2} more</div>}
            </div>

            {/* Quick actions */}
            <div>
              <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Quick edit</div>
              <div className="grid grid-cols-2 gap-2">
                {QUICK_ACTIONS.map(a => (
                  <button
                    key={a.id}
                    onClick={() => runEdit(a.label)}
                    disabled={isProcessing}
                    className="flex items-center gap-2 text-left px-3 py-2.5 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-all text-sm disabled:opacity-50"
                  >
                    <span style={{ fontSize: '14px' }}>{a.icon}</span>
                    <span className="leading-tight text-xs">{a.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Other options */}
            <div className="flex gap-2 pt-1 border-t border-border">
              <button
                onClick={() => setMode('custom')}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border border-border hover:border-primary/50 hover:bg-primary/5 transition-all text-sm"
              >
                <Pencil className="h-3.5 w-3.5" />
                Custom instruction
              </button>
              <button
                onClick={() => setMode('regenerate')}
                className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg border border-border hover:border-purple-400/50 hover:bg-purple-50 transition-all text-sm text-purple-700"
              >
                <RefreshCw className="h-3.5 w-3.5" />
                Regenerate slide
              </button>
            </div>
          </div>
        )}

        {mode === 'custom' && (
          <div className="space-y-3 mt-2">
            <p className="text-sm text-muted-foreground">Tell the AI exactly how to change this slide:</p>
            <Textarea
              placeholder="e.g. 'Focus only on the retrieval stage of memory', 'Add the Atkinson–Shiffrin model', 'Make it suitable for PhD students'..."
              value={instruction}
              onChange={e => setInstruction(e.target.value)}
              disabled={isProcessing}
              className="min-h-[100px] text-sm"
              autoFocus
            />
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={reset} disabled={isProcessing}>← Back</Button>
              <Button size="sm" className="flex-1" onClick={() => runEdit(instruction)} disabled={isProcessing || !instruction.trim()}>
                {isProcessing ? <><RefreshCw className="h-3.5 w-3.5 mr-1.5 animate-spin" />Editing...</> : <><Wand2 className="h-3.5 w-3.5 mr-1.5" />Apply</>}
              </Button>
            </div>
          </div>
        )}

        {mode === 'regenerate' && (
          <div className="space-y-3 mt-2">
            <p className="text-sm text-muted-foreground">Completely rewrite this slide. Optionally give a direction:</p>
            <Textarea
              placeholder="Optional: 'Focus on the Ebbinghaus curve only', 'Make it a data-heavy statistics slide', 'Turn this into a question slide for discussion'..."
              value={instruction}
              onChange={e => setInstruction(e.target.value)}
              disabled={isProcessing}
              className="min-h-[90px] text-sm"
              autoFocus
            />
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={reset} disabled={isProcessing}>← Back</Button>
              <Button size="sm" className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                onClick={() => runEdit(instruction || 'Rewrite this slide with fresh content on the same topic', true)}
                disabled={isProcessing}>
                {isProcessing ? <><RefreshCw className="h-3.5 w-3.5 mr-1.5 animate-spin" />Regenerating...</> : <><RefreshCw className="h-3.5 w-3.5 mr-1.5" />Regenerate</>}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SlideEditDialog;
