import { cache } from "react";
import { getSupabasePublic } from "@/lib/supabase";

/**
 * "Mỗi ngày một ý tưởng" (`/v2/moi-ngay-mot-y-tuong`) — lớp đọc dữ liệu
 * NỘI DUNG (topics/categories/glossary), Phase 41.
 *
 * README bàn giao (`design_handoff_moi_ngay_1_y_tuong/README.md`, mục "Data
 * Model") yêu cầu tường minh: KHÔNG tải hết 446 ý tưởng để hiển thị 1 —
 * `getMnytTopicsPage()` chỉ SELECT các cột NHẸ (không có `content` jsonb đầy
 * đủ) cho danh sách/lưới; `getMnytTopicById()` mới SELECT `content` đầy đủ,
 * dùng đúng lúc mở 1 ý tưởng. `/api/mnyt/topics` (route.ts riêng) gọi lại
 * ĐÚNG hàm `getMnytTopicsPage()` này — Single Source of Truth giữa API REST
 * (dùng cho "tải thêm" phía client ở Kho ý tưởng) và Server Component (SSR
 * trang chủ/lộ trình).
 */

export type MnytCategory = {
  key: string;
  name: string;
  nameEn: string;
  shortName: string;
  color: string;
  orderIndex: number;
};

export type MnytQuiz = {
  question: string;
  options: string[];
  correct: number;
  why?: string;
};

/** Nội dung đầy đủ 1 ý tưởng — chỉ SELECT khi mở trang Chi tiết. */
export type MnytTopicContent = {
  concept: string;
  conceptEn: string;
  apply: string;
  applyEn: string;
  mechanism: string;
  mechanismEn: string;
  risk: string;
  riskEn: string;
  takeaway: string;
  takeawayEn: string;
  promptExample: string;
  promptShort: string;
  promptShortEn: string;
  promptDetailed: string;
  promptDetailedEn: string;
  promptAdvanced: string;
  promptAdvancedEn: string;
  quiz: MnytQuiz;
  quizEn: MnytQuiz;
  scenarioQuiz: MnytQuiz;
  scenarioQuizEn: MnytQuiz;
  applyQuiz: MnytQuiz;
  applyQuizEn: MnytQuiz;
};

/** Trường nhẹ — đủ cho lưới/danh sách (Trang chủ, Kho ý tưởng, Lộ trình). */
export type MnytTopicSummary = {
  id: string;
  day: number;
  categoryKey: string;
  categoryName: string;
  categoryNameEn: string;
  color: string;
  title: string;
  titleEn: string;
  hook: string;
  hookEn: string;
  difficulty: string;
  estMinutes: number;
  tools: string[];
  isTrending: boolean;
  pathStep: number;
  pathTotal: number;
};

export type MnytTopicFull = MnytTopicSummary & { content: MnytTopicContent };

const SUMMARY_COLUMNS =
  "id, day, category_key, category_name, category_name_en, color, title, title_en, hook, hook_en, difficulty, est_minutes, tools, is_trending, path_step, path_total";

type SummaryRow = {
  id: string;
  day: number;
  category_key: string;
  category_name: string;
  category_name_en: string;
  color: string;
  title: string;
  title_en: string;
  hook: string;
  hook_en: string;
  difficulty: string;
  est_minutes: number;
  tools: string[] | null;
  is_trending: boolean;
  path_step: number;
  path_total: number;
};

function mapSummaryRow(row: SummaryRow): MnytTopicSummary {
  return {
    id: row.id,
    day: row.day,
    categoryKey: row.category_key,
    categoryName: row.category_name,
    categoryNameEn: row.category_name_en,
    color: row.color,
    title: row.title,
    titleEn: row.title_en,
    hook: row.hook,
    hookEn: row.hook_en,
    difficulty: row.difficulty,
    estMinutes: row.est_minutes,
    tools: row.tools ?? [],
    isTrending: row.is_trending,
    pathStep: row.path_step,
    pathTotal: row.path_total,
  };
}

/**
 * Số ý tưởng THẬT/lĩnh vực — dùng cho thanh tiến độ ở lưới "thẻ chủ đề"
 * (Trang chủ) và badge "Chuyên gia <lĩnh vực>". Chỉ SELECT đúng 1 cột nhẹ
 * (`category_key`) cho toàn bộ 446 dòng rồi đếm ở JS — Supabase JS client
 * không có `GROUP BY` trực tiếp qua PostgREST filter builder, và 446 dòng
 * × 1 cột text là chi phí không đáng kể so với 1 RPC riêng.
 */
