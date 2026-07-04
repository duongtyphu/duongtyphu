# Audit nội dung: Học viện AI ↔ AI Workspace

Sprint: Rà soát – Phân loại – Di chuyển nội dung giữa "Học viện AI" và "AI
Workspace". Mục tiêu: đúng vai trò — **Học viện AI = HỌC**, **AI Workspace =
LÀM / THỰC HÀNH / TẠO KẾT QUẢ**.

## 1. Bảng phân loại (trạng thái trước khi sửa)

| # | Section hiện tại | Đang ở trang | File | Loại | Nên chuyển về | Lý do |
|---|---|---|---|---|---|---|
| 1 | Hero | Academy | `academy/page.tsx` | HỌC | Giữ nguyên | Đúng vai trò, đã có title/subtitle chuẩn từ sprint trước |
| 2 | Companion Guide | Academy | `CompanionGuide.tsx` | HỌC | Giữ nguyên | Banner định hướng chung, không xung đột |
| 3 | Hành trình của bạn (Journeys) | Academy | `JourneyCard.tsx` + `journey.service.ts` | HỌC/THỰC HÀNH | Giữ nguyên | Lộ trình học có cấu trúc dựa trên CKOS Collection — đúng cốt lõi "Học viện" |
| 4 | Mission pilot (Landing Page) | Academy | `LandingPageMissionPilot.tsx` | THỰC HÀNH | Giữ nguyên | Đóng vai "bài tập thực hành sau bài học" — đúng vị trí cuối hành trình học |
| 5 | Mentoring CTA | Academy | `academy/page.tsx` | TÀI NGUYÊN | Giữ nguyên | Điều hướng sang Cộng đồng, không liên quan Workspace |
| 6 | FAQ | Academy | `academy/page.tsx` | TÀI NGUYÊN | Giữ nguyên | Giải thích vai trò Học viện, không đổi |
| 7 | Hero | AI Workspace | `khong-gian-ai/page.tsx` | LÀM | Giữ nguyên | Đã đúng tinh thần "làm thật" từ sprint trước |
| 8 | Companion Desk | AI Workspace | `AiSpaceSections.tsx` | LÀM | Giữ nguyên | Đúng cốt lõi — giao việc cho Companion |
| 9 | **Theo nhu cầu công việc** | AI Workspace | `AiSpaceSections.tsx` (`WorkNeedSection`) | HỌC (khám phá) | **→ Học viện AI** | Đây là nội dung "biết nên học/làm gì theo nhu cầu" — thuộc nhóm khám phá định hướng, đúng như spec liệt kê ở mục Học viện AI |
| 10 | Workspace đề xuất | AI Workspace | `AiSpaceSections.tsx` | LÀM | Giữ nguyên | Preset workspace để tạo kết quả thật |
| 11 | Quy trình AI theo công việc (Workflows) | AI Workspace | `AiSpaceSections.tsx` | LÀM | Giữ nguyên | Chuỗi bước thực thi, không phải nội dung học |
| 12 | Prompt Library (thực hành) | AI Workspace | `AiSpaceSections.tsx` + `data/prompts.ts` | THỰC HÀNH | Giữ nguyên | Dùng để chạy prompt thật, đúng vai trò Workspace |
| 13 | AI Toolbox (Featured tools) | AI Workspace | `khong-gian-ai/page.tsx` (`ToolCard`) + `data/khong-gian-ai` | CÔNG CỤ | Giữ ở Workspace, đổi tên "AI Toolbox theo nhiệm vụ" | Spec giữ Toolbox ở Workspace (mục 7/9) cho việc chọn công cụ khi đang làm task thật |
| 14 | **Lộ trình học AI** | AI Workspace | `AiSpaceSections.tsx` (`LearningPathSection`) | HỌC | **→ Học viện AI** | Đúng chữ "học" trong tên, cấu trúc theo cấp độ — thuộc Học viện, không phải nơi làm |
| 15 | Tài nguyên AI | AI Workspace | `AiSpaceSections.tsx` (`ResourceSection`) | TÀI NGUYÊN | Giữ ở Workspace, đổi tên "Tài nguyên thực hành" | Spec liệt kê "Tài nguyên thực hành" ở cấu trúc Workspace (mục 8) |
| 16 | Blog AI (Bài viết AI mới) | AI Workspace | `khong-gian-ai/page.tsx` (`ArticleCard`) | BLOG | Giữ ở Workspace | Theo Product Decision trước đó: Blog AI dạng cập nhật công cụ KHÔNG đưa vào Học viện AI |
| 17 | Footer CTA (VDAI SOLO) | AI Workspace | `khong-gian-ai/page.tsx` | TÀI NGUYÊN | Giữ nguyên | Cross-sell khoá học trả phí, không thuộc phạm vi di chuyển |
| — | **Học AI theo nghề nghiệp** | *(không tồn tại)* | — | HỌC | Không thể di chuyển — chưa có dữ liệu/nhóm nội dung nào theo "nghề nghiệp" trong codebase (chỉ có "theo nhu cầu công việc" và "theo công cụ"). Ghi nhận làm khoảng trống nội dung cho sprint sau, không tạo mới trong sprint kiến trúc này. |
| — | **Học AI theo công cụ** | *(mới)* | Academy (mới thêm) | HỌC | Thêm section khám phá công cụ (learning framing) tại Academy, tái dùng dữ liệu `AI_TOOLS` — tách biệt với AI Toolbox "theo nhiệm vụ" vẫn ở Workspace cho việc thực thi |
| — | Bài học mới nhất | *(không tồn tại)* | — | HỌC | Chưa có model "bài học" rời rạc (chỉ có Journey/Collection) — không tạo dữ liệu giả, để trống theo đúng "không rebuild toàn bộ giao diện" |

