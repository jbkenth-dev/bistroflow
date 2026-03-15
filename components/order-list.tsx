"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useState } from "react";
import { IconArrowRight, IconClock, IconCart } from "@/components/ui/icons";
import { useAuth } from "@/store/auth";

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

interface Order {
  id: string;
  date: string; // ISO date string
  status: 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  total: number;
  items: OrderItem[];
  itemCount: number;
  itemsSummary: string;
}

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

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const oneDay = 24 * 60 * 60 * 1000;

  const timeOptions: Intl.DateTimeFormatOptions = { hour: 'numeric', minute: '2-digit' };
  
  if (diff < oneDay && now.getDate() === date.getDate()) {
    return `Today, ${date.toLocaleTimeString('en-US', timeOptions)}`;
  } else if (diff < 2 * oneDay && now.getDate() - date.getDate() === 1) {
    return `Yesterday, ${date.toLocaleTimeString('en-US', timeOptions)}`;
  } else {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', ...timeOptions });
  }
};

export function OrderList() {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      if (!user?.id) return;
      
      try {
        const res = await fetch(`http://localhost/bistroflow/bistroflow/php-backend/public/api/orders.php?userId=${user.id}&status=completed`);
        const data = await res.json();
        
        if (data.success && Array.isArray(data.data)) {
          const mappedOrders: Order[] = data.data.map((o: any) => ({
            id: `#${o.id}`,
            date: o.created_at,
            status: o.status,
            total: Number(o.total_amount),
            itemCount: o.item_count,
            itemsSummary: o.items_summary,
            items: o.items.map((i: any) => ({
              name: i.product_name,
              quantity: i.quantity,
              price: Number(i.price)
            }))
          }));
          setOrders(mappedOrders);
        } else {
          setError(data.message || "Failed to load orders");
        }
      } catch (err) {
        console.error(err);
        setError("Could not load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user]);

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm">
        <div className="space-y-4">
          <Skeleton className="w-40 h-7 mb-6" />
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="w-full h-24 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-3xl p-6 border border-red-100 shadow-sm text-center">
        <p className="text-red-500 mb-2">Something went wrong</p>
        <button 
          onClick={() => window.location.reload()} 
          className="text-sm font-medium text-primary hover:underline"
        >
          Try again
        </button>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <motion.div 
        variants={itemVariants} 
        initial="hidden" 
        animate="visible"
        className="bg-white rounded-3xl p-8 md:p-10 border border-gray-100 shadow-sm flex flex-col items-center justify-center text-center min-h-[400px]"
      >
        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4 text-gray-300">
          <IconCart className="w-10 h-10" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">No orders yet</h3>
        <p className="text-gray-500 max-w-xs mx-auto mb-8">
          Looks like you haven't placed any orders yet. Explore our menu and find something delicious!
        </p>
        <Link 
          href="/menu" 
          className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-primary text-white font-bold shadow-lg shadow-primary/25 hover:bg-primary/90 hover:scale-105 active:scale-95 transition-all duration-200"
          aria-label="View menu to place an order"
        >
          View Menu
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div 
      variants={itemVariants} 
      className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm"
      role="region"
      aria-label="Recent Orders"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">Recent Orders</h2>
        <Link 
          href="/orders" 
          className="text-sm text-primary hover:text-primary/80 transition-colors font-medium flex items-center gap-1"
          aria-label="View all orders"
        >
          View All <IconArrowRight className="w-3 h-3" />
        </Link>
      </div>

      <div className="space-y-4" role="list">
        {orders.map((order) => (
          <div 
            key={order.id} 
            className="group flex flex-col sm:flex-row items-start gap-4 p-4 rounded-2xl border border-gray-100 bg-white hover:border-primary/20 hover:shadow-md transition-all cursor-pointer relative overflow-hidden"
            role="listitem"
            tabIndex={0}
            aria-label={`Order ${order.id}, status ${order.status}, total ${order.total} pesos`}
          >
            <div className="w-full sm:w-20 h-20 shrink-0 rounded-xl overflow-hidden bg-gray-100 border border-gray-100 flex items-center justify-center text-gray-300">
               {/* Placeholder for order image since we don't have per-order images in the interface yet */}
               <IconCart className="w-8 h-8" />
            </div>

            <div className="flex-1 min-w-0 w-full">
              <div className="flex items-center justify-between mb-1">
                <span className="font-bold text-gray-900 text-sm">{order.id}</span>
                <span className={`
                  inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border
                  ${order.status === "completed" ? "bg-green-50 text-green-700 border-green-200" :
                    order.status === "cancelled" ? "bg-red-50 text-red-700 border-red-200" : "bg-gray-50 text-gray-600 border-gray-200"}
                `}>
                  {order.status}
                </span>
              </div>

              <h4 className="text-sm font-medium text-gray-800 line-clamp-1 mb-1">{order.itemsSummary}</h4>

              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <IconClock className="w-3 h-3" />
                  {formatDate(order.date)}
                </span>
                <span className="font-bold text-primary text-sm">₱{order.total.toLocaleString()}</span>
              </div>
            </div>

            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          </div>
        ))}
      </div>
    </motion.div>
  );
}
