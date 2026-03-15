"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  IconSearch, IconFilter, IconChevronLeft, IconChevronRight,
  IconCheck, IconClock, IconX, IconLoader
} from "@/components/ui/icons";

// Types
interface OrderItem {
  product_name: string;
  quantity: number;
  price: number;
  image_url: string | null;
}

interface Order {
  id: number;
  customer_name: string;
  email: string;
  status: 'pending' | 'preparing' | 'ready' | 'completed' | 'cancelled';
  total_amount: number; // string from PHP decimal
  payment_method: 'cash' | 'gcash';
  created_at: string;
  items_summary: string;
  item_count: number;
  items: OrderItem[];
}

interface Pagination {
  current_page: number;
  total_pages: number;
  total_records: number;
  limit: number;
}

const statusColors = {
  pending: "bg-orange-100 text-orange-700 border-orange-200",
  preparing: "bg-blue-100 text-blue-700 border-blue-200",
  ready: "bg-green-100 text-green-700 border-green-200",
  completed: "bg-gray-100 text-gray-700 border-gray-200",
  cancelled: "bg-red-100 text-red-700 border-red-200",
};

const statusLabels = {
  pending: "Pending",
  preparing: "Preparing",
  ready: "Ready",
  completed: "Completed",
  cancelled: "Cancelled",
};

