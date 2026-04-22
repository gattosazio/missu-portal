import styles from "./voice-panel.module.css";

const logs = [
  {
    speaker: "USER",
    message: "Agent, what is phishing?",
    type: "general_ai",
  },
  {
    speaker: "MISSU",
    message:
      "Phishing is a cyber attack where a message is designed to trick someone into revealing sensitive information.",
    type: "general_ai",
  },
  {
    speaker: "USER",
    message: "Do we have a company procedure for reporting suspicious emails?",
    type: "policy",
  },
  {
    speaker: "MISSU",
    message:
      "I can check the official company policy for that. If you want, I can verify the reporting process now.",
    type: "policy",
  },
];

export function SessionLog() {
  return (
    <aside className={`${styles.glassCard} ${styles.logCard}`}>
      <div className={styles.glassGlow} />
      <div className={styles.glassShine} />

      <div className={styles.logInner}>
        <div className={styles.logHeader}>
          <h2 className={styles.logTitle}>Session Log</h2>
          <span className={styles.logCount}>{logs.length} entries</span>
        </div>

        <div className={styles.logList}>
          {logs.map((log, index) => (
            <div key={`${log.speaker}-${index}`} className={styles.logItem}>
              <div className={styles.logMeta}>
                <span
                  className={`${styles.logSpeaker} ${
                    log.speaker === "USER" ? styles.userSpeaker : styles.agentSpeaker
                  }`}
                >
                  {log.speaker}
                </span>

                <span className={styles.logType}>{log.type}</span>
              </div>

              <p className={styles.logMessage}>{log.message}</p>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
