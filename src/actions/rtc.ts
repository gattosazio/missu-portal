import { getAuthToken } from "./auth";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, "");

export type LiveKitSessionResponse = {
  sessionId: string;
  roomName: string;
  participantIdentity: string;
  token: string;
};

type LiveKitSessionError = {
  error?: string;
};

export type CloseVoiceSessionResponse = {
  sessionId: string;
  roomName?: string;
  status: "closed" | "not_found";
  endedAt?: string | null;
  endReason?: string | null;
};

export async function createVoiceSession(): Promise<LiveKitSessionResponse> {
  const authToken = getAuthToken();

  if (!authToken) {
    throw new Error("No auth token found. Please log in first.");
  }

  const response = await fetch(`${BACKEND_URL}/api/rtc/v1/session`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${authToken}`,
      "Content-Type": "application/json",
    },
  });

  const data: LiveKitSessionResponse | LiveKitSessionError = await response.json();

  if (!response.ok) {
    const errorMessage =
      "error" in data && typeof data.error === "string"
        ? data.error
        : "Failed to create voice session.";

    throw new Error(errorMessage);
  }

  if (
    !("token" in data) ||
    typeof data.token !== "string" ||
    typeof data.sessionId !== "string" ||
    typeof data.roomName !== "string" ||
    typeof data.participantIdentity !== "string"
  ) {
    throw new Error("Backend did not return a valid voice session.");
  }

  return data;
}

export async function closeVoiceSession(
  sessionId: string,
  options?: { keepalive?: boolean }
): Promise<CloseVoiceSessionResponse> {
  const authToken = getAuthToken();

  if (!authToken) {
    throw new Error("No auth token found. Please log in first.");
  }

  const response = await fetch(`${BACKEND_URL}/api/rtc/v1/session/${sessionId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
    keepalive: options?.keepalive ?? false,
  });

  const data = (await response.json()) as CloseVoiceSessionResponse | LiveKitSessionError;

  if (!response.ok) {
    const errorMessage =
      "error" in data && typeof data.error === "string"
        ? data.error
        : "Failed to close voice session.";

    throw new Error(errorMessage);
  }

  if (
    !("status" in data) ||
    typeof data.status !== "string" ||
    typeof data.sessionId !== "string"
  ) {
    throw new Error("Backend did not return a valid voice session teardown response.");
  }

  return data;
}

export async function getLiveKitToken(): Promise<string> {
  const session = await createVoiceSession();
  return session.token;
}
