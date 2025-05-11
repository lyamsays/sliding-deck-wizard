
declare module 'mammoth' {
  interface MammothOptions {
    arrayBuffer: ArrayBuffer;
  }
  
  interface MammothResult {
    value: string;
    messages: Array<any>;
  }
  
  export function extractRawText(options: MammothOptions): Promise<MammothResult>;
}
