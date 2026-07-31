# Audit responsive — chi tiết

## Breakpoint chuẩn dùng cho landing page này

| Breakpoint | Width | Ý nghĩa |
|---|---|---|
| Mobile | 375px | iPhone SE/mini-class, phổ biến nhất cho traffic Việt Nam |
| Tablet | 768px | iPad portrait / Tailwind `md` |
| Desktop | 1440px | Laptop phổ thông |

Nếu trang có theme sáng/tối (`useLandingTheme`, cookie
`vdai-landing-theme`), audit cả 2 theme — 1 bug chỉ lộ ra ở 1 theme là
tình huống đã từng gặp thật (chữ `text-white/30` không đạt AA chỉ trên
nền tối).

## Môi trường Playwright trong sandbox

- Chromium đã cài sẵn tại `/opt/pw-browsers/chromium`
  (`PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers`,
  `PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1`) — **không chạy
  `playwright install`**, sẽ tải lại không cần thiết.
- Launch: `chromium.launch({ executablePath: "/opt/pw-browsers/chromium" })`.
- Set theme qua cookie trước khi `page.goto` nếu cần test theme cụ thể:
  ```js
  await context.addCookies([{ name: "vdai-landing-theme", value: "dark", domain: "localhost", path: "/" }]);
  ```
- Dùng `npm run dev` (hoặc `next start` sau `npm run build` nếu muốn test
  đúng bundle production) chạy nền, đợi ready rồi mới điều hướng
  Playwright vào `http://localhost:3000/`.

## Quy trình audit

1. Chạy `scripts/responsive-check.cjs` (sửa lại danh sách route/section
   cần chụp cho đúng đợt audit) — script chụp ảnh từng breakpoint × theme
   tại nhiều điểm cuộn khác nhau trong trang (hero, các section chính,
   footer).
2. Nhìn từng ảnh, so sánh với thiết kế/kỳ vọng — chú ý:
   - Card/thẻ bị co hẹp bất thường so với `w-[...]` đã khai báo.
   - Text tràn/bị cắt ở mobile.
   - Khoảng cách (spacing) vỡ ở breakpoint hẹp.
   - Element chồng lấn (z-index/position) khi viewport nhỏ.
3. Với bug nghi ngờ do CSS, đọc trực tiếp `getComputedStyle` qua
   `page.evaluate` thay vì đoán — đặc biệt với `flex`/`grid` layout.

## Bẫy đã gặp thật: `flex-1` đè `w-[...]`

Một class list kiểu:

```html
<div class="w-[200px] flex-1 ...">
```

`flex-1` = `flex: 1 1 0%` → `flex-basis: 0%`, tức trình duyệt bỏ qua
`width` khai báo và tính lại độ rộng từ 0% + phần chia còn lại của flex
container. Ở container hẹp (mobile), phần chia còn lại có thể rất nhỏ →
card co lại gần như biến mất, dù code "nhìn như" đã cố định 200px.

**Fix đúng:** bỏ hẳn `flex-1` nếu ý đồ là width cố định, để `w-[...]`
kiểm soát hoàn toàn; nếu cần co giãn thật, dùng `flex-shrink` có kiểm
soát (`flex-shrink-0` để khoá không co, hoặc `basis-[200px]` thay vì
`flex-1`) tuỳ ý đồ thiết kế thật.

**Cách xác nhận trước khi sửa:** `page.evaluate` lấy
`getBoundingClientRect().width` của phần tử ở từng breakpoint, so với
giá trị `w-[...]` khai báo trong class — nếu lệch nhiều ở mobile nhưng
đúng ở desktop, gần như chắc chắn là bug này.

## Xác nhận không có side effect sau khi sửa

Sau khi fix 1 bug ở 1 breakpoint, luôn chụp lại **cả 3 breakpoint** (kể
cả breakpoint không liên quan tới bug) để chứng minh sửa không làm lệch
chỗ khác — đừng chỉ chụp lại đúng breakpoint vừa sửa.