export const getLiveMnytCategoryTotals = cache(async (): Promise<Record<string, number>> => {
  const supabase = getSupabasePublic();
  if (!supabase) return {};
  const { data, error } = await supabase.from("mnyt_topics").select("category_key").eq("status", "Published");
  if (error || !data) return {};
  const totals: Record<string, number> = {};
  for (const row of data as { category_key: string }[]) {
    totals[row.category_key] = (totals[row.category_key] ?? 0) + 1;
  }
  return totals;
});

export const getLiveMnytTopicsCount = cache(async (): Promise<number> => {
  const supabase = getSupabasePublic();
  if (!supabase) return 0;
  const { count } = await supabase.from("mnyt_topics").select("id", { count: "exact", head: true }).eq("status", "Published");
  return count ?? 0;
});

/** Lưới nhẹ cho quả cầu 3D + dải "Đang thịnh hành" — chỉ 5 cột cần thiết,
 * KHÔNG có `content`/`hook` đầy đủ. */
export type MnytGlobeNode = { id: string; day: number; categoryKey: string; categoryName: string; color: string; title: string; difficulty: string; isTrending: boolean };

export const getLiveMnytGlobeNodes = cache(async (): Promise<MnytGlobeNode[]> => {
  const supabase = getSupabasePublic();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("mnyt_topics")
    .select("id, day, category_key, category_name, color, title, difficulty, is_trending")
    .eq("status", "Published")
    .order("day", { ascending: true });
  if (error || !data) return [];
  return (
    data as { id: string; day: number; category_key: string; category_name: string; color: string; title: string; difficulty: string; is_trending: boolean }[]
  ).map((r) => ({
    id: r.id,
    day: r.day,
    categoryKey: r.category_key,
    categoryName: r.category_name,
    color: r.color,
    title: r.title,
    difficulty: r.difficulty,
    isTrending: r.is_trending,
  }));
});

export const getLiveMnytCategories = cache(async (): Promise<MnytCategory[]> => {
  const supabase = getSupabasePublic();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("mnyt_categories")
    .select("key, name, name_en, short_name, color, order_index")
    .eq("status", "Published")
    .order("order_index", { ascending: true });
  if (error || !data) return [];
  return data.map((row) => ({
    key: row.key as string,
    name: row.name as string,
    nameEn: row.name_en as string,
    shortName: row.short_name as string,
    color: row.color as string,
    orderIndex: row.order_index as number,
  }));
});

export type MnytTopicListParams = {
  page: number;
  pageSize: number;
  categoryKey?: string | null;
  difficulty?: string | null;
  tool?: string | null;
  isTrending?: boolean | null;
  q?: string | null;
  /** true = sắp theo `day` giảm dần (mới nhất trước) — mặc định tăng dần. */
  sortDesc?: boolean;
};

const MAX_PAGE_SIZE = 60;
const DEFAULT_PAGE_SIZE = 60;

export function clampMnytPageSize(raw: number | null | undefined): number {
  const n = Number(raw) || DEFAULT_PAGE_SIZE;
  return Math.min(MAX_PAGE_SIZE, Math.max(1, n));
}

/**
 * Danh sách ý tưởng có phân trang + lọc thật (query trực tiếp DB, không tải
 * hết 446 dòng rồi lọc/slice ở tầng ứng dụng như CKOS Read API foundation
 * cũ — bảng `mnyt_topics` có đủ cột typed để Postgres tự lọc/`range()`).
 */
export const getLiveMnytTopicsPage = async (
  params: MnytTopicListParams,
): Promise<{ items: MnytTopicSummary[]; total: number }> => {
  const supabase = getSupabasePublic();
  if (!supabase) return { items: [], total: 0 };

  const page = Math.max(1, params.page);
  const pageSize = clampMnytPageSize(params.pageSize);
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  let query = supabase
    .from("mnyt_topics")
    .select(SUMMARY_COLUMNS, { count: "exact" })
    .eq("status", "Published");

  if (params.categoryKey) query = query.eq("category_key", params.categoryKey);
  if (params.difficulty) query = query.eq("difficulty", params.difficulty);
  if (params.tool) query = query.contains("tools", [params.tool]);
  if (params.isTrending) query = query.eq("is_trending", true);
  if (params.q && params.q.trim()) {
    const q = params.q.trim().replace(/[%_]/g, "");
    query = query.or(`title.ilike.%${q}%,hook.ilike.%${q}%,category_name.ilike.%${q}%`);
  }

  query = query.order("day", { ascending: !params.sortDesc }).range(from, to);

  const { data, error, count } = await query;
  if (error || !data) return { items: [], total: 0 };
  return { items: (data as unknown as SummaryRow[]).map(mapSummaryRow), total: count ?? data.length };
};

