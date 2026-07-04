/**
 * PHASE 4 EPIC 02 — Workforce Registry (Wave 1, 10 AI Companion).
 *
 * Nguồn sự thật cho 10 AI Companion Wave 1 — Companion (COO)/UI CHỈ ĐỌC
 * Registry này, không hard-code Companion nào. Static catalog (giống
 * `mission-catalog.ts`) cho phần định nghĩa cố định (Mission/Capability/
 * Contract/...), cộng 1 overlay trong `localStorage` cho phần MUTABLE
 * (`workingStatus`/`performanceScore`) — giữ nguyên pattern đã dùng ở
 * `agent-run-store.ts` (static + runtime state tách biệt).
 *
 * Nội dung từng Companion kế thừa trực tiếp từ hồ sơ đã có
 * (`docs/AI_COMPANION_REGISTRY.md`, `docs/companions/research/market-research/PROFILE.md`)
 * — không phát minh nội dung mới, chỉ hiện thực hoá thành dữ liệu chạy được.
 */

import { emitGrowthEvent } from "./growth-event-bus";

export type DepartmentId =
  | "research-knowledge"
  | "content-communication"
  | "business-strategy"
  | "creative-design"
  | "technology-automation"
  | "office-productivity"
  | "personal-growth";

export type CompanionWorkingStatus =
  | "inactive"
  | "training"
  | "certified"
  | "active"
  | "busy"
  | "idle"
  | "maintenance"
  | "retired";

export type CompanionRecord = {
  employeeId: string;
  department: DepartmentId;
  position: string;
  mission: string;
  responsibilities: string[];
  capability: string[];
  supportedBlueprint: string[]; // missionId (mission-catalog.ts) — rỗng = hỗ trợ chéo, không gắn 1 Blueprint cụ thể
  supportedTasks: string[];
  inputContract: string[];
  outputContract: string[];
  qaChecklist: string[];
  evidenceStandard: string[]; // tham chiếu CAPABILITY_EVIDENCE_FRAMEWORK.md — tối thiểu Output+Workspace+1 loại khác
  portfolioMapping: { primaryCompetencyId: string };
  providerPreference: string; // providerId — Companion chỉ KHAI BÁO ưu tiên, KHÔNG tự chọn Provider (ProviderManager quyết định)
  fallbackProvider: string; // providerId — thử sau providerPreference, trước Mock
  workingStatus: CompanionWorkingStatus;
  trainingStatus: "not_started" | "in_progress" | "completed";
  certificationStatus: "not_certified" | "certified";
  performanceScore: number; // 0-100 — trung tính (50) cho tới khi có dữ liệu Task thật (Performance Monitoring, ngoài phạm vi EPIC 02)
};

