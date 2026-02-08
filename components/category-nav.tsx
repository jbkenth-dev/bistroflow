"use client";
import { categories } from "@/data/foods";

export function CategoryNav({ active, onSelect }: { active?: string; onSelect: (c: string) => void }) {
  return (
    <div className="sticky top-16 z-30">
      <div className="glass rounded-2xl p-2 flex gap-2 overflow-x-auto whitespace-nowrap scroll-px-4 snap-x">
        {categories.map((c) => (
          <button
            key={c.key}
            onClick={() => onSelect(c.key)}
            className={`px-4 py-2.5 rounded-xl snap-start ${active === c.key ? "bg-primary text-primary-foreground shadow" : "glass"}`}
          >
            {c.label}
          </button>
        ))}
      </div>
    </div>
  );
}
