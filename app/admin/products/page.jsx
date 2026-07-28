"use client";

import { useEffect, useState } from "react";
import { productService } from "@/services/productService";
import { formatBDT } from "@/lib/formatPrice";
import { confirmAction, showError, showSuccess } from "@/lib/alerts";
import { FaTrash } from "react-icons/fa";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    productService.getAllStoreProducts().then((data) => {
      setProducts(data);
      setLoading(false);
    });
  }, []);

  async function handleDelete(id) {
    const confirmed = await confirmAction("Delete this product? This can't be undone.");
    if (!confirmed) return;

    try {
      await productService.delete(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
      showSuccess("Product deleted.");
    } catch (err) {
      showError("Could not delete product. Please try again.");
    }
  }

  if (loading) return <p className="text-[#1B2430]/50">Loading products...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold text-[#1B2430] mb-6">All Products</h1>

      {products.length === 0 ? (
        <p className="text-[#1B2430]/50">No seller products yet.</p>
      ) : (
        <div className="bg-white rounded-xl border border-[#1B2430]/10 overflow-hidden">
          <table className="w-full text-[11px] sm:text-sm table-fixed">
            <thead>
              <tr className="text-left bg-[#1B2430] text-white text-[10px] sm:text-xs uppercase tracking-wide">
                <th className="px-2 sm:px-4 py-3 w-[42%]">Product</th>
                <th className="px-2 py-3 w-[16%]">Stock</th>
                <th className="px-2 py-3 w-[26%]">Price</th>
                <th className="px-2 py-3 w-[16%]"></th>
              </tr>
            </thead>
            <tbody>
              {products.map((p, i) => (
                <tr key={p.id} className={i % 2 === 1 ? "bg-[#F4F0E4]/40" : ""}>
                  <td className="px-2 sm:px-4 py-3 align-top">
                    <p className="text-[#1B2430] break-words">{p.name}</p>
                    <p className="text-[#1B2430]/50 text-[10px] sm:text-xs break-words mt-0.5">
                      {p.data?.category || "-"} · {p.sellerEmail || "-"}
                    </p>
                  </td>
                  <td className="px-2 py-3 text-[#1B2430]/70 align-top">
                    {p.data?.stock ?? "-"}
                  </td>
                  <td className="px-2 py-3 text-[#1B2430] font-medium align-top break-words">
                    {formatBDT(p.data?.price, p.data?.currency)}
                  </td>
                  <td className="px-2 py-3 text-right align-top">
                    <button
                      onClick={() => handleDelete(p.id)}
                      className="text-[#B5573F] hover:text-[#9c4a35] transition-colors"
                    >
                      <FaTrash size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}