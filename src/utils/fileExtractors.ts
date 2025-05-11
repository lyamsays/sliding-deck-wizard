
// This utility extracts text content from PDF and DOCX files
import mammoth from 'mammoth';
// Since pdf-parse doesn't have proper type declarations, we'll create our own
import * as pdfParseModule from 'pdf-parse';

// Type definitions for pdf-parse
interface PDFData {
  text: string;
  numpages: number;
  numrender: number;
  info: Record<string, any>;
  metadata: Record<string, any>;
  version: string;
}

// Properly handle the CommonJS module
const pdfParse = (pdfParseModule as unknown as { default: (buffer: Buffer | ArrayBuffer) => Promise<PDFData> }).default;

/**
 * Extract text from a PDF file
 * @param file PDF file to extract text from
 * @returns Promise with extracted text
 */
export const extractPdfText = async (file: File): Promise<string> => {
  try {
    // Convert the file to an ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    
    // Parse the PDF
    const pdfData = await pdfParse(arrayBuffer);
    
    return pdfData.text || "";
  } catch (error) {
    console.error('PDF extraction error:', error);
    throw new Error('Failed to extract text from PDF');
  }
};

/**
 * Extract text from a DOCX file
 * @param file DOCX file to extract text from
 * @returns Promise with extracted text
 */
export const extractDocxText = async (file: File): Promise<string> => {
  try {
    // Convert the file to an ArrayBuffer
    const arrayBuffer = await file.arrayBuffer();
    
    // Parse the DOCX
    const result = await mammoth.extractRawText({ arrayBuffer });
    
    return result.value || "";
  } catch (error) {
    console.error('DOCX extraction error:', error);
    throw new Error('Failed to extract text from DOCX');
  }
};

/**
 * Extract text from either a PDF or DOCX file
 * @param file File to extract text from
 * @returns Promise with extracted text
 */
export const extractTextFromFile = async (file: File): Promise<string> => {
  const fileType = file.name.split('.').pop()?.toLowerCase();
  
  switch (fileType) {
    case 'pdf':
      return extractPdfText(file);
    case 'docx':
      return extractDocxText(file);
    default:
      throw new Error('Unsupported file type. Please upload a PDF or DOCX file.');
  }
};
