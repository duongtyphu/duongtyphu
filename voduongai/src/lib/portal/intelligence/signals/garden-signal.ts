import type { GardenState } from "@/lib/portal/living-garden/garden-model";
import type { PortalSignals } from "@/lib/portal/intelligence/portal-signals";

export function gardenStateToSignal(
  garden: GardenState
): Pick<PortalSignals, "gardenStage"> {
  if (garden.isEmpty) return {};
  return { gardenStage: garden.stage };
}
