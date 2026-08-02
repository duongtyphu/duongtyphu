import { describe, it, expect } from "vitest";
import type { Conversation } from "../goal-detector";
import {
  detectGoalCandidates,
  pickPrimaryCandidate,
  classifyConfidenceBand,
  ruleBasedGoalDetector,
} from "../goal-detector.rules";
import { buildClarification } from "../goal-clarification";
import { createEmptyGoalSession, updateGoalSessionFromCandidates } from "../goal-session";

function convo(...userMessages: string[]): Conversation {
  return { turns: userMessages.map((content) => ({ role: "user" as const, content })) };
}

describe("SPRINT A03 — Detection rules: nhận diện từng nhóm Goal phổ biến", () => {
  const cases: { label: string; message: string; category: string }[] = [
    { label: "Học AI", message: "Tôi muốn học AI từ đầu.", category: "hoc-ai" },
    { label: "Học Prompt", message: "Tôi muốn học prompt để viết tốt hơn.", category: "hoc-prompt" },
    {
      label: "Học Công cụ AI",
      message: "Tôi muốn sử dụng chatgpt hiệu quả hơn.",
      category: "hoc-cong-cu-ai",
    },
    { label: "Premium", message: "Tôi muốn đăng ký premium để học nâng cao.", category: "premium" },
    {
      label: "Xây thương hiệu cá nhân",
      message: "Tôi muốn xây dựng thương hiệu cá nhân trên mạng xã hội.",
      category: "xay-thuong-hieu-ca-nhan",
    },
    {
      label: "Affiliate Marketing",
      message: "Tôi muốn làm affiliate để kiếm thêm thu nhập.",
      category: "affiliate-marketing",
    },
    {
      label: "Tạo nội dung",
      message: "Tôi muốn học tạo nội dung cho kênh của mình.",
      category: "tao-noi-dung",
    },
    {
      label: "Xây dựng hệ thống",
      message: "Tôi muốn xây hệ thống tự động cho công việc.",
      category: "xay-dung-he-thong",
    },
    {
      label: "Dự án & Cơ hội",
      message: "Tôi muốn tìm dự án kinh doanh mới.",
      category: "du-an-co-hoi",
    },
  ];

  for (const { label, message, category } of cases) {
    it(`nhận diện đúng category "${category}" (${label})`, () => {
      const candidates = detectGoalCandidates(convo(message));
      expect(candidates).toHaveLength(1);
      expect(candidates[0].category).toBe(category);
      expect(candidates[0].confidence).toBeGreaterThan(0);
      expect(candidates[0].evidence).toBe(message);
    });
  }
});

describe("SPRINT A03 — Detection rules: nhiều mục tiêu trong một câu", () => {
  it("nhận diện đủ 2 category khi cùng nhắc tới trong 1 lượt", () => {
    const candidates = detectGoalCandidates(
      convo("Tôi muốn học AI và cũng muốn học prompt để áp dụng vào công việc.")
    );
    const categories = candidates.map((c) => c.category).sort();
    expect(categories).toEqual(["hoc-ai", "hoc-prompt"]);
  });
});

describe("SPRINT A03 — Detection rules: hội thoại mơ hồ", () => {
  it("chủ đề + ý định nhưng không có chi tiết → confidence ở dải 'tiềm năng'", () => {
    const candidates = detectGoalCandidates(convo("Tôi muốn học AI."));
    expect(candidates).toHaveLength(1);
    expect(classifyConfidenceBand(candidates[0].confidence)).toBe("potential");
    expect(candidates[0].confidence).toBeCloseTo(0.55, 5);
  });
});

describe("SPRINT A03 — Detection rules: không có mục tiêu", () => {
  it("hội thoại không liên quan → mảng rỗng, không khẳng định mục tiêu", () => {
    const candidates = detectGoalCandidates(convo("Chào Companion, hôm nay thời tiết đẹp quá, bạn khoẻ không?"));
    expect(candidates).toEqual([]);
  });
});

