export default function Loading() {
  return (
    <main className="min-h-screen bg-[#f8fbff] px-6 py-6">
      <div className="flex items-center justify-between">
        <div className="h-10 w-24 animate-pulse rounded-full bg-white shadow-sm" />
      </div>

      <div className="mt-10 grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-[28px] bg-white/40 p-10 shadow-[0_20px_60px_rgba(148,163,184,0.10)]">
          <div className="h-4 w-56 animate-pulse rounded-full bg-sky-100" />
          <div className="mt-6 h-12 w-2/3 animate-pulse rounded-full bg-slate-200" />
          <div className="mt-4 h-5 w-3/4 animate-pulse rounded-full bg-slate-100" />
          <div className="mt-2 h-5 w-2/3 animate-pulse rounded-full bg-slate-100" />
          <div className="mt-8 h-10 w-60 animate-pulse rounded-full bg-white" />
        </section>

        <section className="rounded-[30px] bg-white/70 p-8 shadow-[0_25px_80px_rgba(125,211,252,0.14)]">
          <div className="h-4 w-24 animate-pulse rounded-full bg-sky-100" />
          <div className="mt-3 h-10 w-40 animate-pulse rounded-full bg-slate-200" />
          <div className="mt-6 h-12 w-full animate-pulse rounded-2xl bg-white" />
          <div className="mt-4 h-12 w-full animate-pulse rounded-2xl bg-white" />
          <div className="mt-6 h-12 w-32 animate-pulse rounded-full bg-sky-100" />
        </section>
      </div>
    </main>
  );
}
