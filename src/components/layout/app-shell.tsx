"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { AppBreadcrumbs } from "./app-breadcrumbs";
import { AppHeader } from "./app-header";

export function AppShell({
  title,
  children,
  userName = "Art",
}: {
  title: string;
  children: ReactNode;
  userName?: string;
}) {
  const pathname = usePathname();
  const showBreadcrumbs = pathname !== "/agent";

  return (
    <div className="min-h-screen bg-[#f6fbff]">
      <div className="flex min-h-screen flex-1 flex-col">
        <AppHeader title={title} userName={userName} />
        {showBreadcrumbs ? <AppBreadcrumbs /> : null}
        <main className="flex-1 bg-[radial-gradient(circle_at_top_left,rgba(186,230,253,0.45),transparent_22%),radial-gradient(circle_at_bottom_right,rgba(219,234,254,0.55),transparent_22%),linear-gradient(to_bottom,#f9fcff_0%,#edf7ff_55%,#f7fbff_100%)]">
          {children}
        </main>
      </div>
    </div>
  );
}
