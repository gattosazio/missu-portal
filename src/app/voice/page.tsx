import { AppShell } from "@/components/layout/app-shell";
import { SessionLog } from "@/components/voice/session-log";
import { VoiceStage } from "@/components/voice/voice-stage";
import styles from "@/components/voice/voice-panel.module.css";

export default function VoicePage() {
  return (
    <AppShell title="Voice Session" userName="Art">
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
    </AppShell>
  );
}
