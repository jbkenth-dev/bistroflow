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
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">{title}</h1>
          <p className="text-muted-foreground text-sm">Manage your {title.toLowerCase()} here.</p>
        </div>
        <div className="p-2 bg-primary/10 rounded-lg text-primary">
          <Icon className="w-6 h-6" />
        </div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 10 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.4 }} 
        className="bg-card border border-border rounded-xl shadow-sm overflow-hidden"
      >
        {loading ? (
          <div className="p-6 space-y-4">
            <div className="h-8 w-1/3 bg-muted rounded animate-pulse"></div>
            <div className="h-4 w-1/4 bg-muted rounded animate-pulse"></div>
            <div className="space-y-2 mt-8">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-12 w-full bg-muted rounded animate-pulse"></div>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-6">
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="bg-muted/30 border border-border rounded-xl p-4">
                <h3 className="font-semibold text-foreground">Summary</h3>
                <p className="mt-2 text-sm text-muted-foreground">This section will show live data when connected.</p>
              </div>
              <div className="bg-muted/30 border border-border rounded-xl p-4">
                <h3 className="font-semibold text-foreground">Activity</h3>
                <p className="mt-2 text-sm text-muted-foreground">Recent items and actions appear here.</p>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-4 text-foreground">List View</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
                    <tr>
                      <th className="px-6 py-3 rounded-l-lg">Name</th>
                      <th className="px-6 py-3">Status</th>
                      <th className="px-6 py-3 rounded-r-lg">Updated</th>
                    </tr>
                  </thead>
                  <tbody>
                    {["Item A", "Item B", "Item C", "Item D"].map((n, i) => (
                      <tr key={n} className="border-b border-border last:border-0 hover:bg-muted/5 transition-colors">
                        <td className="px-6 py-4 font-medium text-foreground">{n}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            i % 2 === 0 
                              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" 
                              : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                          }`}>
                            {i % 2 === 0 ? "Active" : "Draft"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-muted-foreground">Today</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
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
