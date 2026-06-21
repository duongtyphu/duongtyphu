# VDAI Academy — Dự án Website

## Cấu trúc
```
vdai-academy/
├── index.html          ← Trang chủ (standalone, JS đã inline)
├── assets/
│   ├── css/
│   │   └── styles.css  ← CSS chính (layout, typography, components)
│   ├── js/
│   │   ├── config.js   ← VDAI_CONFIG (đã inline vào index.html)
│   │   ├── app.js      ← Logic chính (đã inline)
│   │   └── quiz.js     ← Quiz chọn khoá học (đã inline)
│   └── images/
│       ├── hero-banner.png
│       ├── instructor-vo-duong.jpg
│       ├── instructor-hai-duong.jpg
│       └── instructor-vu-tu.jpg
├── privacy.html
├── terms.html
├── refund-policy.html
├── thank-you.html
├── 404.html
├── robots.txt
├── sitemap.xml
└── vercel.json         ← Deploy config cho Vercel
```

## Chạy local
```bash
cd vdai-academy
python3 -m http.server 8080
# Mở http://localhost:8080
```

## Lưu ý quan trọng
- `index.html` đã nhúng inline: config.js + app.js + quiz.js + ảnh bia.png (base64)
- File hoạt động độc lập khi mở trực tiếp (không cần server) nhờ JS inline
- `assets/css/styles.css` vẫn cần cho layout đầy đủ khi chạy qua server
- Deploy: push lên GitHub → connect Vercel → auto deploy

## Việc cần làm tiếp
- [ ] Điền tracking IDs: GA4, Meta Pixel, TikTok Pixel, Clarity
- [ ] Điền consultLink cho SOLO và SCALE
- [ ] Kết nối leadEndpoint (form đăng ký)
- [ ] Cập nhật học phí & lịch khai giảng cho SOLO/SCALE
- [ ] Thay logo/favicon/og-cover tạm thời bằng bộ nhận diện chính thức khi có
- [ ] Ảnh instructor Đỗ Tâm chính thức (đang dùng placeholder)
