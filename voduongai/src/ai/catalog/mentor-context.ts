/**
 * SPRINT R02 — CKOS & Platform Data Integration: Knowledge Package (Phần 5).
 * SPRINT FIX-R02 — đổi tên `KnowledgePackage` → `MentorContext` (Phần 3):
 * "Không đổi dữ liệu. Chỉ đổi abstraction." — 7 field gốc giữ nguyên
 * 100%, thêm đúng 2 field mới `confidence`/`sourceCount` lấy trực tiếp từ
 * `KnowledgeResolution` (không tính lại/không suy luận thêm).
 *
 * `MentorContext` — hình dạng CUỐI CÙNG `CompanionPromptBuilder` đọc
 * (Phần 6), dựng từ `KnowledgeResolution` (Phần 2/`knowledge-resolver.ts`).
 * Đúng field brief R02 liệt kê: `references`, `suggestedLearning`,
 * `suggestedTools`, `suggestedPrompts`, `suggestedWorkflow`,
 * `suggestedProjects`, `warnings` — cộng thêm `confidence`/`sourceCount`
 * (FIX-R02, Phần 3).
 *
 * CHỈ metadata nhẹ (`id`/`title`/`url`/`workspace`) — KHÔNG bao giờ đưa
 * raw article, KHÔNG markdown, đúng yêu cầu "Không đưa raw article. Không
 * đưa markdown. Chỉ metadata."
 */

import type { CatalogEntry, CatalogWorkspace } from "./knowledge-catalog";
import type { KnowledgeResolution } from "./knowledge-resolver";

export type KnowledgeReference = {
  id: string;
  title: string;
  url: string;
  workspace: CatalogWorkspace;
};

export type MentorContext = {
  /** Tham chiếu chung — mọi `knowledgeType` không rơi vào 1 trong 5 nhóm
      gợi ý cụ thể bên dưới (resource/best-practice/case-study/faq/
      community-support/reflection/progress/general-guidance). */
  references: KnowledgeReference[];
  /** `course`/`lesson`/`premium-content`. */
  suggestedLearning: KnowledgeReference[];
  /** `tool`. */
  suggestedTools: KnowledgeReference[];
  /** `prompt`. */
  suggestedPrompts: KnowledgeReference[];
  /** `workflow`. */
  suggestedWorkflow: KnowledgeReference[];
  /** `project`. */
  suggestedProjects: KnowledgeReference[];
  /** Cảnh báo minh bạch — nhu cầu chưa giải quyết được (từ
      `unresolvedNeed`) + số mục Premium bị ẩn vì thiếu quyền. KHÔNG lộ nội
      dung/tiêu đề mục bị ẩn — chỉ nói SỐ LƯỢNG. */
  warnings: string[];
  /** FIX-R02 — kế thừa trực tiếp `knowledgeNeed.confidence` (A05, 0-1;
      `0` khi chưa có `knowledgeNeed`, ví dụ chưa xác định Goal). Không
      tính lại — chỉ truyền qua. */
  confidence: number;
  /** FIX-R02 — số nguồn (`KnowledgeSource`) đã khớp, = `matchedSources.length`. */
  sourceCount: number;
};

function toReference(entry: CatalogEntry): KnowledgeReference {
  return { id: entry.id, title: entry.title, url: entry.url, workspace: entry.workspace };
}

function emptyMentorContext(): MentorContext {
  return {
    references: [],
    suggestedLearning: [],
    suggestedTools: [],
    suggestedPrompts: [],
    suggestedWorkflow: [],
    suggestedProjects: [],
    warnings: [],
    confidence: 0,
    sourceCount: 0,
  };
}

/**
 * Helper thuần — phân loại `matchedItems` vào đúng nhóm gợi ý theo
 * `knowledgeType`, gộp cảnh báo từ `unresolvedNeed` +
 * `excludedByPermissionCount`, gán `confidence`/`sourceCount` trực tiếp
 * từ `resolution`. Không mutate `resolution` truyền vào, deterministic,
 * giữ nguyên thứ tự Content Selection (Phần 4) đã sắp sẵn trong
 * `matchedItems` — không sắp xếp lại.
 */
export function buildMentorContext(resolution: KnowledgeResolution): MentorContext {
  const context = emptyMentorContext();

  for (const entry of resolution.matchedItems) {
    const reference = toReference(entry);
    switch (entry.knowledgeType) {
      case "course":
      case "lesson":
      case "premium-content":
        context.suggestedLearning.push(reference);
        break;
      case "tool":
        context.suggestedTools.push(reference);
        break;
      case "prompt":
        context.suggestedPrompts.push(reference);
        break;
      case "workflow":
        context.suggestedWorkflow.push(reference);
        break;
      case "project":
        context.suggestedProjects.push(reference);
        break;
      default:
        context.references.push(reference);
    }
  }

  const warnings = [...resolution.unresolvedNeed];
  if (resolution.excludedByPermissionCount > 0) {
    warnings.push(
      `Có ${resolution.excludedByPermissionCount} nội dung Premium liên quan nhưng bạn chưa có quyền truy cập.`
    );
  }
  context.warnings = warnings;
  context.confidence = resolution.confidence;
  context.sourceCount = resolution.matchedSources.length;

  return context;
}
