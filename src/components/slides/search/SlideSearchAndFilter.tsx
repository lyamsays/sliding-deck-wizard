import React, { useState, memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Filter, X } from 'lucide-react';
import { useSlideSearch, useSlideFilter, useDebouncedSearch } from '@/hooks/useSlideOptimizations';
import { Slide } from '@/types/deck';

interface SlideSearchAndFilterProps {
  slides: Slide[];
  onFilteredSlidesChange: (slides: Slide[]) => void;
  className?: string;
}

const SlideSearchAndFilter: React.FC<SlideSearchAndFilterProps> = memo(({
  slides,
  onFilteredSlidesChange,
  className
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'recent' | 'title-az' | 'title-za'>('all');
  const [isSearching, setIsSearching] = useState(false);

  // Optimized search and filter hooks
  const searchedSlides = useSlideSearch(slides, searchTerm);
  const filteredSlides = useSlideFilter(searchedSlides, filterType);

  // Debounced search to prevent excessive filtering
  const debouncedSearch = useDebouncedSearch((term: string) => {
    setSearchTerm(term);
    setIsSearching(false);
  });

  const handleSearchChange = (value: string) => {
    setIsSearching(true);
    debouncedSearch(value);
  };

  const handleFilterChange = (value: string) => {
    setFilterType(value as typeof filterType);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setIsSearching(false);
  };

  // Update parent component when filtered slides change
  React.useEffect(() => {
    onFilteredSlidesChange(filteredSlides);
  }, [filteredSlides, onFilteredSlidesChange]);

  const hasActiveFilters = searchTerm || filterType !== 'all';

  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Search className="h-5 w-5" />
          Search & Filter
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search Input */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search slides..."
            onChange={(e) => handleSearchChange(e.target.value)}
            className="pl-10 pr-10"
            defaultValue={searchTerm}
          />
          {(searchTerm || isSearching) && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearSearch}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-muted"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
          {isSearching && (
            <div className="absolute right-10 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
            </div>
          )}
        </div>

        {/* Filter Dropdown */}
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-muted-foreground" />
          <Select value={filterType} onValueChange={handleFilterChange}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Filter slides..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All slides</SelectItem>
              <SelectItem value="recent">Most recent</SelectItem>
              <SelectItem value="title-az">Title A-Z</SelectItem>
              <SelectItem value="title-za">Title Z-A</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>
            {filteredSlides.length} of {slides.length} slides
            {hasActiveFilters && ' (filtered)'}
          </span>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setSearchTerm('');
                setFilterType('all');
              }}
              className="h-auto p-1 text-xs hover:text-foreground"
            >
              Clear all
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
});

SlideSearchAndFilter.displayName = 'SlideSearchAndFilter';

export default SlideSearchAndFilter;