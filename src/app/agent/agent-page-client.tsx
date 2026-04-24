"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import styles from "@/components/agent/agent-panel.module.css";
import { ChatPanel } from "@/components/agent/chat-panel";

type AgentPageClientProps = {
  name?: string;
};

export function AgentPageClient({ name = "Art" }: AgentPageClientProps) {
  const [mode, setMode] = useState<"idle" | "chat">("idle");
  const [draft, setDraft] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!draft.trim()) {
      return;
    }

    setMode("chat");
  }

  if (mode === "chat") {
    return (
      <ChatPanel
        initialMessage={draft}
        userName={name}
        onBack={() => setMode("idle")}
      />
    );
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
            Ask about company rules, procedures, or department-specific policies and Mist will help
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

              <Link href="/voice" className={styles.voiceButton}>
                Voice Session
              </Link>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}