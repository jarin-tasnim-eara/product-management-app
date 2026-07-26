"use client";

import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { orderService } from "@/services/orderService";
import { formatBDT } from "@/lib/formatPrice";

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
      <h1 className="text-2xl font-bold text-[#1B2430] mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <p className="text-[#1B2430]/50">You haven't placed any orders yet.</p>
      ) : (
        <div className="space-y-5">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-xl border border-[#1B2430]/10 overflow-hidden"
            >
              <div className="flex  items-center justify-between px-5 py-3 bg-[#F4F0E4] border-b border-[#1B2430]/10">
                <div>
                  <p className="text-xs text-[#1B2430]/50">Order placed</p>
                  <p className="text-sm font-medium text-[#1B2430]">
                    {order.createdAt?.slice(0, 10)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-[#1B2430]/50">Order Total</p>
                  <p className="text-sm font-semibold text-[#6E7A52]">
                    {formatBDT(order.total)}
                  </p>
                </div>
              </div>

              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-[#1B2430]/40 text-xs uppercase tracking-wide">
                    <th className="px-5 py-2">Product</th>
                    <th className="px-5 py-2 text-center">Qty</th>
                    <th className="px-5 py-2 text-right">Price</th>
                    <th className="px-5 py-2 text-right">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {(order.items || []).map((it, i) => (
                    <tr key={i} className="border-t border-[#1B2430]/5">
                      <td className="px-5 py-3 text-[#1B2430]">{it.name}</td>
                      <td className="px-5 py-3 text-center text-[#1B2430]/70">
                        {it.quantity}
                      </td>
                      <td className="px-5 py-3 text-right text-[#1B2430]/70">
                        {formatBDT(it.price)}
                      </td>
                      <td className="px-5 py-3 text-right font-medium text-[#1B2430]">
                        {formatBDT(it.price * it.quantity)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}