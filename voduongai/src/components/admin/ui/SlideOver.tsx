"use client";

import { useEffect } from "react";
import { X } from "lucide-react";

/**
 * Khung slide-over dùng chung cho mọi form sửa dữ liệu trong Admin
 * (DataTableRowPanel, và VisualEditor tái dùng lại). Chỉ lo phần khung —
 * backdrop, đóng bằng Esc/click-outside, nút đóng — nội dung form do
 * caller truyền vào qua children.
 */
export function SlideOver({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (!open) return;
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70]">
      <button type="button" aria-label="Đóng" onClick={onClose} className="absolute inset-0 bg-black/50" />
      <div className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col border-l border-gray-200 bg-white shadow-2xl">
        <div className="flex items-center justify-between border-b border-gray-200 px-5 py-4">
          <h2 className="text-sm font-extrabold text-gray-900">{title}</h2>
          <button
            type="button"
            aria-label="Đóng"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-200 text-gray-500 hover:border-brand-blue hover:text-brand-blue"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto px-5 py-5">{children}</div>
      </div>
    </div>
  );
}
