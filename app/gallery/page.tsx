import { NavBar } from "@/components/nav-bar";
import { Footer } from "@/components/footer";
 import { GalleryClient } from "@/components/gallery-client";
import { TypewriterH1 } from "@/components/ui/typewriter";

export const metadata = {
  title: "Gallery – Bistroflow",
  description: "100+ Images showcase"
};

export default function GalleryPage() {
  return (
    <div>
      <NavBar />
      <main className="pt-24 container-edge">
        <TypewriterH1 text="Gallery" glow className="font-display text-3xl font-bold" />
        <p className="mt-2 opacity-80">Lazy loaded images with blur-to-sharp effect.</p>
        <GalleryClient />
      </main>
      <Footer />
    </div>
  );
}
