import { useId, useMemo, useState } from "react";
import { Plus } from "lucide-react";
import { PRESETS, type Category } from "@/lib/eco/actions";
import type { Action } from "@/lib/eco/storage";
import { CategoryTabs } from "./action-log/CategoryTabs";
import { PresetGrid } from "./action-log/PresetGrid";
import { RecentActions } from "./action-log/RecentActions";

type Props = {
  actions: Action[];
  onAdd: (a: Omit<Action, "id" | "loggedAt">) => void;
  onRemove: (id: string) => void;
};

/**
 * Action logging surface: lets the user pick a category, choose a preset,
 * optionally add a short note, and submit. Also renders recent actions.
 */
export function ActionLog({ actions, onAdd, onRemove }: Props) {
  const [cat, setCat] = useState<Category>("transit");
  const [selected, setSelected] = useState<string | null>(null);
  const [custom, setCustom] = useState("");
  const [error, setError] = useState<string | null>(null);
  const noteId = useId();
  const errorId = useId();

  const presets = useMemo(() => PRESETS.filter((p) => p.category === cat), [cat]);

  function submit() {
    setError(null);
    const preset = presets.find((p) => p.id === selected);
    if (!preset) {
      setError("Pick an action to log.");
      return;
    }
    const label = custom.trim() || preset.label;
    if (label.length === 0) {
      setError("Add a short label.");
      return;
    }
    if (label.length > 60) {
      setError("Keep the label under 60 characters.");
      return;
    }
    onAdd({ category: preset.category, label, co2: preset.co2 });
    setSelected(null);
    setCustom("");
  }

  return (
    <div className="mx-auto w-[min(92vw,640px)] space-y-5 pb-32 pt-6">
      <header className="rounded-3xl border border-white/10 bg-black/40 p-6 text-white backdrop-blur-md">
        <div className="text-[11px] uppercase tracking-[0.18em] text-white/60">
          Log an action
        </div>
        <h2 className="mt-1 text-2xl font-semibold">What did your day look like?</h2>
        <p className="mt-1 text-sm text-white/60">
          Small honest steps shape a world you can be proud of.
        </p>

        <CategoryTabs
          value={cat}
          onChange={(c) => {
            setCat(c);
            setSelected(null);
          }}
        />
        <PresetGrid presets={presets} selectedId={selected} onSelect={setSelected} />

        {/* Custom label */}
        <div className="mt-4">
          <label
            htmlFor={noteId}
            className="text-[11px] uppercase tracking-wider text-white/50"
          >
            Custom note (optional)
          </label>
          <input
            id={noteId}
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            maxLength={80}
            placeholder="e.g. Drove to grandma's"
            aria-describedby={error ? errorId : undefined}
            className="mt-1 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-white outline-none placeholder:text-white/30 focus:border-white/30"
          />
        </div>

        {error && (
          <div
            id={errorId}
            role="alert"
            className="mt-3 rounded-lg border border-[#F2705B]/40 bg-[#F2705B]/10 px-3 py-2 text-xs text-[#FFD4C8]"
          >
            {error}
          </div>
        )}

        <button
          onClick={submit}
          type="button"
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#E8F4FF] px-5 py-3 text-sm font-semibold text-[#0F1A24] transition hover:bg-white"
        >
          <Plus className="h-4 w-4" /> Log this action
        </button>
      </header>

      <RecentActions actions={actions} onRemove={onRemove} />
    </div>
  );
}