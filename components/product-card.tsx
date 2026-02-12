"use client";
import { SafeImage } from "@/components/ui/safe-image";
import { IconStar, IconPeso } from "@/components/ui/icons";
import { motion } from "framer-motion";
import type { FoodItem } from "@/data/foods";
import { useCart } from "@/store/cart";
import Link from "next/link";
import { useState, useRef } from "react";
import { flyToCart } from "@/components/ui/fly-to-cart";

export function ProductCard({ item }: { item: FoodItem }) {
  const { add } = useCart();
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLDivElement | null>(null);
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      viewport={{ once: true }}
      className="glass rounded-xl md:rounded-2xl overflow-hidden transition-shadow hover:shadow-lg"
      aria-busy={!loaded}
    >
      <div ref={imgRef} className="relative aspect-square md:aspect-[4/3] overflow-hidden rounded-t-xl md:rounded-t-2xl">
        {!loaded && <div className="absolute inset-0 skeleton" />}
        <SafeImage
          src={item.image}
          alt={item.name}
          fill
          className="object-cover transition-transform hover:scale-105"
          sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 20vw"
          unoptimized
          onLoadingComplete={() => setLoaded(true)}
          onImageError={() => setLoaded(true)}
          fallbackClassName="bg-muted"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
        <div className="absolute bottom-2 left-2 md:bottom-3 md:left-3 flex items-center gap-2">
          <div className="glass rounded-lg md:rounded-xl px-1.5 md:px-2.5 py-0.5 md:py-1 text-[8px] md:text-[10px] inline-flex items-center gap-1 text-white font-bold drop-shadow-sm border border-white/10">
            <IconStar className="h-2 w-2 md:h-2.5 md:w-2.5 text-yellow-400" />
            <span>{item.rating}</span>
          </div>
        </div>
        <div className="absolute top-2 right-2 md:top-3 md:right-3 scale-75 md:scale-100 origin-top-right">
           <div className="bg-white/95 backdrop-blur-sm rounded-xl md:rounded-2xl px-3 md:px-4 py-1.5 md:py-2.5 flex items-center gap-2 md:gap-2.5 shadow-xl border border-white/20">
               <IconPeso className="w-[1.5em] md:w-[2em] h-[1.5em] md:h-[2em] text-primary" />
               <span className="text-xl md:text-2xl font-black text-primary tracking-tighter leading-none flex items-center">
                 {item.price.toFixed(2)}
               </span>
             </div>
         </div>
      </div>
      <div className="relative p-2.5 md:p-4">
        {!loaded && (
          <div className="absolute inset-0 z-10 pointer-events-none p-2.5 md:p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-2">
                <div className="h-3 md:h-4 w-20 md:w-32 rounded skeleton" />
                <div className="h-2 md:h-3 w-24 md:w-40 rounded skeleton" />
              </div>
            </div>
            <div className="mt-2 md:mt-3 h-8 md:h-9 w-full rounded-lg md:rounded-xl skeleton" />
          </div>
        )}
        <div className={loaded ? "opacity-100" : "opacity-0"}>
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <Link href={`/menu/${item.slug}`} className="font-bold text-sm md:text-lg hover:text-primary transition-colors leading-tight line-clamp-1">{item.name}</Link>
              <p className="mt-0.5 md:mt-1 text-[10px] md:text-sm opacity-60 line-clamp-2 min-h-[1.5rem] md:min-h-[2.5rem] leading-snug">{item.description}</p>
            </div>
          </div>

          <motion.button
            whileTap={{ scale: 0.98 }}
            whileHover={{ scale: 1.01 }}
            onClick={() => {
              add(item);
              flyToCart(imgRef.current, item.image);
            }}
            aria-label={`Add ${item.name} to cart`}
            className="mt-2 md:mt-3 w-full px-3 md:px-5 py-2 md:py-3 rounded-xl md:rounded-2xl bg-primary text-primary-foreground shadow-md hover:shadow-lg text-xs md:text-base font-bold"
          >
            Add to Cart
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
