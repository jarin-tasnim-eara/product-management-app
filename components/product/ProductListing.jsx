"use client";

import { useState, useMemo, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import ProductGrid from "./ProductGrid";
import SearchBar from "./SearchBar";
import CategoryFilter from "./CategoryFilter";
import Pagination from "./Pagination";
import CreateProductButton from "./CreateProductButton";
import { productService } from "@/services/productService";
import { deleteProduct } from "@/redux/slices/productSlice";

const PAGE_SIZE = 8;

export default function ProductListing({ products }) {
  const dispatch = useDispatch();
  const { user, role } = useSelector((state) => state.auth);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [page, setPage] = useState(1);
  const [sellerProducts, setSellerProducts] = useState([]);

  const isSellerView = role === "seller" && !!user?.email;

  useEffect(() => {
    if (isSellerView) {
      productService.getSellerProducts(user.email).then((products) => {
        setSellerProducts(products);
      });
    }
  }, [isSellerView, user]);

  const allProducts = useMemo(() => {
    if (isSellerView) return sellerProducts;
    return products;
  }, [products, sellerProducts, isSellerView]);

  const searchFiltered = useMemo(() => {
    const query = search.trim().replace(/\s+/g, " ").toLowerCase();
    if (!query) return allProducts;

  
    const words = query.split(" ").filter(Boolean);

    return allProducts.filter((p) => {
      const nameLower = p.name?.toLowerCase() || "";
      return words.every((word) => nameLower.includes(word));
    });
  }, [allProducts, search]);

  const filteredProducts = useMemo(() => {
    if (category === "All") return searchFiltered;
    return searchFiltered.filter((p) => p.data?.category === category);
  }, [searchFiltered, category]);

  const categories = useMemo(() => {
    const counts = {};
    searchFiltered.forEach((p) => {
      const cat = p.data?.category;
      if (cat) counts[cat] = (counts[cat] || 0) + 1;
    });
    return Object.entries(counts).map(([name, count]) => ({ name, count }));
  }, [searchFiltered]);

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

  async function handleDelete(id) {
    const confirmed = window.confirm("Delete this product? This can't be undone.");
    if (!confirmed) return;

    try {
      await dispatch(deleteProduct(id)).unwrap();
      setSellerProducts((prev) => prev.filter((p) => p.id !== id));
    } catch (err) {
      alert("Could not delete product. Please try again.");
    }
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
            totalCount={searchFiltered.length}
          />
          <CreateProductButton />
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <p className="text-[#1B2430]/50 text-center py-10">
          {isSellerView
            ? "You haven't added any products yet. Click '+ Add' to create your first product!"
            : "No products found."}
        </p>
      ) : (
        <ProductGrid
          products={paginated}
          showOwnerActions={isSellerView}
          onDelete={isSellerView ? handleDelete : undefined}
        />
      )}

      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
      />
    </div>
  );
}