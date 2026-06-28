# Portal Intelligence Map

> Portal không phải một danh sách menu — nó là một hệ thống trí tuệ kết
> nối. Tài liệu này mô tả luồng tư duy nối các phần của Portal lại với
> nhau, để khi viết nội dung mới hoặc thiết kế tính năng mới, mọi quyết
> định đều giữ được sự liên kết này.

## Luồng trung tâm

```
Knowledge → Practice → Reflection → Story → Garden → Companion Insight → Next Action → Build → Connect → Legacy
```

Diễn giải từng bước:

1. **Knowledge** — Người dùng hiểu một nguyên lý mới (Knowledge OS).
2. **Practice** — Người dùng thực hành nguyên lý đó (Practice Zone /
   bài thực hành trong từng OS).
3. **Reflection** — Người dùng tự hỏi mình đã thay đổi gì sau khi thực
   hành (câu hỏi Reflection trong `PORTAL_CONTENT_STANDARD.md`).
4. **Story** — Reflection và hành động trở thành một khoảnh khắc được
   lưu lại trong My Story.
5. **Garden** — Khoảnh khắc đó nuôi dưỡng một yếu tố cụ thể của Living
   Garden (`roots/leaves/branches/flowers/light/water/gems`).
6. **Companion Insight** — Companion nhận ra mẫu hình từ Reflection và
   Garden, phản chiếu lại cho người dùng (không chỉ phản hồi từng lần).
7. **Next Action** — Companion hoặc Related Content gợi ý bước tiếp
   theo, dựa trên những gì người dùng vừa trải qua.
8. **Build** — Bước tiếp theo dẫn người dùng tới hành động tạo giá trị
   (Build OS).
9. **Connect** — Giá trị tạo ra được chia sẻ, kết nối với người khác
   (Connect OS).
10. **Legacy** — Những gì đã xây và kết nối được lưu giữ như một di sản
    (Legacy OS).

Luồng này không phải là một con đường bắt buộc tuyến tính — người dùng
có thể vào Portal ở bất kỳ điểm nào trong vòng này. Điều quan trọng là
**mỗi điểm vào đều có một đường ra hợp lý tới điểm tiếp theo**, không bao
giờ là một ngõ cụt (kết thúc bằng một module grid không dẫn đi đâu).

## Vai trò của 3 trục xuyên suốt

- **Companion** xuất hiện ở mọi bước — không phải như một trợ lý được
  gọi khi cần, mà như một người luôn quan sát hành trình và lên tiếng
  đúng lúc (xem trạng thái theo route trong `companion-identity.ts`).
- **Living Garden** là nơi mọi hành động — dù ở OS nào — đều hội tụ về
  một hình ảnh chung của sự trưởng thành, không bị chia cắt theo từng
  OS riêng lẻ.
- **My Story** là bộ nhớ dài hạn của toàn bộ luồng — nơi duy nhất người
  dùng có thể nhìn lại toàn bộ hành trình đã đi qua nhiều OS.

## Vì sao đây không phải một menu

Một menu cho phép người dùng chọn ngẫu nhiên bất kỳ mục nào và rời đi mà
không có hậu quả. Trong Portal, mỗi lựa chọn đều nuôi một yếu tố của
Living Garden, được Companion ghi nhận, và được lưu vào My Story — tức
là không có lựa chọn nào "không quan trọng". Đây là điều phân biệt một
hệ thống trí tuệ với một danh sách module.
