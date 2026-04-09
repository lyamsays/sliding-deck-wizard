import React, { useRef, useState } from 'react';
import { Upload, FileText, X, CheckCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface DocumentUploadProps {
  onContentExtracted: (content: string, fileName: string) => void;
  disabled?: boolean;
  isPro?: boolean;
  onPaywallTrigger?: () => void;
}

type UploadState = 'idle' | 'reading' | 'done' | 'error';

const DocumentUpload: React.FC<DocumentUploadProps> = ({ onContentExtracted, disabled, isPro, onPaywallTrigger }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [state, setState] = useState<UploadState>('idle');
  const [fileName, setFileName] = useState('');
  const [error, setError] = useState('');
  const { toast } = useToast();

  const extractText = async (file: File): Promise<string> => {
    const ext = file.name.split('.').pop()?.toLowerCase();

    if (ext === 'txt' || ext === 'md') {
      return await file.text();
    }

    if (ext === 'docx' || ext === 'doc') {
      const mammoth = await import('mammoth');
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      return result.value;
    }

    if (ext === 'pdf') {
      // Use pdf.js via CDN since pdf-parse is Node-only
      const arrayBuffer = await file.arrayBuffer();
      const pdfjsLib = await loadPdfJs();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const pages: string[] = [];
      for (let p = 1; p <= Math.min(pdf.numPages, 40); p++) {
        const page = await pdf.getPage(p);
        const content = await page.getTextContent();
        const text = content.items
          .filter((item: any) => 'str' in item)
          .map((item: any) => item.str)
          .join(' ');
        if (text.trim()) pages.push(text.trim());
      }
      return pages.join('\n\n');
    }

    throw new Error(`Unsupported file type: .${ext}. Please use PDF, Word (.docx), or text files.`);
  };

  const loadPdfJs = async (): Promise<any> => {
    if ((window as any).pdfjsLib) return (window as any).pdfjsLib;
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.min.js';
      script.onload = () => {
        const lib = (window as any).pdfjsLib;
        lib.GlobalWorkerOptions.workerSrc =
          'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/build/pdf.worker.min.js';
        resolve(lib);
      };
      script.onerror = () => reject(new Error('Failed to load PDF reader'));
      document.head.appendChild(script);
    });
  };

  const handleFile = async (file: File) => {
    if (!isPro) {
      onPaywallTrigger?.();
      return;
    }
    const maxSize = 20 * 1024 * 1024;
    if (file.size > maxSize) {
      setError('File too large. Maximum size is 20MB.');
      setState('error');
      return;
    }

    setState('reading');
    setFileName(file.name);
    setError('');

    try {
      const text = await extractText(file);

      if (!text || text.trim().length < 50) {
        throw new Error('Could not extract enough text from this file. Try copy-pasting the content directly.');
      }

      const truncated = text.length > 15000 ? text.substring(0, 15000) + '\n\n[Content truncated to 15,000 characters]' : text;

      onContentExtracted(truncated, file.name);
      setState('done');

      toast({
        title: `${file.name} loaded`,
        description: `${truncated.length.toLocaleString()} characters extracted. Ready to generate slides.`,
      });

    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to read file';
      setError(msg);
      setState('error');
      toast({ title: 'Upload failed', description: msg, variant: 'destructive' });
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = '';
  };

  const reset = () => {
    setState('idle');
    setFileName('');
    setError('');
  };

  return (
    <div>
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.docx,.doc,.txt,.md"
        onChange={handleChange}
        className="hidden"
        disabled={disabled}
      />

      {state === 'idle' && (
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => !disabled && inputRef.current?.click()}
          className={`
            border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors
            ${disabled ? 'opacity-50 cursor-not-allowed border-border' : 'border-purple-300 hover:border-purple-500 hover:bg-purple-50/50'}
          `}
        >
          <Upload className="h-5 w-5 mx-auto mb-2 text-purple-400" />
          <p className="text-sm font-medium text-foreground">Upload your notes or materials</p>
          <p className="text-xs text-muted-foreground mt-1">
            PDF, Word (.docx), or text file · max 20MB
          </p>
          <p className="text-xs text-purple-600 mt-1 font-medium">
            Drag & drop or click to browse
          </p>
        </div>
      )}

      {state === 'reading' && (
        <div className="border rounded-lg p-4 flex items-center gap-3 bg-purple-50/50">
          <Loader2 className="h-5 w-5 text-purple-600 animate-spin flex-shrink-0" />
          <div>
            <p className="text-sm font-medium">Reading {fileName}…</p>
            <p className="text-xs text-muted-foreground">Extracting text from your document</p>
          </div>
        </div>
      )}

      {state === 'done' && (
        <div className="border border-green-200 rounded-lg p-4 flex items-center justify-between bg-green-50/50">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-green-800">{fileName}</p>
              <p className="text-xs text-green-600">Content loaded into the editor below</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={reset} className="h-7 w-7 p-0 text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {state === 'error' && (
        <div className="border border-red-200 rounded-lg p-4 flex items-center justify-between bg-red-50/50">
          <div className="flex items-center gap-3">
            <FileText className="h-5 w-5 text-red-500 flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-red-700">Upload failed</p>
              <p className="text-xs text-red-600">{error}</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={reset} className="h-7 w-7 p-0">
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default DocumentUpload;
