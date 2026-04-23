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
import { getLiveKitToken } from "@/actions/rtc";

const LIVEKIT_URL = process.env.NEXT_PUBLIC_LIVEKIT_URL || "";
const AGENT_IDENTITY = "MISSU_CORE";

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

  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [micOn, setMicOn] = useState(false);
  const [agentSpeaking, setAgentSpeaking] = useState(false);
  const [statusText, setStatusText] = useState("Click the mic to start a voice session.");
  const [errorText, setErrorText] = useState("");

  useEffect(() => {
    return () => {
      void disconnectRoom();
    };
  }, []);

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

    setStatusText(`Connected. Receiving audio from ${publication.trackName || "MISSU"}.`);
  }

  async function disconnectRoom() {
    try {
      detachRemoteTrack();

      await localAudioTrackRef.current?.stop();
      localAudioTrackRef.current = null;

      roomRef.current?.disconnect();
      roomRef.current = null;
    } catch {}

    setIsConnected(false);
    setMicOn(false);
    setAgentSpeaking(false);
    setStatusText("Voice session disconnected.");
  }

  async function connectRoom() {
    if (isConnecting || isConnected) return;

    if (!LIVEKIT_URL) {
      setErrorText("Missing NEXT_PUBLIC_LIVEKIT_URL in the frontend environment.");
      return;
    }

    setErrorText("");
    setIsConnecting(true);
    setStatusText("Requesting microphone access...");

    try {
      const token = await getLiveKitToken();

      const room = new Room({
        adaptiveStream: true,
        dynacast: true,
      });

      room
        .on(RoomEvent.Connected, () => {
          setIsConnected(true);
          setStatusText("Connected. Microphone is live.");
        })
        .on(RoomEvent.Disconnected, () => {
          detachRemoteTrack();
          setIsConnected(false);
          setMicOn(false);
          setAgentSpeaking(false);
          setStatusText("Voice session disconnected.");
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
        });

      await room.connect(LIVEKIT_URL, token);

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
      setMicOn(true);
      setStatusText("Connected. Sending microphone audio to MISSU.");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to connect voice session.";

      setErrorText(message);
      setStatusText("Unable to start voice session.");
      await disconnectRoom();
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
      setStatusText("Microphone muted.");
    } else {
      await track.unmute();
      setMicOn(true);
      setStatusText("Microphone live.");
    }
  }

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
              Real-time conversation between the user and MISSU.
            </p>
          </div>

          <div className={styles.livePill}>
            <span className={styles.liveDot} />
            {isConnecting
              ? "Connecting"
              : agentSpeaking
                ? "MISSU Speaking"
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
              disabled={isConnecting}
            >
              <span className={styles.micHalo} />
              <MicIcon muted={!micOn} />
            </button>

            <p className={styles.micStatusText}>
              {isConnecting
                ? "Connecting to LiveKit..."
                : micOn
                  ? "Mic is on and streaming to MISSU"
                  : isConnected
                    ? "Mic is muted"
                    : "Click the mic to start voice"}
            </p>
          </div>

          <div className={`${styles.participantCard} ${styles.agentCard}`}>
            <p className={styles.participantName}>MISSU</p>

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
          </div>
        </div>

        <div className={styles.transcriptCard}>
          <p className={styles.transcriptLabel}>Active Transcript</p>
          <p className={styles.transcriptText}>
            Basic voice transport is enabled. Next step is wiring STT/TTS events into this panel.
          </p>
        </div>
      </div>
    </section>
  );
}