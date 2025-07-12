import React from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Undo, Redo, List, Grid, Eye } from 'lucide-react';

interface EditorToolbarProps {
  viewMode: 'list' | 'grid' | 'preview';
  onViewModeChange: (mode: 'list' | 'grid' | 'preview') => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

const EditorToolbar: React.FC<EditorToolbarProps> = ({
  viewMode,
  onViewModeChange,
  onUndo,
  onRedo,
  canUndo,
  canRedo
}) => {
  return (
    <div className="flex items-center gap-2">
      {/* Undo/Redo */}
      <div className="flex items-center border rounded-md">
        <Button
          variant="ghost"
          size="sm"
          onClick={onUndo}
          disabled={!canUndo}
          className="h-8 px-2 rounded-r-none border-r"
        >
          <Undo className="h-3 w-3" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onRedo}
          disabled={!canRedo}
          className="h-8 px-2 rounded-l-none"
        >
          <Redo className="h-3 w-3" />
        </Button>
      </div>

      {/* View Mode */}
      <Select value={viewMode} onValueChange={onViewModeChange}>
        <SelectTrigger className="w-32 h-8">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="list">
            <div className="flex items-center gap-2">
              <List className="h-3 w-3" />
              List View
            </div>
          </SelectItem>
          <SelectItem value="grid">
            <div className="flex items-center gap-2">
              <Grid className="h-3 w-3" />
              Grid View
            </div>
          </SelectItem>
          <SelectItem value="preview">
            <div className="flex items-center gap-2">
              <Eye className="h-3 w-3" />
              Preview
            </div>
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default EditorToolbar;