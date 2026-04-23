import { AppShell } from "@/components/layout/app-shell";
import { SettingsPageClient } from "./settings-page-client";

export default function SettingsPage() {
  return (
    <AppShell title="Settings">
      <SettingsPageClient />
    </AppShell>
  );
}
