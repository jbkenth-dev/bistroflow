 "use client";
 
 import { motion } from "framer-motion";
 import Link from "next/link";
 import { useEffect, useState } from "react";
 import { IconCart, IconPeso, IconStar, IconGCash, IconCash, IconDineIn, IconTakeout, IconArrowRight } from "@/components/ui/icons";
 
 export function CustomerDashboardClient() {
   const [loading, setLoading] = useState(true);
   useEffect(() => {
     const t = setTimeout(() => setLoading(false), 900);
     return () => clearTimeout(t);
   }, []);
 
   const kpis = [
     { label: "Active Order", value: "Preparing", icon: IconCart, sub: "ETA 15 min" },
     { label: "Rewards", value: "1,240 pts", icon: IconStar, sub: "+120 this month" },
     { label: "Payment", value: "GCash", icon: IconGCash, sub: "Primary method" },
     { label: "Last Total", value: "₱980", icon: IconPeso, sub: "3 items" }
   ];
 
   return (
     <div className="container-edge">
       <div className="grid lg:grid-cols-12 gap-6">
         <div className="lg:col-span-12">
           <div className="flex items-center justify-between">
             <div>
               <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight">Your Dashboard</h1>
               <p className="mt-1 text-sm opacity-80">Track orders, manage rewards, and explore personalized picks.</p>
             </div>
             <div className="hidden md:block">
               {loading ? (
                 <motion.div
                   initial={{ backgroundPosition: "0% 0%" }}
                   animate={{ backgroundPosition: "100% 0%" }}
                   transition={{ repeat: Infinity, duration: 1.6, ease: "linear" }}
                   className="rounded-xl w-[220px] h-9"
                   style={{
                     backgroundImage:
                       "linear-gradient(90deg, rgba(255,255,255,0.06) 25%, rgba(255,255,255,0.25) 37%, rgba(255,255,255,0.06) 63%)",
                     backgroundSize: "400% 100%",
                   }}
                 />
               ) : (
                 <input
                   type="search"
                   placeholder="Search orders or dishes"
                   className="glass rounded-xl px-3 py-2 w-[220px] border border-white/10 outline-none focus:ring-2 focus:ring-primary/50"
                 />
               )}
             </div>
           </div>
         </div>
 
         <div className="lg:col-span-12">
           <motion.div
             initial={{ opacity: 0, y: 8 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.4 }}
             className="grid md:grid-cols-4 gap-4"
           >
             {kpis.map((k, i) => {
               const I = k.icon;
               return (
                 <motion.div
                   key={k.label}
                   initial={{ opacity: 0, y: 6, scale: 0.98 }}
                   animate={{ opacity: 1, y: 0, scale: 1 }}
                   transition={{ delay: i * 0.05, duration: 0.35 }}
                   className="glass rounded-2xl p-4 border border-white/10"
                 >
                   <div className="flex items-center justify-between gap-3">
                     <div>
                       <div className="text-xs opacity-60">{k.label}</div>
                       <div className="mt-1 text-lg font-semibold">{k.value}</div>
                     </div>
                     <div className="glass rounded-xl p-2">
                       <I className="w-5 h-5" />
                     </div>
                   </div>
                   <div className="mt-2 text-xs opacity-60">{k.sub}</div>
                 </motion.div>
               );
             })}
           </motion.div>
         </div>
 
         <div className="lg:col-span-8">
           <motion.div
             initial={{ opacity: 0, y: 8 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.4 }}
             className="glass rounded-2xl p-4 border border-white/10"
           >
             {loading ? (
               <div>
                 <div className="h-5 w-32 rounded skeleton" />
                 <div className="mt-3 h-40 w-full rounded-xl skeleton" />
               </div>
             ) : (
               <div>
                 <div className="flex items-center justify-between">
                   <div className="font-semibold">Order Progress</div>
                   <div className="text-xs opacity-60">#20341 • Dine-In</div>
                 </div>
                 <div className="mt-4 grid grid-cols-4 gap-3">
                   {[
                     { label: "Placed", done: true },
                     { label: "Preparing", done: true },
                     { label: "Ready", done: false },
                     { label: "Served", done: false },
                   ].map((s, i) => (
                     <div key={i} className="text-center">
                       <div className={`mx-auto w-10 h-10 rounded-full ${s.done ? "bg-primary/25 text-primary" : "bg-white/10"} flex items-center justify-center`}>
                         {s.done ? <IconCart className="w-5 h-5" /> : <IconTakeout className="w-5 h-5" />}
                       </div>
                       <div className="mt-2 text-xs opacity-80">{s.label}</div>
                     </div>
                   ))}
                 </div>
                 <div className="mt-4 h-2 w-full rounded-full bg-white/10">
                   <div className="h-2 rounded-full bg-primary" style={{ width: "50%" }} />
                 </div>
               </div>
             )}
           </motion.div>
 
           <motion.div
             initial={{ opacity: 0, y: 8 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.4 }}
             className="mt-4 glass rounded-2xl p-4 border border-white/10"
           >
             {loading ? (
               <div>
                 <div className="h-5 w-40 rounded skeleton" />
                 <div className="mt-3 h-24 w-full rounded-xl skeleton" />
               </div>
             ) : (
               <div>
                 <div className="flex items-center justify-between">
                   <div className="font-semibold">Recent Orders</div>
                   <Link href="/menu" className="text-sm hover:underline">Order again</Link>
                 </div>
                 <div className="mt-3 overflow-x-auto">
                   <table className="min-w-full text-sm">
                     <thead className="text-left">
                       <tr className="border-b border-white/10">
                         <th className="py-2 pr-4">Order</th>
                         <th className="py-2 pr-4">Method</th>
                         <th className="py-2 pr-4">Items</th>
                         <th className="py-2 pr-4">Total</th>
                         <th className="py-2 pr-4">Status</th>
                       </tr>
                     </thead>
                     <tbody>
                       {[
                         { id: "#20340", method: "Takeout", items: 3, total: "₱540", status: "Completed" },
                         { id: "#20339", method: "Dine-In", items: 2, total: "₱380", status: "Completed" },
                         { id: "#20338", method: "Takeout", items: 4, total: "₱760", status: "Cancelled" },
                       ].map((o) => (
                         <tr key={o.id} className="border-b border-white/5">
                           <td className="py-2 pr-4">{o.id}</td>
                           <td className="py-2 pr-4">{o.method}</td>
                           <td className="py-2 pr-4">{o.items}</td>
                           <td className="py-2 pr-4">{o.total}</td>
                           <td className="py-2 pr-4">{o.status}</td>
                         </tr>
                       ))}
                     </tbody>
                   </table>
                 </div>
               </div>
             )}
           </motion.div>
         </div>
 
         <div className="lg:col-span-4">
           <motion.div
             initial={{ opacity: 0, y: 8 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.4 }}
             className="glass rounded-2xl p-4 border border-white/10"
           >
             {loading ? (
               <div>
                 <div className="h-5 w-28 rounded skeleton" />
                 <div className="mt-3 h-9 w-full rounded-xl skeleton" />
                 <div className="mt-2 h-9 w-full rounded-xl skeleton" />
                 <div className="mt-2 h-9 w-full rounded-xl skeleton" />
               </div>
             ) : (
               <div>
                 <div className="font-semibold">Quick Actions</div>
                 <div className="mt-3 grid gap-2">
                   <Link href="/menu" className="glass rounded-xl px-3 py-2 inline-flex items-center gap-2 hover:bg-white/7">
                     <IconArrowRight className="w-4 h-4" />
                     <span>Browse Menu</span>
                   </Link>
                   <Link href="/reservation" className="glass rounded-xl px-3 py-2 inline-flex items-center gap-2 hover:bg-white/7">
                     <IconDineIn className="w-4 h-4" />
                     <span>Make Reservation</span>
                   </Link>
                   <Link href="/promotions" className="glass rounded-xl px-3 py-2 inline-flex items-center gap-2 hover:bg-white/7">
                     <IconCash className="w-4 h-4" />
                     <span>View Promotions</span>
                   </Link>
                 </div>
               </div>
             )}
           </motion.div>
 
           <motion.div
             initial={{ opacity: 0, y: 8 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.4 }}
             className="mt-4 glass rounded-2xl p-4 border border-white/10"
           >
             {loading ? (
               <div>
                 <div className="h-5 w-32 rounded skeleton" />
                 <div className="mt-3 h-28 w-full rounded-xl skeleton" />
               </div>
             ) : (
               <div>
                 <div className="flex items-center justify-between">
                   <div className="font-semibold">Preferences</div>
                   <div className="text-xs opacity-60">Recent</div>
                 </div>
                 <div className="mt-3 grid grid-cols-2 gap-3">
                   <div className="glass rounded-xl p-3 flex items-center justify-between">
                     <span className="text-sm">Dine-In</span>
                     <IconDineIn className="w-5 h-5" />
                   </div>
                   <div className="glass rounded-xl p-3 flex items-center justify-between">
                     <span className="text-sm">Takeout</span>
                     <IconTakeout className="w-5 h-5" />
                   </div>
                 </div>
               </div>
             )}
           </motion.div>
         </div>
       </div>
     </div>
   );
 }
