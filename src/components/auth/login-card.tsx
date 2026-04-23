"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { login, register } from "@/actions/auth";

export function LoginCard() {
  const router = useRouter();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorText, setErrorText] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!username.trim() || !password.trim()) {
      setErrorText("Username and password are required.");
      return;
    }

    setIsSubmitting(true);
    setErrorText("");

    try {
      if (mode === "login") {
        await login({
          username: username.trim(),
          password,
        });
      } else {
        await register({
          username: username.trim(),
          password,
        });
      }

      router.push("/agent");
      router.refresh();
    } catch (error) {
      setErrorText(
        error instanceof Error ? error.message : "Authentication failed."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="flex items-center justify-center">
      <div className="w-full max-w-md rounded-[30px] border border-sky-200/80 bg-white/72 p-8 shadow-[0_25px_80px_rgba(125,211,252,0.18)] backdrop-blur-xl">
        <div className="mb-8">
          <p className="text-sm font-medium text-sky-600">Portal Access</p>
          <h1 className="mt-2 text-4xl font-semibold tracking-tight text-slate-900">
            MISSU
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Sign in to access the agent panel, voice sessions, and policy tools.
          </p>
        </div>

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Username
            </label>
            <input
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              autoComplete="username"
              className="h-12 w-full rounded-2xl border border-sky-200 bg-white/90 px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:shadow-[0_0_0_4px_rgba(125,211,252,0.18)]"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              className="h-12 w-full rounded-2xl border border-sky-200 bg-white/90 px-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:shadow-[0_0_0_4px_rgba(125,211,252,0.18)]"
            />
          </div>

          {errorText ? (
            <p className="text-sm text-rose-600">{errorText}</p>
          ) : null}

          <div className="flex items-center gap-4 pt-3">
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex min-w-28 items-center justify-center rounded-full border border-sky-300 bg-sky-100 px-6 py-3 text-sm font-medium text-sky-800 transition hover:bg-sky-200 hover:text-sky-900 hover:shadow-[0_12px_24px_rgba(125,211,252,0.28)] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isSubmitting
                ? mode === "login"
                  ? "Logging in..."
                  : "Creating..."
                : mode === "login"
                  ? "Login"
                  : "Create Account"}
            </button>

            <button
              type="button"
              onClick={() => {
                setMode((current) => (current === "login" ? "register" : "login"));
                setErrorText("");
              }}
              className="text-sm text-sky-600 transition hover:text-sky-900 hover:underline"
            >
              {mode === "login" ? "I'm new" : "I already have an account"}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}
