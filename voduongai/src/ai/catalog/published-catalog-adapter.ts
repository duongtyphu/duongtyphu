/**
 * SPRINT FIX-R02 — Published Knowledge Adapter.
 *
 * Chuyển Published Content HIỆN CÓ của dự án thành `CatalogEntry[]`. CHỈ
 * dùng lại các hàm `getLive*()` đã tồn tại ở `src/lib/portal/live-*.ts`
 * (tầng Published/Live — mỗi hàm tự lọc `status="Published"` trước khi
 * trả dữ liệu) — KHÔNG tạo truy vấn Supabase mới, KHÔNG đọc bảng nào
 * trực tiếp. Đây là mapping THUẦN: đổi shape, không thêm business logic
 * (không lọc/sắp xếp/tính điểm — việc đó là của `resolveKnowledgeNeed()`,
 * `src/ai/catalog/knowledge-resolver.ts`).
 *
 * Đây là ngoại lệ DUY NHẤT có I/O bên trong `src/ai/catalog/` (namespace
 * còn lại vẫn thuần) — vì chính bản chất "Adapter" là cầu nối sang tầng
 * Published/Live đã có, đúng yêu cầu "Companion KHÔNG được đọc Supabase
 * trực tiếp — Companion chỉ đọc Published Catalog".
 *
 * 5 nguồn đã map (mỗi nguồn 1 `KnowledgeType` sẵn có ở A05, không bịa loại
 * mới): Tool AI (`tool`), Best Practice (`best-practice`), Resource
 * (`resource`), Lesson/Knowledge Seed (`lesson`), Dự án & Cơ hội
 * (`project`). Các nguồn `live-*.ts` khác (blog, ecosystem chrome,
 * mirror/journal/story/garden/map chrome...) không phải tri thức
 * Companion cần tham chiếu (chrome văn bản UI, không phải nội dung tra
 * cứu) — không đưa vào Catalog.
 *
 * `visibility`/`goalCategories` — các bảng `live-*.ts` này KHÔNG có sẵn
 * metadata phân quyền Premium hay gắn nhóm mục tiêu, nên mapping trung
 * thực: `visibility: "public"` (mọi mục đã Published qua các hàm này đều
 * công khai, không có khái niệm Premium ở đây) và `goalCategories: []`
 * (mảng rỗng = không giới hạn nhóm mục tiêu nào, đúng ý nghĩa đã định
 * nghĩa ở `knowledge-catalog.ts`) — không tự suy đoán/gán category không
 * có căn cứ.
 */
import "server-only";
import { getLiveTools } from "@/lib/portal/live-tools";
import { getLiveBestPractices } from "@/lib/portal/live-best-practices";
import { getLiveResources } from "@/lib/portal/live-resources";
import { getLiveKnowledgeSeeds } from "@/lib/portal/live-knowledge";
import { getLiveProjects } from "@/lib/portal/live-projects";
import { createCatalogEntry, type KnowledgeCatalog } from "./knowledge-catalog";

/** Helper thuần — mapping, không I/O riêng (I/O đã xảy ra ở các hàm
    `getLive*()` truyền vào). Tách riêng để test được không cần mock I/O. */
