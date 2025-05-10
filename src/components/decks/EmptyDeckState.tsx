
import React from 'react';
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

const EmptyDeckState = () => {
  const navigate = useNavigate();
  
  return (
    <div className="text-center py-20 bg-gray-50 rounded-lg border border-gray-100">
      <h3 className="text-xl font-medium text-gray-900">No slide decks yet</h3>
      <p className="mt-2 text-gray-600">
        You haven't created any slide decks yet. Generate some slides to get started.
      </p>
      <Button 
        className="mt-4" 
        onClick={() => navigate('/create')}
      >
        Create New Slides
      </Button>
    </div>
  );
};

export default EmptyDeckState;
