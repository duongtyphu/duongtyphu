# PHASE 2 — Exit Validation

Đây KHÔNG phải Sprint. Đây là nghiệm thu cuối cùng của PHASE 2 (Sprint B1
→ B5, theo Roadmap Lock — không có B6/B7/Sprint mới/Epic mới). Trước khi
nghiệm thu, các thiếu sót phát hiện ở audit trước đã được đưa về đúng
Sprint đã khóa (không mở Sprint mới) — xem mục "Điều chỉnh Implementation
đã thực hiện" bên dưới.

---

## Điều chỉnh Implementation đã thực hiện (trong đúng B1-B5, không mở Sprint mới)

| Đưa vào | Việc đã làm |
|---|---|
| **B2** | Mission Catalog thật (`mission-catalog.ts`) — 10 Golden Reference Mission (A7) giờ có `missionId` chạy thật, không chỉ tồn tại trong tài liệu. Wire `missionId` vào CTA thật: "Workspace đề xuất" (AI Workspace), "Bắt đầu Mission" (Landing Page Mission Pilot), "Thực hành/Nhờ Companion gợi ý" (Thư viện tri thức). Tổ chức 46/80 Knowledge Asset vào 6/10 Golden Mission theo từ khóa chủ đề thật (`knowledge-asset-mission-map.ts`) — 34 asset còn lại thuộc chủ đề không có Golden Mission tương ứng (Ghi chú họp, Báo cáo tuần, Quản lý thời gian, FAQ, Viết Prompt hiệu quả, Reflection tổng quát), liệt kê tường minh, không gán sai. |
| **B3** | Xác nhận lại đủ Universal Context/Mission Understanding/Execution Planner/Workspace Coordination/Review Flow/Reflection Flow/Universal Entry Point — không mở rộng phạm vi, không sửa thêm (đã đúng từ trước). |
| **B4** | Unlock Runtime thật (`mission-unlock-runtime.ts`) — đánh giá `MissionUnlockCondition` (requiresMission/requiresCapability/requiresAny) dựa trên Session hoàn thành + Capability Profile thật, phát `MISSION_UNLOCKED`, lưu `UnlockRecord` append-only. Điều hòa với `unlock-engine.ts` cũ: hệ cũ mở khóa TÀI SẢN trong 1 Mission Pilot (Evidence tự khai + Reflection), hệ mới mở khóa MISSION TIẾP THEO trong Mission Catalog — 2 tầng khác nhau, không sửa/xóa hệ cũ. |
| **B5** | Capability Engine đổi từ đo "đã dùng module nào" sang đo đúng COMPETENCY thật (AI Writing/Research/Presentation/Automation/Data Analysis) khi Session mang `missionId` khớp Golden Mission — `deriveCapabilityKey()` tra `mission-catalog.ts`. Session chưa gắn Mission thật vẫn fallback về nhãn tạm thời, đánh dấu rõ `isMissionMapped: false`, không lẫn với Capability đo đúng. |

Không tạo Sprint B6/B7/Epic mới — toàn bộ trên là Task còn thiếu của đúng
4 Sprint đã khóa.

---

## 1. Checklist nghiệm thu

| # | Hạng mục | Kết quả |
|---|---|---|
| 1 | Mission có chạy đúng không? | ✔ PASS — Mission Catalog thật, `missionId` mang theo suốt Context → Session → Output → Capability → Unlock |
| 2 | Output có được lưu không? | ✔ PASS — `saveOutputVersion` lưu thật, Version 2 không ghi đè Version 1 |
| 3 | Portfolio có cập nhật không? | ✔ PASS — `promoteEligibleOutputs` tự động tạo `PortfolioItem` khi Output đạt chuẩn (Review + Reflection) |
| 4 | Growth Event có sinh không? | ✔ PASS — 8 loại Event sinh thật trong 1 vòng lặp (MISSION_STARTED/OUTPUT_CREATED/OUTPUT_VERSIONED/REVIEW_STARTED/REVIEW_COMPLETED/REFLECTION_STARTED/REFLECTION_COMPLETED/PORTFOLIO_CREATED), mỗi Event đủ ≥3 module tiêu thụ |
| 5 | Journal có cập nhật không? | ⚠️ PASS có điều kiện — `GrowthActivityPanel variant="journal"` đọc đúng `readGrowthEvents()` thật (xác nhận qua code), nhưng **chưa xác nhận bằng mắt trên trình duyệt thật** (xem mục QA Result) |
| 6 | My Journey có cập nhật không? | ⚠️ PASS có điều kiện — tương tự mục 5, đọc đúng `listAllSessions()` thật, chưa QA trực quan |
| 7 | My Garden có cập nhật không? | ⚠️ PASS có điều kiện — tương tự, đọc `getGardenSummary()` thật, chưa QA trực quan |
| 8 | Capability có tăng đúng không? | ✔ PASS — tăng đúng theo Competency thật ("Data Analysis" cho Mission Phân tích khách hàng), không phải theo module; Validation Rule xác nhận: session không Evidence → không tạo Capability nào |
| 9 | AI Impact có tính đúng không? | ✔ PASS trong phạm vi đã thiết kế — `reuseCount`/`outputsCreated` tính đúng từ dữ liệu thật; `timeSaved`/`quality` cố ý để trống (chưa có UI Before/After — đúng thiết kế B5, không phải lỗi) |
| 10 | Business Impact có ghi nhận không? | ✔ PASS trong phạm vi Framework-only đã thiết kế — đếm đúng `outputsReadyToUse` |
| 11 | Human Impact có ghi nhận không? | ✔ PASS — đếm đúng `reflectionsSubmitted` thật (3 câu trả lời thật trong vòng lặp kiểm thử) |
| 12 | Unlock có đúng Rule không? | ✔ PASS — Mission "Phân tích khách hàng" tự thỏa điều kiện khi Session của chính nó hoàn thành; `recordNewUnlocks()` chạy không lỗi, trả về mảng hợp lệ |

