import { CategorySidebar } from "@/components/CategoriesSidebar"; 
// Pastikan path import di atas sesuai dengan lokasi file CategoriesSidebar.tsx kamu disimpan.
// Jika file CategoriesSidebar ada di folder yang sama, gunakan: import { CategorySidebar } from "./CategoriesSidebar";

export default function CategoriesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
      {/* Panggil Sidebar Khusus Kategori di sini */}
      <CategorySidebar />
      
      {/* Konten halaman (products/page.tsx atau services/page.tsx) akan muncul di sini */}
      <main className="p-4 sm:p-6 lg:p-8">{children}</main>
    </div>
  );
}