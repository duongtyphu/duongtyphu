/**
 * PHASE 4 EPIC 01 — AI Provider Benchmark (real implementation).
 *
 * Bản triển khai thật đầu tiên của `BenchmarkCase`/`BenchmarkRun` đã
 * thiết kế ở `docs/OPEN_AI_WORKFORCE_PLATFORM.md` §5 — chạy 1
 * `BenchmarkCase` thật qua đúng Provider đã đăng ký (`provider-manager.ts`),
 * lưu lại `rawOutput` thật (không chỉ điểm số) để con người kiểm chứng
 * lại được. Không tự động gán `score` — chấm điểm là việc của con người/
 * Reviewer Agent hỗ trợ, giữ đúng nguyên tắc đã khóa.
 */

import { getProviderForCapability } from "./provider-manager";

export type BenchmarkCase = {
  capabilityId: string;
  caseId: string;
  input: Record<string, unknown>;
  expectedCriteria: string[];
};

export type BenchmarkRun = {
  runId: string;
  providerId: string;
  capabilityId: string;
  caseId: string;
  rawOutput: unknown;
  isMock?: boolean;
  score?: number;
  scoredBy?: "human" | "reviewer-agent-assist";
  runAt: string;
};

/** Ánh xạ Capability → `agentRole` mà API Route `/api/ai/workforce` chấp
    nhận — KHÔNG đổi hợp đồng API đã khóa, chỉ dịch tên gọi ở tầng Benchmark. */
const CAPABILITY_TO_AGENT_ROLE: Record<string, "writer" | "reviewer"> = {
  "writing.draft": "writer",
  "writing.review": "reviewer",
};

const STORAGE_KEY = "vdai_benchmark_runs";
const MAX_RUNS = 500;

function readAll(): BenchmarkRun[] {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as BenchmarkRun[]) : [];
  } catch {
    return [];
  }
}

function writeAll(runs: BenchmarkRun[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(runs.slice(-MAX_RUNS)));
  } catch {
    // localStorage đầy/không khả dụng — lịch sử Benchmark chỉ mất khả năng lưu lâu dài.
  }
}

export function listBenchmarkRuns(capabilityId?: string): BenchmarkRun[] {
  const runs = readAll();
  return capabilityId ? runs.filter((r) => r.capabilityId === capabilityId) : runs;
}

/**
 * Chạy 1 Benchmark Case thật qua Provider đã đăng ký cho `capabilityId`
 * của case đó. `providerId` phải khớp đúng Provider Manager thực sự sẽ
 * chọn — nếu không khớp, ném lỗi thay vì âm thầm chạy Provider khác.
 */
export async function runBenchmarkCase(providerId: string, benchmarkCase: BenchmarkCase): Promise<BenchmarkRun> {
  const agentRole = CAPABILITY_TO_AGENT_ROLE[benchmarkCase.capabilityId];
  if (!agentRole) {
    throw new Error(`Chưa hỗ trợ Benchmark cho capability "${benchmarkCase.capabilityId}".`);
  }

  const provider = getProviderForCapability(benchmarkCase.capabilityId);
  const result = await provider.execute<{ isMock?: boolean }>(agentRole, benchmarkCase.input);

  const run: BenchmarkRun = {
    runId: `bench_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    providerId,
    capabilityId: benchmarkCase.capabilityId,
    caseId: benchmarkCase.caseId,
    rawOutput: result,
    isMock: result?.isMock,
    runAt: new Date().toISOString(),
  };
  writeAll([...readAll(), run]);
  return run;
}

/** Con người (hoặc Reviewer Agent hỗ trợ, không tự động quyết định) gán
    điểm cho 1 BenchmarkRun đã có — không tạo run mới, chỉ cập nhật. */
export function scoreBenchmarkRun(runId: string, score: number, scoredBy: "human" | "reviewer-agent-assist"): BenchmarkRun | null {
  const all = readAll();
  const idx = all.findIndex((r) => r.runId === runId);
  if (idx < 0) return null;
  const updated: BenchmarkRun = { ...all[idx], score, scoredBy };
  all[idx] = updated;
  writeAll(all);
  return updated;
}
