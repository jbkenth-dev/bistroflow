"use client";

export function CategoryNav({ 
  active, 
  onSelect,
  categories = [] 
}: { 
  active?: string; 
  onSelect: (c?: string) => void;
  categories?: { id: number; name: string }[] 
}) {
  return (
    <div className="sticky top-16 z-30">
      <div className="glass rounded-2xl p-2 flex gap-2 overflow-x-auto whitespace-nowrap scroll-px-4 snap-x">
        <button
          onClick={() => onSelect(undefined)}
          className={`px-4 py-2.5 rounded-xl snap-start ${!active ? "bg-primary text-primary-foreground shadow" : "glass"}`}
        >
          All
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => onSelect(c.name)}
            className={`px-4 py-2.5 rounded-xl snap-start ${active === c.name ? "bg-primary text-primary-foreground shadow" : "glass"}`}
          >
            {c.name}
          </button>
        ))}
      </div>
    </div>
  );
}
