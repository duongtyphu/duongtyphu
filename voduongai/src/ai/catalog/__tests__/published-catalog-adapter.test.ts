import { describe, it, expect, vi } from "vitest";

/** `published-catalog-adapter` import "server-only" — cần mock dưới
    Vitest, cùng kỹ thuật đã dùng ở `provider-layer.test.ts`. */
vi.mock("server-only", () => ({}));

import {
  mapPublishedContentToCatalog,
  getPublishedCatalog,
  __resetPublishedCatalogCacheForTest,
} from "../published-catalog-adapter";

describe("SPRINT FIX-R02 — Published Catalog Adapter: mapping thuần, không business logic", () => {
  it("map đúng 5 nguồn Published/Live sang CatalogEntry, đúng knowledgeType/workspace/url mỗi nguồn", () => {
    const catalog = mapPublishedContentToCatalog({
      tools: [
        {
          slug: "chatgpt",
          name: "ChatGPT",
          tagline: "",
          companionSummary: "",
          website: "https://chat.openai.com",
          pricing: "Freemium",
          pricingNote: "",
          category: "AI Chat",
          bestFor: ["viết", "tóm tắt"],
          notGoodFor: [],
          featured: false,
          badge: null,
          relatedArticleSlugs: [],
          relatedNeedSlugs: [],
        },
      ],
      bestPractices: [{ id: "bp-1", title: "Viết prompt rõ ràng", description: "d", principle: "p" }],
      resources: [
        { id: "res-1", title: "Checklist onboarding", type: "checklist", description: "d", whenToUse: "", whenNotToUse: "" },
      ],
      lessons: [
        {
          id: "seed-1",
          slug: "viet-email-chuyen-nghiep",
          title: "Viết email chuyên nghiệp",
          summary: "",
          goal: [],
          persona: [],
          difficulty: "BEGINNER",
          estimatedTime: "",
          steps: [],
          collectionSlug: "",
          relatedSeeds: [],
          whatYouWillGain: [],
          problem: "",
          coreIdea: "",
          guide: "",
          samplePrompt: "",
          example: "",
          commonMistakes: [],
          checklist: [],
          exercise: "",
          reflectionQuestions: [],
          companionNote: "",
          nextStep: "",
          subtitle: "",
          skillsGained: ["email"],
          whyMatters: "",
          guideSteps: [],
          promptTips: [],
          promptExampleInput: "",
          promptExampleOutput: "",
          prompts: [],
          downloadPack: { promptPackLabel: "", checklistLabel: "", templateLabel: "" },
          skills: [],
          aiTools: [],
          scenarios: [],
          prerequisites: [],
          nextSeeds: [],
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        } as any,
      ],
      projects: [
        {
          id: "proj-1",
          status: "Published",
          key: "digiu",
          name: "DigiU",
          description: "",
          href: "/portal/duan-cohoi/digiu",
          icon: "",
          statusLabel: "",
          expectation: "",
          fitCriteria: "",
          avoidCriteria: "",
        },
      ],
    });

    const tool = catalog.find((e) => e.knowledgeType === "tool");
    expect(tool).toMatchObject({ title: "ChatGPT", workspace: "ai-workspace", url: "/portal/aiworkspace/chatgpt", published: true, visibility: "public" });

    const bestPractice = catalog.find((e) => e.knowledgeType === "best-practice");
    expect(bestPractice).toMatchObject({ title: "Viết prompt rõ ràng", workspace: "ckos", url: "/portal/ckos/best-practices/bp-1" });

    const resource = catalog.find((e) => e.knowledgeType === "resource");
    expect(resource).toMatchObject({ title: "Checklist onboarding", workspace: "ckos", url: "/portal/resources/res-1" });

    const lesson = catalog.find((e) => e.knowledgeType === "lesson");
    expect(lesson).toMatchObject({
      title: "Viết email chuyên nghiệp",
      workspace: "hoc-vien-ai",
      url: "/portal/hetrithucai/viet-email-chuyen-nghiep",
    });

    const project = catalog.find((e) => e.knowledgeType === "project");
    expect(project).toMatchObject({ title: "DigiU", workspace: "du-an-co-hoi", url: "/portal/duan-cohoi/digiu" });
  });

  it("mảng rỗng ở mọi nguồn → catalog rỗng, không lỗi (mapping thuần, không tự bịa dữ liệu)", () => {
    const catalog = mapPublishedContentToCatalog({ tools: [], bestPractices: [], resources: [], lessons: [], projects: [] });
    expect(catalog).toEqual([]);
  });

  it("project không có href (rỗng) → loại khỏi Catalog, không tạo entry url rỗng", () => {
    const catalog = mapPublishedContentToCatalog({
      tools: [],
      bestPractices: [],
      resources: [],
      lessons: [],
      projects: [
        {
          id: "proj-no-href",
          status: "Published",
          key: "x",
          name: "X",
          description: "",
          href: "",
          icon: "",
          statusLabel: "",
          expectation: "",
          fitCriteria: "",
          avoidCriteria: "",
        },
      ],
    });
    expect(catalog).toEqual([]);
  });
});

describe("SPRINT FIX-R02 — Published Catalog Adapter: getPublishedCatalog() không crash khi Supabase chưa cấu hình", () => {
  it("trả về mảng (rỗng nếu chưa có env Supabase) — không throw", async () => {
    __resetPublishedCatalogCacheForTest();
    const catalog = await getPublishedCatalog();
    expect(Array.isArray(catalog)).toBe(true);
  });
});

describe("SPRINT R03 — Published Catalog Adapter: cache ngắn hạn (TTL), tránh gọi lại Supabase mỗi tin nhắn", () => {
  it("2 lần gọi liên tiếp trong TTL trả về CÙNG 1 reference (không tính lại/không I/O lại)", async () => {
    __resetPublishedCatalogCacheForTest();
    const first = await getPublishedCatalog();
    const second = await getPublishedCatalog();
    expect(second).toBe(first);
  });

  it("sau khi reset cache (mô phỏng hết TTL), gọi lại trả về array mới (không phải cùng reference cũ)", async () => {
    __resetPublishedCatalogCacheForTest();
    const first = await getPublishedCatalog();
    __resetPublishedCatalogCacheForTest();
    const second = await getPublishedCatalog();
    expect(second).not.toBe(first);
    expect(second).toEqual(first);
  });
});
