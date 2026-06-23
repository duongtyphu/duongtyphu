export const metadata = { title: "Sản phẩm của tôi" };

export default function MyProductsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-white">Sản phẩm của tôi</h1>
        <p className="mt-2 text-white/60">
          Sản phẩm và tài nguyên bạn đã mở khoá sẽ hiển thị tại đây.
        </p>
      </div>
      <div className="rounded-2xl border border-dashed border-white/15 bg-white/5 p-10 text-center text-sm text-white/60">
        Bạn chưa có sản phẩm nào. Khám phá{" "}
        <a href="/portal/premium" className="font-semibold text-brand-blue hover:underline">
          Tài nguyên Premium
        </a>{" "}
        để bắt đầu.
      </div>
    </div>
  );
}
