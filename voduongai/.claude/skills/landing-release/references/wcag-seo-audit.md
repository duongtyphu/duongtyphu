# Audit WCAG + SEO/metadata — chi tiết

## WCAG 2.2.2 — Pause, Stop, Hide (motion tự động)

Áp dụng cho mọi animation tự động chạy liên tục >5 giây (marquee công cụ,
carousel/bubble tự đổi nội dung...). **`prefers-reduced-motion` không đủ**
— đó là opt-in cấp hệ điều hành, không phải control người dùng có thể bấm
trực tiếp trên trang. Cần 1 nút pause/resume tường minh, dùng được bằng
bàn phím/cảm ứng.

Hai pattern đã dùng trong dự án, chọn theo cơ chế animation:

- **CSS animation (marquee kiểu track trượt)** — toggle
  `animationPlayState` qua inline style dựa trên state `paused`:
  ```tsx
  const [paused, setPaused] = useState(false);
  // ...
  <div style={{ animationPlayState: paused ? "paused" : undefined }}>
  ```
- **`setInterval`/`setTimeout` đổi nội dung (bubble câu hỏi...)** — KHÔNG
  tear down/tạo lại timer khi toggle (dễ gây stale closure/nhấp nháy).
  Dùng `useRef` giữ giá trị `paused` mới nhất, guard đầu callback:
  ```tsx
  const pausedRef = useRef(paused);
  useEffect(() => { pausedRef.current = paused; }, [paused]);
  // trong setInterval/setTimeout callback:
  if (pausedRef.current) return;
  ```

Nút pause cần: `aria-pressed={paused}`, `aria-label` đổi rõ theo trạng
thái (vd. "Tạm dừng cuộn danh sách công cụ" ↔ "Tiếp tục cuộn danh sách
công cụ"), và **`pointer-events-auto` tường minh** nếu nút nằm trong 1
wrapper cha có `pointer-events-none` (mẫu hay gặp khi bubble/marquee
overlay lên nội dung khác).

Verify bằng Playwright: click nút → đọc lại `aria-label`/computed style
(`animationPlayState`) → xác nhận đổi đúng cả 2 chiều (pause rồi resume).
Nếu dùng `getByRole` mà báo not-visible dù nhìn code đúng, thử lại bằng
locator theo class/selector trực tiếp trước khi kết luận có bug thật —
`getByRole` từng cho false negative trong dự án này.

## Contrast AA (4.5:1 chữ thường)

**Không đoán bằng mắt.** Tính relative luminance + contrast ratio thật
theo công thức WCAG cho từng cặp màu chữ/nền đang nghi ngờ
(`text-white/30`, `text-white/40`... trên nền `.mesh-navy` hoặc các
gradient khác), rồi so với ngưỡng 4.5:1. Chỉ sửa đúng những cặp thật sự
fail — nhiều màu tưởng như mờ (`text-white/50` trở lên, hoặc hex tuỳ
chỉnh như `#9AA1C7`) đã đạt AA sẵn, sửa thừa sẽ đổi tông màu không cần
thiết.

Quy trình gợi ý: liệt kê hết `text-white/NN` + hex tuỳ chỉnh xuất hiện
trên nền tối trong phạm vi đang audit → với mỗi giá trị, tính luminance
của foreground (trắng ở opacity NN blend lên đúng background thật, không
phải trắng thuần) và background thật tại vị trí đó → tính ratio → đánh
dấu fail nếu <4.5:1 → chỉ sửa các dòng fail (thường nâng lên `/60` trở
lên là đủ, nhưng verify lại bằng công thức, không suy đoán theo kinh
nghiệm).

## SEO / Metadata checklist

- **OG image / Twitter Card** — Next.js tự inject `og:image`/
  `twitter:image` nếu có file convention `opengraph-image.tsx`
  (`ImageResponse` từ `next/og`) trong route, **kể cả khi
  `generateMetadata()` không khai `openGraph.images` tường minh**. Kiểm
  tra sự tồn tại của file convention TRƯỚC khi kết luận "thiếu OG image"
  — xác nhận bằng curl thật vào route (`/opengraph-image?...`) xem có trả
  ảnh 200 hợp lệ không, đừng chỉ đọc `generateMetadata()`.
- **apple-touch-icon** — tạo `apple-icon.tsx` (cùng cơ chế
  `ImageResponse`, export `size`/`contentType`). **Nếu `layout.tsx` đã có
  `icons: {...}` tường minh trong `generateMetadata()`, nó sẽ CHẶN
  auto-merge của `apple-icon.tsx`** — phải tự thêm
  `icons: { ..., apple: "/apple-icon" }` vào object đó. Verify bằng build
  production sạch (`rm -rf .next && npm run build && next start`, tránh
  cache dev cũ) rồi curl xem `<link rel="apple-touch-icon">` có xuất hiện
  không.
- **Canonical URL theo từng route** — nếu đặt `alternates.canonical` ở
  `generateMetadata()` của root `layout.tsx`, nó sẽ áp dụng cho **mọi**
  route con (kể cả route không nên có canonical đó). Muốn canonical
  riêng cho 1 route cụ thể (vd. trang chủ `/`), route đó cần là 1 Server
  Component `page.tsx` với `metadata` export riêng. Nếu `page.tsx` hiện
  tại là Client Component (`"use client"`), tách theo pattern
  Server/Client split: chuyển toàn bộ nội dung client hiện có sang 1 file
  mới (`HomeClient.tsx`, giữ nguyên logic, chỉ đổi tên export), để
  `page.tsx` trở thành Server Component thuần export `metadata` +
  render `<HomeClient />`.
- **`sitemap.ts`** — phải phản ánh đúng kiến trúc nội dung hiện tại, không
  phải kiến trúc cũ. Nếu 1 quyết định nghiệp vụ đổi kiến trúc (vd. 1 loại
  nội dung chuyển từ public route sang chỉ tồn tại trong portal cần đăng
  nhập), route/slug loại đó phải bị loại khỏi sitemap — verify bằng curl
  `sitemap.xml` thật trên production, grep xem còn sót entry cũ không.
- **`robots.txt`** — đối chiếu với `sitemap.ts` xem có nhất quán không
  (route bị chặn index nhưng vẫn có trong sitemap là dấu hiệu lệch).
- **JSON-LD** (`Person`/`Organization`/`WebSite`) — kiểm tra field
  `description` không bị dùng nhầm 1 mô tả SEO chung chung khi ngữ cảnh
  cần mô tả riêng (vd. mô tả founder khác mô tả SEO tổng của site).

## Nguyên tắc chung khi audit metadata

Luôn xác nhận bằng cách đọc HTML thật (curl vào dev/production server)
thay vì chỉ đọc code `generateMetadata()`/file convention — Next.js có
nhiều lớp merge/override (file convention vs explicit config, layout kế
thừa xuống route con) dễ khiến đọc code một mình cho kết luận sai.
