"use client";
import { useState } from "react";

export type FilterState = {
  q: string;
  minRating: number;
  maxPrice?: number;
  category?: string;
  tags: string[];
};

export function SearchFilter({ value, onChange }: { value: FilterState; onChange: (v: FilterState) => void }) {
  const [local, setLocal] = useState<FilterState>(value);
  const update = (v: Partial<FilterState>) => {
    const next = { ...local, ...v };
    setLocal(next);
    onChange(next);
  };
  return (
    <div className="glass rounded-2xl p-4 grid md:grid-cols-4 gap-3">
      <input
        className="rounded-xl px-3 py-2 bg-transparent border border-white/10"
        placeholder="Search Food"
        value={local.q}
        onChange={(e) => update({ q: e.target.value })}
      />
      <div className="flex items-center gap-2">
        <label className="text-sm">Min rating</label>
        <input
          type="range"
          min={0}
          max={5}
          step={0.1}
          value={local.minRating}
          onChange={(e) => update({ minRating: Number(e.target.value) })}
        />
        <span className="text-sm">{local.minRating.toFixed(1)}</span>
      </div>
      <div className="flex items-center gap-2">
        <label className="text-sm">Max price</label>
        <input
          type="number"
          className="rounded-xl px-3 py-2 bg-transparent border border-white/10 w-24"
          value={local.maxPrice ?? ""}
          onChange={(e) => update({ maxPrice: e.target.value ? Number(e.target.value) : undefined })}
          placeholder="$"
        />
      </div>
      <div className="flex gap-2">
        {["spicy","classic","chef","popular"].map((t) => (
          <button
            key={t}
            onClick={() => {
              const tags = local.tags.includes(t) ? local.tags.filter((x) => x !== t) : [...local.tags, t];
              update({ tags });
            }}
            className={`px-3 py-2 rounded-xl ${local.tags.includes(t) ? "bg-primary text-primary-foreground" : "glass"}`}
          >
            {t}
          </button>
        ))}
      </div>
    </div>
  );
}
