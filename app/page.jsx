import { productService } from "@/services/productService";
import ErrorState from "@/components/ui/ErrorState";
import Hero from "@/components/layout/Hero";
import ProductListing from "@/components/product/ProductListing";

export const dynamic = "force-dynamic";

export default async function Home() {
  let products = [];
  let error = null;

  try {
    products = await productService.getAll();
  } catch (err) {
    error = err.message;
  }

  return (
    <>
      <Hero />
      <div className="bg-[#F1EEE3]">
        <main className="max-w-7xl mx-auto px-6 py-10">
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-2xl font-bold text-[#1B2430]">All Products</h2>
            {!error && (
              <span className="bg-[#6E7A52]/10 text-[#6E7A52] text-xs font-semibold px-2.5 py-1 rounded-full">
                {products.length} items
              </span>
            )}
          </div>

          {error ? (
            <ErrorState message={error} />
          ) : (
            <ProductListing products={products} />
          )}
        </main>
      </div>
    </>
  );
}