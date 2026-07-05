/**
 * Workforce Registry — Wave 1 + Wave 2 + Wave 3 = 30/30 AI Companion
 * (Sprint 002 "Complete Core AI Companion Team" hoàn tất danh sách đã
 * khóa ở `AI_COMPANION_REGISTRY.md`, đủ 7/7 Department).
 *
 * Nguồn sự thật cho toàn bộ 30 AI Companion — Companion (COO)/UI CHỈ
 * ĐỌC Registry này, không hard-code Companion nào. Static catalog (giống
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
import type { OutputType } from "./workspace-session-store";

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
  /** Output Contract (chuẩn bị cho Sprint Workspace Integration sau này)
      — loại `OutputType` gần đúng nhất với Output thật Companion tạo ra,
      để `CompanionTaskResult` map thẳng vào `saveOutputVersion()` mà
      không cần đoán lại. Không thêm giá trị `OutputType` mới (Kernel đã
      khóa, `workspace-session-store.ts` không đổi) — một số Companion
      (vd Presentation/PowerPoint) chưa có loại khớp hoàn hảo, dùng
      `"markdown"` làm xấp xỉ gần nhất, ghi rõ trong tài liệu vận hành. */
  outputType: OutputType;
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
    outputType: "markdown",
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
    outputType: "markdown",
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
    outputType: "markdown",
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
    outputType: "markdown",
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
    outputType: "markdown",
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
    outputType: "code",
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
    outputType: "markdown",
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
    outputType: "excel",
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
    outputType: "markdown",
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
    outputType: "markdown",
    providerPreference: "anthropic",
    fallbackProvider: "openai",
    workingStatus: "inactive",
    trainingStatus: "completed",
    certificationStatus: "certified",
    performanceScore: 50,
  },
] as const;

/**
 * Wave 2 (PHASE 4 EPIC 02, tiếp nối Wave 1) — 10 Companion tiếp theo,
 * chạm đủ 7 Department (Creative & Design lần đầu có Companion chạy
 * thật). Nội dung kế thừa trực tiếp từ `AI_COMPANION_REGISTRY.md`
 * §2.3/2.5/3.3/3.5/4.2/4.3/5.1/6.3/7.4/8.3 — không phát minh mới.
 */
