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
  const [uiLoading, setUiLoading] = useState(false);
  useEffect(() => {
    // Optimization: Skip fake loading on production or if not needed
    // const t = setTimeout(() => setUiLoading(false), 600);
    // return () => clearTimeout(t);
  }, []);

  const filtered = foods.filter((f) => {
    const byCategory = category ? f.category === category : true;
    const byQ = filter.q ? f.name.toLowerCase().includes(filter.q.toLowerCase()) : true;
    const byRating = f.rating >= filter.minRating;
    const byPrice = filter.maxPrice ? f.price <= filter.maxPrice : true;
    const byTags = filter.tags.length ? filter.tags.every((t) => f.tags.includes(t)) : true;
    return byCategory && byQ && byRating && byPrice && byTags;
  });

  return (
    <div className="relative">
      {/* Page Background Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-gradient-to-b from-primary/5 to-transparent pointer-events-none -z-10" />
      <div className="absolute top-20 left-0 w-64 h-64 bg-orange-500/5 blur-[100px] rounded-full pointer-events-none -z-10 animate-pulse" />
      <div className="absolute top-40 right-0 w-72 h-72 bg-primary/5 blur-[120px] rounded-full pointer-events-none -z-10 animate-pulse" style={{ animationDelay: '1s' }} />

      <div className="relative z-40 mb-6 md:mb-10">
        <CategoryNav active={category} onSelect={(c) => { setCategory(c); setFilter({ ...filter, category: c }); }} />
      </div>

      <motion.div
        className="mb-8 md:mb-12 sticky top-20 z-30 max-w-2xl mx-auto px-4 md:px-0"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <motion.div
          className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-1.5 md:p-2 flex items-center gap-2 border border-white/20 shadow-2xl"
          animate={searchFocused ? {
            boxShadow: "0 0 0 6px rgba(255, 122, 0, 0.1), 0 20px 40px -10px rgba(0,0,0,0.1)",
            scale: 1.02,
            borderColor: "rgba(255, 122, 0, 0.3)"
          } : {
            boxShadow: "0 10px 30px -5px rgba(0,0,0,0.08)",
            scale: 1,
            borderColor: "rgba(0,0,0,0.05)"
          }}
        >
          <div className={`p-2.5 md:p-3 rounded-2xl transition-colors duration-300 ${searchFocused ? "bg-primary text-white" : "bg-gray-100 text-gray-400"}`}>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-4 h-4 md:w-5 md:h-5">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" strokeLinecap="round" />
            </svg>
          </div>
          <input
            type="text"
            placeholder="Search food..."
            className="flex-1 bg-transparent border-none outline-none text-gray-900 placeholder:text-gray-400 font-medium text-base md:text-lg px-1 md:px-2"
            value={filter.q}
            onChange={(e) => setFilter({ ...filter, q: e.target.value })}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
          {filter.q && (
            <motion.button
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setFilter({ ...filter, q: "" })}
              aria-label="Clear search"
              className="bg-white/10 hover:bg-white/20 rounded-2xl p-2.5 mr-1 transition-colors"
              title="Clear"
            >
              <IconClose className="h-4 w-4" />
            </motion.button>
          )}
        </motion.div>

        {filter.q && (
          <motion.p
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mt-4 text-sm font-medium text-primary/80"
          >
            Found {filtered.length} {filtered.length === 1 ? 'delicacy' : 'delicacies'} for "{filter.q}"
          </motion.p>
        )}
      </motion.div>

      {uiLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 md:gap-8">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="glass rounded-3xl overflow-hidden border border-white/10">
              <div className="aspect-[4/3] skeleton" />
              <div className="p-6 space-y-4">
                <div className="h-6 w-3/4 rounded-lg skeleton" />
                <div className="space-y-2">
                  <div className="h-4 w-full rounded-md skeleton" />
                  <div className="h-4 w-5/6 rounded-md skeleton" />
                </div>
                <div className="flex justify-between items-center pt-2">
                  <div className="h-8 w-20 rounded-xl skeleton" />
                  <div className="h-10 w-28 rounded-xl skeleton" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <>
          <AnimatePresence mode="wait">
            <motion.div
              key={`${category}-${filter.q}`}
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.05 }
                },
                exit: { opacity: 0, transition: { duration: 0.2 } }
            }}
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-3 md:gap-8 px-2 md:px-0"
          >
            {filtered.map((item) => (
                <motion.div
                  key={item.slug}
                  variants={{
                    hidden: { opacity: 0, y: 20, scale: 0.95 },
                    visible: { opacity: 1, y: 0, scale: 1 }
                  }}
                  transition={{ type: "spring", stiffness: 260, damping: 20 }}
                >
                  <ProductCard item={item} />
                </motion.div>
              ))}
              {filtered.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="col-span-full py-20 text-center"
                >
                  <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-6 text-primary">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-10 h-10">
                      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold mb-2">No delicacies found</h3>
                  <p className="opacity-60 max-w-md mx-auto">
                    We couldn't find any items matching your search. Try adjusting your filters or browsing our categories.
                  </p>
                  <button
                    onClick={() => { setCategory(undefined); setFilter({ ...filter, q: "", category: undefined }); }}
                    className="mt-8 px-8 py-3 bg-primary text-white rounded-2xl font-semibold shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
                  >
                    View Full Menu
                  </button>
                </motion.div>
              )}
            </motion.div>
          </AnimatePresence>
        </>
      )}
    </div>
  );
}
