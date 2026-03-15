"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { IconArrowRight, IconEye, IconEyeOff } from "@/components/ui/icons";
import { SafeImage } from "@/components/ui/safe-image";
import { useRef, useState } from "react";
import { TypewriterH1 } from "@/components/ui/typewriter";
import { useAuth } from "@/store/auth";

export function AdminLoginClient() {
  const router = useRouter();
  const { login } = useAuth();
  const sectionRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const yParallax = useTransform(scrollYProgress, [0, 1], [0, 30]);
  const [role, setRole] = useState<"admin" | "staff">("admin");
  const [showPass, setShowPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost/bistroflow/bistroflow/php-backend/public/api/login.php", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email,
            password,
            scope: 'admin'
        }),
      });

      const data = await res.json();

      if (data.success) {
        // Check role
        if (data.user.role === role) {
           // Success
           login({
              id: data.user.id,
              firstName: data.user.firstName,
              lastName: data.user.lastName,
              name: `${data.user.firstName} ${data.user.lastName}`,
              email: data.user.email,
              role: data.user.role,
              profilePic: data.user.profilePic
           });

           // Set a cookie for middleware if needed
           document.cookie = `admin_session=true; path=/; max-age=86400; SameSite=Strict`;

           if (role === 'admin') {
             router.push("/admin/dashboard");
           } else {
             router.push("/staff/dashboard");
           }
        } else {
           setError(`Access denied. You are not a ${role}.`);
        }
      } else {
        setError(data.message || "Login failed");
      }
    } catch (err) {
      console.error(err);
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section aria-labelledby="admin-login-title" ref={sectionRef} className="relative h-[100dvh] overflow-hidden bg-background">
      <div className="absolute inset-y-0 right-0 w-full md:w-1/2">
        <motion.div
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          style={{ y: yParallax }}
          className="absolute inset-0"
        >
          <SafeImage
            src="/assets/bistroflow-bg.jpg"
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
          className="absolute inset-0 bg-gradient-to-l from-black/60 to-transparent md:from-transparent"
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
                className="bg-card border border-border rounded-2xl p-6 shadow-xl backdrop-blur-sm md:bg-card/95"
              >
                <div className="text-center">
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center rounded-full px-4 py-1 bg-secondary text-secondary-foreground text-xs uppercase tracking-wider ring-1 ring-border hover:ring-primary/50 transition"
                  >
                    Login
                  </motion.div>
                  <h1 className="mt-3 font-display text-2xl md:text-3xl font-bold tracking-tight text-center text-foreground">
                    <span>BISTRO</span>{" "}
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
                    className="h-0.5 rounded-full bg-gradient-to-r from-primary to-orange-500 mx-auto mt-2"
                    style={{ maxWidth: "100px" }}
                  />
                </div>

                <div className="mt-6 mb-6">
                  <div className="relative grid grid-cols-2 gap-1 bg-muted p-1 rounded-xl">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setRole("admin")}
                      className={`relative z-10 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                        role === "admin" ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {role === "admin" && (
                        <motion.div
                          layoutId="roleActiveBackground"
                          className="absolute inset-0 bg-primary rounded-lg shadow-sm -z-10"
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      )}
                      Admin
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setRole("staff")}
                      className={`relative z-10 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                        role === "staff" ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {role === "staff" && (
                        <motion.div
                          layoutId="roleActiveBackground"
                          className="absolute inset-0 bg-primary rounded-lg shadow-sm -z-10"
                          transition={{ type: "spring", stiffness: 500, damping: 30 }}
                        />
                      )}
                      Staff
                    </motion.button>
                  </div>
                </div>

                <form className="space-y-4" onSubmit={handleLogin}>
                  {error && <div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded-lg">{error}</div>}
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1">Email</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-background rounded-xl px-3 py-2 border border-input focus:ring-2 focus:ring-primary/50 focus:border-primary/50 outline-none transition-all placeholder:text-muted-foreground/50 text-foreground"
                      placeholder="admin@bistroflow.com"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-1" htmlFor="admin-password">Password</label>
                    <div className="relative">
                      <input
                        id="admin-password"
                        type={showPass ? "text" : "password"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-background rounded-xl px-3 py-2 pr-10 border border-input focus:ring-2 focus:ring-primary/50 focus:border-primary/50 outline-none transition-all placeholder:text-muted-foreground/50 text-foreground"
                        placeholder="••••••••"
                        autoComplete="current-password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPass((p) => !p)}
                        aria-label={showPass ? "Hide password" : "Show password"}
                        aria-pressed={showPass}
                        aria-controls="admin-password"
                        className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                      >
                        <AnimatePresence mode="wait">
                          <motion.span
                            key={showPass ? "eye-off" : "eye"}
                            initial={{ opacity: 0, scale: 0.9, rotate: -10 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            exit={{ opacity: 0, scale: 0.9, rotate: 10 }}
                            transition={{ duration: 0.18, ease: "easeOut" }}
                          >
                            {showPass ? <IconEyeOff className="h-4 w-4" /> : <IconEye className="h-4 w-4" />}
                          </motion.span>
                        </AnimatePresence>
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <label className="inline-flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" className="h-4 w-4 rounded border-input text-primary focus:ring-primary" />
                      <span className="text-muted-foreground">Remember me</span>
                    </label>
                    <Link href="/admin/forgot-password" className="text-primary hover:underline underline-offset-4">Forgot password?</Link>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isLoading}
                    className="mt-2 w-full rounded-xl bg-primary text-primary-foreground px-4 py-3 inline-flex items-center justify-center gap-2 transition-colors hover:brightness-105 disabled:opacity-70 disabled:cursor-not-allowed font-medium shadow-md shadow-primary/20"
                  >
                    {isLoading ? (
                      <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <span>Sign In</span>
                        <IconArrowRight className="h-4 w-4" />
                      </>
                    )}
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
