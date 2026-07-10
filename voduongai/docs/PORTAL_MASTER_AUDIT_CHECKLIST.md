# PORTAL MASTER AUDIT — CHECKLIST (Phase 1 của RC1)

**Trạng thái**: Checklist đã CHUẨN BỊ, **CHƯA THỰC THI**. Chờ chỉ đạo
riêng của Product Owner để bắt đầu Phase 1 (`PORTAL_RC1_RELEASE_CANDIDATE.md`
mục 6). Không mở audit này thành hành động cho tới khi có lệnh bắt đầu
rõ ràng.

Khác với các audit trước đây (CKOS, Academy, Journey P7, Projects — mỗi
audit chỉ soi MỘT platform), đây là audit **XUYÊN SUỐT TOÀN PORTAL** —
kiểm tra tính nhất quán và chất lượng của cả 9 nền tảng CÙNG LÚC, đặc
biệt ở các điểm NỐI giữa chúng (cross-link, breadcrumb, Companion xuất
hiện lặp giữa hai nền tảng, v.v. — những thứ một audit đơn-platform
không nhìn thấy được).

---

## Phạm vi — 9 nền tảng + các cửa Journey

Home · Companion · CKOS · Academy · AI Workspace · Projects &
Opportunities · Premium · Journey (Hub/Garden/My Story/Mirror/Learning
Journal/Journey Map) · Community.

---

## 1. Navigation

- [ ] Sidebar: đúng 9 mục, không trùng lặp, không mục nào trỏ route
      chết.
- [ ] Mỗi nền tảng có breadcrumb/back button nhất quán với
      `PortalBackLink` (chuẩn đã có từ Portal Standardization).
- [ ] Không còn route "mồ côi" nào (route tồn tại nhưng không có lối
      vào từ bất kỳ đâu trong Portal).
- [ ] Cross-link giữa các nền tảng (ví dụ Journey Map → Academy/CKOS/
      Premium) trỏ đúng route hiện hành, không route đã redirect.

## 2. Routes

- [ ] Không route trùng canonical (hai route khác nhau cùng phục vụ một
      chức năng — ví dụ đã phát hiện `/portal/companion` vs
      `/portal/ai-assistant`, cần xử lý ở phase này).
- [ ] Mọi redirect trong `next.config.ts` còn cần thiết (không redirect
      chết tới route cũng đã bị xoá).
- [ ] Không route nào 404 khi truy cập trực tiếp.

## 3. CTA

- [ ] Mỗi trang có ĐÚNG MỘT CTA chính, không CTA cạnh tranh nhau ở
      cùng một khoảnh khắc quyết định (đã áp dụng ở Journey P7 — mở
      rộng kiểm tra sang 3 nền tảng còn lại: Home, CKOS, Academy,
      Workspace, Projects, Premium, Community).
- [ ] Không CTA nào dẫn tới trang "coming soon" mà không có trạng thái
      trung thực rõ ràng.

## 4. CMS Readiness

- [ ] Với mỗi nền tảng: liệt kê nội dung đang hardcode có thể cần
      chuyển sang CMS ở Phase 4 (tham chiếu
      `VO_DUONG_AI_EXPERIENCE_PRINCIPLES.md` mục 12 và
      `COMPANION_EXPERIENCE_ARCHITECTURE.md` mục 11 làm khung).
- [ ] Không đề xuất CMS hoá bất kỳ nội dung nào chưa có nguồn dữ liệu
      thật (vi phạm nguyên tắc Sự thật).

## 5. Responsive

- [ ] Mobile (< 640px): không nền tảng nào vỡ bố cục, không "sụp" thành
      danh sách card chung chung mất bản sắc.
- [ ] Tablet: giữ bản sắc, giảm cột trước khi giảm chất lượng thẻ.
- [ ] Vùng chạm ≥ 44px trên toàn bộ nút/link tương tác.
- [ ] **Chưa từng chạy trên thiết bị thật** trong toàn bộ dự án tới nay
      (mọi phiên trước chỉ verify qua breakpoint/DevTools hoặc SSR HTML)
      — Phase 1 là cơ hội đầu tiên nên chạy QA thiết bị thật.

## 6. Accessibility

- [ ] Contrast đạt chuẩn WCAG AA ở mọi khí quyển (đặc biệt các cửa
      Journey nền tối: Garden, Mirror).
