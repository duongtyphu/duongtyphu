# Technical Debt — Learning Platform Architecture

**Status: WAITING** (nợ kỹ thuật ĐÃ ĐƯỢC PHÊ DUYỆT — không phải bug)

Ngày ghi nhận: 2026-07-09
Người quyết định: Product Owner (xem brief "PRODUCT OWNER DECISION — Payment Flow Audit approved")

## Quyết định

Sau khi review Payment Flow Audit, Product Owner **phê duyệt hiện trạng** và
quyết định:

- **KHÔNG** triển khai hệ thống tự mở khoá khoá học (automatic course unlocking).
- **KHÔNG** thêm `course_id` vào bảng `lessons`.
- **KHÔNG** thiết kế lại learning database.
- **KHÔNG** xây "My Courses" / "Learning Center".

**Lý do:** Learning Platform và Admin Platform chưa được thiết kế kiến trúc.
Tính năng mở khoá bài giảng **phải được thiết kế cùng lúc với Admin Platform
tương lai — không được thiết kế độc lập.**

## Trạng thái sản phẩm hiện tại

```
Premium Programs → Coming Soon → Payment Flow Ready → Course Unlock Pending
```

- Cả 5 chương trình Premium đang ở trạng thái **"Sắp mở đăng ký"** (điều khiển
  bằng cột `courses.status` — Admin bật/tắt tại `/admin/course-pricing`).
- Vì chưa mở bán, việc "thanh toán xong chưa có bài giảng để mở khoá" **không
  tạo rủi ro cho người dùng thật**.

## Những gì ĐÃ HOẠT ĐỘNG và phải GIỮ NGUYÊN

| Thành phần | Trạng thái | Ghi chú |
|---|---|---|
| Luồng thanh toán 2 bước | ✅ Ready | `/portal/checkout?type=course&id=…` → `order-received` → webhook SePay tự xác nhận. Mỗi card Premium mang course id riêng. |
| Kiểm tra giá server-side | ✅ Ready | `createOrder` tra giá từ bảng `courses`, không tin giá client. |
| Nhận diện sở hữu | ✅ Ready | `getPurchasedIds("course_id")` — orders `confirmed`. |
| Badge "Đã sở hữu" trên card Premium | ✅ Ready | Giữ nguyên. |
| Admin bật/tắt mở bán | ✅ Ready | Toggle `open`/`coming` tại `/admin/course-pricing`. |

## Những gì CHỦ ĐÍCH chưa có (chính là món nợ này)

1. Schema chưa có liên kết khoá học → bài giảng (bảng `lessons` không có
   `course_id`; bảng `courses` không có nội dung video).
2. `/portal/my-products` chưa nối bảng `courses` — khoá đã mua hiển thị như
   dòng lịch sử đơn hàng, chưa có trang học.
3. Chưa có "Learning Center" / trải nghiệm học theo khoá.

## Điều kiện trả nợ

- **Chỉ bắt đầu khi Product Owner ra lệnh rõ ràng** — không tự khởi động.
- Thiết kế **cùng một lần** với Admin Platform (nội dung khoá học phải
  quản trị được từ Admin, không hardcode).
- **Bắt buộc hoàn thành trước khi** bất kỳ khoá Premium nào được gạt sang
  "Đang mở bán" cho người dùng thật.

## Ghi chú cho các phiên làm việc sau

Nếu bạn (Claude/dev) đọc thấy "mua khoá học xong không có video để xem" —
đây **không phải bug cần sửa ngay**. Đọc file này trước, và chỉ hành động
khi Product Owner yêu cầu triển khai Learning Platform.
