import { describe, it, expect } from "vitest";
import { createGoal } from "../goal";
import {
  createEmptyGoalSession,
  setCurrentGoal,
  addSecondaryGoal,
  listAllGoalsInSession,
} from "../goal-session";

function goal(id: string, title = id) {
  return createGoal({ id, title, description: "", category: "khac" });
}

describe("EPIC-A02 Goal Engine Foundation — setCurrentGoal", () => {
  it("đặt currentGoal trên session rỗng, secondaryGoals vẫn rỗng", () => {
    const session = createEmptyGoalSession();
    const g1 = goal("g1");
    const next = setCurrentGoal(session, g1);
    expect(next.currentGoal).toEqual(g1);
    expect(next.secondaryGoals).toEqual([]);
  });

  it("goal hiện tại cũ rơi xuống secondaryGoals khi đổi currentGoal khác id", () => {
    const g1 = goal("g1");
    const g2 = goal("g2");
    const session = setCurrentGoal(createEmptyGoalSession(), g1);
    const next = setCurrentGoal(session, g2);
    expect(next.currentGoal).toEqual(g2);
    expect(next.secondaryGoals).toEqual([g1]);
  });

  it("không mutate session đầu vào", () => {
    const g1 = goal("g1");
    const g2 = goal("g2");
    const session = setCurrentGoal(createEmptyGoalSession(), g1);
    const snapshot = { ...session, secondaryGoals: [...session.secondaryGoals] };
    setCurrentGoal(session, g2);
    expect(session).toEqual(snapshot);
  });

  it("kết quả secondaryGoals không chứa id trùng lặp", () => {
    const g1 = goal("g1");
    const g2 = goal("g2");
    const g3 = goal("g3");
    let session = createEmptyGoalSession();
    session = setCurrentGoal(session, g1);
    session = setCurrentGoal(session, g2);
    session = setCurrentGoal(session, g3);
    // g1 và g2 đều đã rơi xuống secondaryGoals — không được trùng id nào.
    const ids = session.secondaryGoals.map((g) => g.id);
    expect(ids).toEqual([...new Set(ids)]);
    expect(ids.sort()).toEqual(["g1", "g2"]);
  });
});

describe("EPIC-A02 Goal Engine Foundation — addSecondaryGoal chống trùng", () => {
  it("thêm goal mới vào secondaryGoals", () => {
    const g1 = goal("g1");
    const next = addSecondaryGoal(createEmptyGoalSession(), g1);
    expect(next.secondaryGoals).toEqual([g1]);
  });

  it("không thêm trùng — cùng id đã có trong secondaryGoals thì bỏ qua", () => {
    const g1 = goal("g1");
    const g1Duplicate = goal("g1", "g1 nhưng title khác");
    let session = addSecondaryGoal(createEmptyGoalSession(), g1);
    session = addSecondaryGoal(session, g1Duplicate);
    expect(session.secondaryGoals).toHaveLength(1);
    expect(session.secondaryGoals[0]).toEqual(g1);
  });

  it("không thêm vào secondaryGoals nếu id trùng currentGoal", () => {
    const g1 = goal("g1");
    const session = setCurrentGoal(createEmptyGoalSession(), g1);
    const next = addSecondaryGoal(session, goal("g1", "bản khác"));
    expect(next.secondaryGoals).toEqual([]);
    expect(next).toBe(session);
  });

  it("không mutate session đầu vào", () => {
    const g1 = goal("g1");
    const session = createEmptyGoalSession();
    const snapshot = { ...session, secondaryGoals: [...session.secondaryGoals] };
    addSecondaryGoal(session, g1);
    expect(session).toEqual(snapshot);
  });
});

describe("EPIC-A02 Goal Engine Foundation — listAllGoalsInSession", () => {
  it("trả về mảng rỗng khi session rỗng", () => {
    expect(listAllGoalsInSession(createEmptyGoalSession())).toEqual([]);
  });

  it("gộp currentGoal lên đầu, theo sau là secondaryGoals", () => {
    const g1 = goal("g1");
    const g2 = goal("g2");
    const g3 = goal("g3");
    let session = setCurrentGoal(createEmptyGoalSession(), g1);
    session = addSecondaryGoal(session, g2);
    session = addSecondaryGoal(session, g3);
    expect(listAllGoalsInSession(session)).toEqual([g1, g2, g3]);
  });

  it("chỉ trả về secondaryGoals khi chưa có currentGoal", () => {
    const g1 = goal("g1");
    const session = addSecondaryGoal(createEmptyGoalSession(), g1);
    expect(listAllGoalsInSession(session)).toEqual([g1]);
  });
});