const WAVE2_COMPANION_CATALOG: readonly CompanionRecord[] = [
  {
    employeeId: "EMP-R003",
    department: "research-knowledge",
    position: "Fact Checker Companion",
    mission: "Đảm bảo thông tin Owner sắp dùng là đúng, tránh rủi ro sai lệch.",
    responsibilities: ["Kiểm chứng độ tin cậy của một nhận định/số liệu/tuyên bố cụ thể"],
    capability: ["research.fact-checking"],
    supportedBlueprint: [],
    supportedTasks: ["Kiểm chứng tuyên bố/số liệu", "Gắn mức độ tin cậy"],
    inputContract: ["claim", "referenceSources?"],
    outputContract: ["conclusion", "confidenceLevel", "reason"],
    qaChecklist: ["Không trả lời đúng/sai tuyệt đối khi thiếu nguồn — luôn dùng thang tin cậy"],
    evidenceStandard: ["Output", "Companion Review"],
    portfolioMapping: { primaryCompetencyId: "Research" },
    outputType: "markdown",
    providerPreference: "anthropic",
    fallbackProvider: "openai",
    workingStatus: "inactive",
    trainingStatus: "completed",
    certificationStatus: "certified",
    performanceScore: 50,
  },
  {
    employeeId: "EMP-R004",
    department: "research-knowledge",
    position: "Trend Scout Companion",
    mission: "Giữ cho Owner không bị tụt lại — phát hiện sớm xu hướng/thay đổi liên quan tới ngành của Owner.",
    responsibilities: ["Theo dõi và tổng hợp định kỳ tín hiệu xu hướng mới từ dữ liệu Owner/Portal"],
    capability: ["research.trend-scouting"],
    supportedBlueprint: ["nghien-cuu-thi-truong", "lap-ke-hoach-marketing"],
    supportedTasks: ["Tổng hợp xu hướng định kỳ"],
    inputContract: ["periodicDataset"],
    outputContract: ["trendBrief"],
    qaChecklist: ["Mỗi xu hướng phải giải thích được vì sao liên quan tới Owner cụ thể"],
    evidenceStandard: ["Output", "Companion Review"],
    portfolioMapping: { primaryCompetencyId: "Research" },
    outputType: "markdown",
    providerPreference: "gemini",
    fallbackProvider: "anthropic",
    workingStatus: "inactive",
    trainingStatus: "completed",
    certificationStatus: "certified",
    performanceScore: 50,
  },
  {
    employeeId: "EMP-C003",
    department: "content-communication",
    position: "Copywriter Companion",
    mission: "Viết nội dung có mục đích thuyết phục — khiến người đọc hành động.",
    responsibilities: ["Viết nội dung bán hàng/quảng cáo (Landing Page, ads, CTA)"],
    capability: ["writing.copywriting"],
    supportedBlueprint: ["viet-landing-page", "viet-content-facebook"],
    supportedTasks: ["Viết Landing Page copy", "Viết Ad copy/CTA"],
    inputContract: ["persona?", "salesGoal", "productInfo"],
    outputContract: ["headline", "body", "cta"],
    qaChecklist: ["Mọi tuyên bố về sản phẩm phải khớp thông tin Owner cung cấp — không phóng đại"],
    evidenceStandard: ["Output", "Version", "Companion Review"],
    portfolioMapping: { primaryCompetencyId: "AI Writing" },
    outputType: "landing_page",
    providerPreference: "anthropic",
    fallbackProvider: "openai",
    workingStatus: "inactive",
    trainingStatus: "completed",
    certificationStatus: "certified",
    performanceScore: 50,
  },
  {
    employeeId: "EMP-C004",
    department: "content-communication",
    position: "SEO Companion",
    mission: "Giúp nội dung Owner viết ra có cơ hội được tìm thấy, không chỉ hay mà còn tới đúng người cần.",
    responsibilities: ["Tối ưu nội dung đã có cho tìm kiếm (từ khoá, heading, internal link)"],
    capability: ["writing.seo"],
    supportedBlueprint: ["viet-content-facebook", "viet-landing-page"],
    supportedTasks: ["Tối ưu SEO bài viết", "Đề xuất internal link"],
    inputContract: ["draftContent", "targetKeyword?"],
    outputContract: ["seoNote", "internalLinkSuggestions"],
    qaChecklist: ["Không nhồi nhét từ khoá", "Internal link đề xuất phải thật sự liên quan nội dung"],
    evidenceStandard: ["Output", "Companion Review"],
    portfolioMapping: { primaryCompetencyId: "AI Writing" },
    outputType: "markdown",
    providerPreference: "anthropic",
    fallbackProvider: "openai",
    workingStatus: "inactive",
    trainingStatus: "completed",
    certificationStatus: "certified",
    performanceScore: 50,
  },
  {
    employeeId: "EMP-B002",
    department: "business-strategy",
    position: "Sales Companion",
    mission: "Giúp Owner chốt được nhiều cơ hội bán hàng hơn, đúng cách.",
    responsibilities: ["Viết kịch bản bán hàng, gợi ý cách chăm sóc/chốt sale theo tình huống cụ thể"],
    capability: ["business.sales"],
    supportedBlueprint: ["viet-proposal-khach-hang"],
    supportedTasks: ["Viết kịch bản bán hàng", "Xử lý phản đối khách hàng"],
    inputContract: ["persona?", "productInfo", "salesSituation"],
    outputContract: ["salesScript", "objectionHandling"],
    qaChecklist: ["Kịch bản không được gây áp lực/thao túng khách hàng"],
    evidenceStandard: ["Output", "Companion Review"],
    portfolioMapping: { primaryCompetencyId: "Strategy" },
    outputType: "markdown",
    providerPreference: "anthropic",
    fallbackProvider: "openai",
    workingStatus: "inactive",
    trainingStatus: "completed",
    certificationStatus: "certified",
    performanceScore: 50,
  },
  {
    employeeId: "EMP-B003",
    department: "business-strategy",
    position: "Finance Companion",
    mission: "Giúp Owner nhìn rõ con số trước khi quyết định, không mơ hồ về tài chính.",
    responsibilities: ["Dự toán chi phí, theo dõi ngân sách cơ bản, phân tích tài chính đơn giản"],
    capability: ["business.finance"],
    supportedBlueprint: ["lam-dashboard-excel", "lap-ke-hoach-marketing"],
    supportedTasks: ["Lập bảng dự toán", "Tính ROI/break-even cơ bản"],
    inputContract: ["costItems", "revenueItems?", "financialGoal"],
    outputContract: ["budgetEstimate", "riskNotes"],
    qaChecklist: ["Mọi con số phải có công thức/căn cứ rõ ràng đi kèm"],
    evidenceStandard: ["Output", "Companion Review"],
    portfolioMapping: { primaryCompetencyId: "Strategy" },
    outputType: "excel",
    providerPreference: "anthropic",
    fallbackProvider: "openai",
    workingStatus: "inactive",
    trainingStatus: "completed",
    certificationStatus: "certified",
    performanceScore: 50,
  },
  {
    employeeId: "EMP-D001",
    department: "creative-design",
    position: "Designer Companion",
    mission: "Biến nội dung thành hình ảnh thu hút, đúng thương hiệu.",
    responsibilities: ["Thiết kế hình ảnh (Banner, Brand Kit cơ bản)"],
    capability: ["design.visual"],
    supportedBlueprint: ["viet-landing-page", "viet-content-facebook"],
    supportedTasks: ["Dựng Design Brief/Banner Spec"],
    inputContract: ["contentToVisualize", "brandStyle?"],
    outputContract: ["designBrief"],
    qaChecklist: ["Nhất quán màu sắc/font với Brand Kit hiện có của Owner (nếu đã có)"],
    evidenceStandard: ["Output", "Companion Review"],
    portfolioMapping: { primaryCompetencyId: "Design" },
    outputType: "markdown",
    providerPreference: "openai",
    fallbackProvider: "anthropic",
    workingStatus: "inactive",
    trainingStatus: "completed",
    certificationStatus: "certified",
    performanceScore: 50,
  },
  {
    employeeId: "EMP-T003",
    department: "technology-automation",
    position: "Automation Companion",
    mission: "Biến việc lặp lại thủ công thành quy trình có thể lặp lại tự động.",
    responsibilities: ["Thiết kế quy trình tự động hoá (Automation Workflow/SOP) từ mô tả thao tác thủ công"],
    capability: ["automation.workflow"],
    supportedBlueprint: ["xay-sop"],
    supportedTasks: ["Thiết kế Automation Workflow", "Viết SOP"],
    inputContract: ["manualProcessDescription", "frequency?"],
    outputContract: ["automationWorkflow", "sopDocument"],
    qaChecklist: ["Mỗi bước phải có input/output rõ ràng, không mơ hồ"],
    evidenceStandard: ["Output", "Companion Review"],
    portfolioMapping: { primaryCompetencyId: "Automation" },
    outputType: "markdown",
    providerPreference: "openai",
    fallbackProvider: "anthropic",
    workingStatus: "inactive",
    trainingStatus: "completed",
    certificationStatus: "certified",
    performanceScore: 50,
  },
  {
    employeeId: "EMP-O002",
    department: "office-productivity",
    position: "Dashboard Companion",
    mission: "Biến số liệu rời rạc thành Dashboard dễ đọc, ra quyết định nhanh.",
    responsibilities: ["Tổng hợp số liệu từ nhiều nguồn thành 1 Dashboard"],
    capability: ["office.dashboard"],
    supportedBlueprint: ["lam-dashboard-excel"],
    supportedTasks: ["Tổng hợp Dashboard số liệu"],
    inputContract: ["processedData", "dashboardGoal"],
    outputContract: ["dashboardSpec"],
    qaChecklist: ["Mỗi chỉ số hiển thị phải trả lời được câu hỏi 'để làm gì'"],
    evidenceStandard: ["Output", "Companion Review"],
    portfolioMapping: { primaryCompetencyId: "Data Analysis" },
    outputType: "excel",
    providerPreference: "openai",
    fallbackProvider: "anthropic",
    workingStatus: "inactive",
    trainingStatus: "completed",
    certificationStatus: "certified",
    performanceScore: 50,
  },
  {
    employeeId: "EMP-G003",
    department: "personal-growth",
    position: "Learning Coach Companion",
    mission: "Gợi ý bước tiếp theo phù hợp với năng lực hiện tại của Owner, không để Owner tự mò mẫm.",
    responsibilities: ["Gợi ý Mission/Journey tiếp theo dựa trên Capability hiện tại và Reflection đã ghi nhận"],
    capability: ["growth.learning-coaching"],
    supportedBlueprint: [],
    supportedTasks: ["Gợi ý Mission/Journey tiếp theo"],
    inputContract: ["currentCapability", "completedMissionHistory", "latestReflection?"],
    outputContract: ["nextMissionSuggestion", "reason"],
    qaChecklist: ["Gợi ý phải dựa trên dữ liệu Capability/Mission thật đã có", "Không gợi ý Mission Owner chưa đủ điều kiện unlock"],
    evidenceStandard: ["Output", "Reflection"],
    portfolioMapping: { primaryCompetencyId: "Personal Growth" },
    outputType: "markdown",
    providerPreference: "anthropic",
    fallbackProvider: "openai",
    workingStatus: "inactive",
    trainingStatus: "completed",
    certificationStatus: "certified",
    performanceScore: 50,
  },
] as const;

