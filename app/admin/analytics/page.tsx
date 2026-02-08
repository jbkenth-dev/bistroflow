import { AnalyticsClient } from "@/components/admin-sections-client";
import { AdminShell } from "@/components/admin-shell";

 export const metadata = { title: "Analytics – Bistroflow" };

 export default function AnalyticsPage() {
  return (
    <AdminShell>
      <AnalyticsClient />
    </AdminShell>
  );
 }
