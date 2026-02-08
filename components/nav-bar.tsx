"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { IconMenu, IconCart, IconClose, IconList, IconUsers, IconPlus, IconKey } from "@/components/ui/icons";
import { motion, LayoutGroup, AnimatePresence } from "framer-motion";
import { useCart } from "@/store/cart";
import { btnPrimary, btnSecondary } from "@/components/ui/button-classes";

export function NavBar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { items } = useCart();
  const itemCount = items.reduce((sum, i) => sum + i.qty, 0);
  const links = [
    { href: "/menu", label: "Menu" },
    { href: "/about", label: "About" }
  ];
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 16);
    handler();
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <header className="fixed top-0 left-0 right-0 z-50" role="banner">
      <motion.div
        initial={{ y: -16, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 500, damping: 40 }}
        className="px-0 py-0"
      >
        <div className={`px-4 py-3 flex items-center justify-between transition-[box-shadow,background-color] bg-white border border-black/5 ${scrolled ? "shadow-md" : "shadow-sm"}`}>
          <Link href="/" className="flex items-center gap-2">
            <span className="font-display text-xl font-semibold">
              <span className="text-primary">BISTRO</span>
              <span>FLOW</span>
            </span>
          </Link>
          <nav className="hidden md:flex gap-2 relative">
            <LayoutGroup>
              {links.map((l) => {
                const active = pathname === l.href;
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    aria-current={active ? "page" : undefined}
                    className={`relative px-3 py-2 rounded-xl text-sm`}
                  >
                    {active && (
                      <motion.span
                        layoutId="navActiveBg"
                        className="absolute inset-0 rounded-xl bg-accent"
                        transition={{ type: "spring", stiffness: 500, damping: 40 }}
                        style={{ zIndex: 0 }}
                      />
                    )}
                    <span className={`relative z-10 ${active ? "text-accent-foreground" : "opacity-90"}`}>
                      {l.label}
                    </span>
                    {active && (
                      <motion.span
                        layoutId="navActiveUnderline"
                        className="absolute left-2 right-2 bottom-1 h-0.5 rounded-full bg-gradient-to-r from-primary to-orange-500"
                        transition={{ type: "spring", stiffness: 600, damping: 35 }}
                      />
                    )}
                  </Link>
                );
              })}
            </LayoutGroup>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login" className={`hidden md:inline-flex ${btnSecondary} text-sm`}>
              Log In
            </Link>
            <Link href="/signup" className={`hidden md:inline-flex ${btnPrimary} text-sm`}>
              Sign Up
            </Link>
            {/* Cart link removed per request; rely on floating FAB for cart */}
            <button
              className="md:hidden rounded-xl px-3 py-2"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-label="Toggle navigation"
            >
              <IconMenu className="h-5 w-5" />
            </button>
          </div>
        </div>
      </motion.div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] md:hidden"
          >
            <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
            <motion.aside
              initial={{ x: 400 }}
              animate={{ x: 0 }}
              exit={{ x: 400 }}
              transition={{ type: "spring", stiffness: 500, damping: 40 }}
              className="absolute right-0 top-0 h-full w-[75vw] bg-white rounded-l-2xl px-5 py-5 shadow-xl ring-1 ring-black/10 flex flex-col gap-3"
              role="dialog"
              aria-modal="true"
              aria-label="Navigation"
            >
              <div className="flex items-center justify-between">
                <Link href="/" className="inline-flex items-center gap-2">
                  <span className="font-display text-lg font-semibold">
                    <span className="text-primary">BISTRO</span>
                    <span>FLOW</span>
                  </span>
                </Link>
                <button aria-label="Close menu" className="rounded-xl p-2" onClick={() => setOpen(false)}>
                  <IconClose className="h-5 w-5" />
                </button>
              </div>
              <div className="flex flex-col gap-2">
                {links.map((l) => {
                  const active = pathname === l.href;
                  return (
                    <Link
                      key={l.href}
                      href={l.href}
                      aria-current={active ? "page" : undefined}
                      className={`px-3 py-2 rounded-xl flex items-center justify-between ${active ? "bg-accent text-accent-foreground" : "hover:bg-accent/50"}`}
                      onClick={() => setOpen(false)}
                    >
                      <span className="inline-flex items-center gap-2">
                        {l.href === "/menu" && <IconList className="h-4 w-4" />}
                        {l.href === "/about" && <IconUsers className="h-4 w-4" />}
                        <span>{l.label}</span>
                      </span>
                      {active && <span className="ml-2 inline-block h-2 w-2 rounded-full bg-primary" />}
                    </Link>
                  );
                })}
              </div>
              <div className="mt-auto flex flex-col gap-2">
                <Link href="/login" className="w-full inline-flex px-3 py-3 rounded-xl glass text-sm justify-center items-center gap-2" onClick={() => setOpen(false)}>
                  <IconKey className="h-4 w-4" />
                  <span>Log In</span>
                </Link>
                <Link href="/signup" className="w-full inline-flex px-3 py-3 rounded-xl bg-primary text-primary-foreground text-sm justify-center items-center gap-2" onClick={() => setOpen(false)}>
                  <IconPlus className="h-4 w-4" />
                  <span>Sign Up</span>
                </Link>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
