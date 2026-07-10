"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";

/**
 * COMMUNITY CAMPUS — mục 9: Community Map.
 *
 * KHÔNG có nguồn dữ liệu vị trí thành viên thật (bảng `members` không có
 * cột city/location — xem audit trước khi build). `LOCATIONS` để rỗng
 * thay vì bịa Hồ Chí Minh/Hà Nội/Đà Nẵng — chỉ điền khi có dữ liệu xác
 * thực thật. Cấu trúc sẵn sàng: thêm phần tử vào `LOCATIONS` là đủ, component
 * tự vẽ marker + panel chi tiết, không cần đổi logic.
 *
 * KHÔNG dùng bản đồ tối/tactical/radar — nền sáng ấm, marker mềm, không
 * caro/lưới.
 */

type CommunityLocation = {
  id: string;
  name: string;
  presenceType: string;
  activity: string;
  cta?: { label: string; href: string };
  /** % toạ độ trong khung panel — chỉ dùng khi có location thật. */
  x: number;
  y: number;
};

const LOCATIONS: CommunityLocation[] = [];

export function CommunityMapPanel() {
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = LOCATIONS.find((l) => l.id === activeId) ?? null;

  return (
    <div className="campus-card relative overflow-hidden p-6 sm:p-8">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(45% 55% at 30% 30%, rgba(56,189,248,0.10), transparent 65%), radial-gradient(40% 50% at 75% 65%, rgba(52,211,153,0.09), transparent 65%), radial-gradient(35% 40% at 55% 90%, rgba(249,115,22,0.07), transparent 65%)"
        }}
      />

      <div className="relative min-h-[220px] rounded-2xl border border-dashed border-gray-200 bg-white/40">
        {LOCATIONS.length === 0 ? (
          <div className="flex min-h-[220px] flex-col items-center justify-center gap-3 px-6 text-center">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-50">
              <MapPin className="h-5 w-5 text-blue-500" />
            </div>
            <p className="max-w-sm text-sm leading-relaxed text-gray-500">
              Cộng đồng đang dần được hình thành ở những nơi đầu tiên.
            </p>
          </div>
        ) : (
          <div className="relative min-h-[280px] w-full">
            {LOCATIONS.map((loc) => (
              <button
                key={loc.id}
                type="button"
                onClick={() => setActiveId(loc.id)}
                aria-label={`Vị trí: ${loc.name}`}
                className="campus-marker-glow absolute flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-blue-500 text-white shadow-lg"
                style={{ left: `${loc.x}%`, top: `${loc.y}%` }}
              >
                <MapPin className="h-4 w-4" />
              </button>
            ))}
          </div>
        )}
      </div>

      {active && (
        <div className="campus-card relative mt-4 p-5">
          <p className="text-sm font-bold text-gray-900">{active.name}</p>
          <p className="mt-1 text-xs font-semibold text-blue-600">{active.presenceType}</p>
          <p className="mt-2 text-sm leading-relaxed text-gray-600">{active.activity}</p>
          {active.cta && (
            <a href={active.cta.href} className="mt-3 inline-block text-xs font-semibold text-blue-600 hover:underline">
              {active.cta.label} →
            </a>
          )}
        </div>
      )}

      {LOCATIONS.length === 0 && (
        <p className="relative mt-4 text-center text-xs text-gray-400">
          Chú giải: mỗi điểm trên bản đồ là một hoạt động cộng đồng thật đã xác thực — chưa hiển thị dữ liệu giả.
        </p>
      )}
    </div>
  );
}
