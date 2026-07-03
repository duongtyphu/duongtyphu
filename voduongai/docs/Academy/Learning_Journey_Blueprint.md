# Learning Journey Blueprint

Sprint 02 — Academy Operating System. Định nghĩa Learning Journey, đứng dưới
`Academy_Blueprint.md`, chi tiết hoá `Learning_Path_Blueprint.md` (Sprint 01).

## Learning Journey là gì?

Learning Journey là cách người học **trải nghiệm** một Learning Path (CKOS Collection) —
không phải danh sách bài học, mà là một chuỗi cảm nhận trưởng thành có điểm bắt đầu và điểm
kết thúc rõ ràng.

```
Learning Path (khái niệm cấu trúc, Sprint 01)
        ↓ trải nghiệm qua
Learning Journey (khái niệm cảm nhận, Sprint 02)
```

Một Learning Path mô tả **cái gì** (Collection → Seed → Lesson theo thứ tự); một Learning
Journey mô tả **cảm giác đang ở đâu** trong quá trình đó (7 giai đoạn, xem Nhiệm vụ 02).

## Một Journey bắt đầu và kết thúc như thế nào?

**Bắt đầu:** Khi người học chọn 1 CKOS Collection để theo đuổi (Journey Card hiển thị ngay,
trạng thái mặc định là `PREPARATION` — chưa cần hành động gì, chỉ cần biết Journey này tồn
tại và mục tiêu của nó).

**Kết thúc:** Khi người học tự xác nhận đã sẵn sàng (giai đoạn `READY`) sau khi:
1. Đã hoàn thành thực hành các Seed trong Collection (tính qua `computeCollectionProgress`
   của CKOS — không đổi cách tính, chỉ đổi cách hiển thị).
2. Đã trả lời Growth Checkpoint (không bắt buộc nội dung, nhưng phải mở đúng lúc).
3. Đã tự bấm "Tôi đã sẵn sàng" — hành động xác nhận chủ động, không tự động.

Không có "kết thúc" do hệ thống áp đặt (VD: hoàn thành 100% bước) — kết thúc luôn cần xác
nhận chủ quan của người học, đúng Growth Framework (Sprint 01).

## Journey khác Learning Path ở đâu?

| | Learning Path (Sprint 01) | Learning Journey (Sprint 02) |
|---|---|---|
| Vai trò | Cấu trúc dữ liệu | Trải nghiệm hiển thị |
| Đơn vị đo | % tiến độ CKOS | 7 giai đoạn cảm nhận (Preparation → Ready) |
| Hiển thị | Danh sách Seed theo thứ tự | Journey Card + Timeline (không phải danh sách) |
| Điểm kết thúc | Seed cuối cùng hoàn thành | Người học tự xác nhận READY |
| Nguồn dữ liệu | CKOS Collection trực tiếp | CKOS Collection + trạng thái cảm nhận (localStorage) |

Learning Journey **không thay thế** Learning Path — nó là lớp trải nghiệm phủ lên trên, dùng
đúng dữ liệu Learning Path đã định nghĩa (không tính lại tiến độ theo cách khác).

## Kiến trúc kỹ thuật (tham chiếu code)

```
src/features/academy/
├── types/journey.types.ts       JourneyStage (7 giai đoạn), LearningJourney, JourneyStatus
├── services/journey.service.ts  getAllLearningJourneys, computeJourneyStatus,
│                                 getCompanionJourneyGuidance (đọc CKOS qua @/features/knowledge)
├── components/
│   ├── JourneyCard.tsx           Feature 03
│   ├── JourneyTimeline.tsx       Feature 04
│   ├── GrowthCheckpoint.tsx      Feature 05
│   └── CompanionGuidance.tsx     Feature 06
└── utils/
    ├── use-journey-ready.ts      Xác nhận READY (localStorage)
    └── use-growth-checkpoint.ts  Câu trả lời Growth Checkpoint (localStorage)
```

Không có type/service nào trong `src/features/academy/` ghi đè hay sửa dữ liệu CKOS — toàn
bộ chỉ đọc qua `@/features/knowledge` (barrel export), đúng nguyên tắc #1 Academy Constitution.
