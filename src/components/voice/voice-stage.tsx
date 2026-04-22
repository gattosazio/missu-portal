"use client";

import { useState } from "react";
import styles from "./voice-panel.module.css";
import WaveformRing from "./wave-form-ring";

function MicIcon({ muted }: { muted: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      className={`${styles.micIcon} ${muted ? styles.micIconOff : styles.micIconOn}`}
    >
      <path d="M12 14.5a3.5 3.5 0 0 0 3.5-3.5V7a3.5 3.5 0 1 0-7 0v4a3.5 3.5 0 0 0 3.5 3.5Z" />
      <path d="M18 11a1 1 0 1 0-2 0 4 4 0 1 1-8 0 1 1 0 1 0-2 0 5.98 5.98 0 0 0 5 5.91V19H9.5a1 1 0 1 0 0 2h5a1 1 0 1 0 0-2H13v-2.09A5.98 5.98 0 0 0 18 11Z" />
      {muted ? <path d="M5.7 4.3a1 1 0 0 0-1.4 1.4l14 14a1 1 0 0 0 1.4-1.4l-14-14Z" /> : null}
    </svg>
  );
}

export function VoiceStage() {
  const [micOn, setMicOn] = useState(true);
  const [agentSpeaking] = useState(true);

  return (
    <section className={`${styles.glassCard} ${styles.stageCard}`}>
      <div className={styles.glassGlow} />
      <div className={styles.glassShine} />

      <div className={styles.stageInner}>
        <div className={styles.stageHeader}>
          <div>
            <h2 className={styles.stageTitle}>Live Voice Room</h2>
            <p className={styles.stageSubtitle}>
              Real-time conversation between the user and MISSU.
            </p>
          </div>

          <div className={styles.livePill}>
            <span className={styles.liveDot} />
            {agentSpeaking ? "MISSU Speaking" : micOn ? "Listening" : "Mic Muted"}
          </div>
        </div>

        <div className={styles.stageGrid}>
        <div className={`${styles.participantCard} ${styles.userCard}`}>
            <p className={styles.participantName}>ART</p>

            <div className={styles.userVisual}>
            <div className={styles.avatar} />
            <div className={styles.personBase} />
        </div>

            <button
              type="button"
              onClick={() => setMicOn((prev) => !prev)}
              className={`${styles.micControl} ${micOn ? styles.micControlOn : styles.micControlOff}`}
              aria-pressed={micOn}
              aria-label={micOn ? "Turn microphone off" : "Turn microphone on"}
            >
              <span className={styles.micHalo} />
              <MicIcon muted={!micOn} />
            </button>

            <p className={styles.micStatusText}>
              {micOn ? "Mic is on and waiting for speech" : "Mic is currently muted"}
            </p>
          </div>

            <div className={`${styles.participantCard} ${styles.agentCard}`}>
             <p className={styles.participantName}>MISSU</p>

                <div className={styles.agentVisual}>
                    <div className={styles.ringScene}>
                    <div className={styles.ringGlow} />
                    <WaveformRing className="w-full" />
                    </div>
                </div>

                <div className={styles.agentStatePill}>
                    <span className={styles.liveDot} />
                    {agentSpeaking ? "Speaking" : micOn ? "Listening" : "Idle"}
                </div>

                <p className={styles.agentStatusText}>
                    {agentSpeaking
                    ? "MISSU is actively speaking and rendering a response."
                    : micOn
                        ? "MISSU is listening for your next message."
                        : "MISSU is waiting while the microphone is muted."}
                </p>
                </div>
                    </div>

        <div className={styles.transcriptCard}>
          <p className={styles.transcriptLabel}>Active Transcript</p>
          <p className={styles.transcriptText}>
            MISSU is responding with a voice-aware, policy-guided answer.
          </p>
        </div>
      </div>
    </section>
  );
}
