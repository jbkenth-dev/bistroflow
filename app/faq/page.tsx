import { NavBar } from "@/components/nav-bar";
import { Footer } from "@/components/footer";
import Image from "next/image";
import { TypewriterH1 } from "@/components/ui/typewriter";

export const metadata = { title: "FAQ – Bistroflow" };

export default function FAQPage() {
  return (
    <div>
      <NavBar />
      <main className="pt-24 container-edge">
        <TypewriterH1 text="Frequently Asked Questions" glow className="font-display text-3xl font-bold" />
        <div className="mt-6 space-y-4">
          {[
            { q: "Is this a real ordering system?", a: "This is a frontend-only visual showcase." },
            { q: "How do reservations work?", a: "UI-only form; no backend booking is processed." },
            { q: "Do you support offline?", a: "PWA-ready structure with offline UI states (mock)." }
          ].map((f, i) => (
            <div key={i} className="glass rounded-2xl overflow-hidden">
              <div className="relative aspect-[4/2]">
                <Image
                  src="https://images.unsplash.com/photo-1542744094-24638eff58bb?q=80&w=1600&auto=format&fit=crop"
                  alt={`FAQ ${i + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="font-semibold">{f.q}</h3>
                <p className="mt-2 text-sm">{f.a}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
