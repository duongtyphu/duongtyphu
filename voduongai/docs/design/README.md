# Design System — VO DUONG AI

> "Một design được Founder + Product Co-Designer phê duyệt không còn là
> ảnh minh họa. Nó là một Product Asset."

Đây là vị trí lưu mọi **Master Design** đã được phê duyệt chính thức —
không phải nơi lưu ảnh tham khảo hay bản nháp.

## Nguyên tắc Design System First (bắt buộc, áp dụng từ nay)

1. **Trước khi bắt đầu bất kỳ Sprint nào chạm tới Companion / Portal UI /
   Product Visual / Design / Animation, phải kiểm tra xem đã có Master
   Design cho phần đó chưa** (tìm trong `docs/design/`).
2. **Nếu đã có Master Design — không được tự ý redesign.** Không đổi
   shape, không đổi style, không đổi DNA theo ý mình.
3. **Nếu cần đơn giản hóa để code frontend được**, giữ đúng thứ tự ưu
   tiên bảo toàn:
   1. DNA
   2. Identity
   3. Tỷ lệ (proportions)
   4. Màu sắc (colors)
   5. Phong cách (style)

   Hiệu ứng (effects/glow/animation phức tạp) có thể giảm để tối ưu
   performance — DNA thì không.
4. **Nếu cảm thấy cần thay đổi Design System** (vì lý do kỹ thuật hoặc
   trải nghiệm), không tự thay đổi trực tiếp. Viết một mục **"Đề xuất
   thay đổi Design System"** trong Sprint Review, để Founder + Product
   Co-Designer quyết định.
5. Mục tiêu dài hạn: VO DUONG AI có **một Design Language thống nhất**
   — không phải một phong cách khác nhau mỗi Sprint. Nguyên tắc này áp
   dụng không chỉ cho Companion, mà sau này cho Portal, Build OS, Story,
   Knowledge, Human Flow, Design Language, Motion Language, Icon System.

## Cấu trúc thư mục

```
docs/design/
  README.md              ← tài liệu này
  companion/
    Companion_Master_V1.png    ← Master Design chính thức V1.0
    Companion_Guidelines.md    ← DNA, Identity, tỷ lệ, màu sắc, phong cách
    Companion_States.md        ← các trạng thái thị giác của Companion
    Companion_Motion.md        ← nguyên tắc chuyển động/animation
```

## Companion Master Design V1.0

Master Design đầu tiên của Companion đã được Founder + Product
Co-Designer phê duyệt — xem `companion/Companion_Master_V1.png` và
`companion/Companion_Guidelines.md`. Mọi Sprint từ nay kế thừa từ file
này, không bắt đầu lại từ đầu.
