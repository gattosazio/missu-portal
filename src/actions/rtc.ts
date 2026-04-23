import { getAuthToken } from "./auth";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, "");

export async function getLiveKitToken() {
  const authToken = getAuthToken();

  if (!authToken) {
    throw new Error("No auth token found. Please log in first.");
  }

  const response = await fetch(`${BACKEND_URL}/api/rtc/v1/token`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${authToken}`,
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error || "Failed to get LiveKit token.");
  }

  if (!data?.token) {
    throw new Error("Backend did not return a LiveKit token.");
  }

  return data.token as string;
}
