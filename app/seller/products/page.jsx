"use client";

import ProductListing from "@/components/product/ProductListing";

export default function SellerProductsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold text-[#1B2430] mb-6">My Products</h1>
      <ProductListing products={[]} />
    </div>
  );
}