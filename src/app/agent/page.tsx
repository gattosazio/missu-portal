import { AgentPanel } from "@/components/agent/agent-panel";
import { AppShell } from "@/components/layout/app-shell";

export default function AgentPage() {
  return (
    <AppShell title="Agent Panel" userName="Art">
      <AgentPanel name="Art" />
    </AppShell>
  );
}
