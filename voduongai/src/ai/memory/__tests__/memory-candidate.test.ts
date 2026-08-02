import { describe, it, expect } from "vitest";
import type { Conversation } from "../memory-candidate";
import { extractMemoryCandidates, pickPrimaryMemoryCandidate } from "../memory-candidate";

function convo(...userMessages: string[]): Conversation {
  return { turns: userMessages.map((content) => ({ role: "user" as const, content })) };
}

describe("SPRINT A06 — Memory Candidate: phân loại đúng theo ví dụ Sprint", () => {
  it("'Xin chào' → type=session, shouldRemember=false", () => {
    const [candidate] = extractMemoryCandidates(convo("Xin chào"));
    expect(candidate.type).toBe("session");
    expect(candidate.shouldRemember).toBe(false);
  });

  it("'Hôm nay tôi bắt đầu học AI.' → type=learning, shouldRemember=true", () => {
    const [candidate] = extractMemoryCandidates(convo("Hôm nay tôi bắt đầu học AI."));
    expect(candidate.type).toBe("learning");
    expect(candidate.shouldRemember).toBe(true);
    expect(candidate.confidence).toBeCloseTo(0.8, 5);
  });

  it("'Tôi thích học bằng video.' → type=preference, shouldRemember=true", () => {
    const [candidate] = extractMemoryCandidates(convo("Tôi thích học bằng video."));
    expect(candidate.type).toBe("preference");
    expect(candidate.shouldRemember).toBe(true);
    expect(candidate.confidence).toBeCloseTo(0.75, 5);
  });

  it("câu không khớp marker nào → type=session, shouldRemember=false (mặc định)", () => {
    const [candidate] = extractMemoryCandidates(convo("Hôm nay trời mưa to quá."));
    expect(candidate.type).toBe("session");
    expect(candidate.shouldRemember).toBe(false);
  });
});

describe("SPRINT A06 — Memory Candidate: đa lượt hội thoại", () => {
  it("mỗi lượt user → đúng 1 candidate, bỏ qua lượt assistant", () => {
    const conversation: Conversation = {
      turns: [
        { role: "user", content: "Xin chào" },
        { role: "assistant", content: "Chào bạn!" },
        { role: "user", content: "Tôi thích học bằng video." },
      ],
    };
    const candidates = extractMemoryCandidates(conversation);
    expect(candidates).toHaveLength(2);
    expect(candidates[0].type).toBe("session");
    expect(candidates[1].type).toBe("preference");
  });
});

describe("SPRINT A06 — Memory Candidate: pickPrimaryMemoryCandidate", () => {
  it("mảng rỗng → null", () => {
    expect(pickPrimaryMemoryCandidate([])).toBeNull();
  });

  it("chọn candidate confidence cao nhất", () => {
    const candidates = extractMemoryCandidates(
      convo("Hôm nay tôi bắt đầu học AI.", "Tôi thích học bằng video.")
    );
    const primary = pickPrimaryMemoryCandidate(candidates);
    expect(primary?.type).toBe("learning");
  });
});

describe("SPRINT A06 — Memory Candidate: deterministic + không mutate", () => {
  it("cùng input luôn cho cùng output", () => {
    const conversation = convo("Hôm nay tôi bắt đầu học AI.");
    expect(extractMemoryCandidates(conversation)).toEqual(extractMemoryCandidates(conversation));
  });

  it("không mutate conversation truyền vào", () => {
    const conversation = convo("Hôm nay tôi bắt đầu học AI.");
    const snapshot = JSON.parse(JSON.stringify(conversation));
    extractMemoryCandidates(conversation);
    expect(conversation).toEqual(snapshot);
  });
});
