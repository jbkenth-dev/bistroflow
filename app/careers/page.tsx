import { NavBar } from "@/components/nav-bar";
import { Footer } from "@/components/footer";
import Image from "next/image";
import { TypewriterH1 } from "@/components/ui/typewriter";

export const metadata = { title: "Careers – Bistroflow" };

export default function CareersPage() {
  return (
    <div>
      <NavBar />
      <main className="pt-24 container-edge">
        <TypewriterH1 text="Careers" glow className="font-display text-3xl font-bold" />
        <div className="mt-6 grid md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="glass rounded-2xl overflow-hidden">
              <div className="relative aspect-[4/3]">
                <Image
                  src="https://images.unsplash.com/photo-1551292831-023188e78222?q=80&w=1200&auto=format&fit=crop"
                  alt={`Role ${i + 1}`}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-6">
                <h3 className="font-semibold">Role {i + 1}</h3>
                <p className="mt-2 text-sm">Join the team and help craft premium experiences.</p>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
