import { useEffect, useRef, useState } from "react";
import { worldState, type WorldState } from "@/lib/eco/actions";

type Props = { totalCO2: number };

const SCENE_DESCRIPTIONS: Record<WorldState, string> = {
  pristine: "A lush green landscape with bright sun, healthy trees, and drifting pollen.",
  moderate: "A pale-skied landscape with thinning trees and a faded sun.",
  strained: "A dusty horizon with stumps replacing many trees and a heavy haze.",
  critical: "A scorched red sky over barren hills, only stumps remain, smoke billows upward.",
};

export function LivingWorld({ totalCO2 }: Props) {
  const state = worldState(totalCO2);
  const ref = useRef<HTMLDivElement>(null);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (typeof window === "undefined") return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    const onMove = (e: MouseEvent) => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      setParallax({ x: (e.clientX / w - 0.5) * 2, y: (e.clientY / h - 0.5) * 2 });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  const tx = (depth: number) => ({
    transform: `translate3d(${parallax.x * depth}px, ${parallax.y * depth * 0.5}px, 0)`,
  });

  const titleId = "living-world-title";
  const descId = "living-world-desc";
  return (
    <div ref={ref} className="fixed inset-0 -z-10 overflow-hidden">
      {/* Accessible SVG layer: invisible but exposes <title>/<desc> to AT. */}
      <svg
        role="img"
        aria-labelledby={`${titleId} ${descId}`}
        width="1"
        height="1"
        className="absolute h-px w-px overflow-hidden opacity-0"
        focusable="false"
      >
        <title id={titleId}>{`Living world — ${state}`}</title>
        <desc id={descId}>{SCENE_DESCRIPTIONS[state]}</desc>
      </svg>
      <Scene visible={state === "pristine"} kind="pristine" tx={tx} />
      <Scene visible={state === "moderate" || state === "strained"} kind="moderate" tx={tx} />
      <Scene visible={state === "critical"} kind="critical" tx={tx} />
    </div>
  );
}

function Scene({
  visible,
  kind,
  tx,
}: {
  visible: boolean;
  kind: "pristine" | "moderate" | "critical";
  tx: (d: number) => { transform: string };
}) {
  const palettes = {
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
    },
  } as const;
  const p = palettes[kind];

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

      {/* Smoke / pollen */}
      {kind === "critical" && <Smoke />}
      {kind === "pristine" && <Pollen />}
    </div>
  );
}

function treeCount(kind: "pristine" | "moderate" | "critical"): Array<"tree" | "stump" | "small"> {
  if (kind === "pristine") return ["tree", "tree", "small", "tree", "tree"];
  if (kind === "moderate") return ["tree", "stump", "small", "tree", "stump"];
  return ["stump", "stump", "stump", "stump", "stump"];
}

function TreeOrStump({
  variant,
  trunk,
  leaf,
}: {
  variant: "tree" | "stump" | "small";
  trunk: string;
  leaf: string;
}) {
  if (variant === "stump") {
    return (
      <svg width="60" height="40" viewBox="0 0 60 40">
        <rect x="22" y="20" width="16" height="18" fill={trunk} rx="2" />
        <ellipse cx="30" cy="20" rx="10" ry="3" fill="#7A5A3A" />
      </svg>
    );
  }
  const scale = variant === "small" ? 0.7 : 1;
  return (
    <svg width={80 * scale} height={140 * scale} viewBox="0 0 80 140">
      <rect x="34" y="80" width="12" height="60" fill={trunk} rx="2" />
      <circle cx="40" cy="60" r="34" fill={leaf} />
      <circle cx="22" cy="74" r="22" fill={leaf} opacity={0.9} />
      <circle cx="58" cy="74" r="22" fill={leaf} opacity={0.9} />
    </svg>
  );
}

function Smoke() {
  return (
    <>
      <style>{`
        @keyframes eco-smoke {
          0% { transform: translate(0,0) scale(1); opacity: 0; }
          20% { opacity: 0.55; }
          100% { transform: translate(60px,-260px) scale(2.2); opacity: 0; }
        }
      `}</style>
      {[0, 1, 2, 3, 4].map((i) => (
        <div
          key={i}
          className="absolute rounded-full"
          style={{
            left: `${15 + i * 18}%`,
            bottom: "18%",
            width: 80,
            height: 80,
            background: "radial-gradient(circle, rgba(60,40,30,0.7), rgba(60,40,30,0))",
            animation: `eco-smoke ${6 + i}s ease-out ${i * 0.8}s infinite`,
          }}
        />
      ))}
    </>
  );
}

function Pollen() {
  return (
    <>
      <style>{`
        @keyframes eco-pollen {
          0% { transform: translateY(0) translateX(0); opacity: 0; }
          20% { opacity: 0.8; }
          100% { transform: translateY(-120vh) translateX(40px); opacity: 0; }
        }
      `}</style>
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-[#FFF6C8]"
          style={{
            left: `${(i * 8.3) % 100}%`,
            bottom: "-5%",
            width: 6,
            height: 6,
            boxShadow: "0 0 10px rgba(255,246,200,0.8)",
            animation: `eco-pollen ${12 + (i % 5) * 3}s linear ${i * 1.2}s infinite`,
          }}
        />
      ))}
    </>
  );
}