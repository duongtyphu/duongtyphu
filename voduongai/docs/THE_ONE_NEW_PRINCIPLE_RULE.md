# The One New Principle Rule

> Sprint 21.5 "The Character Coherence". Nguyên tắc kiến trúc thường
> trực (không phải Sprint, không có Definition of Done) — cùng nhóm với
> `THE_30_YEAR_TRUST_PRINCIPLE.md`, áp dụng cho mọi Education Chapter từ
> nay về sau.

## Quy tắc

Trong mỗi **Education Chapter** (một nhóm Sprint xoay quanh một chủ đề
lớn — ví dụ Chapter "Trust" gồm Sprint 21.3/21.4/21.5), **chỉ được thêm
TỐI ĐA MỘT phẩm chất/giá trị MỚI**. Mọi Sprint còn lại trong Chapter đó
phải dùng để:

1. **Kiểm chứng** — phẩm chất đó có hoạt động đúng như mô tả không?
2. **Kết nối** — phẩm chất đó quan hệ thế nào với các phẩm chất đã có?
3. **Làm sâu** — phẩm chất đó có cơ chế thật trong code, hay vẫn chỉ là
   tài liệu/hardcode?
4. **Chuyển hoá thành hành vi** — phẩm chất đó đã thay đổi MỘT Decision
   thật nào của Companion chưa (đúng tinh thần Verification của
   `docs/MORAL_COMPASS.md`/`docs/THE_TRUST_MUST_BE_REAL.md`)?

## Vì sao cần quy tắc này

`docs/CHARACTER_COHERENCE.md` (Sprint 21.5) chỉ ra: số cặp xung đột
giữa phẩm chất tăng theo cấp số nhân khi số phẩm chất tăng. Một
Companion thêm phẩm chất mới mỗi Sprint sẽ "rộng" nhanh hơn khả năng
hiểu rõ các phẩm chất đó quan hệ với nhau — đúng rủi ro mà
`docs/CHARACTER_CONFLICT_MAP.md` cho thấy: 7 xung đột quan trọng, chỉ 1
có cơ chế thật trong code hôm nay.

Quy tắc này không cấm Companion trưởng thành — nó buộc tốc độ trưởng
thành về SỐ LƯỢNG phẩm chất phải chậm hơn tốc độ làm rõ QUAN HỆ giữa
các phẩm chất đã có, đúng nguyên tắc khép lại Sprint 21.5: "Không làm
Companion lớn hơn. Làm Companion sâu hơn."

## Cách áp dụng

Trước khi viết một Sprint thêm phẩm chất MỚI, phải tự hỏi: Education
Chapter hiện tại đã dùng "một suất phẩm chất mới" của nó chưa? Nếu đã
dùng, Sprint tiếp theo PHẢI là kiểm chứng/kết nối/làm sâu/chuyển hoá
hành vi cho phẩm chất đã có — không phải một phẩm chất khác.

Quy tắc này không có cơ chế thực thi bằng code (không cần Engine để
kiểm tra một quy tắc về quy trình viết Sprint) — nó là một ràng buộc
cho NGƯỜI quyết định Sprint tiếp theo, đúng cách `THE_30_YEAR_TRUST_PRINCIPLE.md`
là một ràng buộc cho người viết code, không phải cho runtime.

Xem tiếp: `docs/CHARACTER_COHERENCE.md`, `docs/CHARACTER_CONFLICT_MAP.md`,
`docs/THE_30_YEAR_TRUST_PRINCIPLE.md`, `docs/THE_EDUCATION_ERA.md`.
