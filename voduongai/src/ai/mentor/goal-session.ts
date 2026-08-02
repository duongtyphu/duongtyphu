/**
 * EPIC-A02 — Goal Engine Foundation: Goal Session.
 *
 * Trạng thái Goal của MỘT phiên chat — chỉ tồn tại trong bộ nhớ tiến trình
 * (in-memory) nếu/khi Runtime tương lai chọn dùng tới. Namespace này KHÔNG
 * tự đọc/ghi bất kỳ đâu — không Database, không localStorage, không
 * persistence, không side-effect I/O nào ở đây.
 */

import type { Goal } from "./goal";
import { goalCandidateToGoal, type GoalCandidate } from "./goal-detector";
import { pickPrimaryCandidate } from "./goal-detector.rules";

export type GoalSession = {
  /** Goal đang được xem là trọng tâm của phiên chat này. `null` nếu chưa
      xác định được Goal nào — trạng thái trung thực mặc định. */
  currentGoal: Goal | null;
  /** Các Goal khác được nhắc tới trong cùng phiên nhưng không phải trọng
      tâm hiện tại. */
  secondaryGoals: Goal[];
};

/** Session rỗng — điểm khởi đầu chuẩn cho mọi phiên chat mới. */
export function createEmptyGoalSession(): GoalSession {
  return { currentGoal: null, secondaryGoals: [] };
}

/** Helper thuần nội bộ — loại bỏ trùng `id` trong 1 mảng Goal, giữ lần
    xuất hiện ĐẦU TIÊN. Không mutate mảng truyền vào. */
function dedupeGoalsById(goals: Goal[]): Goal[] {
  const seenIds = new Set<string>();
  const result: Goal[] = [];
  for (const g of goals) {
    if (seenIds.has(g.id)) continue;
    seenIds.add(g.id);
    result.push(g);
  }
  return result;
}

/**
 * Helper thuần — trả về session MỚI với `currentGoal` được thay bằng
 * `goal`. Goal hiện tại (nếu có và khác `goal`) rơi xuống `secondaryGoals`
 * thay vì bị mất. Không mutate `session` truyền vào.
 *
 * FIX EPIC-A02 — `secondaryGoals` kết quả LUÔN được khử trùng theo `id`
 * (qua `dedupeGoalsById`), kể cả nếu `session` đầu vào đã có sẵn id trùng
 * lặp (trạng thái không nên xảy ra nếu chỉ tạo qua 2 helper của file này,
 * nhưng hàm này không giả định điều đó — tự đảm bảo bất biến "không id
 * trùng" ở đầu ra, không phụ thuộc tính đúng đắn của đầu vào).
 */
export function setCurrentGoal(session: GoalSession, goal: Goal): GoalSession {
  const previousCurrent = session.currentGoal;
  const candidateSecondary =
    previousCurrent && previousCurrent.id !== goal.id
      ? [previousCurrent, ...session.secondaryGoals]
      : session.secondaryGoals;
  const nextSecondary = dedupeGoalsById(candidateSecondary.filter((g) => g.id !== goal.id));
  return { currentGoal: goal, secondaryGoals: nextSecondary };
}

/**
 * Helper thuần — thêm `goal` vào `secondaryGoals` nếu chưa có (theo `id`),
 * không đổi `currentGoal`. Không mutate `session` truyền vào.
 */
export function addSecondaryGoal(session: GoalSession, goal: Goal): GoalSession {
  if (session.currentGoal?.id === goal.id) return session;
  if (session.secondaryGoals.some((g) => g.id === goal.id)) return session;
  return { ...session, secondaryGoals: [...session.secondaryGoals, goal] };
}

/** Helper thuần — gộp toàn bộ Goal trong session (currentGoal + secondary)
    thành 1 mảng, tiện cho nơi gọi cần duyệt tất cả. */
export function listAllGoalsInSession(session: GoalSession): Goal[] {
  return session.currentGoal ? [session.currentGoal, ...session.secondaryGoals] : [...session.secondaryGoals];
}

/**
 * SPRINT A03 — Session integration thuần: cập nhật `GoalSession` từ danh
 * sách `GoalCandidate[]` do Goal Detection sinh ra (`goal-detector.rules.ts`).
 * Chọn candidate confidence cao nhất (`pickPrimaryCandidate()`) làm
 * `currentGoal`, các candidate còn lại thành `secondaryGoals`. Tái dùng
 * NGUYÊN `setCurrentGoal()`/`addSecondaryGoal()` ở trên (đã tự đảm bảo
 * không trùng id/không mutate) — không viết lại logic dedupe lần 2.
 *
 * `id` của mỗi `Goal` được suy trực tiếp từ `category` (mỗi category chỉ
 * có tối đa 1 candidate/lần detect — xem `detectGoalCandidates()`) — giữ
 * đúng nguyên tắc Determinism đã chốt ở bản FIX EPIC-A02 (không sinh id
 * ngẫu nhiên).
 *
 * Trạng thái này CHỈ là phân tích của phiên chat (Mentor Goal), KHÔNG
 * phải dữ liệu Goal chính thức của người dùng — KHÔNG persistence, KHÔNG
 * đọc/ghi Goal Runtime (`/portal/goals`), KHÔNG tự ghi vào hồ sơ.
 */
export function updateGoalSessionFromCandidates(session: GoalSession, candidates: GoalCandidate[]): GoalSession {
  const primary = pickPrimaryCandidate(candidates);
  if (!primary) return session;

  let next = setCurrentGoal(session, goalCandidateToGoal(primary, primary.category));
  for (const candidate of candidates) {
    if (candidate === primary) continue;
    next = addSecondaryGoal(next, goalCandidateToGoal(candidate, candidate.category));
  }
  return next;
}
