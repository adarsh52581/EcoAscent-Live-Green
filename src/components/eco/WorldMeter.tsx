import { memo } from "react";
import { worldState, worldHeadline } from "@/lib/eco/actions";

type Props = { totalCO2: number; count: number };

function WorldMeterImpl({ totalCO2, count }: Props) {
  const state = worldState(totalCO2);
  const health = Math.max(0, Math.min(100, 100 - totalCO2));
  const headline = worldHeadline(state);
  const bar =
    state === "pristine"
      ? "#7CE0A8"
      : state === "moderate"
        ? "#F2C265"
        : state === "strained"
          ? "#F2945B"
          : "#F2705B";

  return (
    <div className="mx-auto mt-6 w-[min(92vw,560px)] rounded-3xl border border-white/10 bg-black/40 p-5 text-white backdrop-blur-md shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]">
      <div className="flex items-baseline justify-between gap-3">
        <div>
          <div className="text-[11px] uppercase tracking-[0.18em] text-white/60">
            World Health
          </div>
          <div className="mt-1 text-lg font-medium leading-tight">{headline}</div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-semibold tabular-nums">
            {totalCO2.toFixed(1)}
            <span className="ml-1 text-xs font-normal text-white/60">kg CO₂</span>
          </div>
          <div className="text-[11px] text-white/50">{count} actions logged</div>
        </div>
      </div>
      <div
        role="progressbar"
        aria-label="World health"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(health)}
        aria-valuetext={`${Math.round(health)}% — ${headline}`}
        className="mt-4 h-2 w-full overflow-hidden rounded-full bg-white/10"
      >
        <div
          className="h-full rounded-full transition-all duration-700"
          style={{ width: `${health}%`, background: bar }}
        />
      </div>
      <div className="mt-2 flex justify-between text-[10px] uppercase tracking-wider text-white/40">
        <span>Critical</span>
        <span>Strained</span>
        <span>Thriving</span>
      </div>
    </div>
  );
}

export const WorldMeter = memo(WorldMeterImpl);