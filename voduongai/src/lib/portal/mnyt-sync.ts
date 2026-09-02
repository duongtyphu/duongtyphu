"use server";

import { getSupabaseServer, getCachedAuthUser } from "@/lib/supabase-server";
import { revalidatePath } from "next/cache";
import { getLiveMnytCategories } from "@/lib/portal/live-mnyt";
import { buildBadgeDefs, type BadgeDef } from "@/lib/mnyt/badges";

/**
 * "Mỗi ngày một ý tưởng" — LỚP ĐỒNG BỘ SERVER cho state người dùng
 * (Phase 41, README mục "State Management" — thay 9 khoá `mnyt_*_v1`
 * localStorage-only của mockup bằng tài khoản + bảng Supabase thật).
 *
 * QUY TẮC XUNG ĐỘT theo từng loại (đúng README):
 * - `completed`/`favs`/`badges` → UNION MERGE — mọi hàm ở đây chỉ THÊM
 *   dòng (insert/upsert `ignoreDuplicates`), KHÔNG BAO GIỜ xoá 1 lượt hoàn
 *   thành/yêu thích/huy hiệu đã có (trừ `toggleMnytFavorite`, nơi "bỏ yêu
 *   thích" là hành động CHỦ Ý của chính user, không phải hợp nhất 2 nguồn).
 * - `journal`/`checklist` → LAST-WRITE-WINS theo từng entry (`topic_id`) —
 *   server luôn ghi đè bằng giá trị mới nhất gửi lên kèm `updated_at` do
 *   CHÍNH SERVER gán (không tin timestamp client gửi lên, tránh giả mạo).
 * - `submissions`/`outdated_reports` → POST-ONLY, không có hàm sửa/xoá ở
 *   đây — đây là dữ liệu của VDAI, Admin duyệt riêng.
 * - `prefs` (lang/interests/sound/calmMode/reminder/tourSeen) → LWW theo
 *   thiết bị cuối cùng ghi — 1 hàm `updateMnytPrefs()` duy nhất, chấp nhận
 *   patch từng phần.
 * - `saved_terms` → UNION MERGE (giống favs). `term_srs` → LWW theo term.
 *
 * STREAK TÍNH Ở SERVER (không tin `Date.now()` phía client) — "hôm nay" là
 * ngày UTC tính bằng `new Date()` CHẠY TRONG SERVER ACTION (Vercel), client
 * không có cách nào truyền ngày giả vào phép tính này — đổi đồng hồ máy
 * client không ảnh hưởng gì tới kết quả.
 */

function todayUtc(): string {
  return new Date().toISOString().slice(0, 10); // YYYY-MM-DD, giờ server
}
function addDaysUtc(dateStr: string, delta: number): string {
  const d = new Date(`${dateStr}T00:00:00.000Z`);
  d.setUTCDate(d.getUTCDate() + delta);
  return d.toISOString().slice(0, 10);
}

async function requireMnytMember() {
  const user = await getCachedAuthUser();
  if (!user) return null;
  const supabase = await getSupabaseServer();
  return { user, supabase };
}

// ---------------------------------------------------------------------------
// HYDRATE — đọc toàn bộ state của member hiện tại 1 lần lúc mở app, dùng để
// nạp cache offline phía client (Giai đoạn 5). KHÔNG gộp readonly + mutation
// vào cùng 1 hàm "use server" file khác — Next.js cho phép cả 2 trong cùng
// file miễn đều "use server" ở export, nên giữ chung 1 file cho dễ theo dõi
// vòng đời state (đọc + ghi luôn đi cùng nhau ở tính năng này).
// ---------------------------------------------------------------------------

