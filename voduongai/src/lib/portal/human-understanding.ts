/**
 * Human Understanding Layer (Sprint 7.2): turns Memory (raw reflections)
 * into Insight (tags via human-insight.ts) into Growth (the sentences and
 * suggestions below). Every output is deliberately hedged ("Mình nhận
 * thấy...", "Có vẻ...") — Portal never states a conclusion as fact.
 */

import type { Reflection } from "@/lib/portal/reflections";
import { inferInsight, type ChallengeTag, type ThemeTag, type ValueTag } from "@/lib/portal/human-insight";

function withinDays(dateStr: string, days: number) {
  return Date.now() - new Date(dateStr).getTime() <= days * 24 * 60 * 60 * 1000;
}

function topByFrequency<T extends string>(values: T[]): T | undefined {
  if (values.length === 0) return undefined;
  const counts = new Map<T, number>();
  values.forEach((v) => counts.set(v, (counts.get(v) ?? 0) + 1));
  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0][0];
}

/** Nhiệm vụ 02 — Understanding Timeline: "Mình nhận thấy..." */
export function buildUnderstandingNote(reflections: Reflection[]): string | null {
  const recent = reflections.filter((r) => withinDays(r.createdAt, 30));
  if (recent.length < 2) return null;
  const themes = recent.map((r) => inferInsight(r.answer).theme).filter(Boolean) as ThemeTag[];
  const topTheme = topByFrequency(themes);
  if (!topTheme) return null;
  return `Mình nhận thấy trong khoảng thời gian gần đây, bạn thường nhắc đến ${topTheme}. Có vẻ đây là điều bạn đang dành nhiều tâm sức cho.`;
}

/** Nhiệm vụ 03 — Growth Pattern: xu hướng lặp lại qua nhiều tuần. */
export function detectGrowthPattern(reflections: Reflection[]): string | null {
  const recent = reflections.filter((r) => withinDays(r.createdAt, 21));
  if (recent.length < 3) return null;

  const byWeek = new Map<number, Set<ThemeTag>>();
  recent.forEach((r) => {
    const theme = inferInsight(r.answer).theme;
    if (!theme) return;
    const week = Math.floor(new Date(r.createdAt).getTime() / (7 * 24 * 60 * 60 * 1000));
    const set = byWeek.get(week) ?? new Set<ThemeTag>();
    set.add(theme);
    byWeek.set(week, set);
  });
  if (byWeek.size < 3) return null;

  const weekSets = [...byWeek.values()];
  const allThemes = new Set(weekSets.flatMap((s) => [...s]));
  const consistentTheme = [...allThemes].find((theme) => weekSets.every((s) => s.has(theme)));
  if (!consistentTheme) return null;

  return `Có vẻ ${consistentTheme} là mục tiêu bạn đang rất quan tâm trong vài tuần qua. Chúng ta sẽ ưu tiên hành trình này.`;
}

/** Nhiệm vụ 04 — Next Insight: thử thách được nhắc tới nhiều nhất gần đây. */
export function dominantChallenge(reflections: Reflection[]): ChallengeTag | undefined {
  const recent = reflections.filter((r) => withinDays(r.createdAt, 30));
  const challenges = recent.map((r) => inferInsight(r.answer).challenge).filter(Boolean) as ChallengeTag[];
  return topByFrequency(challenges);
}

const VALUE_GROWTH_PHRASE: Record<ValueTag, string> = {
  "Kiên trì": "Kiên trì hơn",
  "Trung thực": "Chân thành hơn với chính mình",
  "Chia sẻ": "Chia sẻ nhiều hơn",
  "Học hỏi": "Chủ động học hỏi hơn",
  "Kiến tạo": "Biết hệ thống hóa hơn",
  "Phụng sự": "Quan tâm đến người khác hơn",
};

/** Nhiệm vụ 05 — Human Dashboard: những "hạt giống" đang lớn lên. */
export function buildGrowingQualities(reflections: Reflection[]): string[] {
  const values = reflections.map((r) => inferInsight(r.answer).value).filter(Boolean) as ValueTag[];
  if (values.length === 0) return [];
  const counts = new Map<ValueTag, number>();
  values.forEach((v) => counts.set(v, (counts.get(v) ?? 0) + 1));
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)
    .map(([v]) => VALUE_GROWTH_PHRASE[v]);
}

const DEFAULT_MEMORY_LINE =
  "Khi bạn chia sẻ điều gì đó với mình, mình sẽ giữ lại — không phải để theo dõi, mà để có thể đồng hành đúng với những gì bạn đang hướng tới.";

/** Nhiệm vụ 06 — Insight Memory: nhắc lại ý nghĩa, không trích nguyên văn. */
export function buildInsightMemoryLine(reflections: Reflection[]): string {
  if (reflections.length === 0) return DEFAULT_MEMORY_LINE;

  const sorted = [...reflections].sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  const earliest = sorted[0];
  const latest = sorted[sorted.length - 1];
  const earliestChallenge = inferInsight(earliest.answer).challenge;

  if (earliestChallenge && earliest.id !== latest.id) {
    return `Mình nhớ có một giai đoạn bạn từng băn khoăn về việc ${earliestChallenge.toLowerCase()}. Nhìn lại hành trình tới hôm nay, có vẻ bạn đã đi được một đoạn đường rất đáng tự hào.`;
  }

  const latestTheme = inferInsight(latest.answer).theme;
  if (latestTheme) {
    return `Mình nhận thấy gần đây bạn đang dành nhiều tâm sức cho ${latestTheme}. Mình vẫn ở đây, đồng hành cùng bạn.`;
  }

  return DEFAULT_MEMORY_LINE;
}
