"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  type ReactNode,
} from "react";
import type { MaterialCategory, MaterialRow, RoomType } from "@/lib/db.types";
import {
  calculateEstimate,
  defaultDimensions,
  dimensionsForPreset,
  type Estimate,
  type RoomDimensions,
  type Selections,
  type SizePreset,
} from "@/lib/studio/estimate";
import { buildRenderKey } from "@/lib/studio/render-key";
import {
  createSession,
  getSession,
  patchSession,
  StudioApiError,
} from "@/lib/studio/client-api";

const SESSION_KEY = "codex-designer-session-id"; // shared with lead-form.tsx
const TOKEN_KEY = "codex-studio-token";

export type StudioStep = "photo" | "room" | "materials" | "render" | "estimate";

export const stepOrder: StudioStep[] = [
  "photo",
  "room",
  "materials",
  "render",
  "estimate",
];

export interface StudioPhoto {
  path: string;
  url: string;
}

export interface StudioRender {
  id: string;
  url: string;
  renderKey: string;
  provider: string;
}

export type SaveState = "idle" | "saving" | "saved" | "error" | "offline";

export interface StudioState {
  step: StudioStep;
  sessionId: string | null;
  token: string | null;
  roomType: RoomType;
  roomChosen: boolean;
  photos: StudioPhoto[];
  activePhotoPath: string | null;
  selections: Selections;
  sizePreset: SizePreset;
  customDimensions: RoomDimensions | null;
  render: StudioRender | null;
  restoring: boolean;
  restored: boolean;
  saveState: SaveState;
}

const initialState: StudioState = {
  step: "photo",
  sessionId: null,
  token: null,
  roomType: "kitchen",
  roomChosen: false,
  photos: [],
  activePhotoPath: null,
  selections: {},
  sizePreset: "medium",
  customDimensions: null,
  render: null,
  restoring: true,
  restored: false,
  saveState: "idle",
};

type Action =
  | { type: "RESTORE_DONE"; state?: Partial<StudioState> }
  | { type: "SET_STEP"; step: StudioStep }
  | { type: "SET_ROOM"; roomType: RoomType }
  | { type: "SET_SELECTION"; category: MaterialCategory; materialId: string | null }
  | { type: "APPLY_SELECTIONS"; selections: Selections }
  | { type: "SET_PRESET"; preset: SizePreset }
  | { type: "SET_DIMENSIONS"; dimensions: RoomDimensions }
  | { type: "SESSION_READY"; sessionId: string; token: string }
  | { type: "PHOTO_ADDED"; photo: StudioPhoto }
  | { type: "PHOTO_REMOVED"; path: string }
  | { type: "SET_ACTIVE_PHOTO"; path: string }
  | { type: "RENDER_DONE"; render: StudioRender }
  | { type: "SAVE_STATE"; saveState: SaveState }
  | { type: "RESET" };

function reducer(state: StudioState, action: Action): StudioState {
  switch (action.type) {
    case "RESTORE_DONE":
      return { ...state, ...action.state, restoring: false };
    case "SET_STEP":
      return { ...state, step: action.step };
    case "SET_ROOM": {
      if (state.roomChosen && action.roomType === state.roomType) {
        return { ...state, roomChosen: true };
      }
      // Changing rooms invalidates room-specific picks; the render stays but
      // will read as stale via the render key.
      return {
        ...state,
        roomType: action.roomType,
        roomChosen: true,
        selections: state.roomChosen ? {} : state.selections,
      };
    }
    case "SET_SELECTION": {
      const selections = { ...state.selections };
      if (action.materialId) selections[action.category] = action.materialId;
      else delete selections[action.category];
      return { ...state, selections };
    }
    case "APPLY_SELECTIONS":
      return { ...state, selections: { ...state.selections, ...action.selections } };
    case "SET_PRESET":
      return { ...state, sizePreset: action.preset, customDimensions: null };
    case "SET_DIMENSIONS":
      return { ...state, customDimensions: action.dimensions };
    case "SESSION_READY":
      return { ...state, sessionId: action.sessionId, token: action.token };
    case "PHOTO_ADDED":
      return {
        ...state,
        photos: [...state.photos, action.photo],
        activePhotoPath: state.activePhotoPath ?? action.photo.path,
      };
    case "PHOTO_REMOVED": {
      const photos = state.photos.filter((p) => p.path !== action.path);
      return {
        ...state,
        photos,
        activePhotoPath:
          state.activePhotoPath === action.path
            ? (photos[0]?.path ?? null)
            : state.activePhotoPath,
      };
    }
    case "SET_ACTIVE_PHOTO":
      return { ...state, activePhotoPath: action.path };
    case "RENDER_DONE":
      return { ...state, render: action.render };
    case "SAVE_STATE":
      return { ...state, saveState: action.saveState };
    case "RESET":
      return { ...initialState, restoring: false };
    default:
      return state;
  }
}

