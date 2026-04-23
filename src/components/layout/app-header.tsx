import Link from "next/link";
import styles from "./app-layout.module.css";

type AppHeaderProps = {
  title: string;
  userName?: string;
};

export function AppHeader({
  title,
  userName = "Art",
}: AppHeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.headerRow}>
        <div className={styles.titleBlock}>
          <span className={styles.kicker}>MISSU Portal</span>
          <h1 className={styles.title}>{title}</h1>
        </div>

        <div className={styles.headerActions}>
          <div className={styles.profilePill}>
            <div className={styles.profileAvatar}>
              {userName.slice(0, 1).toUpperCase()}
            </div>
            <span className={styles.profileName}>{userName}</span>
          </div>

          <details className={styles.menu}>
            <summary className={styles.menuTrigger}>
              <span className={styles.menuIcon}>⋯</span>
            </summary>

            <div className={styles.menuContent}>
              <Link href="/settings" className={styles.menuLink}>
                Settings
              </Link>
              <Link href="/help" className={styles.menuLink}>
                Help &amp; Support
              </Link>
              <Link href="/admin" className={styles.menuLink}>
                Admin Panel
              </Link>
              <Link href="/login" className={styles.menuLink}>
                Logout
              </Link>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
