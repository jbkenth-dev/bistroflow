import { foods, FoodItem } from "./foods";

export interface Order {
  id: string;
  date: string; // ISO date string
  items: { item: FoodItem; qty: number }[];
  total: number;
  status: "completed" | "pending" | "cancelled" | "preparing";
  customer: string;
}

// Generate consistent mock data seeded by date or just random but consistent for the session
const generateOrders = (): Order[] => {
  const orders: Order[] = [];
  const now = new Date();
  const oneYearAgo = new Date(now.getFullYear() - 1, now.getMonth(), now.getDate());

  // Generate ~1000 orders over the last year
  for (let i = 0; i < 1000; i++) {
    // Random date between oneYearAgo and now
    const date = new Date(oneYearAgo.getTime() + Math.random() * (now.getTime() - oneYearAgo.getTime()));
    
    // Random items
    const numItems = Math.floor(Math.random() * 5) + 1;
    const orderItems = [];
    let orderTotal = 0;

    for (let j = 0; j < numItems; j++) {
      const randomFood = foods[Math.floor(Math.random() * foods.length)];
      const qty = Math.floor(Math.random() * 2) + 1;
      orderItems.push({ item: randomFood, qty });
      orderTotal += randomFood.price * qty;
    }

    orders.push({
      id: `ORD-${10000 + i}`,
      date: date.toISOString(),
      items: orderItems,
      total: parseFloat(orderTotal.toFixed(2)),
      status: Math.random() > 0.1 ? "completed" : (Math.random() > 0.5 ? "pending" : "cancelled"),
      customer: `Customer ${i}`
    });
  }

  // Sort by date desc
  return orders.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const MOCK_ORDERS = generateOrders();

export const getRevenueByMonth = () => {
  const revenueByMonth: Record<string, number> = {};
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

  MOCK_ORDERS.forEach(order => {
    if (order.status !== "completed") return;
    const d = new Date(order.date);
    const month = months[d.getMonth()];
    // For simplicity, let's just aggregate by month name (ignoring year boundaries for this simple chart if spanning < 1 year, but we span 1 year so it might overlap. Let's assume current year for simplicity or handle strictly)
    // Actually, let's just show last 12 months.
    const key = `${month}`;
    revenueByMonth[key] = (revenueByMonth[key] || 0) + order.total;
  });

  // Return array for chart
  return months.map(m => ({
    month: m,
    value: revenueByMonth[m] || 0
  }));
};

export const getSummaryStats = () => {
  const completedOrders = MOCK_ORDERS.filter(o => o.status === "completed");
  const totalRevenue = completedOrders.reduce((sum, o) => sum + o.total, 0);
  const totalOrders = MOCK_ORDERS.length;
  const avgOrderValue = totalRevenue / (completedOrders.length || 1);
  const pendingCount = MOCK_ORDERS.filter(o => o.status === "pending").length;

  return {
    totalRevenue,
    totalOrders,
    avgOrderValue,
    pendingCount
  };
};

export const getRecentCompletedOrders = (limit: number = 10) => {
  return MOCK_ORDERS
    .filter(order => order.status === "completed")
    .slice(0, limit)
    .map(order => ({
      ...order,
      formattedDate: new Date(order.date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      itemCount: order.items.reduce((acc, item) => acc + item.qty, 0),
      itemsSummary: order.items.map(i => `${i.qty}x ${i.item.name}`).join(", ")
    }));
};
