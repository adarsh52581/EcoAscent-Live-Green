import {
  Car,
  Plane,
  Bus,
  Train,
  Beef,
  Drumstick,
  Salad,
  Bike,
  Trees,
  Leaf,
  type LucideIcon,
} from "lucide-react";

export type Category = "transit" | "food" | "offset";

export type Preset = {
  id: string;
  category: Category;
  label: string;
  co2: number;
  icon: LucideIcon;
};

export const PRESETS: Preset[] = [
  { id: "car", category: "transit", label: "Car commute", co2: 6, icon: Car },
  { id: "flight", category: "transit", label: "Short flight", co2: 90, icon: Plane },
  { id: "bus", category: "transit", label: "Bus ride", co2: 2, icon: Bus },
  { id: "train", category: "transit", label: "Train ride", co2: 1, icon: Train },
  { id: "beef", category: "food", label: "Beef meal", co2: 7, icon: Beef },
  { id: "chicken", category: "food", label: "Chicken meal", co2: 2, icon: Drumstick },
  { id: "vegan", category: "food", label: "Vegan meal", co2: 0.5, icon: Salad },
  { id: "cycle", category: "offset", label: "Cycled instead", co2: -2, icon: Bike },
  { id: "tree", category: "offset", label: "Planted a tree", co2: -20, icon: Trees },
  { id: "skipflight", category: "offset", label: "Skipped a flight", co2: -50, icon: Leaf },
];

export const CATEGORY_META: Record<Category, { label: string; tagline: string }> = {
  transit: { label: "Transit", tagline: "How you got around" },
  food: { label: "Food", tagline: "What was on your plate" },
  offset: { label: "Green Offsets", tagline: "Acts that heal the world" },
};

/**
 * CO₂ thresholds (kg) that divide the world into emotional states.
 * Kept as a single source of truth so UI, tests, and docs stay aligned.
 */
export const WORLD_THRESHOLDS = {
  /** Below this total the world is pristine. */
  pristine: 20,
  /** Below this total the world is moderately stressed. */
  moderate: 60,
  /** Below this total the world is strained; at or above it becomes critical. */
  strained: 80,
} as const;

/**
 * Named threshold constants — extracted out of inline magic numbers so UI,
 * tests, and documentation reference one source of truth.
 */
export const PRISTINE_THRESHOLD_KG: number = WORLD_THRESHOLDS.pristine;
export const MODERATE_THRESHOLD_KG: number = WORLD_THRESHOLDS.moderate;
export const CRITICAL_THRESHOLD_KG: number = WORLD_THRESHOLDS.strained;

export type WorldState = "pristine" | "moderate" | "strained" | "critical";

/**
 * Maps a cumulative CO₂ total (kg) to one of four world states.
 * Pure function — safe to call in render and easy to unit-test.
 *
 * @param total cumulative CO₂ in kilograms (may be negative for net-offsetters)
 * @returns the world state bucket used by the Living World scene
 */
export function worldState(total: number): WorldState {
  if (total < WORLD_THRESHOLDS.pristine) return "pristine";
  if (total < WORLD_THRESHOLDS.moderate) return "moderate";
  if (total < WORLD_THRESHOLDS.strained) return "strained";
  return "critical";
}

/**
 * Human-readable headline for a given world state.
 * Escalates emotionally from calm reassurance to urgent alarm.
 */
export function worldHeadline(state: WorldState): string {
  switch (state) {
    case "pristine":
      return "Your world is breathing easy.";
    case "moderate":
      return "The air is getting heavier.";
    case "strained":
      return "Cracks are forming. Your world is struggling.";
    case "critical":
      return "Your world is choking. Time to act.";
  }
}