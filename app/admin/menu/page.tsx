import { MenuClient } from "@/components/admin-sections-client";
import { AdminShell } from "@/components/admin-shell";

 export const metadata = { title: "Menu – Bistroflow" };

 export default function MenuPage() {
  return (
    <AdminShell>
      <MenuClient />
    </AdminShell>
  );
 }
