import { AdminReportsClient } from "@/components/admin-reports-client";
import { AdminShell } from "@/components/admin-shell";

export const metadata = { title: "Reports & Analytics – Bistroflow Admin" };

export default function AdminReportsPage() {
  return (
    <AdminShell>
      <AdminReportsClient />
    </AdminShell>
  );
}