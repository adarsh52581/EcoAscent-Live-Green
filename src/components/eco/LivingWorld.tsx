import type * as React from "react";
import { useEffect, useId, useRef, useState } from "react";
import { worldState, type WorldState } from "@/lib/eco/actions";
import { Scene } from "./living-world/Scene";

type Props = { totalCO2: number };

const SCENE_DESCRIPTIONS: Record<WorldState, string> = {
  pristine: "A lush green landscape with bright sun, healthy trees, and drifting pollen.",
  moderate: "A pale-skied landscape with thinning trees and a faded sun.",
  strained: "A dusty horizon with stumps replacing many trees and a heavy haze.",
  critical: "A scorched red sky over barren hills, only stumps remain, smoke billows upward.",
};

/**
 * Full-bleed animated scene that visually mirrors the user's cumulative CO₂.
 * Renders three scene variants (pristine / moderate+strained / critical) and
 * cross-fades between them. Includes an SR-only SVG with title/desc.
 */
export function LivingWorld({ totalCO2 }: Props): React.ReactElement {
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

  const rid = useId();
  const titleId = `${rid}-title`;
  const descId = `${rid}-desc`;
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
