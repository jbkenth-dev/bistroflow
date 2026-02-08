"use client";
import { useCart } from "@/store/cart";
import Link from "next/link";
import { IconCart, IconPlus, IconMinus, IconClose, IconArrowRight, IconPeso } from "@/components/ui/icons";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { SafeImage } from "@/components/ui/safe-image";

export function CartFloating() {
  const { items, total, inc, dec, remove } = useCart();
  const t = total();
  const [open, setOpen] = useState(false);
  const [pop, setPop] = useState(false);
  useEffect(() => {
    if (items.length > 0) {
      setPop(true);
      const timer = setTimeout(() => setPop(false), 250);
      return () => clearTimeout(timer);
    }
  }, [items.length]);
  const itemsTotal = t;
  const grand = itemsTotal;
  const distinctCount = items.length;
  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-30 bg-black/25 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
          />
        )}
      </AnimatePresence>
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 40 }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="fixed left-0 right-0 bottom-0 z-50 rounded-t-2xl p-4 bg-white shadow-2xl ring-1 ring-black/10 md:rounded-2xl md:left-auto md:right-6 md:bottom-24 md:w-[360px]"
          >
            <div className="flex items-center justify-between">
              <div className="inline-flex items-center gap-2">
                <IconCart className="h-5 w-5" />
                <h4 className="font-semibold">Your Cart</h4>
              </div>
              <button
                aria-label="Close cart"
                onClick={() => setOpen(false)}
                className="glass rounded-xl p-2 hover:bg-accent/60 transition-colors"
              >
                <IconClose className="h-5 w-5" />
              </button>
            </div>
            <div className="mt-3 flex flex-col gap-3 max-h-[40vh] overflow-auto pr-2">
              {items.length === 0 && <p className="text-sm opacity-70">Your cart is empty</p>}
              <AnimatePresence initial={false}>
                {items.map((i) => (
                  <motion.div
                    key={i.item.slug}
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                    className="flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0 flex items-center gap-3">
                      <div className="relative h-12 w-12 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                        <SafeImage
                          src={i.item.image}
                          alt={i.item.name}
                          fill
                          className="object-cover"
                          unoptimized
                          fallbackClassName="bg-muted"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="truncate text-sm">{i.item.name}</p>
                        <p className="text-xs opacity-70 inline-flex items-center gap-1">
                          <IconPeso className="h-[1em] w-[1em] align-middle" />
                          {i.item.price.toFixed(2)}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        className="px-3 py-2 rounded-xl glass"
                        aria-label="Decrease quantity"
                        onClick={() => dec(i.item.slug)}
                      >
                        <IconMinus className="h-5 w-5" />
                      </motion.button>
                      <span className="text-base w-8 text-center">{i.qty}</span>
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        className="px-3 py-2 rounded-xl glass"
                        aria-label="Increase quantity"
                        onClick={() => inc(i.item.slug)}
                      >
                        <IconPlus className="h-5 w-5" />
                      </motion.button>
                      <motion.button
                        whileTap={{ scale: 0.95 }}
                        className="px-3 py-2 rounded-xl glass"
                        aria-label="Remove item"
                        onClick={() => remove(i.item.slug)}
                      >
                        <IconClose className="h-5 w-5" />
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            <div className="mt-4 space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <span>Items</span>
                <span className="glass rounded px-2 py-0.5 text-xs">{distinctCount}</span>
              </div>
              <div className="flex items-center justify-between font-semibold">
                <span>Total</span>
                <span className="inline-flex items-center gap-1">
                  <IconPeso className="h-[1em] w-[1em] align-middle" />
                  {grand.toFixed(2)}
                </span>
              </div>
            </div>
            <div className="mt-3 flex items-center justify-between gap-2">
              <Link
                href="/checkout"
                className="flex-1 px-4 py-3 rounded-2xl bg-primary text-primary-foreground inline-flex items-center justify-center gap-2 text-base"
              >
                <span>Checkout</span>
                <IconArrowRight className="h-5 w-5" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.button
        id="cart-fab"
        aria-label="Toggle cart"
        onClick={() => setOpen((o) => !o)}
        className="rounded-full h-14 w-14 bg-primary text-primary-foreground shadow-lg inline-flex items-center justify-center relative"
        animate={{ scale: pop ? 1.12 : 1 }}
        transition={{ type: "spring", stiffness: 500, damping: 20 }}
        whileTap={{ scale: 0.96 }}
      >
        <IconCart className="h-6 w-6" />
        {distinctCount > 0 && (
          <motion.span
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="absolute -top-1 -right-1 rounded-full bg-accent text-accent-foreground text-xs px-2 py-0.5 shadow"
          >
            {distinctCount}
          </motion.span>
        )}
      </motion.button>
      {distinctCount > 0 && (
        <motion.div
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 10 }}
          className="rounded-xl px-3 py-2 bg-white text-black shadow-md inline-flex items-center gap-1 z-50"
        >
          <IconPeso className="h-[1em] w-[1em] align-middle" />
          <span className="font-semibold">{grand.toFixed(2)}</span>
        </motion.div>
      )}
    </div>
    </>
  );
}
