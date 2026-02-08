import { NavBar } from "@/components/nav-bar";
import { Footer } from "@/components/footer";
import { CustomerLoginClient } from "@/components/customer-login-client";

export const metadata = { title: "Login – Bistroflow" };

export default function LoginPage() {
  return (
    <div>
      <NavBar />
      <main className="pt-24">
        <CustomerLoginClient />
      </main>
      <Footer />
    </div>
  );
}
