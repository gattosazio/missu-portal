import { SessionLog } from "./session-log";
import { VoiceStage } from "./voice-stage";
import styles from "./voice-panel.module.css";

export function VoicePanel() {
  return (
    <section className={styles.panel}>
      <div className={styles.shell}>
        <div className={styles.leftColumn}>
          <VoiceStage />
        </div>

        <div className={styles.rightColumn}>
          <SessionLog />
        </div>
      </div>
    </section>
  );
}
