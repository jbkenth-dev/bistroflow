import { NavBar } from "@/components/nav-bar";
import { Footer } from "@/components/footer";
import { CartFloating } from "@/components/cart-floating";
import { MenuClient } from "@/components/menu-client";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Menu",
  description: "Browse our diverse menu featuring 50 artisanal dishes ranging from Filipino classics to modern burgers, all priced between ₱50 and ₱120.",
  openGraph: {
    title: "Menu | BISTROFLOW",
    description: "Explore our curated selection of 50 delicacies at affordable prices.",
  }
};

export const dynamic = "force-dynamic";

export default async function MenuPage() {
  return (
    <div>
      <NavBar />
      <main className="pt-24 container-edge">
        <MenuClient />
      </main>
      <CartFloating />
      <Footer />
    </div>
  );
}
