import styles from "./agent-panel.module.css";

type AgentPanelProps = {
  name?: string;
};

export function AgentPanel({ name = "Art" }: AgentPanelProps) {
  return (
    <section className={styles.page}>
      <div className={styles.card}>
        <div className={styles.cardGlow} />
        <div className={styles.cardShine} />

        <div className={styles.content}>
          <h2 className={styles.title}>
            Hi {name}, feel free to ask company-related policy questions.
          </h2>

          <p className={styles.subtitle}>
            Ask about company rules, procedures, or site-specific guidance and
            MISSU will help you navigate the right policy context.
          </p>

          <div className={styles.inputWrap}>
            <input
              type="text"
              placeholder="Ask here.."
              className={styles.input}
            />
          </div>

          <div className={styles.voiceRow}>
            <button type="button" className={styles.voiceButton}>
              Voice Session
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
