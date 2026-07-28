"use client";

import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { toggleWishlistItem } from "@/redux/slices/wishlistSlice";
import { addItem } from "@/redux/slices/cartSlice";
import { formatBDT } from "@/lib/formatPrice";
import { FaHeart, FaTrash, FaCartPlus } from "react-icons/fa";

export default function WishlistPage() {
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.wishlist);

  if (items.length === 0) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-[#1B2430] mb-6 flex items-center gap-2">
          <FaHeart className="text-[#B5573F]" />
          Wishlist
        </h1>
        <p className="text-[#1B2430]/50">Your wishlist is empty.</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#1B2430] mb-6 flex items-center gap-2">
        <FaHeart className="text-[#B5573F]" />
        Wishlist
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((item) => (
          <div
            key={item.productId}
            className="bg-white rounded-xl border border-[#1B2430]/10 p-4 flex flex-col"
          >
            <div className="w-full aspect-square mb-3 rounded-lg overflow-hidden bg-[#F4F0E4] flex items-center justify-center">
              {item.image ? (
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-[#1B2430]/25 text-sm">No image</span>
              )}
            </div>

            <p className="text-sm font-semibold text-[#1B2430] line-clamp-2 mb-1">
              {item.name}
            </p>
            <p className="text-sm font-semibold text-[#6E7A52] mb-3">
              {formatBDT(item.price, item.currency)}
            </p>

            <div className="mt-auto flex gap-2">
              <button
                onClick={() => dispatch(addItem({ id: item.productId, name: item.name, data: { price: item.price, image: item.image, currency: item.currency } }))}
                className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-[#6E7A52] text-white rounded-md text-sm hover:bg-[#5a6443] transition-colors"
              >
                <FaCartPlus size={13} />
                Add
              </button>
              <button
                onClick={() => dispatch(toggleWishlistItem({ id: item.productId }))}
                className="w-10 flex items-center justify-center rounded-md border border-[#1B2430]/15 hover:bg-[#F4F0E4] transition-colors"
              >
                <FaTrash size={13} className="text-[#B5573F]" />
              </button>
            </div>

            <Link
              href={`/products/${item.productId}`}
              className="mt-2 text-center px-3 py-2 border border-[#1B2430]/20 text-[#1B2430] rounded-md text-sm hover:border-[#6E7A52] hover:text-[#6E7A52] transition-colors"
            >
              View Details
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}