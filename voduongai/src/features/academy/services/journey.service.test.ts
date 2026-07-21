import { describe, it, expect } from "vitest";
import { getAllLearningJourneys, computeJourneyStatus } from "./journey.service";
import { JourneyStage } from "../types/journey.types";
import { knowledgeCollections } from "@/features/knowledge/data/knowledge-collections";
import { knowledgeSeedJourneys } from "@/features/knowledge/data/knowledge-seed-journeys";

// VIỆC 3 — journey.service.ts giờ nhận collections/seeds làm tham số (lấy
// từ getLiveKnowledgeCollections()/getLiveKnowledgeSeeds() ở Production,
// Supabase thật) thay vì tự đọc mảng tĩnh. Test unit thuần logic (không có
// Supabase trong sandbox test) nên dùng thẳng 2 mảng tĩnh @deprecated làm
// fixture — dữ liệu 11 seed/2 collection này khớp 1:1 với dữ liệu đã
// migrate lên Supabase (giữ nguyên slug), nên vẫn kiểm chứng đúng logic
// thật của Journey Engine.
const noProgress = () => [] as string[];

describe("Learning Journey Engine (Academy Sprint 02)", () => {
  it("chiếu đúng 1:1 mỗi CKOS Collection thành 1 Learning Journey", () => {
    const journeys = getAllLearningJourneys(knowledgeCollections);
    expect(journeys.length).toBeGreaterThan(0);
    for (const journey of journeys) {
      expect(journey.collectionSlug).toBe(journey.slug);
    }
  });

  it("Journey chưa bắt đầu ở giai đoạn PREPARATION", () => {
    const journey = getAllLearningJourneys(knowledgeCollections)[0];
    const status = computeJourneyStatus(journey, knowledgeCollections, knowledgeSeedJourneys, noProgress);
    expect(status.stage).toBe(JourneyStage.PREPARATION);
    expect(status.percent).toBe(0);
  });

  it("mỗi Journey luôn có currentSeedSlug khi chưa hoàn thành", () => {
    const journey = getAllLearningJourneys(knowledgeCollections)[0];
    const status = computeJourneyStatus(journey, knowledgeCollections, knowledgeSeedJourneys, noProgress);
    expect(status.currentSeedSlug).not.toBeNull();
  });
});
