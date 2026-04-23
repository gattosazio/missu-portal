"use client";

import { FormEvent, useState } from "react";
import styles from "./agent-panel.module.css";
import { ChatPanel } from "./chat-panel";

type AgentPanelProps = {
  name?: string;
};

export function AgentPanel({ name = "Art" }: AgentPanelProps) {
  const [mode, setMode] = useState<"idle" | "chat">("idle");
  const [draft, setDraft] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!draft.trim()) {
      return;
    }

    setMode("chat");
  }

  function handleVoiceStart() {
    setMode("chat");
  }

  if (mode === "chat") {
    return <ChatPanel initialMessage={draft} userName={name} onBack={() => setMode("idle")} />;
  }

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
            Ask about company rules, procedures, or site-specific guidance and MISSU will help
            you navigate the right policy context.
          </p>

          <form className={styles.inputWrap} onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Ask here.."
              className={styles.input}
              value={draft}
              onChange={(event) => setDraft(event.target.value)}
            />

            <div className={styles.actionRow}>
              <button type="submit" className={styles.askButton}>
                Start Chat
              </button>

              <button type="button" className={styles.voiceButton} onClick={handleVoiceStart}>
                Voice Session
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
