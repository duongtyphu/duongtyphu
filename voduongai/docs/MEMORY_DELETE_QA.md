# Memory Delete QA Checklist

Bổ sung cho test tự động (`src/lib/portal/__tests__/memoryCapsules.test.ts`) —
test tự động chỉ phủ logic của `deleteMemoryCapsule` (service layer). Checklist
dưới đây phủ phần không thể test bằng vitest/jsdom: UI thật, RLS thật trên
Supabase, và hành vi mạng thật. Chạy lại checklist này mỗi khi sửa luồng xoá
Memory Capsule.

## Ownership & RLS

- [ ] User A đăng nhập, vào `/portal/story`, xoá một capsule của chính mình —
      capsule biến mất khỏi timeline.
- [ ] User A không thể nhìn thấy capsule của User B (do `member_id` filter ở
      query load), nên không có đường nào để xoá capsule của người khác từ UI.
- [ ] (Kiểm tra kỹ thuật, không qua UI) Gọi trực tiếp
      `supabase.from("memory_capsules").delete().eq("id", "<id của User B>")`
      bằng session của User A — phải trả về 0 row bị xoá (RLS chặn ở DB, không
      phải chỉ chặn ở UI).

## Story Saved Capsules

- [ ] Lưu một Living Story vào My Story (Sprint 13.4), sau đó xoá đúng capsule
      đó từ menu "..." — không có lỗi, không có logic khác với capsule thường.

## UI/UX

- [ ] Nút "..." không quá nổi bật, không đứng cạnh nội dung như một CTA chính.
- [ ] Dialog xác nhận hiển thị đúng copy: tiêu đề "Bạn muốn xoá ký ức này?",
      hai nút "Giữ lại" / "Xoá ký ức này".
- [ ] Bấm "Giữ lại" — dialog đóng, capsule không bị xoá.
- [ ] Bấm "Xoá ký ức này" — capsule biến mất, hiện dòng "Đã gỡ ký ức này khỏi
      My Story của bạn."
- [ ] Trên mobile (viewport hẹp), menu "..." và dialog vẫn bấm được dễ dàng,
      dialog không bị tràn màn hình.

## Reload & Network

- [ ] Sau khi xoá, reload lại `/portal/story` — capsule đã xoá không xuất hiện
      lại (xác nhận xoá thật trên Supabase, không chỉ ẩn ở UI).
- [ ] Tắt mạng (DevTools → Offline) rồi thử xoá — không crash trang, hiển thị
      "Hiện tại mình chưa thể xoá ký ức này. Bạn thử lại sau nhé."
