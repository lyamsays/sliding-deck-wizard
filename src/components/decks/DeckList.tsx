
import React from 'react';
import { format } from "date-fns";
import { Eye, Loader, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { 
  Table, 
  TableHeader, 
  TableBody, 
  TableRow, 
  TableHead, 
  TableCell 
} from "@/components/ui/table";
import { SlideDeck } from "@/types/deck";

interface DeckListProps {
  decks: SlideDeck[];
  onViewDeck: (deck: SlideDeck) => void;
  onDeleteDeck: (id: string) => void;
  deleting: string | null;
}

const DeckList = ({ decks, onViewDeck, onDeleteDeck, deleting }: DeckListProps) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>Date Created</TableHead>
          <TableHead>Slides</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {decks.map((deck) => (
          <TableRow key={deck.id}>
            <TableCell className="font-medium">{deck.title}</TableCell>
            <TableCell>{format(new Date(deck.created_at), 'MMM d, yyyy')}</TableCell>
            <TableCell>{deck.slides.length}</TableCell>
            <TableCell>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onViewDeck(deck)}
                  className="flex items-center"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDeleteDeck(deck.id)}
                  disabled={deleting === deck.id}
                  className="flex items-center"
                >
                  {deleting === deck.id ? (
                    <Loader className="h-3 w-3 animate-spin mr-1" />
                  ) : (
                    <Trash className="h-3 w-3 mr-1" />
                  )}
                  Delete
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default DeckList;
