import { useState } from 'react';
import { Slide } from '@/types/deck';

export const useUndoRedo = (slides: Slide[], onSlidesChange: (slides: Slide[]) => void) => {
  const [undoStack, setUndoStack] = useState<Slide[][]>([]);
  const [redoStack, setRedoStack] = useState<Slide[][]>([]);

  const pushToUndoStack = (currentSlides: Slide[]) => {
    setUndoStack(prev => [...prev.slice(-9), currentSlides]); // Keep last 10 states
    setRedoStack([]); // Clear redo stack on new action
  };

  const handleUndo = () => {
    if (undoStack.length > 0) {
      const previousState = undoStack[undoStack.length - 1];
      setRedoStack(prev => [slides, ...prev]);
      setUndoStack(prev => prev.slice(0, -1));
      onSlidesChange(previousState);
    }
  };

  const handleRedo = () => {
    if (redoStack.length > 0) {
      const nextState = redoStack[0];
      setUndoStack(prev => [...prev, slides]);
      setRedoStack(prev => prev.slice(1));
      onSlidesChange(nextState);
    }
  };

  return {
    undoStack,
    redoStack,
    pushToUndoStack,
    handleUndo,
    handleRedo,
    canUndo: undoStack.length > 0,
    canRedo: redoStack.length > 0
  };
};