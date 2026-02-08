import { StaffClient } from "@/components/admin-sections-client";
import { AdminShell } from "@/components/admin-shell";

 export const metadata = { title: "Staff – Bistroflow" };

 export default function StaffPage() {
  return (
    <AdminShell>
      <StaffClient />
    </AdminShell>
  );
 }
