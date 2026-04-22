type PageSkeletonProps = {
  title: string;
  showHero?: boolean;
};

export function PageSkeleton({
  title,
  showHero = false,
}: PageSkeletonProps) {
  return (
    <div className="min-h-screen bg-[#f8fbff]">
      <div className="border-b border-slate-200/70 bg-white/80 px-6 py-4 backdrop-blur-xl">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-3 w-28 animate-pulse rounded-full bg-sky-100" />
            <div className="h-7 w-40 animate-pulse rounded-full bg-slate-200" />
          </div>

          <div className="flex items-center gap-3">
            <div className="h-10 w-16 animate-pulse rounded-full bg-slate-200" />
            <div className="h-10 w-10 animate-pulse rounded-full bg-slate-200" />
          </div>
        </div>
      </div>

      <div className="px-6 pt-3">
        <div className="flex items-center gap-2">
          <div className="h-4 w-24 animate-pulse rounded-full bg-slate-200" />
          <div className="h-4 w-3 animate-pulse rounded-full bg-slate-200" />
          <div className="h-4 w-28 animate-pulse rounded-full bg-sky-100" />
        </div>
      </div>

      <main className="min-h-[calc(100vh-88px)] bg-[linear-gradient(to_bottom,#f8fbff_0%,#eef7ff_45%,#f8fbff_100%)] px-6 py-8">
        <div className="mx-auto w-full max-w-5xl">
          {showHero ? (
            <section className="rounded-[32px] border border-white/60 bg-white/50 p-8 shadow-[0_20px_60px_rgba(148,163,184,0.10)] backdrop-blur-xl">
              <div className="mx-auto max-w-3xl text-center">
                <div className="mx-auto h-10 w-2/3 animate-pulse rounded-full bg-slate-200" />
                <div className="mx-auto mt-4 h-6 w-3/4 animate-pulse rounded-full bg-slate-100" />
                <div className="mx-auto mt-2 h-6 w-1/2 animate-pulse rounded-full bg-slate-100" />

                <div className="mt-8 h-16 w-full animate-pulse rounded-[24px] bg-white" />
                <div className="mx-auto mt-4 h-12 w-40 animate-pulse rounded-full bg-sky-100" />
              </div>
            </section>
          ) : (
            <section className="rounded-[32px] border border-white/60 bg-white/50 p-8 shadow-[0_20px_60px_rgba(148,163,184,0.10)] backdrop-blur-xl">
              <div className="h-8 w-48 animate-pulse rounded-full bg-slate-200" />
              <div className="mt-4 h-5 w-2/3 animate-pulse rounded-full bg-slate-100" />
              <div className="mt-2 h-5 w-1/2 animate-pulse rounded-full bg-slate-100" />

              <div className="mt-8 grid gap-4 md:grid-cols-2">
                <div className="h-40 animate-pulse rounded-[24px] bg-white" />
                <div className="h-40 animate-pulse rounded-[24px] bg-white" />
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}
