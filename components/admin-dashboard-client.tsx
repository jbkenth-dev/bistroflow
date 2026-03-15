"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { IconCart, IconPeso, IconDineIn, IconTakeout, IconCash, IconChart } from "@/components/ui/icons";
import { SalesChart } from "@/components/ui/sales-chart";
import { useAuth } from "@/store/auth";

export function AdminDashboardClient() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    // If user is not authenticated, redirect to login
    if (!isAuthenticated) {
      router.push("/admin/login");
      return;
    }

    // If user is not admin, redirect to login
    if (user?.role !== 'admin') {
      router.push("/admin/login");
      return;
    }

    // Simulate loading data
    const t = setTimeout(() => {
        setLoading(false);
    }, 1000);

    return () => clearTimeout(t);
  }, [isAuthenticated, user, router]);

  const kpis = [
    { label: "Total Revenue", value: "₱128,940", icon: IconPeso, sub: "+8.4% from last week", trend: "up" },
    { label: "Total Orders", value: "1,284", icon: IconCart, sub: "+3.1% from last week", trend: "up" },
    { label: "Average Order", value: "₱100.40", icon: IconCash, sub: "+1.2% from last week", trend: "up" },
    { label: "Dine-In vs Takeout", value: "62% / 38%", icon: IconDineIn, sub: "Balanced traffic", trend: "neutral" },
  ];

  const salesData = [12500, 15000, 11000, 18000, 22000, 26000, 24500];
  const salesLabels = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Dashboard</h1>
          <p className="text-muted-foreground text-sm">Overview of your restaurant's performance.</p>
        </div>
        <div className="flex items-center gap-2">
           <select className="bg-card border border-border rounded-lg text-sm px-3 py-2 outline-none focus:ring-2 focus:ring-primary/20">
             <option>Last 7 days</option>
             <option>Last 30 days</option>
             <option>This Month</option>
             <option>This Year</option>
           </select>

        </div>
      </div>

      {/* KPI Cards */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4"
      >
        {(loading ? Array.from({ length: 4 }) : kpis).map((k: any, i: number) => {
          if (loading) {
            return (
              <div key={`sk-${i}`} className="bg-card border border-border rounded-xl p-6 shadow-sm">
                <div className="animate-pulse space-y-4">
                  <div className="h-4 w-24 bg-muted rounded"></div>
                  <div className="h-8 w-32 bg-muted rounded"></div>
                  <div className="h-4 w-full bg-muted rounded"></div>
                </div>
              </div>
            );
          }
          const I = k.icon;
          return (
            <motion.div
              key={k.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-card border border-border rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow group"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{k.label}</p>
                  <h3 className="text-2xl font-bold mt-2 text-foreground">{k.value}</h3>
                </div>
                <div className="p-3 bg-primary/10 rounded-xl text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <I className="w-5 h-5" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-xs">
                <span className={`font-medium ${k.trend === 'up' ? 'text-green-600' : 'text-muted-foreground'}`}>
                  {k.sub}
                </span>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-12 gap-6">
        {/* Sales Trend Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="lg:col-span-8 bg-card border border-border rounded-xl p-6 shadow-sm"
        >
          {loading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-6 w-32 bg-muted rounded"></div>
              <div className="h-64 w-full bg-muted rounded"></div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="font-semibold text-lg text-foreground flex items-center gap-2">
                    <IconChart className="w-5 h-5 text-primary" />
                    Sales Overview
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">Daily revenue performance</p>
                </div>
                <div className="flex items-center gap-2">
                   <div className="flex items-center gap-1.5 text-xs font-medium bg-green-500/10 text-green-600 px-2.5 py-1 rounded-full border border-green-500/20">
                     <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></span>
                     +12.5% vs last week
                   </div>
                </div>
              </div>
              <div className="h-80 w-full relative">
                <SalesChart
                  data={salesData}
                  labels={salesLabels}
                  color="#f97316"
                  currency="₱"
                />
              </div>
            </>
          )}
        </motion.div>

        {/* Top Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          className="lg:col-span-4 bg-card border border-border rounded-xl p-6 shadow-sm"
        >
           {loading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-6 w-32 bg-muted rounded"></div>
              <div className="h-48 w-full bg-muted rounded"></div>
            </div>
          ) : (
            <>
              <h3 className="font-semibold text-lg mb-6 text-foreground">Order Type</h3>
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-500">
                         <IconDineIn className="w-4 h-4" />
                      </div>
                      <span className="font-medium">Dine-In</span>
                    </div>
                    <span className="font-bold">62%</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: "62%" }}></div>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded-lg bg-orange-500/10 text-orange-500">
                         <IconTakeout className="w-4 h-4" />
                      </div>
                      <span className="font-medium">Takeout</span>
                    </div>
                    <span className="font-bold">38%</span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div className="h-full bg-orange-500 rounded-full" style={{ width: "38%" }}></div>
                  </div>
                </div>
              </div>
            </>
          )}
        </motion.div>
      </div>

      {/* Recent Orders Table (Placeholder for now, can be expanded) */}
      <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          className="bg-card border border-border rounded-xl shadow-sm overflow-hidden"
      >
        <div className="p-6 border-b border-border">
          <h3 className="font-semibold text-lg text-foreground">Recent Orders</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50">
              <tr>
                <th className="px-6 py-3">Order ID</th>
                <th className="px-6 py-3">Customer</th>
                <th className="px-6 py-3">Status</th>
                <th className="px-6 py-3">Amount</th>
                <th className="px-6 py-3">Date</th>
              </tr>
            </thead>
            <tbody>
              {[
                { id: "#ORD-001", customer: "John Doe", status: "Completed", amount: "₱450.00", date: "Today, 10:30 AM" },
                { id: "#ORD-002", customer: "Jane Smith", status: "Preparing", amount: "₱1,200.00", date: "Today, 10:45 AM" },
                { id: "#ORD-003", customer: "Mike Johnson", status: "Pending", amount: "₱850.00", date: "Today, 11:00 AM" },
              ].map((order, i) => (
                <tr key={i} className="border-b border-border hover:bg-muted/5">
                  <td className="px-6 py-4 font-medium">{order.id}</td>
                  <td className="px-6 py-4">{order.customer}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      order.status === 'Completed' ? 'bg-green-100 text-green-700' :
                      order.status === 'Preparing' ? 'bg-blue-100 text-blue-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">{order.amount}</td>
                  <td className="px-6 py-4 text-muted-foreground">{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
