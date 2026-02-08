"use client";

import { NavBar } from "@/components/nav-bar";
import { Footer } from "@/components/footer";
import { motion, LayoutGroup, AnimatePresence } from "framer-motion";
import { IconCart, IconArrowRight, IconPeso, IconDineIn, IconTakeout, IconGCash, IconCash, IconPlus, IconMinus, IconClose } from "@/components/ui/icons";
import Link from "next/link";
import { SafeImage } from "@/components/ui/safe-image";
import { useCart } from "@/store/cart";
import { useState } from "react";

export function CheckoutContent() {
  const { items, total, inc, dec, remove } = useCart();
  const [orderType, setOrderType] = useState<"dine-in" | "takeout">("takeout");
  const t = total();
  const grand = t;
  const [payment, setPayment] = useState<"gcash" | "cash">("cash");
  return (
    <div>
      <NavBar />
      <main className="pt-24 container-edge">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between"
        >
          <h1 className="font-display text-3xl font-bold inline-flex items-center gap-2">
            <IconCart className="h-6 w-6" />
            Checkout
          </h1>
          <Link href="/menu" className="text-primary text-sm">Back to Menu</Link>
        </motion.div>
        <div className="mt-6 grid md:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="md:col-span-2 space-y-6"
          >
            <div className="glass rounded-2xl p-6">
              <h2 className="font-semibold">Order Type</h2>
              <LayoutGroup>
                <div className="mt-4 grid grid-cols-2 gap-3" role="radiogroup" aria-label="Order Type">
                  <motion.button
                    role="radio"
                    aria-checked={orderType === "dine-in"}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setOrderType("dine-in")}
                    className={`relative rounded-2xl px-4 py-4 border transition-[box-shadow,transform] ${orderType === "dine-in" ? "border-transparent shadow-md" : "glass border-white/10"}`}
                  >
                    {orderType === "dine-in" && (
                      <motion.span
                        layoutId="orderTypeActiveBg"
                        className="absolute inset-0 rounded-2xl bg-accent"
                        transition={{ type: "spring", stiffness: 500, damping: 40 }}
                        style={{ zIndex: 0 }}
                      />
                    )}
                    <span className="relative z-10 inline-flex items-center gap-2">
                      <IconDineIn className="h-5 w-5" />
                      <span>Dine-In</span>
                    </span>
                    {orderType === "dine-in" && (
                      <motion.span
                        layoutId="orderTypeActiveUnderline"
                        className="absolute left-4 right-4 bottom-3 h-0.5 rounded-full bg-gradient-to-r from-primary to-orange-500"
                        transition={{ type: "spring", stiffness: 600, damping: 35 }}
                      />
                    )}
                  </motion.button>
                  <motion.button
                    role="radio"
                    aria-checked={orderType === "takeout"}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setOrderType("takeout")}
                    className={`relative rounded-2xl px-4 py-4 border transition-[box-shadow,transform] ${orderType === "takeout" ? "border-transparent shadow-md" : "glass border-white/10"}`}
                  >
                    {orderType === "takeout" && (
                      <motion.span
                        layoutId="orderTypeActiveBg"
                        className="absolute inset-0 rounded-2xl bg-accent"
                        transition={{ type: "spring", stiffness: 500, damping: 40 }}
                        style={{ zIndex: 0 }}
                      />
                    )}
                    <span className="relative z-10 inline-flex items-center gap-2">
                      <IconTakeout className="h-5 w-5" />
                      <span>Takeout</span>
                    </span>
                    {orderType === "takeout" && (
                      <motion.span
                        layoutId="orderTypeActiveUnderline"
                        className="absolute left-4 right-4 bottom-3 h-0.5 rounded-full bg-gradient-to-r from-primary to-orange-500"
                        transition={{ type: "spring", stiffness: 600, damping: 35 }}
                      />
                    )}
                  </motion.button>
                </div>
              </LayoutGroup>
            </div>
            <div className="glass rounded-2xl p-6">
              <h2 className="font-semibold">Payment Method</h2>
              <LayoutGroup>
                <div className="mt-4 grid grid-cols-2 gap-3" role="radiogroup" aria-label="Payment Method">
                  <motion.button
                    role="radio"
                    aria-checked={payment === "gcash"}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setPayment("gcash")}
                    className={`relative rounded-2xl px-4 py-4 border transition-[box-shadow,transform] ${payment === "gcash" ? "border-transparent shadow-md" : "glass border-white/10"}`}
                  >
                    {payment === "gcash" && (
                      <motion.span
                        layoutId="paymentActiveBg"
                        className="absolute inset-0 rounded-2xl bg-accent"
                        transition={{ type: "spring", stiffness: 500, damping: 40 }}
                        style={{ zIndex: 0 }}
                      />
                    )}
                    <span className="relative z-10 inline-flex items-center gap-2">
                      <IconGCash className="h-5 w-5" />
                      <span>GCash</span>
                    </span>
                    {payment === "gcash" && (
                      <motion.span
                        layoutId="paymentActiveUnderline"
                        className="absolute left-4 right-4 bottom-3 h-0.5 rounded-full bg-gradient-to-r from-primary to-orange-500"
                        transition={{ type: "spring", stiffness: 600, damping: 35 }}
                      />
                    )}
                  </motion.button>
                  <motion.button
                    role="radio"
                    aria-checked={payment === "cash"}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setPayment("cash")}
                    className={`relative rounded-2xl px-4 py-4 border transition-[box-shadow,transform] ${payment === "cash" ? "border-transparent shadow-md" : "glass border-white/10"}`}
                  >
                    {payment === "cash" && (
                      <motion.span
                        layoutId="paymentActiveBg"
                        className="absolute inset-0 rounded-2xl bg-accent"
                        transition={{ type: "spring", stiffness: 500, damping: 40 }}
                        style={{ zIndex: 0 }}
                      />
                    )}
                    <span className="relative z-10 inline-flex items-center gap-2">
                      <IconCash className="h-5 w-5" />
                      <span>Cash</span>
                    </span>
                    {payment === "cash" && (
                      <motion.span
                        layoutId="paymentActiveUnderline"
                        className="absolute left-4 right-4 bottom-3 h-0.5 rounded-full bg-gradient-to-r from-primary to-orange-500"
                        transition={{ type: "spring", stiffness: 600, damping: 35 }}
                      />
                    )}
                  </motion.button>
                </div>
              </LayoutGroup>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-6"
          >
            <div className="glass rounded-2xl p-6 sticky top-24">
              <div className="flex items-center justify-between">
                <h2 className="font-semibold inline-flex items-center gap-2"><IconCart className="h-4 w-4" />Order Summary</h2>
              </div>
              <div className="mt-4 space-y-3">
                {items.length === 0 ? (
                  <p className="text-sm opacity-70">Your cart is empty</p>
                ) : (
                  <AnimatePresence initial={false}>
                    {items.map((i) => (
                      <motion.div
                        key={i.item.slug}
                        layout
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        className="flex items-center justify-between gap-3"
                      >
                        <div className="min-w-0 flex items-center gap-3">
                          <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-muted">
                            <SafeImage
                              src={i.item.image}
                              alt={i.item.name}
                              fill
                              className="object-cover"
                              unoptimized
                              fallbackClassName="bg-muted"
                            />
                          </div>
                          <p className="truncate text-sm">{i.qty}× {i.item.name}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            className="px-2 py-1 rounded glass"
                            aria-label="Decrease quantity"
                            onClick={() => dec(i.item.slug)}
                          >
                            <IconMinus className="h-4 w-4" />
                          </motion.button>
                          <span className="text-sm w-6 text-center">{i.qty}</span>
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            className="px-2 py-1 rounded glass"
                            aria-label="Increase quantity"
                            onClick={() => inc(i.item.slug)}
                          >
                            <IconPlus className="h-4 w-4" />
                          </motion.button>
                          <span className="text-sm inline-flex items-center gap-1 font-medium ml-2">
                            <IconPeso className="h-[1em] w-[1em] align-middle" />
                            {(i.item.price * i.qty).toFixed(2)}
                          </span>
                          <motion.button
                            whileTap={{ scale: 0.95 }}
                            className="px-2 py-1 rounded glass ml-2"
                            aria-label="Remove item"
                            onClick={() => remove(i.item.slug)}
                          >
                            <IconClose className="h-4 w-4" />
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </div>
              <div className="mt-4 border-t border-white/10 pt-4 space-y-2 text-sm">
                <div className="flex items-center justify-between">
                  <span>Items</span>
                  <span className="glass rounded px-2 py-0.5 text-xs">{items.length}</span>
                </div>
                <div className="flex items-center justify-between font-semibold">
                  <span>Total</span>
                  <span className="inline-flex items-center gap-1"><IconPeso className="h-[1em] w-[1em] align-middle" />{grand.toFixed(2)}</span>
                </div>
              </div>
              {payment === "gcash" && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-3 glass rounded-xl px-3 py-2 text-xs inline-flex items-center gap-2"
                >
                  <IconGCash className="h-4 w-4" />
                  <span>Payments via GCash are final and non-refundable after completion.</span>
                </motion.div>
              )}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="mt-4 w-full rounded-xl bg-primary text-primary-foreground px-4 py-3 inline-flex items-center justify-center gap-2"
              >
                <span>Place Order</span>
                <IconArrowRight className="h-4 w-4" />
              </motion.button>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
