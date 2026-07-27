"use client";

import { useState } from "react";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { removeItem, updateQuantity, clearCart } from "@/redux/slices/cartSlice";
import { orderService } from "@/services/orderService";
import { showSuccess, showError } from "@/lib/alerts";
import { formatBDT } from "@/lib/formatPrice";
import { useRouter } from "next/navigation";
import { FaTrash, FaArrowLeft } from "react-icons/fa";

export default function CartPage() {
  const dispatch = useDispatch();
  const router = useRouter();
  const { items } = useSelector((state) => state.cart);
  const { user, initialized } = useSelector((state) => state.auth);
  const [placing, setPlacing] = useState(false);

  const total = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  async function handleCheckout() {
    setPlacing(true);
    try {
      await orderService.createOrder(user.email, items, total);
      await showSuccess("Order placed successfully!");
      dispatch(clearCart());
    } catch (err) {
      showError("Could not place order. Please try again.");
    } finally {
      setPlacing(false);
    }
  }

  if (initialized && !user) {
    return (
      <main className="max-w-2xl mx-auto px-6 py-16 text-center">
        <p className="text-[#1B2430]/60 mb-4">Please log in to view your cart.</p>
        <Link
          href="/login"
          className="inline-block px-4 py-2 bg-[#1B2430] text-white rounded-md text-sm hover:bg-[#6E7A52] transition-colors"
        >
          Login
        </Link>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="max-w-2xl mx-auto px-6 py-16 text-center">
        <p className="text-[#1B2430]/60 mb-4">Your cart is empty.</p>
        <Link
          href="/"
          className="inline-block px-4 py-2 bg-[#1B2430] text-white rounded-md text-sm hover:bg-[#6E7A52] transition-colors"
        >
          Browse Products
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-3xl mx-auto px-6 py-12">
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-[#1B2430]/60 hover:text-[#1B2430] mb-6 transition-colors"
      >
        <FaArrowLeft size={12} />
        Back
      </button>
      <h1 className="text-2xl font-bold text-[#1B2430] mb-8">Your Cart</h1>

      <div className="space-y-4">
        {items.map((item) => (
          <div
            key={item.productId}
            className="flex items-center gap-4 bg-white border border-[#1B2430]/10 rounded-xl p-4"
          >
            <div className="w-16 h-16 rounded-lg bg-[#F4F0E4] overflow-hidden shrink-0 flex items-center justify-center">
              {item.image ? (
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              ) : (
                <span className="text-[10px] text-[#1B2430]/25">No image</span>
              )}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#1B2430] truncate">{item.name}</p>
              <p className="text-sm text-[#1B2430]/50">{formatBDT(item.price)} each</p>
            </div>

            <input
              type="number"
              min="1"
              value={item.quantity}
              onChange={(e) =>
                dispatch(
                  updateQuantity({
                    productId: item.productId,
                    quantity: parseInt(e.target.value) || 1,
                  })
                )
              }
              className="w-16 border border-[#1B2430]/15 rounded-md px-2 py-1 text-sm text-center focus:outline-none focus:border-[#6E7A52]"
            />

            <span className="text-sm font-semibold text-[#1B2430] w-20 text-right">
              {formatBDT(item.price * item.quantity)}
            </span>

            <button
              onClick={() => dispatch(removeItem(item.productId))}
              className="text-[#1B2430]/40 hover:text-red-600 transition-colors"
              title="Remove item"
            >
              <FaTrash size={14} />
            </button>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between mt-8 pt-6 border-t border-[#1B2430]/10">
        <span className="text-lg font-semibold text-[#1B2430]">
          Total: {formatBDT(total)}
        </span>
        <button
          onClick={handleCheckout}
          disabled={placing}
          className="px-6 py-2.5 bg-[#6E7A52] text-white rounded-md text-sm font-medium hover:bg-[#5a6443] transition-colors disabled:opacity-50"
        >
          {placing ? "Placing order..." : "Checkout"}
        </button>
      </div>
    </main>
  );
}