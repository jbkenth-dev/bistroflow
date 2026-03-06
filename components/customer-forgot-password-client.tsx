"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { Particles } from "@/components/ui/particles";
import { IconArrowRight } from "@/components/ui/icons";

export function CustomerForgotPasswordClient() {
  const [step, setStep] = useState<"email" | "otp" | "new-password" | "success">("email");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [isResending, setIsResending] = useState(false);
  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // OTP State
  const otpLength = 6;
  const [otpDigits, setOtpDigits] = useState<string[]>(Array(otpLength).fill(""));
  const otpInputsRef = useRef<Array<HTMLInputElement | null>>(Array(otpLength).fill(null));
  const [timeLeft, setTimeLeft] = useState(30);

  useEffect(() => {
    if (step === "otp") {
      setTimeout(() => otpInputsRef.current[0]?.focus(), 100);
    }
  }, [step]);

  useEffect(() => {
    if (step === "otp" && timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [step, timeLeft]);

  // OTP Handlers
  function handleOtpChange(idx: number, v: string) {
    const value = v.replace(/\D/g, "");
    setOtpDigits((prev) => {
      const next = [...prev];
      next[idx] = value.slice(0, 1);
      return next;
    });
    if (value && idx < otpLength - 1) otpInputsRef.current[idx + 1]?.focus();
  }

  function handleOtpKeyDown(idx: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace") {
      if (otpDigits[idx]) {
        setOtpDigits((prev) => {
          const next = [...prev];
          next[idx] = "";
          return next;
        });
      } else if (idx > 0) {
        otpInputsRef.current[idx - 1]?.focus();
        setOtpDigits((prev) => {
          const next = [...prev];
          next[idx - 1] = "";
          return next;
        });
      }
    }
    if (e.key === "ArrowLeft" && idx > 0) otpInputsRef.current[idx - 1]?.focus();
    if (e.key === "ArrowRight" && idx < otpLength - 1) otpInputsRef.current[idx + 1]?.focus();
  }

  function handleOtpPaste(e: React.ClipboardEvent<HTMLInputElement>) {
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, otpLength);
    if (!text) return;
    e.preventDefault();
    const next = Array(otpLength).fill("").map((_, i) => text[i] ?? "");
    setOtpDigits(next);
    const lastFilled = Math.min(text.length, otpLength) - 1;
    otpInputsRef.current[lastFilled >= 0 ? lastFilled : 0]?.focus();
  }

  async function onEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    await new Promise((r) => setTimeout(r, 1500));
    setStatus("idle");
    setStep("otp");
  }

  async function onOtpSubmit(e: React.FormEvent) {
    e.preventDefault();
    const code = otpDigits.join("");
    if (code.length !== otpLength) return;

    setStatus("loading");
    await new Promise((r) => setTimeout(r, 1500));
    setStatus("idle");
    setStep("new-password");
  }

  async function onPasswordSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
        alert("Passwords do not match");
        return;
    }
    setStatus("loading");
    await new Promise((r) => setTimeout(r, 1500));
    setStatus("success");
    setStep("success");
  }

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const stepVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { staggerChildren: 0.1 }
    },
    exit: { opacity: 0, x: -20 }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
  };

  const otpGroupVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center p-4 md:p-8 bg-gray-50 dark:bg-black/20 overflow-hidden relative">
      <div className="absolute inset-0 pointer-events-none">
        <Particles count={15} className="opacity-40" />
      </div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full max-w-5xl flex flex-col md:flex-row bg-white dark:bg-gray-900 rounded-[2.5rem] overflow-hidden shadow-2xl relative z-10 border border-gray-100 dark:border-white/10"
      >
        {/* Image/Brand Side - Left */}
        <div className="hidden md:flex md:w-1/2 bg-primary relative p-12 flex-col justify-between overflow-hidden">
          {/* Background decorative elements */}
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
              key={step}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="font-display text-4xl lg:text-5xl font-bold text-white leading-tight flex flex-col gap-2"
            >
              {step === "email" && (
                <>
                  <div className="flex items-center gap-4">Forgot</div>
                  Password?
                </>
              )}
              {step === "otp" && (
                <>
                  <div className="flex items-center gap-4">Verify</div>
                  Code
                </>
              )}
              {step === "new-password" && (
                <>
                  <div className="flex items-center gap-4">New</div>
                  Password
                </>
              )}
              {step === "success" && (
                <>
                  <div className="flex items-center gap-4">Reset</div>
                  Complete
                </>
              )}
            </motion.h2>
            <motion.div
              key={`desc-${step}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-6 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10"
            >
              <p className="text-white/90 text-sm leading-relaxed">
                {step === "email" && "Don't worry! It happens. Please enter the email address associated with your account."}
                {step === "otp" && `We've sent a 6-digit verification code to ${email || 'your email'}. Please enter it below.`}
                {step === "new-password" && "Create a strong password for your account. Make sure it's something you can remember."}
                {step === "success" && "Your password has been successfully reset. You can now login with your new password."}
              </p>
            </motion.div>
          </div>

          <div className="relative z-10 flex gap-4">
             <div className="text-white/60 text-xs flex flex-col justify-center">
              <span>Secure & Safe Recovery</span>
            </div>
          </div>
        </div>

        {/* Form Side - Right */}
        <div className="w-full md:w-1/2 p-8 md:p-12 lg:p-16 bg-white dark:bg-gray-950 flex flex-col justify-center">
          <div className="max-w-md mx-auto w-full">
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

            <AnimatePresence mode="wait">
              {step === "email" && (
                <motion.div
                  key="email-step"
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <motion.div variants={itemVariants}>
                    <h1 className="font-display text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                      Reset Password
                    </h1>
                    <p className="mt-2 text-gray-500 dark:text-gray-400">
                      Enter your email address and we'll send you a link to reset your password.
                    </p>
                  </motion.div>

                  <form className="mt-8 space-y-6" onSubmit={onEmailSubmit}>
                    <motion.div variants={itemVariants}>
                      <label htmlFor="reset-email" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                        Email Address
                      </label>
                      <input
                        id="reset-email"
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full bg-gray-50 dark:bg-gray-900 rounded-2xl px-4 py-3 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                        placeholder="name@example.com"
                        autoComplete="email"
                      />
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <button
                        type="submit"
                        disabled={status === "loading"}
                        className="w-full bg-primary text-primary-foreground font-semibold rounded-2xl px-6 py-4 shadow-xl shadow-primary/20 hover:shadow-primary/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {status === "loading" ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Sending Code...
                          </>
                        ) : (
                          <>
                            Send Verification Code
                            <IconArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </motion.div>
                  </form>
                </motion.div>
              )}

              {step === "otp" && (
                <motion.div
                  key="otp-step"
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                   <motion.div variants={itemVariants}>
                    <h1 className="font-display text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                      Enter Code
                    </h1>
                    <p className="mt-2 text-gray-500 dark:text-gray-400">
                      We've sent a 6-digit code to <span className="font-semibold text-gray-900 dark:text-white">{email}</span>
                    </p>
                  </motion.div>

                  <motion.form
                    initial="hidden"
                    animate="visible"
                    variants={containerVariants}
                    className="mt-8 space-y-8"
                    onSubmit={onOtpSubmit}
                  >
                    <motion.div variants={otpGroupVariants} className="flex justify-center gap-3 sm:gap-4">
                      {otpDigits.map((digit, i) => (
                        <motion.div key={i} variants={itemVariants} className="relative">
                          <input
                            ref={(el) => { otpInputsRef.current[i] = el; }}
                            type="text"
                            inputMode="numeric"
                            maxLength={1}
                            value={digit}
                            onChange={(e) => handleOtpChange(i, e.target.value)}
                            onKeyDown={(e) => handleOtpKeyDown(i, e)}
                            onPaste={i === 0 ? handleOtpPaste : undefined}
                            className={`w-11 h-14 sm:w-14 sm:h-16 rounded-xl text-center text-2xl font-bold border-2 outline-none transition-all duration-200
                              ${digit
                                ? "bg-white dark:bg-gray-800 border-primary text-primary shadow-lg shadow-primary/20 scale-105 z-10"
                                : "bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white hover:border-gray-300 dark:hover:border-gray-700 focus:border-primary focus:bg-white dark:focus:bg-gray-800 focus:shadow-lg focus:shadow-primary/10 focus:scale-105 focus:z-10"
                              }
                            `}
                          />
                          {!digit && (
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                              <div className="w-2 h-2 rounded-full bg-gray-200 dark:bg-gray-800" />
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <button
                        type="submit"
                        disabled={status === "loading" || otpDigits.join("").length !== otpLength}
                        className="w-full bg-primary text-primary-foreground font-semibold rounded-2xl px-6 py-4 shadow-xl shadow-primary/20 hover:shadow-primary/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {status === "loading" ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Verifying...
                          </>
                        ) : (
                          <>
                            Verify & Proceed
                            <IconArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </motion.div>

                    <div className="text-center text-sm">
                      <span className="text-gray-500 dark:text-gray-400">Didn't receive code? </span>
                      <button
                        type="button"
                        onClick={async () => {
                          if (timeLeft > 0 || isResending) return;
                          setIsResending(true);
                          await new Promise(r => setTimeout(r, 1500));
                          setTimeLeft(30);
                          setIsResending(false);
                        }}
                        disabled={timeLeft > 0 || isResending}
                        className="text-primary hover:underline font-medium disabled:opacity-50 disabled:cursor-not-allowed disabled:no-underline transition-colors"
                      >
                        {isResending ? "Sending..." : timeLeft > 0 ? `Resend in ${timeLeft}s` : "Resend"}
                      </button>
                    </div>
                  </motion.form>
                </motion.div>
              )}

              {step === "new-password" && (
                <motion.div
                  key="password-step"
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                >
                  <motion.div variants={itemVariants}>
                    <h1 className="font-display text-3xl font-bold tracking-tight text-gray-900 dark:text-white">
                      New Password
                    </h1>
                    <p className="mt-2 text-gray-500 dark:text-gray-400">
                      Your identity has been verified. Set your new password.
                    </p>
                  </motion.div>

                  <form className="mt-8 space-y-6" onSubmit={onPasswordSubmit}>
                    <motion.div variants={itemVariants}>
                      <label htmlFor="new-password" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                        New Password
                      </label>
                      <input
                        id="new-password"
                        type="password"
                        required
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="w-full bg-gray-50 dark:bg-gray-900 rounded-2xl px-4 py-3 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                        placeholder="••••••••"
                      />
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <label htmlFor="confirm-password" className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                        Confirm Password
                      </label>
                      <input
                        id="confirm-password"
                        type="password"
                        required
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full bg-gray-50 dark:bg-gray-900 rounded-2xl px-4 py-3 border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:border-primary focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                        placeholder="••••••••"
                      />
                    </motion.div>

                    <motion.div variants={itemVariants}>
                      <button
                        type="submit"
                        disabled={status === "loading"}
                        className="w-full bg-primary text-primary-foreground font-semibold rounded-2xl px-6 py-4 shadow-xl shadow-primary/20 hover:shadow-primary/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {status === "loading" ? (
                          <>
                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Updating...
                          </>
                        ) : (
                          <>
                            Reset Password
                            <IconArrowRight className="w-4 h-4" />
                          </>
                        )}
                      </button>
                    </motion.div>
                  </form>
                </motion.div>
              )}

              {step === "success" && (
                <motion.div
                  key="success-step"
                  variants={stepVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="mt-8 p-6 bg-green-500/10 border border-green-500/20 rounded-2xl text-center"
                >
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                  </div>
                  <h3 className="text-green-800 dark:text-green-200 font-semibold text-lg mb-2">Password Reset Successful</h3>
                  <p className="text-green-700 dark:text-green-300 text-sm mb-6">
                    Your password has been successfully updated.
                  </p>
                  <Link
                    href="/login"
                    className="inline-flex items-center justify-center w-full px-4 py-3 text-sm font-medium text-green-700 bg-green-100 rounded-xl hover:bg-green-200 transition-colors"
                  >
                    <IconArrowRight className="w-4 h-4 mr-2 rotate-180" />
                    Back to Login
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div variants={itemVariants} className="mt-8 text-center">
              <Link href="/login" className="text-sm text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors inline-flex items-center gap-1">
                <IconArrowRight className="w-3 h-3 rotate-180" />
                Back to Login
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