export type MnytStateBundle = {
  signedIn: boolean;
  streak: number;
  xp: number;
  freezeCount: number;
  completedIds: string[];
  favoriteIds: string[];
  badges: { id: string; earnedAt: string }[];
  journal: Record<string, string>;
  checklist: Record<string, [boolean, boolean, boolean]>;
  prefs: {
    lang: "vi" | "en";
    interests: string[];
    soundOn: boolean;
    calmMode: boolean;
    reminderOn: boolean;
    tourSeen: boolean;
  };
  savedTermIds: number[];
  termSrs: Record<number, { box: number; dueAt: string | null; seenAt: string | null }>;
  submissions: { id: number; title: string; category: string; hook: string; adminStatus: string; createdAt: string }[];
};

const DEFAULT_PREFS: MnytStateBundle["prefs"] = { lang: "vi", interests: [], soundOn: true, calmMode: false, reminderOn: true, tourSeen: false };

export async function getMnytStateBundle(): Promise<MnytStateBundle> {
  const ctx = await requireMnytMember();
  if (!ctx) {
    return {
      signedIn: false, streak: 0, xp: 0, freezeCount: 0, completedIds: [], favoriteIds: [], badges: [],
      journal: {}, checklist: {}, prefs: DEFAULT_PREFS, savedTermIds: [], termSrs: {}, submissions: [],
    };
  }
  const { user, supabase } = ctx;

  const [stateRes, completionsRes, favsRes, badgesRes, journalRes, checklistRes, prefsRes, savedRes, srsRes, submissionsRes] = await Promise.all([
    supabase.from("mnyt_user_state").select("streak, xp, freeze_count").eq("member_id", user.id).maybeSingle(),
    supabase.from("mnyt_completions").select("topic_id").eq("member_id", user.id),
    supabase.from("mnyt_favorites").select("topic_id").eq("member_id", user.id),
    supabase.from("mnyt_badges").select("badge_id, earned_at").eq("member_id", user.id),
    supabase.from("mnyt_journal_entries").select("topic_id, content").eq("member_id", user.id),
    supabase.from("mnyt_checklist_entries").select("topic_id, items").eq("member_id", user.id),
    supabase.from("mnyt_prefs").select("lang, interests, sound_on, calm_mode, reminder_on, tour_seen").eq("member_id", user.id).maybeSingle(),
    supabase.from("mnyt_saved_terms").select("term_id").eq("member_id", user.id),
    supabase.from("mnyt_term_srs").select("term_id, box, due_at, seen_at").eq("member_id", user.id),
    supabase.from("mnyt_submissions").select("id, title, category, hook, admin_status, created_at").eq("member_id", user.id).order("created_at", { ascending: false }),
  ]);

  const journal: Record<string, string> = {};
  for (const row of journalRes.data ?? []) journal[row.topic_id as string] = row.content as string;

  const checklist: Record<string, [boolean, boolean, boolean]> = {};
  for (const row of checklistRes.data ?? []) {
    const items = (row.items as boolean[] | null) ?? [false, false, false];
    checklist[row.topic_id as string] = [Boolean(items[0]), Boolean(items[1]), Boolean(items[2])];
  }

  const termSrs: Record<number, { box: number; dueAt: string | null; seenAt: string | null }> = {};
  for (const row of srsRes.data ?? []) {
    termSrs[row.term_id as number] = { box: row.box as number, dueAt: row.due_at as string | null, seenAt: row.seen_at as string | null };
  }

  const prefsRow = prefsRes.data as { lang: string; interests: string[]; sound_on: boolean; calm_mode: boolean; reminder_on: boolean; tour_seen: boolean } | null;

  return {
    signedIn: true,
    streak: (stateRes.data?.streak as number | undefined) ?? 0,
    xp: (stateRes.data?.xp as number | undefined) ?? 0,
    freezeCount: (stateRes.data?.freeze_count as number | undefined) ?? 0,
    completedIds: (completionsRes.data ?? []).map((r) => r.topic_id as string),
    favoriteIds: (favsRes.data ?? []).map((r) => r.topic_id as string),
    badges: (badgesRes.data ?? []).map((r) => ({ id: r.badge_id as string, earnedAt: r.earned_at as string })),
    journal,
    checklist,
    prefs: prefsRow
      ? { lang: (prefsRow.lang as "vi" | "en") ?? "vi", interests: prefsRow.interests ?? [], soundOn: prefsRow.sound_on ?? true, calmMode: prefsRow.calm_mode ?? false, reminderOn: prefsRow.reminder_on ?? true, tourSeen: prefsRow.tour_seen ?? false }
      : DEFAULT_PREFS,
    savedTermIds: (savedRes.data ?? []).map((r) => r.term_id as number),
    termSrs,
    submissions: (submissionsRes.data ?? []).map((r) => ({ id: r.id as number, title: r.title as string, category: r.category as string, hook: r.hook as string, adminStatus: r.admin_status as string, createdAt: r.created_at as string })),
  };
}

