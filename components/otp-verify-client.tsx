"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { IconArrowRight } from "@/components/ui/icons";

export function OtpVerifyClient() {
  const length = 6;
  const [digits, setDigits] = useState<string[]>(Array(length).fill(""));
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const inputsRef = useRef<Array<HTMLInputElement | null>>(Array(length).fill(null));

  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  const isComplete = digits.every((d) => d.length === 1);
  const otp = digits.join("");

  function handleChange(idx: number, v: string) {
    const value = v.replace(/\D/g, "");
    setErrorMsg(null);
    setStatus("idle");
    setDigits((prev) => {
      const next = [...prev];
      next[idx] = value.slice(0, 1);
      return next;
    });
    if (value && idx < length - 1) inputsRef.current[idx + 1]?.focus();
  }

  function handleKeyDown(idx: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace") {
      if (digits[idx]) {
        setDigits((prev) => {
          const next = [...prev];
          next[idx] = "";
          return next;
        });
      } else if (idx > 0) {
        inputsRef.current[idx - 1]?.focus();
        setDigits((prev) => {
          const next = [...prev];
          next[idx - 1] = "";
          return next;
        });
      }
    }
    if (e.key === "ArrowLeft" && idx > 0) inputsRef.current[idx - 1]?.focus();
    if (e.key === "ArrowRight" && idx < length - 1) inputsRef.current[idx + 1]?.focus();
  }

  function handlePaste(e: React.ClipboardEvent<HTMLDivElement>) {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    if (!text) return;
    e.preventDefault();
    const next = Array(length)
      .fill("")
      .map((_, i) => text[i] ?? "");
    setDigits(next);
    const lastFilled = Math.min(text.length, length) - 1;
    inputsRef.current[lastFilled >= 0 ? lastFilled : 0]?.focus();
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isComplete || status === "loading") return;
    setStatus("loading");
    setErrorMsg(null);
    await new Promise((r) => setTimeout(r, 900));
    if (otp === "000000") {
      setStatus("error");
      setErrorMsg("Invalid code. Try again.");
    } else {
      setStatus("success");
    }
  }

  const shake = status === "error" ? { x: [0, -6, 6, -4, 4, -2, 2, 0] } : { x: 0 };

  return (
    <section aria-labelledby="otp-title" className="relative h-[100dvh] overflow-hidden bg-background flex items-center justify-center">
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
            <div className="text-center mb-8">
              <h1 id="otp-title" className="font-display text-2xl md:text-3xl font-bold tracking-tight text-foreground">Verify Code</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Enter the 6-digit code sent to your email.
              </p>
            </div>

            <form onSubmit={onSubmit} onPaste={handlePaste}>
              <motion.div 
                className="flex justify-center gap-2 sm:gap-3 mb-8"
                animate={shake}
                transition={{ duration: 0.4 }}
              >
                {digits.map((digit, i) => (
                  <input
                    key={i}
                    ref={(el) => { inputsRef.current[i] = el; }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    className={`w-10 h-12 sm:w-12 sm:h-14 text-center text-xl font-bold rounded-xl border outline-none transition-all
                      ${status === "error" 
                        ? "border-destructive text-destructive bg-destructive/5 focus:ring-2 focus:ring-destructive/20" 
                        : "bg-background border-input text-foreground focus:border-primary focus:ring-2 focus:ring-primary/20"
                      }
                      ${digit ? "border-primary/50 bg-primary/5" : ""}
                    `}
                    aria-label={`Digit ${i + 1}`}
                    autoComplete="one-time-code"
                  />
                ))}
              </motion.div>

              {errorMsg && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center text-sm text-destructive font-medium mb-4"
                >
                  {errorMsg}
                </motion.p>
              )}

              {status === "success" && (
                <motion.p
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center text-sm text-green-600 font-medium mb-4"
                >
                  Verified successfully! Redirecting...
                </motion.p>
              )}

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={!isComplete || status === "loading" || status === "success"}
                className="w-full rounded-xl bg-primary text-primary-foreground px-4 py-3 inline-flex items-center justify-center gap-2 transition-colors hover:brightness-105 disabled:opacity-70 disabled:cursor-not-allowed font-medium shadow-md shadow-primary/20"
              >
                {status === "loading" ? (
                  <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : status === "success" ? (
                  <>
                    <span>Verified</span>
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </>
                ) : (
                  <>
                    <span>Verify Code</span>
                    <IconArrowRight className="h-4 w-4" />
                  </>
                )}
              </motion.button>
            </form>

            <div className="mt-6 text-center text-sm">
              <span className="text-muted-foreground">Didn't receive code? </span>
              <button className="text-primary hover:underline underline-offset-4 font-medium transition-colors">Resend</button>
            </div>
            
            <div className="mt-4 text-center text-sm">
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
