"use client";
import { NavBar } from "@/components/nav-bar";
import { Footer } from "@/components/footer";
import { motion, useScroll, useTransform } from "framer-motion";
import Link from "next/link";
import { IconArrowRight, IconStar, IconSettings, IconList, IconCart, IconDineIn, IconTakeout, IconChart } from "@/components/ui/icons";
import { TypewriterH1 } from "@/components/ui/typewriter";
import { useState, useRef, useEffect } from "react";
import { SafeImage } from "@/components/ui/safe-image";
import { Particles } from "@/components/ui/particles";
import { btnPrimary, btnSecondary } from "@/components/ui/button-classes";

export default function LandingPage() {
  const [bgLoaded, setBgLoaded] = useState(false);
  const [annLoading, setAnnLoading] = useState(true);
  const [overviewLoading, setOverviewLoading] = useState(true);
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const yParallax = useTransform(scrollYProgress, [0, 1], [0, 40]);
  const orbParallax = useTransform(scrollYProgress, [0, 1], [0, -20]);
  useEffect(() => {
    const t = setTimeout(() => setAnnLoading(false), 800);
    return () => clearTimeout(t);
  }, []);
  useEffect(() => {
    const t = setTimeout(() => setOverviewLoading(false), 900);
    return () => clearTimeout(t);
  }, []);
  return (
    <div>
      <NavBar />
      <main className="pt-0 overflow-x-hidden">
        <section aria-labelledby="hero-title" aria-describedby="hero-desc">
          <div
            ref={sectionRef}
            className="relative overflow-hidden w-screen h-[100dvh] -mt-px"
            role="region"
          >
            <div>
              {!bgLoaded && <div className="absolute inset-0 skeleton" aria-hidden />}
              <motion.div style={{ y: yParallax }} className="absolute inset-0">
                <SafeImage
                  src="https://images.unsplash.com/photo-1551218808-94e220e084d2?q=80&w=2060&auto=format&fit=crop"
                  alt="Hero background showing premium dining ambience"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 90vw, 1400px"
                  loading="lazy"
                  unoptimized
                  onLoadingComplete={() => setBgLoaded(true)}
                  onImageError={() => setBgLoaded(true)}
                  fallbackClassName="bg-muted"
                />
              </motion.div>
            </div>
            <Particles count={18} className="pointer-events-none hidden md:block" colorClass="bg-primary/20" />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              style={{ y: orbParallax }}
              className="absolute -top-10 -left-10 h-56 w-56 rounded-full bg-primary/20 blur-3xl"
              aria-hidden
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, duration: 0.8 }}
              style={{ y: orbParallax }}
              className="absolute -bottom-14 -right-14 h-64 w-64 rounded-full bg-orange-500/20 blur-3xl"
              aria-hidden
            />
            <div className="relative z-10 px-6 md:px-8 text-center flex flex-col items-center justify-center h-[100dvh]">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center rounded-full px-4 py-1 glass text-xs uppercase tracking-wider text-white drop-shadow"
              >
                Premium Dining Experience
              </motion.div>
              <TypewriterH1
                id="hero-title"
                text="East Gate Bistro"
                className="mt-4 font-display text-5xl md:text-7xl font-bold tracking-tight leading-tight bg-clip-text text-transparent bg-gradient-to-r from-primary via-orange-400 to-orange-600"
              />
              <motion.div
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: 96, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.6 }}
                className="mt-3 h-1 rounded-full bg-gradient-to-r from-primary via-orange-400 to-orange-600 mx-auto"
              />
              <motion.p
                id="hero-desc"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.6 }}
                className="mt-4 max-w-2xl text-base md:text-lg opacity-90 mx-auto text-white text-glow-black"
              >
                Integrated Food Order & Reservation Experience.
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.6 }}
                className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs md:text-sm"
              >
                <span className="inline-flex items-center gap-1 glass rounded-full px-3 py-1 text-white drop-shadow">
                  <IconStar className="h-3 w-3 text-yellow-400" />
                  4.8 Rating
                </span>
                <span className="glass rounded-full px-3 py-1 text-white drop-shadow">100+ Dishes</span>
                <span className="glass rounded-full px-3 py-1 text-white drop-shadow">Open Daily</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="mt-8 flex items-center justify-center"
              >
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link href="/menu" aria-label="Explore the menu" className={`${btnPrimary} gap-2`}>
                    <span>Explore Menu</span>
                    <IconArrowRight className="h-4 w-4" />
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="container-edge py-12" aria-labelledby="ann-title">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <TypewriterH1 id="ann-title" text="Announcements" glow className="font-display text-3xl font-bold" />
            <p className="mt-2 opacity-80">Latest updates from East Gate Bistro.</p>
          </motion.div>
          <div className="mt-6 grid md:grid-cols-3 gap-6">
            {annLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="glass rounded-2xl p-4 border border-white/10">
                  <div className="h-5 w-32 rounded skeleton" />
                  <div className="mt-3 h-20 w-full rounded-xl skeleton" />
                </div>
              ))
            ) : (
              [
                { title: "New Menu Launch", desc: "Seasonal specials now available. Explore fresh flavors.", icon: IconStar, badge: "New", date: "Today", link: "/menu", cta: "See menu" },
                { title: "Extended Hours", desc: "We’re open later on weekends for your dining convenience.", icon: IconList, badge: "Update", date: "This week", link: "/contact", cta: "View hours" },
                { title: "Reservation Upgrade", desc: "Improved booking flow for faster, smoother reservations.", icon: IconSettings, badge: "Upgrade", date: "Now live", link: "/reservation", cta: "Reserve now" }
              ].map((a, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.4 }}
                  className="relative glass rounded-2xl p-5 border border-white/10 hover:bg-white/7 hover:ring-1 hover:ring-primary/40 transition-all overflow-hidden"
                >
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.25 }}
                    transition={{ duration: 0.6 }}
                    className="pointer-events-none absolute -top-10 -right-10 w-40 h-40 rounded-full bg-primary/20 blur-2xl"
                  />
                  <div className="relative z-10">
                    <div className="flex items-center justify-between">
                      <div className="inline-flex items-center gap-2">
                        <span className="glass rounded-lg p-2">
                          <a.icon className="w-4 h-4" />
                        </span>
                        <h3 className="font-semibold">{a.title}</h3>
                      </div>
                      <div className="inline-flex items-center gap-2">
                        <motion.span
                          initial={{ scale: 1 }}
                          animate={{ scale: a.badge === "New" || a.badge === "Upgrade" ? [1, 1.05, 1] : 1 }}
                          transition={{ repeat: a.badge === "New" || a.badge === "Upgrade" ? Infinity : 0, duration: 2, ease: "easeInOut" }}
                          className="glass rounded-full px-2 py-1 text-xs"
                        >
                          {a.badge}
                        </motion.span>
                        <motion.span
                          initial={{ backgroundPosition: "0% 0%" }}
                          animate={{ backgroundPosition: "100% 0%" }}
                          transition={{ repeat: Infinity, duration: 1.6, ease: "linear" }}
                          className="hidden md:block rounded-xl w-20 h-2"
                          style={{
                            backgroundImage:
                              "linear-gradient(90deg, rgba(255,255,255,0.06) 25%, rgba(255,255,255,0.25) 37%, rgba(255,255,255,0.06) 63%)",
                            backgroundSize: "400% 100%",
                          }}
                        />
                      </div>
                    </div>
                    <p className="mt-2 text-sm opacity-90">{a.desc}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-xs opacity-70">{a.date}</span>
                      <Link href={a.link} className="inline-flex items-center gap-1 text-sm hover:underline">
                        <span>{a.cta}</span>
                        <IconArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </section>

        <section className="container-edge py-12" aria-labelledby="sys-title">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <TypewriterH1 id="sys-title" text="System Overview" glow className="font-display text-3xl font-bold" />
            <p className="mt-2 opacity-80">Core modules powering BistroFlow.</p>
            <motion.div
              initial={{ backgroundPosition: "0% 0%", opacity: 0 }}
              animate={{ backgroundPosition: "100% 0%", opacity: 1 }}
              transition={{ duration: 1.2, ease: "linear" }}
              className="mt-4 h-1 rounded-full"
              style={{
                backgroundImage:
                  "linear-gradient(90deg, rgba(255,255,255,0.06) 25%, rgba(255,255,255,0.25) 37%, rgba(255,255,255,0.06) 63%)",
                backgroundSize: "400% 100%",
              }}
            />
          </motion.div>
          <div className="mt-6 grid md:grid-cols-4 gap-6">
            {overviewLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="glass rounded-2xl p-5 border border-white/10">
                  <div className="h-5 w-28 rounded skeleton" />
                  <div className="mt-3 h-16 w-full rounded-xl skeleton" />
                  <div className="mt-3 h-8 w-24 rounded-xl skeleton" />
                </div>
              ))
            ) : (
              [
                { title: "Ordering", desc: "Browse menu, add items, and checkout seamlessly.", icon: IconCart, link: "/menu", meta: "Live" },
                { title: "Reservations", desc: "Plan dining with real-time table availability.", icon: IconDineIn, link: "/reservation", meta: "Public" },
                { title: "Kitchen Ops", desc: "Prioritize and track orders efficiently.", icon: IconTakeout, link: "/admin/orders", meta: "Staff" },
                { title: "Analytics", desc: "Insights on sales and peak hours.", icon: IconChart, link: "/admin/analytics", meta: "Admin" }
              ].map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.4 }}
                  whileHover={{ scale: 1.02 }}
                  className="relative glass rounded-2xl p-5 border border-white/10 hover:bg-white/7 hover:ring-1 hover:ring-primary/40 transition-all overflow-hidden"
                >
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0.25 }}
                    transition={{ duration: 0.6 }}
                    className="pointer-events-none absolute -top-10 -right-10 w-40 h-40 rounded-full bg-primary/20 blur-2xl"
                  />
                  <div className="relative z-10">
                    <div className="flex items-center justify-between">
                      <div className="inline-flex items-center gap-2">
                        <span className="glass rounded-lg p-2">
                          <m.icon className="w-4 h-4" />
                        </span>
                        <h3 className="font-semibold">{m.title}</h3>
                      </div>
                      <motion.span
                        initial={{ scale: 1 }}
                        animate={{ scale: m.meta === "Live" ? [1, 1.05, 1] : 1 }}
                        transition={{ repeat: m.meta === "Live" ? Infinity : 0, duration: 2, ease: "easeInOut" }}
                        className="glass rounded-full px-2 py-1 text-xs"
                      >
                        {m.meta}
                      </motion.span>
                    </div>
                    <p className="mt-2 text-sm opacity-90">{m.desc}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <motion.span
                        initial={{ backgroundPosition: "0% 0%" }}
                        animate={{ backgroundPosition: "100% 0%" }}
                        transition={{ repeat: Infinity, duration: 1.6, ease: "linear" }}
                        className="rounded-xl w-20 h-2"
                        style={{
                          backgroundImage:
                            "linear-gradient(90deg, rgba(255,255,255,0.06) 25%, rgba(255,255,255,0.25) 37%, rgba(255,255,255,0.06) 63%)",
                          backgroundSize: "400% 100%",
                        }}
                      />
                      <Link href={m.link} className="inline-flex items-center gap-1 text-sm hover:underline">
                        <span>Explore</span>
                        <IconArrowRight className="h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}
