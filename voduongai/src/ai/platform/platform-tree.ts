/**
 * SPRINT A05 — Platform Intelligence Foundation: Platform Tree.
 *
 * Knowledge Tree CỐ ĐỊNH của hệ sinh thái VO DUONG AI — đây là mô hình
 * nhận thức Companion dùng để "biết" nền tảng có những gì, KHÔNG đọc từ
 * Portal/Database/CKOS. Toàn bộ dữ liệu ở đây là hằng số viết tay, không
 * side-effect, không I/O.
 */

import { createPlatformNode, type PlatformNode } from "./platform-model";

export const ROOT_PLATFORM_NODE_ID = "vo-duong-ai";

/**
 * 10 khu vực cấp 1 — ĐÚNG danh sách đã chốt, ĐÚNG thứ tự. `tags` dùng để
 * tính `relatedAreas` (Platform Context) — chỉ là từ khoá mô tả BẢN CHẤT
 * khu vực (mô hình nhận thức), không phải dữ liệu thật.
 */
const PLATFORM_NODES: readonly PlatformNode[] = [
  createPlatformNode({
    id: ROOT_PLATFORM_NODE_ID,
    name: "VO DUONG AI",
    type: "root",
    description: "Toàn bộ hệ sinh thái VO DUONG AI — điểm gốc của Knowledge Tree.",
    parentId: null,
    childrenIds: [
      "companion",
      "hoc-vien-ai",
      "ckos",
      "premium",
      "ai-workspace",
      "du-an-co-hoi",
      "cong-dong",
      "nhat-ky-hoc-tap",
      "hanh-trinh-cua-toi",
      "khu-vuon-cua-ban",
    ],
    tags: [],
  }),
  createPlatformNode({
    id: "companion",
    name: "Companion",
    type: "module",
    description: "Người bạn đồng hành AI — trò chuyện, hiểu mục tiêu, dẫn dắt người dùng qua nền tảng.",
    parentId: ROOT_PLATFORM_NODE_ID,
    tags: ["ai", "tro-ly", "dong-hanh"],
    supportedGoalCategories: [],
    supportedKnowledgeTypes: ["general-guidance"],
  }),
  createPlatformNode({
    id: "hoc-vien-ai",
    name: "Học viện AI",
    type: "module",
    description: "Khu vực học tập có lộ trình — nơi người dùng học kiến thức/kỹ năng AI theo bài bản.",
    parentId: ROOT_PLATFORM_NODE_ID,
    tags: ["hoc-tap", "khoa-hoc", "kien-thuc"],
    supportedGoalCategories: ["hoc-ai", "hoc-prompt", "hoc-cong-cu-ai"],
    supportedKnowledgeTypes: ["course", "lesson", "best-practice", "premium-content", "faq"],
  }),
  createPlatformNode({
    id: "ckos",
    name: "Hệ tri thức AI / CKOS",
    type: "module",
    description: "Hệ tri thức AI — kho tài liệu/công cụ/quy trình tham chiếu tra cứu.",
    parentId: ROOT_PLATFORM_NODE_ID,
    tags: ["kien-thuc", "tai-lieu", "cong-cu"],
    supportedGoalCategories: [
      "hoc-ai",
      "hoc-prompt",
      "hoc-cong-cu-ai",
      "xay-thuong-hieu-ca-nhan",
      "affiliate-marketing",
      "tao-noi-dung",
      "xay-dung-he-thong",
    ],
    supportedKnowledgeTypes: ["tool", "prompt", "workflow", "resource", "lesson", "best-practice", "case-study"],
  }),
  createPlatformNode({
    id: "premium",
    name: "Premium",
    type: "module",
    description: "Chương trình học nâng cao, trả phí — mở rộng sâu hơn Học viện AI miễn phí.",
    parentId: ROOT_PLATFORM_NODE_ID,
    tags: ["khoa-hoc", "nang-cao", "tra-phi"],
    supportedGoalCategories: ["premium"],
    supportedKnowledgeTypes: ["premium-content", "course"],
  }),
  createPlatformNode({
    id: "ai-workspace",
    name: "AI Workspace",
    type: "module",
    description: "Không gian thực hành — dùng công cụ AI trực tiếp vào công việc thật.",
    parentId: ROOT_PLATFORM_NODE_ID,
    tags: ["cong-cu", "thuc-hanh", "ai"],
    supportedGoalCategories: ["hoc-cong-cu-ai", "xay-dung-he-thong", "tao-noi-dung"],
    supportedKnowledgeTypes: ["tool", "workflow", "best-practice"],
  }),
  createPlatformNode({
    id: "du-an-co-hoi",
    name: "Dự án & Cơ hội",
    type: "module",
    description: "Các hệ sinh thái/cơ hội kinh doanh, hợp tác bên ngoài Học viện.",
    parentId: ROOT_PLATFORM_NODE_ID,
    tags: ["kinh-doanh", "co-hoi", "du-an"],
    supportedGoalCategories: ["du-an-co-hoi", "affiliate-marketing"],
    supportedKnowledgeTypes: ["project", "case-study", "resource"],
  }),
  createPlatformNode({
    id: "cong-dong",
    name: "Cộng đồng",
    type: "module",
    description: "Nơi kết nối với người học khác, chia sẻ kinh nghiệm.",
    parentId: ROOT_PLATFORM_NODE_ID,
    tags: ["ket-noi", "chia-se", "dong-hanh"],
    supportedGoalCategories: ["xay-thuong-hieu-ca-nhan", "affiliate-marketing"],
    supportedKnowledgeTypes: ["community-support", "best-practice", "resource"],
  }),
  createPlatformNode({
    id: "nhat-ky-hoc-tap",
    name: "Nhật ký học tập",
    type: "module",
    description: "Ghi lại quá trình học tập — từng bước tiến bộ theo thời gian.",
    parentId: ROOT_PLATFORM_NODE_ID,
    tags: ["hoc-tap", "phan-anh", "ghi-chep"],
    supportedGoalCategories: [],
    supportedKnowledgeTypes: ["reflection", "progress"],
  }),
  createPlatformNode({
    id: "hanh-trinh-cua-toi",
    name: "Hành trình của tôi",
    type: "module",
    description: "Không gian phản ánh cá nhân — nhìn lại chặng đường đã đi qua nền tảng.",
    parentId: ROOT_PLATFORM_NODE_ID,
    tags: ["phan-anh", "tien-do", "ca-nhan"],
    supportedGoalCategories: [],
    supportedKnowledgeTypes: ["reflection", "progress"],
  }),
  createPlatformNode({
    id: "khu-vuon-cua-ban",
    name: "Khu vườn của bạn",
    type: "module",
    description: "Biểu tượng hoá thành quả học tập — thành tựu cá nhân lớn dần theo thời gian.",
    parentId: ROOT_PLATFORM_NODE_ID,
    tags: ["tien-do", "thanh-qua", "ca-nhan"],
    supportedGoalCategories: [],
    supportedKnowledgeTypes: ["progress"],
  }),
];

