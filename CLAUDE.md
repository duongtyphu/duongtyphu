# Quy ước cho project này

## Logo (bắt buộc cho trang mới)

Mọi trang HTML mới tạo từ nay phải dùng logo SVG đồng nhất với trang chủ
(`index.html`), KHÔNG dùng pattern chữ "VDAI Academy" / khối `nav-logo-mark`
kiểu cũ (chữ "V" trong ô vuông).

**Nav (header):**
```html
<a href="index.html" class="nav-logo" style="display:inline-flex;align-items:center;text-decoration:none">
  <svg width="32" height="32" viewBox="0 0 32 32" fill="none" style="display:inline-block;flex-shrink:0"><path d="M3 5L16 28L29 5H23L16 18L9 5Z" fill="#2563EB"/><circle cx="27" cy="7.5" r="3" fill="#F97316"/></svg><span style="display:inline-flex;flex-direction:column;line-height:1;margin-left:7px"><b style="font-size:15px;font-weight:800;color:#fff;letter-spacing:1.5px;font-family:Inter,system-ui,sans-serif">VDAI</b><small style="font-size:8px;font-weight:600;color:#94a3b8;letter-spacing:3px;font-family:Inter,system-ui,sans-serif">ACADEMY</small></span>
</a>
```

**Footer:**
```html
<a href="index.html" class="footer-brand-logo" style="display:inline-flex;align-items:center;text-decoration:none">
  <svg width="40" height="40" viewBox="0 0 32 32" fill="none" style="display:inline-block;flex-shrink:0"><path d="M3 5L16 28L29 5H23L16 18L9 5Z" fill="#2563EB"/><circle cx="27" cy="7.5" r="3" fill="#F97316"/></svg><span style="display:inline-flex;flex-direction:column;line-height:1;margin-left:8px"><b style="font-size:18px;font-weight:800;color:#fff;letter-spacing:1.5px;font-family:Inter,system-ui,sans-serif">VDAI</b><small style="font-size:9px;font-weight:600;color:#94a3b8;letter-spacing:3px;font-family:Inter,system-ui,sans-serif">ACADEMY</small></span>
</a>
```

(Mobile drawer dùng cùng SVG, bọc trong `<div class="nav-logo" style="display:inline-flex;align-items:center">` thay vì `<a>`.)

Lưu ý: các trang tĩnh cũ (privacy.html, terms.html, refund-policy.html, thank-you.html, 404.html...)
vẫn còn dùng pattern cũ — chưa cần sửa lại trừ khi được yêu cầu riêng. Quy tắc này chỉ bắt buộc
áp dụng cho các trang MỚI tạo từ nay về sau.
