import { describe, it, expect } from "vitest";
import { clampConfidence, isGoalCategory } from "../goal";

describe("EPIC-A02 Goal Engine Foundation — clampConfidence", () => {
  it("giữ nguyên giá trị đã nằm trong [0, 1]", () => {
    expect(clampConfidence(0.5)).toBe(0.5);
    expect(clampConfidence(0)).toBe(0);
    expect(clampConfidence(1)).toBe(1);
  });

  it("kẹp giá trị âm về 0", () => {
    expect(clampConfidence(-0.3)).toBe(0);
  });

  it("kẹp giá trị lớn hơn 1 về 1", () => {
    expect(clampConfidence(1.7)).toBe(1);
  });

  it("trả về 0 khi input là NaN", () => {
    expect(clampConfidence(NaN)).toBe(0);
  });
});

describe("EPIC-A02 Goal Engine Foundation — isGoalCategory", () => {
  it("nhận diện đúng category hợp lệ", () => {
    expect(isGoalCategory("hoc-ai")).toBe(true);
    expect(isGoalCategory("premium")).toBe(true);
    expect(isGoalCategory("khac")).toBe(true);
  });

  it("từ chối category không tồn tại trong taxonomy", () => {
    expect(isGoalCategory("khong-ton-tai")).toBe(false);
    expect(isGoalCategory("")).toBe(false);
  });
});
