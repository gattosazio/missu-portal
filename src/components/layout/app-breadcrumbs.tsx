"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./app-layout.module.css";

const LABELS: Record<string, string> = {
  agent: "Agent Panel",
  voice: "Voice Session",
  admin: "Admin Panel",
  settings: "Settings",
  help: "Help & Support",
};

function buildBreadcrumbs(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);

  if (!segments.length || pathname === "/agent") {
    return [];
  }

  return segments.map((segment, index) => ({
    href: `/${segments.slice(0, index + 1).join("/")}`,
    label: LABELS[segment] || segment,
  }));
}

export function AppBreadcrumbs() {
  const pathname = usePathname();
  const breadcrumbs = buildBreadcrumbs(pathname);

  return (
    <div className={styles.breadcrumbs}>
      <nav className={styles.breadcrumbNav}>
        <Link href="/agent" className={styles.breadcrumbLink}>
          Agent Panel
        </Link>

        {breadcrumbs.map((crumb, index) => (
          <div key={crumb.href} className={styles.breadcrumbNav}>
            <span className={styles.breadcrumbSeparator}>/</span>
            {index === breadcrumbs.length - 1 ? (
              <span className={styles.breadcrumbCurrent}>{crumb.label}</span>
            ) : (
              <Link href={crumb.href} className={styles.breadcrumbLink}>
                {crumb.label}
              </Link>
            )}
          </div>
        ))}
      </nav>
    </div>
  );
}
