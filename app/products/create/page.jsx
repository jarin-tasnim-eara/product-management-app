import CreateProductForm from "@/components/product/CreateProductForm";

export default function CreateProductPage() {
  return (
    <main className="max-w-7xl mx-auto px-6 py-16">
      <h1 className="text-2xl font-bold mb-8">Add New Product</h1>
      <CreateProductForm />
    </main>
  );
}