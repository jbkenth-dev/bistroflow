"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { IconCart, IconPeso, IconStar, IconGCash, IconCash, IconDineIn, IconTakeout, IconArrowRight, IconClock, IconMapPin, IconList, IconSettings } from "@/components/ui/icons";

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
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState("Welcome back");

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 2000); 
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Good morning");
    else if (hour < 18) setGreeting("Good afternoon");
    else setGreeting("Good evening");
    return () => clearTimeout(t);
  }, []);

  const kpis = [
    { label: "Active Order", value: "Preparing", icon: IconCart, color: "text-blue-600", bg: "bg-blue-50" },
    { label: "Payment Method", value: "GCash", icon: IconGCash, color: "text-indigo-600", bg: "bg-indigo-50" },
    { label: "Payment Amount", value: "₱980", icon: IconPeso, color: "text-green-600", bg: "bg-green-50" }
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
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <motion.div variants={itemVariants} className="flex items-center gap-4">
            <div className="relative group">
              <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-white shadow-lg ring-2 ring-gray-100 transform transition-transform group-hover:scale-105">
                <img 
                  src="https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                  alt="Profile" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full shadow-sm animate-pulse"></div>
            </div>
            <div>
              <h1 className="font-display text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
                {greeting}, <span className="text-primary">Alex</span>
              </h1>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex rounded-md overflow-hidden shadow-sm border border-gray-200">
                  <div className="bg-gray-100 px-2 py-1 flex items-center justify-center border-r border-gray-200">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">ID</span>
                  </div>
                  <div className="bg-white px-3 py-1 flex items-center justify-center min-w-[60px]">
                    <span className="text-xs font-mono font-bold text-gray-800 tracking-wide">883-921</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          
          <motion.div variants={itemVariants} className="flex items-center gap-3">
            {/* Search removed */}
          </motion.div>
        </div>

        {/* KPIs Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {loading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-32 rounded-2xl" />
            ))
          ) : (
            kpis.map((k, i) => {
              const Icon = k.icon;
              return (
                <motion.div
                  variants={itemVariants}
                  key={i}
                  whileHover={{ scale: 1.02, backgroundColor: "rgba(255,255,255,0.8)" }}
                  className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group cursor-pointer transition-colors hover:shadow-md"
                >
                  <div className={`absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity ${k.color}`}>
                    <Icon className="w-16 h-16 transform rotate-12" />
                  </div>
                  <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`p-2 rounded-lg ${k.bg} ${k.color}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-sm font-medium text-gray-500">{k.label}</span>
                    </div>
                    <div className="text-2xl font-bold mb-1 text-gray-900">{k.value}</div>
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
            <motion.div variants={itemVariants} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm overflow-hidden relative">
              {loading ? (
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <Skeleton className="w-32 h-6" />
                    <Skeleton className="w-24 h-6" />
                  </div>
                  <Skeleton className="w-full h-24 rounded-xl" />
                  <Skeleton className="w-full h-2 rounded-full" />
                </div>
              ) : (
                <>
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <div>
                      <h2 className="text-xl font-bold flex items-center gap-2 text-gray-900">
                        Active Order 
                        <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">#20341</span>
                      </h2>
                      <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                        Preparing your meal • Chicken Parm, Coke, Fries...
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="px-4 py-2 rounded-xl bg-gray-50 border border-gray-100 text-xs font-medium text-center">
                          <span className="block text-gray-400 text-[10px] uppercase tracking-wider">Estimated Time</span>
                          <span className="text-lg font-bold text-primary">15 min</span>
                        </div>
                    </div>
                  </div>

                  <div className="relative py-4">
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2 rounded-full" />
                    <div className="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 rounded-full transition-all duration-1000" style={{ width: "50%" }} />
                    
                    <div className="grid grid-cols-4 relative z-10">
                      {[
                        { label: "Placed", icon: IconCart, active: true, completed: true },
                        { label: "Preparing", icon: IconClock, active: true, completed: false },
                        { label: "Ready", icon: IconTakeout, active: false, completed: false },
                        { label: "Served", icon: IconDineIn, active: false, completed: false },
                      ].map((step, i) => (
                        <div key={i} className="flex flex-col items-center gap-3 group">
                          <div className={`
                            w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all duration-500
                            ${step.active ? "bg-primary border-white text-white scale-110 shadow-lg shadow-primary/30" : 
                              step.completed ? "bg-primary border-white text-white" : "bg-gray-100 border-white text-gray-300 group-hover:border-gray-200"}
                          `}>
                            <step.icon className="w-4 h-4" />
                          </div>
                          <span className={`text-xs font-medium transition-colors ${step.active ? "text-primary font-bold" : "text-gray-400"}`}>
                            {step.label}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </motion.div>

            {/* Recent Orders Table */}
            <motion.div variants={itemVariants} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
               {loading ? (
                <div className="space-y-4">
                  <Skeleton className="w-40 h-7 mb-6" />
                  {[1,2,3].map(i => (
                    <Skeleton key={i} className="w-full h-16 rounded-xl" />
                  ))}
                </div>
               ) : (
                 <>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
                    <Link href="/orders" className="text-sm text-primary hover:text-primary/80 transition-colors font-medium flex items-center gap-1">
                      View All <IconArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left text-xs text-gray-400 uppercase tracking-wider border-b border-gray-100">
                          <th className="pb-4 pl-4 font-medium">Order ID</th>
                          <th className="pb-4 font-medium">Items</th>
                          <th className="pb-4 font-medium">Date</th>
                          <th className="pb-4 font-medium">Total</th>
                          <th className="pb-4 font-medium text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {[
                          { id: "#20340", items: "Chicken Parm, Coke...", date: "Today, 12:30 PM", total: "₱540", status: "Completed" },
                          { id: "#20339", items: "Beef Steak, Rice...", date: "Yesterday", total: "₱380", status: "Completed" },
                          { id: "#20338", items: "Pasta Carbonara...", date: "Oct 24", total: "₱760", status: "Cancelled" },
                        ].map((order) => (
                          <tr key={order.id} className="group hover:bg-gray-50 transition-colors">
                            <td className="py-4 pl-4 font-medium text-gray-900">{order.id}</td>
                            <td className="py-4 text-sm text-gray-600">{order.items}</td>
                            <td className="py-4 text-sm text-gray-500">{order.date}</td>
                            <td className="py-4 font-medium text-gray-900">{order.total}</td>
                            <td className="py-4 text-center">
                              <span className={`
                                inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border
                                ${order.status === "Completed" ? "bg-green-50 text-green-700 border-green-200" : 
                                  order.status === "Cancelled" ? "bg-red-50 text-red-700 border-red-200" : "bg-gray-50 text-gray-600 border-gray-200"}
                              `}>
                                {order.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                 </>
               )}
            </motion.div>
          </div>

          {/* Sidebar Area */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Preferences / Recent Locations */}
            <motion.div variants={itemVariants} className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
              {loading ? (
                <div className="space-y-3">
                  <Skeleton className="w-24 h-6 mb-4" />
                  <div className="grid grid-cols-2 gap-3">
                    <Skeleton className="h-24 rounded-2xl" />
                    <Skeleton className="h-24 rounded-2xl" />
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-lg text-gray-900">Order Type</h3>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <button className="flex flex-col items-center justify-center p-4 rounded-2xl bg-primary/10 border border-primary/20 ring-1 ring-primary/20 transition-all gap-2 text-center relative overflow-hidden group">
                      <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary shadow-sm">
                        <IconDineIn className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-bold text-primary">Dine-In</span>
                      <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary animate-pulse" />
                    </button>
                    <button className="flex flex-col items-center justify-center p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:bg-gray-100 transition-colors gap-2 text-center">
                      <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-orange-400 shadow-sm">
                        <IconTakeout className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-medium text-gray-500">Takeout</span>
                    </button>
                  </div>
                </>
              )}
            </motion.div>

          </div>
        </div>
      </motion.div>
    </div>
  );
}
