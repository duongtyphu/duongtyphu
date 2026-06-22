export const metadata = { title: "My Products" };

export default function MyProductsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-brand-navy">My Products</h1>
        <p className="mt-2 text-brand-gray-500">
          Sản phẩm và tài nguyên bạn đã mở khoá sẽ hiển thị tại đây.
        </p>
      </div>
      <div className="rounded-2xl border border-dashed border-brand-gray-200 bg-brand-gray-50 p-10 text-center text-sm text-brand-gray-500">
        Bạn chưa có sản phẩm nào. Khám phá{" "}
        <a href="/portal/premium" className="font-semibold text-brand-blue hover:underline">
          Premium Resources
        </a>{" "}
        để bắt đầu.
      </div>
    </div>
  );
}
