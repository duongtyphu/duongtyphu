# FUTURE_LIVING_IDENTITY — Roadmap kiến trúc, không phải code hiện tại

Tài liệu này mô tả một kiến trúc Identity Layer đầy đủ mà VO DUONG AI
**chưa xây** — và sẽ chỉ xây khi sản phẩm thật sự cần đến nó. Đây là
roadmap, không phải spec để implement ngay. Phần đã thật sự được code
ở Sprint 18.4 là `docs/FOUNDER_IDENTITY_FOUNDATION.md` — nhỏ hơn rất
nhiều so với những gì mô tả dưới đây.

## Vì sao roadmap này tồn tại nhưng chưa được code

VO DUONG AI chọn **Evolution Architecture**: không xây trước những cấu
trúc mà sản phẩm chưa cần, dù biết rõ chúng sẽ cần trong tương lai. Một
Identity Registry đầy đủ — với nhiều loại identity, mỗi loại có hành vi
Companion riêng — chỉ có giá trị thật khi có ít nhất hai, ba identity
thật sự cần phân biệt hành vi khác nhau. Hiện tại chỉ có một: Founder.
Xây Registry cho một identity duy nhất là overbuild — thêm độ phức tạp
không tạo giá trị ngay.

Sprint 18.4 vì vậy chủ động **rút Identity Registry đã từng được code
ra khỏi codebase**, chuyển toàn bộ ý tưởng vào tài liệu này, để giữ nền
móng (`identity_type` migration, `isFounderIdentity()`) nhỏ và sạch.

## Kiến trúc Identity Layer đầy đủ (khi cần)

Khi một Sprint tương lai thật sự cần phân biệt nhiều loại quan hệ
(không chỉ Founder), kiến trúc nên quay lại theo hướng:

- **Identity Registry** — một nơi DUY NHẤT khai báo các `IdentityType`
  Companion có thể nhận ra, mỗi loại có `title`, `description`, và một
  cờ cho biết đã có hành vi Portal nào gắn với nó hay chưa.
- **Các identity dự kiến** (tên gọi, không phải cam kết về hành vi cụ
  thể — hành vi sẽ được thiết kế đúng lúc identity đó thật sự xuất
  hiện trong sản phẩm):
  - **Guardian** — người giữ gìn giá trị gốc của VO DUONG AI.
  - **Teacher** — người dẫn dắt, truyền tri thức và kinh nghiệm.
  - **Builder** — người kiến tạo, xây những điều mới cho VO DUONG AI.
  - **Companion** — người đồng hành lâu dài, gắn bó với hành trình
    chung (khác với Companion-AI — cần đặt tên rõ ràng để tránh nhầm
    lẫn khi Sprint này thật sự đến).
  - **Contributor** — người góp sức cho VO DUONG AI bằng một việc cụ
    thể.
- **Relationship Engine** — tầng quyết định Companion nên cư xử khác
  nhau thế nào với mỗi loại identity (không phải quyền hạn — là mối
  quan hệ, đúng tinh thần `FOUNDER_HUMILITY_PRINCIPLE.md`: identity
  không phải đặc quyền, chỉ là một cách Companion hiểu mình đang đứng
  cạnh ai).
- **Living Identity** — identity không tĩnh: một người có thể bắt đầu
  là Contributor rồi trở thành Builder, hoặc giữ nhiều identity cùng
  lúc. Tầng này quyết định cách Companion phản ứng khi một identity
  thay đổi theo thời gian, không chỉ đọc một giá trị cố định.

## Điều kiện để roadmap này được code thật

Chỉ bắt đầu code lại Identity Registry khi có ít nhất MỘT trong các
điều kiện sau xảy ra thật, không phải vì "có thể sẽ cần":

1. Một identity thứ hai (Guardian/Teacher/Builder/...) có một hành vi
   Companion/Portal cụ thể cần được gate theo identity đó — không chỉ
   là một ý tưởng.
2. Một người cần giữ nhiều identity cùng lúc, hoặc identity của họ cần
   thay đổi theo thời gian, và `members.identity_type` (một cột text
   đơn) không còn đủ biểu đạt.
3. Founder Identity Foundation (`docs/FOUNDER_IDENTITY_FOUNDATION.md`)
   đã chứng minh ổn định qua ít nhất một Sprint thực tế trước khi mở
   rộng thêm độ phức tạp.

*Liên quan: `docs/FOUNDER_IDENTITY_FOUNDATION.md`,
`docs/FOUNDER_IDENTITY.md`, `docs/FOUNDER_HUMILITY_PRINCIPLE.md`,
`src/lib/portal/identity/identity-layer.ts`.*
