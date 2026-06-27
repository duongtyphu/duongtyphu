# Knowledge Architecture (Sprint 8.1)

> "Trước khi Companion trả lời, Companion phải biết ngôi nhà của mình."

Tài liệu này thiết kế bản đồ tri thức của Portal — không phải để tạo
thêm tính năng, mà để bất kỳ nội dung nào thêm vào sau này (10, hay
10.000 bài) đều biết mình thuộc về đâu, và Companion (khi được nối với
một AI model thật, xem `COMPANION_BRAIN_ARCHITECTURE.md`) có thể dùng bản
đồ này để trả lời đúng ngữ cảnh thay vì chỉ tìm từ khóa.

Không có thay đổi database hay code nào đi kèm tài liệu này. Đây là
chuẩn, không phải hiện thực hóa.

## Ba Tầng của VO DUONG AI

Founder đặt ra ba tầng — mọi nhóm tri thức dưới đây thuộc về một trong
ba tầng này:

| Tầng | Vai trò | Nội dung thuộc tầng |
|---|---|---|
| **1. Human** | Trái tim — vì sao người dùng còn ở đây | Companion, Story, Character, Warmth, Community |
| **2. Knowledge** | Tri thức — điều người dùng học | AI Foundation, Prompt, Workflow, SOP, Tool, Premium |
| **3. Action** | Chuyển hóa — điều người dùng làm với tri thức | Thực hành, Dự án, Affiliate, Automation, Xây hệ thống, Chia sẻ, Dẫn dắt |

Một nội dung không tạo ra giá trị nếu chỉ nằm ở Tầng 2 mãi mãi. Tri thức
phải có đường đi sang Tầng 3 (xem Nhiệm vụ 02 — Content Relationship), và
toàn bộ trải nghiệm phải được Tầng 1 giữ ấm xuyên suốt (Companion không
chỉ sống ở `/portal/ai-assistant` — nó là cách Portal nói, ở bất kỳ tầng
nào).

## Knowledge Map

Bản đồ dưới đây ánh xạ vào cấu trúc 6-Hub thật của Portal
(`src/lib/portal/hubs.ts`) — không tạo nhóm mới song song với cấu trúc đã
có, để tránh hai bản đồ lệch nhau.

### Nhóm TRI THỨC (Tầng 2 — tương ứng Hub "Tri thức", `/portal/knowledge`)

| Nhóm con | Mục tiêu | Đối tượng | Mức độ | Liên kết |
|---|---|---|---|---|
| AI Foundation | Hiểu nền tảng AI, không sợ công nghệ | Người mới | Cơ bản | → Prompt |
| Prompt | Biết cách "nói" với AI để ra kết quả đúng | Người mới → Trung cấp | Cơ bản–Trung cấp | ← AI Foundation, → Workflow |
| Workflow | Biến nhiều bước rời rạc thành một quy trình | Trung cấp | Trung cấp | ← Prompt, → Automation, → SOP |
| SOP | Chuẩn hóa một quy trình để lặp lại nhất quán | Trung cấp → Nâng cao | Trung cấp–Nâng cao | ← Workflow, → Automation |
| Template | Khởi động nhanh, không phải học lại từ đầu | Mọi cấp | Linh hoạt | Hỗ trợ ngang cho Prompt/Workflow/SOP |
| AI Tool | Lựa chọn công cụ phù hợp với nhu cầu thật | Mọi cấp | Linh hoạt | ← Workflow |
| Automation | Tự động hóa quy trình đã chuẩn hóa | Nâng cao | Nâng cao | ← Workflow, ← SOP, → Action (Affiliate/Build System) |
| Premium | Hỗ trợ chuyên sâu cho người muốn đi nhanh hơn | Nâng cao | Nâng cao | Cắt ngang mọi nhóm trên |

### Nhóm PHÁT TRIỂN (Tầng 3 — tương ứng Hub "Hệ Kiến Tạo", `/portal/build`)

