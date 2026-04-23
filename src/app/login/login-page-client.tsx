import Link from "next/link";
import { LoginCard } from "@/components/auth/login-card";
import { LoginHero } from "@/components/auth/login-hero";

export function LoginPageClient() {
  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#f6fbff] text-slate-800">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(186,230,253,0.9),transparent_24%),radial-gradient(circle_at_top_right,rgba(219,234,254,0.95),transparent_24%),radial-gradient(circle_at_bottom_left,rgba(224,242,254,0.9),transparent_28%),linear-gradient(to_bottom,#f9fcff_0%,#edf7ff_45%,#f7fbff_100%)]" />

      <div className="absolute left-[-120px] top-[90px] h-[240px] w-[420px] rounded-full bg-white/70 blur-3xl" />
      <div className="absolute right-[-80px] top-[120px] h-[260px] w-[360px] rounded-full bg-sky-100/70 blur-3xl" />
      <div className="absolute bottom-[-40px] left-[20%] h-[220px] w-[420px] rounded-full bg-blue-100/60 blur-3xl" />

      <div className="relative z-10 flex min-h-screen flex-col">
        <header className="flex items-center justify-between px-6 py-5 md:px-10">
          <Link
            href="#about"
            className="inline-flex items-center rounded-full border border-sky-200 bg-white/70 px-4 py-2 text-sm text-sky-700 transition hover:border-sky-300 hover:bg-sky-100 hover:text-sky-900 hover:shadow-[0_10px_25px_rgba(125,211,252,0.2)]"
          >
            About
          </Link>
        </header>

        <div className="grid flex-1 items-center gap-10 px-6 pb-10 pt-2 md:px-10 lg:grid-cols-[1.1fr_0.9fr]">
          <LoginHero />
          <LoginCard />
        </div>

        <section
          id="about"
          className="mx-6 mb-10 rounded-[30px] border border-sky-200/70 bg-white/65 px-8 py-10 shadow-[0_20px_60px_rgba(125,211,252,0.14)] backdrop-blur-xl md:mx-10"
        >
          <div className="mx-auto max-w-4xl text-left">
            <p className="text-sm font-medium uppercase tracking-[0.28em] text-sky-600/80">
              About MISSU
            </p>

            <h2 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
              A voice-first company assistant grounded in policy.
            </h2>

            <p className="mx-auto mt-5 max-w-3xl text-sm leading-7 text-slate-600 md:text-base">
              MISSU is designed to make company knowledge feel accessible in real time.
              It combines natural voice interaction with policy-aware retrieval, so users can
              ask broad questions, receive clear answers, and then move into official company
              guidance when policy matters.
            </p>

            <div className="mt-8 grid gap-4 md:grid-cols-3">
              <div className="rounded-2xl border border-sky-100 bg-white/70 p-5 text-center">
                <h3 className="text-sm font-semibold text-slate-900">Real-Time Voice</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Speak naturally and receive responses in a fluid, conversational workflow.
                </p>
              </div>

              <div className="rounded-2xl border border-sky-100 bg-white/70 p-5 text-center">
                <h3 className="text-sm font-semibold text-slate-900">Policy-Aware</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  MISSU can guide users toward official policy answers when questions become company-specific.
                </p>
              </div>

              <div className="rounded-2xl border border-sky-100 bg-white/70 p-5 text-center">
                <h3 className="text-sm font-semibold text-slate-900">Audit-Ready</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Interactions can be logged and reviewed to support safer enterprise usage.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
