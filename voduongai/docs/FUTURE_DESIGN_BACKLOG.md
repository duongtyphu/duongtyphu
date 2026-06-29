# Future Design Backlog

> Nơi lưu các đề xuất Design/Visual đã được cân nhắc nhưng **chủ động dừng
> lại (deferred by Product Decision)** — không phải bị hủy, không phải bị
> từ chối vì chưa tốt, mà vì chưa đúng thời điểm ưu tiên của sản phẩm.

## Portal Design Theme Preview (Option A/B/C) — Deferred

**Ngày quyết định**: 2026-06-29 (Product Decision của Founder).

**Trạng thái**: Đã thiết kế và triển khai thử (CSS-only, scoped qua
`?theme=a/b/c`), đã verify (`tsc`/`lint`/`build` pass), sau đó **revert
toàn bộ** theo yêu cầu Founder — không giữ trong codebase ở dạng dở dang.

**Lý do dừng** (nguyên văn tinh thần từ Founder): không phải vì các
phương án chưa tốt, mà vì đây chưa phải thời điểm phù hợp. Ưu tiên số một
hiện tại của VO DUONG AI là Companion, Education, Character, Trust, Human
Experience, Long-term Architecture — không phải visual overhaul. Portal
hiện tại đã đủ tốt để tiếp tục phát triển sản phẩm.

**Khi nào quay lại**: ở một giai đoạn trưởng thành hơn, khi:
- Companion đã ổn định.
- Portal đã hoàn thiện trải nghiệm.
- Brand Identity đã chín muồi.
- Có đủ dữ liệu người dùng thực tế.

**3 hướng đã thiết kế (giữ lại để tham khảo, không phải để dùng ngay)**:

- **Option A — "The Sanctuary of Knowledge"**: nền trắng glossy, lưới ô
  vuông mờ, chữ đen, accent gradient xanh-tím nhẹ, card trắng bóng mờ —
  cảm giác "thư viện tri thức tương lai".
- **Option B — "The AI Observatory"**: nền trắng/xám rất nhạt, lưới +
  data-lines/particle tinh tế, cảm giác "AI dashboard" hơn, card có độ
  sâu rõ hơn.
- **Option C — "The Living Companion"**: nền trắng, lưới rất mờ, cộng
  thêm các yếu tố "sống" rất nhẹ (glow/leaf/seed/companion presence) —
  các module cảm giác như vùng/khu vực trong thế giới của Companion.

**Yêu cầu kỹ thuật đã được xác nhận khả thi** (giữ nguyên cho lần triển
khai sau, không cần nghiên cứu lại từ đầu):
1. Không đổi logic Portal — chỉ là lớp CSS scoped theo attribute.
2. Không phá layout — không sửa markup/component hiện có, chỉ override
   màu/nền qua `[data-portal-theme]`.
3. Theme config tách riêng theo tên `portal-theme-a/b/c`.
4. Đổi theme qua query param `?theme=a/b/c`, đọc bằng `useSearchParams()`
   trong `PortalShell.tsx` (cần bọc `<Suspense>` ở nơi gọi `PortalShell`
   trong `layout.tsx` vì Next.js yêu cầu Suspense boundary cho
   `useSearchParams()`).
5. Palette gốc đang dùng: biến `--color-gemos-*` trong `globals.css`
   (`:root`), các class `.gemos-bg`, `.gemos-glass-card`, `.gemos-gem-card`,
   `.gemos-btn-primary`, `.gemos-topbar`, `.gemos-nav-active` — đều là
   điểm override chính. Một số surface dùng hex cứng (`bg-[#0B1F4D]`,
   `text-white/*`, `border-white/*`) cần override riêng theo attribute
   scope vì không đi qua biến CSS.
6. Companion area (`CompanionGreetingBubble`, `CompanionPresence`,
   `ReturnAfterSilenceCeremony`) nên giữ nền tối ngay cả trong theme sáng
   — để Companion luôn nổi bật như một nhân vật, không hòa vào nền.
7. Mobile-first: không cần sửa gì thêm vì override chỉ đổi màu, không đổi
   markup/breakpoint.
8. Không màu rực, không animation nặng, không đụng database/admin — đều
   khả thi vì cách làm là CSS-only.

**Việc KHÔNG được làm trừ khi Founder chủ động yêu cầu lại**: không mở
Sprint mới liên quan giao diện Portal, không khôi phục code Theme
Preview, không tiếp tục Option A/B/C.

## Xem tiếp

`docs/THE_FIRST_MEETING.md`, `docs/COMPANION_GROWTH_LOG.md`,
`src/app/globals.css` (GemOS Design System).
