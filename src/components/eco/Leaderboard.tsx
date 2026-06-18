import { memo } from "react";
import { Trophy } from "lucide-react";

type Props = { totalCO2: number };

const GROUPS = [
  { name: "Maple Hostel", score: 12 },
  { name: "Oak Tower", score: 34 },
  { name: "Cedar Hall", score: 56 },
  { name: "Birch Court", score: 78 },
  { name: "Pine Lodge", score: 102 },
];

function LeaderboardImpl({ totalCO2 }: Props) {
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

      <table className="w-full border-separate border-spacing-y-2 text-white">
        <caption className="sr-only">
          Neighborhood leaderboard sorted by lowest CO₂ footprint first.
        </caption>
        <thead className="sr-only">
          <tr>
            <th scope="col">Rank</th>
            <th scope="col">House</th>
            <th scope="col">CO₂ in kilograms</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr
              key={r.name}
              data-testid="leaderboard-row"
              className={`backdrop-blur-md ${
                r.you
                  ? "bg-[#0F1A14] ring-1 ring-[#7CE0A8]/50 shadow-[0_0_16px_rgba(124,224,168,0.12)]"
                  : "bg-black/40"
              }`}
            >
              <td className="w-12 rounded-l-2xl border-y border-l border-white/10 p-4 text-center text-sm font-semibold tabular-nums text-white/70">
                #{i + 1}
              </td>
              <td className="border-y border-white/10 p-4">
                <div className="flex items-center gap-2">
                  <span className="text-base font-medium">{r.name}</span>
                  {r.you && (
                    <span className="rounded-full bg-[#7CE0A8] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#0F1A24]">
                      You
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-white/40">
                  {i === 0
                    ? "Leading the pack"
                    : i === rows.length - 1
                      ? "Heaviest footprint"
                      : "Mid-pack"}
                </div>
              </td>
              <td className="rounded-r-2xl border-y border-r border-white/10 p-4 text-right">
                <div className="text-lg font-semibold tabular-nums">
                  {r.score.toFixed(1)}
                </div>
                <div className="text-[10px] uppercase tracking-wider text-white/40">
                  kg CO₂
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export const Leaderboard = memo(LeaderboardImpl);