"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  IconChart, IconArrowRight, IconPeso, IconCalendar,
  IconDownload, IconCheck, IconClock, IconAlertCircle
} from "@/components/ui/icons";
import ContentLoader from "react-content-loader";
import { getSummaryStats, getRecentCompletedOrders } from "@/data/mock-orders";

export function AdminReportsClient() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any[]>([]);
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [dateRange, setDateRange] = useState("Last 30 Days");
  const [isDateRangeOpen, setIsDateRangeOpen] = useState(false);

  useEffect(() => {
    // Simulate API fetch
    const timer = setTimeout(() => {
      const summary = getSummaryStats();
      const orders = getRecentCompletedOrders(10);

      setStats([
        { label: "Total Revenue", value: `₱${summary.totalRevenue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, change: "+12.5%", trend: "up", icon: IconPeso },
        { label: "Total Orders", value: summary.totalOrders.toLocaleString(), change: "+8.2%", trend: "up", icon: IconChart },
        { label: "Avg. Order Value", value: `₱${summary.avgOrderValue.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}`, change: "-2.1%", trend: "down", icon: IconChart },
      ]);
      setRecentOrders(orders);
      setLoading(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl font-bold text-foreground">Reports</h1>
          <p className="text-muted-foreground mt-1">Detailed insights into your business performance.</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <button
              onClick={() => setIsDateRangeOpen(!isDateRangeOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors shadow-sm w-48 justify-between"
            >
              <div className="flex items-center gap-2">
                <IconCalendar className="w-4 h-4 text-gray-500" />
                <span>{dateRange}</span>
              </div>
              <svg className={`w-4 h-4 text-gray-400 transition-transform ${isDateRangeOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isDateRangeOpen && (
              <>
                <div
                  className="fixed inset-0 z-10"
                  onClick={() => setIsDateRangeOpen(false)}
                />
                <div className="absolute top-full mt-2 left-0 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg z-20 overflow-hidden">
                  {["Today", "Last 7 Days", "Last 30 Days", "This Month", "Last Month", "Custom Range"].map((range) => (
                    <button
                      key={range}
                      onClick={() => {
                        setDateRange(range);
                        setIsDateRangeOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-sm hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-between ${
                        dateRange === range ? 'bg-primary/5 text-primary font-medium' : 'text-gray-700 dark:text-gray-300'
                      }`}
                    >
                      {range}
                      {dateRange === range && <IconCheck className="w-4 h-4" />}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:bg-primary/90 transition-colors shadow-lg shadow-primary/25">
            <IconDownload className="w-4 h-4" />
            <span>Export Data</span>
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          Array(3).fill(0).map((_, i) => (
             <div key={i} className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm">
              <ContentLoader
                speed={2}
                width={200}
                height={80}
                viewBox="0 0 200 80"
                backgroundColor="#f3f3f3"
                foregroundColor="#ecebeb"
                className="dark:opacity-10"
              >
                <circle cx="20" cy="20" r="20" />
                <rect x="50" y="10" rx="4" ry="4" width="100" height="10" />
                <rect x="50" y="30" rx="4" ry="4" width="80" height="8" />
                <rect x="0" y="60" rx="4" ry="4" width="120" height="16" />
              </ContentLoader>
             </div>
          ))
        ) : (
          stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white dark:bg-gray-900 p-6 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div className={`p-3 rounded-xl ${
                  stat.trend === "up" ? "bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400" :
                  stat.trend === "down" ? "bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400" :
                  "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                }`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${
                  stat.trend === "up" ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300" :
                  stat.trend === "down" ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300" :
                  "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
                }`}>
                  {stat.change}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">{stat.label}</p>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{stat.value}</h3>
              </div>
            </motion.div>
          ))
        )}
      </div>



      {/* Recent Completed Orders Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-100 dark:border-gray-800 shadow-sm overflow-hidden"
      >
        <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Recent Completed Orders</h2>
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Search orders..."
              className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 w-full sm:w-64"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50/50 dark:bg-gray-800/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Order ID</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Items</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {loading ? (
                // Table Skeleton
                Array(5).fill(0).map((_, i) => (
                  <tr key={i}>
                    <td className="px-6 py-4"><div className="h-4 w-24 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" /></td>
                    <td className="px-6 py-4"><div className="h-4 w-32 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" /></td>
                    <td className="px-6 py-4"><div className="h-4 w-24 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" /></td>
                    <td className="px-6 py-4"><div className="h-4 w-48 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" /></td>
                    <td className="px-6 py-4"><div className="h-4 w-20 bg-gray-200 dark:bg-gray-800 rounded animate-pulse" /></td>
                    <td className="px-6 py-4"><div className="h-6 w-24 bg-gray-200 dark:bg-gray-800 rounded-full animate-pulse" /></td>
                    <td className="px-6 py-4"><div className="h-8 w-8 bg-gray-200 dark:bg-gray-800 rounded-lg ml-auto animate-pulse" /></td>
                  </tr>
                ))
              ) : (
                recentOrders.map((order) => (
                  <tr key={order.id} className="group hover:bg-gray-50/50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      {order.id}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.customer}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {order.formattedDate}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate" title={order.itemsSummary}>
                      <span className="font-medium text-gray-900 dark:text-white mr-1">{order.itemCount} items:</span>
                      {order.itemsSummary}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900 dark:text-white">
                      ₱{order.total.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-900/30">
                        <IconCheck className="w-3 h-3" />
                        Completed
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-primary hover:text-primary/80 transition-colors p-2 hover:bg-primary/10 rounded-lg">
                        <IconDownload className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
          <div className="text-sm text-gray-500">
            Showing <span className="font-medium text-gray-900 dark:text-white">1</span> to <span className="font-medium text-gray-900 dark:text-white">5</span> of <span className="font-medium text-gray-900 dark:text-white">12</span> results
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1 border border-gray-200 dark:border-gray-700 rounded-lg text-sm text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-50">
              Previous
            </button>
            <button className="px-3 py-1 bg-primary text-white rounded-lg text-sm hover:bg-primary/90">
              Next
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
