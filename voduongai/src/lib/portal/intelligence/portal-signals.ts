import type { GardenStage } from "@/lib/portal/living-garden/garden-model";

export type JourneyState = "starting" | "in-progress" | "completed";

export type PortalSignals = {
  pathname: string;
  gardenStage?: GardenStage;
  lastComebackDays?: number;
  journeyState?: JourneyState;
  learningFocus?: string;
  storyMomentum?: number;
  reflectionDepth?: number;
};

const GARDEN_STAGE_KEY = "portal-signal-garden-stage";
const GARDEN_STAGE_EVENT = "portal-signal-garden-stage-change";

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
