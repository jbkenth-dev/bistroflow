 "use client";

import { motion } from "framer-motion";
 import Link from "next/link";
import { useEffect, useState } from "react";
import { IconMenu, IconCart, IconPeso, IconDineIn, IconTakeout, IconCash, IconHome, IconList, IconUsers, IconChart, IconSettings } from "@/components/ui/icons";
import { usePathname } from "next/navigation";

 export function AdminDashboardClient() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(t);
  }, []);

   const kpis = [
     { label: "Revenue", value: "₱128,940", icon: IconPeso, sub: "+8.4% vs last week" },
     { label: "Orders", value: "1,284", icon: IconCart, sub: "+3.1% vs last week" },
     { label: "Avg Order", value: "₱100.4", icon: IconCash, sub: "+1.2% vs last week" },
     { label: "Dine-In / Takeout", value: "62% / 38%", icon: IconDineIn, sub: "Balanced traffic" },
   ];

  const navGroups = [
    {
      title: "Overview",
      items: [{ label: "Overview", href: "/admin/dashboard", icon: IconHome }],
    },
    {
      title: "Management",
      items: [
        { label: "Orders", href: "/admin/orders", icon: IconCart, badge: "12" },
        { label: "Menu", href: "/admin/menu", icon: IconList, badge: "48" },
        { label: "Staff", href: "/admin/staff", icon: IconUsers },
      ],
    },
    {
      title: "Insights",
      items: [{ label: "Analytics", href: "/admin/analytics", icon: IconChart }],
    },
    {
      title: "System",
      items: [{ label: "Settings", href: "/admin/settings", icon: IconSettings }],
    },
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
           <motion.div
             initial={{ opacity: 0, x: -8 }}
             animate={{ opacity: 1, x: 0 }}
             transition={{ duration: 0.3 }}
             className="glass rounded-2xl p-4 border border-white/10"
           >
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

         <main className="col-span-12 md:col-span-9 lg:col-span-10">
           <motion.div
             initial={{ opacity: 0, y: 10 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.4 }}
             className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4"
           >
            {(loading ? Array.from({ length: 4 }) : kpis).map((k: any, i: number) => {
              if (loading) {
                return (
                  <motion.div
                    key={`sk-${i}`}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="glass rounded-2xl p-4 border border-white/10"
                  >
                    <motion.div
                      initial={{ backgroundPosition: "0% 0%" }}
                      animate={{ backgroundPosition: "100% 0%" }}
                      transition={{ repeat: Infinity, duration: 1.6, ease: "linear" }}
                      className="h-6 w-24 rounded-md"
                      style={{
                        backgroundImage:
                          "linear-gradient(90deg, rgba(255,255,255,0.06) 25%, rgba(255,255,255,0.25) 37%, rgba(255,255,255,0.06) 63%)",
                        backgroundSize: "400% 100%",
                      }}
                    />
                    <motion.div
                      initial={{ backgroundPosition: "0% 0%" }}
                      animate={{ backgroundPosition: "100% 0%" }}
                      transition={{ repeat: Infinity, duration: 1.6, ease: "linear" }}
                      className="mt-3 h-8 w-32 rounded-md"
                      style={{
                        backgroundImage:
                          "linear-gradient(90deg, rgba(255,255,255,0.06) 25%, rgba(255,255,255,0.25) 37%, rgba(255,255,255,0.06) 63%)",
                        backgroundSize: "400% 100%",
                      }}
                    />
                    <motion.div
                      initial={{ backgroundPosition: "0% 0%" }}
                      animate={{ backgroundPosition: "100% 0%" }}
                      transition={{ repeat: Infinity, duration: 1.6, ease: "linear" }}
                      className="mt-2 h-4 w-40 rounded-md"
                      style={{
                        backgroundImage:
                          "linear-gradient(90deg, rgba(255,255,255,0.06) 25%, rgba(255,255,255,0.25) 37%, rgba(255,255,255,0.06) 63%)",
                        backgroundSize: "400% 100%",
                      }}
                    />
                  </motion.div>
                );
              }
              const I = k.icon;
              return (
                <motion.div
                  key={k.label}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass rounded-2xl p-4 border border-white/10"
                >
                  <div className="flex items-center justify-between">
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

           <div className="mt-6 grid lg:grid-cols-12 gap-4">
             <motion.div
               initial={{ opacity: 0, y: 8 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.4 }}
               className="glass rounded-2xl p-4 border border-white/10 lg:col-span-7"
             >
              {loading ? (
                <div>
                  <motion.div
                    initial={{ backgroundPosition: "0% 0%" }}
                    animate={{ backgroundPosition: "100% 0%" }}
                    transition={{ repeat: Infinity, duration: 1.6, ease: "linear" }}
                    className="h-6 w-28 rounded-md"
                    style={{
                      backgroundImage:
                        "linear-gradient(90deg, rgba(255,255,255,0.06) 25%, rgba(255,255,255,0.25) 37%, rgba(255,255,255,0.06) 63%)",
                      backgroundSize: "400% 100%",
                    }}
                  />
                  <motion.div
                    initial={{ backgroundPosition: "0% 0%" }}
                    animate={{ backgroundPosition: "100% 0%" }}
                    transition={{ repeat: Infinity, duration: 1.6, ease: "linear" }}
                    className="mt-4 h-40 rounded-xl"
                    style={{
                      backgroundImage:
                        "linear-gradient(90deg, rgba(255,255,255,0.06) 25%, rgba(255,255,255,0.25) 37%, rgba(255,255,255,0.06) 63%)",
                      backgroundSize: "400% 100%",
                    }}
                  />
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between">
                    <div className="font-semibold">Sales Trend</div>
                    <div className="text-xs opacity-60">Last 14 days</div>
                  </div>
                  <div className="mt-4 h-40">
                    <svg viewBox="0 0 400 160" preserveAspectRatio="none" className="w-full h-full">
                      <defs>
                        <linearGradient id="g" x1="0" x2="0" y1="0" y2="1">
                          <stop offset="0" stopColor="currentColor" stopOpacity="0.35" />
                          <stop offset="1" stopColor="currentColor" stopOpacity="0.05" />
                        </linearGradient>
                      </defs>
                      <path d="M0 120 C 40 100, 80 140, 120 110 S 200 80, 240 120 S 320 140, 400 90" fill="none" stroke="currentColor" strokeWidth="2" />
                      <path d="M0 120 C 40 100, 80 140, 120 110 S 200 80, 240 120 S 320 140, 400 90 L 400 160 L 0 160 Z" fill="url(#g)" />
                    </svg>
                  </div>
                </div>
              )}
             </motion.div>

             <motion.div
               initial={{ opacity: 0, y: 8 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ duration: 0.4 }}
               className="glass rounded-2xl p-4 border border-white/10 lg:col-span-5"
             >
              {loading ? (
                <div>
                  <motion.div
                    initial={{ backgroundPosition: "0% 0%" }}
                    animate={{ backgroundPosition: "100% 0%" }}
                    transition={{ repeat: Infinity, duration: 1.6, ease: "linear" }}
                    className="h-6 w-32 rounded-md"
                    style={{
                      backgroundImage:
                        "linear-gradient(90deg, rgba(255,255,255,0.06) 25%, rgba(255,255,255,0.25) 37%, rgba(255,255,255,0.06) 63%)",
                      backgroundSize: "400% 100%",
                    }}
                  />
                  <div className="mt-4 space-y-3">
                    {Array.from({ length: 2 }).map((_, i) => (
                      <motion.div
                        key={i}
                        initial={{ backgroundPosition: "0% 0%" }}
                        animate={{ backgroundPosition: "100% 0%" }}
                        transition={{ repeat: Infinity, duration: 1.6, ease: "linear" }}
                        className="h-6 rounded-md"
                        style={{
                          backgroundImage:
                            "linear-gradient(90deg, rgba(255,255,255,0.06) 25%, rgba(255,255,255,0.25) 37%, rgba(255,255,255,0.06) 63%)",
                          backgroundSize: "400% 100%",
                        }}
                      />
                    ))}
                  </div>
                  <motion.div
                    initial={{ backgroundPosition: "0% 0%" }}
                    animate={{ backgroundPosition: "100% 0%" }}
                    transition={{ repeat: Infinity, duration: 1.6, ease: "linear" }}
                    className="mt-4 h-2 w-full rounded-full"
                    style={{
                      backgroundImage:
                        "linear-gradient(90deg, rgba(255,255,255,0.06) 25%, rgba(255,255,255,0.25) 37%, rgba(255,255,255,0.06) 63%)",
                      backgroundSize: "400% 100%",
                    }}
                  />
                </div>
              ) : (
                <div>
                  <div className="font-semibold">Top Categories</div>
                  <div className="mt-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2"><IconDineIn className="w-4 h-4" /><span className="text-sm">Dine-In</span></div>
                      <div className="text-sm font-semibold">62%</div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2"><IconTakeout className="w-4 h-4" /><span className="text-sm">Takeout</span></div>
                      <div className="text-sm font-semibold">38%</div>
                    </div>
                  </div>
                  <div className="mt-4 h-2 w-full rounded-full bg-white/10">
                    <div className="h-2 rounded-full bg-primary" style={{ width: "62%" }} />
                  </div>
                </div>
              )}
             </motion.div>
           </div>

           <motion.div
             initial={{ opacity: 0, y: 8 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.4 }}
             className="mt-6 glass rounded-2xl p-4 border border-white/10"
           >
            {loading ? (
              <div>
                <motion.div
                  initial={{ backgroundPosition: "0% 0%" }}
                  animate={{ backgroundPosition: "100% 0%" }}
                  transition={{ repeat: Infinity, duration: 1.6, ease: "linear" }}
                  className="h-6 w-32 rounded-md"
                  style={{
                    backgroundImage:
                      "linear-gradient(90deg, rgba(255,255,255,0.06) 25%, rgba(255,255,255,0.25) 37%, rgba(255,255,255,0.06) 63%)",
                    backgroundSize: "400% 100%",
                  }}
                />
                <div className="mt-3 space-y-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <motion.div
                      key={i}
                      initial={{ backgroundPosition: "0% 0%" }}
                      animate={{ backgroundPosition: "100% 0%" }}
                      transition={{ repeat: Infinity, duration: 1.6, ease: "linear" }}
                      className="h-8 rounded-xl"
                      style={{
                        backgroundImage:
                          "linear-gradient(90deg, rgba(255,255,255,0.06) 25%, rgba(255,255,255,0.25) 37%, rgba(255,255,255,0.06) 63%)",
                        backgroundSize: "400% 100%",
                      }}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div>
                <div className="flex items-center justify-between">
                  <div className="font-semibold">Recent Orders</div>
                  <Link href="/admin/orders" className="text-sm hover:underline">View all</Link>
                </div>
                <div className="mt-3 overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead className="text-left">
                      <tr className="border-b border-white/10">
                        <th className="py-2 pr-4">Order</th>
                        <th className="py-2 pr-4">Customer</th>
                        <th className="py-2 pr-4">Method</th>
                        <th className="py-2 pr-4">Total</th>
                        <th className="py-2 pr-4">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { id: "#10293", name: "Juan D.", method: "Dine-In", total: "₱540", status: "Completed" },
                        { id: "#10294", name: "Maria S.", method: "Takeout", total: "₱320", status: "Preparing" },
                        { id: "#10295", name: "Leo P.", method: "Dine-In", total: "₱680", status: "Completed" },
                        { id: "#10296", name: "Ana R.", method: "Takeout", total: "₱240", status: "Pending" },
                      ].map((r) => (
                        <tr key={r.id} className="border-b border-white/5">
                          <td className="py-2 pr-4">{r.id}</td>
                          <td className="py-2 pr-4">{r.name}</td>
                          <td className="py-2 pr-4">{r.method}</td>
                          <td className="py-2 pr-4">{r.total}</td>
                          <td className="py-2 pr-4">
                            <span className={`px-2 py-1 rounded-lg text-xs ${
                              r.status === "Completed" ? "bg-green-500/20 text-green-500" :
                              r.status === "Preparing" ? "bg-yellow-500/20 text-yellow-500" :
                              "bg-white/10"
                            }`}>{r.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
           </motion.div>
         </main>
       </div>
     </div>
   );
 }