const WAVE1_COMPANION_CATALOG: readonly CompanionRecord[] = [
  {
    employeeId: "EMP-R001",
    department: "research-knowledge",
    position: "Market Research Companion",
    mission: "Đảm bảo mọi quyết định của Owner liên quan thị trường/đối thủ dựa trên thông tin đúng, đủ, có nguồn — không đoán mò.",
    responsibilities: ["Nghiên cứu thị trường theo ngành/chủ đề", "So sánh đối thủ theo tiêu chí rõ ràng", "Tổng hợp xu hướng ngành liên quan Goal"],
    capability: ["research.market-analysis"],
    supportedBlueprint: ["nghien-cuu-thi-truong"],
    supportedTasks: ["Nghiên cứu thị trường", "So sánh đối thủ", "Tổng hợp xu hướng"],
    inputContract: ["goal", "industry", "competitors?", "rawSources?", "priorReport?"],
    outputContract: ["context", "competitorAnalysis", "opportunities", "risks", "actionableTakeaways", "citedSources"],
    qaChecklist: ["Đủ 4 phần cấu trúc (Bối cảnh/Đối thủ/Cơ hội/Rủi ro)", "Mọi nhận định có nguồn đều trích dẫn được", "Không có khuyến nghị chiến lược thay Owner"],
    evidenceStandard: ["Output", "Workspace", "Reflection", "Companion Review", "Growth Event"],
    portfolioMapping: { primaryCompetencyId: "Research" },
    providerPreference: "anthropic",
    fallbackProvider: "openai",
    workingStatus: "inactive",
    trainingStatus: "completed",
    certificationStatus: "certified",
    performanceScore: 50,
  },
  {
    employeeId: "EMP-R002",
    department: "research-knowledge",
    position: "Knowledge Research Companion",
    mission: "Biến tài liệu dài/kho tri thức thành bản tóm tắt dùng được ngay.",
    responsibilities: ["Tóm tắt tài liệu dài", "Tổng hợp nhiều Knowledge Asset thành 1 câu trả lời", "Gắn cờ mâu thuẫn giữa các nguồn"],
    capability: ["research.knowledge-synthesis"],
    supportedBlueprint: [],
    supportedTasks: ["Tóm tắt tài liệu", "Trả lời câu hỏi có trích dẫn Knowledge Asset"],
    inputContract: ["question", "relatedAssetIds"],
    outputContract: ["summary", "citedAssetIds", "conflictsFlagged"],
    qaChecklist: ["Không thêm thông tin ngoài tài liệu gốc", "Trích dẫn đúng Knowledge Asset nguồn", "Gắn cờ khi có mâu thuẫn giữa nguồn"],
    evidenceStandard: ["Output", "Workspace", "Companion Review"],
    portfolioMapping: { primaryCompetencyId: "Research" },
    providerPreference: "gemini",
    fallbackProvider: "anthropic",
    workingStatus: "inactive",
    trainingStatus: "completed",
    certificationStatus: "certified",
    performanceScore: 50,
  },
  {
    employeeId: "EMP-C001",
    department: "content-communication",
    position: "Writer Companion",
    mission: "Biến Goal/Blueprint thành bản nháp nội dung dùng được ngay.",
    responsibilities: ["Viết nội dung mới theo Goal/Blueprint/Task", "Giữ đúng giọng văn, cấu trúc theo outputFormat yêu cầu"],
    capability: ["writing.draft"],
    supportedBlueprint: ["viet-email-chuyen-nghiep", "viet-proposal-khach-hang", "viet-content-facebook", "viet-landing-page"],
    supportedTasks: ["Viết bài", "Viết email", "Viết proposal"],
    inputContract: ["goal", "blueprintName", "taskName", "context?", "userInput?", "outputFormat"],
    outputContract: ["draftOutput", "summary", "suggestedTitle", "notes"],
    qaChecklist: ["Bám đúng Goal, không lạc đề", "Gắn isMock rõ ràng khi chưa có API key thật"],
    evidenceStandard: ["Output", "Workspace", "Version", "Reflection", "Companion Review", "Growth Event"],
    portfolioMapping: { primaryCompetencyId: "AI Writing" },
    providerPreference: "anthropic",
    fallbackProvider: "openai",
    workingStatus: "inactive",
    trainingStatus: "completed",
    certificationStatus: "certified",
    performanceScore: 50,
  },
  {
    employeeId: "EMP-C002",
    department: "content-communication",
    position: "Editor Companion",
    mission: "Đảm bảo nội dung trước khi Owner dùng là sạch — đúng chính tả, mạch lạc, giữ nguyên ý gốc.",
    responsibilities: ["Biên tập/soát lỗi bản nháp có sẵn", "Đề xuất sửa mà không đổi ý chính"],
    capability: ["writing.edit"],
    supportedBlueprint: [],
    supportedTasks: ["Biên tập bài viết", "Soát lỗi chính tả/ngữ pháp"],
    inputContract: ["draftContent", "styleGuide?"],
    outputContract: ["editedContent", "editNotes"],
    qaChecklist: ["Không đổi ý nghĩa gốc của tác giả", "Thay đổi lớn về nội dung phải gắn cờ riêng cho Owner xác nhận"],
    evidenceStandard: ["Output", "Version", "Companion Review"],
    portfolioMapping: { primaryCompetencyId: "AI Writing" },
    providerPreference: "anthropic",
    fallbackProvider: "openai",
    workingStatus: "inactive",
    trainingStatus: "completed",
    certificationStatus: "certified",
    performanceScore: 50,
  },
  {
    employeeId: "EMP-B001",
    department: "business-strategy",
    position: "Strategy Companion",
    mission: "Biến Goal mơ hồ thành kế hoạch có mục tiêu đo được.",
    responsibilities: ["Xây chiến lược/kế hoạch (Marketing Plan/Business Plan)", "Phân tích SWOT có cấu trúc"],
    capability: ["strategy.planning"],
    supportedBlueprint: ["lap-ke-hoach-marketing"],
    supportedTasks: ["Lập kế hoạch Marketing", "Phân tích SWOT"],
    inputContract: ["goal", "researchReport?", "currentState?"],
    outputContract: ["strategicPlan", "swotNote", "measurableGoals"],
    qaChecklist: ["Mỗi mục tiêu phải đo được (số, hạn)", "Không chấp nhận mục tiêu mơ hồ"],
    evidenceStandard: ["Output", "Workspace", "Companion Review", "Growth Event"],
    portfolioMapping: { primaryCompetencyId: "Strategy" },
    providerPreference: "anthropic",
    fallbackProvider: "openai",
    workingStatus: "inactive",
    trainingStatus: "completed",
    certificationStatus: "certified",
    performanceScore: 50,
  },
  {
    employeeId: "EMP-T001",
    department: "technology-automation",
    position: "Coding Companion",
    mission: "Biến mô tả tác vụ kỹ thuật thành đoạn code/script dùng được.",
    responsibilities: ["Viết/sửa code cho tác vụ cụ thể theo mô tả Owner", "Giải thích cách chạy"],
    capability: ["coding.general"],
    supportedBlueprint: ["xay-sop"],
    supportedTasks: ["Viết script", "Sửa lỗi code theo mô tả"],
    inputContract: ["taskDescription", "language?"],
    outputContract: ["script", "usageNote", "riskWarnings"],
    qaChecklist: ["Cảnh báo rủi ro rõ ràng nếu có thao tác không thể hoàn tác", "Không tự chạy script trên hệ thống thật của Owner"],
    evidenceStandard: ["Output", "Companion Review", "Growth Event"],
    portfolioMapping: { primaryCompetencyId: "Automation" },
    providerPreference: "openai",
    fallbackProvider: "anthropic",
    workingStatus: "inactive",
    trainingStatus: "completed",
    certificationStatus: "certified",
    performanceScore: 50,
  },
  {
    employeeId: "EMP-T002",
    department: "technology-automation",
    position: "QA Companion",
    mission: "Bắt lỗi trước khi Owner dùng thật, không để rủi ro lọt qua.",
    responsibilities: ["Kiểm thử chất lượng Script/Automation/Output kỹ thuật", "Liệt kê rủi ro/edge case chưa xử lý"],
    capability: ["qa.review"],
    supportedBlueprint: [],
    supportedTasks: ["Kiểm thử script", "Rà soát rủi ro Automation Workflow"],
    inputContract: ["scriptOrWorkflow", "purpose"],
    outputContract: ["qaReport", "risksFound", "suggestedFixes"],
    qaChecklist: ["Mỗi lỗi nêu ra có ví dụ cụ thể tái hiện được", "Không tự sửa code — chỉ báo lỗi"],
    evidenceStandard: ["Output", "Companion Review"],
    portfolioMapping: { primaryCompetencyId: "Automation" },
    providerPreference: "openai",
    fallbackProvider: "anthropic",
    workingStatus: "inactive",
    trainingStatus: "completed",
    certificationStatus: "certified",
    performanceScore: 50,
  },
  {
    employeeId: "EMP-O001",
    department: "office-productivity",
    position: "Excel Companion",
    mission: "Xử lý số liệu nhanh và chính xác thay Owner.",
    responsibilities: ["Xử lý/phân tích bảng tính", "Viết công thức đúng theo yêu cầu tính toán"],
    capability: ["office.spreadsheet"],
    supportedBlueprint: ["lam-dashboard-excel"],
    supportedTasks: ["Xử lý bảng tính", "Viết công thức Excel", "Tổng hợp Dashboard số liệu"],
    inputContract: ["rawData", "calculationGoal"],
    outputContract: ["spreadsheetSpec", "formulaExplanation"],
    qaChecklist: ["Mọi công thức phải giải thích được", "Không tự diễn giải ý nghĩa kinh doanh của số liệu"],
    evidenceStandard: ["Output", "Companion Review", "Growth Event"],
    portfolioMapping: { primaryCompetencyId: "Data Analysis" },
    providerPreference: "openai",
    fallbackProvider: "anthropic",
    workingStatus: "inactive",
    trainingStatus: "completed",
    certificationStatus: "certified",
    performanceScore: 50,
  },
  {
    employeeId: "EMP-G001",
    department: "personal-growth",
    position: "Goal Coach Companion",
    mission: "Giúp Owner đặt mục tiêu rõ ràng thay vì mơ hồ.",
    responsibilities: ["Đồng hành đặt mục tiêu SMART cùng Owner khi bắt đầu Journey/Mission mới"],
    capability: ["growth.goal-coaching"],
    supportedBlueprint: [],
    supportedTasks: ["Làm rõ mục tiêu SMART"],
    inputContract: ["rawGoal"],
    outputContract: ["smartGoal", "clarifyingQuestions"],
    qaChecklist: ["Không tự áp mục tiêu thay Owner — chỉ đặt câu hỏi dẫn dắt"],
    evidenceStandard: ["Output", "Reflection"],
    portfolioMapping: { primaryCompetencyId: "Personal Growth" },
    providerPreference: "anthropic",
    fallbackProvider: "openai",
    workingStatus: "inactive",
    trainingStatus: "completed",
    certificationStatus: "certified",
    performanceScore: 50,
  },
  {
    employeeId: "EMP-G002",
    department: "personal-growth",
    position: "Reflection Coach Companion",
    mission: "Giúp Owner nhận ra mình đã học được gì sau mỗi Mission, không chỉ hoàn thành cho xong.",
    responsibilities: ["Dẫn dắt câu hỏi Reflection sau khi Output được Approve"],
    capability: ["growth.reflection-coaching"],
    supportedBlueprint: [],
    supportedTasks: ["Đặt câu hỏi Reflection theo Output/Goal cụ thể"],
    inputContract: ["approvedOutputSummary", "originalGoal"],
    outputContract: ["reflectionPrompt"],
    qaChecklist: ["Câu hỏi gắn cụ thể với Output/Goal của Mission đó, không chung chung"],
    evidenceStandard: ["Output", "Reflection", "Growth Event"],
    portfolioMapping: { primaryCompetencyId: "Personal Growth" },
    providerPreference: "anthropic",
    fallbackProvider: "openai",
    workingStatus: "inactive",
    trainingStatus: "completed",
    certificationStatus: "certified",
    performanceScore: 50,
  },
] as const;

