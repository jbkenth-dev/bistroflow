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
      className="glass rounded-2xl overflow-hidden transition-shadow hover:shadow-lg"
      aria-busy={!loaded}
    >
      <div ref={imgRef} className="relative aspect-[4/3] overflow-hidden rounded-t-2xl">
        {!loaded && <div className="absolute inset-0 skeleton" />}
        <SafeImage
          src={item.image}
          alt={item.name}
          fill
          className="object-cover transition-transform hover:scale-105"
          sizes="(max-width: 768px) 33vw, (max-width: 1200px) 50vw, 20vw"
          unoptimized
          onLoadingComplete={() => setLoaded(true)}
          onImageError={() => setLoaded(true)}
          fallbackClassName="bg-muted"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent pointer-events-none" />
        <div className="absolute top-3 left-3 glass rounded-xl px-3 py-1 text-xs text-white font-semibold drop-shadow">
          {item.category}
        </div>
        <div className="absolute bottom-3 left-3 glass rounded-xl px-3 py-1 text-xs inline-flex items-center gap-1 text-white font-semibold drop-shadow">
          <IconStar className="h-3 w-3 text-yellow-300" />
          <span>{item.rating}</span>
        </div>
        <div className="absolute top-3 right-3 bg-black/60 text-white rounded-xl px-3 py-1 text-xs inline-flex items-center gap-1 font-semibold drop-shadow">
          <IconPeso className="h-[1em] w-[1em] align-middle" />
          {item.price.toFixed(2)}
        </div>
      </div>
      <div className="relative p-4">
        {!loaded && (
          <div className="absolute inset-0 z-10 pointer-events-none">
            <div className="flex items-start justify-between gap-3">
              <div className="space-y-2">
                <div className="h-4 w-32 rounded skeleton" />
                <div className="h-3 w-40 rounded skeleton" />
                <div className="mt-2 flex gap-2">
                  <div className="h-5 w-14 rounded skeleton" />
                  <div className="h-5 w-12 rounded skeleton" />
                  <div className="h-5 w-12 rounded skeleton" />
                </div>
              </div>
              <div className="h-5 w-12 rounded skeleton" />
            </div>
            <div className="mt-3 h-9 w-full rounded-xl skeleton" />
          </div>
        )}
        <div className={loaded ? "opacity-100" : "opacity-0"}>
          <div className="flex items-start justify-between gap-3">
            <div>
              <Link href={`/menu/${item.slug}`} className="font-semibold hover:text-primary">{item.name}</Link>
            </div>
          </div>
          <p className="mt-1 text-sm opacity-75 truncate">{item.description}</p>
          <div className="mt-2 text-xs opacity-70">
            <span>{item.calories} kcal</span>
            <span className="mx-2">•</span>
            <span>{item.prepTime} min</span>
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {item.tags.slice(0, 3).map((t) => (
              <span key={t} className="glass rounded px-2 py-1 text-xs">{t}</span>
            ))}
          </div>
          <motion.button
            whileTap={{ scale: 0.98 }}
            whileHover={{ scale: 1.01 }}
            onClick={() => {
              add(item);
              flyToCart(imgRef.current, item.image);
            }}
            aria-label={`Add ${item.name} to cart`}
            className="mt-3 w-full px-5 py-3 rounded-2xl bg-primary text-primary-foreground shadow-md hover:shadow-lg text-base"
          >
            Add to Cart
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}
