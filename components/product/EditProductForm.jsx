"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { updateProduct } from "@/redux/slices/productSlice";

export default function EditProductForm({ product }) {
  const [serverError, setServerError] = useState(null);
  const router = useRouter();
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: product?.name || "",
      category: product?.data?.category || "",
      price: product?.data?.price ?? "",
      brand: product?.data?.brand || "",
      image: product?.data?.image || "",
      rating: product?.data?.rating ?? "",
      stock: product?.data?.stock ?? "",
      description: product?.data?.description || "",
    },
  });

  async function onSubmit(formValues) {
    setServerError(null);
    try {
      const productData = {
        name: formValues.name,
        data: {
          ...product.data,
          category: formValues.category,
          price: parseFloat(formValues.price),
          brand: formValues.brand,
          image: formValues.image || null,
          rating: formValues.rating ? parseFloat(formValues.rating) : null,
          stock: formValues.stock ? parseInt(formValues.stock) : 0,
          description: formValues.description || "",
        },
      };

      await dispatch(
        updateProduct({ id: product.id, productData })
      ).unwrap();
      router.push("/seller/products");
    } catch (err) {
      setServerError(err.message || "Failed to update product");
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-md mx-auto space-y-4"
    >
      <div>
        <label className="block text-sm font-medium mb-1">Product Name</label>
        <input
          type="text"
          {...register("name", { required: "Product name is required" })}
          className="w-full border rounded-md px-3 py-2 text-sm outline-none focus:border-[#6E7A52]"
        />
        {errors.name && (
          <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Category</label>
        <input
          type="text"
          {...register("category", { required: "Category is required" })}
          className="w-full border rounded-md px-3 py-2 text-sm outline-none focus:border-[#6E7A52]"
        />
        {errors.category && (
          <p className="text-red-500 text-xs mt-1">
            {errors.category.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Price (৳ BDT)</label>
        <input
          type="number"
          step="0.01"
          {...register("price", {
            required: "Price is required",
            min: { value: 0, message: "Price can't be negative" },
          })}
          className="w-full border rounded-md px-3 py-2 text-sm outline-none focus:border-[#6E7A52]"
        />
        {errors.price && (
          <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Stock Quantity</label>
        <input
          type="number"
          min="0"
          {...register("stock", {
            required: "Stock quantity is required",
            min: { value: 0, message: "Stock can't be negative" },
          })}
          className="w-full border rounded-md px-3 py-2 text-sm outline-none focus:border-[#6E7A52]"
        />
        {errors.stock && (
          <p className="text-red-500 text-xs mt-1">{errors.stock.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Brand</label>
        <input
          type="text"
          {...register("brand")}
          className="w-full border rounded-md px-3 py-2 text-sm outline-none focus:border-[#6E7A52]"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Image URL</label>
        <input
          type="url"
          {...register("image", {
            pattern: {
              value: /^https?:\/\/.+/i,
              message: "Enter a valid image URL (http/https)",
            },
          })}
          className="w-full border rounded-md px-3 py-2 text-sm outline-none focus:border-[#6E7A52]"
        />
        {errors.image && (
          <p className="text-red-500 text-xs mt-1">{errors.image.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Rating (0–5, optional)
        </label>
        <input
          type="number"
          step="0.1"
          min="0"
          max="5"
          {...register("rating", {
            min: { value: 0, message: "Rating must be between 0 and 5" },
            max: { value: 5, message: "Rating must be between 0 and 5" },
          })}
          className="w-full border rounded-md px-3 py-2 text-sm outline-none focus:border-[#6E7A52]"
        />
        {errors.rating && (
          <p className="text-red-500 text-xs mt-1">{errors.rating.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Description (optional)
        </label>
        <textarea
          {...register("description")}
          rows={3}
          className="w-full border rounded-md px-3 py-2 text-sm outline-none focus:border-[#6E7A52]"
        />
      </div>

      {serverError && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-2 rounded-md text-sm">
          {serverError}
        </div>
      )}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-[#1B2430] text-white py-2 rounded-md text-sm hover:bg-[#6E7A52] transition-colors disabled:opacity-50"
      >
        {isSubmitting ? "Saving..." : "Save Changes"}
      </button>
    </form>
  );
}