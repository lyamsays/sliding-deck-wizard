import React from 'react';
import { Button } from "@/components/ui/button";
import { Theme } from './theme-types';
import { Badge } from "@/components/ui/badge";
import ThemePreview from './ThemePreview';
import { Link } from 'react-router-dom';

interface ThemeCardProps {
  theme: Theme;
  onApply: () => void;
}

const ThemeCard = ({ theme, onApply }: ThemeCardProps) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-border hover:border-primary/40 hover:shadow-md transition-all group">
      {/* Real slide preview using actual theme colors */}
      <ThemePreview themeId={theme.id} />

      <div className="p-4 bg-background">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-foreground">{theme.name}</h3>
          <div className="flex gap-1 flex-wrap justify-end">
            {theme.categories.slice(0, 2).map(cat => (
              <Badge key={cat} variant="secondary" className="text-xs capitalize">{cat}</Badge>
            ))}
          </div>
        </div>
        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">{theme.description}</p>
        <Button
          onClick={onApply}
          size="sm"
          className="w-full"
          variant="outline"
        >
          Use this theme
        </Button>
      </div>
    </div>
  );
};

export default ThemeCard;
