import { z } from "zod";

/** Zod contracts shared by the studio API routes and the client fetchers. */

export const roomTypeSchema = z.enum(["kitchen", "bathroom", "other"]);

export const materialCategorySchema = z.enum([
  "cabinet",
  "countertop",
  "backsplash",
  "floor",
  "wall-tile",
  "fixture",
  "hardware",
  "paint",
  "lighting",
]);

export const selectionsSchema = z.record(
  materialCategorySchema,
  z.string().min(1).max(128),
);

export const dimensionsSchema = z.object({
  lengthFt: z.number().min(1).max(200),
  widthFt: z.number().min(1).max(200),
  ceilingFt: z.number().min(6).max(30),
  cabinetRunFt: z.number().min(0).max(500),
  counterSqFt: z.number().min(0).max(2000),
  backsplashSqFt: z.number().min(0).max(2000),
  fixtureCount: z.number().min(0).max(50),
  lightingCount: z.number().min(0).max(100),
});

export const sessionPayloadSchema = z.object({
  roomType: roomTypeSchema.optional(),
  selections: selectionsSchema.optional(),
  dimensions: dimensionsSchema.optional(),
  notes: z.string().max(4000).optional(),
});

export const createSessionSchema = sessionPayloadSchema;
export const patchSessionSchema = sessionPayloadSchema.extend({
  estimate: z.unknown().optional(),
});

export const renderRequestSchema = z.object({
  sessionId: z.string().uuid(),
  photoPath: z.string().min(1).max(512),
  roomType: roomTypeSchema,
  selections: selectionsSchema,
});

export type SessionPayload = z.infer<typeof sessionPayloadSchema>;
export type RenderRequest = z.infer<typeof renderRequestSchema>;

/** Response shapes (server → client). */

export interface CreateSessionResponse {
  id: string;
  token: string;
}

export interface SessionPhoto {
  path: string;
  url: string;
}

export interface RenderInfo {
  id: string;
  status: "succeeded" | "failed";
  renderKey: string;
  url: string | null;
  provider: string;
  error?: string;
  cached?: boolean;
}

export interface GetSessionResponse {
  id: string;
  roomType: z.infer<typeof roomTypeSchema>;
  selections: Record<string, string>;
  dimensions: Record<string, number> | null;
  notes: string;
  photos: SessionPhoto[];
  latestRender: RenderInfo | null;
}

export interface UploadPhotoResponse {
  path: string;
  url: string;
}

export interface StudioErrorResponse {
  error: string;
  /** Machine-readable hint the UI can branch on. */
  code?: "rate_limited" | "unavailable" | "unauthorized" | "invalid";
}

export const STUDIO_TOKEN_HEADER = "x-studio-token";
