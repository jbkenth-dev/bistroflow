 "use client";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
 import Link from "next/link";
import { IconArrowRight, IconEye, IconEyeOff } from "@/components/ui/icons";
 import { SafeImage } from "@/components/ui/safe-image";
import { useRef, useState } from "react";
import { TypewriterH1 } from "@/components/ui/typewriter";

 export function AdminLoginClient() {
   const sectionRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
   const yParallax = useTransform(scrollYProgress, [0, 1], [0, 30]);
 const [role, setRole] = useState<"admin" | "staff">("admin");
 const [showPass, setShowPass] = useState(false);
  return (
    <section aria-labelledby="admin-login-title" ref={sectionRef} className="relative h-[100dvh] overflow-hidden">
      <div className="absolute inset-y-0 right-0 w-full md:w-1/2">
        <motion.div
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          style={{ y: yParallax }}
          className="absolute inset-0"
        >
          <SafeImage
            src="https://images.unsplash.com/photo-1551218808-94e220e084d2?q=80&w=2060&auto=format&fit=crop"
            alt="Premium dining ambience"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 700px"
            loading="lazy"
            unoptimized
            fallbackClassName="bg-muted"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="absolute inset-0 bg-gradient-to-l from-black/30 to-transparent"
        />
      </div>
      <div className="relative z-10 h-full flex items-center">
        <div className="container-edge w-full">
          <div className="w-full md:w-1/2 relative">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="absolute -top-10 -left-10 h-40 w-40 rounded-full bg-primary/20 blur-3xl"
              aria-hidden
            />
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-md mx-auto w-full"
            >
            <motion.div
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: "spring", stiffness: 420, damping: 32, delay: 0.1 }}
              className="glass rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow backdrop-blur"
            >
              <div className="text-center">
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center rounded-full px-4 py-1 glass text-xs uppercase tracking-wider ring-1 ring-white/10 hover:ring-primary/50 transition"
                >
                  Login
                </motion.div>
                <h1 className="mt-3 font-display text-2xl md:text-3xl font-bold tracking-tight text-center">
                  <span className="text-black">BISTRO</span>{" "}
                  <TypewriterH1
                    text="FLOW"
                    loop
                    pauseMs={1400}
                    speedMs={120}
                    inline
                    className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-orange-400 to-orange-600"
                  />
                </h1>
                <motion.div
                  initial={{ width: "0%", opacity: 0 }}
                  animate={{ width: "100%", opacity: 1 }}
                  transition={{ duration: 0.8 }}
                  className="h-0.5 rounded-full bg-gradient-to-r from-primary to-orange-500"
                />
              </div>
              <div className="text-sm">
                <div className="relative grid grid-cols-2 gap-1 glass rounded-xl p-1">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setRole("admin")}
                    className={`rounded-lg px-3 py-2 ${role === "admin" ? "bg-primary text-primary-foreground shadow-sm" : "opacity-80"}`}
                  >
                    Admin
                    {role === "admin" && (
                      <motion.span
                        layoutId="roleActiveUnderline"
                        className="absolute left-2 right-2 bottom-1 h-0.5 rounded-full bg-gradient-to-r from-primary to-orange-500"
                        transition={{ type: "spring", stiffness: 600, damping: 35 }}
                      />
                    )}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setRole("staff")}
                    className={`rounded-lg px-3 py-2 ${role === "staff" ? "bg-primary text-primary-foreground shadow-sm" : "opacity-80"}`}
                  >
                    Staff
                    {role === "staff" && (
                      <motion.span
                        layoutId="roleActiveUnderline"
                        className="absolute left-2 right-2 bottom-1 h-0.5 rounded-full bg-gradient-to-r from-primary to-orange-500"
                        transition={{ type: "spring", stiffness: 600, damping: 35 }}
                      />
                    )}
                  </motion.button>
                </div>
              </div>
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label className="block text-sm opacity-80 mb-1">Email</label>
                  <input type="email" className="w-full glass rounded-xl px-3 py-2 border border-white/10 focus:ring-2 focus:ring-primary/50 outline-none" placeholder="admin@bistroflow.com" />
                </div>
                <div>
                  <label className="block text-sm opacity-80 mb-1" htmlFor="admin-password">Password</label>
                  <div className="relative">
                    <input
                      id="admin-password"
                      type={showPass ? "text" : "password"}
                      className="w-full glass rounded-xl px-3 py-2 pr-10 border border-white/10 focus:ring-2 focus:ring-primary/50 outline-none"
                      placeholder="••••••••"
                      autoComplete="current-password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPass((p) => !p)}
                      aria-label={showPass ? "Hide password" : "Show password"}
                      aria-pressed={showPass}
                      aria-controls="admin-password"
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 glass hover:bg-accent/50 focus:outline-none focus:ring-2 focus:ring-primary/50"
                    >
                      <AnimatePresence mode="wait">
                        <motion.span
                          key={showPass ? "eye-off" : "eye"}
                          initial={{ opacity: 0, scale: 0.9, rotate: -10 }}
                          animate={{ opacity: 1, scale: 1, rotate: 0 }}
                          exit={{ opacity: 0, scale: 0.9, rotate: 10 }}
                          transition={{ duration: 0.18, ease: "easeOut" }}
                          className={showPass ? "text-primary" : "opacity-80"}
                        >
                          {showPass ? <IconEyeOff className="h-4 w-4 transition-colors" /> : <IconEye className="h-4 w-4 transition-colors" />}
                        </motion.span>
                      </AnimatePresence>
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <label className="inline-flex items-center gap-2">
                    <input type="checkbox" className="h-4 w-4" />
                    <span>Remember me</span>
                  </label>
                  <Link href="/admin/forgot-password" className="text-primary">Forgot password?</Link>
                </div>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="mt-2 w-full rounded-xl bg-primary text-primary-foreground px-4 py-3 inline-flex items-center justify-center gap-2 transition-colors hover:brightness-105"
                >
                  <span>Sign In</span>
                  <IconArrowRight className="h-4 w-4" />
                </motion.button>
              </form>
            </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
 }
