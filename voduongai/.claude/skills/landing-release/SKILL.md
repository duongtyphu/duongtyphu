---
name: landing-release
description: Quy trình đầy đủ để audit, sửa lỗi có kiểm soát phạm vi, và release Landing Page VO DUONG AI (voduongai/, Next.js App Router) lên Production — từ kiểm tra responsive mobile/tablet/desktop, audit WCAG (motion pause, contrast), audit SEO/metadata (OG image, sitemap, canonical, apple-touch-icon, JSON-LD), chạy đủ bộ verify (tsc/eslint/vitest/build), tới safety-check trước khi merge, merge vào main, xác nhận Vercel deploy Production, và verify nội dung thật đã lên production (không chỉ tin trạng thái deploy). Dùng skill này bất cứ khi nào người dùng yêu cầu "kiểm tra landing page", "audit responsive", "sửa lỗi rồi merge/deploy", "release lên production", "kiểm tra an toàn rồi merge", hoặc mô tả một danh sách lỗi (kiểu P1/P2/P3) cần sửa trên landing page rồi đưa lên production — kể cả khi họ chỉ nói "merge lên main và deploy" mà không nhắc lại toàn bộ quy trình audit, vì bước safety-check vẫn bắt buộc phải chạy trước.
license: MIT
metadata:
  author: voduongai
  version: "1.0.0"
---

# Landing Release — VO DUONG AI Landing Page

Đóng gói lại đúng quy trình đã dùng để hoàn thiện Landing Page VO DUONG AI
(`voduongai/`, Next.js App Router, Tailwind v4, Framer Motion): audit →
sửa có kiểm soát phạm vi → verify → merge → deploy → verify lại trên
production thật. Áp dụng lại cho mọi đợt audit/fix/release sau này của
landing page (không phải Admin/Portal — 2 khu vực đó có quy tắc UI riêng
trong `voduongai/CLAUDE.md`).

**Nguyên tắc xuyên suốt:** đừng bao giờ chỉ tin vào metadata hay báo cáo
trạng thái ("build thành công", "deploy READY") — luôn xác minh bằng
bằng chứng cụ thể (đọc code thật, chạy Playwright thật, curl production
thật). Đây là bài học chạy xuyên suốt cả quy trình dưới đây.

Giao tiếp với người dùng bằng tiếng Việt.

## Tổng quan các bước

1. **Xác định phạm vi** — trước khi sửa bất cứ gì.
2. **Audit responsive** (375px/768px/1440px, sáng/tối) → xem
   `references/responsive-audit.md`.
3. **Sửa trong đúng phạm vi đã xác định.**
4. **Audit WCAG + SEO/metadata** → xem `references/wcag-seo-audit.md`.
5. **Chạy bộ verify đầy đủ** (typecheck/lint/test/build/responsive).
6. **Safety-check trước khi merge** → xem
   `references/safety-merge-deploy.md`.
7. **Merge → xác nhận Vercel deploy Production → verify nội dung thật.**
8. **Báo cáo lại bằng tiếng Việt**, kèm bằng chứng cụ thể + mọi giới hạn
   chưa verify được (ví dụ sandbox không gọi được domain riêng).

Mặc định (người dùng đã xác nhận): nếu MỌI bước safety-check ở bước 6
đều pass, được phép tự động merge + deploy mà không cần hỏi lại — nhưng
hễ có ĐÚNG MỘT điều kiện không đạt (xem checklist ở bước 6), phải dừng
lại và hỏi trước khi merge, không tự quyết định bỏ qua.

## Bước 1 — Xác định phạm vi trước khi sửa

Đừng tự suy rộng phạm vi từ 1 báo cáo lỗi. Khi người dùng đưa 1 danh sách
lỗi (ví dụ dạng P1/P2/P3) kèm quyết định nghiệp vụ ("bỏ hẳn Blog AI",
"CTA vẫn trỏ /login theo quyết định cũ"...), đọc kỹ xem mỗi mục có đang
thu hẹp/mở rộng phạm vi kỹ thuật so với báo cáo lỗi gốc hay không — sửa
đúng những gì được yêu cầu, không tiện tay dọn thêm những phần liên quan
nhưng ngoài phạm vi (ví dụ: được yêu cầu "sửa sitemap" vì bỏ Blog AI
không có nghĩa là phải xoá luôn route `/blogai`, trừ khi được yêu cầu rõ).

