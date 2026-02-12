export type Category =
  | "Burgers"
  | "Pizza"
  | "Pasta"
  | "Filipino"
  | "Drinks"
  | "Desserts";

export type FoodItem = {
  id: string;
  slug: string;
  name: string;
  category: Category;
  price: number;
  rating: number;
  calories: number;
  prepTime: number;
  tags: string[];
  image: string;
  description: string;
};

export const foods: FoodItem[] = (() => {
  const items: FoodItem[] = [];
  const cats: Category[] = ["Burgers", "Pizza", "Pasta", "Filipino", "Drinks", "Desserts"];
  let idCounter = 1;
  const totalItemsNeeded = 50;
  
  while (items.length < totalItemsNeeded) {
    const c = cats[Math.floor(Math.random() * cats.length)];
    const i = items.length;
    const name = `${c} ${i + 1}`;
    const slug = `${c.toLowerCase()}-${i + 1}`.replace(/\s+/g, "-");
    items.push({
      id: `f-${idCounter++}`,
      slug,
      name,
      category: c,
      price: parseFloat((50 + Math.random() * 70).toFixed(2)),
      rating: Math.round((4 + Math.random()) * 10) / 10,
      calories: Math.floor(250 + Math.random() * 600),
      prepTime: Math.floor(8 + Math.random() * 20),
      tags: ["popular", "chef", i % 2 ? "spicy" : "classic"],
      image: "/assets/test.jpg",
      description:
        "Artisanal preparation with premium ingredients. Served fresh with house-made sides."
    });
  }
  return items;
})();

export const categories: { key: Category; label: string }[] = [
  { key: "Burgers", label: "Burgers" },
  { key: "Pizza", label: "Pizza" },
  { key: "Pasta", label: "Pasta" },
  { key: "Filipino", label: "Filipino Cuisine" },
  { key: "Drinks", label: "Drinks" },
  { key: "Desserts", label: "Desserts" }
];
