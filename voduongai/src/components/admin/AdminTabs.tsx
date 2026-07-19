"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export type AdminTab = { key: string; label: string; content: React.ReactNode };

/**
 * Tab bar generic cho Admin — không riêng cho 1 trang nào. Đồng bộ tab đang
 * chọn vào query string (`?tab=`) để có thể deep-link (vd. nút "Gửi duyệt"
 * ở dashboard mở thẳng đúng tab), khác với `ProfileTabs.tsx` bên Portal
 * (chỉ dùng `useState` nội bộ, không đồng bộ URL). Dùng ARIA
 * `role="tablist"/"tab"/aria-selected` đầy đủ. Cần bọc trong `<Suspense>`
 * ở page.tsx vì dùng `useSearchParams()`.
 */
export function AdminTabs({ tabs, paramName = "tab" }: { tabs: AdminTab[]; paramName?: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeKey = searchParams.get(paramName) ?? tabs[0]?.key;
  const active = tabs.find((t) => t.key === activeKey) ?? tabs[0];

  function selectTab(key: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set(paramName, key);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <div>
      <div role="tablist" className="flex gap-1 overflow-x-auto border-b border-gray-200">
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            role="tab"
            aria-selected={t.key === active?.key}
            onClick={() => selectTab(t.key)}
            className={`shrink-0 whitespace-nowrap rounded-t-lg px-4 py-2.5 text-sm font-semibold transition ${
              t.key === active?.key
                ? "border-b-2 border-brand-blue text-gray-900"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>
      <div role="tabpanel" className="mt-5">
        {active?.content}
      </div>
    </div>
  );
}