/**
 * Wave 3 (Sprint 002 "Complete Core AI Companion Team") — 10 Companion
 * cuối cùng, đưa Workforce lên đúng 30/30 đã thiết kế ở
 * `AI_COMPANION_REGISTRY.md` — KHÔNG thêm Companion nào ngoài danh sách
 * đã khóa. Nội dung kế thừa trực tiếp từ `AI_COMPANION_REGISTRY.md`
 * §2.2/3.4/4.4/5.2/5.3/5.4/6.4/7.2/7.3/7.5 — không phát minh mới.
 */
const WAVE3_COMPANION_CATALOG: readonly CompanionRecord[] = [
  {
    employeeId: "EMP-R005",
    department: "research-knowledge",
    position: "Customer Research Companion",
    mission: "Giúp Owner hiểu đúng khách hàng thật, không đoán.",
    responsibilities: ["Xây chân dung khách hàng (Persona)", "Phân tích nhu cầu/hành vi từ dữ liệu Owner cung cấp"],
    capability: ["research.customer-insight"],
    supportedBlueprint: ["phan-tich-khach-hang"],
    supportedTasks: ["Xây dựng Persona khách hàng", "Phân tích Pain Point"],
    inputContract: ["rawCustomerData"],
    outputContract: ["customerPersona", "painPointSummary"],
    qaChecklist: ["Mỗi Persona phải trích dẫn được ít nhất 1 nguồn dữ liệu thật đã cung cấp", "Không bịa đặc điểm khách hàng"],
    evidenceStandard: ["Output", "Companion Review"],
    portfolioMapping: { primaryCompetencyId: "Research" },
    outputType: "markdown",
    providerPreference: "gemini",
    fallbackProvider: "anthropic",
    workingStatus: "inactive",
    trainingStatus: "completed",
    certificationStatus: "certified",
    performanceScore: 50,
  },
  {
    employeeId: "EMP-C005",
    department: "content-communication",
    position: "Translator Companion",
    mission: "Giữ đúng ý và giọng văn khi chuyển ngôn ngữ.",
    responsibilities: ["Dịch tài liệu/nội dung giữa các ngôn ngữ Owner cần (mặc định Việt↔Anh)"],
    capability: ["writing.translation"],
    supportedBlueprint: [],
    supportedTasks: ["Dịch tài liệu", "Dịch nội dung"],
    inputContract: ["sourceContent", "targetLanguage", "tone?"],
    outputContract: ["translatedContent"],
    qaChecklist: ["Không bỏ sót đoạn nào của bản gốc", "Thuật ngữ chuyên ngành nhất quán trong toàn bài"],
    evidenceStandard: ["Output", "Version", "Companion Review"],
    portfolioMapping: { primaryCompetencyId: "AI Writing" },
    outputType: "markdown",
    providerPreference: "anthropic",
    fallbackProvider: "openai",
    workingStatus: "inactive",
    trainingStatus: "completed",
    certificationStatus: "certified",
    performanceScore: 50,
  },
  {
    employeeId: "EMP-B004",
    department: "business-strategy",
    position: "Partnership Companion",
    mission: "Mở rộng cơ hội cho Owner qua hợp tác, không chỉ tự làm một mình.",
    responsibilities: ["Xác định đối tác/kênh hợp tác tiềm năng phù hợp mục tiêu Owner", "Soạn đề xuất hợp tác sơ bộ"],
    capability: ["business.partnership"],
    supportedBlueprint: ["lap-ke-hoach-marketing", "viet-proposal-khach-hang"],
    supportedTasks: ["Xác định đối tác tiềm năng", "Soạn đề xuất hợp tác sơ bộ"],
    inputContract: ["expansionGoal", "researchReport?"],
    outputContract: ["partnershipShortlist", "partnershipProposalDraft"],
    qaChecklist: ["Mỗi đối tác đề xuất phải có lý do phù hợp cụ thể với Goal Owner"],
    evidenceStandard: ["Output", "Companion Review"],
    portfolioMapping: { primaryCompetencyId: "Strategy" },
    outputType: "markdown",
    providerPreference: "anthropic",
    fallbackProvider: "openai",
    workingStatus: "inactive",
    trainingStatus: "completed",
    certificationStatus: "certified",
    performanceScore: 50,
  },
  {
    employeeId: "EMP-D002",
    department: "creative-design",
    position: "Presentation Companion",
    mission: "Giúp Owner trình bày ý tưởng rõ ràng, thuyết phục qua Slide.",
    responsibilities: ["Dàn cấu trúc Slide/Pitch Deck (1 ý/slide, thứ tự logic)"],
    capability: ["design.presentation"],
    supportedBlueprint: ["thiet-ke-slide"],
    supportedTasks: ["Dàn Slide Outline"],
    inputContract: ["contentToPresent", "audience?"],
    outputContract: ["slideOutline"],
    qaChecklist: ["Đúng nguyên tắc 1-ý-1-slide", "Không nhồi quá 5 dòng/slide"],
    evidenceStandard: ["Output", "Companion Review"],
    portfolioMapping: { primaryCompetencyId: "Design" },
    outputType: "markdown",
    providerPreference: "openai",
    fallbackProvider: "anthropic",
    workingStatus: "inactive",
    trainingStatus: "completed",
    certificationStatus: "certified",
    performanceScore: 50,
  },
  {
    employeeId: "EMP-D003",
    department: "creative-design",
    position: "Video Companion",
    mission: "Giúp Owner kể chuyện bằng video ngắn mà không cần biết dựng phim.",
    responsibilities: ["Viết kịch bản/Storyboard cho Video ngắn (social, quảng cáo)"],
    capability: ["design.video-script"],
    supportedBlueprint: ["viet-content-facebook"],
    supportedTasks: ["Viết Storyboard Video ngắn"],
    inputContract: ["messageToConvey", "desiredLength?"],
    outputContract: ["videoStoryboard"],
    qaChecklist: ["Mỗi cảnh phải có mục đích rõ ràng (hook/thông tin/CTA)", "Không có cảnh thừa"],
    evidenceStandard: ["Output", "Companion Review"],
    portfolioMapping: { primaryCompetencyId: "Design" },
    outputType: "markdown",
    providerPreference: "openai",
    fallbackProvider: "anthropic",
    workingStatus: "inactive",
    trainingStatus: "completed",
    certificationStatus: "certified",
    performanceScore: 50,
  },
  {
    employeeId: "EMP-D004",
    department: "creative-design",
    position: "Brand Companion",
    mission: "Giữ cho thương hiệu Owner nhất quán qua thời gian và qua nhiều Output khác nhau.",
    responsibilities: ["Kiểm tra tính nhất quán thương hiệu trên các Output đã tạo", "Duy trì Brand Guideline tóm tắt"],
    capability: ["design.brand-consistency"],
    supportedBlueprint: [],
    supportedTasks: ["Rà soát nhất quán thương hiệu"],
    inputContract: ["existingBrandGuideline?", "outputToCheck"],
    outputContract: ["brandConsistencyNote"],
    qaChecklist: ["Không tự ý tạo mới bộ nhận diện khi Owner chưa có", "Chỉ tổng hợp từ Output đã được Owner Approve trước đó"],
    evidenceStandard: ["Output", "Companion Review"],
    portfolioMapping: { primaryCompetencyId: "Design" },
    outputType: "markdown",
    providerPreference: "openai",
    fallbackProvider: "anthropic",
    workingStatus: "inactive",
    trainingStatus: "completed",
    certificationStatus: "certified",
    performanceScore: 50,
  },
  {
    employeeId: "EMP-T004",
    department: "technology-automation",
    position: "Integration Companion",
    mission: "Giúp các công cụ Owner đang dùng \"nói chuyện\" được với nhau, không phải làm thủ công qua lại.",
    responsibilities: ["Đề xuất cách kết nối công cụ/API bên thứ ba cho 1 Automation Workflow cụ thể — chỉ đề xuất cấu hình"],
    capability: ["automation.integration"],
    supportedBlueprint: ["xay-sop"],
    supportedTasks: ["Lập Integration Plan giữa các công cụ"],
    inputContract: ["automationWorkflow", "toolsInUse"],
    outputContract: ["integrationPlan"],
    qaChecklist: ["Không đề xuất tích hợp yêu cầu quyền truy cập Owner chưa xác nhận sẵn có"],
    evidenceStandard: ["Output", "Companion Review"],
    portfolioMapping: { primaryCompetencyId: "Automation" },
    outputType: "markdown",
    providerPreference: "openai",
    fallbackProvider: "anthropic",
    workingStatus: "inactive",
    trainingStatus: "completed",
    certificationStatus: "certified",
    performanceScore: 50,
  },
  {
    employeeId: "EMP-O003",
    department: "office-productivity",
    position: "Word Companion",
    mission: "Soạn thảo văn bản chuẩn định dạng, sẵn sàng gửi/in ngay.",
    responsibilities: ["Soạn thảo văn bản hành chính/văn phòng theo mẫu chuẩn"],
    capability: ["office.document"],
    supportedBlueprint: ["viet-email-chuyen-nghiep", "viet-proposal-khach-hang"],
    supportedTasks: ["Soạn văn bản hành chính/văn phòng"],
    inputContract: ["contentToInclude", "documentType"],
    outputContract: ["documentOutput"],
    qaChecklist: ["Đúng cấu trúc chuẩn của loại văn bản được yêu cầu", "Không tự thêm điều khoản pháp lý mới"],
    evidenceStandard: ["Output", "Companion Review"],
    portfolioMapping: { primaryCompetencyId: "Office Productivity" },
    outputType: "word",
    providerPreference: "openai",
    fallbackProvider: "anthropic",
    workingStatus: "inactive",
    trainingStatus: "completed",
    certificationStatus: "certified",
    performanceScore: 50,
  },
  {
    employeeId: "EMP-O004",
    department: "office-productivity",
    position: "PowerPoint Companion",
    mission: "Dựng trình chiếu văn phòng nhanh, đúng chuẩn báo cáo (không phải Pitch Deck sáng tạo).",
    responsibilities: ["Dựng file trình chiếu từ Outline có sẵn hoặc dữ liệu Owner cung cấp"],
    capability: ["office.presentation"],
    supportedBlueprint: ["thiet-ke-slide"],
    supportedTasks: ["Dựng Slide báo cáo văn phòng từ Outline"],
    inputContract: ["slideOutline", "dataToPresent?"],
    outputContract: ["presentationOutput"],
    qaChecklist: ["Đúng số lượng slide theo Outline", "Không tự thêm/bớt nội dung ngoài Outline"],
    evidenceStandard: ["Output", "Companion Review"],
    portfolioMapping: { primaryCompetencyId: "Office Productivity" },
    outputType: "markdown",
    providerPreference: "openai",
    fallbackProvider: "anthropic",
    workingStatus: "inactive",
    trainingStatus: "completed",
    certificationStatus: "certified",
    performanceScore: 50,
  },
  {
    employeeId: "EMP-O005",
    department: "office-productivity",
    position: "Report Companion",
    mission: "Giúp Owner có báo cáo định kỳ đều đặn mà không phải tự tổng hợp lại từ đầu mỗi lần.",
    responsibilities: ["Tổng hợp báo cáo định kỳ (tuần/tháng) từ Dashboard/Output đã có trong Workspace"],
    capability: ["office.report"],
    supportedBlueprint: ["lam-dashboard-excel", "lap-ke-hoach-marketing"],
    supportedTasks: ["Tổng hợp báo cáo định kỳ"],
    inputContract: ["periodData", "priorReport?"],
    outputContract: ["progressReport"],
    qaChecklist: ["Mọi số liệu trong báo cáo phải trích từ Dashboard/Output thật đã ghi nhận trong kỳ"],
    evidenceStandard: ["Output", "Companion Review"],
    portfolioMapping: { primaryCompetencyId: "Office Productivity" },
    outputType: "markdown",
    providerPreference: "openai",
    fallbackProvider: "anthropic",
    workingStatus: "inactive",
    trainingStatus: "completed",
    certificationStatus: "certified",
    performanceScore: 50,
  },
] as const;

const WORKFORCE_CATALOG: readonly CompanionRecord[] = [...WAVE1_COMPANION_CATALOG, ...WAVE2_COMPANION_CATALOG, ...WAVE3_COMPANION_CATALOG];

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
  return WORKFORCE_CATALOG.map((c) => ({ ...c, ...(overlay[c.employeeId] ?? {}) }));
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
 * Activate mọi Companion đang `inactive` (Wave 1 + Wave 2, và mọi Wave
 * sau này thêm vào `WORKFORCE_CATALOG`) vào Production Runtime — đi
 * đúng chuỗi `inactive → training → certified → active`, phát 1
 * `COMPANION_ACTIVATED` khi tới `active` (không phát 1 event/bước
 * trung gian — Sprint Activation này gộp 3 bước thành 1 hành động vận
 * hành, không phải quy trình đào tạo nhiều ngày thật của
 * `docs/AI_TRAINING_ENGINE.md`). Giữ tên `activateWave1Companions` để
 * không đổi API đã dùng ở Sprint EPIC 02 Wave 1 — hàm này không giới
 * hạn riêng Wave 1, chạy cho toàn bộ Registry.
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