## 2. Quyết định kiến trúc

- **Di chuyển thật** (component logic + vị trí hiển thị): `WorkNeedSection`
  ("Theo nhu cầu công việc") và `LearningPathSection` ("Lộ trình học AI") —
  gỡ khỏi `/portal/khong-gian-ai`, thêm vào `/portal/academy`. Component vẫn
  dùng chung code, chỉ đổi vị trí import + label/CTA cho khớp khung "học".
- **Thêm mới, không xoá cũ**: "Học AI theo công cụ" ở Học viện AI — tái sử
  dụng dữ liệu `AI_TOOLS` (đã có), hiển thị dạng khám phá/tìm hiểu (link tới
  trang chi tiết công cụ), không có nút "Dùng cùng Companion" (nút đó vẫn ở
  AI Toolbox bên Workspace).
- **Giữ nguyên nhưng đổi tên hiển thị**: AI Toolbox → "AI Toolbox theo nhiệm
  vụ"; Tài nguyên AI → "Tài nguyên thực hành" — chỉ đổi label cho khớp vai
  trò "làm", không đổi component/dữ liệu.
- **Không di chuyển** Prompt Library, Companion Desk, Workspace đề xuất, Quy
  trình AI, Blog AI — các nội dung này đã đúng vai trò LÀM/THỰC HÀNH hoặc đã
  có quyết định sản phẩm trước đó (Blog AI không vào Học viện AI).
- **CTA logic**: Academy tiếp tục dùng `pushCompanionIntent` (hệ Companion
  Orchestrator đã có từ trước, dùng cho Journey/Mission — không gộp vào
  `startCompanionWorkspace` trong sprint này, giữ đúng quyết định kiến trúc
  đã chốt ở sprint đổi tên menu trước đó: hai hệ thống Companion khác nhau,
  không merge). Các section mới chuyển sang Academy (`WorkNeedSection`,
  `LearningPathSection`) tiếp tục dùng `startCompanionWorkspace` như cũ vì
  logic không đổi, chỉ đổi trang hiển thị — không viết lại call site.
- **Không tạo** "Bài học mới nhất", "Workspace đang làm/gần đây", "Kết quả
  gần đây/lịch sử Workspace" — các mục này trong spec là định hướng cấu trúc
  tương lai, hiện chưa có data model tương ứng; để trống, không tạo dữ liệu
  giả (tuân thủ "không rebuild toàn bộ giao diện").

## 3. Cấu trúc sau khi sắp xếp

**Học viện AI** (`/portal/academy`): Hero → Companion Guide → Lộ trình học
AI → Học AI theo nhu cầu → Học AI theo công cụ → Hành trình của bạn (Khóa
học/Journey) → Mission pilot (Bài tập thực hành) → Mentoring CTA → FAQ.

**AI Workspace** (`/portal/khong-gian-ai`): Hero → Companion Desk → Workspace
đề xuất → Quy trình AI theo công việc → Prompt Library → AI Toolbox theo
nhiệm vụ → Tài nguyên thực hành → Blog AI → Footer CTA.
