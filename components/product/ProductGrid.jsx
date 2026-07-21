import ProductCard from "./ProductCard";
import EmptyState from "@/components/ui/EmptyState";

export default function ProductGrid({products }){
  if (!products || products.length === 0){
    return <EmptyState message="No products found." />;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
      {products.map((product)=>(
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}