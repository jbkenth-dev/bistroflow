"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { IconMenu, IconCart, IconClose, IconList, IconUsers, IconPlus, IconKey, IconUser, IconLogOut, IconGrid, IconBell, IconCheck } from "@/components/ui/icons";
import { motion, LayoutGroup, AnimatePresence } from "framer-motion";
import { useCart } from "@/store/cart";
import { useAuth } from "@/store/auth";
import { btnPrimary, btnSecondary } from "@/components/ui/button-classes";

export function NavBar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === "/";
  const { items } = useCart();
  const { isAuthenticated, user, logout } = useAuth();
  const itemCount = items.reduce((sum, i) => sum + i.qty, 0);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Mock notification count
  const [notificationCount, setNotificationCount] = useState(3);
  const [showNotification, setShowNotification] = useState(false);

  // Handle notification click
  const handleNotificationClick = () => {
    setShowNotification((prev) => !prev);
    if (notificationCount > 0) {
      setNotificationCount(0);
    }
  };

  // Auto-dismiss notification
  useEffect(() => {
    if (showNotification) {
      const timer = setTimeout(() => {
        setShowNotification(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showNotification]);

  const handleLogout = () => {
    const role = user?.role;
    logout();
    setOpen(false);
    if (role === 'admin' || role === 'staff') {
      router.push("/admin/login");
    } else {
      router.push("/login");
    }
  };

  const links = [
    { href: "/menu", label: "Menu" },
    ...(isMounted && isAuthenticated ? [{ href: "/dashboard", label: "Dashboard" }] : []),
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
        <div
          className={`px-4 py-3 flex items-center justify-between transition-all ${
            isHome
              ? scrolled
                ? "bg-white border border-black/5 shadow-md"
                : "glass border border-white/10 shadow-sm"
              : `bg-white border border-black/5 ${scrolled ? "shadow-md" : "shadow-sm"}`
          }`}
        >
          <Link href="/" className="flex items-center gap-3 group/logo">
            <div className="relative w-10 h-10 group-hover/logo:scale-110 transition-transform duration-500">
              <img
                src="/assets/bistroflow-logo.jpg"
                alt="Bistroflow Logo"
                className="w-full h-full object-contain rounded-xl shadow-lg border border-white/20"
              />
            </div>
            <span className="font-display text-xl font-bold tracking-tight">
              <span className="text-primary group-hover/logo:text-orange-400 transition-colors">BISTRO</span>
              <span className={isHome && !scrolled ? "text-white" : "text-black"}>FLOW</span>
            </span>
          </Link>
          <nav className={`hidden md:flex gap-2 relative ${isHome && !scrolled ? "text-white" : ""}`}>
            <LayoutGroup>
              <Link
                key="/"
                href="/"
                aria-current={isHome ? "page" : undefined}
                className={`relative px-3 py-2 rounded-xl text-sm`}
              >
                {isMounted && isAuthenticated && isHome && (
                  <motion.span
                    layoutId="navActiveBg"
                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary via-orange-400 to-orange-500 shadow-lg shadow-black/40"
                    transition={{ type: "spring", stiffness: 500, damping: 40 }}
                    style={{ zIndex: 0 }}
                  />
                )}
                <span className={`relative z-10 ${isMounted && isAuthenticated && isHome ? "text-white drop-shadow" : "opacity-90"}`}>
                  Home
                </span>
                {isMounted && isAuthenticated && isHome && (
                  <motion.span
                    layoutId="navActiveUnderline"
                    className="absolute left-2 right-2 bottom-1 h-0.5 rounded-full bg-gradient-to-r from-primary to-orange-500"
                    transition={{ type: "spring", stiffness: 600, damping: 35 }}
                  />
                )}
              </Link>
              {links.map((l) => {
                const active = pathname === l.href;
                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    aria-current={active ? "page" : undefined}
                    className={`relative px-3 py-2 rounded-xl text-sm`}
                    >
                    {isMounted && isAuthenticated && active && (
                      <motion.span
                        layoutId="navActiveBg"
                        className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary via-orange-400 to-orange-500 shadow-lg shadow-black/40"
                        transition={{ type: "spring", stiffness: 500, damping: 40 }}
                        style={{ zIndex: 0 }}
                      />
                    )}
                    <span className={`relative z-10 ${isMounted && isAuthenticated && active ? "text-white drop-shadow" : "opacity-90"}`}>
                      {l.label}
                    </span>
                    {isMounted && isAuthenticated && active && (
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
            {isMounted && isAuthenticated && (
              <div className="relative">
                <button
                  onClick={handleNotificationClick}
                  className={`
                    relative inline-flex items-center justify-center rounded-xl w-10 h-10 transition-all
                    ${isHome && !scrolled
                      ? "text-white hover:bg-white/10"
                      : "text-gray-600 hover:bg-gray-100 hover:text-primary"}
                  `}
                  aria-label={`Notifications ${notificationCount > 0 ? `(${notificationCount} unread)` : ""}`}
                  aria-expanded={showNotification}
                >
                  <IconBell className="h-5 w-5" />
                  {notificationCount > 0 && (
                    <span className="absolute top-2 right-2 flex items-center justify-center min-w-[18px] h-[18px] px-[3px] rounded-full bg-red-500 text-white text-[10px] font-bold border-2 border-white transform translate-x-1/4 -translate-y-1/4 shadow-sm leading-none">
                      {notificationCount > 99 ? '99+' : notificationCount}
                    </span>
                  )}
                </button>
                <AnimatePresence>
                  {showNotification && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute top-full right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 z-50 origin-top-right"
                      role="alert"
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                          <IconCheck className="w-4 h-4" />
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-900 text-sm">Order Update</h4>
                          <p className="text-sm text-gray-600 mt-1">Your order is ready!</p>
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); setShowNotification(false); }}
                          className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-100 transition-colors"
                          aria-label="Close notification"
                        >
                          <IconClose className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )}

            {isMounted && isAuthenticated ? (
              <div className="hidden md:flex items-center gap-2">
                <Link
                  href="/account"
                  className={`inline-flex ${btnPrimary} text-sm items-center gap-2`}
                >
                  <IconUser className="h-4 w-4" />
                  <span>My Account</span>
                </Link>
                <button
                  onClick={handleLogout}
                  className={`inline-flex ${btnSecondary} ${isHome && !scrolled ? "text-white hover:bg-white/10" : ""} text-sm items-center gap-2`}
                  aria-label="Logout"
                >
                  <IconLogOut className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <>
                <Link
                  href="/login"
                  className={`hidden md:inline-flex ${btnSecondary} ${isHome && !scrolled ? "text-white hover:bg-white/10" : ""} text-sm items-center gap-2`}
                >
                  <IconKey className="h-4 w-4" />
                  <span>Log In</span>
                </Link>
                <Link href="/signup" className={`hidden md:inline-flex ${btnPrimary} text-sm items-center gap-2`}>
                  <IconPlus className="h-4 w-4" />
                  <span>Sign Up</span>
                </Link>
              </>
            )}
            {/* Cart link removed per request; rely on floating FAB for cart */}
            <button
              className={`md:hidden rounded-xl px-3 py-2 ${isHome && !scrolled ? "text-white" : ""}`}
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
                <Link href="/" className="flex items-center gap-2 group/logo" onClick={() => setOpen(false)}>
                  <div className="relative w-8 h-8">
                    <img
                      src="/assets/bistroflow-logo.jpg"
                      alt="Bistroflow Logo"
                      className="w-full h-full object-contain rounded-lg shadow-md border border-white/20"
                    />
                  </div>
                  <span className="font-display text-lg font-bold tracking-tight">
                    <span className="text-primary">BISTRO</span>
                    <span className="text-black">FLOW</span>
                  </span>
                </Link>
                <button aria-label="Close menu" className="rounded-xl p-2" onClick={() => setOpen(false)}>
                  <IconClose className="h-5 w-5" />
                </button>
              </div>
              <div className="flex flex-col gap-2">
                <Link
                  href="/"
                  aria-current={isHome ? "page" : undefined}
                  className={`px-3 py-2 rounded-xl flex items-center justify-between ${
                    isHome ? "bg-gradient-to-r from-primary via-orange-400 to-orange-500 text-white shadow-md" : "hover:bg-accent/50"
                  }`}
                  onClick={() => setOpen(false)}
                >
                  <span className="inline-flex items-center gap-2">
                    <span>Home</span>
                  </span>
                  {isHome && <span className="ml-2 inline-block h-2 w-2 rounded-full bg-primary" />}
                </Link>
                {links.map((l) => {
                  const active = pathname === l.href;
                  return (
                    <Link
                      key={l.href}
                      href={l.href}
                      aria-current={active ? "page" : undefined}
                      className={`px-3 py-2 rounded-xl flex items-center justify-between ${
                        active ? "bg-gradient-to-r from-primary via-orange-400 to-orange-500 text-white shadow-md" : "hover:bg-accent/50"
                      }`}
                      onClick={() => setOpen(false)}
                    >
                      <span className="inline-flex items-center gap-2">
                        {l.href === "/menu" && <IconList className="h-4 w-4" />}
                        {l.href === "/dashboard" && <IconGrid className="h-4 w-4" />}
                        {l.href === "/about" && <IconUsers className="h-4 w-4" />}
                        <span>{l.label}</span>
                      </span>
                      {active && <span className="ml-2 inline-block h-2 w-2 rounded-full bg-primary" />}
                    </Link>
                  );
                })}
              </div>
              <div className="mt-auto flex flex-col gap-2">
                {isAuthenticated ? (
                  <div className="flex flex-col gap-2 w-full">
                    <Link href="/account" className="w-full inline-flex px-3 py-3 rounded-xl bg-primary text-primary-foreground text-sm justify-center items-center gap-2" onClick={() => setOpen(false)}>
                      <IconUser className="h-4 w-4" />
                      <span>My Account</span>
                    </Link>
                    <button
                      className="w-full inline-flex px-3 py-3 rounded-xl bg-red-50 text-red-600 text-sm justify-center items-center gap-2"
                      onClick={handleLogout}
                    >
                      <IconLogOut className="h-4 w-4" />
                      <span>Log Out</span>
                    </button>
                  </div>
                ) : (
                  <>
                    <Link href="/login" className="w-full inline-flex px-3 py-3 rounded-xl glass text-sm justify-center items-center gap-2" onClick={() => setOpen(false)}>
                      <IconKey className="h-4 w-4" />
                      <span>Log In</span>
                    </Link>
                    <Link href="/signup" className="w-full inline-flex px-3 py-3 rounded-xl bg-primary text-primary-foreground text-sm justify-center items-center gap-2" onClick={() => setOpen(false)}>
                      <IconPlus className="h-4 w-4" />
                      <span>Sign Up</span>
                    </Link>
                  </>
                )}
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
