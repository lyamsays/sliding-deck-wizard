
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RefreshCw, Search, FileImage, ExternalLink, AlertCircle } from 'lucide-react';
import { DialogFooter } from "@/components/ui/dialog";
import { WebImage } from './types';

interface WebSearchTabProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  isSearching: boolean;
  webImages: WebImage[];
  selectedWebImage: WebImage | null;
  setSelectedWebImage: (image: WebImage | null) => void;
  handleSearchImages: () => void;
  handleUseWebImage: () => void;
  apiKeyMissing: boolean;
  recommendedTab: string | null;
}

const WebSearchTab: React.FC<WebSearchTabProps> = ({
  searchQuery,
  setSearchQuery,
  isSearching,
  webImages,
  selectedWebImage,
  setSelectedWebImage,
  handleSearchImages,
  handleUseWebImage,
  apiKeyMissing,
  recommendedTab
}) => {
  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        <div className="space-y-2">
          <p className="text-sm text-gray-500">
            Search for professional images from Unsplash:
          </p>
          <div className="flex gap-2">
            <Input 
              placeholder="E.g., 'business meeting' or 'team collaboration'"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSearchImages();
              }}
            />
            <Button 
              onClick={handleSearchImages}
              disabled={isSearching || !searchQuery.trim()}
            >
              {isSearching ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Search className="h-4 w-4" />
              )}
            </Button>
          </div>
          
          {isSearching && (
            <div className="flex justify-center py-8">
              <RefreshCw className="h-8 w-8 animate-spin text-gray-400" />
            </div>
          )}
          
          {apiKeyMissing && (
            <div className="p-4 mt-2 bg-amber-50 text-amber-700 rounded-md border border-amber-200">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-5 w-5 mt-0.5 text-amber-500" />
                <div>
                  <p className="font-medium">Unsplash API key is missing</p>
                  <p className="text-sm mt-1">
                    The administrator needs to set up the Unsplash API key in the Supabase Edge Function secrets.
                  </p>
                </div>
              </div>
            </div>
          )}
          
          {!isSearching && webImages.length > 0 && (
            <div className="grid grid-cols-3 gap-2 mt-4">
              {webImages.map((image) => (
                <div 
                  key={image.id}
                  className={`relative rounded-md overflow-hidden cursor-pointer border-2 transition-all ${
                    selectedWebImage?.id === image.id 
                      ? 'border-primary ring-2 ring-primary/30' 
                      : 'border-transparent hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedWebImage(image)}
                >
                  <img 
                    src={image.thumbUrl} 
                    alt={image.description}
                    className="w-full h-24 object-cover"
                    crossOrigin="anonymous"
                  />
                </div>
              ))}
            </div>
          )}
          
          {!isSearching && webImages.length === 0 && searchQuery.trim() !== '' && !apiKeyMissing && (
            <div className="text-center py-8">
              <p className="text-gray-500">No images found. Try a different search term.</p>
            </div>
          )}
          
          {selectedWebImage && (
            <div className="mt-4 p-3 bg-gray-50 rounded-md">
              <p className="text-xs text-gray-500 mb-1">Selected image:</p>
              <div className="flex items-center gap-2">
                <img 
                  src={selectedWebImage.thumbUrl} 
                  alt={selectedWebImage.description}
                  className="w-16 h-16 object-cover rounded-md"
                  crossOrigin="anonymous"
                />
                <div className="flex-1">
                  <p className="text-sm line-clamp-1">{selectedWebImage.description}</p>
                  <p className="text-xs text-gray-500">
                    Photo by {selectedWebImage.authorName} on Unsplash
                  </p>
                </div>
              </div>
              <div className="flex justify-end mt-2">
                <a 
                  href={`https://unsplash.com/@${selectedWebImage.authorUsername}?utm_source=your_app&utm_medium=referral`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-xs text-gray-500 flex items-center hover:underline"
                >
                  View on Unsplash 
                  <ExternalLink className="h-3 w-3 ml-1" />
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
      
      <DialogFooter>
        <Button 
          onClick={handleUseWebImage}
          disabled={!selectedWebImage}
          className="w-full"
        >
          <FileImage className="h-4 w-4 mr-2" />
          Use Selected Image
        </Button>
      </DialogFooter>
    </div>
  );
};

export default WebSearchTab;
