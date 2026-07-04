# Sprint R1 — Báo cáo nghiệm thu: Market Research Companion

## 1. Phạm vi nghiệm thu

Đối chiếu `PROFILE.md` (cùng thư mục) với đúng 15 yêu cầu của brief
"EPIC 03 — Sprint R1: Market Research Companion", và với 3 ràng buộc
"Không code AI / Không gọi API / Không tạo Prompt".

## 2. Checklist 15 mục

| # | Mục yêu cầu | Có trong `PROFILE.md`? | Ghi chú |
|---|---|---|---|
| 1 | Mission | ✅ §1 | 1 câu, không lặp lại Mission Department |
| 2 | Responsibilities | ✅ §2 | 5 trách nhiệm cụ thể + ranh giới rõ với Strategy Specialist/Fact Checker |
| 3 | Capability | ✅ §3 | 4 capability cụ thể (không chung chung) + `relatedCapabilityId` tham chiếu tầng Registry |
| 4 | Supported Blueprint | ✅ §4 | 3 Blueprint thật (`nghien-cuu-thi-truong` chính, 2 Blueprint hỗ trợ), khớp `AI_COMPANION_COLLABORATION.md` |
| 5 | Input | ✅ §5 | 4 loại input, phân biệt bắt buộc/tuỳ chọn |
| 6 | Output | ✅ §6 | Research Report + nguồn trích dẫn + nhãn Fact/Inference |
| 7 | Working Rules | ✅ §7 | 5 quy tắc vận hành cứng, có ranh giới rõ (không chạy khi thiếu phạm vi, không bịa dữ kiện, luôn qua Reviewer) |
| 8 | Training Curriculum | ✅ §8 | 5 năng lực cần chứng minh + cách kiểm tra tương lai (Benchmark Case), không phải huấn luyện model thật |
| 9 | QA Checklist | ✅ §9 | 7 tiêu chí kiểm tra cụ thể trước khi coi 1 Report là đạt chuẩn |
| 10 | Performance Metrics | ✅ §10 | 5 Metric, mỗi Metric có công thức đo + nguồn dữ liệu thật (không dùng số liệu giả) |
| 11 | Collaboration Rules | ✅ §11 | `receivesFrom`/`handsOffTo` khớp đúng `AI_COMPANION_COLLABORATION.md`, không tạo quan hệ mới |
| 12 | Limitations | ✅ §12 | 5 giới hạn cụ thể, không né tránh |
| 13 | Evidence Standard | ✅ §13 | Áp dụng đúng `CAPABILITY_EVIDENCE_FRAMEWORK.md`, nêu rõ điều kiện tối thiểu |
| 14 | Portfolio Mapping | ✅ §14 | `primaryCompetencyId`, điều kiện vào Portfolio (giữ nguyên khóa Sprint B4/B5), không tự promote |
| 15 | Runtime Definition | ✅ §15 | Type contract (Input/Result) — khai báo rõ "KHÔNG PHẢI CODE THẬT", không có Prompt |

**Kết quả: 15/15 mục đạt.**

## 3. Kiểm tra 3 ràng buộc cứng của brief

| Ràng buộc | Kiểm tra | Kết quả |
|---|---|---|
| Không code AI | Không có file `.ts`/`.tsx` nào được tạo hoặc sửa trong Sprint này | ✅ — chỉ 2 file Markdown mới trong `docs/companions/research/market-research/` |
| Không gọi API | Không có lệnh `fetch`/`curl` nào chạy tới `/api/ai/workforce` hay endpoint khác trong Sprint này | ✅ |
| Không tạo Prompt | Mục 15 (Runtime Definition) chỉ chứa `type` (TypeScript type declaration), không chứa văn bản hướng dẫn model, không chứa câu lệnh dạng "Bạn là..."/"Hãy..." | ✅ |

## 4. Kiểm tra tính nhất quán với kiến trúc đã khóa

| Đối chiếu | Kết quả |
|---|---|
| Không mâu thuẫn với `AI_COMPANION_REGISTRY.md` mục 2.1 (Market Research Specialist) | ✅ — cùng `companionId`, Sprint R1 chỉ mở rộng chi tiết vận hành (Working Rules/Training/QA/Metrics/Evidence/Portfolio/Runtime), không đổi Mission/Department/Capability đã có |
| Không đổi điều kiện Portfolio đã khóa (Sprint B4/B5) | ✅ — §14 nhắc lại nguyên văn điều kiện `reviewStatus: "reviewed"` + `reflectionStatus: "submitted"` |
| Không đổi `status` trong `AI_WORKFORCE_REGISTRY.md` | ✅ — §15 xác nhận Companion vẫn ở `"designed"`, không tự nâng lên `"agent-ready"` |
| Không tạo Department/Collaboration mới ngoài đã khóa | ✅ — §11 chỉ tham chiếu quan hệ đã có ở `AI_COMPANION_COLLABORATION.md` |
| AI-Agnostic (không nêu tên vendor AI cụ thể) | ✅ — toàn bộ tài liệu không nhắc Anthropic/OpenAI/model cụ thể |

## 5. Build/Test verification

Sprint này không đổi bất kỳ file code nào (`.ts`/`.tsx`) — chỉ thêm 2
file Markdown. Do đó không cần chạy lại `tsc`/`build`/`lint`/`vitest`
(không có gì để kiểm tra ảnh hưởng runtime); xác nhận qua `git status`
rằng thay đổi chỉ nằm trong `docs/companions/research/market-research/`.

## 6. Kết luận

**ĐẠT CHUẨN.** Hồ sơ `PROFILE.md` của Market Research Companion đáp ứng
đầy đủ 15/15 mục yêu cầu, tuân thủ đúng 3 ràng buộc "không code/không
API/không prompt", và nhất quán với toàn bộ kiến trúc EPIC 03/05 đã
khóa trước đó.

**→ Đủ điều kiện chuyển sang Sprint R2.**
