"use client";

import { useEffect, useRef, useState } from "react";
import styles from "./agent-panel.module.css";
import { askPolicyQuestion, type ConversationState } from "@/actions/rag";
import { TypewriterText } from "@/components/shared/typewriter-text";

type ChatPanelProps = {
  initialMessage?: string;
  userName?: string;
  onBack?: () => void;
};

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
  animate?: boolean;
};

export function ChatPanel({
  initialMessage = "",
  userName = "Art",
  onBack,
}: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "assistant-welcome",
      role: "assistant",
      content:
        "You're now connected to MISSU. Ask about company policy, procedures, or department-specific guidance.",
      animate: true,
    },
  ]);
  const [draft, setDraft] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [conversationState, setConversationState] = useState<ConversationState | null>(null);
  const hasSentInitialMessage = useRef(false);

  async function sendMessage(question: string) {
    const trimmedQuestion = question.trim();

    if (!trimmedQuestion || isLoading) {
      return;
    }

    const userMessage: Message = {
      id: `user-${Date.now()}`,
      role: "user",
      content: trimmedQuestion,
      animate: false,
    };

    setMessages((current) => [...current, userMessage]);
    setIsLoading(true);

    const currentConversationState = conversationState;
    const lastPolicyQuestion =
      currentConversationState?.lastPolicyQuestion || trimmedQuestion;

    try {
      const data = await askPolicyQuestion({
        question: trimmedQuestion,
        conversationState: currentConversationState,
      });

      const assistantMessage: Message = {
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: data.answer || "MISSU did not return a response.",
        animate: true,
      };

      setMessages((current) => [...current, assistantMessage]);

      if (data.needsClarification && data.clarificationType === "department") {
        setConversationState({
          lastPolicyQuestion,
          pendingClarification: {
            type: "department",
            options: data.clarificationOptions || [],
          },
        });
      } else {
        setConversationState(null);
      }
    } catch (error) {
      const assistantMessage: Message = {
        id: `assistant-error-${Date.now()}`,
        role: "assistant",
        content:
          error instanceof Error
            ? `I couldn't reach the backend: ${error.message}`
            : "I couldn't reach the backend.",
        animate: true,
      };

      setMessages((current) => [...current, assistantMessage]);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleSend() {
    if (!draft.trim()) {
      return;
    }

    const nextQuestion = draft;
    setDraft("");
    await sendMessage(nextQuestion);
  }

  useEffect(() => {
    if (!initialMessage.trim() || hasSentInitialMessage.current) {
      return;
    }

    hasSentInitialMessage.current = true;
    void sendMessage(initialMessage);
  }, [initialMessage]);

  return (
    <section className={styles.chatPage}>
      <div className={styles.chatShell}>
        <div className={styles.chatHeader}>
          <div>
            <p className={styles.chatKicker}>Live Session</p>
            <h2 className={styles.chatTitle}>Mist Policy Assistant</h2>
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
              <p className={styles.messageText}>
                {message.role === "assistant" ? (
                  <TypewriterText
                    text={message.content}
                    animate={message.animate !== false}
                    speedMs={14}
                  />
                ) : (
                  message.content
                )}
              </p>
            </article>
          ))}

          {isLoading ? (
            <article className={`${styles.message} ${styles.assistantMessage}`}>
              <span className={styles.messageRole}>Mist</span>
              <p className={styles.messageText}>
                <TypewriterText text="Thinking..." animate speedMs={40} />
              </p>
            </article>
          ) : null}
        </div>

        <div className={styles.composer}>
          <input
            type="text"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                void handleSend();
              }
            }}
            placeholder="Type your next question..."
            className={styles.chatInput}
            disabled={isLoading}
          />

          <button
            type="button"
            className={styles.sendButton}
            onClick={() => void handleSend()}
            disabled={isLoading}
          >
            {isLoading ? "Sending..." : "Send"}
          </button>
        </div>
      </div>
    </section>
  );
}