// ---------------------------------------------------------------------------
// HOÀN THÀNH Ý TƯỞNG — union merge (`mnyt_completions`) + streak/xp/badge
// tính lại Ở SERVER.
// ---------------------------------------------------------------------------

export type CompleteMnytTopicResult =
  | { ok: false; error: string }
  | { ok: true; alreadyCompleted: boolean; streak: number; xp: number; freezeCount: number; newBadges: { id: string; label: string; desc: string; tier?: string; categoryColor?: string }[] };

export async function completeMnytTopic(topicId: string): Promise<CompleteMnytTopicResult> {
  const ctx = await requireMnytMember();
  if (!ctx) return { ok: false, error: "Chưa đăng nhập." };
  const { user, supabase } = ctx;

  // Union merge — ignoreDuplicates trả `data: []` nếu đã tồn tại (không
  // báo lỗi, không tạo dòng mới) — dùng để phân biệt "lần đầu" (được cộng
  // XP/streak/badge) với "hoàn thành lại" (idempotent, không cộng thêm gì
  // — chặn khai thác XP vô hạn bằng cách bấm lại nhiều lần, khác hành vi
  // mockup gốc chỉ chạy trong 1 tab trình duyệt nên không có rủi ro này).
  const { data: inserted, error: insertError } = await supabase
    .from("mnyt_completions")
    .upsert({ member_id: user.id, topic_id: topicId }, { onConflict: "member_id,topic_id", ignoreDuplicates: true })
    .select("id");
  if (insertError) return { ok: false, error: "Không thể ghi nhận hoàn thành, vui lòng thử lại." };

  const isFirstTime = (inserted?.length ?? 0) > 0;

  const { data: stateRow } = await supabase
    .from("mnyt_user_state")
    .select("streak, xp, freeze_count, last_completed_date")
    .eq("member_id", user.id)
    .maybeSingle();

  let streak = stateRow?.streak ?? 0;
  let xp = stateRow?.xp ?? 0;
  let freezeCount = stateRow?.freeze_count ?? 0;
  const lastDate = (stateRow?.last_completed_date as string | null) ?? null;
  const today = todayUtc();

  if (isFirstTime) {
    xp += 10;
    if (lastDate !== today) {
      const yesterday = addDaysUtc(today, -1);
      const twoDaysAgo = addDaysUtc(today, -2);
      if (!lastDate) streak = 1;
      else if (lastDate === yesterday) streak += 1;
      else if (lastDate === twoDaysAgo && freezeCount > 0) { streak += 1; freezeCount -= 1; }
      else streak = 1;
    }
    await supabase.from("mnyt_user_state").upsert({ member_id: user.id, streak, xp, freeze_count: freezeCount, last_completed_date: today, updated_at: new Date().toISOString() });
  }

  // Huy hiệu — chỉ tính lại khi có thay đổi thật (lần đầu hoàn thành).
  let newBadges: { id: string; label: string; desc: string; tier?: string; categoryColor?: string }[] = [];
  if (isFirstTime) {
    const [categories, completionsRes, existingBadgesRes, allTopicsRes] = await Promise.all([
      getLiveMnytCategories(),
      supabase.from("mnyt_completions").select("topic_id").eq("member_id", user.id),
      supabase.from("mnyt_badges").select("badge_id").eq("member_id", user.id),
      supabase.from("mnyt_topics").select("id, category_key").eq("status", "Published"),
    ]);

    const completedIds = new Set((completionsRes.data ?? []).map((r) => r.topic_id as string));
    const topicCategory = new Map((allTopicsRes.data ?? []).map((r) => [r.id as string, r.category_key as string]));
    const categoryTotals: Record<string, number> = {};
    for (const row of allTopicsRes.data ?? []) {
      const key = row.category_key as string;
      categoryTotals[key] = (categoryTotals[key] ?? 0) + 1;
    }
    const categoryCompleted: Record<string, number> = {};
    for (const id of completedIds) {
      const key = topicCategory.get(id);
      if (key) categoryCompleted[key] = (categoryCompleted[key] ?? 0) + 1;
    }

    const defs: BadgeDef[] = buildBadgeDefs(categories, categoryTotals);
    const existingBadgeIds = new Set((existingBadgesRes.data ?? []).map((r) => r.badge_id as string));
    const earned = defs.filter((d) => !existingBadgeIds.has(d.id) && d.check({ streak, totalCompleted: completedIds.size, categoryCompleted }));

    if (earned.length) {
      await supabase.from("mnyt_badges").upsert(
        earned.map((d) => ({ member_id: user.id, badge_id: d.id })),
        { onConflict: "member_id,badge_id", ignoreDuplicates: true },
      );
      newBadges = earned.map((d) => ({ id: d.id, label: d.label, desc: d.desc, tier: d.tier, categoryColor: d.categoryColor }));
    }
  }

  revalidatePath("/v2/moi-ngay-mot-y-tuong");
  return { ok: true, alreadyCompleted: !isFirstTime, streak, xp, freezeCount, newBadges };
}