Nếu 1 bug responsive/UI đã được người dùng xác nhận rõ nguyên nhân và
phạm vi sửa (kiểu "chỉ sửa đúng lỗi X trên mobile, không đổi tablet/
desktop/theme/thứ tự"), tuân thủ đúng các ràng buộc đó — coi chúng như
yêu cầu bắt buộc, không phải gợi ý.

## Bước 2 — Audit responsive

Đọc `references/responsive-audit.md` trước khi bắt đầu — có sẵn script
mẫu (`scripts/responsive-check.cjs`) dùng Playwright + Chromium đã cài
sẵn trong môi trường (`/opt/pw-browsers/chromium`, không tự
`playwright install`).

Điểm mấu chốt hay gây lỗi thật trong dự án này: layout Tailwind hỗn hợp
`w-[Npx]` + `flex-1` — `flex-1` áp `flex-basis: 0%` đè lên `w-[...]`, gây
sập độ rộng thẻ ở mobile dù nhìn code tưởng đã có `w-[...]` cố định. Khi
audit thấy thẻ/card bị co lại bất thường ở màn hình hẹp, kiểm tra ngay tổ
hợp class này trước khi nghi ngờ nguyên nhân khác.

## Bước 3 — Sửa trong đúng phạm vi

- Diff tối thiểu, đúng scope đã chốt ở Bước 1.
- Không đổi thứ tự phần tử, không đổi theme sáng/tối, không đổi
  spacing/typography ở breakpoint không liên quan đến bug đang sửa — trừ
  khi được yêu cầu rõ ràng.
- Nếu phát hiện thêm 1 vấn đề không nằm trong phạm vi đã chốt: báo cho
  người dùng, không tự ý sửa luôn.

## Bước 4 — Audit WCAG + SEO/metadata

Đọc `references/wcag-seo-audit.md` — checklist đầy đủ + các bẫy thường
gặp (nhầm "thiếu OG image" trong khi Next.js đã tự inject qua file
convention; quên rằng `icons` config tường minh trong `layout.tsx` sẽ
chặn auto-merge `apple-icon.tsx`; đặt canonical ở root layout sẽ đè lên
mọi route con...).

## Bước 5 — Bộ verify đầy đủ

Chạy đủ, không bỏ bước nào, và đọc kỹ output thay vì chỉ nhìn exit code:

```bash
npx tsc --noEmit
npx eslint .
npx vitest run
rm -rf .next && npm run build   # rm -rf .next nếu nghi ngờ cache cũ (route đã xoá/đổi)
```

Sau đó chạy lại `scripts/responsive-check.cjs` ở 375px/768px/1440px,
cả 2 theme sáng/tối nếu trang có theme toggle, để xác nhận không có side
effect ở breakpoint/theme khác.

Nếu có PR đang mở cho nhánh này, đọc lại tiêu đề/mô tả PR — nếu nó còn
mang nội dung cũ không khớp thực tế hiện tại (ví dụ còn ghi "KHÔNG merge"
từ 1 giai đoạn preview đã qua), cập nhật lại cho đúng TRƯỚC khi merge —
đừng để lại 1 bản ghi lịch sử sai lệch trên GitHub.

## Bước 6 — Safety-check trước khi merge

Đọc `references/safety-merge-deploy.md` để biết chi tiết từng mục. Rút
gọn checklist bắt buộc — **tất cả phải pass mới được tự động merge:**

- [ ] `git status` sạch (không có thay đổi chưa commit ngoài dự kiến)
- [ ] PR `mergeable_state == "clean"` (không conflict với base branch)
- [ ] Không có CI check nào thật sự chặn (phân biệt được check chặn thật
      với check cosmetic/bot không ảnh hưởng mergeability)
- [ ] `tsc`/`eslint`/`vitest`/`build` ở Bước 5 đều sạch
- [ ] Responsive verify ở Bước 5 không phát hiện regression
- [ ] Tiêu đề/mô tả PR đã phản ánh đúng thực tế (đã cập nhật nếu cần)

Nếu **bất kỳ** mục nào không đạt: dừng lại, báo cụ thể mục nào fail và
vì sao, hỏi người dùng trước khi đi tiếp — không tự ý bỏ qua hay merge
tạm.

## Bước 7 — Merge → Deploy → Verify production thật

1. Merge PR (`mcp__github__merge_pull_request`, `merge_method: "merge"`
   trừ khi được yêu cầu khác).
2. Với project Vercel đã git-link sẵn (trường hợp mặc định của
   `voduongai`): push/merge vào `main` **tự động** trigger deployment
   `target: "production"` — không tự gọi công cụ deploy files-based, đó
   là cho project không có git repo.
3. Poll `list_deployments`/`get_deployment` tới khi `readyState: "READY"`
   và `target: "production"`, `aliasError: null`.
4. **Verify nội dung thật** — curl thẳng vào URL production
   (`*.vercel.app` luôn reachable từ sandbox; domain riêng như
   `voduongai.com` có thể bị chặn bởi network/proxy của sandbox — đây là
   giới hạn môi trường, không phải lỗi deploy) và grep đúng những gì vừa
   sửa thực sự xuất hiện — ví dụ text mới trong Hero, thẻ `canonical`,
   nội dung `sitemap.xml`. Không báo "đã xong" chỉ vì `readyState:
   READY` — trạng thái deploy không chứng minh nội dung đúng.
5. Nếu domain riêng không gọi được từ sandbox: nói rõ điều này với người
   dùng, đừng khẳng định nó hoạt động khi chưa tự kiểm tra được — đề nghị
   người dùng tự spot-check.

## Bước 8 — Báo cáo lại

Luôn bằng tiếng Việt. Cấu trúc gợi ý:

1. Đã sửa gì (tóm tắt theo từng nhóm P1/P2/P3 hoặc theo tính năng).
2. Kết quả safety-check (liệt kê từng mục ở Bước 6 kèm trạng thái).
3. Merge commit + PR liên quan.
4. Deployment: id, trạng thái, target.
5. Bằng chứng verify nội dung thật trên production (không chỉ trạng thái).
6. Giới hạn/gap chưa tự verify được (ví dụ domain riêng), kèm đề nghị cụ
   thể để người dùng tự kiểm tra.

## Tài liệu tham khảo

- `references/responsive-audit.md` — cách audit responsive, bẫy
  `flex-1`/`w-[...]`, cách dùng script mẫu.
- `references/wcag-seo-audit.md` — checklist WCAG (motion pause,
  contrast) + SEO/metadata (OG image, sitemap, canonical, apple-icon,
  JSON-LD) kèm các bẫy Next.js file-convention hay gặp.
- `references/safety-merge-deploy.md` — chi tiết safety-check, merge,
  xác nhận deploy Vercel, verify production thật.
- `scripts/responsive-check.cjs` — script Playwright mẫu, tham số hoá
  route/breakpoint/theme, copy và chỉnh route cho đợt audit cụ thể.