const STATUS_OVERLAY_KEY = "vdai_workforce_companion_status";

type StatusOverlay = Record<string, { workingStatus: CompanionWorkingStatus; performanceScore: number }>;

function readOverlay(): StatusOverlay {
  try {
    const raw = window.localStorage.getItem(STATUS_OVERLAY_KEY);
    return raw ? (JSON.parse(raw) as StatusOverlay) : {};
  } catch {
    return {};
  }
}

function writeOverlay(overlay: StatusOverlay): void {
  try {
    window.localStorage.setItem(STATUS_OVERLAY_KEY, JSON.stringify(overlay));
  } catch {
    // localStorage đầy/không khả dụng — trạng thái Companion chỉ mất khả năng lưu lâu dài, không vỡ Runtime.
  }
}

/** Vòng đời hợp lệ (Companion Lifecycle) — chuyển trạng thái sai thứ tự sẽ bị từ chối. */
const ALLOWED_TRANSITIONS: Record<CompanionWorkingStatus, CompanionWorkingStatus[]> = {
  inactive: ["training"],
  training: ["certified"],
  certified: ["active"],
  active: ["busy", "idle", "maintenance", "retired"],
  busy: ["idle", "active"],
  idle: ["busy", "active", "maintenance"],
  maintenance: ["active", "retired"],
  retired: [],
};

