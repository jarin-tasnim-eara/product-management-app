"use client";

import { useEffect, useState } from "react";
import { orderService } from "@/services/orderService";
import { productService } from "@/services/productService";
import { authService } from "@/services/authService";
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

const PIE_COLORS = ["#FF9800", "#8BC34A", "#D50000", "#FFD54F", "#00ACC1", "#3F51B5"];

const STATUS_STYLES = {
  pending: "bg-[#C9962B]/15 text-[#C9962B]",
  shipped: "bg-[#3B6EA5]/15 text-[#3B6EA5]",
  delivered: "bg-[#6E7A52]/15 text-[#6E7A52]",
};

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      orderService.getAllOrders(),
      productService.getAllStoreProducts(),
      authService.getAllUsers(),
    ]).then(([ordersData, productsData, usersData]) => {
      setOrders(ordersData);
      setProducts(productsData);
      setUsers(usersData);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <p className="text-[#1B2430]/50">Loading dashboard...</p>;
  }

  const totalSales = orders.reduce((sum, o) => sum + (o.total || 0), 0);
  const totalOrders = orders.length;
  const totalSellers = users.filter((u) => u.role === "seller").length;
  const totalProducts = products.length;

  const last7Days = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    return d.toISOString().slice(0, 10);
  });
  const salesByDay = last7Days.map((day) => ({
    day: day.slice(5),
    sales: orders
      .filter((o) => o.createdAt?.slice(0, 10) === day)
      .reduce((s, o) => s + (o.total || 0), 0),
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

  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 8);

  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-[#6E7A52] font-semibold mb-1">
        Platform Overview
      </p>
      <h1 className="text-2xl font-bold text-[#1B2430] mb-6">Admin Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-[#1B2430]/10 p-5 border-l-4 border-l-[#6E7A52]">
          <p className="text-xs text-[#1B2430]/50 mb-1">Total Sales</p>
          <p className="text-2xl font-bold text-[#1B2430]">{formatBDT(totalSales)}</p>
        </div>
        <div className="bg-white rounded-xl border border-[#1B2430]/10 p-5 border-l-4 border-l-[#94AC8D]">
          <p className="text-xs text-[#1B2430]/50 mb-1">Total Orders</p>
          <p className="text-2xl font-bold text-[#1B2430]">{totalOrders}</p>
        </div>
        <div className="bg-white rounded-xl border border-[#1B2430]/10 p-5 border-l-4 border-l-[#C9962B]">
          <p className="text-xs text-[#1B2430]/50 mb-1">Total Sellers</p>
          <p className="text-2xl font-bold text-[#1B2430]">{totalSellers}</p>
        </div>
        <div className="bg-white rounded-xl border border-[#1B2430]/10 p-5 border-l-4 border-l-[#3F51B5]">
          <p className="text-xs text-[#1B2430]/50 mb-1">Total Products</p>
          <p className="text-2xl font-bold text-[#1B2430]">{totalProducts}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl border border-[#1B2430]/10 p-5">
          <p className="text-sm font-semibold text-[#1B2430] mb-4">
            <span className="inline-block w-2 h-2 rounded-full bg-[#F48FB1] mr-2" />
            Platform Sales — Last 7 Days
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

      <div className="bg-white rounded-xl border border-[#1B2430]/10 p-5">
        <p className="text-sm font-semibold text-[#1B2430] mb-4">Recent Orders</p>
        {recentOrders.length === 0 ? (
          <p className="text-sm text-[#1B2430]/40">No orders yet.</p>
        ) : (
          <table className="w-full text-[11px] sm:text-sm border-separate border-spacing-y-1 table-fixed">
            <thead>
              <tr className="text-left text-white text-[10px] sm:text-xs uppercase tracking-wide">
                <th className="px-2 sm:px-3 py-2 bg-[#1B2430] rounded-l-md w-[40%]">Buyer</th>
                <th className="px-2 py-2 bg-[#1B2430] w-[20%]">Total</th>
                <th className="px-2 py-2 bg-[#1B2430] w-[16%]">Date</th>
                <th className="px-2 py-2 bg-[#1B2430] rounded-r-md w-[24%]">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((o, i) => (
                <tr key={o.id} className={i % 2 === 0 ? "bg-[#F4F0E4]/60" : ""}>
                  <td className="px-2 sm:px-3 py-2.5 text-[#1B2430] rounded-l-md break-words">{o.buyerEmail}</td>
                  <td className="px-2 py-2.5 text-[#1B2430] font-medium break-words">
                    {formatBDT(o.total)}
                  </td>
                  <td className="px-2 py-2.5 text-[#1B2430]/50">
                    {o.createdAt?.slice(5, 10)}
                  </td>
                  <td className="px-2 py-2.5 rounded-r-md">
                    <span
                      className={`text-[10px] sm:text-xs font-medium rounded-full px-1.5 py-1 capitalize ${
                        STATUS_STYLES[o.status || "pending"]
                      }`}
                    >
                      {o.status || "pending"}
                    </span>
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