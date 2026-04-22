import { AppShell } from "@/components/layout/app-shell";
import { VoicePanel } from "@/components/voice/voice-panel";

export default function VoicePage() {
  return (
    <AppShell title="Voice Session" userName="Art">
      <VoicePanel />
    </AppShell>
  );
}
