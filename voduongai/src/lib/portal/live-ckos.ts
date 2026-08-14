import { cache } from "react";

import { getSupabasePublic } from "@/lib/supabase";
import { getSupabaseServer } from "@/lib/supabase-server";
import type { PremiumStatus } from "@/lib/v2/premium-access";

/**
 * Nguồn dữ liệu THẬT cho Hệ tri thức (CKOS) 2.0 — `/v2/he-tri-thuc`.
 *
 * Bảng: `ckos_categories` (6 danh mục), `knowledge_assets` (13 tài liệu CKOS
 * 2.0), `ckos_tags`/`ckos_content_tags`, `learning_paths` (4 giai đoạn).
 *
 * ---------------------------------------------------------------------------
 * PHÂN BIỆT 13 TÀI LIỆU CKOS 2.0 VỚI 80 KNOWLEDGE ASSET CŨ (chung 1 bảng)
 *
 * `knowledge_assets` hiện có 93 dòng: 80 Knowledge Asset cũ (migrate ở Phase
 * 34, nuôi Portal 1.0) + 13 tài liệu CKOS 2.0 (Phase 36). Tài liệu CKOS 2.0
 * là dòng CÓ `content->>'categorySlug'` — tức "thuộc 1 trong 6 danh mục
 * CKOS". Đây là ngữ nghĩa thật, không phải cờ kỹ thuật gắn thêm.
 * ---------------------------------------------------------------------------
 * BƯỚC D — KHOÁ NỘI DUNG PREMIUM Ở TẦNG SERVER, KHÔNG CHỈ Ở UI
 *
 * RLS `knowledge_assets_read_published` cho phép MỌI người đọc mọi dòng
 * `status='PUBLISHED'` — nghĩa là chỉ phủ overlay ở giao diện thì `body` của
 * tài liệu Premium vẫn lấy được qua API bằng anon key. Vì vậy:
 *
 *   • `getCkosDocuments()` (danh sách) KHÔNG BAO GIỜ select `body` — trang
 *     danh sách không cần, và không tải về thì không lộ.
 *   • `getCkosDocument(slug, status)` mới đọc `body`, và CẮT BỎ ngay tại
 *     server nếu tài liệu là `premium` mà user chưa Premium — trả về
 *     `locked: true` để UI dựng CTA nâng cấp.
 *
 * Đây là lớp phòng thủ thật; overlay ở UI chỉ là phần nhìn thấy được.
 * ---------------------------------------------------------------------------
 * MỤC 2 — ĐẾM LƯỢT XEM TÀI LIỆU THẬT (`ckos_content_views`)
 *
 * Theo đúng pattern polymorphic đã dùng cho `ckos_content_tags`
 * (`content_type`/`content_id` dạng text) — KHÔNG thêm cột riêng vào
 * `knowledge_assets` vì nội dung CKOS nằm rải nhiều bảng. `content_type`
 * cố định `"knowledge_asset"` (khớp giá trị đã mở rộng cho
 * `ckos_content_tags_content_type_check` trước đó).
 *
 * Ghi qua hàm SECURITY DEFINER `record_ckos_content_view` (không có policy
 * ghi trực tiếp nào trên `ckos_content_views`/`ckos_content_view_events` —
 * user không thể tự forge lượt xem qua REST API). Giới hạn tự quyết: **1
 * lượt/user/tài liệu/ngày** (bảng phụ `ckos_content_view_events` dedupe
 * theo `viewed_date`, không public-readable, chỉ hàm chạm được).
 *
 * `getCkosDocument()` gọi `recordCkosContentView()` khi `!locked` — mỗi lần
 * user thực sự xem được nội dung (không tính lượt bị khoá Premium).
 * `getCkosPopularDocuments()` xếp theo `view_count` giảm dần; hệ thống mới
 * nên toàn bộ có thể đang 0 — khi đó fallback sang "mới nhất"
 * (`sortedByViews: false`) để card không trống oan.
 * ---------------------------------------------------------------------------
 */

export type CkosCategory = {
  slug: string;
  name: string;
  description: string;
  icon: string;
  order: number;
  /** Số tài liệu Published thuộc danh mục này — đếm thật, không phải ước lượng. */
  documentCount: number;
};

export type CkosAccessLevel = "free" | "premium";

export type CkosDocumentSummary = {
  slug: string;
  title: string;
  summary: string;
  categorySlug: string;
  categoryName: string;
  accessLevel: CkosAccessLevel;
  readingTime: string;
  tags: string[];
  createdAt: string;
};

export type CkosStage = {
  slug: string;
  title: string;
  /**
   * Nhãn NGẮN hiện dưới tên giai đoạn trong thiết kế (`rm-text span`, vd.
   * "Nền tảng cơ bản"). KHÁC `description` — đoạn "Mục tiêu: ..." dài dùng
   * cho trang lộ trình chi tiết sau này, không phải nhãn 1 dòng ở đây.
   */
  subtitle: string;
  description: string;
  stageOrder: number;
};

