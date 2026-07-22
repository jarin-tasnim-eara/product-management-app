"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { createProduct } from "@/redux/slices/productSlice";

export default function CreateProductForm() {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [brand, setBrand] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const productData = {
        name: name,
        data: {
          category: category,
          price: parseFloat(price),
          brand: brand,
          sellerEmail: user?.email || "unknown",
        },
      };

      console.log("📤 Creating product:", productData);
      
      const result = await dispatch(createProduct(productData)).unwrap();
      console.log("✅ Product created:", result);
      
      setTimeout(() => {
        router.push("/");
      }, 100);
      
    } catch (err) {
      console.error("❌ Create error:", err);
      setError(err.message || "Failed to create product");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Product Name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="w-full border rounded-md px-3 py-2 text-sm outline-none focus:border-gray-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Category</label>
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
          placeholder="e.g. Electronics, Fashion, Home"
          className="w-full border rounded-md px-3 py-2 text-sm outline-none focus:border-gray-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Price ($)</label>
        <input
          type="number"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          required
          min="0"
          step="0.01"
          className="w-full border rounded-md px-3 py-2 text-sm outline-none focus:border-gray-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Brand</label>
        <input
          type="text"
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          placeholder="e.g. Apple, Nike, Samsung"
          className="w-full border rounded-md px-3 py-2 text-sm outline-none focus:border-gray-500"
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-md text-sm">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full bg-gray-900 text-white py-2 rounded-md text-sm hover:bg-gray-700 disabled:opacity-50"
      >
        {loading ? "Creating..." : "Create Product"}
      </button>
    </form>
  );
}