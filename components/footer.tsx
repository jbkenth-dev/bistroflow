"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { btnPrimary } from "@/components/ui/button-classes";
import { IconPhone, IconClock, IconMapPin, IconFacebook } from "@/components/ui/icons";

export function Footer() {
  return (
    <footer className="relative mt-32 pb-12 overflow-hidden bg-background">
      {/* Curved Background Decoration - More Professional Design */}
      <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0] z-0">
        <svg
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
          className="relative block w-[calc(100%+1.3px)] h-[100px] fill-white dark:fill-zinc-950"
        >
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z" opacity=".05" fill="currentColor" className="text-primary"></path>
          <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z" opacity=".1" fill="currentColor" className="text-primary"></path>
          <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" fill="currentColor" className="text-primary" opacity=".03"></path>
        </svg>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        className="container-edge relative z-10 pt-20"
      >
        <div className="rounded-[3rem] glass-strong px-8 py-16 md:px-16 md:py-20 border border-white/10 relative overflow-hidden group shadow-2xl shadow-black/20">
          {/* Internal Decorative Glows */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 blur-[100px] rounded-full group-hover:bg-primary/20 transition-colors duration-1000" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-orange-500/10 blur-[100px] rounded-full group-hover:bg-orange-500/20 transition-colors duration-1000" />

          <div className="grid lg:grid-cols-12 gap-16 relative z-10">
            <div className="lg:col-span-4">
              <Link href="/" className="inline-flex items-center gap-3 group/logo">
                <div className="relative w-14 h-14 group-hover/logo:scale-110 transition-transform duration-500">
                  <img
                    src="/assets/bistroflow-logo.jpg"
                    alt="Bistroflow Logo"
                    className="w-full h-full object-contain rounded-2xl shadow-lg border border-white/20"
                  />
                </div>
                <span className="font-display text-3xl font-bold tracking-tighter">
                  <span className="text-primary group-hover/logo:text-orange-400 transition-colors">BISTRO</span>
                  <span className="text-foreground">FLOW</span>
                </span>
              </Link>
              <p className="mt-8 text-lg opacity-60 leading-relaxed max-w-sm font-medium">
                Crafting exceptional dining experiences in the heart of Guihulngan City. Quality ingredients, passionate service, and a modern touch.
              </p>
            </div>

            <div className="lg:col-span-8 grid sm:grid-cols-3 gap-12">
              <div className="space-y-6">
                <div className="flex items-center gap-3 text-primary group/title">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover/title:bg-primary group-hover/title:text-white group-hover/title:scale-110 group-hover/title:rotate-3 transition-all duration-500 shadow-inner">
                    <IconPhone className="w-5 h-5" />
                  </div>
                  <h3 className="font-black uppercase tracking-[0.2em] text-xs">Contact</h3>
                </div>
                <ul className="space-y-4">
                  <li>
                    <a href="tel:09516761071" className="group/link flex flex-col gap-1">
                      <span className="text-[10px] uppercase tracking-widest opacity-40 font-bold">Call Us</span>
                      <div className="flex items-center gap-2">
                        <IconPhone className="w-4 h-4 text-primary" />
                        <span className="text-sm font-bold group-hover/link:text-primary transition-colors">0951 676 1071</span>
                      </div>
                    </a>
                  </li>
                  <li>
                    <a href="https://www.facebook.com/Eastgatebistro" target="_blank" rel="noopener noreferrer" className="group/link flex flex-col gap-1">
                      <span className="text-[10px] uppercase tracking-widest opacity-40 font-bold">Social</span>
                      <div className="flex items-center gap-2">
                        <IconFacebook className="w-4 h-4 text-primary" />
                        <span className="text-sm font-bold group-hover/link:text-primary transition-colors">Facebook Page</span>
                      </div>
                    </a>
                  </li>
                </ul>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-3 text-primary group/title">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover/title:bg-primary group-hover/title:text-white group-hover/title:scale-110 group-hover/title:rotate-3 transition-all duration-500 shadow-inner">
                    <IconClock className="w-5 h-5" />
                  </div>
                  <h3 className="font-black uppercase tracking-[0.2em] text-xs">Service Hours</h3>
                </div>
                <div className="space-y-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] uppercase tracking-widest opacity-40 font-bold">Mon — Sat</span>
                    <span className="text-sm font-bold text-foreground">11:00 AM - 8:00 PM</span>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] uppercase tracking-widest opacity-40 font-bold text-red-500/60">Sunday</span>
                    <span className="text-sm font-bold text-foreground opacity-40 italic">Closed</span>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="flex items-center gap-3 text-primary group/title">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center group-hover/title:bg-primary group-hover/title:text-white group-hover/title:scale-110 group-hover/title:rotate-3 transition-all duration-500 shadow-inner">
                    <IconMapPin className="w-5 h-5" />
                  </div>
                  <h3 className="font-black uppercase tracking-[0.2em] text-xs">Location</h3>
                </div>
                <div className="flex flex-col gap-3">
                  <p className="text-sm font-bold opacity-80 leading-relaxed">
                    East Gate Bistro, National Highway beside Sea Oil, Guihulngan City, Negros Oriental
                  </p>
                  <Link href="/contact" className="inline-flex items-center gap-2 text-xs font-black text-primary uppercase tracking-widest hover:gap-3 transition-all">
                    Get Directions <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M14 5l7 7-7 7M5 12h14"/></svg>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </footer>
  );
}
