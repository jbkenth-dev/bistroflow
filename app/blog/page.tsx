import { NavBar } from "@/components/nav-bar";
import { Footer } from "@/components/footer";
import Image from "next/image";
import { TypewriterH1 } from "@/components/ui/typewriter";

export const metadata = { title: "Blog / Food Stories – Bistroflow" };

export default function BlogPage() {
  return (
    <div>
      <NavBar />
      <main className="pt-24 container-edge">
        <TypewriterH1 text="Food Stories" glow className="font-display text-3xl font-bold" />
        <div className="mt-6 grid md:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <article key={i} className="glass rounded-2xl overflow-hidden">
              <div className="relative aspect-[4/3]">
                <Image
                  src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=1200&auto=format&fit=crop"
                  alt={`Story ${i + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="font-semibold">Story {i + 1}</h3>
                <p className="mt-2 text-sm">Behind the scenes of our signature dishes.</p>
              </div>
            </article>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
