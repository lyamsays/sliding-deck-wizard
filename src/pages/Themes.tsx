
import React, { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import ThemeCard from '@/components/themes/ThemeCard';
import { themes } from '@/components/themes/theme-data';
import { ThemeFilter } from '@/components/themes/ThemeFilter';

type FilterType = 'all' | 'dark' | 'consulting' | 'academic' | 'modern';

const Themes = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [filteredThemes, setFilteredThemes] = useState(themes);

  useEffect(() => {
    let results = themes;
    
    // Apply search filter
    if (searchQuery) {
      results = results.filter(theme => 
        theme.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        theme.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply category filter
    if (activeFilter !== 'all') {
      results = results.filter(theme => theme.categories.includes(activeFilter));
    }
    
    setFilteredThemes(results);
  }, [searchQuery, activeFilter]);

  const handleApplyTheme = (themeName: string) => {
    // Save selected theme to localStorage
    localStorage.setItem('selectedTheme', themeName);
    
    toast({
      title: "Theme Applied",
      description: `${themeName} will be applied to your next slide deck.`,
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-background to-secondary/10">
      <Navbar />
      
      <main className="flex-grow container px-4 py-8 md:py-12">
        <div className="max-w-6xl mx-auto space-y-8">
          <div className="text-center space-y-2">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-500">
              Slide Themes Gallery
            </h1>
            <p className="text-muted-foreground text-lg">
              Choose a theme to customize the look and feel of your slide decks
            </p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search themes..." 
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            <div className="flex items-center gap-2 overflow-auto pb-2 w-full md:w-auto">
              <ThemeFilter activeFilter={activeFilter} setActiveFilter={setActiveFilter} />
            </div>
          </div>
          
          <ScrollArea className="h-[calc(100vh-300px)]">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredThemes.length > 0 ? (
                filteredThemes.map((theme) => (
                  <ThemeCard 
                    key={theme.id}
                    theme={theme}
                    onApply={() => handleApplyTheme(theme.id)}
                  />
                ))
              ) : (
                <div className="col-span-full py-10 text-center">
                  <p className="text-muted-foreground text-lg">No themes found matching your criteria.</p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default Themes;
