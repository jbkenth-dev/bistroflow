"use client";

import { NavBar } from "@/components/nav-bar";
import { Footer } from "@/components/footer";
import { motion, LayoutGroup, AnimatePresence } from "framer-motion";
import { IconCart, IconArrowRight, IconPeso, IconDineIn, IconTakeout, IconGCash, IconCash, IconPlus, IconMinus, IconClose, IconGrid, IconInfo, IconStar, IconUsers, IconCheck, IconList } from "@/components/ui/icons";
import { btnPrimary } from "@/components/ui/button-classes";
import Link from "next/link";
import { SafeImage } from "@/components/ui/safe-image";
import { useCart } from "@/store/cart";
import { useAuth } from "@/store/auth";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useNotification } from "@/components/ui/notification-provider";

import { CheckoutStepper } from "@/components/ui/checkout-stepper";
import { QRPaymentModal } from "@/components/qr-payment-modal";

interface Table {
  id: number;
  table_number: string;
  image_path: string;
  availability: boolean;
  capacity: number;
}

const STEPS = [
  { id: 1, label: "Summary" },
  { id: 2, label: "Order Type" },
  { id: 3, label: "Payment" },
];

export function CheckoutContent() {
  const { items, total, inc, dec, remove, clear } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  const { showNotification } = useNotification();
  const [currentStep, setCurrentStep] = useState(1);
  const [orderType, setOrderType] = useState<"dine-in" | "takeout">("takeout");
  const [tables, setTables] = useState<Table[]>([]);
  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  const [tablesLoading, setTablesLoading] = useState(false);
  const [guestCount, setGuestCount] = useState(1);
  const [payment, setPayment] = useState<"gcash" | "cash">("cash");
  const [direction, setDirection] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [qrUrl, setQrUrl] = useState("");
  const [paymentIntentId, setPaymentIntentId] = useState("");

  useEffect(() => {
    if (orderType === "dine-in") {
      setTablesLoading(true);
      fetch("http://localhost/bistroflow/bistroflow/php-backend/public/api/floor_layouts.php")
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setTables(data.data);
          }
        })
        .catch(err => console.error(err))
        .finally(() => setTablesLoading(false));
    }
  }, [orderType]);

  const t = total();
  const grand = t;

  const nextStep = () => {
    if (currentStep === 1 && items.length === 0) return;
    if (currentStep === 2 && orderType === "dine-in" && !selectedTable) return;

    setDirection(1);
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };

  const prevStep = () => {
    setDirection(-1);
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handlePlaceOrder = async () => {
    setIsSubmitting(true);

    try {
      let tableNumToSend = null;
      if (orderType === "dine-in" && selectedTable) {
        const selectedTableObj = tables.find(t => t.id === selectedTable);
        tableNumToSend = selectedTableObj ? selectedTableObj.table_number : null;
      }

      const orderData = {
        userId: user?.id,
        items: items,
        orderType: orderType,
        tableNumber: tableNumToSend,
        paymentMethod: payment,
        totalAmount: grand,
      };

      const response = await fetch("http://localhost/bistroflow/bistroflow/php-backend/public/api/place-order.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      const result = await response.json();

      if (result.success) {
        if (result.qrCodeUrl) {
          setQrUrl(result.qrCodeUrl);
          setPaymentIntentId(result.paymentIntentId);
          setShowQrModal(true);
          return;
        }

        if (result.checkoutUrl) {
          showNotification(
            "success",
            "Redirecting to Payment...",
            "Please complete your payment via GCash.",
            3000
          );
          // Redirect to PayMongo Checkout
          window.location.href = result.checkoutUrl;
          return;
        }

        showNotification(
          "success",
          "Order Placed Successfully!",
          "Your delicious meal is being prepared. You will be redirected to the dashboard shortly.",
          3000
        );
        // Clear cart and redirect after a delay
        clear();
        setTimeout(() => {
          router.push("/dashboard?orderSuccess=true");
        }, 2000);
      } else {
        showNotification(
          "error",
          "Order Failed",
          result.message || "Failed to place order. Please try again."
        );
      }
    } catch (err) {
      console.error("Order error:", err);
      showNotification(
        "error",
        "Connection Error",
        "An error occurred while connecting to the server. Please check your internet connection."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 20 : -20,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 20 : -20,
      opacity: 0,
    }),
  };

  return (
    <div className="min-h-screen bg-black/5 dark:bg-black/20">
      <NavBar />
      <main className="pt-24 md:pt-28 pb-24 lg:pb-20 container-edge">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center justify-between mb-8 px-1"
        >
          <h1 className="font-display text-2xl md:text-3xl font-bold inline-flex items-center gap-2">
            <IconCart className="h-6 w-6" />
            Checkout
          </h1>
          <Link href="/menu" className="text-primary text-sm font-semibold hover:underline flex items-center gap-1">
            <IconArrowRight className="h-3 w-3 rotate-180" />
            Back to Menu
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Content (Steps) */}
          <div className="lg:col-span-8 space-y-6">

            {/* Progress Stepper */}
            <CheckoutStepper
              currentStep={currentStep}
              steps={STEPS}
              className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm mb-6"
              onStepClick={(stepId) => {
                if (stepId < currentStep) {
                  setDirection(-1);
                  setCurrentStep(stepId);
                }
              }}
            />

            {/* Step Content */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden min-h-[400px] relative">
              <AnimatePresence mode="wait" custom={direction}>
                {currentStep === 1 && (
                  <motion.div
                    key="step1"
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="p-6 md:p-8"
                  >
                    <h2 className="font-bold text-xl mb-6 flex items-center gap-2">
                      <IconList className="w-5 h-5 text-primary" />
                      Order Summary
                    </h2>

                    <div className="space-y-4">
                      {items.length === 0 ? (
                        <div className="text-center py-12 flex flex-col items-center">
                          <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-300">
                            <IconCart className="w-8 h-8" />
                          </div>
                          <p className="text-gray-500 font-medium">Your cart is empty</p>
                          <Link href="/menu" className={`mt-4 inline-flex ${btnPrimary} text-sm`}>
                            Browse Menu
                          </Link>
                        </div>
                      ) : (
                        items.map((i) => (
                          <div key={i.item.slug} className="flex items-center gap-4 p-4 rounded-2xl border border-gray-100 hover:border-primary/10 hover:bg-primary/5 transition-colors group">
                            <div className="relative h-16 w-16 md:h-20 md:w-20 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
                              <SafeImage src={i.item.image} alt={i.item.name} fill className="object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start mb-1">
                                <h3 className="font-bold text-gray-900 truncate">{i.item.name}</h3>
                                <span className="font-black text-primary whitespace-nowrap">
                                  <IconPeso className="h-3 w-3 inline mr-0.5" />
                                  {(i.item.price * i.qty).toFixed(2)}
                                </span>
                              </div>
                              <p className="text-xs text-gray-500 mb-3 line-clamp-1">{i.item.description}</p>

                              <div className="flex items-center justify-between">
                                <div className="flex items-center bg-gray-50 rounded-lg border border-gray-200">
                                  <button onClick={() => dec(i.item.slug)} className="p-1.5 hover:text-primary transition-colors"><IconMinus className="w-3 h-3" /></button>
                                  <span className="w-8 text-center text-xs font-bold">{i.qty}</span>
                                  <button onClick={() => inc(i.item.slug)} className="p-1.5 hover:text-primary transition-colors"><IconPlus className="w-3 h-3" /></button>
                                </div>
                                <button onClick={() => remove(i.item.slug)} className="text-xs text-red-500 hover:text-red-600 font-medium hover:underline">
                                  Remove
                                </button>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </motion.div>
                )}

                {currentStep === 2 && (
                  <motion.div
                    key="step2"
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="p-6 md:p-8"
                  >
                    <h2 className="font-bold text-xl mb-6 flex items-center gap-2">
                      <IconInfo className="w-5 h-5 text-primary" />
                      Order Type
                    </h2>

                    <div className="space-y-4 mb-8">
                      <button
                        onClick={() => setOrderType("dine-in")}
                        className={`w-full p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-4 text-center group relative ${orderType === "dine-in" ? "border-primary bg-white shadow-lg shadow-primary/10" : "border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50"}`}
                      >
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${orderType === "dine-in" ? "bg-primary/10 text-primary" : "bg-gray-100 text-gray-400 group-hover:bg-white group-hover:shadow-sm"}`}>
                          <IconDineIn className="w-6 h-6" />
                        </div>
                        <div>
                          <span className={`block font-bold text-lg mb-1 ${orderType === "dine-in" ? "text-gray-900" : "text-gray-900"}`}>Dine-In</span>
                          <span className="text-sm text-gray-500">Enjoy your meal at our restaurant</span>
                        </div>
                        {orderType === "dine-in" && (
                          <div className="absolute top-4 right-4 text-primary">
                            <IconCheck className="w-6 h-6" />
                          </div>
                        )}
                      </button>

                      <button
                        onClick={() => { setOrderType("takeout"); setSelectedTable(null); }}
                        className={`w-full p-6 rounded-2xl border-2 transition-all flex flex-col items-center gap-4 text-center group relative ${orderType === "takeout" ? "border-primary bg-white shadow-lg shadow-primary/10" : "border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50"}`}
                      >
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${orderType === "takeout" ? "bg-primary text-white shadow-lg shadow-primary/30" : "bg-gray-100 text-gray-400 group-hover:bg-white group-hover:shadow-sm"}`}>
                          <IconTakeout className="w-6 h-6" />
                        </div>
                        <div>
                          <span className={`block font-bold text-lg mb-1 ${orderType === "takeout" ? "text-primary" : "text-gray-900"}`}>Takeout</span>
                          <span className="text-sm text-gray-500">Pick up your order to go</span>
                        </div>
                        {orderType === "takeout" && (
                          <div className="absolute top-4 right-4 text-primary">
                            <IconCheck className="w-6 h-6" />
                          </div>
                        )}
                      </button>
                    </div>

                    <AnimatePresence>
                      {orderType === "dine-in" && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="font-bold text-gray-900 flex items-center gap-2">
                              <IconGrid className="w-4 h-4 text-primary" />
                              Select Table
                            </h3>
                            <div className="flex flex-col sm:flex-row items-end sm:items-center gap-3">
                              <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-lg p-1">
                                <span className="text-xs font-bold pl-2 pr-1 text-gray-500">Guests:</span>
                                <button onClick={() => setGuestCount(Math.max(1, guestCount - 1))} className="p-1.5 hover:bg-white hover:shadow-sm rounded-md transition-all text-gray-600"><IconMinus className="w-3 h-3"/></button>
                                <span className="w-6 text-center text-sm font-bold">{guestCount}</span>
                                <button onClick={() => setGuestCount(Math.min(20, guestCount + 1))} className="p-1.5 hover:bg-white hover:shadow-sm rounded-md transition-all text-gray-600"><IconPlus className="w-3 h-3"/></button>
                              </div>
                              <span className="text-xs text-gray-500 flex items-center gap-1 bg-green-50 px-2 py-1 rounded-full border border-green-100">
                                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                                Live Updates
                              </span>
                            </div>
                          </div>

                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {tablesLoading ? (
                              [1, 2, 3, 4, 5, 6].map((i) => (
                                <div key={i} className="h-32 rounded-2xl bg-gray-100 animate-pulse" />
                              ))
                            ) : (
                              tables.map((table) => {
                                const isCapacityValid = table.capacity >= guestCount;
                                const isDisabled = !table.availability || !isCapacityValid;

                                return (
                                <button
                                  key={table.id}
                                  disabled={isDisabled}
                                  onClick={() => setSelectedTable(table.id)}
                                  className={`relative h-32 rounded-2xl overflow-hidden border-2 transition-all text-left group ${
                                    selectedTable === table.id
                                      ? "border-primary ring-2 ring-primary/20"
                                      : isDisabled
                                        ? "border-gray-100 opacity-60 grayscale cursor-not-allowed"
                                        : "border-gray-100 hover:border-primary/50"
                                  }`}
                                >
                                  <SafeImage
                                    src={table.image_path}
                                    alt={table.table_number}
                                    fill
                                    className={`object-cover transition-transform duration-500 ${!isDisabled ? "group-hover:scale-110" : ""}`}
                                  />
                                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                                  <div className="absolute inset-0 p-3 flex flex-col justify-between">
                                    <div className="self-start flex justify-between w-full">
                                      <span className={`px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider shadow-sm ${
                                        table.availability ? "bg-green-500 text-white" : "bg-red-500 text-white"
                                      }`}>
                                        {table.availability ? "Open" : "Busy"}
                                      </span>
                                      {!isCapacityValid && table.availability && (
                                         <span className="px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider bg-orange-500 text-white shadow-sm">
                                           Small
                                         </span>
                                      )}
                                    </div>
                                    <div className="flex items-end justify-between">
                                      <div>
                                        <span className="block text-white font-bold text-sm">Table {table.table_number}</span>
                                      </div>
                                      <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded-lg backdrop-blur-sm ${
                                        isCapacityValid ? "text-white/90 bg-black/30" : "text-orange-200 bg-orange-900/50"
                                      }`}>
                                        <IconUsers className="w-3 h-3" />
                                        <span className="text-[10px] font-bold">{table.capacity}</span>
                                      </div>
                                    </div>
                                  </div>

                                  {selectedTable === table.id && (
                                    <div className="absolute inset-0 bg-primary/20 flex items-center justify-center backdrop-blur-[1px]">
                                      <div className="bg-white text-primary p-2 rounded-full shadow-lg">
                                        <IconCheck className="w-5 h-5" />
                                      </div>
                                    </div>
                                  )}
                                </button>
                              )})
                            )}
                          </div>
                          {!selectedTable && (
                            <p className="text-red-500 text-xs mt-3 font-medium flex items-center gap-1 animate-pulse">
                              <IconInfo className="w-3 h-3" /> Please select a table to proceed
                            </p>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}

                {currentStep === 3 && (
                  <motion.div
                    key="step3"
                    custom={direction}
                    variants={variants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    className="p-6 md:p-8"
                  >
                    <h2 className="font-bold text-xl mb-6 flex items-center gap-2">
                      <IconStar className="w-5 h-5 text-primary" />
                      Payment Method
                    </h2>

                    <div className="space-y-4">
                      <button
                        onClick={() => setPayment("gcash")}
                        className={`w-full p-4 rounded-2xl border-2 transition-all flex items-center gap-4 ${payment === "gcash" ? "border-primary bg-primary/5" : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"}`}
                      >
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${payment === "gcash" ? "bg-primary text-white" : "bg-blue-100 text-blue-600"}`}>
                          <IconGCash className="w-6 h-6" />
                        </div>
                        <div className="flex-1 text-left">
                          <span className="block font-bold text-gray-900">GCash</span>
                          <span className="text-xs text-gray-500">Fast & secure mobile wallet payment</span>
                        </div>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${payment === "gcash" ? "border-primary bg-primary text-white" : "border-gray-300"}`}>
                          {payment === "gcash" && <IconCheck className="w-3 h-3" />}
                        </div>
                      </button>

                      <button
                        onClick={() => setPayment("cash")}
                        className={`w-full p-4 rounded-2xl border-2 transition-all flex items-center gap-4 ${payment === "cash" ? "border-primary bg-primary/5" : "border-gray-100 hover:border-gray-200 hover:bg-gray-50"}`}
                      >
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${payment === "cash" ? "bg-primary text-white" : "bg-green-100 text-green-600"}`}>
                          <IconCash className="w-6 h-6" />
                        </div>
                        <div className="flex-1 text-left">
                          <span className="block font-bold text-gray-900">Cash</span>
                          <span className="text-xs text-gray-500">Pay at the counter</span>
                        </div>
                        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${payment === "cash" ? "border-primary bg-primary text-white" : "border-gray-300"}`}>
                          {payment === "cash" && <IconCheck className="w-3 h-3" />}
                        </div>
                      </button>
                    </div>

                    <div className="mt-8 bg-gray-50 rounded-2xl p-6 border border-gray-100">
                      <h3 className="font-bold text-gray-900 mb-4">Order Summary</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between text-gray-600">
                          <span>Subtotal ({items.length} items)</span>
                          <span>₱{t.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between text-gray-600">
                          <span>Service Charge</span>
                          <span>₱0.00</span>
                        </div>
                        <div className="flex justify-between text-gray-900 font-black text-lg pt-4 border-t border-gray-200 mt-4">
                          <span>Total</span>
                          <span className="text-primary">₱{grand.toFixed(2)}</span>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-4">
              <button
                onClick={prevStep}
                disabled={currentStep === 1}
                className={`px-6 py-3 rounded-xl font-bold text-sm transition-all flex items-center gap-2 ${
                  currentStep === 1
                    ? "opacity-0 pointer-events-none"
                    : "bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 shadow-sm"
                }`}
              >
                <IconArrowRight className="w-4 h-4 rotate-180" />
                Previous
              </button>

              {currentStep < 3 ? (
                <button
                  onClick={nextStep}
                  disabled={
                    (currentStep === 1 && items.length === 0) ||
                    (currentStep === 2 && orderType === "dine-in" && !selectedTable)
                  }
                  className="px-8 py-3 rounded-xl bg-primary text-white font-bold text-sm shadow-lg shadow-primary/30 hover:shadow-primary/40 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-2 disabled:opacity-50 disabled:pointer-events-none disabled:transform-none"
                >
                  Next Step
                  <IconArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handlePlaceOrder}
                  disabled={isSubmitting}
                  className="px-8 py-3 rounded-xl bg-primary text-white font-bold text-sm shadow-lg shadow-primary/30 hover:shadow-primary/40 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      Place Order
                      <IconCheck className="w-4 h-4" />
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Sidebar Summary (Desktop) */}
          <div className="hidden lg:block lg:col-span-4">
            <div className="sticky top-28 space-y-6">
              <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <IconCart className="w-5 h-5 text-primary" />
                  Cart Overview
                </h3>

                <div className="space-y-3 mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                  {items.map((i) => (
                    <div key={i.item.slug} className="flex justify-between items-start text-sm">
                      <div className="flex gap-2">
                        <span className="font-bold text-gray-400">{i.qty}x</span>
                        <span className="text-gray-700 font-medium line-clamp-1 max-w-[120px]">{i.item.name}</span>
                      </div>
                      <span className="font-bold text-gray-900">₱{(i.item.price * i.qty).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-4 border-t border-gray-100 space-y-2">
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Subtotal</span>
                    <span>₱{t.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-lg font-black text-primary pt-2">
                    <span>Total</span>
                    <span>₱{grand.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
                <div className="flex gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center shrink-0 text-blue-600">
                    <IconInfo className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-blue-900 text-sm">Need Help?</h4>
                    <p className="text-xs text-blue-700 mt-1">
                      If you have any questions about your order, please ask our staff for assistance.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <div className="hidden md:block">
        <Footer />
      </div>

      <QRPaymentModal
        isOpen={showQrModal}
        qrDataUrl={qrUrl}
        paymentIntentId={paymentIntentId}
        onClose={() => setShowQrModal(false)}
        onSuccess={() => {
           clear();
           router.push("/dashboard?orderSuccess=true");
        }}
      />
    </div>
  );
}
