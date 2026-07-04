/**
 * EPIC 03 — Sprint B1: Progressive Architecture Refactor — Extension
 * Points (Step 9).
 *
 * Điểm mở rộng chuẩn bị cho EPIC 04+ (AI Execution Engine) — CHỈ
 * Interface, KHÔNG implementation, KHÔNG được import/dùng ở đâu trong
 * Sprint B1. Mục đích: khi EPIC 04 cần cắm AI Provider thật/Execution
 * Engine thật/Mission Engine thật/Asset Engine thật vào, chỉ cần viết
 * class implement đúng interface này — không phải sửa lại
 * Companion/Workspace/Mission/Portfolio hiện có.
 */

import type { PortalModule } from "@/companion/agents/agent.types";

/** Companion → AI Provider (EPIC 04). AI-Agnostic theo quyết định kiến
    trúc đã khóa (`FUTURE_ARCHITECTURE_DECISIONS.md` mục 1.12) — Companion
    gọi qua interface này, không import trực tiếp SDK của bất kỳ hãng AI
    nào. */
export interface AiProvider {
  readonly providerId: string; // vd "anthropic" | "openai" | "mock"
  complete(input: { prompt: string; context?: Record<string, unknown> }): Promise<{ text: string }>;
}

/** Workspace → Execution Engine (EPIC 04). Nơi thật sự "chạy" Practice →
    Output cho một WorkspaceSession — Sprint B1-B2 chưa có implementation
    nào, Workspace hiện tại chỉ hiển thị context + kế hoạch tĩnh. */
export interface ExecutionEngine {
  execute(input: {
    sessionId: string;
    missionId?: string;
    agentRole: string; // vd "Writer Agent", "Reviewer Agent" — theo Learning Asset Standard mục 9
    instruction: string;
  }): Promise<{ outputContentRef: string }>;
}

/** Học viện AI (Mission) → Mission Engine (Sprint B7+). Nơi quyết định
    Mission nào hiển thị/mở khóa cho 1 User dựa trên UnlockRule +
    CompetencyProfile. */
export interface MissionEngine {
  getAvailableMissions(userId: string, module: PortalModule): Promise<string[]>; // missionId[]
  isMissionUnlocked(userId: string, missionId: string): Promise<boolean>;
}

/** Portfolio → Asset Engine (Sprint B4+). Nơi quyết định 1 Output có đủ
    điều kiện trở thành PortfolioItem hay chưa (Review + Reflection đã
    đạt — Learning Operating System Blueprint mục 8). */
export interface AssetEngine {
  qualifiesForPortfolio(outputId: string): Promise<boolean>;
  promoteToPortfolio(outputId: string, competencyId: string): Promise<string>; // portfolioItemId
}
