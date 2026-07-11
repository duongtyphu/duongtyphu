# 03 — Typography

## Font gốc: System UI Font Stack

Đây là chuẩn typography **bắt buộc** cho Website, Học viện AI, Admin CMS, Companion AI
và các sản phẩm tương lai của VO DUONG AI (IMP-2026-TYPO-001).

**Stack:**

```css
-apple-system,
BlinkMacSystemFont,
"Segoe UI",
Roboto,
Helvetica,
Arial,
sans-serif
```

Khai báo tại `--font-sans` trong `src/app/globals.css` (`@theme`); `--font-display` trỏ về
cùng nguồn (`var(--font-sans)`) — không phải một font riêng.

**Nguyên tắc:**

1. **Một font stack duy nhất cho toàn hệ thống.** Website tĩnh (`assets/css/styles.css`) và
   Portal Next.js dùng chung system stack này.
2. **Không dùng font giao diện thứ hai.** Không thêm Google Font hay font ngoài nếu chưa có
   quyết định kiến trúc mới từ Product Owner.
3. **UI dùng weight 400–700** (`font-weight-regular: 400`, `medium: 500`, `semibold: 600`,
   `bold: 700`). Hạn chế hoặc không dùng weight 300 cho nội dung chính, menu, button, card,
   form, dashboard, Companion message.
4. **Font monospace chỉ dành cho code và dữ liệu kỹ thuật** — không đổi khi không có lỗi.
5. **Mọi module mới phải kế thừa typography token hiện tại** (`--font-sans`/`--font-display`),
   không tự khai báo `font-family` rời rạc trong component.

*(Lịch sử: Portal từng dùng Plus Jakarta Sans qua `next/font/google` — đã loại bỏ theo
IMP-2026-TYPO-001 để đồng bộ với chuẩn system-stack toàn hệ thống.)*

## Type Scale

| Cấp | Kích thước / weight | Dùng khi | Ví dụ hiện có |
|---|---|---|---|
| **Hero** | `text-6xl`–`text-7xl`, `font-extrabold`, thường phối gradient | Tiêu đề trang biểu tượng đặc biệt (Companion Sanctuary "Companion") | `companion/page.tsx` |
| **Display** | `text-5xl`–`text-6xl`, `font-extrabold` | Tiêu đề hero của trang lớn nhưng không phải Sanctuary (Hành trình của tôi) | `hanh-trinh-cua-toi/page.tsx` |
| **Heading** | `text-2xl`–`text-3xl`, `font-extrabold` | H1 của mọi trang Portal thường | `PageHeader.tsx`, hero các hub |
| **Sub Heading** | `text-xl`, `font-extrabold`/`font-bold` | H2 mở đầu một section | Tiêu đề section trong `khu-vuon-cua-ban/page.tsx` |
| **Title** | `text-sm`–`text-base`, `font-bold` | Tiêu đề bên trong card (`.gemos-card-title`) | Mọi Card component |
| **Body** | `text-sm`–`text-base`, `font-normal`/`font-medium`, `text-gray-600`/`text-gray-700` | Nội dung mô tả, đoạn văn thường | Toàn Portal |
| **Caption** | `text-xs`, `text-gray-400`/`text-gray-500` | Meta info, nhãn phụ, timestamp | Card meta, breadcrumb |
| **Quote** | `text-lg`–`text-xl`, `italic`, `text-gray-700` | Trích dẫn triết lý, câu nói nhấn mạnh | Companion Constitution pairs |
| **Reflection** | `text-sm`–`text-base`, `italic`, `text-gray-600`, thường trong khung nền nhạt | Câu hỏi Reflection, nhật ký học tập | `hanh-trinh-cua-toi` Reflection section |
| **Thought** | `text-xs`–`text-sm`, `italic`, `text-gray-400` | Thought Seed ngẫu nhiên ở footer | Footer Companion Sanctuary / Khu vườn |
| **Companion Voice** | `text-sm`–`text-lg`, `leading-relaxed`, giọng văn ấm/khiêm tốn (xem `BRAND_VOICE_GUIDE.md` ở gốc repo) | Mọi đoạn Companion "nói" trực tiếp (Letter from Companion, Companion Reflection, Companion message ở Khu vườn) | `companion/page.tsx` The Letter, `khu-vuon-cua-ban` Companion message |

## Quy tắc

1. **Không dùng màu đen tuyệt đối (`#000000`) cho text.** Text chính dùng `--foreground: #111827` hoặc `text-gray-900`.
2. **Heading trong trang biểu tượng đặc biệt được phép phối màu** (đen→xanh→tím→cam) — xem `02-colors/README.md` mục Gradient cảm xúc chuẩn. Heading trong trang Portal thường **không** dùng gradient, giữ `text-gray-900`.
3. **Companion Voice không bao giờ dùng giọng marketing.** Không viết "AI số 1", "tốt nhất thị trường", "đột phá vượt trội" — xem quy tắc đầy đủ trong `BRAND_VOICE_GUIDE.md`.
4. **Line-height thoáng cho Body/Quote/Reflection/Companion Voice** (`leading-relaxed`) — không dùng line-height chật cho các cấp mang cảm xúc.
5. Nếu một trang cần một cấp chữ chưa có trong bảng trên, bổ sung vào bảng này trước khi dùng — không tự sáng tạo cấp chữ rời rạc trong component.

## Ghi chú về font script

`GARDEN_DESIGN_SPEC.md`/Design Reference trước có đề cập khả năng dùng font script-style cho subtitle nếu hệ thống hỗ trợ tốt tiếng Việt. Hiện tại **chưa áp dụng** — subtitle "truyền cảm hứng" đang dùng Plus Jakarta Sans `italic font-medium` + gradient màu, không dùng font script riêng. Nếu sau này có nhu cầu, phải thêm token font mới vào bảng trên trước khi dùng.
