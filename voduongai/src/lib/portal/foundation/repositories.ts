/**
 * EPIC 03 — Sprint B1: Progressive Architecture Refactor — Repository
 * Interfaces (Step 3).
 *
 * CHỈ Interface — KHÔNG implementation. Không class nào ở đây được
 * instantiate/dùng trong Sprint B1. Đây là "extension seam" để Sprint B2+
 * viết implementation thật (đọc CKOS static data trước, rồi Supabase sau)
 * mà code gọi Repository không cần đổi — đúng nguyên tắc "Every module is
 * replaceable" (`FUTURE_ARCHITECTURE_DECISIONS.md` mục 1.15... mục 1,
 * quyết định 13/14).
 */

import type {
  Journey,
  Collection,
  Mission,
  LearningAsset,
  WorkspaceSession,
  Output,
  OutputVersion,
  PortfolioItem,
  GrowthEvent,
  GrowthEventType,
  CapabilityRecord,
  CompetencyProfile,
  ImpactRecord,
  UnlockRecord,
  KnowledgeResource,
} from "./data-model";

export interface JourneyRepository {
  getById(journeyId: string): Promise<Journey | null>;
  getAll(): Promise<Journey[]>;
  getCollections(journeyId: string): Promise<Collection[]>;
}

export interface MissionRepository {
  getById(missionId: string): Promise<Mission | null>;
  getByJourney(journeyId: string): Promise<Mission[]>;
  getByCategory(category: string): Promise<Mission[]>;
}

export interface KnowledgeRepository {
  getAssetById(assetId: string): Promise<LearningAsset | null>;
  getAssetsByMission(missionId: string): Promise<LearningAsset[]>;
  getResourceById(resourceId: string): Promise<KnowledgeResource | null>;
}

export interface WorkspaceRepository {
  createSession(session: WorkspaceSession): Promise<WorkspaceSession>;
  getSession(sessionId: string): Promise<WorkspaceSession | null>;
  getSessionsByUser(userId: string): Promise<WorkspaceSession[]>;
  saveOutput(output: Output): Promise<Output>;
  saveOutputVersion(version: OutputVersion): Promise<OutputVersion>;
}

export interface PortfolioRepository {
  addItem(item: PortfolioItem): Promise<PortfolioItem>;
  getItemsByUser(userId: string): Promise<PortfolioItem[]>;
  getItemsByCompetency(userId: string, competencyId: string): Promise<PortfolioItem[]>;
}

export interface GrowthRepository {
  appendEvent(event: GrowthEvent): Promise<GrowthEvent>;
  getEventsByUser(userId: string): Promise<GrowthEvent[]>;
  getEventsByType(userId: string, eventType: GrowthEventType): Promise<GrowthEvent[]>;
}

export interface CapabilityRepository {
  getProfile(userId: string, competencyId: string): Promise<CompetencyProfile | null>;
  appendRecord(record: CapabilityRecord): Promise<CapabilityRecord>;
  getRecordsByUser(userId: string): Promise<CapabilityRecord[]>;
}

export interface ImpactRepository {
  appendRecord(record: ImpactRecord): Promise<ImpactRecord>;
  getRecordsByUser(userId: string): Promise<ImpactRecord[]>;
  getRecordsByMission(userId: string, missionId: string): Promise<ImpactRecord[]>;
}

export interface UnlockRepository {
  getRecordsByUser(userId: string): Promise<UnlockRecord[]>;
  isUnlocked(userId: string, entityId: string): Promise<boolean>;
}
