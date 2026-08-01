# RELEASE-001 — Báo cáo phát hành v1.0.0

Ngày: 2026-08-01
Nhánh nguồn: `claude/landing-preview-nextjs` → merge vào `main`
Commit merge: `681fdbf` (PR #55)
Commit HEAD hiện tại của `main`: `0626de5`
Tag: `v1.0.0` → trỏ đúng `681fdbf` (mốc baseline release, không bao gồm 2
commit theo sau — xem mục 6).

## 1. Kiểm tra trước khi merge (Pre-merge checks)

- Xác nhận `claude/landing-preview-nextjs` không có conflict với `main`.
- `git status` sạch trên cả 2 nhánh trước khi merge — không có thay đổi dở
  dang bị cuốn theo.
- Rà lại danh sách commit trên nhánh nguồn (toàn bộ chương trình
  ADM-V2.0 8-sprint + Affiliate Program + Repository Canonicalization
  REPO-SPR-001/002) khớp đúng với các báo cáo sprint đã gửi trước đó —
  không có commit lạ/không rõ nguồn gốc.

## 2. Bộ kiểm tra hồi quy đầy đủ (Full regression suite)

Chạy trên nhánh nguồn ngay trước merge:
- `npx tsc --noEmit` — sạch.
- `npx eslint src` — sạch (chỉ còn các warning đã ghi nhận từ trước, không
  phát sinh lỗi mới).
- `npx vitest run` — 139/139 test pass.
- `rm -rf .next && npm run build` — sạch, toàn bộ route (Landing Page,
  Portal, Admin CMS 8 Workspace, Affiliate) build thành công, không route
  nào biến mất/lỗi.

## 3. Merge vào `main`

- Merge qua PR #55 (`claude/landing-preview-nextjs` → `main`), **không
  squash** — giữ nguyên lịch sử từng commit sprint để có thể truy vết/
  rollback theo từng mốc nếu cần.
- Sau merge, `main` tiếp tục nhận 2 commit độc lập (đã duyệt riêng, ngoài
  phạm vi merge PR #55):
  - `144f7b9` — sửa nền/chữ `/admin/landing` (Live-edit) khớp đúng Landing
    Page thật.
  - `0626de5` — Companion Chat MVP (`/portal/companion` chuyển từ trang
    thông tin tĩnh sang chat AI thật).

## 4. Xác nhận Production deployment

- Xác nhận Vercel project build/deploy thành công từ `main` sau merge.
- Domain Production thật hiện tại: **`voduongai.vercel.app`** — domain
  tuỳ chỉnh `voduongai.com` **CHƯA được gắn** vào Vercel project (xem mục
  7, Known Issues — cần Founder tự cấu hình trong Vercel project
  settings).

## 5. Kiểm thử khói trên Production (Smoke test)

- Landing Page (`/`) tải đúng, không lỗi console, nội dung Live-edit CMS
  (8 section) hiển thị đúng bản đã publish.
- `/portal` fallback công khai đúng thiết kế khi chưa đăng nhập (theo
  `middleware.ts`).
- Toàn bộ route `/admin/*` mẫu redirect `307` về `/admin/login` đúng như
  kỳ vọng khi chưa đăng nhập — không route nào 404/500.
- Không phát hiện lỗi runtime mới trong log Production so với trạng thái
  trước merge.

## 6. Gắn tag `v1.0.0` + Release Notes

Tag annotated `v1.0.0` đã tạo **cục bộ** tại commit `681fdbf` (mốc baseline
— cố ý KHÔNG trỏ vào `0626de5`/HEAD hiện tại, vì 2 commit sau merge là
công việc độc lập, chưa gộp vào phạm vi "Release 1.0.0" đã audit/test ở
mục 1-5). Nội dung release notes đầy đủ đã viết trong message của tag,
gồm 5 khối: Landing Page, Portal, Admin CMS v2.0, Affiliate Program,
Repository Canonicalization — cộng khối "Known Issues" (xem mục 7).

**CHƯA đẩy được lên remote** — `git push origin v1.0.0` trả về `HTTP 403`
từ proxy (đã xác nhận qua `curl .../__agentproxy/status`: không có lỗi
TLS/cấu hình proxy, đây là một quyết định từ chối ở tầng chính sách, không
phải lỗi kỹ thuật tạm thời). Theo đúng nguyên tắc "không tự ý retry khi bị
từ chối bởi chính sách tổ chức (403/407)" — đã dừng lại, không thử lại
nhiều lần dưới hình thức khác. Xác nhận qua GitHub API
(`get_tag`) rằng tag `v1.0.0` hiện **không tồn tại** trên remote
`duongtyphu/duongtyphu`.

**Cần hành động thủ công:** Founder (hoặc người có quyền push tag trên
repo) tự chạy `git push origin v1.0.0` từ máy có quyền, hoặc tạo Release
`v1.0.0` trực tiếp trên GitHub UI tại commit `681fdbf`, dùng đúng nội dung
release notes đã chuẩn bị (xem `git show v1.0.0` để lấy nguyên văn, hoặc
liên hệ để nhận lại nội dung).

## 7. Known Issues (mang nguyên từ release notes, không lặp lại nội dung mới)

- Custom domain `voduongai.com` chưa gắn vào Vercel project.
- 2 branch đã merge (`claude/vo-duong-ai-design-i4ttzr`,
  `claude/gifted-clarke-apr6vj`) chưa xoá được trên remote do chính sách
  proxy — cần Founder tự xoá qua GitHub.
- `orders_payment_reference_key` (unique index chống trùng thanh toán)
  chưa apply — cần EPIC bảo mật thanh toán riêng.
- SePay webhook có 2 triển khai song song (Supabase Edge Function vs
  `voduongai` Next.js route) — cần xác nhận cái nào đang thật sự nhận
  webhook từ SePay Dashboard.
- 18 component Portal mồ côi đã audit, khuyến nghị DELETE — chưa xoá, chờ
  EPIC dọn dẹp tiếp theo.
- **Mới phát sinh trong sprint này:** tag `v1.0.0` chưa đẩy lên remote
  (mục 6) — cần Founder tự push hoặc tạo Release qua GitHub UI.

## 8. Tổng kết / Sign-off

- **Pre-merge/regression/merge/deploy/smoke test:** hoàn tất, sạch, không
  phát hiện lỗi mới.
- **Tag + release notes:** đã soạn đầy đủ, đã tạo cục bộ, **chưa lên
  remote** — bị chặn bởi chính sách proxy (403), cần thao tác thủ công từ
  người có quyền push tag.
- **Không có tính năng mới nào được thêm** trong phạm vi RELEASE-001
  ngoài việc merge/tag/verify — đúng nguyên tắc "chỉ đóng gói, không tự ý
  mở rộng phạm vi" của quy trình release.
- Các hạng mục còn lại trong Known Issues sẽ mở thành EPIC độc lập, không
  chặn việc phát hành v1.0.0 baseline.
