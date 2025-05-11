
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Upload, X } from 'lucide-react';
import { DialogFooter } from "@/components/ui/dialog";

interface UploadTabProps {
  selectedFile: File | null;
  setSelectedFile: (file: File | null) => void;
  previewUrl: string | null;
  setPreviewUrl: (url: string | null) => void;
  handleUpload: () => void;
}

const UploadTab: React.FC<UploadTabProps> = ({
  selectedFile,
  setSelectedFile,
  previewUrl,
  setPreviewUrl,
  handleUpload
}) => {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
      
      setSelectedFile(file);
    }
  };

  const handleRemovePreview = () => {
    setPreviewUrl(null);
    setSelectedFile(null);
  };

  return (
    <div className="space-y-4">
      <div className="grid gap-4">
        <div className="space-y-2">
          <p className="text-sm text-gray-500">
            Upload an image from your computer:
          </p>
          
          {!previewUrl ? (
            <div 
              className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md p-6 bg-gray-50 cursor-pointer"
              onClick={() => document.getElementById("image-upload")?.click()}
            >
              <Upload className="h-8 w-8 text-gray-400 mb-2" />
              <p className="text-sm text-gray-500 mb-2">Click to browse or drag and drop</p>
              <p className="text-xs text-gray-400">PNG, JPG, GIF up to 5MB</p>
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </div>
          ) : (
            <div className="relative rounded-md overflow-hidden">
              <div className="absolute top-2 right-2 z-10">
                <Button
                  variant="destructive"
                  size="icon"
                  className="h-6 w-6 rounded-full"
                  onClick={handleRemovePreview}
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
              <img 
                src={previewUrl} 
                alt="Preview" 
                className="w-full h-auto object-cover rounded-md"
                style={{ maxHeight: '200px' }}
                crossOrigin="anonymous"
              />
            </div>
          )}

          {selectedFile && !previewUrl && (
            <div className="mt-2">
              <p className="text-sm text-gray-600">Selected: {selectedFile.name}</p>
            </div>
          )}
        </div>
      </div>
      
      <DialogFooter>
        <Button 
          onClick={handleUpload}
          disabled={!selectedFile}
          className="w-full"
        >
          <Upload className="h-4 w-4 mr-2" />
          Upload Image
        </Button>
      </DialogFooter>
    </div>
  );
};

export default UploadTab;
