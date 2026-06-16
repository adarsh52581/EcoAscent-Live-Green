import { Trophy } from "lucide-react";

type Props = { totalCO2: number };

const GROUPS = [
  { name: "Maple Hostel", score: 12 },
  { name: "Oak Tower", score: 34 },
  { name: "Cedar Hall", score: 56 },
  { name: "Birch Court", score: 78 },
  { name: "Pine Lodge", score: 102 },
];

export function Leaderboard({ totalCO2 }: Props) {
  const rows = [
    ...GROUPS.map((g) => ({ ...g, you: false })),
    { name: "Your House", score: Number(totalCO2.toFixed(1)), you: true },
  ].sort((a, b) => a.score - b.score);

  return (
    <div className="mx-auto w-[min(92vw,640px)] space-y-5 pb-32 pt-6">
      <header className="relative overflow-hidden rounded-3xl border border-white/10 bg-[#111111] p-6 text-white">
        <div className="absolute left-0 top-0 h-full w-1 bg-[#7CE0A8]" />
        <div className="flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-[#7CE0A8]">
          <Trophy className="h-3.5 w-3.5" /> Neighborhood standings
        </div>
        <h2 className="mt-2 text-3xl font-bold tracking-tight">Lowest footprint wins.</h2>
        <p className="mt-2 text-sm font-medium text-white/90">
          Your score updates the moment you log an action.
        </p>
      </header>

      <ol className="space-y-2">
        {rows.map((r, i) => (
          <li
            key={r.name}
            className={`flex items-center gap-4 rounded-2xl border p-4 backdrop-blur-md transition ${
              r.you
                ? "border-[#7CE0A8] bg-[#0F1A14] text-white ring-1 ring-[#7CE0A8]/50 shadow-[0_0_16px_rgba(124,224,168,0.12)]"
                : "border-white/10 bg-black/40 text-white"
            }`}
          >
            <div className="w-7 text-center text-sm font-semibold tabular-nums text-white/70">
              #{i + 1}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-base font-medium">{r.name}</span>
                {r.you && (
                  <span className="rounded-full bg-[#7CE0A8] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#0F1A24]">
                    You
                  </span>
                )}
              </div>
              <div className="text-[11px] text-white/40">
                {i === 0 ? "Leading the pack" : i === rows.length - 1 ? "Heaviest footprint" : "Mid-pack"}
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-semibold tabular-nums">{r.score.toFixed(1)}</div>
              <div className="text-[10px] uppercase tracking-wider text-white/40">
                kg CO₂
              </div>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}