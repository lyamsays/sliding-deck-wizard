
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { RefreshCw, MessageSquare } from "lucide-react";
import { Slide } from '@/types/deck';

interface SlideEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  slide: Slide;
  onSlideUpdate: (updatedSlide: Slide) => void;
}

const SlideEditDialog: React.FC<SlideEditDialogProps> = ({ 
  open, 
  onOpenChange, 
  slide,
  onSlideUpdate
}) => {
  const [customInstruction, setCustomInstruction] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [editMode, setEditMode] = useState<string>("preset");
  const { toast } = useToast();
  
  const handlePresetEdit = async (preset: string) => {
    setIsProcessing(true);
    
    let instruction = "";
    switch (preset) {
      case "refine":
        instruction = "Make these bullet points more concise and impactful, keeping the same overall meaning.";
        break;
      case "examples":
        instruction = "Add relevant examples or case studies to these bullet points.";
        break;
      case "academic":
        instruction = "Rewrite these bullet points in a more academic, formal tone with proper terminology.";
        break;
      case "casual":
        instruction = "Rewrite these bullet points in a more conversational, accessible tone.";
        break;
      default:
        instruction = "Improve these bullet points.";
    }
    
    await processAiEdit(instruction);
  };
  
  const handleCustomEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (customInstruction.trim()) {
      setIsProcessing(true);
      await processAiEdit(customInstruction);
    }
  };
  
  const processAiEdit = async (instruction: string) => {
    try {
      // Create content for the AI to edit
      const slideContent = {
        title: slide.title,
        bullets: slide.bullets
      };
      
      toast({
        title: "Processing edit",
        description: "Applying your requested changes...",
      });
      
      const { data, error } = await supabase.functions.invoke('generate-slides', {
        body: { 
          content: JSON.stringify(slideContent),
          editInstruction: instruction,
          mode: "edit",
          singleSlide: true
        }
      });
      
      if (error) {
        throw new Error(error.message);
      }
      
      if (!data || !data.slides || !data.slides[0]) {
        throw new Error("Invalid response from AI");
      }
      
      // Update the slide with the AI-edited content
      const updatedSlide = {
        ...slide,
        bullets: data.slides[0].bullets,
      };
      
      // If there are speaker notes in the response, add them
      if (data.slides[0].speakerNotes) {
        updatedSlide.speakerNotes = data.slides[0].speakerNotes;
      }
      
      onSlideUpdate(updatedSlide);
      
      toast({
        title: "Edit complete",
        description: "The slide has been updated with AI suggestions.",
      });
      
      onOpenChange(false);
    } catch (error) {
      const err = error as Error;
      console.error("Error editing slide with AI:", err);
      toast({
        title: "Edit failed",
        description: err.message || "Failed to edit slide. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsProcessing(false);
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Improve this slide with AI</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="preset" value={editMode} onValueChange={setEditMode} className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="preset">Quick Edits</TabsTrigger>
            <TabsTrigger value="custom">Custom Instructions</TabsTrigger>
          </TabsList>
          
          <TabsContent value="preset" className="mt-4 space-y-4">
            <p className="text-sm text-gray-500">Choose how you'd like to improve this slide:</p>
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                onClick={() => handlePresetEdit("refine")}
                disabled={isProcessing}
                className="h-16"
              >
                Refine Bullet Points
              </Button>
              <Button 
                variant="outline" 
                onClick={() => handlePresetEdit("examples")}
                disabled={isProcessing}
                className="h-16"
              >
                Add Examples
              </Button>
              <Button 
                variant="outline" 
                onClick={() => handlePresetEdit("academic")}
                disabled={isProcessing}
                className="h-16"
              >
                More Academic Tone
              </Button>
              <Button 
                variant="outline" 
                onClick={() => handlePresetEdit("casual")}
                disabled={isProcessing}
                className="h-16"
              >
                More Conversational Tone
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="custom" className="mt-4">
            <form onSubmit={handleCustomEdit} className="space-y-4">
              <div>
                <p className="text-sm text-gray-500 mb-2">Tell me how to improve this slide:</p>
                <Textarea
                  placeholder="e.g., 'make it more engaging', 'add definitions', 'include examples'"
                  value={customInstruction}
                  onChange={(e) => setCustomInstruction(e.target.value)}
                  disabled={isProcessing}
                  className="min-h-[100px]"
                />
              </div>
              
              <Button 
                type="submit"
                disabled={isProcessing || !customInstruction.trim()} 
                className="w-full"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Apply Changes"
                )}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
        
        <DialogFooter className="flex items-center justify-between">
          <p className="text-xs text-gray-500">Powered by AI</p>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SlideEditDialog;