export const getLiveMnytTopicById = cache(async (id: string): Promise<MnytTopicFull | null> => {
  const supabase = getSupabasePublic();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("mnyt_topics")
    .select(`${SUMMARY_COLUMNS}, content`)
    .eq("id", id)
    .eq("status", "Published")
    .maybeSingle();
  if (error || !data) return null;
  const row = data as unknown as SummaryRow & { content: MnytTopicContent };
  return { ...mapSummaryRow(row), content: row.content };
});

/**
 * "Ý tưởng hôm nay" — tôn trọng lĩnh vực người dùng đã chọn ở onboarding
 * (`interests`), giữ đúng logic vòng lặp theo epoch-day của mockup gốc
 * (`todayId()`: `Math.floor(Date.now()/86400000) % list.length`) nhưng
 * KHÔNG tải toàn bộ danh sách — chỉ COUNT rồi lấy đúng 1 dòng qua
 * `range(idx, idx)`, sắp theo `day` để thứ tự ổn định (khớp ý nghĩa "list"
 * gốc, vốn được sinh theo đúng thứ tự `day`).
 */
export const getLiveMnytTodayTopic = async (interests: string[]): Promise<MnytTopicSummary | null> => {
  const supabase = getSupabasePublic();
  if (!supabase) return null;

  const buildBase = () => {
    let q = supabase.from("mnyt_topics").select(SUMMARY_COLUMNS, { count: "exact" }).eq("status", "Published");
    if (interests.length) q = q.in("category_key", interests);
    return q;
  };

  const { count } = await buildBase().range(0, 0);
  const total = count ?? 0;
  if (total === 0) {
    // Không có ý tưởng nào khớp lĩnh vực đã chọn (dữ liệu trống bất
    // thường) — quay lại toàn bộ kho, đúng fallback `pool.length ? pool :
    // this.topics` của mockup gốc.
    const { count: allCount } = await supabase
      .from("mnyt_topics")
      .select("id", { count: "exact", head: true })
      .eq("status", "Published");
    const allTotal = allCount ?? 0;
    if (allTotal === 0) return null;
    const idx = Math.floor(Date.now() / 86400000) % allTotal;
    const { data } = await supabase
      .from("mnyt_topics")
      .select(SUMMARY_COLUMNS)
      .eq("status", "Published")
      .order("day", { ascending: true })
      .range(idx, idx)
      .maybeSingle();
    return data ? mapSummaryRow(data as unknown as SummaryRow) : null;
  }

  const idx = Math.floor(Date.now() / 86400000) % total;
  const { data } = await buildBase().order("day", { ascending: true }).range(idx, idx).maybeSingle();
  return data ? mapSummaryRow(data as unknown as SummaryRow) : null;
};

export type MnytGlossaryTerm = {
  id: number;
  term: string;
  termEn: string;
  category: string;
  definition: string;
  definitionEn: string;
  orderIndex: number;
};

type GlossaryRow = {
  id: number;
  term: string;
  term_en: string;
  category: string;
  definition: string;
  definition_en: string;
  order_index: number;
};

function mapGlossaryRow(row: GlossaryRow): MnytGlossaryTerm {
  return {
    id: row.id,
    term: row.term,
    termEn: row.term_en,
    category: row.category,
    definition: row.definition,
    definitionEn: row.definition_en,
    orderIndex: row.order_index,
  };
}

/** 100 dòng — nhẹ, không cần phân trang thật, nhưng vẫn qua 1 API riêng
 * (`/api/mnyt/glossary`) để đúng kiến trúc "đọc qua API", không tải tĩnh. */
export const getLiveMnytGlossary = cache(async (): Promise<MnytGlossaryTerm[]> => {
  const supabase = getSupabasePublic();
  if (!supabase) return [];
  const { data, error } = await supabase
    .from("mnyt_glossary")
    .select("id, term, term_en, category, definition, definition_en, order_index")
    .eq("status", "Published")
    .order("order_index", { ascending: true });
  if (error || !data) return [];
  return (data as GlossaryRow[]).map(mapGlossaryRow);
});

export const getLiveMnytGlossaryTermById = cache(async (id: number): Promise<MnytGlossaryTerm | null> => {
  const supabase = getSupabasePublic();
  if (!supabase) return null;
  const { data, error } = await supabase
    .from("mnyt_glossary")
    .select("id, term, term_en, category, definition, definition_en, order_index")
    .eq("id", id)
    .eq("status", "Published")
    .maybeSingle();
  if (error || !data) return null;
  return mapGlossaryRow(data as GlossaryRow);
});
