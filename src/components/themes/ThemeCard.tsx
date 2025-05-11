
import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Theme } from './theme-types';
import { Badge } from "@/components/ui/badge";
import { Palette } from 'lucide-react';

interface ThemeCardProps {
  theme: Theme;
  onApply: () => void;
}

const ThemeCard = ({ theme, onApply }: ThemeCardProps) => {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg">
      <div 
        className="h-48 w-full relative" 
        style={{ 
          background: theme.background,
          fontFamily: theme.titleFont
        }}
      >
        {/* Theme preview */}
        <div className="absolute inset-0 p-4 flex flex-col">
          {/* Title area */}
          <div 
            className="text-lg font-bold mb-2"
            style={{ 
              color: theme.textColor,
              fontFamily: theme.titleFont
            }}
          >
            Sample Slide Title
          </div>
          
          {/* Content area with accent */}
          <div className="flex-1 flex gap-4">
            <div 
              className="w-1 h-full rounded-full"
              style={{ backgroundColor: theme.accentColor }}
            ></div>
            <div 
              className="text-sm"
              style={{ 
                color: theme.textColor,
                fontFamily: theme.bodyFont
              }}
            >
              • First bullet point<br />
              • Second bullet point<br />
              • Third bullet point
            </div>
          </div>
          
          {/* Card-like element in the preview */}
          <div 
            className="absolute bottom-4 right-4 w-16 h-16 rounded-lg flex items-center justify-center"
            style={{ 
              background: theme.cardDesign,
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
            }}
          >
            <Palette 
              className="h-6 w-6" 
              style={{ color: theme.accentColor }} 
            />
          </div>
        </div>
      </div>
      
      <CardHeader className="pb-2">
        <CardTitle className="flex justify-between items-center">
          <span>{theme.name}</span>
          <div className="flex gap-1">
            {theme.isDark && (
              <Badge variant="secondary" className="text-xs">Dark</Badge>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-0 pb-4">
        <p className="text-sm text-muted-foreground">{theme.description}</p>
        <div className="flex flex-wrap gap-2 mt-3">
          {theme.categories.map(category => (
            <Badge key={category} variant="outline" className="text-xs capitalize">
              {category}
            </Badge>
          ))}
        </div>
      </CardContent>
      
      <CardFooter>
        <Button 
          onClick={onApply} 
          className="w-full"
          style={{ 
            backgroundColor: theme.accentColor,
            color: theme.isDark ? '#fff' : '#000'
          }}
        >
          Apply Theme
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ThemeCard;
