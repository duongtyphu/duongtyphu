# BOOK_LIFE_PROFILE — The Life Profile (Sprint 18.3)

"Companion không thu thập ngày sinh. Companion được người dùng tự
nguyện trao cho một ngày đáng trân trọng."

## Đây không phải Sprint thu thập ngày sinh

Trước Sprint 18.3, Portal đã có một ô "ngày sinh" trong form hồ sơ
chung (`ProfileForm.tsx`) — một trường dữ liệu chung, không có ngữ
cảnh, không có lời mời, không có cách quản lý riêng. Đó là cách thu
thập dữ liệu.

Life Profile là một thứ khác hẳn: một nơi riêng, có lời mời bằng ngôn
ngữ tự nhiên, nơi người dùng hiểu rõ TẠI SAO Companion muốn biết điều
này (để tri ân, không phải để cá nhân hoá quảng cáo), và có toàn quyền
cập nhật/ẩn/xoá bất cứ lúc nào.

## Life Profile Model

`src/lib/portal/life-profile/life-profile.ts`:

- `LifeProfileFieldKey` — hiện chỉ có `"date_of_birth"`, nhưng mô hình
  được thiết kế để mở rộng cho những điều khác mà người dùng có thể
  muốn chia sẻ trong tương lai.
- `LifeProfileEntry` — một giá trị + trạng thái hiển thị (`"shared"`
  hoặc `"hidden"`).
- `resolveSharedBirthday(profile)` — hàm DUY NHẤT mà Life Moments
  Engine (`life-moment-detector.ts`) được dùng để lấy ngày sinh. Nó chỉ
  trả về giá trị khi người dùng đang ở trạng thái `"shared"` — không
  bao giờ trả dữ liệu đã bị ẩn.

## Dữ liệu

`members.date_of_birth` (date, nullable) + `members.date_of_birth_hidden`
(boolean, default false) — xem `supabase-core-schema.sql`. RLS hiện có
trên `members` (`auth.uid() = id`) đảm bảo chỉ chính người dùng đọc/sửa
được dòng của họ — không cần thêm policy riêng.

## Vòng đời (NHIỆM VỤ 5 — cập nhật / xoá / ẩn)

`src/app/portal/account/life-profile-actions.ts`:

- `shareDateOfBirth(date)` — chia sẻ lần đầu hoặc cập nhật.
- `hideDateOfBirth(hidden)` — ẩn tạm thời, KHÔNG xoá dữ liệu. Companion
  sẽ không dùng dữ liệu này cho Birthday Life Moment khi đang ẩn, nhưng
  người dùng vẫn có thể "Hiện lại" bất cứ lúc nào mà không cần nhập lại.
- `deleteDateOfBirth()` — xoá hẳn, không thể khôi phục.

Mọi action đều do người dùng chủ động bấm trong
`LifeProfileCard.tsx` (`src/components/portal/account/LifeProfileCard.tsx`,
tab "Thông tin" ở `/portal/account`) — không có action nào tự chạy ngầm.

## Companion mời, không ép (NHIỆM VỤ 4)

Lời mời hiển thị khi chưa chia sẻ:

> "Nếu bạn muốn, mình rất muốn biết ngày sinh của bạn — không phải để
> thu thập dữ liệu, mà để có thể cùng bạn trân trọng một ngày ý nghĩa
> mỗi năm. Bạn hoàn toàn có thể bỏ qua điều này."

Không có `required` trên input, không có popup ép nhập, không nhắc lại
nhiều lần nếu người dùng không phản hồi.

## Birthday Life Moment tích hợp Life Profile (NHIỆM VỤ 7)

`src/app/portal/layout.tsx` đọc `date_of_birth`/`date_of_birth_hidden`
từ `members`, dựng `LifeProfile` qua `buildLifeProfile()`, rồi truyền
`resolveSharedBirthday(lifeProfile)` vào
`detectLifeMoment()` (`life-moment-detector.ts`). Nếu người dùng chưa
chia sẻ hoặc đang ẩn, `resolveSharedBirthday` trả `null` — Birthday Life
Moment không bao giờ kích hoạt, đúng tinh thần "không đoán dữ liệu
thiếu" của `docs/LIFE_MOMENTS_ENGINE.md`.

## Privacy First

- Không có endpoint/API nào đọc `date_of_birth` của người dùng khác.
- Không hiển thị ngày sinh cụ thể ở bất kỳ nơi nào khác trong Portal
  ngoài chính trang `/portal/account` của người dùng đó.
- Ẩn không đồng nghĩa với xoá — người dùng giữ quyền kiểm soát hoàn
  toàn, có thể đổi ý bất cứ lúc nào theo cả hai hướng.