export function mapPublishedContentToCatalog(input: {
  tools: Awaited<ReturnType<typeof getLiveTools>>;
  bestPractices: Awaited<ReturnType<typeof getLiveBestPractices>>;
  resources: Awaited<ReturnType<typeof getLiveResources>>;
  lessons: Awaited<ReturnType<typeof getLiveKnowledgeSeeds>>;
  projects: Awaited<ReturnType<typeof getLiveProjects>>;
}): KnowledgeCatalog {
  const toolEntries = input.tools.map((tool) =>
    createCatalogEntry({
      id: `tool-${tool.slug}`,
      title: tool.name,
      workspace: "ai-workspace",
      visibility: "public",
      published: true,
      knowledgeType: "tool",
      tags: tool.bestFor,
      url: `/portal/aiworkspace/${tool.slug}`,
    })
  );

  const bestPracticeEntries = input.bestPractices.map((item) =>
    createCatalogEntry({
      id: `best-practice-${item.id}`,
      title: item.title,
      workspace: "ckos",
      visibility: "public",
      published: true,
      knowledgeType: "best-practice",
      url: `/portal/ckos/best-practices/${item.id}`,
    })
  );

  const resourceEntries = input.resources.map((item) =>
    createCatalogEntry({
      id: `resource-${item.id}`,
      title: item.title,
      workspace: "ckos",
      visibility: "public",
      published: true,
      knowledgeType: "resource",
      url: `/portal/resources/${item.id}`,
    })
  );

  const lessonEntries = input.lessons.map((seed) =>
    createCatalogEntry({
      id: `lesson-${seed.slug}`,
      title: seed.title,
      workspace: "hoc-vien-ai",
      visibility: "public",
      published: true,
      knowledgeType: "lesson",
      tags: seed.skillsGained,
      url: `/portal/hetrithucai/${seed.slug}`,
    })
  );

  const projectEntries = input.projects
    .filter((project) => project.href.length > 0)
    .map((project) =>
      createCatalogEntry({
        id: `project-${project.id}`,
        title: project.name,
        workspace: "du-an-co-hoi",
        visibility: "public",
        published: true,
        knowledgeType: "project",
        url: project.href,
      })
    );

  return [...toolEntries, ...bestPracticeEntries, ...resourceEntries, ...lessonEntries, ...projectEntries];
}

/**
 * SPRINT R03 — Performance: Companion Chat gọi `getPublishedCatalog()`
 * ở MỖI lượt tin nhắn (route.ts). `getLive*()` dùng React `cache()` chỉ
 * dedupe TRONG 1 request — không giúp gì giữa các lượt chat khác nhau.
 * Nội dung Published (tools/best-practices/resources/lessons/projects)
 * không đổi liên tục — cache process-local ngắn hạn (TTL) tránh 5 round-
 * trip Supabase lặp lại cho mỗi tin nhắn trong cùng 1 cửa sổ ngắn, đúng
 * tinh thần "chỉ loại bỏ lãng phí rõ ràng, không tối ưu sớm". Cùng mức độ
 * bền vững "process-local, đủ cho dev/sandbox/1 instance" đã áp dụng cho
 * `runtime-execution-log.ts`/`provider-execution-log.ts` — không phải
 * cache phân tán, không đổi Runtime Architecture (chỉ nội bộ hàm này).
 */
const CATALOG_CACHE_TTL_MS = 30_000;
let cachedCatalog: KnowledgeCatalog | null = null;
let cachedAt = 0;

/**
 * Gọi 5 hàm `getLive*()` đã có sẵn (song song), rồi mapping thuần sang
 * `CatalogEntry[]`. Đây là hàm DUY NHẤT trong `src/ai/catalog/` có I/O
 * thật (qua các hàm `getLive*()` — tự dùng `getSupabasePublic()`, không
 * gọi trực tiếp ở đây).
 */
export async function getPublishedCatalog(): Promise<KnowledgeCatalog> {
  if (cachedCatalog && Date.now() - cachedAt < CATALOG_CACHE_TTL_MS) {
    return cachedCatalog;
  }

  const [tools, bestPractices, resources, lessons, projects] = await Promise.all([
    getLiveTools(),
    getLiveBestPractices(),
    getLiveResources(),
    getLiveKnowledgeSeeds(),
    getLiveProjects(),
  ]);

  cachedCatalog = mapPublishedContentToCatalog({ tools, bestPractices, resources, lessons, projects });
  cachedAt = Date.now();
  return cachedCatalog;
}

/** Chỉ dùng cho test — reset cache giữa các test case. */
export function __resetPublishedCatalogCacheForTest(): void {
  cachedCatalog = null;
  cachedAt = 0;
}

export const PublishedCatalogAdapter = { getCatalog: getPublishedCatalog };
