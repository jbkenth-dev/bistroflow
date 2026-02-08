 "use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { IconCart, IconList, IconUsers, IconChart, IconSettings } from "@/components/ui/icons";

function SectionShell({ title, icon: Icon }: { title: string; icon: React.ComponentType<React.SVGProps<SVGSVGElement>> }) {
   const [loading, setLoading] = useState(true);
   useEffect(() => {
     const t = setTimeout(() => setLoading(false), 900);
     return () => clearTimeout(t);
   }, []);

   return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }} className="glass rounded-2xl p-6 border border-white/10">
      <div className="flex items-center gap-3">
        <span className="glass rounded-lg p-3"><Icon className="w-5 h-5" /></span>
        <h1 className="font-semibold text-lg">{title}</h1>
      </div>
         {loading ? (
           <div className="mt-6 space-y-3">
             {Array.from({ length: 6 }).map((_, i) => (
               <motion.div
                 key={i}
                 initial={{ backgroundPosition: "0% 0%" }}
                 animate={{ backgroundPosition: "100% 0%" }}
                 transition={{ repeat: Infinity, duration: 1.6, ease: "linear" }}
                 className="h-10 rounded-xl"
                 style={{
                   backgroundImage:
                     "linear-gradient(90deg, rgba(255,255,255,0.06) 25%, rgba(255,255,255,0.25) 37%, rgba(255,255,255,0.06) 63%)",
                   backgroundSize: "400% 100%",
                 }}
               />
             ))}
        </div>
      ) : (
        <div className="mt-6">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="glass rounded-xl p-4 border border-white/10">
              <div className="font-medium">Summary</div>
              <div className="mt-2 text-sm opacity-70">This section will show live data when connected.</div>
            </div>
            <div className="glass rounded-xl p-4 border border-white/10">
              <div className="font-medium">Activity</div>
              <div className="mt-2 text-sm opacity-70">Recent items and actions appear here.</div>
            </div>
          </div>
          <div className="mt-6 glass rounded-xl p-4 border border-white/10">
            <div className="font-medium">List</div>
            <div className="mt-3 overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="py-2 pr-4">Name</th>
                    <th className="py-2 pr-4">Status</th>
                    <th className="py-2 pr-4">Updated</th>
                  </tr>
                </thead>
                <tbody>
                  {["Item A", "Item B", "Item C", "Item D"].map((n, i) => (
                    <tr key={n} className="border-b border-white/5">
                      <td className="py-2 pr-4">{n}</td>
                      <td className="py-2 pr-4">
                        <span className={`px-2 py-1 rounded-lg text-xs ${i % 2 === 0 ? "bg-green-500/20 text-green-500" : "bg-white/10"}`}>{i % 2 === 0 ? "Active" : "Draft"}</span>
                      </td>
                      <td className="py-2 pr-4">Today</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </motion.div>
   );
 }

 export function OrdersClient() {
   return <SectionShell title="Orders" icon={IconCart} />;
 }
 export function MenuClient() {
   return <SectionShell title="Menu" icon={IconList} />;
 }
 export function StaffClient() {
   return <SectionShell title="Staff" icon={IconUsers} />;
 }
 export function AnalyticsClient() {
   return <SectionShell title="Analytics" icon={IconChart} />;
 }
 export function SettingsClient() {
   return <SectionShell title="Settings" icon={IconSettings} />;
 }
