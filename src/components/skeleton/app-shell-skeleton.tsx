type AppShellSkeletonProps = {
  title: string;
  userName?: string;
  hideBreadcrumbs?: boolean;
  children: React.ReactNode;
};

export function AppShellSkeleton({
  title,
  userName = "Art",
  hideBreadcrumbs = false,
  children,
}: AppShellSkeletonProps) {
  return (
    <div className="min-h-screen bg-[#f8fbff]">
      <div className="border-b border-slate-200/70 bg-white/80 px-6 py-4 backdrop-blur-xl">
        <div className="flex items-center justify-between gap-6">
          <div>
            <div className="mb-1 h-3 w-28 animate-pulse rounded-full bg-sky-100" />
            <h1 className="text-lg font-semibold text-slate-900">{title}</h1>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-3 rounded-full border border-sky-200 bg-white/80 px-3 py-2 shadow-[0_10px_25px_rgba(125,211,252,0.12)]">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-sky-100 text-sm font-semibold text-sky-700">
                {userName.slice(0, 1).toUpperCase()}
              </div>
              <span className="text-sm font-medium text-slate-700">{userName}</span>
            </div>

            <div className="h-10 w-10 animate-pulse rounded-full border border-sky-200 bg-white/80 shadow-[0_10px_25px_rgba(125,211,252,0.12)]" />
          </div>
        </div>
      </div>

      {!hideBreadcrumbs ? (
        <div className="px-6 pt-3">
          <div className="flex items-center gap-2">
            <div className="h-4 w-24 animate-pulse rounded-full bg-slate-200" />
            <div className="h-4 w-3 animate-pulse rounded-full bg-slate-200" />
            <div className="h-4 w-28 animate-pulse rounded-full bg-sky-100" />
          </div>
        </div>
      ) : null}

      <main className="flex-1 bg-[linear-gradient(to_bottom,#f8fbff_0%,#eef7ff_45%,#f8fbff_100%)]">
        {children}
      </main>
    </div>
  );
}
