"use client";

import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { FaStar, FaCartPlus, FaStore } from "react-icons/fa";
import { addItem } from "@/redux/slices/cartSlice";

export default function ProductDetails({ product }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const { user } = useSelector((state) => state.auth);

  const { name, data } = product;
  const { image, price, brand, category, rating, description, sellerEmail, ...rest } =
    data || {};

  const isOwnProduct = user?.email && sellerEmail && user.email === sellerEmail;

  const otherEntries = Object.entries(rest).filter(
    ([, value]) => value !== undefined && value !== null && value !== ""
  );

  function handleAddToCart() {
    if (!user) {
      router.push("/login?next=cart");
      return;
    }
    dispatch(addItem(product));
  }

  function handleBuyNow() {
    if (!user) {
      router.push("/login?next=cart");
      return;
    }
    dispatch(addItem(product));
    router.push("/cart");
  }

  return (
    <div className="max-w-4xl mx-auto bg-white border border-[#1B2430]/10 rounded-xl p-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="w-full aspect-square rounded-lg overflow-hidden bg-[#F4F0E4] flex items-center justify-center">
          {image ? (
            <img
              src={image}
              alt={name}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-[#1B2430]/25 text-sm">No image</span>
          )}
        </div>

        <div>
          <h1 className="text-2xl font-bold text-[#1B2430] mb-2">{name}</h1>

          {(brand || category) && (
            <p className="text-sm text-[#5F6B4F] font-semibold capitalize mb-3">
              {[brand, category].filter(Boolean).join(" · ")}
            </p>
          )}

          <div className="flex items-center gap-4 mb-4">
            {price != null && (
              <span className="text-xl font-semibold text-[#1B2430]">
                ${price}
              </span>
            )}
            {rating != null && (
              <span className="flex items-center gap-1 text-sm text-[#1B2430]/60">
                <FaStar className="text-amber-400" />
                {Number(rating).toFixed(1)}
              </span>
            )}
          </div>

          {sellerEmail && (
            <p className="flex items-center gap-2 text-sm text-[#1B2430]/60 mb-4">
              <FaStore className="text-[#6E7A52]" size={13} />
              Sold by <span className="font-medium">{sellerEmail}</span>
            </p>
          )}

          {description && (
            <p className="text-sm text-[#1B2430]/70 mb-5">{description}</p>
          )}

          {isOwnProduct ? (
            <p className="text-sm text-[#1B2430]/50 italic mb-6">
              This is your own listing.
            </p>
          ) : (
            <div className="flex gap-3 mb-6">
              <button
                onClick={handleAddToCart}
                className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 border-2 border-[#6E7A52] text-[#6E7A52] rounded-md text-sm font-medium hover:bg-[#6E7A52]/5 transition-colors"
              >
                <FaCartPlus size={14} />
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                className="flex-1 px-4 py-2.5 bg-[#1B2430] text-white rounded-md text-sm font-medium hover:bg-[#6E7A52] transition-colors"
              >
                Buy Now
              </button>
            </div>
          )}

          {otherEntries.length > 0 && (
            <div className="grid grid-cols-2 gap-3 mt-4">
              {otherEntries.map(([key, value]) => (
                <div
                  key={key}
                  className="border border-[#1B2430]/10 rounded-lg p-3 bg-[#F4F0E4]"
                >
                  <p className="text-xs text-[#1B2430]/40 capitalize">{key}</p>
                  <p className="text-sm font-medium text-[#1B2430] mt-1">
                    {String(value)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}