- [ ] Điều hướng bàn phím đầy đủ (Tab/Enter/Escape) cho mọi tương tác,
      kể cả Companion Presence (đã có, cần re-verify sau các thay đổi
      gần đây).
- [ ] `prefers-reduced-motion` được tôn trọng ở MỌI hiệu ứng chuyển
      động, không riêng Journey.
- [ ] ARIA label đầy đủ và đúng nghĩa (không label rỗng, không label
      sai ngữ cảnh).
- [ ] **Chưa từng test bằng screen reader thật** (VoiceOver/NVDA) —
      hạng mục treo từ Journey P6, vẫn là item Phase 1.

## 7. Performance

- [ ] Không animation/particle nặng không cần thiết (đã audit Journey ở
      P7 — mở rộng kiểm tra Companion Presence, vì đây là component
      render trên MỌI trang Portal, ảnh hưởng rộng nhất).
- [ ] Ảnh dùng đúng `next/image` khi có thể; ảnh URL ngoài (Admin nhập)
      có lý do chính đáng để dùng `<img>` thường.
- [ ] Không fetch dữ liệu thừa (ví dụ gọi Supabase nhiều lần cho cùng
      một dữ liệu trên cùng một trang).

## 8. Companion Consistency

- [ ] Đối chiếu từng nền tảng với bảng vai trò ở
      `COMPANION_EXPERIENCE_ARCHITECTURE.md` mục 2 — Companion có đúng
      vai trò đã gán không (Host/Conversation Partner/Knowledge Guide/
      Learning Companion/Creative Collaborator/Opportunity Advisor/
      Growth Advisor/Witness).
- [ ] Không nền tảng nào có Companion xuất hiện quá 1 lần theo kiểu
      trùng lặp cùng ý.
- [ ] Xử lý điểm trùng lặp `/portal/companion` vs `/portal/ai-assistant`
      đã ghi nhận ở `COMPANION_EXPERIENCE_ARCHITECTURE.md` mục 8.
- [ ] Rà soát `CompanionFlipbook.tsx` — còn được gọi ở đâu không, nếu
      không thì loại bỏ (đã ghi nhận "CẦN RÀ SOÁT" ở audit Companion).

## 9. Visual Consistency

- [ ] Đối chiếu từng nền tảng với bảng bản sắc đã đóng băng ở
      `PORTAL_RC1_RELEASE_CANDIDATE.md` mục 3.
- [ ] Radius/shadow/spacing token dùng nhất quán trong cùng một nhóm
      nền tảng (pillar pages dùng shell `rounded-3xl` đã chuẩn hoá;
      Premium/Companion/Community/Journey dùng full-bleed khí quyển
      riêng — không lẫn hai kiểu trên cùng một trang).

## 10. Empty States

- [ ] Mọi nơi hiển thị dữ liệu thật đều có empty state trung thực khi
      không có dữ liệu (không "No data", không màn hình trắng không
      giải thích).
- [ ] Empty state vẫn đẹp, vẫn mời gọi hành động tiếp theo — không bao
      giờ khiến người dùng cảm thấy "mình đang tụt lại phía sau".

## 11. Real-Data Integrity

- [ ] Rà toàn bộ Portal tìm bất kỳ số liệu/thành tích/testimonial/hoạt
      động nào KHÔNG map được tới một nguồn dữ liệu thật hoặc một
      empty state (đối chiếu `VO_DUONG_AI_EXPERIENCE_PRINCIPLES.md`
      mục 11 — bảng "không bao giờ bịa").
- [ ] Xác nhận `supabase-premium-courses.sql` đã chạy trên môi trường
      thật (item treo từ Premium Reconstruction).

---

## Sản phẩm đầu ra dự kiến của Phase 1

Một báo cáo `PORTAL_MASTER_AUDIT_REPORT.md` (chưa tồn tại, sẽ tạo khi
Phase 1 thực sự bắt đầu) liệt kê phát hiện theo đúng 11 mục trên, phân
loại mức độ (blocker cho Freeze / nên sửa / ghi nhận cho tương lai),
không tự sửa bất cứ gì cho tới khi Product Owner duyệt phạm vi sửa.

---

*Đây là checklist chuẩn bị. Không hành động nào trong danh sách trên đã
được thực hiện. Chờ chỉ đạo của Product Owner để bắt đầu Phase 1.*
