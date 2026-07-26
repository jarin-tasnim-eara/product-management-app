"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { orderService } from "@/services/orderService";
import { productService } from "@/services/productService";
import { formatBDT } from "@/lib/formatPrice";
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

const PIE_COLORS = ["#4931b2", "#FFC0CB", "#7c1282", "#6fc92b", "#1a447b"];

function stockColor(stock) {
  if (stock < 10) return "#e3451e";
   if (stock < 20) return "#7a3379";
  if (stock < 30) return "#70d428";
    if (stock < 40) return "#3628d4";
 if (stock < 50) return "#d52d65";
  return "#54bdc1";
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
      .map((it) => ({ ...it, orderId: o.id, createdAt: o.createdAt }))
  );

  const totalSales = myItems.reduce((sum, it) => sum + it.price * it.quantity, 0);
  const totalOrders = new Set(myItems.map((it) => it.orderId)).size;
  const totalStock = products.reduce(
    (sum, p) => sum + (Number(p.data?.stock) || 0),
    0
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
            <span className="inline-block w-2 h-2 rounded-full bg-[#6E7A52] mr-2" />
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
              <Bar dataKey="sales" fill="#FFC0CB" radius={[6, 6, 0, 0]} />
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
          <table className="w-full text-sm border-separate border-spacing-y-1">
            <thead>
              <tr className="text-left text-white text-xs uppercase tracking-wide">
                <th className="px-3 py-2 bg-[#1B2430] rounded-l-md">Product</th>
                <th className="px-3 py-2 bg-[#1B2430]">Qty</th>
                <th className="px-3 py-2 bg-[#1B2430]">Total</th>
                <th className="px-3 py-2 bg-[#1B2430] rounded-r-md">Date</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((it, i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-[#F4F0E4]/60" : ""}>
                  <td className="px-3 py-2.5 text-[#1B2430] rounded-l-md">{it.name}</td>
                  <td className="px-3 py-2.5 text-[#1B2430]/70">{it.quantity}</td>
                  <td className="px-3 py-2.5 text-[#1B2430] font-medium">
                    {formatBDT(it.price * it.quantity)}
                  </td>
                  <td className="px-3 py-2.5 text-[#1B2430]/50 rounded-r-md">
                    {it.createdAt?.slice(0, 10)}
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