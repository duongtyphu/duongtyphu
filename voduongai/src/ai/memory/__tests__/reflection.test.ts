import { describe, it, expect } from "vitest";
import { createMemoryEntry } from "../memory-model";
import { buildReflection } from "../reflection";

function entryOf(summary: string, type: "session" | "goal" | "learning" | "preference" | "reflection" = "learning") {
  return createMemoryEntry({ id: summary, type, title: type, summary, confidence: 0.8, source: "test", timestamp: "t" });
}

describe("SPRINT A06 — Reflection: phân nhóm theo marker", () => {
  it("summary có marker khó khăn → difficulties", () => {
    const result = buildReflection([entryOf("Tôi gặp khó khăn khi viết prompt.")]);
    expect(result.difficulties).toEqual(["Tôi gặp khó khăn khi viết prompt."]);
    expect(result.achievements).toEqual([]);
  });

  it("summary có marker thành tựu → achievements", () => {
    const result = buildReflection([entryOf("Tôi đã hoàn thành bài học đầu tiên.")]);
    expect(result.achievements).toEqual(["Tôi đã hoàn thành bài học đầu tiên."]);
  });

  it("summary có marker bài học → lessons", () => {
    const result = buildReflection([entryOf("Tôi rút ra được là cần luyện tập nhiều hơn.")]);
    expect(result.lessons).toEqual(["Tôi rút ra được là cần luyện tập nhiều hơn."]);
  });

  it("type='reflection' không khớp marker nào → vẫn vào lessons", () => {
    const result = buildReflection([entryOf("Một câu bất kỳ không có từ khoá.", "reflection")]);
    expect(result.lessons).toEqual(["Một câu bất kỳ không có từ khoá."]);
  });

  it("không khớp marker nào, type khác 'reflection' → không vào nhóm nào (trung thực)", () => {
    const result = buildReflection([entryOf("Một câu trung tính không có tín hiệu gì.", "learning")]);
    expect(result.achievements).toEqual([]);
    expect(result.difficulties).toEqual([]);
    expect(result.lessons).toEqual([]);
  });

  it("khó khăn được ưu tiên trước thành tựu nếu cùng khớp cả 2 nhóm marker", () => {
    const result = buildReflection([entryOf("Tôi đã hoàn thành phần 1 nhưng gặp khó khăn ở phần 2.")]);
    expect(result.difficulties).toHaveLength(1);
    expect(result.achievements).toEqual([]);
  });
});

describe("SPRINT A06 — Reflection: suggestedImprovement / nextLearningStep", () => {
  it("mảng entries rỗng → template mặc định trung thực", () => {
    const result = buildReflection([]);
    expect(result.suggestedImprovement).toBe("Tiếp tục duy trì nhịp học tập hiện tại.");
    expect(result.nextLearningStep).toBe("Chưa đủ dữ liệu để đề xuất bước học tiếp theo cụ thể.");
  });

  it("có difficulties → suggestedImprovement nhắc đúng khó khăn đầu tiên", () => {
    const result = buildReflection([entryOf("Tôi gặp khó khăn khi viết prompt.")]);
    expect(result.suggestedImprovement).toBe("Nên tập trung khắc phục: Tôi gặp khó khăn khi viết prompt.");
  });

  it("có lessons → nextLearningStep khuyên áp dụng bài học", () => {
    const result = buildReflection([entryOf("Bài học lớn nhất là kiên trì.")]);
    expect(result.nextLearningStep).toBe("Áp dụng bài học gần nhất vào bước tiếp theo.");
  });

  it("chỉ có achievements (không lessons) → nextLearningStep khuyên nâng cao", () => {
    const result = buildReflection([entryOf("Tôi đã hoàn thành bài học đầu tiên.")]);
    expect(result.nextLearningStep).toBe("Tiếp tục nâng cao dựa trên những gì đã đạt được.");
  });
});

describe("SPRINT A06 — Reflection: deterministic + không mutate", () => {
  it("cùng input luôn cho cùng output", () => {
    const entries = [entryOf("Tôi gặp khó khăn khi viết prompt.")];
    expect(buildReflection(entries)).toEqual(buildReflection(entries));
  });

  it("không mutate entries truyền vào", () => {
    const entries = [entryOf("Tôi gặp khó khăn khi viết prompt.")];
    const snapshot = entries.map((e) => ({ ...e }));
    buildReflection(entries);
    expect(entries).toEqual(snapshot);
  });
});
