import { describe, it, expect } from "vitest";
import type { MemoryCandidate } from "../memory-candidate";
import { decideMemoryDecision } from "../memory-policy";

function candidateOf(overrides: Partial<MemoryCandidate>): MemoryCandidate {
  return {
    content: "c",
    type: "learning",
    confidence: 0.8,
    shouldRemember: true,
    reason: "r",
    ...overrides,
  };
}

describe("SPRINT A06 — Memory Policy: Keep/Discard", () => {
  it("không có candidate → discard", () => {
    expect(decideMemoryDecision(null).status).toBe("discard");
  });

  it("shouldRemember=false → discard (vd. 'Xin chào')", () => {
    const decision = decideMemoryDecision(candidateOf({ shouldRemember: false, confidence: 0.1 }));
    expect(decision.status).toBe("discard");
  });

  it("shouldRemember=true, confidence>=0.70 → keep", () => {
    const decision = decideMemoryDecision(candidateOf({ confidence: 0.8 }));
    expect(decision.status).toBe("keep");
  });

  it("ranh giới đúng 0.70 → keep", () => {
    expect(decideMemoryDecision(candidateOf({ confidence: 0.7 })).status).toBe("keep");
  });
});

describe("SPRINT A06 — Memory Policy: review/temporary", () => {
  it("shouldRemember=true, confidence trong [0.40, 0.70) → review", () => {
    expect(decideMemoryDecision(candidateOf({ confidence: 0.5 })).status).toBe("review");
    expect(decideMemoryDecision(candidateOf({ confidence: 0.4 })).status).toBe("review");
    expect(decideMemoryDecision(candidateOf({ confidence: 0.69 })).status).toBe("review");
  });

  it("shouldRemember=true, confidence<0.40 → temporary", () => {
    expect(decideMemoryDecision(candidateOf({ confidence: 0.2 })).status).toBe("temporary");
    expect(decideMemoryDecision(candidateOf({ confidence: 0.39 })).status).toBe("temporary");
  });
});

describe("SPRINT A06 — Memory Policy: deterministic + không mutate", () => {
  it("cùng input luôn cho cùng output", () => {
    const candidate = candidateOf({ confidence: 0.55 });
    expect(decideMemoryDecision(candidate)).toEqual(decideMemoryDecision(candidate));
  });

  it("không mutate candidate truyền vào", () => {
    const candidate = candidateOf({ confidence: 0.55 });
    const snapshot = { ...candidate };
    decideMemoryDecision(candidate);
    expect(candidate).toEqual(snapshot);
  });
});
