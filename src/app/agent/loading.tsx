import { AgentPanelSkeleton } from "@/components/skeleton/agent-panel-skeleton";
import { AppShellSkeleton } from "@/components/skeleton/app-shell-skeleton";

export default function Loading() {
  return (
    <AppShellSkeleton title="Agent Panel" userName="Art" hideBreadcrumbs>
      <AgentPanelSkeleton />
    </AppShellSkeleton>
  );
}
