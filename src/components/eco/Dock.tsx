import { Home, PlusCircle, Trophy } from "lucide-react";

export type View = "world" | "log" | "board";

type Props = { view: View; onChange: (v: View) => void };

const ITEMS: { id: View; label: string; Icon: typeof Home }[] = [
  { id: "world", label: "World", Icon: Home },
  { id: "log", label: "Log", Icon: PlusCircle },
  { id: "board", label: "Ranks", Icon: Trophy },
];

export function Dock({ view, onChange }: Props) {
  return (
    <nav
      aria-label="Primary"
      className="fixed bottom-5 left-1/2 z-50 -translate-x-1/2"
    >
      <div className="flex items-center gap-1 rounded-full border border-white/15 bg-black/40 p-1.5 backdrop-blur-md shadow-[0_10px_40px_-10px_rgba(0,0,0,0.6)]">
        {ITEMS.map(({ id, label, Icon }) => {
          const active = view === id;
          return (
            <button
              key={id}
              onClick={() => onChange(id)}
              className={`flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium transition ${
                active
                  ? "bg-[#E8F4FF] text-[#0F1A24]"
                  : "text-white/80 hover:text-white"
              }`}
              aria-current={active ? "page" : undefined}
            >
              <Icon className="h-4 w-4" />
              <span>{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}