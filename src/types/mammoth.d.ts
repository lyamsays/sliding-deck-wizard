
declare module 'mammoth' {
  interface MammothOptions {
    arrayBuffer: ArrayBuffer;
  }
  
  interface MammothResult {
    value: string;
    messages: Array<unknown>;
  }
  
  export function extractRawText(options: MammothOptions): Promise<MammothResult>;
}
