"use client";

import { useMemo } from "react";
import { useCollection } from "@/lib/admin/store";
import {
  NAVIGATION_GROUPS_COLLECTION_KEY,
  NAVIGATION_ITEMS_COLLECTION_KEY,
  NAVIGATION_GROUPS_SEED,
  NAVIGATION_ITEMS_SEED,
  type NavigationGroup,
  type NavigationItem,
} from "@/lib/admin/website/navigationRegistry";

/**
 * Navigation Preview (Task 5) — bản xem thử CHỈ ĐỌC, minh họa Header/
 * Sidebar sẽ trông ra sao nếu dùng đúng dữ liệu trong Registry (chỉ lấy
 * Group/Item có status "Active"). Đây KHÔNG phải Menu Builder — không kéo-
 * thả, không chỉnh sửa trực tiếp trên Preview. Preview này cũng KHÔNG phải
 * Portal thật — Portal công khai vẫn đang đọc trực tiếp từ
 * src/lib/site.ts/hubs.ts (Consumer = 0 cho Registry này, giống ghi nhận ở
 * website-workspace.md §7 cho Page Registry).
 */
export function NavigationPreview() {
  const { items: groups, ready: groupsReady } = useCollection<NavigationGroup>(
    NAVIGATION_GROUPS_COLLECTION_KEY,
    NAVIGATION_GROUPS_SEED
  );
  const { items: allItems, ready: itemsReady } = useCollection<NavigationItem>(
    NAVIGATION_ITEMS_COLLECTION_KEY,
    NAVIGATION_ITEMS_SEED
  );

  const activeGroupsByLocation = useMemo(() => {
    const active = groups.filter((g) => g.status === "Active").sort((a, b) => a.sortOrder - b.sortOrder);
    return {
      Header: active.filter((g) => g.location === "Header"),
      Sidebar: active.filter((g) => g.location === "Sidebar"),
    };
  }, [groups]);

  function activeItemsOf(groupId: string) {
    return allItems
      .filter((it) => it.groupId === groupId && it.status === "Active")
      .sort((a, b) => a.sortOrder - b.sortOrder);
  }

  if (!groupsReady || !itemsReady) {
    return <div className="h-40 animate-pulse rounded-2xl bg-white/5" />;
  }

  return (
    <div className="space-y-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <div>
        <h3 className="text-sm font-bold text-white">Navigation Preview</h3>
        <p className="mt-1 text-xs text-white/40">
          Minh họa, chỉ đọc — chỉ hiển thị Group/Item ở trạng thái Active. Chưa nối vào site công khai/Portal thật.
        </p>
      </div>

      <div>
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-white/40">Header</p>
        {activeGroupsByLocation.Header.length === 0 ? (
          <p className="text-xs text-white/30">Không có Group Header nào đang Active.</p>
        ) : (
          activeGroupsByLocation.Header.map((group) => (
            <div key={group.id} className="flex flex-wrap items-center gap-2 rounded-xl border border-white/10 bg-white/[0.02] p-3">
              {activeItemsOf(group.id).map((item) => (
                <span key={item.id} className="rounded-full bg-white/5 px-3 py-1.5 text-xs font-semibold text-white/80">
                  {item.label}
                </span>
              ))}
              {activeItemsOf(group.id).length === 0 && <span className="text-xs text-white/30">Group chưa có Item Active.</span>}
            </div>
          ))
        )}
      </div>

      <div>
        <p className="mb-2 text-[11px] font-semibold uppercase tracking-wide text-white/40">Sidebar</p>
        {activeGroupsByLocation.Sidebar.length === 0 ? (
          <p className="text-xs text-white/30">Không có Group Sidebar nào đang Active.</p>
        ) : (
          <div className="max-w-xs space-y-3 rounded-xl border border-white/10 bg-white/[0.02] p-3">
            {activeGroupsByLocation.Sidebar.map((group, idx) => (
              <div key={group.id}>
                {idx > 0 && <div className="my-2 border-t border-white/10" />}
                <ul className="space-y-1">
                  {activeItemsOf(group.id).map((item) => (
                    <li key={item.id} className="rounded-lg px-2 py-1.5 text-xs text-white/70">
                      {item.label}
                    </li>
                  ))}
                  {activeItemsOf(group.id).length === 0 && (
                    <li className="text-xs text-white/30">Group chưa có Item Active.</li>
                  )}
                </ul>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
