"use client";

/* =============================================================================
 * NotificationBell — biểu tượng chuông thông báo THẬT, dùng chung cho toàn bộ
 * portal 2.0 (9 trang qua `PortalV2Shell` + 10 trang tự chép sidebar/topbar
 * riêng — cùng nhóm đã nhận `ProfileMenu` trước đó). Trước đây MỌI trang chỉ
 * có `<button className="icon-btn"><svg/><span className="badge">3</span></button>`
 * tĩnh — số 3 bịa, không có dropdown, không onClick.
 *
 * Nguồn dữ liệu THẬT tái sử dụng đúng cơ chế đã có ở Portal 1.0
 * (`src/components/portal/NotificationTicker.tsx`) — bảng `portal_banners`
 * (Admin quản qua `useCollection("portal-banners")`, cùng schema generic
 * `id/data jsonb/status/order`, đã đăng ký sẵn trong `SUPABASE_COLLECTIONS`)
 * — KHÔNG bịa bảng `notifications` mới (dự án chưa có cơ chế Realtime/bảng
 * thông báo nào, đã xác nhận qua audit ADM-V2-01 "Tổng quan → Thông báo").
 * `NotificationTicker` (1.0) từng có 0 consumer nào render nó — đây là lần
 * đầu nguồn dữ liệu này thực sự hiển thị cho người dùng, ở CẢ 2 bản (dropdown
 * này cho 2.0, `NotificationTicker` vẫn giữ nguyên không đụng cho 1.0).
 * ========================================================================== */

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import { useCollection } from "@/lib/admin/store";
import { bannersSeed, type Banner } from "@/data/admin/portalBuilder";

export function NotificationBell() {
  const router = useRouter();
  const { items, ready } = useCollection<Banner>("portal-banners", bannersSeed);
  const active = items.filter((b) => b.status === "Active");

  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  const go = (link: string | undefined) => {
    setOpen(false);
    if (link) router.push(link);
  };

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        type="button"
        className="icon-btn"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 8a6 6 0 00-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
          <path d="M13.7 21a2 2 0 01-3.4 0" />
        </svg>
        {ready && active.length > 0 ? <span className="badge">{active.length}</span> : null}
      </button>

      {open && (
        <div
          role="menu"
          style={{
            position: "absolute",
            right: 0,
            top: "calc(100% + 8px)",
            zIndex: 50,
            width: 300,
            maxHeight: 360,
            overflowY: "auto",
            borderRadius: 16,
            border: "1px solid #E5E7EB",
            background: "#fff",
            padding: 8,
            boxShadow: "0 20px 40px rgba(15,23,42,.15)",
          }}
        >
          <p
            style={{
              margin: 0,
              padding: "6px 8px",
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: "#6B7280",
            }}
          >
            Thông báo
          </p>

          {!ready ? (
            <p style={{ margin: 0, padding: "10px 8px", fontSize: 13, color: "#9CA3AF" }}>Đang tải...</p>
          ) : active.length === 0 ? (
            <p style={{ margin: 0, padding: "10px 8px", fontSize: 13, color: "#9CA3AF" }}>
              Không có thông báo mới.
            </p>
          ) : (
            active.map((banner) => (
              <button
                key={banner.id}
                type="button"
                role="menuitem"
                onClick={() => go(banner.link)}
                style={{
                  display: "flex",
                  width: "100%",
                  alignItems: "flex-start",
                  gap: 8,
                  borderRadius: 10,
                  border: "none",
                  background: "none",
                  padding: "8px 8px",
                  fontSize: 13,
                  color: "#111827",
                  cursor: "pointer",
                  textAlign: "left",
                  fontFamily: "inherit",
                  lineHeight: 1.4,
                }}
              >
                <span style={{ fontSize: 15, lineHeight: 1, flexShrink: 0 }}>{banner.icon || "🔔"}</span>
                <span>{banner.message}</span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
