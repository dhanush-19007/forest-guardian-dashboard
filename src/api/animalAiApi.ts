/**
 * Centralised Spring Boot API client for AnimalFootprintAI.
 * The browser only ever talks to Spring Boot — never to the FastAPI ML services.
 */
export const API_BASE_URL = (
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ||
  "http://localhost:8080/api"
).replace(/\/+$/, "");

const DEFAULT_TIMEOUT_MS = 15000;

export type ForestStatusValue = "SAFE" | "DETECTED" | "NEAR" | "ALERT" | "UNKNOWN";
export const KNOWN_STATUSES = ["SAFE", "DETECTED", "NEAR", "ALERT"] as const;

export interface FootprintPrediction {
  animal: string;
}
export interface ForestStatus {
  status: ForestStatusValue;
  rawStatus: string;
  message: string;
}

export class ApiError extends Error {
  status?: number;
  aborted: boolean;
  constructor(message: string, opts: { status?: number; aborted?: boolean } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = opts.status;
    this.aborted = Boolean(opts.aborted);
  }
}

export const isAbortError = (e: unknown) => e instanceof ApiError && e.aborted;

function messageForStatus(status: number): string {
  switch (status) {
    case 400:
      return "The server rejected the request. Check the image and try again.";
    case 404:
      return "The requested service endpoint was not found on the server.";
    case 413:
      return "The image is too large for the server to accept.";
    case 500:
      return "The server ran into an error while processing the request.";
    case 502:
    case 503:
    case 504:
      return "The AI service behind the server is unavailable right now.";
    default:
      return `The server responded with an unexpected error (${status}).`;
  }
}

async function request<T>(
  path: string,
  init: RequestInit & { signal?: AbortSignal; timeoutMs?: number } = {},
): Promise<T> {
  const { signal: externalSignal, timeoutMs = DEFAULT_TIMEOUT_MS, ...rest } = init;
  const controller = new AbortController();
  let timedOut = false;
  const timer = setTimeout(() => {
    timedOut = true;
    controller.abort();
  }, timeoutMs);
  const onExternalAbort = () => controller.abort();
  if (externalSignal) {
    if (externalSignal.aborted) controller.abort();
    else externalSignal.addEventListener("abort", onExternalAbort);
  }

  let res: Response;
  try {
    res = await fetch(`${API_BASE_URL}${path}`, { ...rest, signal: controller.signal });
  } catch {
    if (timedOut) throw new ApiError("The request timed out. Please try again.");
    if (controller.signal.aborted) throw new ApiError("Request cancelled.", { aborted: true });
    throw new ApiError(
      "Could not reach the backend server. Make sure Spring Boot is running and try again.",
    );
  } finally {
    clearTimeout(timer);
    externalSignal?.removeEventListener("abort", onExternalAbort);
  }

  if (!res.ok) throw new ApiError(messageForStatus(res.status), { status: res.status });

  try {
    return (await res.json()) as T;
  } catch {
    throw new ApiError("The server sent a response that could not be read.");
  }
}

export async function predictFootprint(
  file: File,
  signal?: AbortSignal,
): Promise<FootprintPrediction> {
  if (!(file instanceof File)) throw new ApiError("Choose a footprint image first.");
  const form = new FormData();
  form.append("file", file);
  // No Content-Type header: the browser sets the multipart boundary.
  const data = await request<unknown>("/footprints/predict", {
    method: "POST",
    body: form,
    signal,
    timeoutMs: 60000,
  });
  const animal =
    data && typeof data === "object" ? (data as Record<string, unknown>).animal : undefined;
  if (typeof animal !== "string" || !animal.trim()) {
    throw new ApiError("The server did not return a recognisable animal prediction.");
  }
  return { animal: animal.trim() };
}

export async function getForestStatus(signal?: AbortSignal): Promise<ForestStatus> {
  const data = await request<unknown>("/forest/status", { signal, timeoutMs: 8000 });
  if (!data || typeof data !== "object") {
    throw new ApiError("The server sent an unexpected forest status response.");
  }
  const obj = data as Record<string, unknown>;
  if (typeof obj.status !== "string") {
    throw new ApiError("The forest status response is missing a status value.");
  }
  const raw = obj.status.trim().toUpperCase();
  const status = (KNOWN_STATUSES as readonly string[]).includes(raw)
    ? (raw as ForestStatusValue)
    : "UNKNOWN";
  return {
    status,
    rawStatus: obj.status,
    message: typeof obj.message === "string" ? obj.message : "",
  };
}

/** Manual status update. Never called automatically by live monitoring. */
export async function updateForestStatus(status: string, signal?: AbortSignal) {
  return request<unknown>("/forest/status", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
    signal,
  });
}
