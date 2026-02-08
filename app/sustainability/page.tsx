import { NavBar } from "@/components/nav-bar";
import { Footer } from "@/components/footer";
import Image from "next/image";
import { TypewriterH1 } from "@/components/ui/typewriter";

export const metadata = { title: "Sustainability – Bistroflow" };

export default function SustainabilityPage() {
  return (
    <div>
      <NavBar />
      <main className="pt-24 container-edge">
        <div className="relative overflow-hidden rounded-3xl glass">
          <div className="relative aspect-[3/1]">
            <Image
              src="https://images.unsplash.com/photo-1524594154907-9113f18f4657?q=80&w=1600&auto=format&fit=crop"
              alt="Sustainability"
              fill
              className="object-cover"
            />
          </div>
        </div>
        <TypewriterH1 text="Sustainability" glow className="font-display text-3xl font-bold mt-6" />
        <p className="mt-2 opacity-80 max-w-2xl">
          We prioritize local sourcing, eco-friendly packaging, and minimizing waste.
          This section highlights our commitments and ongoing initiatives.
        </p>
      </main>
      <Footer />
    </div>
  );
}
