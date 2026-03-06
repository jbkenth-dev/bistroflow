import { AdminDashboardClient } from "@/components/admin-dashboard-client";
import { AdminShell } from "@/components/admin-shell";

export const metadata = { title: "Admin Dashboard – Bistroflow" };

export default function AdminDashboardPage() {
  return (
    <AdminShell>
      <AdminDashboardClient />
    </AdminShell>
  );
}
