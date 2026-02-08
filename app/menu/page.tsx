import { NavBar } from "@/components/nav-bar";
import { Footer } from "@/components/footer";
import { CartFloating } from "@/components/cart-floating";
import { MenuClient } from "@/components/menu-client";

export const dynamic = "force-dynamic";

export default async function MenuPage() {
  await new Promise((r) => setTimeout(r, 700));
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