export interface StudioContextValue {
  state: StudioState;
  materials: MaterialRow[];
  dimensions: RoomDimensions;
  estimate: Estimate;
  /** Key the current inputs would render to; null without a photo. */
  currentRenderKey: string | null;
  renderIsStale: boolean;
  dispatch: (action: Action) => void;
  goTo: (step: StudioStep) => void;
  /** Create (once) and return the session credentials, or null if offline. */
  ensureSession: () => Promise<{ sessionId: string; token: string } | null>;
  startOver: () => void;
}

const StudioContext = createContext<StudioContextValue | null>(null);

export function useStudio(): StudioContextValue {
  const ctx = useContext(StudioContext);
  if (!ctx) throw new Error("useStudio must be used inside <StudioProvider>");
  return ctx;
}

export function StudioProvider({
  materials,
  children,
}: {
  materials: MaterialRow[];
  children: ReactNode;
}) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const creationPromiseRef = useRef<Promise<{ sessionId: string; token: string } | null> | null>(null);
  const lastSavedRef = useRef<string | null>(null);
  const stateRef = useRef(state);
  useEffect(() => {
    stateRef.current = state;
  }, [state]);

  // --- Restore a returning visitor's design (the old tool wiped it instead).
  useEffect(() => {
    const id = localStorage.getItem(SESSION_KEY);
    const token = localStorage.getItem(TOKEN_KEY);
    if (!id || !token) {
      dispatch({ type: "RESTORE_DONE" });
      return;
    }
    let cancelled = false;
    getSession(id, token)
      .then((saved) => {
        if (cancelled) return;
        const hasContent =
          saved.photos.length > 0 ||
          Object.keys(saved.selections).length > 0 ||
          saved.latestRender !== null;
        const render: StudioRender | null =
          saved.latestRender?.url
            ? {
                id: saved.latestRender.id,
                url: saved.latestRender.url,
                renderKey: saved.latestRender.renderKey,
                provider: saved.latestRender.provider,
              }
            : null;
        lastSavedRef.current = serialize({
          roomType: saved.roomType,
          selections: saved.selections as Selections,
        });
        dispatch({
          type: "RESTORE_DONE",
          state: {
            sessionId: saved.id,
            token,
            roomType: saved.roomType,
            roomChosen: hasContent,
            selections: saved.selections as Selections,
            photos: saved.photos,
            activePhotoPath: saved.photos[0]?.path ?? null,
            render,
            restored: hasContent,
            saveState: "saved",
            step: render ? "render" : saved.photos.length > 0 ? "room" : "photo",
          },
        });
      })
      .catch(() => {
        if (cancelled) return;
        // Stale or invalid credentials — start clean.
        localStorage.removeItem(SESSION_KEY);
        localStorage.removeItem(TOKEN_KEY);
        dispatch({ type: "RESTORE_DONE" });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // --- Session creation: once, on first meaningful edit, shared by callers.
  const ensureSession = useCallback(async (): Promise<{ sessionId: string; token: string } | null> => {
    const current = stateRef.current;
    if (current.sessionId && current.token) {
      return { sessionId: current.sessionId, token: current.token };
    }
    if (!creationPromiseRef.current) {
      creationPromiseRef.current = createSession({
        roomType: current.roomChosen ? current.roomType : undefined,
        selections: current.selections,
      })
        .then(({ id, token }) => {
          localStorage.setItem(SESSION_KEY, id);
          localStorage.setItem(TOKEN_KEY, token);
          dispatch({ type: "SESSION_READY", sessionId: id, token });
          return { sessionId: id, token };
        })
        .catch((err) => {
          creationPromiseRef.current = null;
          if (err instanceof StudioApiError && err.code === "unavailable") {
            dispatch({ type: "SAVE_STATE", saveState: "offline" });
            return null;
          }
          dispatch({ type: "SAVE_STATE", saveState: "error" });
          return null;
        });
    }
    return creationPromiseRef.current;
  }, []);

  const dimensions = useMemo<RoomDimensions>(() => {
    if (state.customDimensions) return state.customDimensions;
    if (!state.roomChosen) return defaultDimensions[state.roomType];
    return dimensionsForPreset(state.roomType, state.sizePreset);
  }, [state.customDimensions, state.roomChosen, state.roomType, state.sizePreset]);

  const estimate = useMemo(
    () => calculateEstimate(state.selections, materials, dimensions),
    [state.selections, materials, dimensions],
  );

  const currentRenderKey = useMemo(
    () =>
      state.activePhotoPath
        ? buildRenderKey(state.roomType, state.activePhotoPath, state.selections)
        : null,
    [state.roomType, state.activePhotoPath, state.selections],
  );

  const renderIsStale = Boolean(
    state.render && currentRenderKey && state.render.renderKey !== currentRenderKey,
  );

  // --- Autosave: debounced, diffed against the last saved payload, and only
  // once there is something meaningful to save. Never fires on a bare visit.
  useEffect(() => {
    if (state.restoring) return;
    const meaningful =
      state.roomChosen ||
      Object.keys(state.selections).length > 0 ||
      state.photos.length > 0;
    if (!meaningful) return;
    if (state.saveState === "offline") return;

    const payload = serialize({
      roomType: state.roomType,
      selections: state.selections,
      dimensions,
      estimate: { rangeLow: estimate.rangeLow, rangeHigh: estimate.rangeHigh },
    });
    if (payload === lastSavedRef.current) return;

    const handle = window.setTimeout(async () => {
      const creds = await ensureSession();
      if (!creds) return;
      dispatch({ type: "SAVE_STATE", saveState: "saving" });
      try {
        await patchSession(creds.sessionId, creds.token, {
          roomType: stateRef.current.roomChosen ? stateRef.current.roomType : undefined,
          selections: stateRef.current.selections,
          dimensions,
          estimate,
        });
        lastSavedRef.current = payload;
        dispatch({ type: "SAVE_STATE", saveState: "saved" });
      } catch (err) {
        dispatch({
          type: "SAVE_STATE",
          saveState:
            err instanceof StudioApiError && err.code === "unavailable"
              ? "offline"
              : "error",
        });
      }
    }, 1500);
    return () => window.clearTimeout(handle);
  }, [
    state.restoring,
    state.roomChosen,
    state.roomType,
    state.selections,
    state.photos.length,
    state.saveState,
    dimensions,
    estimate,
    ensureSession,
  ]);

  const goTo = useCallback((step: StudioStep) => {
    dispatch({ type: "SET_STEP", step });
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  }, []);

  const startOver = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem(TOKEN_KEY);
    creationPromiseRef.current = null;
    lastSavedRef.current = null;
    dispatch({ type: "RESET" });
  }, []);

  const value: StudioContextValue = {
    state,
    materials,
    dimensions,
    estimate,
    currentRenderKey,
    renderIsStale,
    dispatch,
    goTo,
    ensureSession,
    startOver,
  };

  return <StudioContext.Provider value={value}>{children}</StudioContext.Provider>;
}

/** Deterministic stringify (recursively sorted object keys) for save diffing. */
function serialize(value: unknown): string {
  if (Array.isArray(value)) {
    return `[${value.map(serialize).join(",")}]`;
  }
  if (value && typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>)
      .filter(([, v]) => v !== undefined)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => `${JSON.stringify(k)}:${serialize(v)}`);
    return `{${entries.join(",")}}`;
  }
  return JSON.stringify(value) ?? "null";
}
