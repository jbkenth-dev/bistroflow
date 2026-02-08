import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Menu – Bistroflow",
  description: "Full Menu Marketplace"
};

export default function MenuLayout({ children }: { children: React.ReactNode }) {
  return children;
}
