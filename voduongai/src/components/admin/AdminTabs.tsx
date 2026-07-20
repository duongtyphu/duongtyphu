"use client";

import { useEffect, useRef } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export type AdminTab = { key: string; label: string; content: React.ReactNode };
export type AdminTabGroup = { label: string; keys: string[] };

/**
 * Tab bar generic cho Admin — không riêng cho 1 trang nào. Đồng bộ tab đang
 * chọn vào query string (`?tab=`) để có thể deep-link, khác với
 * `ProfileTabs.tsx` bên Portal (chỉ dùng `useState` nội bộ, không đồng bộ
 * URL). Cần bọc trong `<Suspense>` ở page.tsx vì dùng `useSearchParams()`.
 *
 * `groups` (tuỳ chọn): nhóm trực quan các tab liên quan (vd. "Nền tảng" /
 * "Năng lực" / "Quản trị") — chỉ là phân nhóm HIỂN THỊ, không tạo route
 * con nào. Bỏ trống nếu không cần nhóm.
 *
 * PMO hardening: sửa lỗi tab cuối bị cắt (thêm padding cuối vùng cuộn),
 * active tab tự cuộn vào khung nhìn khi đổi qua `?tab=`, hỗ trợ điều hướng
 * bàn phím (Trái/Phải/Home/End) đúng chuẩn ARIA tabs pattern.
 */
export function AdminTabs({
  tabs,
  groups,
  paramName = "tab",
}: {
  tabs: AdminTab[];
  groups?: AdminTabGroup[];
  paramName?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const activeKey = searchParams.get(paramName) ?? tabs[0]?.key;
  const active = tabs.find((t) => t.key === activeKey) ?? tabs[0];
  const buttonRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  useEffect(() => {
    buttonRefs.current[active?.key ?? ""]?.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "smooth" });
  }, [active?.key]);

  function selectTab(key: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set(paramName, key);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    const currentIndex = tabs.findIndex((t) => t.key === active?.key);
    if (currentIndex === -1) return;
    let nextIndex: number | null = null;
    if (e.key === "ArrowRight") nextIndex = (currentIndex + 1) % tabs.length;
    else if (e.key === "ArrowLeft") nextIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    else if (e.key === "Home") nextIndex = 0;
    else if (e.key === "End") nextIndex = tabs.length - 1;
    if (nextIndex === null) return;
    e.preventDefault();
    const nextKey = tabs[nextIndex].key;
    selectTab(nextKey);
    buttonRefs.current[nextKey]?.focus();
  }

  const orderedGroups: AdminTabGroup[] = groups ?? [{ label: "", keys: tabs.map((t) => t.key) }];

  return (
    <div>
      <div
        role="tablist"
        onKeyDown={handleKeyDown}
        className="flex items-stretch gap-1 overflow-x-auto border-b border-gray-200 pb-px pr-6"
      >
        {orderedGroups.map((group, groupIndex) => (
          <div key={group.label || groupIndex} className="flex shrink-0 items-end gap-1">
            {groupIndex > 0 && <span className="mx-1 mb-2 h-5 w-px shrink-0 self-center bg-gray-200" aria-hidden />}
            {group.label && (
              <span className="mb-2 shrink-0 self-end pr-1 text-[10px] font-bold uppercase tracking-wider text-gray-400">
                {group.label}
              </span>
            )}
            {group.keys.map((key) => {
              const tab = tabs.find((t) => t.key === key);
              if (!tab) return null;
              const isActive = tab.key === active?.key;
              return (
                <button
                  key={tab.key}
                  ref={(el) => {
                    buttonRefs.current[tab.key] = el;
                  }}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => selectTab(tab.key)}
                  className={`shrink-0 whitespace-nowrap rounded-t-lg px-4 py-2.5 text-sm font-semibold transition ${
                    isActive ? "border-b-2 border-brand-blue text-gray-900" : "text-gray-500 hover:text-gray-900"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        ))}
      </div>
      <div role="tabpanel" className="mt-5">
        {active?.content}
      </div>
    </div>
  );
}
