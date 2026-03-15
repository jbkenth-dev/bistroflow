import { AdminShell } from "@/components/admin-shell";
import { AdminFloorClient } from "@/components/admin-floor-client";

export const metadata = { title: "Table Floor – Bistroflow Admin" };

export default function AdminFloorPage() {
  return (
    <AdminShell>
      <AdminFloorClient />
    </AdminShell>
  );
}
