import { OrderSidebar } from "../../../../components/OrderSidebar";

export default function OrdersLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid min-h-screen w-full lg:grid-cols-[280px_1fr]">
      <OrderSidebar />
      <main className="p-4 sm:p-6 lg:p-8">{children}</main>
    </div>
  );
}
    
