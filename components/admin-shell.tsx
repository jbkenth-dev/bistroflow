 "use client";

 import { motion } from "framer-motion";
 import Link from "next/link";
 import { useEffect, useState } from "react";
 import { usePathname } from "next/navigation";
 import { IconMenu, IconHome, IconCart, IconList, IconUsers, IconChart, IconSettings } from "@/components/ui/icons";

 export function AdminShell({ children }: { children: React.ReactNode }) {
   const [sidebarOpen, setSidebarOpen] = useState(false);
   const [loading, setLoading] = useState(true);
   const pathname = usePathname();

   useEffect(() => {
     const t = setTimeout(() => setLoading(false), 800);
     return () => clearTimeout(t);
   }, []);

   const navGroups = [
     { title: "Overview", items: [{ label: "Overview", href: "/admin/dashboard", icon: IconHome }] },
     {
       title: "Management",
       items: [
         { label: "Orders", href: "/admin/orders", icon: IconCart, badge: "12" },
         { label: "Menu", href: "/admin/menu", icon: IconList, badge: "48" },
         { label: "Staff", href: "/admin/staff", icon: IconUsers },
       ],
     },
     { title: "Insights", items: [{ label: "Analytics", href: "/admin/analytics", icon: IconChart }] },
     { title: "System", items: [{ label: "Settings", href: "/admin/settings", icon: IconSettings }] },
   ];

   return (
     <div className="min-h-[100dvh]">
       <header className="sticky top-0 z-30 bg-background/70 backdrop-blur border-b border-white/10">
         <div className="container-edge py-3 flex items-center justify-between">
           <div className="flex items-center gap-3">
             <motion.button
               type="button"
               onClick={() => setSidebarOpen((v) => !v)}
               whileHover={{ scale: 1.05 }}
               whileTap={{ scale: 0.95 }}
               aria-label="Toggle menu"
               className="md:hidden glass rounded-xl p-2"
             >
               <IconMenu className="w-5 h-5" />
             </motion.button>
            <Link href="/admin/dashboard" className="font-display text-xl font-bold tracking-tight">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-orange-400 to-orange-600">BISTRO</span>
              <span className="text-black">FLOW</span>
            </Link>
           </div>
           <div className="flex items-center gap-3">
             {loading ? (
               <motion.div
                 initial={{ backgroundPosition: "0% 0%" }}
                 animate={{ backgroundPosition: "100% 0%" }}
                 transition={{ repeat: Infinity, duration: 1.6, ease: "linear" }}
                 className="hidden md:block rounded-xl w-[280px] h-9"
                 style={{
                   backgroundImage:
                     "linear-gradient(90deg, rgba(255,255,255,0.06) 25%, rgba(255,255,255,0.25) 37%, rgba(255,255,255,0.06) 63%)",
                   backgroundSize: "400% 100%",
                 }}
               />
             ) : (
               <input
                 type="search"
                 placeholder="Search"
                 className="hidden md:block glass rounded-xl px-3 py-2 w-[280px] border border-white/10 outline-none focus:ring-2 focus:ring-primary/50"
               />
             )}
             {loading ? (
               <motion.div
                 initial={{ backgroundPosition: "0% 0%" }}
                 animate={{ backgroundPosition: "100% 0%" }}
                 transition={{ repeat: Infinity, duration: 1.6, ease: "linear" }}
                 className="rounded-full w-9 h-9"
                 style={{
                   backgroundImage:
                     "linear-gradient(90deg, rgba(255,255,255,0.06) 25%, rgba(255,255,255,0.25) 37%, rgba(255,255,255,0.06) 63%)",
                   backgroundSize: "400% 100%",
                 }}
               />
             ) : (
               <div className="glass rounded-full w-9 h-9 grid place-items-center font-semibold">A</div>
             )}
           </div>
         </div>
       </header>

       <div className="container-edge grid grid-cols-12 gap-6 py-6">
         <aside className={`${sidebarOpen ? "block" : "hidden"} md:block md:col-span-3 lg:col-span-2`}>
           <motion.div initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }} className="glass rounded-2xl p-4 border border-white/10">
             {loading ? (
               <div className="space-y-2">
                 {Array.from({ length: 6 }).map((_, i) => (
                   <motion.div
                     key={i}
                     initial={{ backgroundPosition: "0% 0%" }}
                     animate={{ backgroundPosition: "100% 0%" }}
                     transition={{ repeat: Infinity, duration: 1.6, ease: "linear" }}
                     className="h-9 rounded-xl"
                     style={{
                       backgroundImage:
                         "linear-gradient(90deg, rgba(255,255,255,0.06) 25%, rgba(255,255,255,0.25) 37%, rgba(255,255,255,0.06) 63%)",
                       backgroundSize: "400% 100%",
                     }}
                   />
                 ))}
               </div>
             ) : (
               <nav className="space-y-4">
                 {navGroups.map((group) => (
                   <div key={group.title} className="space-y-1">
                     <div className="px-3 pb-1 text-xs uppercase tracking-wide opacity-50">{group.title}</div>
                     {group.items.map((n) => {
                       const I = n.icon;
                       const active = pathname?.startsWith(n.href);
                       return (
                         <Link
                           key={n.href}
                           href={n.href}
                           className={`relative flex items-center justify-between px-3 py-2 rounded-xl transition-colors ${active ? "bg-white/7 ring-1 ring-primary/40" : "hover:bg-white/5"}`}
                         >
                           {active ? <motion.div layoutId="sidebar-active" className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r" /> : null}
                           <span className="flex items-center gap-3">
                             <span className={`${active ? "bg-primary/15 text-primary" : "glass"} rounded-lg p-2`}>
                               <I className="w-4 h-4" />
                             </span>
                             <span className="text-sm font-medium">{n.label}</span>
                           </span>
                           {"badge" in n && n.badge ? (
                             <span className={`text-xs px-2 py-1 rounded-lg ${active ? "bg-primary/20 text-primary" : "bg-white/10"}`}>{n.badge}</span>
                           ) : null}
                         </Link>
                       );
                     })}
                   </div>
                 ))}
               </nav>
             )}
           </motion.div>
         </aside>

         <main className="col-span-12 md:col-span-9 lg:col-span-10">{children}</main>
       </div>
     </div>
   );
 }
