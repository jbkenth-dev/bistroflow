 "use client";

 import { motion } from "framer-motion";
 import Link from "next/link";
 import { useEffect, useRef, useState } from "react";

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
     <section aria-labelledby="otp-title" className="relative h-[100dvh] overflow-hidden">
       <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-transparent pointer-events-none" />
       <div className="relative z-10 h-full flex items-center">
         <div className="container-edge w-full">
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
               className="glass rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow backdrop-blur"
             >
               <div className="text-center">
                 <h1 id="otp-title" className="font-display text-2xl md:text-3xl font-bold tracking-tight">Verify Code</h1>
                 <p className="mt-2 text-sm opacity-80">Enter the 6‑digit code sent to your email.</p>
               </div>

               <form className="mt-4 space-y-5" onSubmit={onSubmit}>
                 <motion.div
                   role="group"
                   aria-labelledby="otp-title"
                   aria-describedby={errorMsg ? "otp-error" : undefined}
                   aria-invalid={status === "error" ? "true" : "false"}
                   onPaste={handlePaste}
                   animate={shake}
                   transition={{ duration: 0.45 }}
                   className="flex items-center justify-center gap-3"
                 >
                   {digits.map((d, i) => (
                     <motion.input
                       key={i}
                       ref={(el: HTMLInputElement | null) => {
                         inputsRef.current[i] = el;
                       }}
                       value={d}
                       onChange={(e) => handleChange(i, e.target.value)}
                       onKeyDown={(e) => handleKeyDown(i, e)}
                       type="text"
                       inputMode="numeric"
                       pattern="\d*"
                       autoComplete="one-time-code"
                       maxLength={1}
                       aria-label={`Digit ${i + 1}`}
                       className="w-12 h-12 md:w-14 md:h-14 text-center text-xl md:text-2xl glass rounded-xl border border-white/10 focus:ring-2 focus:ring-primary/50 outline-none"
                       initial={{ scale: 0.98, opacity: 0 }}
                       animate={{ scale: 1, opacity: 1 }}
                       transition={{ delay: i * 0.03 }}
                     />
                   ))}
                 </motion.div>

                 {errorMsg ? (
                   <motion.div
                     id="otp-error"
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 1 }}
                     className="text-center text-sm text-red-500"
                   >
                     {errorMsg}
                   </motion.div>
                 ) : null}

                 {status === "success" ? (
                   <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center text-sm text-green-500">
                     Code verified
                   </motion.div>
                 ) : null}

                 <motion.button
                   whileHover={{ scale: 1.02 }}
                   whileTap={{ scale: 0.98 }}
                   aria-busy={status === "loading" ? "true" : "false"}
                   disabled={!isComplete || status === "loading" || status === "success"}
                   className="mt-1 w-full rounded-xl bg-primary text-primary-foreground px-4 py-3 inline-flex items-center justify-center disabled:opacity-60"
                 >
                   {status === "loading" ? "Verifying…" : status === "success" ? "Verified" : "Verify"}
                 </motion.button>
               </form>

               <div className="mt-4 text-center text-sm">
                 <Link href="/admin/login" className="glass rounded-xl px-3 py-2 inline-block hover:bg-accent/50">Back to Login</Link>
               </div>
             </motion.div>
           </motion.div>
         </div>
       </div>
     </section>
   );
 }
