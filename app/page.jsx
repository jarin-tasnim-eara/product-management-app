import { productService } from "@/services/productService";
import ErrorState from "@/components/ui/ErrorState";
import Hero from "@/components/layout/Hero";
import ProductListing from "@/components/product/ProductListing";

export default async function Home() {
  let products = [];
  let error = null;

  try {
    products = await productService.getAll();
    console.log("Products fetched:", products);
  } catch (err) {
    error = err.message;
    console.error("Error fetching products:", error);
  }

  return (
    <>
      <Hero />
      <main className="max-w-7xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">All Products</h2>
        {error ? (
          <ErrorState message={error} />
        ) : (
          <ProductListing products={products} />
        )}
      </main>
    </>
  );
}