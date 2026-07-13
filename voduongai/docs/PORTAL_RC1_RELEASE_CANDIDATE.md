# PORTAL 4.0 — RELEASE CANDIDATE (RC1)

**Trạng thái**: 🔒 PRODUCT OWNER APPROVED — Portal Architecture chính thức
**ĐÓNG BĂNG** kể từ tài liệu này. Đây là tài liệu governance, không phải
tài liệu thiết kế mới — không platform mới, không kiến trúc mới, không
navigation mới, không khái niệm sản phẩm mới kể từ đây.

Ngày: 2026-07-10. Không có dòng code nào được viết cho brief này.

Mục tiêu sản phẩm đổi từ **"xây sản phẩm"** sang **"hoàn thiện sản
phẩm."**

---

## 1. Tuyên bố RC1

Kể từ tài liệu này, **VO DUONG AI Portal chính thức bước vào Release
Candidate 1 (RC1).**

Product Architecture được coi là **HOÀN CHỈNH** (complete) — không phải
"đủ tốt tạm thời", mà là bản kiến trúc chính thức để hoàn thiện tới khi
ra mắt. Mọi công việc từ đây tới Portal Freeze (Phase 3, mục 4) chỉ được
phép **hoàn thiện** những gì đã có — không được **mở rộng** phạm vi sản
phẩm.

---

## 2. Kiến trúc sản phẩm — ĐÓNG BĂNG

9 nền tảng dưới đây là danh sách CANONICAL, đầy đủ của Portal. **Không
platform mới nào được thêm vào mà không có sự phê duyệt riêng của Product
Owner:**

1. Home
2. Companion
3. CKOS
4. Academy
5. AI Workspace
6. Projects & Opportunities
7. Premium
8. Journey (6 cửa: Hub, Garden, My Story, Mirror, Learning Journal,
   Journey Map)
9. Community

---

## 3. Ngôn ngữ thiết kế — ĐÓNG BĂNG

Bảng nhận diện thị giác chính thức, đóng băng kể từ tài liệu này:

| Nền tảng | Route thật | Bản sắc đã duyệt |
|---|---|---|
| Home | `/portal` | Welcome Hall |
| Companion | `/portal/companion` | AI Space |
| CKOS | `/portal/ckos` (dữ liệu tại `/portal/hetrithucai`) | Knowledge Library |
| Academy | `/portal/hocvienai` | Learning Campus |
| AI Workspace | `/portal/aiworkspace` | Creative Studio |
| Projects & Opportunities | `/portal/duan-cohoi` | Opportunity Center |
| Premium | `/portal/premium` | Premium Experience |
| Journey Hub | `/portal/hanhtrinhcuatoi` | Library |
| Garden | `/portal/khuvuoncuaban` | Fairy Garden |
| My Story | `/portal/story` | Hardcover Book |
| Mirror | `/portal/mirror` | Reflection Chamber |
| Learning Journal | `/portal/nhatkyhoctap` | Personal Notebook |
| Journey Map | `/portal/hanhtrinhcuatoi/ban-do` | Explorer Map |
| Community | `/portal/congdongai` | Modern Campus |

**Ghi nhận cần Product Owner lưu ý** (không tự sửa, chỉ nêu để minh
bạch): tên "Library" được dùng cho cả Journey Hub (mục này) và "Knowledge
Library" cho CKOS — hai bản sắc gần tên nhau dù là hai không gian hoàn
toàn khác nhau (Journey Hub = ivory/museum/atrium sáng; CKOS = kho tri
thức). Không phải xung đột chức năng, chỉ là một điểm trùng tên nên biết
khi giao tiếp nội bộ.

Những bản sắc này **ĐÓNG BĂNG** — không redesign, không đổi khí quyển,
không đổi bảng màu, cho tới khi có brief riêng từ Product Owner.

---

## 4. Companion — ĐÓNG BĂNG

Companion là **một nhân cách, nhiều vai trò. Không bao giờ nhiều
Companion.**

Mọi trải nghiệm Companion trong tương lai — dù ở nền tảng nào, dù triển
khai tính năng gì — PHẢI tuân theo `COMPANION_EXPERIENCE_ARCHITECTURE.md`.
Tài liệu đó là nguồn sự thật duy nhất cho danh tính, giọng nói, ký ức, sự
phản chiếu, sự im lặng, ranh giới của Companion.

---

## 5. Nguyên tắc trải nghiệm — ĐÓNG BĂNG

Mọi quyết định thiết kế/sản phẩm từ đây trở đi phải tuân theo
`VO_DUONG_AI_EXPERIENCE_PRINCIPLES.md` — tài liệu sản phẩm cấp cao nhất,
đứng trên mọi kiến trúc khác.

---

## 6. Lộ trình phát triển tiếp theo (Roadmap)

