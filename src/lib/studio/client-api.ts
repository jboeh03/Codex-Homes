"use client";

import type {
  CreateSessionResponse,
  GetSessionResponse,
  RenderInfo,
  RenderRequest,
  SessionPayload,
  StudioErrorResponse,
  UploadPhotoResponse,
} from "./api-schemas";
import { STUDIO_TOKEN_HEADER } from "./api-schemas";

/** Thin typed fetch wrappers for the studio API. */

export class StudioApiError extends Error {
  status: number;
  code?: StudioErrorResponse["code"];
  constructor(status: number, body: StudioErrorResponse | null) {
    super(body?.error ?? `Request failed (${status})`);
    this.status = status;
    this.code = body?.code;
  }
}

async function parseError(res: Response): Promise<never> {
  let body: StudioErrorResponse | null = null;
  try {
    body = (await res.json()) as StudioErrorResponse;
  } catch {
    // non-JSON error body
  }
  throw new StudioApiError(res.status, body);
}

export async function createSession(
  payload: SessionPayload,
): Promise<CreateSessionResponse> {
  const res = await fetch("/api/studio/sessions", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) await parseError(res);
  return res.json();
}

export async function getSession(
  id: string,
  token: string,
): Promise<GetSessionResponse> {
  const res = await fetch(`/api/studio/sessions/${id}`, {
    headers: { [STUDIO_TOKEN_HEADER]: token },
    cache: "no-store",
  });
  if (!res.ok) await parseError(res);
  return res.json();
}

export async function patchSession(
  id: string,
  token: string,
  payload: SessionPayload & { estimate?: unknown },
): Promise<void> {
  const res = await fetch(`/api/studio/sessions/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      [STUDIO_TOKEN_HEADER]: token,
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) await parseError(res);
}

export async function uploadPhoto(
  sessionId: string,
  token: string,
  file: Blob,
  filename: string,
): Promise<UploadPhotoResponse> {
  const form = new FormData();
  form.set("sessionId", sessionId);
  form.set("file", file, filename);
  const res = await fetch("/api/studio/photos", {
    method: "POST",
    headers: { [STUDIO_TOKEN_HEADER]: token },
    body: form,
  });
  if (!res.ok) await parseError(res);
  return res.json();
}

export async function requestRender(
  token: string,
  body: RenderRequest,
  signal?: AbortSignal,
): Promise<RenderInfo> {
  const res = await fetch("/api/studio/renders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      [STUDIO_TOKEN_HEADER]: token,
    },
    body: JSON.stringify(body),
    signal,
  });
  if (!res.ok) await parseError(res);
  return res.json();
}
