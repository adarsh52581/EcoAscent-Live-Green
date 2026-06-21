import type { Preset } from "@/lib/eco/actions";

type Props = {
  presets: Preset[];
  selectedId: string | null;
  onSelect: (id: string) => void;
};

/** Grid of selectable preset action chips for the active category. */
export function PresetGrid({ presets, selectedId, onSelect }: Props) {
  return (
    <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
      {presets.map((p) => {
        const Icon = p.icon;
        const active = selectedId === p.id;
        const positive = p.co2 >= 0;
        return (
          <button
            key={p.id}
            onClick={() => onSelect(p.id)}
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
            <div className={`text-xs ${positive ? "text-[#F2A07B]" : "text-[#7CE0A8]"}`}>
              {positive ? "+" : ""}
              {p.co2} kg CO₂
            </div>
          </button>
        );
      })}
    </div>
  );
}
