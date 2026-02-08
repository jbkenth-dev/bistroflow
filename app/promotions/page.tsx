import { NavBar } from "@/components/nav-bar";
import { Footer } from "@/components/footer";
import Image from "next/image";
import { TypewriterH1 } from "@/components/ui/typewriter";

export const metadata = { title: "Promotions & Deals – Bistroflow" };

export default function PromotionsPage() {
  return (
    <div>
      <NavBar />
      <main className="pt-24 container-edge">
        <TypewriterH1 text="Promotions & Deals" glow className="font-display text-3xl font-bold" />
        <div className="mt-6 grid md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="glass rounded-2xl overflow-hidden">
              <div className="relative aspect-[4/3]">
                <Image
                  src={`https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop`}
                  alt={`Deal ${i + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="font-semibold">Limited Offer {i + 1}</h3>
                <p className="mt-2 text-sm">Save up to 20% on selected items.</p>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
