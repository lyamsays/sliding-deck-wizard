
import React from 'react';
import { Loader } from "lucide-react";

const LoadingDecks = () => {
  return (
    <div className="flex justify-center items-center py-20">
      <Loader className="h-8 w-8 animate-spin text-primary" />
      <span className="ml-3 text-lg">Loading your slide decks...</span>
    </div>
  );
};

export default LoadingDecks;
