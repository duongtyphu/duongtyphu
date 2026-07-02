import type { CompanionStateKey } from "@/lib/portal/companion/companion-identity";
import type { LivingCoreState } from "@/components/LivingCore";

/**
 * Map 6 CompanionStateKey hiện có (idle/listening/thinking/encouraging/
 * celebrating/comeback) sang 6 state của Living Core™ — dùng chung ở
 * mọi nơi Companion hiển thị trong Portal (Presence, Space, ceremonies,
 * bubbles...) để không lặp lại logic map state ở từng nơi.
 */
export function toLivingCoreState(key: CompanionStateKey): LivingCoreState {
  switch (key) {
    case "idle":
      return "idle";
    case "listening":
      return "thinking";
    case "thinking":
      return "thinking";
    case "encouraging":
      return "speaking";
    case "celebrating":
      return "celebrating";
    case "comeback":
      return "speaking";
    default:
      return "idle";
  }
}
