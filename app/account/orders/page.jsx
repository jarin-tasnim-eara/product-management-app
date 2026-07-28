"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { orderService } from "@/services/orderService";
import { formatBDT } from "@/lib/formatPrice";
import { FaReceipt } from "react-icons/fa";

function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

const STATUS_STYLES = {
  pending: "bg-[#C9962B]/15 text-[#C9962B]",
  shipped: "bg-[#3B6EA5]/15 text-[#3B6EA5]",
  delivered: "bg-[#6E7A52]/15 text-[#6E7A52]",
  partial: "bg-[#8E44AD]/15 text-[#8E44AD]",
};

const STATUS_LABELS = {
  pending: "Pending",
  shipped: "Shipped",
  delivered: "Delivered",
  partial: "Partially Delivered",
};

function computeOverallStatus(items) {
  const statuses = (items || []).map((it) => it.status || "pending");
  if (statuses.every((s) => s === "delivered")) return "delivered";
  if (statuses.some((s) => s === "delivered")) return "partial";
  if (statuses.some((s) => s === "shipped")) return "shipped";
  return "pending";
}

export default function MyOrdersPage() {
  const { user } = useSelector((state) => state.auth);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.email) return;
    orderService.getOrdersForBuyer(user.email).then((data) => {
      setOrders(data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)));
      setLoading(false);
    });
  }, [user]);

  if (loading) return <p className="text-[#1B2430]/50">Loading orders...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#1B2430] mb-6 flex items-center gap-2">
        <FaReceipt className="text-[#6E7A52]" />
        My Orders
      </h1>

      {orders.length === 0 ? (
        <p className="text-[#1B2430]/50">You haven't placed any orders yet.</p>
      ) : (
        <div className="space-y-5">
          {orders.map((order) => {
            const overallStatus = computeOverallStatus(order.items);
            return (
              <div
                key={order.id}
                className="bg-white rounded-xl border border-[#1B2430]/10 overflow-hidden"
              >
                <div className="flex items-center justify-between px-4 sm:px-5 py-3 bg-[#F4F0E4] border-b border-[#1B2430]/10 gap-2 flex-wrap">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-xs sm:text-sm text-[#1B2430]/60">
                      {formatDate(order.createdAt)}
                    </p>
                    <span
                      className={`text-[10px] sm:text-xs font-medium px-2 py-0.5 rounded-full ${STATUS_STYLES[overallStatus]}`}
                    >
                      {STATUS_LABELS[overallStatus]}
                    </span>
                  </div>
                  <span className="text-xs sm:text-sm font-semibold text-white bg-[#6E7A52] px-3 py-1 rounded-full shrink-0">
                    {formatBDT(order.total)}
                  </span>
                </div>

                <table className="w-full text-xs sm:text-sm table-fixed">
                  <thead>
                    <tr className="bg-[#94AC8D]/15 text-[#1B2430]/60 text-left">
                      <th className="px-3 sm:px-5 py-2 font-medium w-[44%]">Product</th>
                      <th className="px-2 py-2 font-medium text-center w-[14%]">Qty</th>
                      <th className="px-2 py-2 font-medium text-right w-[42%] pr-3 sm:pr-5">
                        Subtotal
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {(order.items || []).map((it, i) => (
                      <tr
                        key={i}
                        className={`border-t border-[#1B2430]/5 ${
                          i % 2 === 1 ? "bg-[#F4F0E4]/40" : ""
                        }`}
                      >
                        <td className="px-3 sm:px-5 py-2 align-top">
                          <p className="text-[#1B2430] break-words">{it.name}</p>
                          <span
                            className={`inline-block mt-1 text-[10px] font-medium capitalize px-1.5 py-0.5 rounded-full ${
                              STATUS_STYLES[it.status || "pending"]
                            }`}
                          >
                            {it.status || "pending"}
                          </span>
                        </td>
                        <td className="px-2 py-2 text-[#1B2430]/60 text-center align-top">
                          {it.quantity}
                        </td>
                        <td className="px-2 py-2 text-[#6E7A52] font-semibold text-right pr-3 sm:pr-5 align-top break-words">
                          {formatBDT(it.price * it.quantity, it.currency)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}