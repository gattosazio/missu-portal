import { AppShell } from "@/components/layout/app-shell";
import { AgentPageClient } from "./agent-page-client";

export default function AgentPage() {
  return (
    <AppShell title="Agent Panel" userName="Art">
      <AgentPageClient name="Art" />
    </AppShell>
  );
}
