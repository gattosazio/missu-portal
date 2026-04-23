"use client";

import { useMemo, useState } from "react";
import styles from "./agent-panel.module.css";

type ChatPanelProps = {
  initialMessage?: string;
  userName?: string;
  onBack?: () => void;
};

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export function ChatPanel({
  initialMessage = "",
  userName = "Art",
  onBack,
}: ChatPanelProps) {
  const initialMessages = useMemo<Message[]>(
    () => [
      {
        id: "assistant-welcome",
        role: "assistant",
        content: `You're now connected to MISSU. Ask about company policy, procedures, or site-specific guidance.`,
      },
      ...(initialMessage.trim()
        ? [
            {
              id: "user-initial",
              role: "user" as const,
              content: initialMessage,
            },
            {
              id: "assistant-followup",
              role: "assistant" as const,
              content:
                "I’m ready to help with that. This is where the live response flow, citations, and follow-up questions can appear.",
            },
          ]
        : []),
    ],
    [initialMessage]
  );

  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [draft, setDraft] = useState("");

  function handleSend() {
    if (!draft.trim()) {
      return;
    }

    const nextMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: draft,
    };

    const placeholderReply: Message = {
      id: `assistant-${Date.now()}`,
      role: "assistant",
      content:
        "Message received. You can wire this next to your actual agent response pipeline.",
    };

    setMessages((current) => [...current, nextMessage, placeholderReply]);
    setDraft("");
  }

  return (
    <section className={styles.chatPage}>
      <div className={styles.chatShell}>
        <div className={styles.chatHeader}>
          <div>
            <p className={styles.chatKicker}>Live Session</p>
            <h2 className={styles.chatTitle}>MISSU Policy Assistant</h2>
            <p className={styles.chatSubtitle}>Active conversation for {userName}</p>
          </div>

          {onBack ? (
            <button type="button" className={styles.backButton} onClick={onBack}>
              Back
            </button>
          ) : null}
        </div>

        <div className={styles.chatBody}>
          {messages.map((message) => (
            <article
              key={message.id}
              className={`${styles.message} ${
                message.role === "user" ? styles.userMessage : styles.assistantMessage
              }`}
            >
              <span className={styles.messageRole}>
                {message.role === "user" ? userName : "MISSU"}
              </span>
              <p className={styles.messageText}>{message.content}</p>
            </article>
          ))}
        </div>

        <div className={styles.composer}>
          <input
            type="text"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                handleSend();
              }
            }}
            placeholder="Type your next question..."
            className={styles.chatInput}
          />

          <button type="button" className={styles.sendButton} onClick={handleSend}>
            Send
          </button>
        </div>
      </div>
    </section>
  );
}
