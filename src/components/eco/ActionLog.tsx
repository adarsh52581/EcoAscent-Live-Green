import { useId, useState } from "react";
import { Trash2, Plus } from "lucide-react";
import { CATEGORY_META, PRESETS, type Category } from "@/lib/eco/actions";
import { formatRelative, type Action } from "@/lib/eco/storage";

type Props = {
  actions: Action[];
  onAdd: (a: Omit<Action, "id" | "loggedAt">) => void;
  onRemove: (id: string) => void;
};

export function ActionLog({ actions, onAdd, onRemove }: Props) {
  const [cat, setCat] = useState<Category>("transit");
  const [selected, setSelected] = useState<string | null>(null);
  const [custom, setCustom] = useState("");
  const [error, setError] = useState<string | null>(null);
  const noteId = useId();
  const errorId = useId();

  const presets = PRESETS.filter((p) => p.category === cat);

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

        {/* Category tabs */}
        <div className="mt-5 flex gap-2 rounded-full bg-white/5 p-1">
          {(Object.keys(CATEGORY_META) as Category[]).map((c) => (
            <button
              key={c}
              onClick={() => {
                setCat(c);
                setSelected(null);
              }}
              type="button"
              aria-pressed={cat === c}
              className={`flex-1 rounded-full px-3 py-2 text-xs font-medium transition ${
                cat === c
                  ? "bg-[#E8F4FF] text-[#0F1A24]"
                  : "text-white/70 hover:text-white"
              }`}
            >
              {CATEGORY_META[c].label}
            </button>
          ))}
        </div>
        <p className="mt-2 text-[11px] text-white/40">{CATEGORY_META[cat].tagline}</p>

        {/* Preset chips */}
        <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
          {presets.map((p) => {
            const Icon = p.icon;
            const active = selected === p.id;
            const positive = p.co2 >= 0;
            return (
              <button
                key={p.id}
                onClick={() => setSelected(p.id)}
                type="button"
                aria-pressed={active}
                className={`flex flex-col items-start gap-2 rounded-2xl border p-3 text-left transition ${
                  active
                    ? "border-[#7CE0A8] bg-[#7CE0A8]/10"
                    : "border-white/10 bg-white/[0.03] hover:bg-white/[0.07]"
                }`}
              >
                <Icon className="h-5 w-5 text-white" />
                <div className="text-sm font-medium text-white">{p.label}</div>
                <div
                  className={`text-xs ${positive ? "text-[#F2A07B]" : "text-[#7CE0A8]"}`}
                >
                  {positive ? "+" : ""}
                  {p.co2} kg CO₂
                </div>
              </button>
            );
          })}
        </div>

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

      {/* Recent */}
      <section className="rounded-3xl border border-white/10 bg-black/40 p-5 text-white backdrop-blur-md">
        <div className="flex items-baseline justify-between">
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white/70">
            Recent actions
          </h3>
          <span className="text-xs text-white/40">{actions.length} total</span>
        </div>
        {actions.length === 0 ? (
          <p className="mt-4 text-sm text-white/50">
            Nothing logged yet. Your world is waiting for its first story.
          </p>
        ) : (
          <ul className="mt-3 divide-y divide-white/5">
            {actions.slice(0, 10).map((a) => {
              const positive = a.co2 >= 0;
              return (
                <li key={a.id} className="flex items-center gap-3 py-3">
                  <div className="flex-1">
                    <div className="text-sm font-medium">{a.label}</div>
                    <div className="text-[11px] uppercase tracking-wider text-white/40">
                      {CATEGORY_META[a.category].label} · {formatRelative(a.loggedAt)}
                    </div>
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                      positive
                        ? "bg-[#F2705B]/15 text-[#F2A07B]"
                        : "bg-[#7CE0A8]/15 text-[#7CE0A8]"
                    }`}
                  >
                    {positive ? "+" : ""}
                    {a.co2} kg
                  </span>
                  <button
                    onClick={() => onRemove(a.id)}
                    aria-label="Remove action"
                    className="rounded-full p-2 text-white/40 transition hover:bg-white/5 hover:text-white"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}