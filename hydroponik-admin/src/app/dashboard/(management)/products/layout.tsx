import { ProductSidebar } from "@/components/ProductSidebar";

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
      <ProductSidebar />
      <main className="p-4 sm:p-6 lg:p-8">{children}</main>
    </div>
  );
}
    
