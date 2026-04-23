const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL?.replace(/\/$/, "");

const AUTH_TOKEN_KEY = "missu-auth-token";
const AUTH_USER_KEY = "missu-auth-user";

export type LoginPayload = {
  username: string;
  password: string;
};

export type AuthUser = {
  username: string;
  clearance: string;
};

export type LoginResponse = {
  message: string;
  token: string;
  user: AuthUser;
};

export async function login(payload: LoginPayload): Promise<LoginResponse> {
  const response = await fetch(`${BACKEND_URL}/api/auth/v1/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error || "Login failed.");
  }

  if (typeof window !== "undefined") {
    window.localStorage.setItem(AUTH_TOKEN_KEY, data.token);
    window.localStorage.setItem(AUTH_USER_KEY, JSON.stringify(data.user));
  }

  return data;
}

export async function register(payload: LoginPayload): Promise<LoginResponse> {
  const response = await fetch(`${BACKEND_URL}/api/auth/v1/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.error || "Registration failed.");
  }

  if (typeof window !== "undefined") {
    window.localStorage.setItem(AUTH_TOKEN_KEY, data.token);
    window.localStorage.setItem(AUTH_USER_KEY, JSON.stringify(data.user));
  }

  return data;
}

export function getAuthToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(AUTH_TOKEN_KEY);
}

export function getAuthUser(): AuthUser | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(AUTH_USER_KEY);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

export function clearAuth() {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(AUTH_TOKEN_KEY);
  window.localStorage.removeItem(AUTH_USER_KEY);
}
