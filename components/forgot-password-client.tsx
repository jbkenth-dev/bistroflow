"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { IconArrowRight } from "@/components/ui/icons";

export function ForgotPasswordClient() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSent, setIsSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    setIsSent(true);
  };

  return (
    <section aria-labelledby="forgot-title" className="relative h-[100dvh] overflow-hidden bg-background flex items-center justify-center">
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
              <h1 id="forgot-title" className="font-display text-2xl md:text-3xl font-bold tracking-tight text-foreground">Forgot Password</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                {!isSent 
                  ? "Enter your email address and we'll send you a link to reset your password." 
                  : "Check your email for the reset link."}
              </p>
            </div>

            {!isSent ? (
              <form className="space-y-4" onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="forgot-email" className="block text-sm font-medium text-muted-foreground mb-1">Email</label>
                  <input
                    id="forgot-email"
                    type="email"
                    className="w-full bg-background rounded-xl px-4 py-3 border border-input focus:ring-2 focus:ring-primary/50 focus:border-primary/50 outline-none transition-all placeholder:text-muted-foreground/50 text-foreground"
                    placeholder="you@bistroflow.com"
                    autoComplete="email"
                    required
                  />
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
                      <span>Send Reset Link</span>
                      <IconArrowRight className="h-4 w-4" />
                    </>
                  )}
                </motion.button>
              </form>
            ) : (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <div className="mx-auto h-16 w-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                  <svg className="h-8 w-8 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-sm text-muted-foreground mb-6">
                  We have sent a password reset link to your email address. Please follow the instructions in the email to reset your password.
                </p>
                <Link href="/admin/login">
                   <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full rounded-xl bg-secondary text-secondary-foreground px-4 py-3 font-medium transition-colors hover:bg-secondary/90"
                  >
                    Back to Login
                  </motion.button>
                </Link>
              </motion.div>
            )}

            {!isSent && (
              <div className="mt-6 text-center text-sm">
                <Link href="/admin/login" className="text-primary hover:underline underline-offset-4 font-medium transition-colors">
                  Back to Login
                </Link>
              </div>
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
