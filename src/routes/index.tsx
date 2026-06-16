import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { LivingWorld } from "@/components/eco/LivingWorld";
import { WorldMeter } from "@/components/eco/WorldMeter";
import { ActionLog } from "@/components/eco/ActionLog";
import { Leaderboard } from "@/components/eco/Leaderboard";
import { Dock, type View } from "@/components/eco/Dock";
import { useEcoState } from "@/lib/eco/storage";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "EcoAscent — Watch your world react" },
      {
        name: "description",
        content:
          "A gamified carbon footprint tracker where your daily choices reshape a living world.",
      },
      { property: "og:title", content: "EcoAscent" },
      {
        property: "og:description",
        content: "Log your day. Watch your world breathe — or struggle.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  const [view, setView] = useState<View>("world");
  const { actions, addAction, removeAction, totalCO2 } = useEcoState();

  return (
    <main className="relative min-h-screen text-white">
      <LivingWorld totalCO2={totalCO2} />

      {view === "world" && (
        <div className="px-4 pt-6">
          <div className="mx-auto w-[min(92vw,560px)] text-center">
            <div className="inline-block rounded-full border border-white/15 bg-black/30 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-white/70 backdrop-blur-md">
              EcoAscent
            </div>
          </div>
          <WorldMeter totalCO2={totalCO2} count={actions.length} />
        </div>
      )}

      {view === "log" && (
        <ActionLog actions={actions} onAdd={addAction} onRemove={removeAction} />
      )}

      {view === "board" && <Leaderboard totalCO2={totalCO2} />}

      <Dock view={view} onChange={setView} />
    </main>
  );
}
