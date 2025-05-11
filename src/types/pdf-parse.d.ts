
declare module 'pdf-parse' {
  interface PDFData {
    text: string;
    numpages: number;
    numrender: number;
    info: Record<string, any>;
    metadata: Record<string, any>;
    version: string;
  }
  
  function pdfParse(buffer: Buffer | ArrayBuffer): Promise<PDFData>;
  
  export default pdfParse;
}
