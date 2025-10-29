import { BookingSidebar } from "@/components/BookingSidebar";

export default function BookingsLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
      <BookingSidebar />
      <main className="p-4 sm:p-6 lg:p-8">{children}</main>
    </div>
  );
}