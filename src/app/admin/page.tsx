import { AppShell } from "@/components/layout/app-shell";
import { AdminPageClient } from "./admin-page-client";

export default function AdminPage() {
  return (
    <AppShell title="Admin Panel">
      <AdminPageClient />
    </AppShell>
  );
}
