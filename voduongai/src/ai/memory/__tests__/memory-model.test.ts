import { describe, it, expect } from "vitest";
import { baseImportanceForType, clampUnitInterval, createMemoryEntry, isMemoryType, MEMORY_TYPES } from "../memory-model";

describe("SPRINT A06 — Memory Model: clampUnitInterval", () => {
  it("kẹp giá trị âm về 0", () => {
    expect(clampUnitInterval(-0.5)).toBe(0);
  });
  it("kẹp giá trị >1 về 1", () => {
    expect(clampUnitInterval(1.5)).toBe(1);
  });
  it("NaN → 0", () => {
    expect(clampUnitInterval(NaN)).toBe(0);
  });
  it("giá trị hợp lệ giữ nguyên", () => {
    expect(clampUnitInterval(0.42)).toBe(0.42);
  });
});

describe("SPRINT A06 — Memory Model: isMemoryType", () => {
  it("nhận diện đúng 5 type hợp lệ", () => {
    for (const type of MEMORY_TYPES) {
      expect(isMemoryType(type)).toBe(true);
    }
  });
  it("từ chối giá trị không hợp lệ", () => {
    expect(isMemoryType("khong-hop-le")).toBe(false);
  });
});

describe("SPRINT A06 — Memory Model: baseImportanceForType", () => {
  it("goal quan trọng nhất, session thấp nhất", () => {
    expect(baseImportanceForType("goal")).toBeGreaterThan(baseImportanceForType("learning"));
    expect(baseImportanceForType("session")).toBeLessThan(baseImportanceForType("preference"));
  });
});

describe("SPRINT A06 — Memory Model: createMemoryEntry", () => {
  it("importance suy từ type, confidence được kẹp", () => {
    const entry = createMemoryEntry({
      id: "e1",
      type: "goal",
      title: "t",
      summary: "s",
      confidence: 1.5,
      source: "conversation",
      timestamp: "turn-0",
    });
    expect(entry.importance).toBe(baseImportanceForType("goal"));
    expect(entry.confidence).toBe(1);
  });

  it("deterministic: cùng input luôn cho cùng output", () => {
    const input = {
      id: "e1",
      type: "learning" as const,
      title: "t",
      summary: "s",
      confidence: 0.8,
      source: "conversation",
      timestamp: "turn-0",
    };
    expect(createMemoryEntry(input)).toEqual(createMemoryEntry(input));
  });
});
