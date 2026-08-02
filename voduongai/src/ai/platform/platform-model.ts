/**
 * SPRINT A05 — Platform Intelligence Foundation: Platform Model.
 *
 * `src/ai/platform/` là namespace MỚI, độc lập hoàn toàn khỏi Runtime chat
 * thật, Provider Layer, Prompt, Chat, UI, Database, Memory, CKOS, Premium,
 * Goal Runtime — chưa có bất kỳ import/export nào nối 2 bên. File này CHỈ
 * định nghĩa SHAPE dữ liệu cho `PlatformNode` — đây là MÔ HÌNH NHẬN THỨC
 * (Companion "biết" hệ sinh thái có những gì), KHÔNG phải dữ liệu thật đọc
 * từ Portal/Database.
 */

export type PlatformNodeType = "root" | "module";

/**
 * 1 node trong Knowledge Tree của hệ sinh thái VO DUONG AI — chỉ SHAPE dữ
 * liệu, không business logic, không I/O.
 */
export type PlatformNode = {
  id: string;
  name: string;
  type: PlatformNodeType;
  description: string;
  /** `null` cho node gốc (không có cha). */
  parentId: string | null;
  childrenIds: string[];
  tags: string[];
  /** SPRINT A05 — nhóm mục tiêu (giá trị nên khớp `GoalCategory` ở
      `src/ai/mentor/goal.ts`) mà khu vực này phục vụ — giữ kiểu
      `string[]` thuần (không import `GoalCategory`) để `platform/` không
      phụ thuộc namespace khác; việc đối chiếu/khớp giá trị là việc của
      tầng gọi (`src/ai/knowledge/`). Mảng rỗng = khu vực không gắn với
      1 nhóm mục tiêu cụ thể nào (vd. Companion, Cộng đồng). */
  supportedGoalCategories: string[];
  /** SPRINT A05 — loại tri thức (giá trị nên khớp `KnowledgeType` ở
      `src/ai/knowledge/knowledge-types.ts`) khu vực này có thể phục vụ —
      cùng lý do giữ `string[]` thuần như trên. */
  supportedKnowledgeTypes: string[];
};

/** Type guard thuần — chỉ kiểm tra shape. */
export function isPlatformNodeType(value: string): value is PlatformNodeType {
  return value === "root" || value === "module";
}

/**
 * Helper thuần dựng 1 `PlatformNode` — không side-effect, không lưu trữ.
 * `childrenIds`/`tags` mặc định mảng rỗng nếu không truyền.
 */
export function createPlatformNode(input: {
  id: string;
  name: string;
  type: PlatformNodeType;
  description: string;
  parentId?: string | null;
  childrenIds?: string[];
  tags?: string[];
  supportedGoalCategories?: string[];
  supportedKnowledgeTypes?: string[];
}): PlatformNode {
  return {
    id: input.id,
    name: input.name,
    type: input.type,
    description: input.description,
    parentId: input.parentId ?? null,
    childrenIds: input.childrenIds ?? [],
    tags: input.tags ?? [],
    supportedGoalCategories: input.supportedGoalCategories ?? [],
    supportedKnowledgeTypes: input.supportedKnowledgeTypes ?? [],
  };
}
