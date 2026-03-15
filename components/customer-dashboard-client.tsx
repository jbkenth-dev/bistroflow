"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useEffect, useState, Suspense, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/store/auth";
import { useNotification } from "@/components/ui/notification-provider";
import { IconCart, IconPeso, IconStar, IconGCash, IconCash, IconDineIn, IconTakeout, IconArrowRight, IconClock, IconMapPin, IconList, IconSettings, IconCheck, IconClose } from "@/components/ui/icons";
import { OrderList } from "@/components/order-list";
import { getApiUrl } from "@/lib/config";

function Skeleton({ className, width, height }: { className?: string; width?: string | number; height?: string | number }) {
  return (
    <motion.div
      initial={{ backgroundPosition: "0% 0%" }}
      animate={{ backgroundPosition: "100% 0%" }}
      transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
      className={`bg-gray-200/50 rounded-lg overflow-hidden ${className}`}
      style={{
        width,
        height,
        backgroundImage: "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.5) 50%, rgba(255,255,255,0) 100%)",
        backgroundSize: "200% 100%",
      }}
    />
  );
}

export function CustomerDashboardClient() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div></div>}>
      <DashboardContent />
    </Suspense>
  );
}

interface ActiveOrder {
  id: string;
  status: string;
  items: string;
  itemsList?: { product_name: string; quantity: number; image_url: string | null }[];
  estimatedTime: string;
  progress: number;
  steps: { label: string; icon: any; active: boolean; completed: boolean }[];
  paymentMethod: string;
  totalAmount: string;
  image?: string | null;
}

function DashboardContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, user, updateUser } = useAuth();
  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState("Welcome back");
  const [activeOrder, setActiveOrder] = useState<ActiveOrder | null>(null);
  const [recentOrderTypes, setRecentOrderTypes] = useState<string[]>([]);
  const [isLive, setIsLive] = useState(false);
  const orderSuccessShownRef = useRef(false);
  const eventSourceRef = useRef<EventSource | null>(null);

  // Helper to map order data
  const mapOrderData = (order: any): ActiveOrder => {
    const steps = order.steps.map((step: any) => {
      let icon = IconClock;
      if (step.label === 'Placed') icon = IconCart;
      else if (step.label === 'Preparing') icon = IconClock;
      else if (step.label === 'Ready') icon = IconTakeout;
      else if (step.label === 'Served') icon = IconDineIn;
      else if (step.label.startsWith('To Pay')) icon = IconPeso;

      return { ...step, icon };
    });

    return {
      id: `#${order.id}`,
      status: order.status.charAt(0).toUpperCase() + order.status.slice(1),
      items: order.items_summary,
      estimatedTime: order.estimated_time,
      progress: order.progress,
      steps: steps,
      paymentMethod: order.payment_method === 'gcash' ? 'GCash' : 'Cash',
      totalAmount: `₱${Number(order.total_amount).toLocaleString()}`,
      image: order.order_image,
      itemsList: order.items || []
    };
  };

  useEffect(() => {
    if (searchParams.get("orderSuccess") === "true" && !orderSuccessShownRef.current) {
      orderSuccessShownRef.current = true;
      showNotification(
        "success",
        "Order Placed!",
        "Your order has been received and is being prepared.",
        5000
      );
      // Remove the query param to prevent showing it again on refresh?
      // Next.js router.replace might re-trigger if not careful, but for now this is fine.
      router.replace("/dashboard");
    }
  }, [searchParams, showNotification, router]);

  useEffect(() => {
    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      const returnUrl = encodeURIComponent("/dashboard");
      router.push(`/login?returnUrl=${returnUrl}`);
      return;
    }

    // Role Check: If staff or admin, redirect to their dashboard
    if (user?.role === 'admin') {
        router.replace("/admin/dashboard");
        return;
    }
    if (user?.role === 'staff') {
        router.replace("/staff/dashboard");
        return;
    }

    // Refresh user profile if missing profilePic
    if (user?.id && !user.profilePic) {
      fetch(getApiUrl(`/user-profile.php?user_id=${user.id}`))
        .then(res => res.json())
        .then(data => {
          if (data.success && data.user) {
            updateUser({
              firstName: data.user.firstName,
              lastName: data.user.lastName,
              name: data.user.name,
              profilePic: data.user.profilePic
            });
          }
        })
        .catch(err => console.error("Failed to refresh profile:", err));
    }

    if (!user) return;

    // Fetch Active Order from API
    const fetchActiveOrder = async () => {
      if (!user?.id) return;
      try {
        const response = await fetch(getApiUrl(`/active-order.php?userId=${user.id}`));
        const result = await response.json();

        if (result.success && result.data) {
          const order = result.data;
          setActiveOrder(mapOrderData(order));
          setRecentOrderTypes(order.recent_order_types || []);
        } else {
          setActiveOrder(null);
          if (result.recent_order_types) {
            setRecentOrderTypes(result.recent_order_types);
          }
        }
      } catch (err) {
        console.error("Failed to fetch active order:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchActiveOrder();

    // SSE Real-time Updates
    const sseUrl = getApiUrl(`/sse/active-order-updates.php?userId=${user!.id}`);
    const es = new EventSource(sseUrl);
    eventSourceRef.current = es;

    es.onopen = () => setIsLive(true);

    es.onmessage = (event) => {
      try {
        const result = JSON.parse(event.data);
        if (result.success && result.data) {
          setActiveOrder(mapOrderData(result.data));
        } else if (result.success && !result.data) {
           // Order might have been completed or cancelled
           setActiveOrder(null);
        }
      } catch (e) {
        console.error("SSE Error", e);
      }
    };

    es.onerror = () => {
      setIsLive(false);
      // EventSource auto-reconnects, but we can log it
      console.log("SSE Connection lost, attempting reconnect...");
    };

    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");

    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
    };
  }, [isAuthenticated, router, user, updateUser]);

  if (!isAuthenticated) {
    return null; // Or a loading spinner while redirecting
  }



  const kpis = [
    {
      label: "Active Order",
      value: activeOrder ? activeOrder.status : "No Active Order",
      icon: IconCart,
      color: "text-blue-600",
      bg: "bg-blue-50"
    },
    {
      label: "Payment Method",
      value: activeOrder ? activeOrder.paymentMethod : "---",
      icon: IconGCash,
      color: "text-indigo-600",
      bg: "bg-indigo-50"
    },
    {
      label: "Payment Amount",
      value: activeOrder ? activeOrder.totalAmount : "---",
      icon: IconPeso,
      color: "text-green-600",
      bg: "bg-green-50"
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <div className="container-edge min-h-screen pb-20">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        {/* Header Section */}
        <div className="w-full">
          <motion.div
            variants={itemVariants}
            className="relative overflow-hidden rounded-[2rem] bg-white/80 backdrop-blur-sm border border-gray-100 shadow-sm p-5 md:p-8"
          >
            {/* Decorative background curve */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-[4rem] -mr-8 -mt-8 pointer-events-none transition-all duration-500 ease-in-out group-hover:bg-primary/10" />

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
              <div className="flex items-center gap-5">
                <div className="relative group shrink-0">
                  <div className="w-[clamp(4rem,15vw,5rem)] h-[clamp(4rem,15vw,5rem)] rounded-[1.25rem] rotate-3 overflow-hidden border-[3px] border-white shadow-lg ring-1 ring-black/5 transform transition-all duration-300 group-hover:rotate-0 group-hover:scale-105">
                    <img
                      src={user?.profilePic || "https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"}
                      alt="Profile"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-[3px] border-white rounded-full shadow-sm animate-pulse"></div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex flex-col">
                    <span className="text-[clamp(0.875rem,3vw,1rem)] font-medium text-gray-500 mb-0.5 flex items-center gap-2">
                      {greeting},
                      {isLive && (
                        <span className="inline-flex items-center gap-1 bg-green-50 text-green-600 text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full border border-green-100">
                          <span className="relative flex h-1.5 w-1.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
                          </span>
                          Live
                        </span>
                      )}
                    </span>
                    <h1 className="font-display font-bold tracking-tight text-gray-900 leading-none text-[clamp(1.75rem,5vw,2.5rem)]">
                      <span className="text-primary block truncate">
                        {user?.firstName || user?.name?.split(' ')[0] || 'Guest'}
                      </span>
                    </h1>
                  </div>

                  <div className="flex items-center gap-3 mt-3">
                    <div className="inline-flex items-center rounded-full bg-gray-50 border border-gray-100 py-1.5 px-3 min-h-[32px]">
                      <span className="text-[0.6rem] font-bold text-gray-400 uppercase tracking-wider mr-2">ID</span>
                      <span className="text-xs font-mono font-bold text-gray-900">{user?.id || '---'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* KPIs Grid */}
        <div className="grid grid-cols-3 gap-2 md:gap-4">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-24 md:h-32 rounded-2xl w-full" />
            ))
          ) : (
            kpis.map((k, i) => {
              const Icon = k.icon;
              return (
                <motion.div
                  variants={itemVariants}
                  key={i}
                  whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.8)" }}
                  whileTap={{ scale: 0.98 }}
                  className="bg-white p-2 md:p-5 rounded-xl md:rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group cursor-pointer transition-colors hover:shadow-md touch-manipulation"
                >
                  <div className={`absolute top-0 right-0 p-1.5 md:p-3 opacity-10 group-hover:opacity-20 transition-opacity ${k.color}`}>
                    <Icon className="w-8 h-8 md:w-16 md:h-16 transform rotate-12" />
                  </div>
                  <div className="relative z-10">
                    <div className="flex flex-col md:flex-row md:items-center gap-1 md:gap-3 mb-1 md:mb-3">
                      <div className={`p-1 md:p-2 rounded-md md:rounded-lg w-fit ${k.bg} ${k.color}`}>
                        <Icon className="w-3.5 h-3.5 md:w-5 md:h-5" />
                      </div>
                      <span className="text-[10px] md:text-sm font-medium text-gray-500 truncate">{k.label}</span>
                    </div>
                    <div className="text-sm md:text-2xl font-bold mb-0.5 md:mb-1 text-gray-900 tracking-tight truncate">{k.value}</div>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>

        <div className="grid lg:grid-cols-12 gap-6">
          {/* Main Content Area */}
          <div className="lg:col-span-8 space-y-6">

            {/* Active Order Progress */}
            {(loading || activeOrder) && (
              <motion.div variants={itemVariants} className="bg-white rounded-3xl p-5 md:p-6 border border-gray-100 shadow-sm overflow-hidden relative">
                {loading ? (
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row justify-between gap-4">
                      <Skeleton className="w-32 h-6" />
                      <Skeleton className="w-24 h-6 self-start sm:self-auto" />
                    </div>
                    <Skeleton className="w-full h-24 rounded-xl" />
                    <Skeleton className="w-full h-2 rounded-full" />
                  </div>
                ) : activeOrder && (
                  <>
                          <div className="flex flex-col gap-6 mb-8">
                      {/* Header: Title & Meta */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3.5">
                          <div className="h-11 w-11 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0 shadow-sm ring-4 ring-primary/5">
                            <IconCart className="w-5 h-5" />
                          </div>
                          <div>
                            <h2 className="text-lg font-bold text-gray-900 leading-none tracking-tight">Active Order</h2>
                            <div className="flex items-center gap-2 mt-1.5">
                              <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-gray-100 border border-gray-200 text-[10px] font-mono font-bold text-gray-600">
                                {activeOrder.id}
                              </span>
                              <span className="h-1 w-1 rounded-full bg-gray-300"></span>
                              <span className="text-xs font-medium text-primary flex items-center gap-1">
                                <span className="relative flex h-2 w-2">
                                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                  <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                </span>
                                {activeOrder.status}
                              </span>
                            </div>
                          </div>
                        </div>

                        {activeOrder.status === "Preparing" && (
                          <div className="flex flex-col items-end bg-white/50 backdrop-blur-sm rounded-xl border border-gray-100 px-3 py-1.5 shadow-sm">
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5 flex items-center gap-1">
                              <IconClock className="w-3 h-3" /> Est. Time
                            </span>
                            <span className="text-lg font-bold text-gray-900 font-mono leading-none">{activeOrder.estimatedTime}</span>
                          </div>
                        )}
                      </div>

                      {/* Content: Images & Details */}
                      <div className="bg-gray-50/80 rounded-2xl p-4 border border-gray-100 hover:border-primary/10 transition-colors">
                        <div className="flex flex-col sm:flex-row gap-5 items-start sm:items-center">

                          {/* Scrollable Images Strip */}
                          <div className="w-full sm:w-auto sm:max-w-[45%] shrink-0">
                            {activeOrder.itemsList && activeOrder.itemsList.length > 0 ? (
                              <div className="flex gap-3 overflow-x-auto pb-2 sm:pb-0 w-full scrollbar-hide snap-x touch-pan-x items-center">
                                {activeOrder.itemsList.map((item, idx) => (
                                  <div key={idx} className="relative w-[4.5rem] h-[4.5rem] shrink-0 rounded-xl border-2 border-white shadow-sm overflow-hidden bg-white snap-start group transition-transform active:scale-95">
                                    <img
                                      src={item.image_url || "/assets/bistroflow-logo.jpg"}
                                      alt={item.product_name}
                                      className="w-full h-full object-cover"
                                    />
                                    {item.quantity > 1 && (
                                      <div className="absolute top-0 right-0 bg-primary text-white text-[9px] font-bold px-1.5 py-0.5 rounded-bl-lg shadow-sm z-10">
                                        x{item.quantity}
                                      </div>
                                    )}
                                  </div>
                                ))}
                              </div>
                            ) : activeOrder.image && (
                              <div className="w-[4.5rem] h-[4.5rem] shrink-0 rounded-xl border-2 border-white shadow-sm overflow-hidden bg-white">
                                 <img src={activeOrder.image} alt="Order" className="w-full h-full object-cover" />
                              </div>
                            )}
                          </div>

                          {/* Items Summary Text */}
                          <div className="min-w-0 flex-1 w-full border-t sm:border-t-0 sm:border-l border-gray-200/60 pt-3 sm:pt-0 sm:pl-5">
                             <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Items Summary</h4>
                             <p className="text-sm text-gray-700 leading-relaxed font-medium">
                               {activeOrder.items}
                             </p>
                             <div className="mt-2 flex items-center gap-2">
                               <span className="text-[10px] font-medium px-2 py-0.5 bg-white border border-gray-200 rounded-full text-gray-500">
                                 {activeOrder.itemsList?.reduce((acc, item) => acc + item.quantity, 0) || 0} Items
                               </span>
                             </div>
                          </div>

                        </div>
                      </div>
                    </div>

                    <div className="relative py-4 px-2 md:px-0">
                      <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2 rounded-full" />
                      <div className="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 rounded-full transition-all duration-1000" style={{ width: `${Math.min(Math.max(activeOrder.progress, 0), 100)}%` }} />

                      <div className={`grid ${activeOrder.steps.length === 5 ? 'grid-cols-5' : 'grid-cols-4'} relative z-10 w-full`}>
                        {activeOrder.steps.map((step, i) => (
                          <div key={i} className="flex flex-col items-center gap-2 md:gap-3 group">
                            <div className={`
                              w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center border-4 transition-all duration-500 shrink-0 z-20
                              ${step.active ? "bg-primary border-white text-white scale-110 shadow-lg shadow-primary/30" :
                                step.completed ? "bg-primary border-white text-white" : "bg-gray-100 border-white text-gray-300 group-hover:border-gray-200"}
                            `}>
                              <step.icon className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                            </div>
                            <span className={`text-[10px] md:text-xs font-medium transition-colors text-center leading-tight ${step.active || step.completed ? "text-primary font-bold" : "text-gray-400"}`}>
                              {step.label.split('\n').map((line: string, idx: number) => (
                                <span key={idx} className="block whitespace-nowrap">{line}</span>
                              ))}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </motion.div>
            )}

            {/* Preferences / Recent Locations (Swapped) */}
            <motion.div variants={itemVariants} className="bg-white rounded-3xl p-5 md:p-6 border border-gray-100 shadow-sm">
              {loading ? (
                <div className="space-y-4">
                  <Skeleton className="w-24 h-6 mb-4" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Skeleton className="h-20 rounded-2xl" />
                    <Skeleton className="h-20 rounded-2xl" />
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-lg text-gray-900">Order Type</h3>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button className={`flex items-center p-3 rounded-2xl border transition-all gap-3 relative overflow-hidden group touch-manipulation active:scale-95 text-left
                      ${recentOrderTypes.includes('dine-in')
                        ? "bg-primary/10 border-primary/20 ring-1 ring-primary/20"
                        : "bg-gray-50 border-gray-100 hover:bg-gray-100"}`}
                    >
                      {recentOrderTypes.includes('dine-in') && <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />}
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm shrink-0
                        ${recentOrderTypes.includes('dine-in') ? "bg-white text-primary" : "bg-white text-gray-400"}`}
                      >
                        <IconDineIn className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col">
                        <span className={`text-sm font-bold ${recentOrderTypes.includes('dine-in') ? "text-primary" : "text-gray-700"}`}>Dine-In</span>
                        <span className={`text-[10px] font-medium ${recentOrderTypes.includes('dine-in') ? "text-primary/60" : "text-gray-400"}`}>Eat at restaurant</span>
                      </div>
                      {recentOrderTypes.includes('dine-in') && <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-primary animate-pulse" />}
                    </button>

                    <button className={`flex items-center p-3 rounded-2xl border transition-all gap-3 relative overflow-hidden group touch-manipulation active:scale-95 text-left
                      ${recentOrderTypes.includes('takeout')
                        ? "bg-primary/10 border-primary/20 ring-1 ring-primary/20"
                        : "bg-gray-50 border-gray-100 hover:bg-gray-100"}`}
                    >
                      {recentOrderTypes.includes('takeout') && <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />}
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-sm shrink-0
                         ${recentOrderTypes.includes('takeout') ? "bg-white text-primary" : "bg-white text-orange-400"}`}
                      >
                        <IconTakeout className="w-5 h-5" />
                      </div>
                      <div className="flex flex-col">
                        <span className={`text-sm font-bold ${recentOrderTypes.includes('takeout') ? "text-primary" : "text-gray-700"}`}>Takeout</span>
                        <span className={`text-[10px] font-medium ${recentOrderTypes.includes('takeout') ? "text-primary/60" : "text-gray-400"}`}>Pick up to go</span>
                      </div>
                      {recentOrderTypes.includes('takeout') && <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-primary animate-pulse" />}
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </div>

          {/* Sidebar Area */}
          <div className="lg:col-span-4 space-y-6">

            {/* Recent Orders Cards */}
            <OrderList />


          </div>
        </div>
      </motion.div>
    </div>
  );
}
