import { productService } from "@/services/productService";
import ProductGrid from "@/components/product/ProductGrid";
import ErrorState from "@/components/ui/ErrorState";
import Hero from "@/components/layout/Hero";
import ProductListing from "@/components/product/ProductListing";

export default async function Home(){
  let products =[];
  let error =null;

  try{
    products= await productService.getAll();
  } catch(err){
    error= err.message;
  }

  return(
    <>
    <Hero/>
   <main className="max-w-7xl mx-auto px-6 py-10">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">All Products</h1>

      {error ? (
        <ErrorState message={error} />
      ) : (
        <ProductListing products={products} />
      )}
    </main>
    </>
  );
}