describe("SPRINT A03 — Detection rules: fallback \"khac\"", () => {
  it("có ý định nhưng không khớp category nào → 1 candidate category=khac", () => {
    const candidates = detectGoalCandidates(convo("Tôi muốn thử làm điều gì đó mới trong công việc của mình."));
    expect(candidates).toHaveLength(1);
    expect(candidates[0].category).toBe("khac");
    expect(candidates[0].confidence).toBeCloseTo(0.55, 5);
  });
});

describe("SPRINT A03 — Confidence policy: ngưỡng dải chính xác", () => {
  it("0.3 → unclear (topic-only, không ý định, không chi tiết)", () => {
    expect(classifyConfidenceBand(0.3)).toBe("unclear");
  });

  it("0.39 → unclear (ngay dưới ngưỡng)", () => {
    expect(classifyConfidenceBand(0.39)).toBe("unclear");
  });

  it("0.4 → potential (ngay tại ngưỡng dưới)", () => {
    expect(classifyConfidenceBand(0.4)).toBe("potential");
  });

  it("0.69 → potential (ngay dưới ngưỡng trên)", () => {
    expect(classifyConfidenceBand(0.69)).toBe("potential");
  });

  it("0.7 → clear (ngay tại ngưỡng)", () => {
    expect(classifyConfidenceBand(0.7)).toBe("clear");
  });

  it("0.85 → clear", () => {
    expect(classifyConfidenceBand(0.85)).toBe("clear");
  });

  it("topic-only, không ý định, không chi tiết → đúng 0.3 qua detection thật", () => {
    const candidates = detectGoalCandidates(convo("Có ai học AI chưa nhỉ."));
    // Không có từ khoá ý định ("muốn"/"cần"/...) — chỉ nhắc chủ đề.
    expect(candidates).toHaveLength(1);
    expect(candidates[0].confidence).toBeCloseTo(0.3, 5);
  });

  it("topic + ý định + 2 chi tiết → đạt dải 'clear' (≥0.70)", () => {
    const candidates = detectGoalCandidates(
      convo("Tôi mới bắt đầu, muốn học AI để áp dụng vào công việc văn phòng.")
    );
    expect(candidates).toHaveLength(1);
    expect(candidates[0].confidence).toBeCloseTo(0.75, 5);
    expect(classifyConfidenceBand(candidates[0].confidence)).toBe("clear");
  });
});

describe("SPRINT A03 — Clarification: không hỏi lại thông tin đã có", () => {
  it("trình độ đã nêu ở lượt trước → không xuất hiện trong missingInformation, câu hỏi hỏi đúng mục còn thiếu", () => {
    const conversation: Conversation = {
      turns: [
        { role: "user", content: "Tôi hiện đang ở trình độ cơ bản với AI." },
        { role: "assistant", content: "Rất vui được biết!" },
        { role: "user", content: "Tôi muốn học AI." },
      ],
    };
    const candidates = detectGoalCandidates(conversation);
    expect(candidates).toHaveLength(1);
    // Trình độ đã biết (từ lượt 1) — KHÔNG được hỏi lại.
    expect(candidates[0].missingInformation.join(" ")).not.toContain("trình độ");
    expect(candidates[0].missingInformation.join(" ")).toContain("mục đích");

    const clarification = buildClarification(candidates[0]);
    expect(clarification.needsClarification).toBe(true);
    expect(clarification.suggestedQuestion).toBe("Bạn muốn đạt được kết quả cụ thể gì từ việc này?");
    expect(clarification.suggestedQuestion).not.toMatch(/trình độ/);
  });
});