export function listCompanions(): CompanionRecord[] {
  const overlay = readOverlay();
  return WAVE1_COMPANION_CATALOG.map((c) => ({ ...c, ...(overlay[c.employeeId] ?? {}) }));
}

export function getCompanion(employeeId: string): CompanionRecord | undefined {
  return listCompanions().find((c) => c.employeeId === employeeId);
}

export function listByDepartment(department: DepartmentId): CompanionRecord[] {
  return listCompanions().filter((c) => c.department === department);
}

export function setWorkingStatus(employeeId: string, next: CompanionWorkingStatus): CompanionRecord {
  const current = getCompanion(employeeId);
  if (!current) throw new Error(`Không tìm thấy Companion "${employeeId}" trong Workforce Registry.`);
  if (!ALLOWED_TRANSITIONS[current.workingStatus].includes(next)) {
    throw new Error(`Companion "${current.position}" không thể chuyển từ "${current.workingStatus}" sang "${next}".`);
  }
  const overlay = readOverlay();
  overlay[employeeId] = { workingStatus: next, performanceScore: overlay[employeeId]?.performanceScore ?? current.performanceScore };
  writeOverlay(overlay);
  return { ...current, workingStatus: next };
}

/**
 * Activate toàn bộ Wave 1 vào Production Runtime — đi đúng chuỗi
 * `inactive → training → certified → active` cho từng Companion đang
 * `inactive`, phát 1 `COMPANION_ACTIVATED` khi tới `active` (không phát
 * 1 event/bước trung gian — Sprint Activation này gộp 3 bước thành 1
 * hành động vận hành, không phải quy trình đào tạo nhiều ngày thật của
 * `docs/AI_TRAINING_ENGINE.md`).
 */
export function activateWave1Companions(): CompanionRecord[] {
  const activated: CompanionRecord[] = [];
  for (const companion of listCompanions()) {
    if (companion.workingStatus !== "inactive") continue;
    setWorkingStatus(companion.employeeId, "training");
    setWorkingStatus(companion.employeeId, "certified");
    const active = setWorkingStatus(companion.employeeId, "active");
    emitGrowthEvent({ eventType: "COMPANION_ACTIVATED" });
    activated.push(active);
  }
  return activated;
}
