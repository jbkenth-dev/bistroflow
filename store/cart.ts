import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import type { FoodItem } from "@/data/foods";

type CartItem = {
  item: FoodItem;
  qty: number;
};

type CartState = {
  items: CartItem[];
  add: (item: FoodItem) => void;
  remove: (slug: string) => void;
  inc: (slug: string) => void;
  dec: (slug: string) => void;
  total: () => number;
};

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      add: (item) =>
        set((s) => {
          const existing = s.items.find((i) => i.item.slug === item.slug);
          if (existing) {
            return {
              items: s.items.map((i) =>
                i.item.slug === item.slug ? { ...i, qty: i.qty + 1 } : i
              )
            };
          }
          return { items: [...s.items, { item, qty: 1 }] };
        }),
      remove: (slug) => set((s) => ({ items: s.items.filter((i) => i.item.slug !== slug) })),
      inc: (slug) =>
        set((s) => ({
          items: s.items.map((i) => (i.item.slug === slug ? { ...i, qty: i.qty + 1 } : i))
        })),
      dec: (slug) =>
        set((s) => ({
          items: s.items
            .map((i) => (i.item.slug === slug ? { ...i, qty: Math.max(0, i.qty - 1) } : i))
            .filter((i) => i.qty > 0)
        })),
      total: () => get().items.reduce((sum, i) => sum + i.item.price * i.qty, 0)
    }),
    {
      name: "bistroflow-cart",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items })
    }
  )
);
