/** Color palette and behaviour for a single Living World scene. */
export type ScenePalette = {
  readonly skyA: string;
  readonly skyB: string;
  readonly sun: string;
  readonly sunGlow: string;
  readonly hill1: string;
  readonly hill2: string;
  readonly ground: string;
  readonly trunk: string;
  readonly leaf: string;
  /** Blur radius (px) for the sun disk. */
  readonly sunBlurPx: number;
  /** Atmospheric overlay rendered on top of the scene. */
  readonly atmosphere: "pollen" | "smoke" | null;
  /** Tree/stump composition along the horizon. */
  readonly trees: ReadonlyArray<"tree" | "stump" | "small">;
};

/**
 * The complete data model for every Living World scene. Visual components
 * are pure consumers of this map — no per-kind conditional branching belongs
 * in JSX. To add or tune a scene, edit this map only.
 */
export const SCENE_PALETTES = {
  pristine: {
    skyA: "#7CC4F2",
    skyB: "#E8F4FF",
    sun: "#FFD36B",
    sunGlow: "#FFE9A8",
    hill1: "#3FA76A",
    hill2: "#2E8854",
    ground: "#A8D88B",
    trunk: "#5A3A22",
    leaf: "#2E8854",
    sunBlurPx: 1,
    atmosphere: "pollen",
    trees: ["tree", "tree", "small", "tree", "tree"],
  },
  moderate: {
    skyA: "#9FB8C9",
    skyB: "#E2DFCB",
    sun: "#E8B763",
    sunGlow: "#F2D69A",
    hill1: "#7C9466",
    hill2: "#5E764A",
    ground: "#B5B57A",
    trunk: "#4A3520",
    leaf: "#8FA85A",
    sunBlurPx: 1,
    atmosphere: null,
    trees: ["tree", "stump", "small", "tree", "stump"],
  },
  critical: {
    skyA: "#3A2A2A",
    skyB: "#B25A2E",
    sun: "#D94B2B",
    sunGlow: "#7A2A1A",
    hill1: "#3A2E26",
    hill2: "#2A201A",
    ground: "#4A3A2C",
    trunk: "#2A1A10",
    leaf: "#3A2E26",
    sunBlurPx: 2,
    atmosphere: "smoke",
    trees: ["stump", "stump", "stump", "stump", "stump"],
  },
} as const satisfies Record<string, ScenePalette>;

export type SceneKind = keyof typeof SCENE_PALETTES;