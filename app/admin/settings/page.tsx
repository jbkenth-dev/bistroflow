import { SettingsClient } from "@/components/admin-sections-client";
import { AdminShell } from "@/components/admin-shell";
 
 export const metadata = { title: "Settings – Bistroflow" };
 
 export default function SettingsPage() {
  return (
    <AdminShell>
      <SettingsClient />
    </AdminShell>
  );
 }
