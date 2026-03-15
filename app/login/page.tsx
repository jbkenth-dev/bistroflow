import { Suspense } from "react";
import { CustomerLoginClient } from "@/components/customer-login-client";

export const metadata = { title: "Login – Bistroflow" };

export default function LoginPage() {
  return (
    <main>
      <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
        <CustomerLoginClient />
      </Suspense>
    </main>
  );
}