describe("SPRINT A03 — Clarification: chỉ tạo một clarification question", () => {
  it("nhiều mục còn thiếu vẫn chỉ trả về đúng 1 suggestedQuestion (string, không phải mảng)", () => {
    const candidates = detectGoalCandidates(convo("Tôi muốn học AI."));
    const clarification = buildClarification(candidates[0]);
    expect(typeof clarification.suggestedQuestion).toBe("string");
    expect(clarification.missingInformation.length).toBeGreaterThan(1);
  });

  it("confidence ≥ 0.70 → không cần clarification, suggestedQuestion null", () => {
    const candidates = detectGoalCandidates(
      convo("Tôi mới bắt đầu, muốn học AI để áp dụng vào công việc văn phòng.")
    );
    const clarification = buildClarification(candidates[0]);
    expect(clarification.needsClarification).toBe(false);
    expect(clarification.suggestedQuestion).toBeNull();
  });

  it("không có candidate nào → không ép hỏi câu chung chung", () => {
    const clarification = buildClarification(null);
    expect(clarification.needsClarification).toBe(false);
    expect(clarification.suggestedQuestion).toBeNull();
  });

  it("đủ chi tiết nhưng không có tín hiệu ý định → hỏi câu xác nhận chung (fallback)", () => {
    const candidates = detectGoalCandidates(
      convo("Học AI, trình độ cơ bản, áp dụng vào công việc, trong tháng này.")
    );
    expect(candidates).toHaveLength(1);
    expect(candidates[0].missingInformation).toEqual([]);
    const clarification = buildClarification(candidates[0]);
    expect(clarification.needsClarification).toBe(true);
    expect(clarification.suggestedQuestion).toBe("Bạn có đang thực sự muốn theo đuổi mục tiêu này không?");
  });
});

describe("SPRINT A03 — Session integration: không duplicate Goal, không mutate", () => {
  it("chọn candidate confidence cao nhất làm currentGoal, còn lại thành secondaryGoals", () => {
    const candidates = detectGoalCandidates(
      convo("Tôi mới bắt đầu, muốn học AI để áp dụng vào công việc văn phòng và cũng muốn học prompt.")
    );
    expect(candidates.length).toBeGreaterThanOrEqual(2);

    const session = updateGoalSessionFromCandidates(createEmptyGoalSession(), candidates);
    const primary = pickPrimaryCandidate(candidates);
    expect(session.currentGoal?.category).toBe(primary?.category);
    expect(session.secondaryGoals.length).toBe(candidates.length - 1);
  });

  it("không tạo Goal trùng id khi gọi lại nhiều lần với cùng candidate", () => {
    const candidates = detectGoalCandidates(convo("Tôi muốn học AI và cũng muốn học prompt."));
    let session = createEmptyGoalSession();
    session = updateGoalSessionFromCandidates(session, candidates);
    session = updateGoalSessionFromCandidates(session, candidates);

    const ids = [session.currentGoal?.id, ...session.secondaryGoals.map((g) => g.id)];
    expect(ids).toEqual([...new Set(ids)]);
    expect(session.secondaryGoals).toHaveLength(candidates.length - 1);
  });

  it("không mutate session hay candidates truyền vào", () => {
    const candidates = detectGoalCandidates(convo("Tôi muốn học AI và cũng muốn học prompt."));
    const session = createEmptyGoalSession();
    const sessionSnapshot = { ...session, secondaryGoals: [...session.secondaryGoals] };
    const candidatesSnapshot = candidates.map((c) => ({ ...c }));

    updateGoalSessionFromCandidates(session, candidates);

    expect(session).toEqual(sessionSnapshot);
    expect(candidates).toEqual(candidatesSnapshot);
  });

  it("candidates rỗng → trả về session gốc không đổi", () => {
    const session = createEmptyGoalSession();
    const next = updateGoalSessionFromCandidates(session, []);
    expect(next).toBe(session);
  });
});

describe("SPRINT A03 — GoalDetector interface conformance", () => {
  it("ruleBasedGoalDetector.detect() cho kết quả giống hệt detectGoalCandidates()", () => {
    const conversation = convo("Tôi muốn học AI.");
    expect(ruleBasedGoalDetector.detect(conversation)).toEqual(detectGoalCandidates(conversation));
  });
});

describe("SPRINT A03 — Detection rules: không mutate conversation đầu vào", () => {
  it("giữ nguyên conversation sau khi detect", () => {
    const conversation = convo("Tôi muốn học AI để áp dụng vào công việc.");
    const snapshot = JSON.parse(JSON.stringify(conversation));
    detectGoalCandidates(conversation);
    expect(conversation).toEqual(snapshot);
  });
});