export type CkosStats = {
  documents: number;
  categories: number;
  toolsAndPrompts: number;
  linkedLessons: number;
  learningPaths: number;
};

type AssetRow = {
  slug: string;
  title: string;
  summary: string | null;
  created_at: string;
  content: Record<string, unknown> | null;
};

function readContent(row: AssetRow) {
  const c = (row.content ?? {}) as Record<string, unknown>;
  return {
    categorySlug: typeof c.categorySlug === "string" ? c.categorySlug : "",
    accessLevel: (c.accessLevel === "premium" ? "premium" : "free") as CkosAccessLevel,
    readingTime: typeof c.readingTime === "string" ? c.readingTime : "",
    tags: Array.isArray(c.tags) ? c.tags.filter((t): t is string => typeof t === "string") : [],
    body: typeof c.body === "string" ? c.body : "",
  };
}

export const getCkosCategories = cache(async (): Promise<CkosCategory[]> => {
  const supabase = getSupabasePublic();
  if (!supabase) return [];

  const [{ data: cats }, { data: assets }] = await Promise.all([
    supabase.from("ckos_categories").select("slug, name, description, icon, order").order("order"),
    supabase.from("knowledge_assets").select("content").eq("status", "PUBLISHED"),
  ]);

  const counts = new Map<string, number>();
  for (const row of assets ?? []) {
    const slug = (row as { content: Record<string, unknown> | null }).content?.categorySlug;
    if (typeof slug === "string") counts.set(slug, (counts.get(slug) ?? 0) + 1);
  }

  return (cats ?? []).map((c) => ({
    slug: c.slug as string,
    name: c.name as string,
    description: (c.description as string | null) ?? "",
    icon: (c.icon as string | null) ?? "",
    order: (c.order as number | null) ?? 0,
    documentCount: counts.get(c.slug as string) ?? 0,
  }));
});

/** Danh sách tài liệu — KHÔNG kèm `body` (xem lý do ở đầu file). */
export const getCkosDocuments = cache(async (): Promise<CkosDocumentSummary[]> => {
  const supabase = getSupabasePublic();
  if (!supabase) return [];

  const [{ data: rows }, categories] = await Promise.all([
    supabase
      .from("knowledge_assets")
      .select("slug, title, summary, created_at, content")
      .eq("status", "PUBLISHED")
      .order("created_at", { ascending: false }),
    getCkosCategories(),
  ]);

  const nameBySlug = new Map(categories.map((c) => [c.slug, c.name]));

  return (rows ?? [])
    .map((row) => {
      const r = row as AssetRow;
      const c = readContent(r);
      return { r, c };
    })
    // Chỉ tài liệu CKOS 2.0 (có danh mục) — loại 80 Knowledge Asset cũ.
    .filter(({ c }) => c.categorySlug !== "")
    .map(({ r, c }) => ({
      slug: r.slug,
      title: r.title,
      summary: r.summary ?? "",
      categorySlug: c.categorySlug,
      categoryName: nameBySlug.get(c.categorySlug) ?? c.categorySlug,
      accessLevel: c.accessLevel,
      readingTime: c.readingTime,
      tags: c.tags,
      createdAt: r.created_at,
    }));
});

export const getCkosStages = cache(async (): Promise<CkosStage[]> => {
  const supabase = getSupabasePublic();
  if (!supabase) return [];
  const { data } = await supabase
    .from("learning_paths")
    .select("slug, title, subtitle, description, stage_order")
    .order("stage_order");
  return (data ?? []).map((r) => ({
    slug: r.slug as string,
    title: r.title as string,
    subtitle: (r.subtitle as string | null) ?? "",
    description: (r.description as string | null) ?? "",
    stageOrder: (r.stage_order as number | null) ?? 0,
  }));
});

export const getCkosStats = cache(async (): Promise<CkosStats> => {
  const supabase = getSupabasePublic();
  if (!supabase) {
    return { documents: 0, categories: 0, toolsAndPrompts: 0, linkedLessons: 0, learningPaths: 0 };
  }

  const head = { count: "exact" as const, head: true };
  const [docs, cats, tools, prompts, lessons, paths] = await Promise.all([
    supabase.from("knowledge_assets").select("slug", head).eq("status", "PUBLISHED"),
    supabase.from("ckos_categories").select("slug", head),
    supabase.from("tools").select("id", head).eq("status", "Published"),
    supabase.from("prompts").select("id", head).eq("status", "Published"),
    supabase.from("course_lessons").select("id", head).eq("status", "Published"),
    supabase.from("learning_paths").select("slug", head),
  ]);

  // `documents` đếm riêng tài liệu CKOS 2.0 (có danh mục), không gộp 80 asset cũ.
  const ckosDocs = (await getCkosDocuments()).length;

  return {
    documents: ckosDocs || (docs.count ?? 0),
    categories: cats.count ?? 0,
    toolsAndPrompts: (tools.count ?? 0) + (prompts.count ?? 0),
    linkedLessons: lessons.count ?? 0,
    learningPaths: paths.count ?? 0,
  };
});

