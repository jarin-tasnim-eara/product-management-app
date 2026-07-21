"use client";

import { useState, useMemo } from "react";
import ProductGrid from "./ProductGrid";
import SearchBar from "./SearchBar";
import CategoryFilter from "./CategoryFilter";
import Pagination from "./Pagination";

const PAGE_SIZE= 8;

export default function ProductListing({products }){
  const [search,setSearch] =useState("");
  const [category,setCategory] =useState("All");
  const [page,setPage] =useState(1);

  const categories = useMemo(()=>{
    const set =new Set(
      products
        .map((p)=> p.data?.category)
        .filter(Boolean) 
    );
    return [...set];
  }, [products]);


  const filtered = useMemo(()=>{
    return products.filter((p)=>{
      const matchesSearch = p.name
        .toLowerCase()
        .includes(search.toLowerCase());
      const matchesCategory =
        category === "All" || p.data?.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [products, search, category]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice(
    (page- 1)* PAGE_SIZE,
    page* PAGE_SIZE
  );

  function handleSearch(value){
    setSearch(value);
    setPage(1);
  }

  function handleCategory(cat){
    setCategory(cat);
    setPage(1);
  }

  return(
    <div>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <SearchBar value={search} onChange={handleSearch} />
        <CategoryFilter categories={categories} selected={category} onSelect={handleCategory}/>
      </div>

      <ProductGrid products={paginated}/>
      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage}/>
    </div>
  );
}