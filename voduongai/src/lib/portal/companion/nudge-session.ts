/**
 * Companion Presence — bộ nhớ phiên cho Contextual Nudge: mỗi khu vực chỉ
 * hiện nudge tối đa 1 lần/session, và người dùng có thể tắt nudge hẳn
 * (ghi nhớ lâu dài qua localStorage).
 */

const NUDGE_DISABLED_KEY = "companion-nudge-disabled";
const NUDGE_SHOWN_PREFIX = "companion-nudge-shown:";

export function isNudgeDisabled(): boolean {
  try {
    return window.localStorage.getItem(NUDGE_DISABLED_KEY) === "1";
  } catch {
    return false;
  }
}

export function setNudgeDisabled(disabled: boolean) {
  try {
    window.localStorage.setItem(NUDGE_DISABLED_KEY, disabled ? "1" : "0");
  } catch {
    // bỏ qua nếu localStorage không khả dụng
  }
}

export function hasNudgeBeenShown(routeKey: string): boolean {
  try {
    return window.sessionStorage.getItem(`${NUDGE_SHOWN_PREFIX}${routeKey}`) === "1";
  } catch {
    return false;
  }
}

export function markNudgeShown(routeKey: string) {
  try {
    window.sessionStorage.setItem(`${NUDGE_SHOWN_PREFIX}${routeKey}`, "1");
  } catch {
    // bỏ qua nếu sessionStorage không khả dụng
  }
}
