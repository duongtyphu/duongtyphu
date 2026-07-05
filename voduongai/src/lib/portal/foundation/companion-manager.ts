/**
 * PHASE 4 EPIC 02 — Companion Manager (Task Assignment).
 *
 * Luồng bắt buộc: Companion → Department → Companion → Provider Manager
 * → Provider → Output. Companion KHÔNG chọn Provider — chỉ khai báo
 * `providerPreference`/`fallbackProvider` (Workforce Registry), việc
 * chọn AI nào chạy thật thuộc `ProviderManager`/`ModelRouter`
 * (`src/ai/providers/`, PHASE 4 EPIC 01) — file này chỉ truyền tham số
 * qua API Route, không tự quyết định.
 */

import { createWorkforceApiProvider } from "./ai-provider";
import { getCompanion, setWorkingStatus, type CompanionRecord } from "./workforce-registry";
import { emitGrowthEvent } from "./growth-event-bus";
import type { OutputType } from "./workspace-session-store";

export type CompanionTaskInput = {
  prompt: string;
  context?: string;
};

export type CompanionTaskResult = {
  employeeId: string;
  position: string;
  department: string;
  output: string;
  model: string;
  providerId: string;
  isMock: boolean;
};

/**
 * Output Contract chuẩn bị cho Sprint Workspace Integration sau này
 * (Companion → Workspace Output → Review → Portfolio) — hình dạng
 * đúng khớp tham số `saveOutputVersion(sessionId, { type, content })`
 * đã có trong `workspace-session-store.ts` (Kernel, không đổi). Sprint
 * này CHỈ chuẩn hoá interface — không gọi `saveOutputVersion` ở đây.
 */
export type CompanionOutputContract = {
  employeeId: string;
  type: OutputType;
  content: string;
};

/**
 * Biến 1 `CompanionTaskResult` đã có thành `CompanionOutputContract`
 * sẵn sàng nối vào Workspace Output thật — Sprint sau chỉ cần gọi
 * `saveOutputVersion(sessionId, { type: contract.type, content: contract.content })`,
 * không cần đoán lại `OutputType` phù hợp cho từng Companion.
 */
export function toOutputContract(companion: CompanionRecord, result: CompanionTaskResult): CompanionOutputContract {
  return {
    employeeId: companion.employeeId,
    type: companion.outputType,
    content: result.output,
  };
}

type ProviderTaskResponse = { raw: string; model: string; providerId: string; isMock: boolean };

/**
 * Giao 1 Task cho đúng 1 Companion trong Workforce Registry. Companion
 * phải đang ở trạng thái nhận việc được (`active`/`idle`) — Companion
 * `inactive`/`training`/`certified`/`maintenance`/`retired` không được
 * nhận Task (đúng Companion Lifecycle đã khóa).
 */
export async function assignTask(employeeId: string, input: CompanionTaskInput): Promise<CompanionTaskResult> {
  const companion = getCompanion(employeeId);
  if (!companion) {
    throw new Error(`Không tìm thấy Companion "${employeeId}" trong Workforce Registry.`);
  }
  if (companion.workingStatus !== "active" && companion.workingStatus !== "idle") {
    throw new Error(`Companion "${companion.position}" đang ở trạng thái "${companion.workingStatus}" — không thể nhận Task.`);
  }

  setWorkingStatus(employeeId, "busy");
  emitGrowthEvent({ eventType: "COMPANION_TASK_ASSIGNED" });

  try {
    const provider = createWorkforceApiProvider();
    const result = await provider.execute<ProviderTaskResponse>("companion-task", {
      capabilityId: companion.capability[0],
      prompt: input.prompt,
      context: input.context,
      preferredProvider: companion.providerPreference,
      fallbackProvider: companion.fallbackProvider,
    });

    setWorkingStatus(employeeId, "active");
    emitGrowthEvent({ eventType: "COMPANION_TASK_COMPLETED" });

    return {
      employeeId: companion.employeeId,
      position: companion.position,
      department: companion.department,
      output: result.raw,
      model: result.model,
      providerId: result.providerId,
      isMock: result.isMock,
    };
  } catch (err) {
    // Không để Companion kẹt ở "busy" khi Task lỗi — quay lại "active" rồi mới ném lỗi tiếp.
    setWorkingStatus(employeeId, "active");
    throw err;
  }
}