// ---------------------------------------------------------------------------
// YÊU THÍCH — union merge khi thêm, xoá thật khi user chủ động bỏ thích.
// ---------------------------------------------------------------------------

export async function toggleMnytFavorite(topicId: string): Promise<{ ok: boolean; isFavorite: boolean }> {
  const ctx = await requireMnytMember();
  if (!ctx) return { ok: false, isFavorite: false };
  const { user, supabase } = ctx;

  const { data: existing } = await supabase.from("mnyt_favorites").select("topic_id").eq("member_id", user.id).eq("topic_id", topicId).maybeSingle();
  if (existing) {
    await supabase.from("mnyt_favorites").delete().eq("member_id", user.id).eq("topic_id", topicId);
    revalidatePath("/v2/moi-ngay-mot-y-tuong");
    return { ok: true, isFavorite: false };
  }
  await supabase.from("mnyt_favorites").upsert({ member_id: user.id, topic_id: topicId }, { onConflict: "member_id,topic_id", ignoreDuplicates: true });
  revalidatePath("/v2/moi-ngay-mot-y-tuong");
  return { ok: true, isFavorite: true };
}

// ---------------------------------------------------------------------------
// NHẬT KÝ / CHECKLIST — last-write-wins theo entry, `updated_at` do SERVER
// gán (không tin timestamp client gửi lên).
// ---------------------------------------------------------------------------

export async function saveMnytJournalEntry(topicId: string, content: string): Promise<{ ok: boolean }> {
  const ctx = await requireMnytMember();
  if (!ctx) return { ok: false };
  const { error } = await ctx.supabase
    .from("mnyt_journal_entries")
    .upsert({ member_id: ctx.user.id, topic_id: topicId, content, updated_at: new Date().toISOString() }, { onConflict: "member_id,topic_id" });
  return { ok: !error };
}

export async function saveMnytChecklist(topicId: string, items: [boolean, boolean, boolean]): Promise<{ ok: boolean }> {
  const ctx = await requireMnytMember();
  if (!ctx) return { ok: false };
  const { error } = await ctx.supabase
    .from("mnyt_checklist_entries")
    .upsert({ member_id: ctx.user.id, topic_id: topicId, items, updated_at: new Date().toISOString() }, { onConflict: "member_id,topic_id" });
  return { ok: !error };
}

