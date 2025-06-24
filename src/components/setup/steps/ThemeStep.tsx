
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ThemeFilter } from '@/components/themes/ThemeFilter';
import { themes } from '@/components/themes/theme-data';
import ThemePreview from '@/components/themes/ThemePreview';
import { ThemeCategory } from '@/components/themes/theme-types';

interface ThemeStepProps {
  selectedTheme: string;
  setSelectedTheme: (theme: string) => void;
  autoGenerateImages: boolean;
  setAutoGenerateImages: (auto: boolean) => void;
}

const ThemeStep: React.FC<ThemeStepProps> = ({ 
  selectedTheme, 
  setSelectedTheme, 
  autoGenerateImages, 
  setAutoGenerateImages 
}) => {
  const [activeFilter, setActiveFilter] = useState<ThemeCategory>('all');

  const filteredThemes = themes.filter(theme => 
    activeFilter === 'all' || theme.categories.includes(activeFilter)
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Visual Preferences</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <Label htmlFor="auto-images">Auto-generate images</Label>
              <p className="text-sm text-gray-600">
                Automatically create AI-generated images for your slides
              </p>
            </div>
            <Switch
              id="auto-images"
              checked={autoGenerateImages}
              onCheckedChange={setAutoGenerateImages}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Choose Your Theme</CardTitle>
          <div className="mt-4">
            <ThemeFilter activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredThemes.map((theme) => (
              <div
                key={theme.id}
                className={`relative cursor-pointer transition-all duration-200 ${
                  selectedTheme === theme.id 
                    ? 'ring-2 ring-purple-500 scale-105' 
                    : 'hover:scale-102'
                }`}
                onClick={() => setSelectedTheme(theme.id)}
              >
                <ThemePreview themeId={theme.id} />
                {selectedTheme === theme.id && (
                  <div className="absolute top-2 right-2 bg-purple-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                    ✓
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ThemeStep;
