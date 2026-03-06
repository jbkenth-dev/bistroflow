"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useMemo, useState } from "react";
import { IconEye, IconEyeOff } from "@/components/ui/icons";

export function NewPasswordClient() {
  const [pwd, setPwd] = useState("");
  const [pwd2, setPwd2] = useState("");
  const [show1, setShow1] = useState(false);
  const [show2, setShow2] = useState(false);
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const score = useMemo(() => {
    let s = 0;
    if (pwd.length >= 8) s++;
    if (/[a-z]/.test(pwd)) s++;
    if (/[A-Z]/.test(pwd)) s++;
    if (/\d/.test(pwd)) s++;
    if (/[^A-Za-z0-9]/.test(pwd)) s++;
    return Math.min(s, 5);
  }, [pwd]);

  const label = useMemo(() => {
    if (score <= 2) return "Weak";
    if (score === 3) return "Medium";
    if (score >= 4) return "Strong";
    return "Weak";
  }, [score]);

  const pct = useMemo(() => Math.round((score / 5) * 100), [score]);
  const canSubmit = useMemo(() => pwd.length > 0 && pwd2.length > 0 && pwd === pwd2 && score >= 3 && status !== "loading" && status !== "success", [pwd, pwd2, score, status]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setStatus("loading");
    setErrorMsg(null);
    await new Promise((r) => setTimeout(r, 900));
    if (pwd === "password" || score < 3 || pwd !== pwd2) {
      setStatus("error");
      setErrorMsg("Please choose a stronger password and ensure both fields match.");
    } else {
      setStatus("success");
    }
  }

  const barColor = score <= 2 ? "bg-red-500" : score === 3 ? "bg-yellow-500" : "bg-green-500";

  return (
    <section aria-labelledby="newpwd-title" className="relative h-[100dvh] overflow-hidden bg-background flex items-center justify-center">
      <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 via-transparent to-transparent opacity-50 pointer-events-none" />
      <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-secondary/10 blur-3xl pointer-events-none" />

      <div className="container-edge w-full relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-md mx-auto w-full"
        >
          <motion.div
            initial={{ scale: 0.98, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 420, damping: 32 }}
            className="bg-card border border-border rounded-2xl p-8 shadow-xl backdrop-blur-sm"
          >
            <div className="text-center mb-6">
              <h1 id="newpwd-title" className="font-display text-2xl md:text-3xl font-bold tracking-tight text-foreground">Set New Password</h1>
              <p className="mt-2 text-sm text-muted-foreground">Choose a strong password and confirm it.</p>
            </div>

            <form className="mt-4 space-y-4" onSubmit={onSubmit} aria-describedby={errorMsg ? "newpwd-error" : undefined}>
              <div>
                <label htmlFor="new-password" className="block text-sm font-medium text-muted-foreground mb-1">New Password</label>
                <div className="relative">
                  <input
                    id="new-password"
                    type={show1 ? "text" : "password"}
                    className="w-full bg-background rounded-xl px-3 py-2 pr-12 border border-input focus:ring-2 focus:ring-primary/50 focus:border-primary/50 outline-none transition-all placeholder:text-muted-foreground/50 text-foreground"
                    placeholder="Enter new password"
                    autoComplete="new-password"
                    value={pwd}
                    onChange={(e) => {
                      setPwd(e.target.value);
                      setStatus("idle");
                      setErrorMsg(null);
                    }}
                    aria-invalid={status === "error" ? "true" : "false"}
                  />
                  <motion.button
                    type="button"
                    onClick={() => setShow1((v) => !v)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={show1 ? "Hide password" : "Show password"}
                    className="absolute inset-y-0 right-2 flex items-center p-1 rounded-md text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                  >
                    {show1 ? <IconEyeOff className="w-5 h-5" /> : <IconEye className="w-5 h-5" />}
                  </motion.button>
                </div>
                
                {/* Strength Meter */}
                <div className="mt-2 h-1.5 w-full bg-muted rounded-full overflow-hidden">
                  <motion.div
                    className={`h-full ${barColor}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <div className="flex justify-between mt-1">
                  <span className="text-xs text-muted-foreground">Strength</span>
                  <span className={`text-xs font-medium ${
                    score <= 2 ? "text-red-500" : score === 3 ? "text-yellow-500" : "text-green-500"
                  }`}>
                    {label}
                  </span>
                </div>
              </div>

              <div>
                <label htmlFor="confirm-password" className="block text-sm font-medium text-muted-foreground mb-1">Confirm Password</label>
                <div className="relative">
                  <input
                    id="confirm-password"
                    type={show2 ? "text" : "password"}
                    className="w-full bg-background rounded-xl px-3 py-2 pr-12 border border-input focus:ring-2 focus:ring-primary/50 focus:border-primary/50 outline-none transition-all placeholder:text-muted-foreground/50 text-foreground"
                    placeholder="Confirm new password"
                    autoComplete="new-password"
                    value={pwd2}
                    onChange={(e) => {
                      setPwd2(e.target.value);
                      setStatus("idle");
                      setErrorMsg(null);
                    }}
                    aria-invalid={status === "error" ? "true" : "false"}
                  />
                  <motion.button
                    type="button"
                    onClick={() => setShow2((v) => !v)}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label={show2 ? "Hide password" : "Show password"}
                    className="absolute inset-y-0 right-2 flex items-center p-1 rounded-md text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
                  >
                    {show2 ? <IconEyeOff className="w-5 h-5" /> : <IconEye className="w-5 h-5" />}
                  </motion.button>
                </div>
              </div>

              {errorMsg && (
                <motion.div
                  id="newpwd-error"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="bg-destructive/10 text-destructive text-sm p-3 rounded-lg border border-destructive/20"
                >
                  {errorMsg}
                </motion.div>
              )}

              {status === "success" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-sm p-3 rounded-lg border border-green-200 dark:border-green-900/50"
                >
                  Password updated successfully! Redirecting...
                </motion.div>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={!canSubmit}
                className="w-full rounded-xl bg-primary text-primary-foreground px-4 py-3 font-medium transition-colors hover:brightness-105 disabled:opacity-70 disabled:cursor-not-allowed shadow-md shadow-primary/20"
              >
                {status === "loading" ? (
                  <span className="inline-block h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  "Update Password"
                )}
              </motion.button>
            </form>

            <div className="mt-6 text-center text-sm">
              <Link href="/admin/login" className="text-muted-foreground hover:text-foreground transition-colors">
                Back to Login
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