/** Tra cứu nhanh theo id — dựng 1 lần từ `PLATFORM_NODES`, không mutate. */
const PLATFORM_NODE_BY_ID: ReadonlyMap<string, PlatformNode> = new Map(PLATFORM_NODES.map((node) => [node.id, node]));

/** Lấy 1 node theo id — `null` nếu không tồn tại trong tree. */
export function getPlatformNode(id: string): PlatformNode | null {
  return PLATFORM_NODE_BY_ID.get(id) ?? null;
}

/** Toàn bộ node trong tree — mảng MỚI mỗi lần gọi (không rò rỉ tham chiếu
    nội bộ cho phép caller mutate). */
export function listAllPlatformNodes(): PlatformNode[] {
  return [...PLATFORM_NODES];
}

/** Danh sách con trực tiếp của 1 node — mảng rỗng nếu không có con hoặc id
    không tồn tại. */
export function getPlatformChildren(id: string): PlatformNode[] {
  const node = getPlatformNode(id);
  if (!node) return [];
  return node.childrenIds.map((childId) => getPlatformNode(childId)).filter((child): child is PlatformNode => child !== null);
}

/** Node cha trực tiếp — `null` nếu là root hoặc id không tồn tại. */
export function getPlatformParent(id: string): PlatformNode | null {
  const node = getPlatformNode(id);
  if (!node || node.parentId === null) return null;
  return getPlatformNode(node.parentId);
}

/** Các node "anh em" (cùng `parentId`), không bao gồm chính node đó —
    mảng rỗng nếu id không tồn tại hoặc là root. */
export function getPlatformSiblings(id: string): PlatformNode[] {
  const node = getPlatformNode(id);
  if (!node || node.parentId === null) return [];
  return getPlatformChildren(node.parentId).filter((sibling) => sibling.id !== id);
}

/**
 * Kiểm tra tính toàn vẹn của tree — dùng cho test/sanity check, không
 * phải logic vận hành. Xác nhận: (1) mọi `parentId` (khác root) trỏ tới 1
 * node có thật; (2) mọi `childrenIds` của 1 node đều trỏ ngược lại đúng
 * `parentId`; (3) không id nào trùng lặp.
 */
export function isPlatformTreeIntegrityValid(): boolean {
  const ids = PLATFORM_NODES.map((node) => node.id);
  if (new Set(ids).size !== ids.length) return false;

  for (const node of PLATFORM_NODES) {
    if (node.parentId !== null && !PLATFORM_NODE_BY_ID.has(node.parentId)) return false;
    for (const childId of node.childrenIds) {
      const child = PLATFORM_NODE_BY_ID.get(childId);
      if (!child || child.parentId !== node.id) return false;
    }
  }
  return true;
}
