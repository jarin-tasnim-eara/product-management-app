"use client";

import Link from "next/link";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { FaStar, FaPen, FaTrash, FaCartPlus } from "react-icons/fa";
import { addItem } from "@/redux/slices/cartSlice";
import { formatBDT } from "@/lib/formatPrice";

export default function ProductCard({ product, showOwnerActions = false, onDelete }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user } = useSelector((state) => state.auth);

  const { id, name, data } = product;
  const price = data?.price;
  const category = data?.category;
  const brand = data?.brand;
  const rating = data?.rating;
  const image = data?.image;

  function handleAddToCart() {
    if (!user) {
      router.push("/login?next=cart");
      return;
    }
    dispatch(addItem(product));
  }

  return (
    <div className="group bg-white rounded-xl border border-[#1B2430]/10 p-4 hover:border-[#1B2430]/20 hover:shadow-lg transition-all flex flex-col">
      <div className="relative w-full aspect-square mb-3 rounded-lg overflow-hidden bg-[#F4F0E4]">
        {image ? (
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-[#1B2430]/25 text-sm">No image</span>
          </div>
        )}

        {category && (
          <span className="absolute top-2 left-2 bg-white/90 backdrop-blur px-2 py-0.5 rounded-full text-[10px] uppercase tracking-wide text-[#1B2430]/60 capitalize">
            {category}
          </span>
        )}

        {showOwnerActions && (
          <div className="absolute top-2 right-2 flex gap-2">
            <Link
              href={`/products/edit/${id}`}
              title="Edit product"
              className="w-9 h-9 flex items-center justify-center rounded-full bg-[#6E7A52] text-white shadow-md hover:bg-[#5a6443] transition"
            >
              <FaPen size={13} />
            </Link>
            <button
              type="button"
              title="Delete product"
              onClick={() => onDelete?.(id)}
              className="w-9 h-9 flex items-center justify-center rounded-full bg-[#B5573F] text-white shadow-md hover:bg-[#9c4a35] transition"
            >
              <FaTrash size={13} />
            </button>
          </div>
        )}
      </div>

      <div className="flex-1">
        <h3 className="text-base font-semibold text-[#1B2430] line-clamp-2 mb-1">
          {name}
        </h3>

        {brand && (
          <p className="text-xs text-[#5F6B4F] font-semibold capitalize mb-2">
            {brand}
          </p>
        )}

        <div className="flex items-center justify-between mt-2">
          {price != null && (
            <span className="text-sm font-semibold text-[#1B2430]">
              {formatBDT(price)}
            </span>
          )}
          {rating != null && (
            <span className="flex items-center gap-1 text-xs text-[#1B2430]/60">
              <FaStar className="text-amber-400" />
              {Number(rating).toFixed(1)}
            </span>
          )}
        </div>
      </div>

      <div className="mt-4 flex gap-2">
        {!showOwnerActions && (
          <button
            type="button"
            onClick={handleAddToCart}
            className="flex-1 flex items-center justify-center gap-1.5 px-3 py-2 bg-[#6E7A52] text-white rounded-md text-sm hover:bg-[#5a6443] transition-colors"
          >
            <FaCartPlus size={13} />
            Add
          </button>
        )}
        <Link
          href={`/products/${id}`}
          className={`text-center bg-[#393748] px-3 py-2 border border-[#1B2430]/20 text-white rounded-md text-sm hover:border-[#6E7A52] hover:text-[#6E7A52] transition-colors ${
            showOwnerActions ? "w-full" : "flex-1"
          }`}
        >
          Details
        </Link>
      </div>
    </div>
  );
}