Từ RC1 tới khi ra mắt (launch), công việc chỉ diễn ra trong đúng 4 pha
tuần tự dưới đây — không nhảy pha, không làm song song pha sau khi pha
trước chưa xong:

### PHASE 1 — Portal Master Audit

Audit toàn bộ Portal (không phải audit từng platform riêng lẻ như các
audit trước đây — CKOS/Academy/Journey/Projects đã có audit riêng, giờ
cần MỘT audit xuyên suốt toàn hệ sinh thái). Checklist đầy đủ:
`PORTAL_MASTER_AUDIT_CHECKLIST.md` (chuẩn bị sẵn ở tài liệu này, CHƯA
thực thi — chờ chỉ đạo riêng để bắt đầu).

### PHASE 2 — Portal Polish

Cải thiện typography, spacing, animation, transition, loading/skeleton,
hover, glass, motion, micro-interaction, performance — **KHÔNG đổi kiến
trúc.** Đây là pha "làm cho những gì đã có tốt hơn", không phải pha
"thêm cái mới".

### PHASE 3 — Portal Freeze

Đóng băng chính thức, không thể đảo ngược nếu không có quyết định
Product Owner mới: navigation, routes, CTA, cấu trúc sản phẩm, bản sắc
thị giác, design system, hành vi Companion, kiến trúc thông tin (IA),
kiến trúc nội dung.

### PHASE 4 — Admin Platform

Bắt đầu triển khai Admin CMS đầy đủ — nền tảng để Admin quản lý nội dung
(greeting/reflection/question library của Companion, case studies,
learning spaces, community map locations, v.v.) mà không cần chạm code,
đúng nguyên tắc CMS đã đặt ra ở `VO_DUONG_AI_EXPERIENCE_PRINCIPLES.md`
mục 12.

*(Ghi chú bổ sung sau IMP-ADR-001, tài liệu này viết trước khi ADR-007 được duyệt: Theo ADR-007 [đã được Founder/PMO phê duyệt], Phase 4 chỉ triển khai trên Admin chính thức [`src/app/admin`]; `admin.html` là Legacy, chỉ tham chiếu, không phát triển tính năng mới — xem `docs/PORTAL_ARCHITECTURE_STANDARDIZATION.md` §11 và `docs/admin/ADMIN_CMS_FOUNDATION.md`.)*

---

## 7. Quy tắc nghiêm ngặt cho toàn bộ RC1

- Không mở rộng tính năng ngoài phạm vi đã duyệt (no feature creep).
- Không trang trùng lặp.
- Không nội dung trùng lặp.
- Không dữ liệu giả.
- Không số liệu phân tích giả.
- Không ký ức Companion giả.
- Không redesign kiến trúc đã duyệt.

---

## 8. Mục tiêu cuối cùng

Product Owner cảm thấy:

> **"VO DUONG AI không còn là một bản thử nghiệm. Đây là một sản phẩm
> thật, sẵn sàng vận hành."**

---

## 9. Trạng thái hiện tại (tại thời điểm RC1)

Ghi nhận trung thực — không phải mọi thứ đã hoàn hảo, đây là RC1 chứ
không phải Freeze:

- 6/6 cửa Journey đã qua audit P7 (`JOURNEY_PLATFORM_ARCHITECTURE.md`),
  3 polish nhỏ đã áp dụng, QA thiết bị thật/screen reader thật vẫn còn
  treo.
- Community Campus vừa dựng lại hoàn chỉnh, chưa qua vòng audit toàn
  Portal.
- Đã phát hiện nhưng CHƯA sửa: `/portal/companion` và `/portal/ai-assistant`
  là hai route cùng nhận vai trò "trò chuyện với Companion" (ghi nhận ở
  `COMPANION_EXPERIENCE_ARCHITECTURE.md` mục 8) — ứng viên đầu tiên cho
  Phase 1.
- Việc bỏ tiền tố `/portal/` khỏi URL (từng được yêu cầu ở brief Portal
  Standardization) **chưa thực hiện** — rủi ro cao (middleware auth gate
  phụ thuộc đúng tiền tố này, ~1.300 chỗ tham chiếu) — vẫn là hạng mục
  treo, cần quyết định riêng trước khi đưa vào bất kỳ pha nào ở trên.
- `supabase-premium-courses.sql` — chưa xác nhận đã chạy trên Supabase
  thật (cần để kích hoạt đầy đủ luồng bật/tắt mở bán 5 chương trình
  Premium).

Đây chính là danh sách khởi điểm hợp lý cho Phase 1.

---

*Tài liệu này là governance, không phải thiết kế. Không triển khai tính
năng mới nào từ tài liệu này. Chờ chỉ đạo của Product Owner trước khi
bắt đầu Portal Master Audit (Phase 1).*
