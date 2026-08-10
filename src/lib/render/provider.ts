import "server-only";

export interface RenderInput {
  imageBytes: Buffer;
  mimeType: string;
  prompt: string;
}

export interface RenderResult {
  imageBytes: Buffer;
  mimeType: string;
  provider: string;
}

export interface RenderProvider {
  name: string;
  generate(input: RenderInput): Promise<RenderResult>;
}
