 "use client";
import { motion } from "framer-motion";
import type { FoodItem } from "@/data/foods";
import { useCart } from "@/store/cart";
import { SafeImage } from "@/components/ui/safe-image";
import { IconStar, IconPeso } from "@/components/ui/icons";
import { useState, useRef } from "react";
import { flyToCart } from "@/components/ui/fly-to-cart";

export function ProductDetailClient({ item }: { item: FoodItem }) {
  const { add } = useCart();
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef<HTMLDivElement | null>(null);
  return (
    <div aria-busy={!loaded}>
      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <h1 className="font-display text-3xl font-bold">{item.name}</h1>
        <p className="mt-2 opacity-80">{item.description}</p>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
        className="mt-4 glass rounded-2xl p-4 border border-white/10"
      >
        <div className="grid grid-cols-3 gap-3 text-sm">
          <div className="inline-flex items-center gap-2">
            <IconStar className="h-4 w-4" />
            <span className="font-medium">{item.rating}</span>
            <span className="opacity-60">Rating</span>
          </div>
          <div>
            <span className="font-medium">{item.calories}</span>
            <span className="opacity-60 ml-1">kcal</span>
          </div>
          <div>
            <span className="font-medium">{item.prepTime}</span>
            <span className="opacity-60 ml-1">min</span>
          </div>
        </div>
      </motion.div>
      <div className="mt-4 flex gap-2 flex-wrap">
        {item.tags.map((t) => (
          <motion.span key={t} whileHover={{ scale: 1.05 }} className="glass rounded px-3 py-1 text-xs">
            {t}
          </motion.span>
        ))}
      </div>
      <div className="mt-6 flex items-center gap-4">
        <span className="text-2xl font-semibold inline-flex items-center gap-1">
          <IconPeso className="h-[1em] w-[1em] align-middle" />
          {item.price.toFixed(2)}
        </span>
        <motion.button
          whileTap={{ scale: 0.98 }}
          whileHover={{ boxShadow: "0 0 0 6px rgba(255, 122, 0, 0.15)" }}
          onClick={() => {
            add(item);
            flyToCart(imgRef.current, item.image);
          }}
          className="px-5 py-3 rounded-xl bg-primary text-primary-foreground"
        >
          Add to Cart
        </motion.button>
      </div>
      <div ref={imgRef} className="mt-6 glass rounded-2xl overflow-hidden relative">
        {!loaded && (
          <div className="absolute inset-0 z-10 pointer-events-none">
            <div className="relative aspect-[4/3]">
              <div className="absolute inset-0 skeleton" />
            </div>
          </div>
        )}
        <div className="relative aspect-[4/3]">
          {!loaded && <div className="absolute inset-0 skeleton" />}
          <SafeImage
            src={item.image}
            alt={item.name}
            fill
            className="object-cover"
            unoptimized
            onLoadingComplete={() => setLoaded(true)}
            onImageError={() => setLoaded(true)}
            fallbackClassName="bg-muted"
          />
        </div>
      </div>
    </div>
  );
}
