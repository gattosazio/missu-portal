import styles from "./login-hero.module.css";

export function LoginHero() {
  return (
    <div className={styles.hero}>
      <div className={styles.cloudOne} />
      <div className={styles.cloudTwo} />
      <div className={styles.cloudThree} />

      <div className={styles.content}>
        <p className={styles.kicker}>Voice + Policy Intelligence</p>

        <h2 className={styles.title}>
          Ask naturally.
          <br />
          Verify precisely.
        </h2>

        <p className={styles.description}>
          Mist combines real-time voice interaction with grounded company policy
          retrieval, so answers feel fast, clear, and ready for work.
        </p>

        <div className={styles.badge}>
          <span className={styles.badgeDot} />
          Live voice, policy-aware, audit-ready
        </div>
      </div>
    </div>
  );
}
