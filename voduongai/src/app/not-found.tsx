import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <p className="text-sm font-bold uppercase tracking-wide text-brand-blue">404</p>
      <h1 className="text-2xl font-extrabold text-white">Không tìm thấy trang</h1>
      <p className="max-w-md text-sm text-white/50">
        Trang bạn tìm không tồn tại hoặc đã được di chuyển.
      </p>
      <Link
        href="/"
        className="rounded-lg bg-brand-blue px-5 py-2.5 text-sm font-bold text-white hover:opacity-90"
      >
        Về trang chủ
      </Link>
    </div>
  );
}
