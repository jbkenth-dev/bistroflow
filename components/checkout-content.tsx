"use client";

import { NavBar } from "@/components/nav-bar";
import { Footer } from "@/components/footer";
import { motion, LayoutGroup, AnimatePresence } from "framer-motion";
import { IconCart, IconArrowRight, IconPeso, IconDineIn, IconTakeout, IconGCash, IconCash, IconPlus, IconMinus, IconClose, IconGrid, IconInfo, IconStar, IconUsers } from "@/components/ui/icons";
import Link from "next/link";
import { SafeImage } from "@/components/ui/safe-image";
import { useCart } from "@/store/cart";
import { useState, useEffect } from "react";

const TABLES = [
  { id: 1, name: "Table 1", capacity: 2, image: "/assets/table-1.jpg", pos: "Window Side", available: true },
  { id: 2, name: "Table 2", capacity: 4, image: "/assets/table-2.jpg", pos: "Center Hall", available: true },
  { id: 3, name: "Table 3", capacity: 2, image: "/assets/table-3.jpg", pos: "Quiet Corner", available: false },
  { id: 4, name: "Table 4", capacity: 6, image: "/assets/table-4.jpg", pos: "Private Area", available: true },
  { id: 5, name: "Table 5", capacity: 4, image: "/assets/table-5.jpg", pos: "Main Hall", available: true },
  { id: 6, name: "Table 6", capacity: 2, image: "/assets/table-6.jpg", pos: "Window Side", available: false },
];

