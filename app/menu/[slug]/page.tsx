import { NavBar } from "@/components/nav-bar";
import { Footer } from "@/components/footer";
import { foods } from "@/data/foods";
import Image from "next/image";
import { notFound } from "next/navigation";
import { CartFloating } from "@/components/cart-floating";
 import { ProductDetailClient } from "@/components/product-detail-client";

export const dynamic = "force-static";

export async function generateStaticParams() {
  return foods.map((f) => ({ slug: f.slug }));
}

export default function ProductDetail({ params }: any) {
  const item = foods.find((f) => f.slug === params.slug);
  if (!item) return notFound();
  return (
    <div>
      <NavBar />
      <main className="pt-24 container-edge">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="glass rounded-3xl overflow-hidden">
            <div className="relative aspect-[4/3]">
              <Image src={item.image} alt={item.name} fill className="object-cover" />
            </div>
          </div>
          <ProductDetailClient item={item} />
        </div>
      </main>
      <CartFloating />
      <Footer />
    </div>
  );
}
