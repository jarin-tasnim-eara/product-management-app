"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { orderService } from "@/services/orderService";
import { productService } from "@/services/productService";
import { formatBDT } from "@/lib/formatPrice";
import { showError, showSuccess } from "@/lib/alerts";
import { FaExclamationTriangle } from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  CartesianGrid,
} from "recharts";

const PIE_COLORS = ["#FF9800", "#8BC34A", "#D50000", "#FFD54F", "#00ACC1", "#3F51B5"];

const STATUS_OPTIONS = ["pending", "shipped", "delivered"];
const STATUS_STYLES = {
  pending: "bg-[#C9962B]/15 text-[#C9962B]",
  shipped: "bg-[#3B6EA5]/15 text-[#3B6EA5]",
  delivered: "bg-[#6E7A52]/15 text-[#6E7A52]",
};

const LOW_STOCK_THRESHOLD = 10;

function stockColor(stock) {
  if (stock < 10) return "#E53935";
  if (stock < 20) return "#FB8C00";
  if (stock < 30) return "#FDD835";
  if (stock < 40) return "#43A047";
  if (stock < 50) return "#3F51B5";

  return "#00E676";
}

export default function SellerDashboardPage() {
  const { user } = useSelector((state) => state.auth);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) return;
    Promise.all([
      orderService.getOrdersForSeller(user.email),
      productService.getSellerProducts(user.email),
    ]).then(([ordersData, productsData]) => {
      setOrders(ordersData);
      setProducts(productsData);
      setLoading(false);
    });
  }, [user]);

  if (loading) {
    return <p className="text-[#1B2430]/50">Loading dashboard...</p>;
  }

  const myItems = orders.flatMap((o) =>
    (o.items || [])
      .filter((it) => it.sellerEmail === user.email)
      .map((it) => ({ ...it, orderId: o.id, createdAt: o.createdAt, status: it.status || "pending" }))
  );

  async function handleStatusChange(orderId, newStatus) {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );
    try {
      await orderService.updateOrderStatus(orderId, newStatus, user.email);
      showSuccess("Status updated.");
    } catch (err) {
      showError("Could not update status. Please try again.");
      return;
    }

    try {
      const freshProducts = await productService.getSellerProducts(user.email);
      setProducts(freshProducts);
    } catch (err) {
      console.warn("Could not refresh products after status change:", err);
    }
  }

  const totalSales = myItems.reduce((sum, it) => sum + it.price * it.quantity, 0);
  const totalOrders = new Set(myItems.map((it) => it.orderId)).size;
  const totalStock = products.reduce(
    (sum, p) => sum + (Number(p.data?.stock) || 0),
    0
  );

  const lowStockProducts = products.filter(
    (p) => (Number(p.data?.stock) || 0) < LOW_STOCK_THRESHOLD
  );

  const last7Days = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().slice(0, 10);
  });
  const salesByDay = last7Days.map((day) => ({
    day: day.slice(5),
    sales: myItems
      .filter((it) => it.createdAt?.slice(0, 10) === day)
      .reduce((s, it) => s + it.price * it.quantity, 0),
  }));

  const categoryCount = {};
  products.forEach((p) => {
    const cat = p.data?.category || "Other";
    categoryCount[cat] = (categoryCount[cat] || 0) + 1;
  });
  const categoryData = Object.entries(categoryCount).map(([name, value]) => ({
    name,
    value,
  }));

  const stockData = products
    .map((p) => ({ name: p.name, stock: Number(p.data?.stock) || 0 }))
    .sort((a, b) => a.stock - b.stock)
    .slice(0, 8);

  const recentOrders = [...myItems]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 8);

  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-[#6E7A52] font-semibold mb-1">
        Overview
      </p>
      <h1 className="text-2xl font-bold text-[#1B2430] mb-6">Dashboard</h1>

      {lowStockProducts.length > 0 && (
        <div className="flex items-start gap-3 bg-[#E53935]/10 border border-[#E53935]/30 rounded-xl p-4 mb-6">
          <FaExclamationTriangle className="text-[#E53935] mt-0.5 shrink-0" size={16} />
          <div>
            <p className="text-sm font-semibold text-[#E53935] mb-1">
              {lowStockProducts.length} product{lowStockProducts.length > 1 ? "s are" : " is"} running low on stock
            </p>
            <p className="text-xs text-[#1B2430]/70">
              {lowStockProducts.map((p) => `${p.name} (${p.data?.stock ?? 0})`).join(", ")}
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-[#1B2430]/10 p-5 border-l-4 border-l-[#6E7A52]">
          <p className="text-xs text-[#1B2430]/50 mb-1">Total Sales</p>
          <p className="text-2xl font-bold text-[#1B2430]">
            {formatBDT(totalSales)}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-[#1B2430]/10 p-5 border-l-4 border-l-[#94AC8D]">
          <p className="text-xs text-[#1B2430]/50 mb-1">Total Orders</p>
          <p className="text-2xl font-bold text-[#1B2430]">{totalOrders}</p>
        </div>
        <div className="bg-white rounded-xl border border-[#1B2430]/10 p-5 border-l-4 border-l-[#C9962B]">
          <p className="text-xs text-[#1B2430]/50 mb-1">Total Stock</p>
          <p className="text-2xl font-bold text-[#1B2430]">{totalStock}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl border border-[#1B2430]/10 p-5">
          <p className="text-sm font-semibold text-[#1B2430] mb-4">
            <span className="inline-block w-2 h-2 rounded-full bg-[#F48FB1] mr-2" />
            Sales — Last 7 Days
          </p>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={salesByDay}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1B2430" strokeOpacity={0.06} />
              <XAxis dataKey="day" fontSize={12} stroke="#1B2430" strokeOpacity={0.4} />
              <YAxis fontSize={12} stroke="#1B2430" strokeOpacity={0.4} />
              <Tooltip
                formatter={(v) => formatBDT(v)}
                contentStyle={{ borderRadius: 8, border: "1px solid #1B243020" }}
              />
              <Bar dataKey="sales" fill="#F48FB1" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-[#1B2430]/10 p-5">
          <p className="text-sm font-semibold text-[#1B2430] mb-4">
            <span className="inline-block w-2 h-2 rounded-full bg-[#94AC8D] mr-2" />
            Products by Category
          </p>
          {categoryData.length === 0 ? (
            <p className="text-sm text-[#1B2430]/40">No products yet.</p>
          ) : (
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie
                  data={categoryData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label
                >
                  {categoryData.map((entry, i) => (
                    <Cell key={entry.name} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #1B243020" }} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#1B2430]/10 p-5 mb-6">
        <p className="text-sm font-semibold text-[#1B2430] mb-1">
          <span className="inline-block w-2 h-2 rounded-full bg-[#C9962B] mr-2" />
          Stock Levels
        </p>

        {stockData.length === 0 ? (
          <p className="text-sm text-[#1B2430]/40">No products yet.</p>
        ) : (
          <ResponsiveContainer width="100%" height={Math.max(180, stockData.length * 32)}>
            <BarChart data={stockData} layout="vertical" margin={{ left: 40 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1B2430" strokeOpacity={0.06} horizontal={false} />
              <XAxis type="number" fontSize={12} stroke="#1B2430" strokeOpacity={0.4} />
              <YAxis type="category" dataKey="name" fontSize={11} width={110} stroke="#1B2430" strokeOpacity={0.5} />
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #1B243020" }} />
              <Bar dataKey="stock" radius={[0, 6, 6, 0]}>
                {stockData.map((entry, i) => (
                  <Cell key={i} fill={stockColor(entry.stock)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="bg-white rounded-xl border border-[#1B2430]/10 p-5">
        <p className="text-sm font-semibold text-[#1B2430] mb-4">Recent Orders</p>
        {recentOrders.length === 0 ? (
          <p className="text-sm text-[#1B2430]/40">No orders yet.</p>
        ) : (
          <table className="w-full text-[11px] sm:text-sm border-separate border-spacing-y-1 table-fixed">
            <thead>
              <tr className="text-left text-white text-[10px] sm:text-xs uppercase tracking-wide">
                <th className="px-2 sm:px-3 py-2 bg-[#1B2430] rounded-l-md w-[30%]">Product</th>
                <th className="px-2 py-2 bg-[#1B2430] w-[10%]">Qty</th>
                <th className="px-2 py-2 bg-[#1B2430] w-[20%]">Total</th>
                <th className="px-2 py-2 bg-[#1B2430] w-[14%]">Date</th>
                <th className="px-2 py-2 bg-[#1B2430] rounded-r-md w-[26%]">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((it, i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-[#F4F0E4]/60" : ""}>
                  <td className="px-2 sm:px-3 py-2.5 text-[#1B2430] rounded-l-md break-words">{it.name}</td>
                  <td className="px-2 py-2.5 text-[#1B2430]/70">{it.quantity}</td>
                  <td className="px-2 py-2.5 text-[#1B2430] font-medium break-words">
                    {formatBDT(it.price * it.quantity)}
                  </td>
                  <td className="px-2 py-2.5 text-[#1B2430]/50">
                    {it.createdAt?.slice(5, 10)}
                  </td>
                  <td className="px-2 py-2.5 rounded-r-md">
                    <select
                      value={it.status}
                      onChange={(e) => handleStatusChange(it.orderId, e.target.value)}
                      className={`w-full text-[10px] sm:text-xs font-medium rounded-full px-1.5 py-1 border-0 outline-none capitalize cursor-pointer ${STATUS_STYLES[it.status]}`}
                    >
                      {STATUS_OPTIONS.map((s) => (
                        <option key={s} value={s} className="bg-white text-[#1B2430]">
                          {s}
                        </option>
                      ))}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}