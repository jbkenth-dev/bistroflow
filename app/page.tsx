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
  const [annLoading, setAnnLoading] = useState(false);
  const [overviewLoading, setOverviewLoading] = useState(false);
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const yParallax = useTransform(scrollYProgress, [0, 1], [0, 40]);
  const orbParallax = useTransform(scrollYProgress, [0, 1], [0, -20]);
  useEffect(() => {
    // Optimization: Skip fake loading
    // const t = setTimeout(() => setAnnLoading(false), 800);
    // return () => clearTimeout(t);
  }, []);
  useEffect(() => {
    // Optimization: Skip fake loading
    // const t = setTimeout(() => setOverviewLoading(false), 900);
    // return () => clearTimeout(t);
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
                <img
                  src="/assets/bistroflow-bg.jpg"
                  alt="Hero background showing premium dining ambience"
                  className="w-full h-full object-cover"
                  onLoad={() => setBgLoaded(true)}
                  onError={() => setBgLoaded(true)}
                />
                <div className="absolute inset-0 bg-black/40" aria-hidden />
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
                className="inline-flex items-center rounded-full px-4 py-1 glass text-[clamp(0.8rem,2.2vw,1rem)] uppercase tracking-wider text-white text-glow-strong drop-shadow animate-pulse"
              >
                Premium Dining Experience
              </motion.div>
              <div className="mt-4 inline-flex items-center justify-center rounded-3xl px-6 py-3">
                <TypewriterH1
                  id="hero-title"
                  text="East Gate Bistro"
                  className="font-display text-[clamp(4.5rem,13vw,10rem)] font-black tracking-tighter leading-[0.8] bg-clip-text text-transparent bg-gradient-to-br from-white via-orange-400 to-primary"
                />
              </div>
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
                className="mt-4 max-w-3xl text-[clamp(1rem,2.4vw,1.35rem)] opacity-90 mx-auto text-white text-glow-black-strong"
              >
                East Gate Bistro is a cozy and inviting restaurant located in Guihulngan City National Highway beside Sea Oil
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25, duration: 0.6 }}
                className="mt-5 flex flex-wrap items-center justify-center gap-2 text-[clamp(0.85rem,1.8vw,1rem)]"
              >
                <span className="inline-flex items-center gap-1 glass rounded-full px-3 py-1 text-white text-glow-black drop-shadow">
                  <IconStar className="h-3 w-3 text-yellow-400" />
                  4.8 Rating
                </span>
                <span className="glass rounded-full px-3 py-1 text-white text-glow-black drop-shadow">100+ Dishes</span>
                <span className="glass rounded-full px-3 py-1 text-white text-glow-black drop-shadow">Open Daily</span>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="mt-8 flex items-center justify-center"
              >
                <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                  <Link href="/menu" aria-label="Explore the menu" className={`${btnPrimary} gap-2 text-[clamp(0.95rem,2vw,1.15rem)]`}>
                    <span>Explore Menu</span>
                    <IconArrowRight className="h-4 w-4" />
                  </Link>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="container-edge py-32 relative overflow-hidden bg-background/50" aria-labelledby="ann-title">
          {/* Enhanced Background Design */}
          <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-[600px] h-[600px] bg-primary/10 blur-[140px] rounded-full pointer-events-none animate-pulse" />
          <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-orange-500/10 blur-[140px] rounded-full pointer-events-none animate-pulse" />
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />

          {/* Main Background Layer */}
          <div className="absolute inset-0 opacity-40 bg-gradient-to-br from-primary/5 via-transparent to-orange-500/5" aria-hidden="true">
            <Particles count={25} colorClass="bg-primary/20" className="opacity-60" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(var(--primary-rgb),0.05)_0%,transparent_70%)]" />
          </div>

          <div className="absolute top-1/4 left-10 w-2 h-2 bg-primary rounded-full animate-ping opacity-30" />
          <div className="absolute bottom-1/4 right-10 w-3 h-3 bg-orange-500 rounded-full animate-bounce opacity-30" />

          {/* Decorative Lines */}
          <div className="absolute left-0 top-0 w-px h-full bg-gradient-to-b from-transparent via-primary/20 to-transparent" />
          <div className="absolute right-0 top-0 w-px h-full bg-gradient-to-b from-transparent via-orange-500/20 to-transparent" />

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center mb-16 relative z-10"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-4">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              Latest Updates
            </div>
            <TypewriterH1
              id="ann-title"
              text="Announcements"
              className="font-display text-5xl md:text-7xl font-black bg-clip-text text-transparent bg-gradient-to-r from-primary via-orange-400 to-orange-500 mx-auto tracking-tight"
            />
            <p className="mt-6 text-lg opacity-70 max-w-2xl mx-auto leading-relaxed">Stay updated with the latest happenings, menu launches, and exclusive offers from East Gate Bistro.</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8 relative z-10">
            {annLoading ? (
              Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="glass rounded-[2.5rem] p-8 border border-white/10 h-80 flex flex-col justify-between">
                  <div className="space-y-4">
                    <div className="h-8 w-3/4 rounded-xl skeleton" />
                    <div className="space-y-2">
                      <div className="h-4 w-full rounded-lg skeleton" />
                      <div className="h-4 w-5/6 rounded-lg skeleton" />
                    </div>
                  </div>
                  <div className="h-10 w-32 rounded-full skeleton" />
                </div>
              ))
            ) : (
              [
                { title: "New Menu Launch", desc: "Our chefs have crafted seasonal specials just for you. Come and explore fresh, vibrant flavors today.", icon: IconStar, badge: "New", date: "Today", link: "/menu", cta: "See menu", color: "from-yellow-400/20" },
                { title: "Extended Hours", desc: "Enjoy your favorites for longer! We've extended our operating hours on weekends for your convenience.", icon: IconList, badge: "Update", date: "This week", link: "/contact", cta: "View hours", color: "from-blue-400/20" },
                { title: "Digital Menu Upgrade", desc: "Browsing our dishes is now faster than ever with our improved real-time menu system.", icon: IconSettings, badge: "Upgrade", date: "Now live", link: "/menu", cta: "Explore now", color: "from-green-400/20" }
              ].map((a, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: i * 0.15, duration: 0.7, ease: [0.21, 0.45, 0.32, 0.9] }}
                  className="group relative bg-white/5 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/10 hover:border-primary/40 transition-all duration-700 overflow-hidden flex flex-col justify-between shadow-2xl shadow-black/5"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${a.color} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700`} />

                  {/* Subtle Pattern Overlay */}
                  <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px] group-hover:opacity-[0.05] transition-opacity" />

                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-8">
                      <div className="p-4 rounded-2xl bg-white/5 group-hover:bg-primary/20 group-hover:scale-110 transition-all duration-500 ring-1 ring-white/10 group-hover:ring-primary/30">
                        <a.icon className="w-7 h-7 text-primary" />
                      </div>
                      <span className="px-4 py-1.5 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] border border-primary/20 backdrop-blur-md">
                        {a.badge}
                      </span>
                    </div>
                    <h3 className="text-2xl font-bold mb-4 group-hover:text-primary transition-colors tracking-tight leading-tight">{a.title}</h3>
                    <p className="text-base opacity-60 leading-relaxed mb-8 font-medium">{a.desc}</p>
                  </div>

                  <div className="relative z-10 flex items-center justify-between pt-6 border-t border-white/10">
                    <div className="flex flex-col">
                      <span className="text-[10px] uppercase tracking-widest opacity-40 font-bold mb-1">Posted</span>
                      <span className="text-xs font-bold opacity-70">{a.date}</span>
                    </div>
                    <Link href={a.link} className="group/btn inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-primary/10 text-primary text-sm font-bold hover:bg-primary hover:text-white transition-all duration-500 shadow-lg shadow-primary/5">
                      <span>{a.cta}</span>
                      <IconArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </section>

        <section className="container-edge py-32 relative overflow-hidden bg-background/50" aria-labelledby="sys-title">
          {/* Enhanced Background Design */}
          <div className="absolute inset-0 opacity-30 bg-gradient-to-tr from-orange-500/5 via-transparent to-primary/5" aria-hidden="true">
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:40px_40px]" />
            <Particles count={20} colorClass="bg-orange-500/10" className="opacity-40" />
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(var(--primary-rgb),0.02)_1px,transparent_1px),linear-gradient(to_bottom,rgba(var(--primary-rgb),0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
          </div>

          <div className="absolute top-1/2 left-0 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 blur-[180px] rounded-full pointer-events-none animate-pulse" />
          <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-orange-500/10 blur-[180px] rounded-full pointer-events-none animate-pulse" />

          {/* Floating Decorative Elements */}
          <motion.div
            animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-20 right-[15%] w-24 h-24 bg-gradient-to-br from-primary/10 to-transparent rounded-full blur-xl pointer-events-none"
          />
          <motion.div
            animate={{ y: [0, 20, 0], rotate: [0, -10, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-20 left-[10%] w-32 h-32 bg-gradient-to-tr from-orange-500/10 to-transparent rounded-full blur-2xl pointer-events-none"
          />

          <div className="grid lg:grid-cols-2 gap-20 items-center relative z-10">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-500 text-xs font-bold uppercase tracking-widest mb-6">
                Next-Gen Dining
              </div>
              <TypewriterH1
                id="sys-title"
                text="System Overview"
                className="font-display text-5xl md:text-7xl font-black bg-clip-text text-transparent bg-gradient-to-r from-primary via-orange-400 to-orange-500 tracking-tight"
              />
              <p className="mt-8 text-xl opacity-70 leading-relaxed font-medium">
                BistroFlow is our comprehensive management suite designed to streamline every aspect of the dining experience, from the first click to the final bite.
              </p>

              <div className="mt-12 grid sm:grid-cols-2 gap-6">
                {[
                  { label: "Seamless Online Ordering", icon: "🚀" },
                  { label: "Kitchen Workflow Optimization", icon: "👨‍🍳" },
                  { label: "Advanced Sales Analytics", icon: "📊" },
                  { label: "Loyalty & Promotions", icon: "🎁" }
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + (idx * 0.1) }}
                    className="flex items-center gap-4 group/item"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-xl group-hover/item:bg-primary/20 group-hover/item:scale-110 transition-all duration-500 shadow-lg">
                      {item.icon}
                    </div>
                    <span className="text-sm font-bold opacity-80 group-hover/item:opacity-100 transition-opacity">{item.label}</span>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.7 }}
                className="mt-12"
              >
                <Link href="/about" className={`${btnSecondary} px-8 py-4 rounded-2xl text-base font-bold group`}>
                  Learn More About BistroFlow
                  <IconArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </motion.div>
            </motion.div>

            <div className="grid grid-cols-2 gap-6">
              {[
                { title: "Ordering", desc: "Browse menu & checkout.", icon: IconCart, link: "/menu", meta: "Live", color: "from-orange-500" },
                { title: "Dashboard", desc: "Manage your orders.", icon: IconList, link: "/dashboard", meta: "User", color: "from-primary" },
                { title: "Kitchen Ops", desc: "Track orders efficiently.", icon: IconTakeout, link: "/admin/orders", meta: "Staff", color: "from-red-500" },
                { title: "Analytics", desc: "Sales & peak insights.", icon: IconChart, link: "/admin/analytics", meta: "Admin", color: "from-blue-500" }
              ].map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8, y: 30 }}
                  whileInView={{ opacity: 1, scale: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ delay: i * 0.1, duration: 0.6, ease: [0.23, 1, 0.32, 1] }}
                  whileHover={{ y: -12, scale: 1.02 }}
                  className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-[0_20px_50px_rgba(0,0,0,0.05)] hover:shadow-[0_40px_80px_rgba(0,0,0,0.1)] transition-all duration-700 group relative overflow-hidden"
                >
                  <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${m.color} to-transparent opacity-[0.03] rounded-bl-[5rem] group-hover:opacity-[0.08] transition-opacity duration-700`} />

                  <div className="w-16 h-16 rounded-[1.25rem] bg-gray-50 flex items-center justify-center mb-8 group-hover:bg-primary group-hover:text-white group-hover:scale-110 group-hover:rotate-3 transition-all duration-700 shadow-inner">
                    <m.icon className="w-8 h-8 text-primary group-hover:text-white transition-colors duration-700" />
                  </div>

                  <div className="mb-2 flex items-center justify-between">
                    <h3 className="font-black text-gray-900 text-xl tracking-tight">{m.title}</h3>
                    <span className="text-[10px] font-black uppercase tracking-widest px-2 py-0.5 rounded-md bg-gray-100 text-gray-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">{m.meta}</span>
                  </div>

                  <p className="text-sm text-gray-500 mb-8 leading-relaxed font-medium">{m.desc}</p>

                  <Link href={m.link} className="group/link inline-flex items-center gap-2 text-xs font-black text-primary uppercase tracking-widest">
                    <span>Explore</span>
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center group-hover/link:bg-primary group-hover/link:text-white transition-all duration-500">
                      <IconArrowRight className="w-3 h-3 group-hover/link:translate-x-0.5 transition-transform" />
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Decorative background circle */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border border-primary/5 rounded-full pointer-events-none -z-10" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80%] h-[80%] border border-primary/5 rounded-full pointer-events-none -z-10" />
        </section>

        <section className="py-32 relative overflow-hidden bg-white/5">
          {/* Enhanced Background for Location */}
          <div className="absolute inset-0 opacity-[0.04] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]" />
          <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-background to-transparent opacity-50" />
          <div className="absolute bottom-0 left-0 w-full h-24 bg-gradient-to-t from-background to-transparent opacity-50" />

          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

          <div className="absolute -left-20 top-1/2 -translate-y-1/2 w-64 h-64 bg-primary/10 blur-[120px] rounded-full pointer-events-none" />
          <div className="absolute -right-20 top-1/2 -translate-y-1/2 w-64 h-64 bg-orange-500/10 blur-[120px] rounded-full pointer-events-none" />

          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="font-display text-4xl md:text-5xl font-bold mb-4">Our Location</h2>
              <div className="w-24 h-1 bg-primary mx-auto rounded-full" />
              <p className="mt-6 text-lg opacity-70 max-w-xl mx-auto">Visit us at the heart of Guihulngan City and experience premium dining like never before.</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative w-full h-[500px] rounded-[3rem] overflow-hidden shadow-2xl border border-white/10"
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3931.23650232139!2d123.2690159!3d10.1182837!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x33abe3980202cf9d%3A0xdb11899a1529cdb!2sEAST%20GATE%20BISTRO!5e0!3m2!1sen!2sph!4v1628076942474!5m2!1sen!2sph"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={true}
                loading="lazy"
                className="transition-all duration-700"
              ></iframe>
              <div className="absolute inset-0 pointer-events-none border-[12px] border-white/5 rounded-[3rem]" />
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
