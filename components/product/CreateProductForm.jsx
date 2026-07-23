"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { createProduct } from "@/redux/slices/productSlice";

export default function CreateProductForm() {
  const [serverError, setServerError] = useState(null);
  const router = useRouter();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      category: "",
      price: "",
      brand: "",
      image: "",
      rating: "",
      description: "",
    },
  });

  async function onSubmit(formValues) {
    setServerError(null);
    try {
      const productData = {
        name: formValues.name,
        data: {
          category: formValues.category,
          price: parseFloat(formValues.price),
          brand: formValues.brand,
          image: formValues.image || null,
          rating: formValues.rating ? parseFloat(formValues.rating) : null,
          description: formValues.description || "",
          sellerEmail: user?.email || "unknown",
        },
      };

      await dispatch(createProduct(productData)).unwrap();
      router.push("/");
    } catch (err) {
      setServerError(err.message || "Failed to create product");
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
          className="w-full border rounded-md px-3 py-2 text-sm outline-none focus:border-gray-500"
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
          placeholder="e.g. Electronics, Fashion, Home"
          className="w-full border rounded-md px-3 py-2 text-sm outline-none focus:border-gray-500"
        />
        {errors.category && (
          <p className="text-red-500 text-xs mt-1">
            {errors.category.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Price ($)</label>
        <input
          type="number"
          step="0.01"
          {...register("price", {
            required: "Price is required",
            min: { value: 0, message: "Price can't be negative" },
          })}
          className="w-full border rounded-md px-3 py-2 text-sm outline-none focus:border-gray-500"
        />
        {errors.price && (
          <p className="text-red-500 text-xs mt-1">{errors.price.message}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Brand</label>
        <input
          type="text"
          {...register("brand")}
          placeholder="e.g. Apple, Nike, Samsung"
          className="w-full border rounded-md px-3 py-2 text-sm outline-none focus:border-gray-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">
          Image URL
        </label>
        <input
          type="url"
          {...register("image", {
            pattern: {
              value: /^https?:\/\/.+/i,
              message: "Enter a valid image URL (http/https)",
            },
          })}
          placeholder="https://example.com/image.jpg"
          className="w-full border rounded-md px-3 py-2 text-sm outline-none focus:border-gray-500"
        />
        {errors.image && (
          <p className="text-red-500 text-xs mt-1">{errors.image.message}</p>
        )}
        <p className="text-xs text-gray-400 mt-1">
          Paste a direct image link (e.g. from Imgur, Unsplash, or your own
          hosting).
        </p>
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
          className="w-full border rounded-md px-3 py-2 text-sm outline-none focus:border-gray-500"
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
          className="w-full border rounded-md px-3 py-2 text-sm outline-none focus:border-gray-500"
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
        className="w-full bg-gray-900 text-white py-2 rounded-md text-sm hover:bg-gray-700 disabled:opacity-50"
      >
        {isSubmitting ? "Creating..." : "Create Product"}
      </button>
    </form>
  );
}