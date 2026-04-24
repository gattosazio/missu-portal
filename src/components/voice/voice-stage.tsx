"use client";

import { useEffect, useRef, useState } from "react";
import {
  Room,
  RoomEvent,
  Track,
  createLocalAudioTrack,
  type LocalAudioTrack,
  type RemoteTrack,
  type RemoteTrackPublication,
  type RemoteParticipant,
} from "livekit-client";
import styles from "./voice-panel.module.css";
import WaveformRing from "./wave-form-ring";
import {
  closeVoiceSession,
  createVoiceSession,
  type LiveKitSessionResponse,
} from "@/actions/rtc";
import { TypewriterText } from "@/components/shared/typewriter-text";

const LIVEKIT_URL = process.env.NEXT_PUBLIC_LIVEKIT_URL || "";
const AGENT_IDENTITY = "MISSU_CORE";
const TRANSCRIPT_TOPIC = "missu.transcript";

type TranscriptItem = {
  id: string;
  speaker: "user" | "agent";
  text: string;
  animate?: boolean;
};

type TranscriptEventPayload = {
  type: "transcript";
  speaker: "user" | "agent";
  text: string;
  final: boolean;
  participantIdentity?: string;
  createdAt?: number;
};

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
  const roomRef = useRef<Room | null>(null);
  const localAudioTrackRef = useRef<LocalAudioTrack | null>(null);
  const remoteAudioElementRef = useRef<HTMLAudioElement | null>(null);
  const currentRemoteTrackRef = useRef<RemoteTrack | null>(null);
  const voiceSessionRef = useRef<LiveKitSessionResponse | null>(null);
  const disconnectIntentRef = useRef(false);
  const teardownPromiseRef = useRef<Promise<void> | null>(null);

  const [isConnecting, setIsConnecting] = useState(false);
  const [isDisconnecting, setIsDisconnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [micOn, setMicOn] = useState(false);
  const [agentSpeaking, setAgentSpeaking] = useState(false);
  const [statusText, setStatusText] = useState("Click the mic to start a voice session.");
  const [errorText, setErrorText] = useState("");
  const [transcriptItems, setTranscriptItems] = useState<TranscriptItem[]>([]);
  const [voiceSession, setVoiceSession] = useState<LiveKitSessionResponse | null>(null);

  useEffect(() => {
    voiceSessionRef.current = voiceSession;
  }, [voiceSession]);

  useEffect(() => {
    const handleBeforeUnload = () => {
      const session = voiceSessionRef.current;
      if (!session?.sessionId) {
        return;
      }

      void closeVoiceSession(session.sessionId, { keepalive: true }).catch(() => {});
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      void disconnectRoom({ notifyBackend: true, reason: "component unmount" });
    };
  }, []);

  function appendTranscriptItem(item: TranscriptItem) {
    setTranscriptItems((current) => [...current, item].slice(-8));
  }

  function detachRemoteTrack() {
    if (currentRemoteTrackRef.current && remoteAudioElementRef.current) {
      currentRemoteTrackRef.current.detach(remoteAudioElementRef.current);
    }
    currentRemoteTrackRef.current = null;
  }

  function attachRemoteTrack(
    track: RemoteTrack,
    participant: RemoteParticipant,
    publication: RemoteTrackPublication
  ) {
    if (track.kind !== Track.Kind.Audio) return;
    if (participant.identity !== AGENT_IDENTITY) return;
    if (!remoteAudioElementRef.current) return;

    detachRemoteTrack();

    currentRemoteTrackRef.current = track;
    track.attach(remoteAudioElementRef.current);

    remoteAudioElementRef.current.autoplay = true;
    remoteAudioElementRef.current.setAttribute("playsinline", "");

    void remoteAudioElementRef.current.play().catch(() => {
      setErrorText("Connected, but the browser blocked audio autoplay.");
    });

    setStatusText(`Connected. Receiving audio from ${publication.trackName || "Mist"}.`);
  }

  function handleTranscriptData(payload: Uint8Array, topic?: string) {
    if (topic !== TRANSCRIPT_TOPIC) {
      return;
    }

    try {
      const decoded = new TextDecoder().decode(payload);
      const data = JSON.parse(decoded) as TranscriptEventPayload;

      if (data.type !== "transcript" || !data.final || !data.text?.trim()) {
        return;
      }

      appendTranscriptItem({
        id: `${data.speaker}-${data.createdAt || Date.now()}-${Math.random().toString(36).slice(2)}`,
        speaker: data.speaker,
        text: data.text.trim(),
        animate: true,
      });
    } catch {
      setErrorText("Received an unreadable transcript event.");
    }
  }

  async function disconnectRoom(options?: { notifyBackend?: boolean; reason?: string }) {
    if (teardownPromiseRef.current) {
      return teardownPromiseRef.current;
    }

    const notifyBackend = options?.notifyBackend ?? true;
    const reason = options?.reason || "client teardown";
    const currentSession = voiceSessionRef.current;

    const teardown = (async () => {
      setIsDisconnecting(true);
      disconnectIntentRef.current = true;
      setStatusText("Ending voice session...");

      try {
        detachRemoteTrack();

        await localAudioTrackRef.current?.stop();
        localAudioTrackRef.current = null;

        roomRef.current?.disconnect();
        roomRef.current = null;

        if (notifyBackend && currentSession?.sessionId) {
          try {
            await closeVoiceSession(currentSession.sessionId, { keepalive: true });
          } catch (error) {
            console.error("[VOICE DEBUG] closeVoiceSession failed", error);
          }
        }
      } catch (error) {
        console.error("[VOICE DEBUG] disconnectRoom failed", error);
      } finally {
        voiceSessionRef.current = null;
        setVoiceSession(null);
        setTranscriptItems([]);
        setIsConnected(false);
        setMicOn(false);
        setAgentSpeaking(false);
        setIsDisconnecting(false);
        setStatusText("Voice session disconnected.");
        disconnectIntentRef.current = false;
        teardownPromiseRef.current = null;
      }
    })();

    teardownPromiseRef.current = teardown;
    return teardown;
  }

  async function connectRoom() {
    if (isConnecting || isConnected || isDisconnecting) return;

    if (!LIVEKIT_URL) {
      setErrorText("Missing NEXT_PUBLIC_LIVEKIT_URL in the frontend environment.");
      return;
    }

    setErrorText("");
    setTranscriptItems([]);
    setIsConnecting(true);
    setStatusText("Creating secure voice session...");

    try {
      const session = await createVoiceSession();

      const room = new Room({
        adaptiveStream: true,
        dynacast: true,
      });

      room
        .on(RoomEvent.Connected, () => {
          setIsConnected(true);
          setStatusText(`Connected to ${session.roomName}. Microphone is live.`);
        })
        .on(RoomEvent.Disconnected, () => {
          detachRemoteTrack();
          setIsConnected(false);
          setMicOn(false);
          setAgentSpeaking(false);

          if (!disconnectIntentRef.current && voiceSessionRef.current?.sessionId) {
            void closeVoiceSession(voiceSessionRef.current.sessionId, {
              keepalive: true,
            }).catch((error) => {
              console.error("[VOICE DEBUG] forced closeVoiceSession failed", error);
            });
          }
        })
        .on(RoomEvent.ActiveSpeakersChanged, (speakers) => {
          const remoteSpeaking = speakers.some(
            (speaker) => speaker.identity === AGENT_IDENTITY
          );
          setAgentSpeaking(remoteSpeaking);
        })
        .on(RoomEvent.TrackSubscribed, (track, publication, participant) => {
          attachRemoteTrack(track, participant, publication);
        })
        .on(RoomEvent.TrackUnsubscribed, (track, publication, participant) => {
          if (
            participant.identity === AGENT_IDENTITY &&
            track.kind === Track.Kind.Audio
          ) {
            detachRemoteTrack();
            setAgentSpeaking(false);
          }
        })
        .on(RoomEvent.DataReceived, (payload, participant, _kind, topic) => {
          if (participant?.identity !== AGENT_IDENTITY) {
            return;
          }

          handleTranscriptData(payload, topic);
        });

      await room.connect(LIVEKIT_URL, session.token);

      const audioTrack = await createLocalAudioTrack({
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      });

      await room.localParticipant.publishTrack(audioTrack, {
        source: Track.Source.Microphone,
      });

      room.remoteParticipants.forEach((participant) => {
        participant.trackPublications.forEach((publication) => {
          if (publication.track) {
            attachRemoteTrack(publication.track, participant, publication);
          }
        });
      });

      roomRef.current = room;
      localAudioTrackRef.current = audioTrack;
      voiceSessionRef.current = session;
      setVoiceSession(session);
      setMicOn(true);
      setStatusText(`Connected to ${session.roomName}. Sending microphone audio to Mist.`);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to connect voice session.";

      setErrorText(message);
      setStatusText("Unable to start voice session.");
      await disconnectRoom({ notifyBackend: true, reason: "connect failure" });
    } finally {
      setIsConnecting(false);
    }
  }

  async function toggleMic() {
    if (!isConnected) {
      await connectRoom();
      return;
    }

    const track = localAudioTrackRef.current;
    if (!track) return;

    if (micOn) {
      await track.mute();
      setMicOn(false);
      setStatusText(
        voiceSession
          ? `Microphone muted for ${voiceSession.roomName}.`
          : "Microphone muted."
      );
    } else {
      await track.unmute();
      setMicOn(true);
      setStatusText(
        voiceSession
          ? `Microphone live in ${voiceSession.roomName}.`
          : "Microphone live."
      );
    }
  }

  const latestTranscriptId =
    transcriptItems.length > 0
      ? transcriptItems[transcriptItems.length - 1].id
      : null;

  return (
    <section className={`${styles.glassCard} ${styles.stageCard}`}>
      <div className={styles.glassGlow} />
      <div className={styles.glassShine} />
      <audio ref={remoteAudioElementRef} hidden />

      <div className={styles.stageInner}>
        <div className={styles.stageHeader}>
          <div>
            <h2 className={styles.stageTitle}>Live Voice Room</h2>
            <p className={styles.stageSubtitle}>
              Real-time conversation between the user and Mist.
            </p>
          </div>

          <div className={styles.livePill}>
            <span className={styles.liveDot} />
            {isConnecting
              ? "Connecting"
              : isDisconnecting
                ? "Ending"
                : agentSpeaking
                  ? "Mist Speaking"
                  : micOn
                    ? "Listening"
                    : isConnected
                      ? "Mic Muted"
                      : "Idle"}
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
              onClick={() => void toggleMic()}
              className={`${styles.micControl} ${micOn ? styles.micControlOn : styles.micControlOff}`}
              aria-pressed={micOn}
              aria-label={micOn ? "Turn microphone off" : "Turn microphone on"}
              disabled={isConnecting || isDisconnecting}
            >
              <span className={styles.micHalo} />
              <MicIcon muted={!micOn} />
            </button>

            <p className={styles.micStatusText}>
              {isConnecting
                ? "Connecting to LiveKit..."
                : isDisconnecting
                  ? "Ending voice session..."
                  : micOn
                    ? "Mic is on and streaming to Mist"
                    : isConnected
                      ? "Mic is muted"
                      : "Click the mic to start voice"}
            </p>
          </div>

          <div className={`${styles.participantCard} ${styles.agentCard}`}>
            <p className={styles.participantName}>MIST</p>

            <div className={styles.agentVisual}>
              <div className={styles.ringScene}>
                <div className={styles.ringGlow} />
                <WaveformRing intensity={agentSpeaking ? 0.85 : 0.12} className="w-full" />
              </div>
            </div>

            <div className={styles.agentStatePill}>
              <span className={styles.liveDot} />
              {agentSpeaking ? "Speaking" : micOn ? "Listening" : "Idle"}
            </div>

            <p className={styles.agentStatusText}>
              {statusText}
              {errorText ? ` ${errorText}` : ""}
            </p>

            {voiceSession ? (
              <p className={styles.agentStatusText}>
                Session: {voiceSession.roomName}
              </p>
            ) : null}
          </div>
        </div>

        <div className={styles.transcriptCard}>
          <p className={styles.transcriptLabel}>Active Transcript</p>

          {transcriptItems.length > 0 ? (
            <div className="mt-4 space-y-3">
              {transcriptItems.map((item) => (
                <div key={item.id}>
                  <p className={styles.transcriptLabel}>
                    {item.speaker === "user" ? "ART" : "MIST"}
                  </p>
                  <p className={styles.transcriptText}>
                    <TypewriterText
                      text={item.text}
                      animate={item.id === latestTranscriptId && item.animate !== false}
                      speedMs={14}
                    />
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className={styles.transcriptText}>
              Transcript events will appear here once the voice session is active.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
