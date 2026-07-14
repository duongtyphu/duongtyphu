# PMO DIRECTIVE — FOUNDER-001 (Portal Coverage First)

**Trạng thái: CHỈ THỊ BẮT BUỘC, áp dụng cho toàn bộ Sprint còn lại của Admin CMS (EPIC-02) từ thời điểm này trở đi.** Ghi lại nguyên văn để tham chiếu xuyên suốt các phiên làm việc sau này (context có thể reset giữa các sprint) — theo đúng "Không cần hỏi lại ở các Sprint sau" trong chỉ thị gốc.

---

## Nguyên văn 6 Nguyên tắc (PMO, brief FOUNDER-001)

### Nguyên tắc 1 — Portal là Reference Source duy nhất

Portal hiện tại là Reference Source duy nhất. Không thiết kế Admin theo trí nhớ. Không thiết kế theo Legacy Admin. Không thiết kế theo giả định. Mọi module trong Admin phải được đối chiếu trực tiếp với Portal hiện tại.

### Nguyên tắc 2 — Admin CMS phải quản lý được 100% Portal

Bao gồm: Menu, Parent Page, Child Page, Section, Block, CTA, Banner, Hero, Card, Form, Empty State, Dialog, Widget, SEO, Visibility, Publish, Related Content, Media, Access, Metadata. Không được bỏ sót bất kỳ nội dung nào đang tồn tại trên Portal.

### Nguyên tắc 3 — Portal có mục mới → Admin bắt buộc có nơi quản lý

Nếu Portal có thêm một mục mới, Admin bắt buộc phải có nơi quản lý mục đó. Founder không được sửa bằng code.

### Nguyên tắc 4 — Thứ tự bắt buộc khi xây Workspace

```
Portal → Portal Area → Page → Section → Content → Workspace Owner
```

Không được làm ngược lại.

### Nguyên tắc 5 — Portal Management không sở hữu dữ liệu nghiệp vụ

Không tạo dữ liệu nghiệp vụ mới trong Portal Management. Portal chỉ quản lý: Presentation, Context, Navigation, Visibility, Publish. Workspace mới là nơi sở hữu dữ liệu thật.

### Nguyên tắc 6 — Self-check bắt buộc trước khi kết thúc Sprint

Trước khi kết thúc bất kỳ Sprint nào, phải tự kiểm tra: **"Founder có thể quản lý toàn bộ nội dung của Portal hiện tại mà không cần sửa code hay chưa?"** Nếu câu trả lời là CHƯA, Sprint chưa được xem là hoàn thành.

---

## Quan hệ với `FOUNDER_DIRECTIVE_GREENFIELD_ADMIN.md`

Chỉ thị này **không thay thế** Founder Directive Greenfield Admin đã ghi ở `docs/admin/FOUNDER_DIRECTIVE_GREENFIELD_ADMIN.md` (áp dụng từ EPIC-02 trước đó, dẫn chiếu trong root `CLAUDE.md`) — cả 2 cùng hiệu lực song song, PMO Directive này **siết chặt và làm rõ thêm** một số điểm:

| Nguyên tắc FOUNDER-001 | Quan hệ với Greenfield Admin Directive |
|---|---|
| #1 (Portal = Reference Source, không thiết kế theo trí nhớ/Legacy/giả định) | Trùng khớp Mục 1 — nhắc lại, không đổi. |
| #2 (checklist 20 loại element phải quản lý được) | **Mới, cụ thể hoá thêm** Mục 6 (vốn chỉ liệt kê theo Portal Area) — nay yêu cầu rõ theo **loại thành phần UI** (Menu/Section/Block/CTA/Banner/Hero/Card/Form/Empty State/Dialog/Widget/SEO/Visibility/Publish/Related Content/Media/Access/Metadata), không chỉ theo khu vực nội dung. Dùng làm checklist đối chiếu Coverage Matrix từ Sprint tiếp theo. |
| #3 (Portal có mục mới → Admin phải có nơi quản lý ngay, không sửa code) | Cụ thể hoá Mục 6 ("Không được để lại nội dung đang hiển thị trên Portal mà chỉ có thể chỉnh sửa bằng code") — áp dụng như một quy tắc thường trực, không chỉ một lần audit. |
| #4 (Portal → Portal Area → Page → Section → Content → Workspace Owner) | Trùng khớp có mở rộng Mục 4 (Portal Coverage First 8 bước) — nay quy về đúng 6 bước theo tầng phân cấp rõ ràng hơn, thứ tự bắt buộc. |
| #5 (Portal Management chỉ Presentation/Context/Navigation/Visibility/Publish, không sở hữu dữ liệu nghiệp vụ) | Trùng khớp nguyên tắc đã áp dụng từ WEB-SPR-001 ("Website Workspace chỉ quản lý Presentation Layer, không quản lý business data") — nay **nâng thành chỉ thị PMO chính thức**, áp dụng cho mọi Workspace, không riêng Website. |
| #6 (self-check bắt buộc cuối Sprint) | **Mới** — chưa có gate tương đương trong Greenfield Admin Directive. Từ nay, mọi báo cáo Sprint EPIC-02 phải trả lời rõ câu hỏi này trong phần Acceptance/Readiness. |

## Áp dụng từ Sprint tiếp theo

- Mỗi Sprint EPIC-02 mới: phần audit đầu Sprint phải đối chiếu Portal theo đúng checklist 20 loại element (Nguyên tắc 2), không chỉ theo khu vực nội dung như trước.
- Mỗi report Sprint (docs/admin/*_FOUNDATION.md hoặc tương đương) phải có một mục **"Self-check Nguyên tắc 6"** trả lời trực tiếp câu hỏi PMO, kèm danh sách phần CHƯA đạt (nếu có) thay vì báo "hoàn thành" khi còn thiếu.
- Khi phát hiện Portal có mục mới chưa có nơi quản lý trong Admin (Nguyên tắc 3), ghi nhận là gap P1/P0 tuỳ mức độ, không mặc định để lại "sửa bằng code" trừ khi nằm ngoài phạm vi Sprint đang chạy — trường hợp đó phải nêu rõ trong Cần PMO/Founder quyết định.
- Không cần Founder/PMO nhắc lại chỉ thị này ở các brief Sprint sau — mọi Sprint EPIC-02 kể từ MEDIA-SPR-201 trở đi mặc định tuân thủ.

---

## Ghi nhận trạng thái tuân thủ tại thời điểm nhận chỉ thị (2026-07-12)

Chỉ thị này đến sau khi MEDIA-SPR-201 (Media Center Foundation) đã hoàn tất và cập nhật PR #48. Ba Workspace Foundation gần nhất (Website/Brand Studio/Media Center) đã áp dụng phần lớn tinh thần của Nguyên tắc 1/4/5 (audit Portal trước khi seed, Portal chỉ Presentation, Workspace sở hữu dữ liệu). Tuy nhiên **chưa Sprint nào tự kiểm tra theo đúng checklist 20 loại element ở Nguyên tắc 2**, và **chưa có report nào trả lời trực tiếp câu hỏi self-check ở Nguyên tắc 6** theo đúng format PMO vừa yêu cầu — đây là khoảng trống về QUY TRÌNH BÁO CÁO (không phải bằng chứng Admin đang thiếu tính năng), sẽ được áp dụng đầy đủ kể từ Sprint kế tiếp. Không tự ý retroactive-audit lại 3 Workspace đã xong khi chưa có brief PMO yêu cầu cụ thể — tránh rework ngoài phạm vi được giao.
