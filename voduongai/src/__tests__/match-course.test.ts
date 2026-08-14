import { describe, expect, it } from "vitest";

import { matchCourse, type MatchableCourseRow } from "@/components/portal/premium/match-course";
import { PREMIUM_PROGRAMS } from "@/components/portal/premium/premium-programs";

/**
 * Test hồi quy cho `matchCourse()`.
 *
 * Bug thật đã xảy ra: bản cũ ghép chương trình Premium với dòng `courses`
 * bằng cách tìm dòng ĐẦU TIÊN có `name` chứa một chuỗi con (vd. "cơ bản").
 * Khi thêm khoá nhập môn miễn phí tên "AI cơ bản cho mọi người" — cũng chứa
 * "cơ bản", lại sắp TRƯỚC "Lớp học AI Cơ bản" theo thứ tự tên — thẻ khoá trả
 * phí 1.500.000đ trên `/portal/premium` hiện giá 0đ của khoá free.
 *
 * Bộ test này khoá chặt hành vi đúng: ghép theo `courses.id`, không theo tên.
 */

// Đúng 5 dòng `courses` thật trên Supabase Production tại thời điểm viết test.
const PRODUCTION_COURSES: MatchableCourseRow[] = [
  { id: "ai-coban", status: "coming", price: 1_500_000 },
  { id: "ai-nangcao", status: "coming", price: 3_999_999 },
  { id: "openclaw", status: "coming", price: 999_999 },
  { id: "scale", status: "coming", price: 7_999_999 },
  { id: "solo", status: "coming", price: 5_900_000 },
];

const NO_PURCHASE = new Set<string>();

describe("matchCourse", () => {
  it("ghép đúng dòng courses cho cả 5 chương trình Premium", () => {
    const ket_qua = PREMIUM_PROGRAMS.map((p) => [
      p.key,
      matchCourse(PRODUCTION_COURSES, p.courseId, NO_PURCHASE)?.id,
    ]);

    expect(ket_qua).toEqual([
      ["ai-coban", "ai-coban"],
      ["ai-nangcao", "ai-nangcao"],
      ["openclaw", "openclaw"],
      ["v-solo", "solo"],
      ["v-scale", "scale"],
    ]);
  });

  it("giữ nguyên giá đúng của từng chương trình", () => {
    const gia = Object.fromEntries(
      PREMIUM_PROGRAMS.map((p) => [p.key, matchCourse(PRODUCTION_COURSES, p.courseId, NO_PURCHASE)?.price]),
    );

    expect(gia).toEqual({
      "ai-coban": 1_500_000,
      "ai-nangcao": 3_999_999,
      openclaw: 999_999,
      "v-solo": 5_900_000,
      "v-scale": 7_999_999,
    });
  });

  it("KHÔNG nhầm sang khoá khác khi có 2 khoá tên gần giống nhau", () => {
    // Đúng tình huống đã gây lỗi: thêm 1 khoá free có tên chứa "cơ bản" và
    // đứng TRƯỚC khoá trả phí trong danh sách (danh sách thật được sắp theo
    // tên, "AI cơ bản..." < "Lớp học AI Cơ bản").
    const co_khoa_free_ten_giong: MatchableCourseRow[] = [
      { id: "ai-co-ban-cho-moi-nguoi", status: "open", price: 0 },
      ...PRODUCTION_COURSES,
    ];

    const ket_qua = matchCourse(co_khoa_free_ten_giong, "ai-coban", NO_PURCHASE);

    expect(ket_qua?.id).toBe("ai-coban");
    expect(ket_qua?.price).toBe(1_500_000);
  });

  it("trả null khi chưa có dòng courses tương ứng", () => {
    expect(matchCourse([], "ai-coban", NO_PURCHASE)).toBeNull();
  });

  it("đánh dấu đã sở hữu theo đúng courses.id", () => {
    const da_mua = new Set(["solo"]);

    expect(matchCourse(PRODUCTION_COURSES, "solo", da_mua)?.owned).toBe(true);
    expect(matchCourse(PRODUCTION_COURSES, "ai-coban", da_mua)?.owned).toBe(false);
  });

  it("chỉ mở CTA thanh toán khi status = 'open'", () => {
    const mo_ban: MatchableCourseRow[] = [{ id: "ai-coban", status: "open", price: 1_500_000 }];

    expect(matchCourse(mo_ban, "ai-coban", NO_PURCHASE)?.open).toBe(true);
    expect(matchCourse(PRODUCTION_COURSES, "ai-coban", NO_PURCHASE)?.open).toBe(false);
  });

  it("mọi courseId khai trong PREMIUM_PROGRAMS đều tồn tại thật trong courses", () => {
    const thieu = PREMIUM_PROGRAMS.filter(
      (p) => !PRODUCTION_COURSES.some((c) => c.id === p.courseId),
    ).map((p) => p.key);

    expect(thieu).toEqual([]);
  });
});