| Nhóm con | Mục tiêu | Đối tượng | Mức độ | Liên kết |
|---|---|---|---|---|
| Affiliate | Tạo thu nhập đầu tiên từ tri thức đã học | Trung cấp → Nâng cao | Trung cấp | ← Automation, ← Workflow |
| Content | Tạo nội dung thể hiện chuyên môn | Trung cấp | Trung cấp | ← Prompt, ← Template |
| Brand | Xây thương hiệu cá nhân lâu dài | Nâng cao | Nâng cao | ← Content |
| Community | Kết nối với người cùng hành trình để học nhanh hơn | Mọi cấp | Linh hoạt | Cắt ngang Tầng 1 và Tầng 3 |
| Project | Áp dụng tri thức vào một dự án cụ thể, có kết quả đo được | Nâng cao | Nâng cao | ← Automation, ← Affiliate |
| Premium | Dự án/cơ hội chuyên sâu cần đồng hành sát hơn | Nâng cao | Nâng cao | ← Project |

### Nhóm HÀNH TRÌNH (Tầng 1 — tương ứng Hub "Hành trình" + "My Legacy")

| Nhóm con | Mục tiêu | Đối tượng | Mức độ | Liên kết |
|---|---|---|---|---|
| Journey | Biết mình đang ở season nào, bước tiếp theo là gì | Mọi cấp | — | Bao trùm toàn bộ Tầng 2 + 3 |
| Story | Ghi lại hành trình bằng chính lời người dùng | Mọi cấp | — | ← bất kỳ cột mốc nào ở Tầng 2/3 |
| Character | Nhận ra phẩm chất đang được nuôi dưỡng qua hành động | Mọi cấp | — | ← Small Victories, Character Moments |
| Companion | Đồng hành xuyên suốt, không thuộc riêng một mức độ nào | Mọi cấp | — | Cắt ngang toàn bộ bản đồ |
| Legacy | Những gì còn lại sau hành trình | Nâng cao (nhìn lại) | — | ← Story, ← Project |

## Nhiệm vụ 02 — Content Relationship

Không có nội dung độc lập. Mỗi bài học có một đường đi gợi ý, không bắt
buộc, sang các loại nội dung khác:

```
Bài học (Knowledge)
   ↓
Prompt liên quan
   ↓
Workflow áp dụng Prompt đó
   ↓
Tool hỗ trợ Workflow
   ↓
Thực hành (Practice / Project — Action)
   ↓
Reflection (người dùng tự nhận ra điều gì)
   ↓
Story (được giữ lại như một phần hành trình — Human)
```

Nguyên tắc:

- Quan hệ giữa nội dung luôn là **gợi ý**, không phải đường đi bắt buộc
  duy nhất — người dùng có quyền đi theo nhịp riêng (Điều 4, 7 —
  `THE_COMPANION_CONSTITUTION.md`).
- Một nội dung có thể là điểm vào của nhiều đường đi khác nhau (ví dụ:
  một Tool có thể được tiếp cận trực tiếp, không cần qua Workflow trước).
- Quan hệ phải đi được đến Tầng 3 (Action) hoặc Tầng 1 (Human) — một
  chuỗi quan hệ chỉ lòng vòng trong Tầng 2 (bài học → bài học → bài học)
  là dấu hiệu nội dung chưa được kết nối đủ sâu.

## Product Decision #050

> "VO DUONG AI sẽ không đo lường giá trị bằng số lượng nội dung. VO DUONG
> AI sẽ đo lường giá trị bằng số lượng hành động mà tri thức đó tạo ra
> trong cuộc sống của người học."

Hệ quả trực tiếp cho Knowledge Architecture: mọi nhóm tri thức ở trên
phải có ít nhất một liên kết đi tới Tầng 3 (Action) hoặc Tầng 1 (Human).
Một nhóm tri thức không có liên kết nào ra khỏi Tầng 2 là một nhóm chưa
đạt chuẩn theo quyết định này — không phải vì nó sai, mà vì nó chưa hoàn
thiện kiến trúc.

Ghi lại đầy đủ tại `PRODUCT_DECISIONS.md`.

## Nhiệm vụ 06 — Human First

Mọi cấu trúc trong tài liệu này phải trả lời được: **"Điều này có giúp
người dùng phát triển tốt hơn trong kỷ nguyên AI không?"** Nếu một nhóm,
một liên kết, hay một tầng không trả lời được câu hỏi này — loại bỏ nó
khỏi bản đồ, dù nó có vẻ đầy đủ hơn về mặt phân loại.

## Tài liệu liên quan

- `LEARNING_PATH_ENGINE.md` — Nhiệm vụ 03
- `KNOWLEDGE_METADATA_STANDARD.md` — Nhiệm vụ 04
- `PRODUCT_DECISIONS.md` — Quyết định #050
