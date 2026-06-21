import { CATEGORY_META, type Category } from "@/lib/eco/actions";

type Props = {
  value: Category;
  onChange: (c: Category) => void;
};

/** Segmented control for switching between action categories. */
export function CategoryTabs({ value, onChange }: Props) {
  return (
    <>
      <div className="mt-5 flex gap-2 rounded-full bg-white/5 p-1">
        {(Object.keys(CATEGORY_META) as Category[]).map((c) => (
          <button
            key={c}
            onClick={() => onChange(c)}
            type="button"
            aria-pressed={value === c}
            className={`flex-1 rounded-full px-3 py-2 text-xs font-medium transition ${
              value === c ? "bg-[#E8F4FF] text-[#0F1A24]" : "text-white/70 hover:text-white"
            }`}
          >
            {CATEGORY_META[c].label}
          </button>
        ))}
      </div>
      <p className="mt-2 text-[11px] text-white/40">{CATEGORY_META[value].tagline}</p>
    </>
  );
}
