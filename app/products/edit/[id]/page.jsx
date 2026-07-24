import { productService } from "@/services/productService";
import EditProductForm from "@/components/product/EditProductForm";
import ErrorState from "@/components/ui/ErrorState";

export default async function EditProductPage({ params }) {
  const { id } = await params;

  let product = null;
  let error = null;

  try {
    product = await productService.getById(id);
    if (!product) error = "Product not found.";
  } catch (err) {
    error = "Product not found.";
  }

  return (
    <main className="max-w-7xl mx-auto px-6 py-16">
      <h1 className="text-2xl font-bold mb-8">Edit Product</h1>
      {error ? (
        <ErrorState message={error} />
      ) : (
        <EditProductForm product={product} />
      )}
    </main>
  );
}