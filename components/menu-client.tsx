"use client";
import { ProductCard } from "@/components/product-card";
import { CategoryNav } from "@/components/category-nav";
import { type FilterState } from "@/components/search-filter";
import { foods } from "@/data/foods";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IconClose } from "@/components/ui/icons";
import { TypewriterH1 } from "@/components/ui/typewriter";

export function MenuClient() {
  const [category, setCategory] = useState<string | undefined>();
  const [filter, setFilter] = useState<FilterState>({
    q: "",
    minRating: 0,
    maxPrice: undefined,
    category,
    tags: []
  });
  const [searchFocused, setSearchFocused] = useState(false);
  const [uiLoading, setUiLoading] = useState(true);
  const [itemsPerPage, setItemsPerPage] = useState(6); // default mobile 3 rows * 2 cols
  const [maxButtons, setMaxButtons] = useState(3); // mobile/tablet: 3, desktop: 5
  const [page, setPage] = useState(1);
  useEffect(() => {
    const t = setTimeout(() => setUiLoading(false), 600);
    return () => clearTimeout(t);
  }, []);
  useEffect(() => {
    const mqLg = window.matchMedia("(min-width: 1024px)");
    const mqMd = window.matchMedia("(min-width: 768px)");
    const calc = () => {
      if (mqLg.matches) {
        setItemsPerPage(5 * 5);
        setMaxButtons(5);
      } else if (mqMd.matches) {
        setItemsPerPage(2 * 2);
        setMaxButtons(3);
      } else {
        setItemsPerPage(2 * 1);
        setMaxButtons(3);
      }
    };
    calc();
    const onLgChange = () => calc();
    const onMdChange = () => calc();
    mqLg.addEventListener("change", onLgChange);
    mqMd.addEventListener("change", onMdChange);
    return () => {
      mqLg.removeEventListener("change", onLgChange);
      mqMd.removeEventListener("change", onMdChange);
    };
  }, []);

  const filtered = foods.filter((f) => {
    const byCategory = category ? f.category === category : true;
    const byQ = filter.q ? f.name.toLowerCase().includes(filter.q.toLowerCase()) : true;
    const byRating = f.rating >= filter.minRating;
    const byPrice = filter.maxPrice ? f.price <= filter.maxPrice : true;
    const byTags = filter.tags.length ? filter.tags.every((t) => f.tags.includes(t)) : true;
    return byCategory && byQ && byRating && byPrice && byTags;
  });
  useEffect(() => {
    setPage(1);
  }, [category, filter.q, filter.minRating, filter.maxPrice, filter.tags]);
  const totalPages = useMemo(() => Math.max(1, Math.ceil(filtered.length / itemsPerPage)), [filtered.length, itemsPerPage]);
  const start = (page - 1) * itemsPerPage;
  const pageItems = filtered.slice(start, start + itemsPerPage);
  const fillerCount = Math.max(0, itemsPerPage - pageItems.length);
  const visiblePages = useMemo(() => {
    const count = Math.min(maxButtons, totalPages);
    const half = Math.floor(count / 2);
    let startPage = Math.max(1, page - half);
    if (startPage + count - 1 > totalPages) {
      startPage = Math.max(1, totalPages - count + 1);
    }
    return Array.from({ length: count }, (_, i) => startPage + i);
  }, [page, totalPages, maxButtons]);

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <TypewriterH1 text="Explore Menu" glow className="font-display text-3xl font-bold" />
        <p className="mt-2 opacity-80 text-sm">Browse categories and quickly find your favorites.</p>
      </motion.div>
      <CategoryNav active={category} onSelect={(c) => { setCategory(c); setFilter({ ...filter, category: c }); }} />
      <motion.div
        className="mt-4 sticky top-16 z-30"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <motion.div
          className="glass rounded-2xl p-2 md:p-3 flex items-center gap-2 border border-white/10"
          animate={searchFocused ? { boxShadow: "0 0 0 6px rgba(255, 122, 0, 0.15)", scale: 1.01 } : { boxShadow: "0 0 0 0 rgba(0,0,0,0)", scale: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 24 }}
        >
          <input
            type="text"
            placeholder="Search food..."
            value={filter.q}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            onChange={(e) => setFilter({ ...filter, q: e.target.value })}
            className="w-full bg-transparent outline-none px-2 py-2 md:px-3 md:py-2 rounded-xl"
            aria-label="Search dishes"
          />
          {filter.q && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilter({ ...filter, q: "" })}
              aria-label="Clear search"
              className="glass rounded-xl p-2"
              title="Clear"
            >
              <IconClose className="h-4 w-4" />
            </motion.button>
          )}
        </motion.div>
      </motion.div>
      {uiLoading ? (
        <div className="mt-6 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i}>
              <div className="glass rounded-2xl overflow-hidden">
                <div className="relative aspect-[4/3]">
                  <div className="absolute inset-0 skeleton" />
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-2">
                      <div className="h-4 w-32 rounded skeleton" />
                      <div className="h-3 w-40 rounded skeleton" />
                      <div className="mt-2 flex gap-2">
                        <div className="h-5 w-14 rounded skeleton" />
                        <div className="h-5 w-12 rounded skeleton" />
                        <div className="h-5 w-12 rounded skeleton" />
                      </div>
                    </div>
                    <div className="h-5 w-12 rounded skeleton" />
                  </div>
                  <div className="mt-3 h-9 w-full rounded-xl skeleton" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <AnimatePresence mode="wait">
            <motion.div
              key={`${page}-${itemsPerPage}`}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ type: "spring", stiffness: 280, damping: 30 }}
              className="mt-6 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-5 gap-4"
            >
              {pageItems.map((item) => (
                <div key={item.slug}>
                  <ProductCard item={item} />
                </div>
              ))}
              {Array.from({ length: fillerCount }).map((_, i) => (
                <div key={`filler-${i}`} className="opacity-0 pointer-events-none select-none">
                  <div className="glass rounded-2xl overflow-hidden">
                    <div className="relative aspect-[4/3]" />
                    <div className="p-4" />
                  </div>
                </div>
              ))}
            </motion.div>
          </AnimatePresence>
          <div className="mt-8 flex items-center justify-center gap-2">
            <button
              className="glass rounded-xl px-3 py-2 text-sm disabled:opacity-50"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              ‹ Prev
            </button>
            <div className="flex items-center gap-1">
              {visiblePages.map((n) => {
                const active = n === page;
                return (
                  <button
                    key={n}
                    aria-current={active ? "page" : undefined}
                    onClick={() => setPage(n)}
                    className={`relative px-3 py-2 rounded-xl text-sm ${active ? "bg-accent text-accent-foreground shadow" : "glass hover:bg-accent/40"}`}
                  >
                    {n}
                  </button>
                );
              })}
            </div>
            <button
              className="glass rounded-xl px-3 py-2 text-sm disabled:opacity-50"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next ›
            </button>
          </div>
        </>
      )}
    </>
  );
}
