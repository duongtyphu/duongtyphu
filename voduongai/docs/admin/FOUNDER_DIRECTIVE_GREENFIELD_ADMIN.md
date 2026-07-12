# FOUNDER DIRECTIVE — GREENFIELD ADMIN FOR CURRENT PORTAL

**Trạng thái: CHỈ THỊ BẮT BUỘC, áp dụng cho toàn bộ Sprint Admin CMS (EPIC-02) từ thời điểm này trở đi.** Không phải một sprint riêng lẻ — đây là quy trình/nguyên tắc chi phối mọi Workspace/Sprint Admin CMS tương lai. Ghi lại nguyên văn để tham chiếu xuyên suốt các phiên làm việc sau này (context có thể reset giữa các sprint).

---

## 1. Portal hiện tại là nguồn tham chiếu sản phẩm

Portal hiện tại đã được Founder xây dựng, chỉnh sửa và thay đổi nhiều lần.

Vì vậy, **trước khi thiết kế hoặc triển khai bất kỳ Workspace nào trong Admin CMS, phải audit trực tiếp codebase Portal hiện tại** để xác định chính xác:

- Các khu vực đang hiển thị
- Nội dung đang tồn tại
- Cấu trúc danh mục
- Tên module
- Route
- Navigation
- Entity và field thực tế
- Nội dung hard-coded
- Dữ liệu local
- Dữ liệu Supabase
- Quan hệ giữa các khu vực
- Trạng thái ẩn/hiện
- Các thành phần chưa có nơi quản trị

**Không được dựa hoàn toàn vào cấu trúc Admin cũ hoặc tài liệu đã lỗi thời.**

## 2. Xây Admin CMS mới hoàn toàn

Admin CMS mới là **Greenfield Canonical Admin**.

Không cần giữ lại:

- Legacy Admin
- admin.html
- CRUD cũ
- UI Admin cũ
- Schema Admin thử nghiệm
- Dữ liệu test cũ
- Alias field cũ (VD: `titleKey`/`summaryKey`/`bodyKey` từ ADM-SPR-004 — đã hết hiệu lực)
- Backward compatibility
- Compatibility layer
- Migration dữ liệu test
- Các giải pháp tạm thời chỉ để bảo vệ dữ liệu cũ

Có thể thay thế, xóa hoặc viết lại các phần Legacy khi đến đúng phạm vi Sprint.

## 3. Không xây lại hoặc phá Portal hiện tại

Không được hiểu "Greenfield Admin" là xây lại toàn bộ Portal.

Portal hiện tại vẫn là **sản phẩm phía người dùng** và là **nguồn tham chiếu về phạm vi nội dung**.

Trong giai đoạn xây Admin:

- Không redesign Portal
- Không đổi navigation Portal
- Không thay đổi trải nghiệm người dùng ngoài phạm vi được PMO giao
- Không xóa nội dung Portal chỉ vì Admin chưa quản lý được
- Không ép Portal theo cấu trúc của Admin cũ

**Admin mới phải được thiết kế để quản lý Portal hiện tại, không phải bắt Portal hiện tại phục vụ cấu trúc Legacy Admin.**

## 4. Nguyên tắc Portal Coverage First

Quy trình bắt buộc cho **mỗi Workspace**:

1. Audit Portal hiện tại.
2. Lập Portal Coverage Matrix.
3. Xác định tất cả nội dung và dữ liệu cần quản lý.
4. Thiết kế Workspace mới phù hợp.
5. Xây schema và Content Core sạch.
6. Kết nối Admin mới với Portal.
7. Xác minh Portal vẫn hiển thị đúng.
8. Sau khi hoàn tất mới loại bỏ nguồn dữ liệu hard-coded hoặc Legacy tương ứng.

Mỗi thành phần đang xuất hiện trên Portal phải trả lời được:

- Được quản lý ở Workspace nào?
- Dùng entity/schema nào?
- Ai có quyền chỉnh sửa?
- Có thể thêm, sửa, xóa, ẩn, hiện, sắp xếp và xuất bản không?
- Sau khi Publish, khu vực nào trên Portal được cập nhật?

## 5. Clean Schema

Ưu tiên thiết kế schema mới **sạch và nhất quán**.

**Không giữ alias field** như `titleKey`/`summaryKey`/`bodyKey` chỉ để tương thích với dữ liệu test cũ.

Sử dụng Content Core chuẩn:

- `id`
- `title`
- `slug`
- `summary`
- `body`
- `metadata`
- `status`
- `visibility`
- `sort_order`
- `version`
- `author`
- `reviewer`
- `published_at`
- `created_at`
- `updated_at`

Mỗi content type có thể bổ sung field đặc thù khi thực sự cần, nhưng phải kế thừa lõi quản trị chung.

## 6. Nội dung Portal hiện tại phải được bao phủ 100%

Admin mới cuối cùng phải quản lý được toàn bộ:

- Website và Landing Page
- Menu, footer, CTA, banner và section
- Logo, favicon, hình ảnh và tài sản thương hiệu
- CKOS
- Academy
- AI Workspace
- Premium
- Projects & Opportunities
- Community
- Learning Journal
- My Journey
- Garden
- Companion
- SEO
- Media
- User-facing visibility và ordering

**Không được để lại nội dung đang hiển thị trên Portal mà chỉ có thể chỉnh sửa bằng code.**

## 7. Khi phát hiện khác biệt

Nếu code Portal hiện tại khác với tài liệu cũ:

- **Code và hành vi Portal hiện tại là bằng chứng ưu tiên.**
- Ghi nhận sự khác biệt trong báo cáo.
- Không tự đoán.
- Không tự xóa.
- Trình PMO quyết định khi khác biệt ảnh hưởng đến product ownership hoặc business logic.

## 8. Quy tắc triển khai

**Architecture quality và khả năng quản trị lâu dài được ưu tiên hơn tương thích với Admin cũ.**

**Mục tiêu cuối cùng:** Founder có thể quản lý toàn bộ VO DUONG AI từ Canonical Admin CMS mới mà không cần sửa code cho các công việc nội dung thường ngày.

---

## Tác động tới các quyết định đã có trước đây

- **ADM-SPR-004's `titleKey`/`summaryKey`/`bodyKey` alias:** hết hiệu lực theo Mục 2/5. Sẽ được thay bằng Content Core chuẩn khi Workspace tương ứng (Tools/Prompts/Resources...) được audit và xây lại theo quy trình Mục 4.
- **Case Studies' đánh đổi bảng `case_study` vs `case_studies`** (ADM-SPR-004 §12): sẽ được giải quyết dứt điểm khi Workspace CKOS được audit lại theo quy trình mới — không còn cần giữ bảng cũ vì tương thích dữ liệu test.
- **Mọi quyết định "giữ nguyên vì lo ngại dữ liệu thật"** từ ADM-SPR-001 đến ADM-SPR-004 (Tools/Prompts/Resources/Case Studies không migrate) — không còn áp dụng, vì tiền đề "dữ liệu thật" đã được Founder xác nhận là sai (chỉ là dữ liệu test).