export type CkosDocumentDetail = CkosDocumentSummary & {
  /** Rỗng khi `locked` — server không trả nội dung về client. */
  body: string;
  locked: boolean;
};

/**
 * Đọc 1 tài liệu kèm nội dung. Nội dung Premium bị CẮT ngay tại server nếu
 * user chưa Premium — không dựa vào việc UI có phủ overlay hay không.
 */
export async function getCkosDocument(
  slug: string,
  status: PremiumStatus,
): Promise<CkosDocumentDetail | null> {
  const supabase = getSupabasePublic();
  if (!supabase) return null;

  const [{ data: row }, categories] = await Promise.all([
    supabase
      .from("knowledge_assets")
      .select("slug, title, summary, created_at, content")
      .eq("slug", slug)
      .eq("status", "PUBLISHED")
      .maybeSingle(),
    getCkosCategories(),
  ]);
  if (!row) return null;

  const r = row as AssetRow;
  const c = readContent(r);
  if (!c.categorySlug) return null;

  const locked = c.accessLevel === "premium" && !status.isPremium;

  if (!locked) {
    // Best-effort — không bao giờ chặn render nếu ghi lượt xem lỗi.
    await recordCkosContentView(r.slug);
  }

  return {
    slug: r.slug,
    title: r.title,
    summary: r.summary ?? "",
    categorySlug: c.categorySlug,
    categoryName: categories.find((x) => x.slug === c.categorySlug)?.name ?? c.categorySlug,
    accessLevel: c.accessLevel,
    readingTime: c.readingTime,
    tags: c.tags,
    createdAt: r.created_at,
    body: locked ? "" : c.body,
    locked,
  };
}

const CKOS_VIEW_CONTENT_TYPE = "knowledge_asset";

/**
 * Ghi 1 lượt xem tài liệu CKOS (tối đa 1 lượt/user/tài liệu/ngày, xử lý
 * dedupe ở hàm SQL `record_ckos_content_view`). Best-effort — lỗi (chưa
 * đăng nhập, chưa cấu hình Supabase, RPC lỗi...) không bao giờ throw ra
 * ngoài, chỉ bỏ qua việc đếm.
 */
export async function recordCkosContentView(slug: string): Promise<void> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    return;
  }
  try {
    const supabase = await getSupabaseServer();
    await supabase.rpc("record_ckos_content_view", {
      p_content_type: CKOS_VIEW_CONTENT_TYPE,
      p_content_id: slug,
    });
  } catch {
    // Không chặn render vì lỗi ghi lượt xem — xem docblock MỤC 2 ở đầu file.
  }
}

export type CkosPopularDocument = CkosDocumentSummary & { viewCount: number };

export type CkosPopularDocumentsResult = {
  documents: CkosPopularDocument[];
  /** false khi toàn bộ `viewCount` = 0 — danh sách đang fallback theo "mới nhất". */
  sortedByViews: boolean;
};

/**
 * "Tài liệu phổ biến" — xếp theo `view_count` giảm dần. Hệ thống mới nên
 * toàn bộ có thể đang 0 lượt xem; khi đó fallback sang "mới nhất"
 * (`getCkosDocuments()` đã `order("created_at", {ascending:false})`) thay
 * vì hiện 1 khối trống — vẫn báo trung thực qua `sortedByViews: false`.
 */
export const getCkosPopularDocuments = cache(
  async (limit = 3): Promise<CkosPopularDocumentsResult> => {
    const documents = await getCkosDocuments();
    if (documents.length === 0) return { documents: [], sortedByViews: false };

    const supabase = getSupabasePublic();
    const viewsBySlug = new Map<string, number>();
    if (supabase) {
      const { data } = await supabase
        .from("ckos_content_views")
        .select("content_id, view_count")
        .eq("content_type", CKOS_VIEW_CONTENT_TYPE)
        .in(
          "content_id",
          documents.map((d) => d.slug),
        );
      for (const row of data ?? []) {
        viewsBySlug.set(row.content_id as string, (row.view_count as number) ?? 0);
      }
    }

    const withViews: CkosPopularDocument[] = documents.map((doc) => ({
      ...doc,
      viewCount: viewsBySlug.get(doc.slug) ?? 0,
    }));

    const hasAnyView = withViews.some((d) => d.viewCount > 0);
    if (!hasAnyView) {
      // `documents` đã sắp theo mới nhất — giữ nguyên thứ tự, chỉ cắt limit.
      return { documents: withViews.slice(0, limit), sortedByViews: false };
    }

    const sorted = [...withViews].sort((a, b) => b.viewCount - a.viewCount);
    return { documents: sorted.slice(0, limit), sortedByViews: true };
  },
);