export function StaffOrdersClient() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<Pagination | null>(null);

  // Filters
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Debounce search
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(searchQuery), 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch Orders
  const fetchOrders = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: "10",
        status: statusFilter,
        search: debouncedSearch,
      });

      const res = await fetch(`http://localhost/bistroflow/bistroflow/php-backend/public/api/staff/orders.php?${params}`);
      const data = await res.json();

      if (data.success) {
        setOrders(data.data);
        setPagination(data.pagination);
      } else {
        console.error("Failed to fetch orders:", data.message);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [currentPage, statusFilter, debouncedSearch]);

  // Handle Status Update
  const updateStatus = async (orderId: number, newStatus: string) => {
    // Optimistic update could be done here, but let's stick to safe update
    try {
      const res = await fetch("http://localhost/bistroflow/bistroflow/php-backend/public/api/staff/update-order-status.php", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ order_id: orderId, status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        // Refresh list or update locally
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus as any } : o));
      } else {
        alert("Failed to update status: " + data.message);
      }
    } catch (error) {
      alert("Error updating status");
    }
  };

  // Helper for Image URLs
  const getFullImageUrl = (path: string | null) => {
    if (!path) return undefined;
    if (path.startsWith('http')) return path;
    return `http://localhost${path}`;
  };

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900">Order Management</h1>
          <p className="text-gray-500 mt-1">Track and manage customer orders in real-time.</p>
        </div>

        {/* Search */}
        <div className="relative w-full md:w-72">
          <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search order ID or customer..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-2 border-b border-gray-200 pb-1">
        {["all", "pending", "preparing", "ready", "completed", "cancelled"].map((status) => (
          <button
            key={status}
            onClick={() => { setStatusFilter(status); setCurrentPage(1); }}
            className={`px-4 py-2 text-sm font-medium rounded-t-lg border-b-2 transition-colors ${
              statusFilter === status
                ? "border-primary text-primary bg-primary/5"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`}
          >
            {status === "all" ? "All Orders" : status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="min-h-[400px]">
        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm animate-pulse">
                <div className="flex justify-between mb-4">
                  <div className="h-6 w-32 bg-gray-200 rounded"></div>
                  <div className="h-6 w-24 bg-gray-200 rounded-full"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 w-3/4 bg-gray-200 rounded"></div>
                  <div className="h-4 w-1/2 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center p-8 bg-white border border-gray-200 rounded-xl border-dashed">
            <div className="p-4 bg-gray-50 rounded-full mb-4">
              <IconFilter className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">No orders found</h3>
            <p className="text-gray-500 max-w-xs mt-1">
              Try adjusting your search or filters to find what you're looking for.
            </p>
            {statusFilter !== "all" && (
              <button
                onClick={() => setStatusFilter("all")}
                className="mt-4 text-primary font-medium hover:underline"
              >
                Clear filters
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence mode="popLayout">
              {orders.map((order) => (
                <motion.div
                  key={order.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                >
                  <div className="p-6">
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                      {/* Left: Order Info */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <span className="font-mono text-lg font-bold text-gray-900">#{order.id}</span>
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusColors[order.status]}`}>
                            {statusLabels[order.status]}
                          </span>
                          <span className="text-sm text-gray-500 flex items-center gap-1">
                            <IconClock className="w-3 h-3" />
                            {new Date(order.created_at).toLocaleString()}
                          </span>
                        </div>

                        <div className="mb-4">
                          <h3 className="font-medium text-gray-900">{order.customer_name}</h3>
                          <p className="text-sm text-gray-500">{order.email}</p>
                          {order.table_number && (
                            <p className="text-sm text-gray-500 mt-1">Table: {order.table_number}</p>
                          )}
                        </div>

                        <div className="bg-gray-50 rounded-lg p-3 border border-gray-100">
                          <p className="text-sm font-medium text-gray-700 mb-2">Items ({order.item_count})</p>
                          <div className="space-y-2">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex justify-between text-sm items-center">
                                <div className="flex items-center gap-2">
                                  {item.image_url && (
                                    <div className="w-8 h-8 rounded bg-gray-200 overflow-hidden shrink-0">
                                      <img
                                        src={getFullImageUrl(item.image_url)}
                                        alt={item.product_name}
                                        className="w-full h-full object-cover"
                                      />
                                    </div>
                                  )}
                                  <span className="text-gray-600">
                                    <span className="font-semibold text-gray-900">{item.quantity}x</span> {item.product_name}
                                  </span>
                                </div>
                                <span className="text-gray-500">₱{Number(item.price).toFixed(2)}</span>
                              </div>
                            ))}
                          </div>
                          <div className="mt-3 pt-2 border-t border-gray-200 flex justify-between items-center">
                            <span className="font-semibold text-gray-900">Total</span>
                            <div className="flex flex-col items-end">
                              <span className="font-bold text-lg text-primary">₱{Number(order.total_amount).toFixed(2)}</span>
                              <div className="flex items-center gap-1.5 mt-1">
                                <span className="text-xs text-gray-500 capitalize">{order.payment_method}</span>
                                <span className={`w-2 h-2 rounded-full ${order.payment_method === 'cash' ? 'bg-green-500' : 'bg-blue-500'}`}></span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex md:flex-col gap-2 md:w-48 shrink-0">
                        <p className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-1 hidden md:block">Actions</p>

                        {order.status === 'pending' && (
                          <button
                            onClick={() => updateStatus(order.id, 'preparing')}
                            className="w-full py-2 px-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                          >
                            <IconLoader className="w-4 h-4" /> Start Preparing
                          </button>
                        )}

                        {order.status === 'preparing' && (
                          <button
                            onClick={() => updateStatus(order.id, 'ready')}
                            className="w-full py-2 px-3 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                          >
                            <IconCheck className="w-4 h-4" /> Mark Ready
                          </button>
                        )}

                        {order.status === 'ready' && (
                          <button
                            onClick={() => updateStatus(order.id, 'completed')}
                            className="w-full py-2 px-3 bg-gray-800 hover:bg-gray-900 text-white rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                          >
                            <IconCheck className="w-4 h-4" /> Complete Order
                          </button>
                        )}

                        {['pending', 'preparing'].includes(order.status) && (
                          <button
                            onClick={() => {
                              if (confirm('Are you sure you want to cancel this order?')) {
                                updateStatus(order.id, 'cancelled');
                              }
                            }}
                            className="w-full py-2 px-3 bg-white border border-red-200 text-red-600 hover:bg-red-50 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
                          >
                            <IconX className="w-4 h-4" /> Cancel Order
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.total_pages > 1 && (
        <div className="flex items-center justify-between border-t border-gray-200 pt-4">
          <p className="text-sm text-gray-500">
            Showing <span className="font-medium">{((pagination.current_page - 1) * pagination.limit) + 1}</span> to <span className="font-medium">{Math.min(pagination.current_page * pagination.limit, pagination.total_records)}</span> of <span className="font-medium">{pagination.total_records}</span> results
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={pagination.current_page === 1}
              className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <IconChevronLeft className="w-5 h-5" />
            </button>
            <span className="text-sm font-medium text-gray-900">
              Page {pagination.current_page} of {pagination.total_pages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(pagination.total_pages, p + 1))}
              disabled={pagination.current_page === pagination.total_pages}
              className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <IconChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
