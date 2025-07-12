import React from 'react';
import { Button } from '@/components/ui/button';
import { Save, Download, Share2 } from 'lucide-react';

interface ActionButtonsProps {
  onSave?: () => void;
  onExport?: () => void;
  onShare?: () => void;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({
  onSave,
  onExport,
  onShare
}) => {
  return (
    <div className="flex items-center gap-2">
      {onSave && (
        <Button
          variant="outline"
          size="sm"
          onClick={onSave}
          className="flex items-center gap-1"
        >
          <Save className="h-3 w-3" />
          Save
        </Button>
      )}

      {onExport && (
        <Button
          variant="outline"
          size="sm"
          onClick={onExport}
          className="flex items-center gap-1"
        >
          <Download className="h-3 w-3" />
          Export
        </Button>
      )}

      {onShare && (
        <Button
          variant="outline"
          size="sm"
          onClick={onShare}
          className="flex items-center gap-1"
        >
          <Share2 className="h-3 w-3" />
          Share
        </Button>
      )}
    </div>
  );
};

export default ActionButtons;