export function CheckoutContent() {
  const { items, total, inc, dec, remove } = useCart();
  const [orderType, setOrderType] = useState<"dine-in" | "takeout">("takeout");
  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  const [tablesLoading, setTablesLoading] = useState(true);

  useEffect(() => {
    if (orderType === "dine-in") {
      setTablesLoading(true);
      const timer = setTimeout(() => setTablesLoading(false), 1200);
      return () => clearTimeout(timer);
    }
  }, [orderType]);

  const t = total();
  const grand = t;
  const [payment, setPayment] = useState<"gcash" | "cash">("cash");
  return (
    <div className="min-h-screen bg-black/5 dark:bg-black/20">
      <NavBar />
      <main className="pt-20 md:pt-24 pb-24 lg:pb-20 container-edge">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between mb-4 md:mb-6 px-1"
        >
          <h1 className="font-display text-2xl md:text-3xl font-bold inline-flex items-center gap-2">
            <IconCart className="h-5 w-5 md:h-6 md:w-6" />
            Checkout
          </h1>
          <Link href="/menu" className="text-primary text-xs md:text-sm font-semibold hover:underline flex items-center gap-1">
            <IconArrowRight className="h-3 w-3 rotate-180" />
            Back to Menu
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6 pb-20 lg:pb-0">
          <div className="lg:col-span-2 space-y-4 md:space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="glass rounded-2xl md:rounded-3xl p-4 md:p-6"
            >
              <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                <IconInfo className="w-4 h-4 text-primary" />
                Order Type
              </h2>
              <LayoutGroup>
                <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="Order Type">
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setOrderType("dine-in")}
                    className={`relative p-3 md:p-4 rounded-xl md:rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${orderType === "dine-in" ? "border-primary bg-primary/5 shadow-inner" : "border-white/10 bg-white/5 hover:bg-white/10"}`}
                  >
                    <IconDineIn className={`w-5 h-5 md:w-6 md:h-6 ${orderType === "dine-in" ? "text-primary" : "opacity-40"}`} />
                    <span className={`text-xs md:text-sm font-bold ${orderType === "dine-in" ? "text-primary" : "opacity-60"}`}>Dine-In</span>
                    {orderType === "dine-in" && (
                      <motion.div layoutId="order-type-bg" className="absolute inset-0 border-2 border-primary rounded-xl md:rounded-2xl pointer-events-none" />
                    )}
                  </motion.button>
                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => { setOrderType("takeout"); setSelectedTable(null); }}
                    className={`relative p-3 md:p-4 rounded-xl md:rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${orderType === "takeout" ? "border-primary bg-primary/5 shadow-inner" : "border-white/10 bg-white/5 hover:bg-white/10"}`}
                  >
                    <IconTakeout className={`w-5 h-5 md:w-6 md:h-6 ${orderType === "takeout" ? "text-primary" : "opacity-40"}`} />
                    <span className={`text-xs md:text-sm font-bold ${orderType === "takeout" ? "text-primary" : "opacity-60"}`}>Takeout</span>
                    {orderType === "takeout" && (
                      <motion.div layoutId="order-type-bg" className="absolute inset-0 border-2 border-primary rounded-xl md:rounded-2xl pointer-events-none" />
                    )}
                  </motion.button>
                </div>
              </LayoutGroup>

              <AnimatePresence mode="wait">
                {orderType === "dine-in" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="mt-6 md:mt-8 overflow-hidden"
                  >
                    <div className="flex items-center justify-between mb-4 px-1">
                      <h3 className="font-bold text-sm md:text-base inline-flex items-center gap-2">
                        <IconGrid className="w-4 h-4 text-primary" />
                        Select Your Table
                      </h3>
                      <span className="text-[10px] md:text-xs opacity-50 flex items-center gap-1">
                        <IconInfo className="w-3 h-3" />
                        Real-time floor plan
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-3 md:gap-4">
                      {tablesLoading ? (
                        [1, 2, 3, 4, 5, 6].map((i) => (
                          <div key={i} className="h-32 md:h-48 rounded-xl md:rounded-2xl skeleton" />
                        ))
                      ) : (
                        TABLES.map((table) => (
                          <motion.button
                            key={table.id}
                            disabled={!table.available}
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            whileHover={table.available ? { scale: 1.02 } : {}}
                            whileTap={table.available ? { scale: 0.98 } : {}}
                            onClick={() => setSelectedTable(table.id)}
                            className={`group relative h-32 md:h-48 rounded-xl md:rounded-2xl overflow-hidden border-2 transition-all text-left ${
                              selectedTable === table.id
                                ? "border-primary ring-4 ring-primary/20"
                                : !table.available
                                  ? "border-white/5 opacity-60 grayscale cursor-not-allowed"
                                  : "border-white/10"
                            }`}
                          >
                            <SafeImage
                              src={table.image}
                              alt={table.name}
                              fill
                              className={`object-cover transition-transform duration-500 ${table.available ? "group-hover:scale-110" : ""} ${selectedTable === table.id ? "brightness-75" : "brightness-50"}`}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                            <div className="absolute top-2 left-2 md:top-3 md:left-3 z-10 scale-75 md:scale-100 origin-top-left">
                              <span className={`px-1.5 md:px-2 py-0.5 md:py-1 rounded-full text-[8px] md:text-[10px] font-bold border ${
                                table.available
                                  ? "bg-green-500/20 text-green-400 border-green-500/30"
                                  : "bg-red-500/20 text-red-400 border-red-500/30"
                              }`}>
                                {table.available ? "AVAILABLE" : "OCCUPIED"}
                              </span>
                            </div>

                            <div className="absolute inset-0 p-3 md:p-4 flex flex-col justify-end">
                              <div className="flex items-end justify-between">
                                <div>
                                  <h4 className="font-bold text-white text-sm md:text-lg leading-tight">{table.name}</h4>
                                  <p className="text-[10px] md:text-xs text-white/60 font-medium truncate max-w-[80px] md:max-w-none">{table.pos}</p>
                                </div>
                                <div className="bg-white/10 backdrop-blur-md rounded-lg px-1.5 py-0.5 md:px-2 md:py-1 flex items-center gap-1">
                                  <IconUsers className="w-2.5 h-2.5 md:w-3 md:h-3 text-primary" />
                                  <span className="text-[10px] md:text-xs text-white font-bold">{table.capacity}</span>
                                </div>
                              </div>
                            </div>
                            {selectedTable === table.id && (
                              <div className="absolute top-2 right-2 md:top-3 md:right-3 bg-primary text-white p-1 md:p-1.5 rounded-full shadow-lg z-20">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-3 h-3 md:w-4 md:h-4">
                                  <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              </div>
                            )}
                          </motion.button>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="glass rounded-2xl md:rounded-3xl p-4 md:p-6"
            >
              <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                <IconStar className="w-4 h-4 text-primary" />
                Payment Method
              </h2>
              <LayoutGroup>
                <div className="grid grid-cols-2 gap-3" role="radiogroup" aria-label="Payment Method">
                  <motion.button
                    role="radio"
                    aria-checked={payment === "gcash"}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setPayment("gcash")}
                    className={`relative rounded-xl md:rounded-2xl px-4 py-3 md:py-4 border transition-[box-shadow,transform] ${payment === "gcash" ? "border-transparent shadow-md" : "glass border-white/10"}`}
                  >
                    {payment === "gcash" && (
                      <motion.span
                        layoutId="paymentActiveBg"
                        className="absolute inset-0 rounded-xl md:rounded-2xl bg-accent"
                        transition={{ type: "spring", stiffness: 500, damping: 40 }}
                        style={{ zIndex: 0 }}
                      />
                    )}
                    <span className="relative z-10 inline-flex items-center gap-2 text-sm md:text-base font-semibold">
                      <IconGCash className="h-5 w-5" />
                      <span>GCash</span>
                    </span>
                  </motion.button>
                  <motion.button
                    role="radio"
                    aria-checked={payment === "cash"}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setPayment("cash")}
                    className={`relative rounded-xl md:rounded-2xl px-4 py-3 md:py-4 border transition-[box-shadow,transform] ${payment === "cash" ? "border-transparent shadow-md" : "glass border-white/10"}`}
                  >
                    {payment === "cash" && (
                      <motion.span
                        layoutId="paymentActiveBg"
                        className="absolute inset-0 rounded-xl md:rounded-2xl bg-accent"
                        transition={{ type: "spring", stiffness: 500, damping: 40 }}
                        style={{ zIndex: 0 }}
                      />
                    )}
                    <span className="relative z-10 inline-flex items-center gap-2 text-sm md:text-base font-semibold">
                      <IconCash className="h-5 w-5" />
                      <span>Cash</span>
                    </span>
                  </motion.button>
                </div>
              </LayoutGroup>
            </motion.div>
          </div>

          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="glass rounded-2xl md:rounded-3xl p-4 md:p-6 lg:sticky lg:top-24 shadow-2xl border border-white/20"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-bold text-lg inline-flex items-center gap-2"><IconCart className="h-5 w-5 text-primary" />Your Order</h2>
                <span className="bg-primary/10 text-primary text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-wider">{items.length} Items</span>
              </div>

              <div className="max-h-[30vh] lg:max-h-[40vh] overflow-y-auto pr-2 custom-scrollbar">
                {items.length === 0 ? (
                  <div className="py-8 text-center">
                    <p className="text-sm opacity-50">Your cart is empty</p>
                  </div>
                ) : (
                  <AnimatePresence initial={false}>
                    {items.map((i) => (
                      <motion.div
                        key={i.item.slug}
                        layout
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="flex flex-col gap-2 py-3 border-b border-white/5 last:border-0"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="relative h-10 w-10 md:h-12 md:w-12 rounded-lg overflow-hidden flex-shrink-0">
                              <SafeImage src={i.item.image} alt={i.item.name} fill className="object-cover" unoptimized />
                            </div>
                            <div className="min-w-0">
                              <p className="truncate text-xs md:text-sm font-bold">{i.item.name}</p>
                              <p className="text-[10px] opacity-50 font-medium leading-none mt-0.5">Qty: {i.qty}</p>
                            </div>
                          </div>
                          <span className="text-xs md:text-sm font-black whitespace-nowrap">
                            <IconPeso className="h-[1em] w-[1em] inline mr-0.5" />
                            {(i.item.price * i.qty).toFixed(2)}
                          </span>
                        </div>

                        <div className="flex items-center justify-end gap-2">
                          <div className="flex items-center bg-white/5 rounded-lg border border-white/10">
                            <motion.button
                              whileTap={{ scale: 0.9 }}
                              className="p-1 text-primary hover:bg-primary/10 rounded-l-lg transition-colors"
                              onClick={() => dec(i.item.slug)}
                            >
                              <IconMinus className="h-3 w-3" />
                            </motion.button>
                            <span className="text-[10px] md:text-xs font-black w-6 text-center">{i.qty}</span>
                            <motion.button
                              whileTap={{ scale: 0.9 }}
                              className="p-1 text-primary hover:bg-primary/10 rounded-r-lg transition-colors"
                              onClick={() => inc(i.item.slug)}
                            >
                              <IconPlus className="h-3 w-3" />
                            </motion.button>
                          </div>
                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            className="p-1 text-destructive hover:bg-destructive/10 rounded-lg transition-colors"
                            onClick={() => remove(i.item.slug)}
                          >
                            <IconClose className="h-3 w-3" />
                          </motion.button>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                )}
              </div>

              <div className="mt-6 space-y-3 pt-6 border-t border-white/10">
                <div className="flex items-center justify-between text-xs md:text-sm font-medium opacity-70">
                  <span>Subtotal</span>
                  <span><IconPeso className="h-[1em] w-[1em] inline mr-0.5" />{grand.toFixed(2)}</span>
                </div>
                <div className="flex items-center justify-between text-lg font-black text-primary">
                  <span>Total</span>
                  <span><IconPeso className="h-[1em] w-[1em] inline mr-0.5" />{grand.toFixed(2)}</span>
                </div>

                {payment === "gcash" && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-xl text-[10px] md:text-xs text-blue-400 font-medium flex items-start gap-2"
                  >
                    <IconInfo className="h-3 w-3 mt-0.5 flex-shrink-0" />
                    <span>GCash payments are final and non-refundable once confirmed.</span>
                  </motion.div>
                )}

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="w-full rounded-2xl bg-primary text-primary-foreground py-4 text-sm font-black shadow-xl shadow-primary/20 flex items-center justify-center gap-2 group transition-all"
                >
                  Place Order
                  <IconArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      <div className="hidden md:block">
        <Footer />
      </div>
    </div>
  );
}
