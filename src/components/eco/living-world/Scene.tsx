import { SCENE_PALETTES, treeCount, type SceneKind } from "./palettes";
import { TreeOrStump } from "./Trees";
import { Smoke, Pollen } from "./Atmosphere";

type Props = {
  visible: boolean;
  kind: SceneKind;
  tx: (depth: number) => { transform: string };
};

/** A single Living World backdrop (sky, hills, trees, atmosphere). */
export function Scene({ visible, kind, tx }: Props) {
  const p = SCENE_PALETTES[kind];

  return (
    <div
      className="absolute inset-0 transition-opacity duration-1000"
      style={{
        opacity: visible ? 1 : 0,
        background: `linear-gradient(to bottom, ${p.skyA} 0%, ${p.skyB} 70%)`,
      }}
      aria-hidden
    >
      {/* Sun / red disk */}
      <div
        className="absolute"
        style={{
          top: "10%",
          right: "12%",
          width: 180,
          height: 180,
          borderRadius: "9999px",
          background: `radial-gradient(circle, ${p.sun} 0%, ${p.sunGlow} 60%, transparent 75%)`,
          filter: kind === "critical" ? "blur(2px)" : "blur(1px)",
          ...tx(8),
        }}
      />

      {/* Back hills */}
      <svg
        className="absolute bottom-0 left-0 w-full"
        viewBox="0 0 1440 400"
        preserveAspectRatio="none"
        style={{ height: "55%", ...tx(4) }}
        aria-hidden
        focusable="false"
      >
        <path
          d="M0,200 C240,120 480,280 720,200 C960,120 1200,260 1440,180 L1440,400 L0,400 Z"
          fill={p.hill1}
          opacity={0.85}
        />
      </svg>

      {/* Front hills + ground */}
      <svg
        className="absolute bottom-0 left-0 w-full"
        viewBox="0 0 1440 400"
        preserveAspectRatio="none"
        style={{ height: "40%", ...tx(10) }}
        aria-hidden
        focusable="false"
      >
        <path
          d="M0,260 C200,200 460,340 720,260 C980,180 1240,320 1440,240 L1440,400 L0,400 Z"
          fill={p.hill2}
        />
        <rect x="0" y="340" width="1440" height="60" fill={p.ground} />
      </svg>

      {/* Trees / stumps */}
      <div
        className="absolute bottom-[10%] left-0 w-full flex justify-around items-end px-[6%]"
        style={tx(16)}
      >
        {treeCount(kind).map((variant, i) => (
          <TreeOrStump key={i} variant={variant} trunk={p.trunk} leaf={p.leaf} />
        ))}
      </div>

      {kind === "critical" && <Smoke />}
      {kind === "pristine" && <Pollen />}
    </div>
  );
}