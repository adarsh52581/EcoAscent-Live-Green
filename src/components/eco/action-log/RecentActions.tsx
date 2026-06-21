import { Trash2 } from "lucide-react";
import { CATEGORY_META } from "@/lib/eco/actions";
import type * as React from "react";
import { formatRelative, type Action } from "@/lib/eco/storage";

type Props = {
  actions: Action[];
  onRemove: (id: string) => void;
};

/** Most-recent logged actions, with a per-row remove button. */
export function RecentActions({ actions, onRemove }: Props): React.ReactElement {
  return (
    <section className="rounded-3xl border border-white/10 bg-black/40 p-5 text-white backdrop-blur-md">
      <div className="flex items-baseline justify-between">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-white/70">
          Recent actions
        </h3>
        <span className="text-xs text-white/80">{actions.length} total</span>
      </div>
      {actions.length === 0 ? (
        <p className="mt-4 text-sm text-white/80">
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
                  <div className="text-[11px] uppercase tracking-wider text-white/75">
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
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-white/60"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}