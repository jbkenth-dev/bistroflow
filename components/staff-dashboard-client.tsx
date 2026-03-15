"use client";

import { motion } from "framer-motion";
import { 
  IconCart, IconCheck, IconClock, IconUsers 
} from "@/components/ui/icons";

export function StaffDashboardClient() {
  const stats = [
    { label: "Active Orders", value: "12", icon: IconCart, color: "text-blue-600", bg: "bg-blue-100" },
    { label: "Completed Today", value: "48", icon: IconCheck, color: "text-green-600", bg: "bg-green-100" },
    { label: "Pending Items", value: "5", icon: IconClock, color: "text-orange-600", bg: "bg-orange-100" },
    { label: "Staff Online", value: "3", icon: IconUsers, color: "text-purple-600", bg: "bg-purple-100" },
  ];

  const recentOrders = [
    { id: "#1023", table: "Table 4", items: "2x Burger, 1x Fries", status: "preparing", time: "5 mins ago" },
    { id: "#1024", table: "Table 1", items: "1x Pasta Carbonara", status: "ready", time: "12 mins ago" },
    { id: "#1025", table: "Takeout", items: "3x Pizza", status: "pending", time: "2 mins ago" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's what's happening right now.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-card border border-border p-4 rounded-xl shadow-sm flex items-center justify-between"
          >
            <div>
              <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
              <p className="text-2xl font-bold text-foreground mt-1">{stat.value}</p>
            </div>
            <div className={`p-3 rounded-lg ${stat.bg} ${stat.color}`}>
              <stat.icon className="w-6 h-6" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Recent Activity / Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders List */}
        <div className="lg:col-span-2 bg-card border border-border rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 border-b border-border flex items-center justify-between">
            <h2 className="font-semibold text-foreground">Recent Orders</h2>
            <button className="text-sm text-primary hover:underline">View All</button>
          </div>
          <div className="divide-y divide-border">
            {recentOrders.map((order) => (
              <div key={order.id} className="p-4 flex items-center justify-between hover:bg-muted/50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs
                    ${order.status === 'ready' ? 'bg-green-100 text-green-700' : 
                      order.status === 'preparing' ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'}`}>
                    {order.table.substring(0, 1)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{order.table} <span className="text-muted-foreground mx-1">•</span> {order.id}</p>
                    <p className="text-xs text-muted-foreground">{order.items}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                    ${order.status === 'ready' ? 'bg-green-50 text-green-700 border border-green-100' : 
                      order.status === 'preparing' ? 'bg-blue-50 text-blue-700 border border-blue-100' : 'bg-orange-50 text-orange-700 border border-orange-100'}`}>
                    {order.status}
                  </span>
                  <p className="text-xs text-muted-foreground mt-1">{order.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="space-y-6">
           <div className="bg-gradient-to-br from-primary to-orange-600 rounded-xl p-6 text-white shadow-lg">
              <h3 className="font-bold text-lg mb-2">Quick Actions</h3>
              <div className="space-y-3">
                 <button className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/10 text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors flex items-center gap-3">
                    <IconCart className="w-5 h-5" /> New Order
                 </button>
                 <button className="w-full bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/10 text-left px-4 py-3 rounded-lg text-sm font-medium transition-colors flex items-center gap-3">
                    <IconCheck className="w-5 h-5" /> Mark Order Ready
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
