"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-2xl font-extrabold text-white">Đã có lỗi xảy ra</h1>
      <p className="max-w-md text-sm text-white/50">
        Rất xin lỗi, đã có sự cố khi tải trang này. Bạn có thể thử lại hoặc quay về trang chủ.
      </p>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="rounded-lg bg-brand-blue px-5 py-2.5 text-sm font-bold text-white hover:opacity-90"
        >
          Thử lại
        </button>
        <Link
          href="/"
          className="rounded-lg border border-white/10 px-5 py-2.5 text-sm font-bold text-white hover:bg-white/5"
        >
          Về trang chủ
        </Link>
      </div>
    </div>
  );
}
