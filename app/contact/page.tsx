import { NavBar } from "@/components/nav-bar";
import { Footer } from "@/components/footer";
import Image from "next/image";
import { TypewriterH1 } from "@/components/ui/typewriter";

export const metadata = { title: "Contact & Location – Bistroflow" };

export default function ContactPage() {
  return (
    <div>
      <NavBar />
      <main className="pt-24 container-edge">
        <TypewriterH1 text="Contact & Location" glow className="font-display text-3xl font-bold" />
        <div className="mt-6 glass rounded-2xl overflow-hidden">
          <div className="relative aspect-[3/1]">
            <Image
              src="https://images.unsplash.com/photo-1549923746-d6b5b04a0c39?q=80&w=1600&auto=format&fit=crop"
              alt="Location"
              fill
              className="object-cover"
            />
          </div>
        </div>
        <div className="mt-6 grid md:grid-cols-2 gap-6">
          <div className="glass rounded-2xl p-6">
            <h3 className="font-semibold">Address</h3>
            <p className="mt-2 text-sm">123 East Gate Ave, Metro City, PH 1000</p>
            <h3 className="font-semibold mt-4">Hours</h3>
            <p className="mt-2 text-sm">Mon–Sun 10:00–22:00</p>
          </div>
          <div className="glass rounded-2xl p-6">
            <h3 className="font-semibold">Contact</h3>
            <p className="mt-2 text-sm">info@eastgatebistro.com • +63 900 000 0000</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
