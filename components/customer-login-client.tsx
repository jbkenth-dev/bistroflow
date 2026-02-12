 "use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { IconEye, IconEyeOff } from "@/components/ui/icons";
import { Particles } from "@/components/ui/particles";

export function CustomerLoginClient() {
  const [show, setShow] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg(null);
    await new Promise((r) => setTimeout(r, 900));
    setStatus("success");
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  return (
    <section className="min-h-screen flex items-center justify-center p-4 md:p-8 bg-black/5 dark:bg-black/20 overflow-hidden relative">
      <div className="absolute inset-0 pointer-events-none">
        <Particles count={15} className="opacity-40" />
      </div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full max-w-5xl flex flex-col md:flex-row glass rounded-[2.5rem] overflow-hidden shadow-2xl relative z-10 border border-white/20"
      >
        {/* Image/Brand Side */}
        <div className="hidden md:flex md:w-1/2 bg-primary relative p-12 flex-col justify-between overflow-hidden">
          <motion.div
            initial={{ opacity: 0, rotate: -10, scale: 0.8 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="absolute -right-10 -top-10 w-96 h-96 bg-white/10 rounded-full blur-3xl"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3, ease: "easeOut" }}
            className="absolute -left-10 -bottom-10 w-64 h-64 bg-black/10 rounded-full blur-3xl"
          />

          <div className="relative z-10">
            <Link href="/" className="font-display text-2xl font-bold tracking-tight flex items-center gap-3">
              <div className="w-10 h-10 relative rounded-xl overflow-hidden shadow-lg shadow-black/20">
                <Image
                  src="/assets/bistroflow-logo.jpg"
                  alt="Bistroflow Logo"
                  fill
                  className="object-cover"
                />
              </div>
              <span className="text-white">BISTRO</span>
              <span className="text-black/80">FLOW</span>
            </Link>
          </div>

          <div className="relative z-10">
            <motion.h2
              variants={itemVariants}
              className="font-display text-4xl lg:text-5xl font-bold text-white leading-tight"
            >
              Welcome back to <br /> your kitchen.
            </motion.h2>
            <motion.p variants={itemVariants} className="mt-6 text-white/80 text-lg max-w-sm">
              Your favorite flavors are just a few clicks away. Sign in to continue your culinary experience.
            </motion.p>
          </div>

          <div className="relative z-10 flex gap-4">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-primary bg-white/20 backdrop-blur-sm flex items-center justify-center text-[10px] font-bold text-white">
                  {i}
                </div>
              ))}
            </div>
            <div className="text-white/60 text-xs flex flex-col justify-center">
              <span className="font-bold text-white">5k+ Reviews</span>
              <span>Across the city</span>
            </div>
          </div>
        </div>

        {/* Form Side */}
        <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-16 bg-white/50 dark:bg-black/50 backdrop-blur-xl">
          <div className="max-w-md mx-auto">
            <motion.div variants={itemVariants} className="md:hidden mb-8">
              <Link href="/" className="font-display text-xl font-bold tracking-tight flex items-center gap-2">
                <div className="w-8 h-8 relative rounded-lg overflow-hidden shadow-md">
                  <Image
                    src="/assets/bistroflow-logo.jpg"
                    alt="Bistroflow Logo"
                    fill
                    className="object-cover"
                  />
                </div>
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-orange-600">BISTRO</span>
                <span className="text-foreground">FLOW</span>
              </Link>
            </motion.div>

            <motion.div variants={itemVariants}>
              <h1 id="login-title" className="font-display text-3xl font-bold tracking-tight text-foreground">
                Sign In
              </h1>
              <p className="mt-2 text-muted-foreground">Enter your details to access your account.</p>
            </motion.div>

            <form className="mt-8 space-y-6" onSubmit={onSubmit} aria-describedby={errorMsg ? "login-error" : undefined}>
              <motion.div variants={itemVariants}>
                <label htmlFor="login-email" className="block text-sm font-medium mb-2 text-foreground/80">
                  Email Address
                </label>
                <input
                  id="login-email"
                  type="email"
                  required
                  className="w-full bg-white/50 dark:bg-white/5 rounded-2xl px-4 py-3 border border-white/20 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                  placeholder="name@example.com"
                  autoComplete="email"
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="login-password" className="block text-sm font-medium text-foreground/80">
                    Password
                  </label>
                  <Link href="/forgot-password" className="text-xs text-primary font-medium hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <input
                    id="login-password"
                    type={show ? "text" : "password"}
                    required
                    className="w-full bg-white/50 dark:bg-white/5 rounded-2xl px-4 py-3 pr-12 border border-white/20 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                    placeholder="••••••••"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShow((v) => !v)}
                    className="absolute inset-y-0 right-3 flex items-center p-2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {show ? <IconEyeOff className="w-5 h-5" /> : <IconEye className="w-5 h-5" />}
                  </button>
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="flex items-center gap-2">
                <input type="checkbox" id="remember" className="w-4 h-4 rounded border-white/20 bg-white/5 text-primary focus:ring-primary/20" />
                <label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer">Remember me for 30 days</label>
              </motion.div>

              <motion.div variants={itemVariants}>
                <button
                  type="submit"
                  className="w-full bg-primary text-primary-foreground font-semibold rounded-2xl px-6 py-4 shadow-xl shadow-primary/20 hover:shadow-primary/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  {status === "loading" ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Signing In...
                    </>
                  ) : (
                    "Sign In"
                  )}
                </button>
              </motion.div>
            </form>

            <motion.div variants={itemVariants} className="mt-8 text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link href="/signup" className="text-primary font-semibold hover:underline">
                  Create one now
                </Link>
              </p>
            </motion.div>

            {status === "success" && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-2xl text-green-600 dark:text-green-400 text-sm text-center font-medium"
              >
                Sign in successful! Redirecting...
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </section>
  );
}
