import { AdminMenuClient } from "@/components/admin-menu-client";
import { AdminShell } from "@/components/admin-shell";

export const metadata = { title: "Menu Management – Bistroflow Admin" };

export default function AdminMenuPage() {
  return (
    <AdminShell>
      <AdminMenuClient />
    </AdminShell>
  );
}
