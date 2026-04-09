
import React from 'react';
import { Toggle } from "@/components/ui/toggle";
import { Moon, BookOpen, Sparkles } from "lucide-react";

type FilterType = 'all' | 'dark' | 'educator' | 'academic' | 'modern';

interface ThemeFilterProps {
  activeFilter: FilterType;
  setActiveFilter: (filter: FilterType) => void;
}

export const ThemeFilter = ({ activeFilter, setActiveFilter }: ThemeFilterProps) => {
  const filters = [
    { id: 'all', label: 'All Themes', icon: null },
    { id: 'educator', label: 'Educator', icon: <BookOpen className="h-4 w-4" /> },
    { id: 'dark', label: 'Dark Mode', icon: <Moon className="h-4 w-4" /> },
    { id: 'academic', label: 'Academic', icon: <BookOpen className="h-4 w-4" /> },
    { id: 'modern', label: 'Modern', icon: <Sparkles className="h-4 w-4" /> },
  ];
  
  return (
    <div className="flex gap-2 flex-wrap">
      {filters.map((filter) => (
        <Toggle
          key={filter.id}
          pressed={activeFilter === filter.id}
          onPressedChange={() => setActiveFilter(filter.id as FilterType)}
          variant="outline"
          className="data-[state=on]:bg-primary data-[state=on]:text-primary-foreground"
        >
          {filter.icon}
          <span className="ml-1 whitespace-nowrap">{filter.label}</span>
        </Toggle>
      ))}
    </div>
  );
};
