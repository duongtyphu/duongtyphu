import { describe, it, expect, beforeEach } from "vitest";
import { computeProgramBoard } from "@/lib/portal/foundation/program-board";
import { seedLandingPageProductionGoal, __resetGoalRuntimeCacheForTest} from "@/lib/portal/foundation/goal-runtime";

/**
 * PROGRAM: PRODUCTION BETA — Program Board.
 *
 * Test này khóa Program Board vào SỰ THẬT: 5 Track đúng tên/đúng thứ tự,
 * dependsOn đúng nguyên tắc (Track có phụ thuộc phải chờ dependency), và
 * Progress mỗi Track tính từ checklist thật (0-100), không cảm tính.
 */
describe("PROGRAM: PRODUCTION BETA — Program Board", () => {
  beforeEach(() => {
    window.localStorage.clear();
    __resetGoalRuntimeCacheForTest();
  });

  it("computeProgramBoard() trả về đúng 5 Track A-E theo đúng tên", () => {
    const board = computeProgramBoard();
    expect(board.program).toBe("PRODUCTION BETA");
    expect(board.tracks).toHaveLength(5);
    expect(board.tracks.map((t) => t.trackId)).toEqual(["A", "B", "C", "D", "E"]);
    expect(board.tracks.map((t) => t.name)).toEqual([
      "Core Runtime",
      "AI Workforce",
      "AI Operating Center",
      "Workspace Runtime",
      "Production Goals",
    ]);
  });

  it("Mỗi Track có Progress/Risks/Blockers/ETA hợp lệ", () => {
    const board = computeProgramBoard();
    for (const track of board.tracks) {
      expect(track.progress).toBeGreaterThanOrEqual(0);
      expect(track.progress).toBeLessThanOrEqual(100);
      expect(track.items.length).toBeGreaterThan(0);
      expect(Array.isArray(track.risks)).toBe(true);
      expect(Array.isArray(track.blockers)).toBe(true);
      expect(track.eta).toBeTruthy();
    }
    expect(board.overallPercent).toBeGreaterThanOrEqual(0);
    expect(board.overallPercent).toBeLessThanOrEqual(100);
  });

  it("Nguyên tắc dependency: Track D chờ A/B/C, Track E chờ D, Track A không phụ thuộc Track nào", () => {
    const board = computeProgramBoard();
    const byId = Object.fromEntries(board.tracks.map((t) => [t.trackId, t]));
    expect(byId.A.dependsOn).toEqual([]);
    expect(byId.B.dependsOn).toEqual(["A"]);
    expect(byId.C.dependsOn).toEqual(["A"]);
    expect(byId.D.dependsOn).toEqual(["A", "B", "C"]);
    expect(byId.E.dependsOn).toEqual(["D"]);
  });

  it("Track E (Production Goals) phản ánh đúng Goal Runtime thật — Landing Page Production đã gieo", () => {
    seedLandingPageProductionGoal();
    const board = computeProgramBoard();
    const trackE = board.tracks.find((t) => t.trackId === "E")!;
    expect(trackE.items.find((i) => i.label.includes("Landing Page Production đã gieo"))?.done).toBe(true);
    expect(trackE.items.find((i) => i.label.includes("Ít nhất 1 Mission"))?.done).toBe(false); // chưa Mission nào completed
  });

  it("Không Track nào bị đánh dấu 'blocked' sai khi blockers rỗng", () => {
    const board = computeProgramBoard();
    for (const track of board.tracks) {
      if (track.blockers.length === 0) {
        expect(track.status).not.toBe("blocked");
      } else {
        expect(track.status).toBe("blocked");
      }
    }
  });
});
