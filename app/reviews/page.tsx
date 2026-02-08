import { NavBar } from "@/components/nav-bar";
import { Footer } from "@/components/footer";
import Image from "next/image";
import { TypewriterH1 } from "@/components/ui/typewriter";

export const metadata = { title: "Customer Reviews – Bistroflow" };

export default function ReviewsPage() {
  return (
    <div>
      <NavBar />
      <main className="pt-24 container-edge">
        <TypewriterH1 text="Customer Reviews" glow className="font-display text-3xl font-bold" />
        <div className="mt-6 grid md:grid-cols-3 gap-6">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="glass rounded-2xl p-6 flex items-center gap-4">
              <div className="relative w-12 h-12 rounded-full overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=256&auto=format&fit=crop"
                  alt="Reviewer"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="min-w-0">
                <p className="text-sm">“Exceptional flavors and beautiful presentation.”</p>
                <p className="mt-2 text-xs opacity-70">⭐ 4.{i % 5} • Verified</p>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