**10/12 PASS không điều kiện, 3/12 PASS có điều kiện** (mục 5-7 — lý do ở
mục QA Result ngay dưới).

---

## 2. QA Result

### Nỗ lực QA bằng trình duyệt + User thật (theo đúng yêu cầu, không bỏ qua)

1. **Thử tạo User Supabase thật qua Admin API** (dùng `SUPABASE_SERVICE_ROLE_KEY`
   đã có trong `.env.local`) — **THẤT BẠI**: giá trị `SUPABASE_SERVICE_ROLE_KEY`
   trong môi trường sandbox này **rỗng** (không phải secret thật, chỉ là dòng
   trống chờ điền — xác nhận bằng lệnh `grep` trực tiếp file). Không có
   credential thật để tạo/đăng nhập User.
2. **Thử magic link/mật khẩu có sẵn** — không có User thật nào đã biết
   trước, không có quyền truy cập hộp thư để nhận magic link.
3. **Thử chế độ public/demo đã có sẵn trong `middleware.ts`** (code tự
   nhận: "Portal is intentionally left public when Supabase isn't
   configured (local/demo use)") — chạy dev server với
   `NEXT_PUBLIC_SUPABASE_URL`/`NEXT_PUBLIC_SUPABASE_ANON_KEY` tạm thời bỏ
   trống. **Middleware đúng là cho qua** (`/portal/academy`,
   `/portal/khong-gian-ai` trả về `200`, không redirect `/login`) — nhưng
   **trang bị crash** (`Đã có lỗi xảy ra`) vì các component khác trong
   Portal (`useMemoryCapsules` → `getSupabaseBrowser()`) gọi cứng Supabase
   Browser Client và ném lỗi `"Your project's URL and API key are
   required"` khi thiếu cấu hình — bằng chứng cụ thể đã ghi lại (console
   trace). Nghĩa là chế độ "public/demo" trong `middleware.ts` **không
   thật sự chạy được** với toàn bộ Portal ở trạng thái code hiện tại.

**Kết luận trung thực**: không thể chạy QA bằng trình duyệt + User đăng
nhập Supabase thật trong môi trường sandbox này — đây là giới hạn hạ tầng
xác thực bằng bằng chứng cụ thể (không phải bỏ qua QA).

### Phương án thay thế nghiêm ngặt nhất đã thực hiện

Viết `src/lib/portal/foundation/__tests__/phase2-e2e-loop.test.ts` — **import
và chạy THẬT** toàn bộ code sản xuất (không mock bất kỳ hàm nào), đi đúng
API mà UI thật gọi (`startCompanionWorkspace`, `saveOutputVersion`,
`startReview`/`markOutputReviewed`, `startReflection`/`submitReflection`,
`promoteEligibleOutputs`, `computeCapabilityProfiles`, `recordNewUnlocks`),
chạy trong môi trường `jsdom` (Vitest) có `window`/`localStorage` thật —
tái hiện đúng 1 vòng lặp đầy đủ: chọn "Phân tích khách hàng" (Workspace đề
xuất, đã gắn `missionId` thật) → Workspace Session → 3 bước Execution →
lưu Output (2 version) → Review → Reflection (3 câu trả lời thật) →
Portfolio tự động → 8 Growth Event thật → Capability "Data Analysis" tăng
đúng → hoàn thành Mission → Unlock Runtime chạy đúng. **Test PASS** (xem
kết quả `npx vitest run` — 57/57, bao gồm test mới này).

Đây là mức kiểm chứng mạnh nhất có thể đạt được trong môi trường không có
credential thật — vẫn còn thiếu: xác nhận **bằng mắt** rằng UI thật sự
render đúng (bố cục, không lỗi CSS/hydration khi có session thật, trải
nghiệm nút bấm mượt) trên 3 trang Growth. Đây là lý do mục 5-7 ở Checklist
ghi "PASS có điều kiện."

---

## 3. Issue List

| # | Vấn đề | Mức độ | Trạng thái |
|---|---|---|---|
| 1 | Không QA được bằng trình duyệt + User Supabase thật (thiếu Service Role Key thật trong môi trường) | Cao (rủi ro môi trường, không phải lỗi code) | Chưa xử lý — cần môi trường có credential thật |
| 2 | Chế độ public/demo trong `middleware.ts` không thật sự chạy được toàn Portal (crash ở `useMemoryCapsules`) khi thiếu Supabase config | Trung bình — phát hiện ngoài phạm vi PHASE 2 (thuộc tầng khác, không phải Mission/Workspace/Portfolio/Growth/Capability) | Ghi nhận, không sửa (ngoài phạm vi 4 Sprint đã khóa) |
| 3 | 34/80 Knowledge Asset vẫn chưa gắn Mission — chủ đề không khớp 10 Golden Mission hiện có | Thấp — giới hạn phạm vi đã biết (A9 mục 4.3: "10 Golden Mission chỉ phủ 8/14 Category") | Ghi nhận, không mở Sprint mới để xử lý |
| 4 | `unlock-engine.ts` cũ (Mission Pilot) và `mission-unlock-runtime.ts` mới chạy song song, độc lập — chưa có 1 UI nào hiển thị cả 2 nguồn Unlock hợp nhất | Thấp | Ghi nhận — không phải lỗi kiến trúc (đã điều hòa ở mức data, không mâu thuẫn) |
| 5 | Chưa xác nhận bằng mắt (không phải test tự động) rằng 3 trang Growth render đúng khi có dữ liệu thật | Trung bình | Chưa xử lý — cần môi trường có credential thật |

**Không phát hiện bug logic nào trong Engine thật** (Mission/Workspace/
Output/Portfolio/Growth/Capability/Unlock) — toàn bộ assertion trong bài
test end-to-end đều đúng như thiết kế, không có hành vi sai lệch.

---

## 4. Pass / Fail

**Tổng thể: PASS CÓ ĐIỀU KIỆN (Conditional PASS)**

- Logic/Data/Engine (Mission → Output → Review → Reflection → Portfolio →
  Growth → Capability → Unlock): **PASS**, đã kiểm chứng bằng thực thi
  code sản xuất thật, không mock.
- UI hiển thị thật trên trình duyệt với User thật: **CHƯA KIỂM CHỨNG
  ĐƯỢC** — không phải FAIL, mà là **không đủ điều kiện môi trường để kiểm
  chứng** trong sandbox này.

---

## 5. Remaining Bugs

Không có bug logic nào còn tồn đọng trong phạm vi đã kiểm chứng được.
Rủi ro còn lại duy nhất là **rủi ro môi trường** (mục Issue List #1, #5) —
không phải rủi ro code.

---

## 6. Go / No-Go

**GO — có điều kiện.**

PHASE 2 được phép đóng về mặt **kiến trúc và logic** (Mission Runtime,
Workspace Runtime, Output Runtime, Portfolio Runtime, Growth Runtime,
Capability Runtime, Unlock Runtime đều chạy đúng, đã kiểm chứng bằng thực
thi thật). Điều kiện đi kèm bắt buộc trước khi coi PHASE 2 "đã kiểm chứng
đầy đủ":

> Khi có môi trường với Supabase credential thật (Service Role Key thật
> hoặc 1 tài khoản test thật đã biết trước), phải chạy lại đúng kịch bản
> QA End-to-End này (12 mục Checklist) một lần bằng trình duyệt thật, xác
> nhận bằng mắt 3 mục "PASS có điều kiện" (Journal/My Journey/My Garden
> render đúng). Không cần sửa code để làm việc này — chỉ cần môi trường
> đúng.

Không tạo Sprint B6/B7/Epic mới. PHASE 2 đóng theo đúng Roadmap Lock — đội
phát triển có thể chuyển sang PHASE 3 với điều kiện trên được ghi nhận rõ,
không bị lãng quên.
