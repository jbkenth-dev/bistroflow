import { NavBar } from "@/components/nav-bar";
import { Footer } from "@/components/footer";
import { AccountClient } from "@/components/account-client";

export const metadata = { title: "My Account – Bistroflow" };

export default function AccountPage() {
  return (
    <div>
      <NavBar />
      <main className="pt-24 min-h-screen bg-gray-50/50">
        <AccountClient />
      </main>
      <Footer />
    </div>
  );
}
