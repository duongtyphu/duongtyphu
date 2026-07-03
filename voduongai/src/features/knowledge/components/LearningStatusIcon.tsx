import { LEARNING_STATUS_SYMBOL, type LearningStatus } from "../services/knowledge-collection.service";

const COLOR: Record<LearningStatus, string> = {
  not_started: "text-gray-300",
  in_progress: "text-amber-500",
  completed: "text-emerald-500",
};

/** ○ Chưa bắt đầu · ◐ Đang học · ✓ Hoàn thành — Feature 05: Learning Status. */
export function LearningStatusIcon({ status, className = "" }: { status: LearningStatus; className?: string }) {
  return (
    <span aria-hidden className={`text-base font-bold leading-none ${COLOR[status]} ${className}`}>
      {LEARNING_STATUS_SYMBOL[status]}
    </span>
  );
}
