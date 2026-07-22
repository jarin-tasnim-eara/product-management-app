"use client";

import { useState, useMemo, useEffect } from "react";
import { useSelector } from "react-redux";
import ProductGrid from "./ProductGrid";
import SearchBar from "./SearchBar";
import CategoryFilter from "./CategoryFilter";
import Pagination from "./Pagination";
import CreateProductButton from "./CreateProductButton";
import { productService } from "@/services/productService";

const PAGE_SIZE = 8;

export default function ProductListing({ products }) {
  const { user, role } = useSelector((state) => state.auth);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [page, setPage] = useState(1);
  const [sellerProducts, setSellerProducts] = useState([]);

  useEffect(() => {
    if (role === "seller" && user?.email) {
      productService.getSellerProducts(user.email).then((products) => {
        setSellerProducts(products);
      });
    }
  }, [role, user]);

  const allProducts = useMemo(() => {
    if (role === "seller" && user?.email) {
      return sellerProducts;
    }
    return products;
  }, [products, sellerProducts, role, user]);

  const filteredProducts = useMemo(() => {
    let filtered = allProducts;

    if (search) {
      filtered = filtered.filter((p) =>
        p.name?.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category !== "All") {
      filtered = filtered.filter((p) => p.data?.category === category);
    }

    return filtered;
  }, [allProducts, search, category]);

  const categories = useMemo(() => {
    const set = new Set(
      allProducts
        .map((p) => p.data?.category)
        .filter(Boolean)
    );
    return [...set];
  }, [allProducts]);

  const totalPages = Math.ceil(filteredProducts.length / PAGE_SIZE);
  const paginated = filteredProducts.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  function handleSearch(value) {
    setSearch(value);
    setPage(1);
  }

  function handleCategory(cat) {
    setCategory(cat);
    setPage(1);
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <SearchBar value={search} onChange={handleSearch} />
        <div className="flex items-center gap-4">
          <CategoryFilter
            categories={categories}
            selected={category}
            onSelect={handleCategory}
          />
          <CreateProductButton />
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <p className="text-gray-500 text-center py-10">
          {role === "seller"
            ? "You haven't added any products yet. Click '+ Add' to create your first product!"
            : "No products found."}
        </p>
      ) : (
        <ProductGrid products={paginated} />
      )}

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}