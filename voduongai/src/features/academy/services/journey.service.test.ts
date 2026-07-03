import { describe, it, expect } from "vitest";
import { getAllLearningJourneys, computeJourneyStatus } from "./journey.service";
import { JourneyStage } from "../types/journey.types";

describe("Learning Journey Engine (Academy Sprint 02)", () => {
  it("chiếu đúng 1:1 mỗi CKOS Collection thành 1 Learning Journey", () => {
    const journeys = getAllLearningJourneys();
    expect(journeys.length).toBeGreaterThan(0);
    for (const journey of journeys) {
      expect(journey.collectionSlug).toBe(journey.slug);
    }
  });

  it("Journey chưa bắt đầu ở giai đoạn PREPARATION", () => {
    const journey = getAllLearningJourneys()[0];
    const status = computeJourneyStatus(journey);
    expect(status.stage).toBe(JourneyStage.PREPARATION);
    expect(status.percent).toBe(0);
  });

  it("mỗi Journey luôn có currentSeedSlug khi chưa hoàn thành", () => {
    const journey = getAllLearningJourneys()[0];
    const status = computeJourneyStatus(journey);
    expect(status.currentSeedSlug).not.toBeNull();
  });
});
