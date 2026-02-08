import { OrdersClient } from "@/components/admin-sections-client";
import { AdminShell } from "@/components/admin-shell";

 export const metadata = { title: "Orders – Bistroflow" };

 export default function OrdersPage() {
  return (
    <AdminShell>
      <OrdersClient />
    </AdminShell>
  );
 }
