import type { GardenStage } from "@/lib/portal/living-garden/garden-model";
import type { ReflectionMeaning } from "@/lib/portal/intelligence/reflection-meaning";

export type JourneyState = "starting" | "in-progress" | "completed";

export type PortalSignals = {
  pathname: string;
  gardenStage?: GardenStage;
  lastComebackDays?: number;
  journeyState?: JourneyState;
  learningFocus?: string;
  storyMomentum?: number;
  /**
   * Sprint 12.3 — Reflection Meaning Engine. KHÔNG phải điểm số/độ sâu
   * ("Reflection này sâu bao nhiêu?") — là Ý NGHĨA Reflection đang
   * truyền tải ("Reflection này đang nói điều gì về con người?"). Xem
   * `docs/REFLECTION_MEANING_ENGINE.md`.
   */
  reflectionMeaning?: ReflectionMeaning;
};

const GARDEN_STAGE_KEY = "portal-signal-garden-stage";
const GARDEN_STAGE_EVENT = "portal-signal-garden-stage-change";

const REFLECTION_MEANING_KEY = "portal-signal-reflection-meaning";
const REFLECTION_MEANING_EVENT = "portal-signal-reflection-meaning-change";

/**
 * Sprint 13.0 — Living Learning Loop. Lưu lại ý nghĩa Reflection gần
 * nhất để Knowledge/Companion đọc được ở client (Portal Brain hiện
 * chạy ở client cho Companion). Không lưu nội dung Reflection thật —
 * chỉ lưu ý nghĩa đã được suy ra (`ReflectionMeaning`), giống cách
 * Garden stage đã được lưu từ Sprint 9.0.
 */
export function readStoredReflectionMeaning(): ReflectionMeaning | undefined {
  if (typeof window === "undefined") return undefined;
  const value = window.localStorage.getItem(REFLECTION_MEANING_KEY);
  return (value as ReflectionMeaning | null) ?? undefined;
}

export function writeStoredReflectionMeaning(meaning: ReflectionMeaning): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(REFLECTION_MEANING_KEY, meaning);
  window.dispatchEvent(
    new CustomEvent<ReflectionMeaning>(REFLECTION_MEANING_EVENT, { detail: meaning })
  );
}

export function subscribeToReflectionMeaning(
  onChange: (meaning: ReflectionMeaning) => void
): () => void {
  if (typeof window === "undefined") return () => {};

  const handleCustomEvent = (event: Event) => {
    const detail = (event as CustomEvent<ReflectionMeaning>).detail;
    if (detail) onChange(detail);
  };

  const handleStorageEvent = (event: StorageEvent) => {
    if (event.key === REFLECTION_MEANING_KEY && event.newValue) {
      onChange(event.newValue as ReflectionMeaning);
    }
  };

  window.addEventListener(REFLECTION_MEANING_EVENT, handleCustomEvent);
  window.addEventListener("storage", handleStorageEvent);

  return () => {
    window.removeEventListener(REFLECTION_MEANING_EVENT, handleCustomEvent);
    window.removeEventListener("storage", handleStorageEvent);
  };
}

export function readStoredGardenStage(): GardenStage | undefined {
  if (typeof window === "undefined") return undefined;
  const value = window.localStorage.getItem(GARDEN_STAGE_KEY);
  return (value as GardenStage | null) ?? undefined;
}

export function writeStoredGardenStage(stage: GardenStage): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(GARDEN_STAGE_KEY, stage);
  window.dispatchEvent(
    new CustomEvent<GardenStage>(GARDEN_STAGE_EVENT, { detail: stage })
  );
}

export function subscribeToGardenStage(
  onChange: (stage: GardenStage) => void
): () => void {
  if (typeof window === "undefined") return () => {};

  const handleCustomEvent = (event: Event) => {
    const detail = (event as CustomEvent<GardenStage>).detail;
    if (detail) onChange(detail);
  };

  const handleStorageEvent = (event: StorageEvent) => {
    if (event.key === GARDEN_STAGE_KEY && event.newValue) {
      onChange(event.newValue as GardenStage);
    }
  };

  window.addEventListener(GARDEN_STAGE_EVENT, handleCustomEvent);
  window.addEventListener("storage", handleStorageEvent);

  return () => {
    window.removeEventListener(GARDEN_STAGE_EVENT, handleCustomEvent);
    window.removeEventListener("storage", handleStorageEvent);
  };
}
