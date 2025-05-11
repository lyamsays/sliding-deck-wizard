
declare module 'pdf-parse' {
  interface PDFData {
    text: string;
    numpages: number;
  }
  
  function pdfParse(buffer: Buffer | ArrayBuffer): Promise<PDFData>;
  
  export default pdfParse;
}
