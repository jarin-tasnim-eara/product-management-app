
import {productService} from "@/services/productService";
import ProductDetails from "@/components/product/ProductDetails";
import ErrorState from "@/components/ui/ErrorState";

export default async function ProductDetailsPage({params}){
  const {id} = await params;

  let product= null;
  let error= null;

  try{
    product = await productService.getById(id);
  }catch (err){
    error = "Product not found.";
  }

  return(
    <main className="max-w-7xl mx-auto px-6 py-10">
      {error ?(
        <ErrorState message={error} />
      ):(
        <ProductDetails product={product} />
      )}
    </main>
  );
}