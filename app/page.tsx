import { productService } from "@/services/productService";

export default async function Home(){
  const products = await productService.getAll();

  return(
    <pre className="p-6 text-xs">
      {JSON.stringify(products.slice(0, 2), null, 2)}
    </pre>
  );
}