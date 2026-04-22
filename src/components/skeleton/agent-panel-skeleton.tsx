export function AgentPanelSkeleton() {
  return (
    <section className="min-h-[calc(100vh-88px)] px-6 py-10">
      <div className="mx-auto flex w-full max-w-5xl justify-center">
        <div className="relative w-full max-w-4xl overflow-hidden rounded-[32px] border border-white/60 bg-[linear-gradient(to_bottom_right,rgba(255,255,255,0.62),rgba(255,255,255,0.34))] p-8 shadow-[0_20px_60px_rgba(148,163,184,0.14)] backdrop-blur-[28px]">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.85),transparent_28%),radial-gradient(circle_at_80%_20%,rgba(191,219,254,0.35),transparent_30%),radial-gradient(circle_at_50%_100%,rgba(186,230,253,0.22),transparent_35%)]" />
          <div className="absolute left-[8%] top-0 h-px w-[44%] bg-white/95 shadow-[0_0_18px_rgba(255,255,255,0.8)]" />

          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="h-12 w-3/4 animate-pulse rounded-full bg-slate-200" />
            <div className="mt-5 h-6 w-2/3 animate-pulse rounded-full bg-slate-100" />
            <div className="mt-2 h-6 w-1/2 animate-pulse rounded-full bg-slate-100" />

            <div className="mt-10 w-full">
              <div className="h-[60px] w-full animate-pulse rounded-[24px] border border-sky-100 bg-white/90" />
            </div>

            <div className="mt-4 flex justify-center">
              <div className="h-12 w-40 animate-pulse rounded-full border border-sky-200 bg-sky-100/80" />
            </div>

            <div className="mt-10 flex flex-wrap justify-center gap-3">
              <div className="h-9 w-32 animate-pulse rounded-full bg-white/85 shadow-sm" />
              <div className="h-9 w-36 animate-pulse rounded-full bg-white/85 shadow-sm" />
              <div className="h-9 w-28 animate-pulse rounded-full bg-white/85 shadow-sm" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