// ---------------------------------------------------------------------------
// ĐỀ XUẤT Ý TƯỞNG / BÁO LỖI THỜI — POST-ONLY, không có hàm sửa/xoá.
// ---------------------------------------------------------------------------

export async function submitMnytIdea(input: { title: string; category: string; hook: string }): Promise<{ ok: boolean; error?: string }> {
  const ctx = await requireMnytMember();
  if (!ctx) return { ok: false, error: "Chưa đăng nhập." };
  if (!input.title.trim() || !input.hook.trim()) return { ok: false, error: "Vui lòng nhập đủ tên và mô tả ý tưởng." };

  const { error } = await ctx.supabase.from("mnyt_submissions").insert({
    member_id: ctx.user.id,
    title: input.title.trim(),
    category: input.category,
    hook: input.hook.trim(),
  });
  return { ok: !error };
}

export async function reportMnytOutdated(topicId: string): Promise<{ ok: boolean }> {
  const ctx = await requireMnytMember();
  if (!ctx) return { ok: false };
  const { error } = await ctx.supabase
    .from("mnyt_outdated_reports")
    .upsert({ member_id: ctx.user.id, topic_id: topicId }, { onConflict: "member_id,topic_id", ignoreDuplicates: true });
  return { ok: !error };
}

// ---------------------------------------------------------------------------
// PREFS — last-write-wins theo thiết bị, patch từng phần.
// ---------------------------------------------------------------------------

export async function updateMnytPrefs(patch: Partial<{ lang: "vi" | "en"; interests: string[]; soundOn: boolean; calmMode: boolean; reminderOn: boolean; tourSeen: boolean }>): Promise<{ ok: boolean }> {
  const ctx = await requireMnytMember();
  if (!ctx) return { ok: false };
  const row: Record<string, unknown> = { member_id: ctx.user.id, updated_at: new Date().toISOString() };
  if (patch.lang !== undefined) row.lang = patch.lang;
  if (patch.interests !== undefined) row.interests = patch.interests;
  if (patch.soundOn !== undefined) row.sound_on = patch.soundOn;
  if (patch.calmMode !== undefined) row.calm_mode = patch.calmMode;
  if (patch.reminderOn !== undefined) row.reminder_on = patch.reminderOn;
  if (patch.tourSeen !== undefined) row.tour_seen = patch.tourSeen;

  const { error } = await ctx.supabase.from("mnyt_prefs").upsert(row, { onConflict: "member_id" });
  return { ok: !error };
}

// ---------------------------------------------------------------------------
// TỪ ĐIỂN — thuật ngữ đã lưu (union merge) + SRS ôn tập ngắt quãng (LWW).
// ---------------------------------------------------------------------------

export async function toggleMnytSavedTerm(termId: number): Promise<{ ok: boolean; isSaved: boolean }> {
  const ctx = await requireMnytMember();
  if (!ctx) return { ok: false, isSaved: false };
  const { user, supabase } = ctx;

  const { data: existing } = await supabase.from("mnyt_saved_terms").select("term_id").eq("member_id", user.id).eq("term_id", termId).maybeSingle();
  if (existing) {
    await supabase.from("mnyt_saved_terms").delete().eq("member_id", user.id).eq("term_id", termId);
    return { ok: true, isSaved: false };
  }
  await supabase.from("mnyt_saved_terms").upsert({ member_id: user.id, term_id: termId }, { onConflict: "member_id,term_id", ignoreDuplicates: true });
  return { ok: true, isSaved: true };
}

export async function saveMnytTermSrs(termId: number, srs: { box: number; dueAt: string | null; seenAt: string | null }): Promise<{ ok: boolean }> {
  const ctx = await requireMnytMember();
  if (!ctx) return { ok: false };
  const { error } = await ctx.supabase
    .from("mnyt_term_srs")
    .upsert({ member_id: ctx.user.id, term_id: termId, box: srs.box, due_at: srs.dueAt, seen_at: srs.seenAt, updated_at: new Date().toISOString() }, { onConflict: "member_id,term_id" });
  return { ok: !error };
}
