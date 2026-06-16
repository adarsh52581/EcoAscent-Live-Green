import { Car, Plane, Bus, Train, Beef, Drumstick, Salad, Bike, Trees, Leaf, type LucideIcon } from "lucide-react";

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

export function worldState(total: number): "pristine" | "moderate" | "critical" {
  if (total < 20) return "pristine";
  if (total < 80) return "moderate";
  return "critical";
}