 "use client";

 import { motion } from "framer-motion";
 import Link from "next/link";
 import { useMemo, useState } from "react";
 import { IconEye, IconEyeOff } from "@/components/ui/icons";

 export function CustomerSignupClient() {
   const [name, setName] = useState("");
   const [email, setEmail] = useState("");
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
   const pct = useMemo(() => Math.round((score / 5) * 100), [score]);
   const label = score <= 2 ? "Weak" : score === 3 ? "Medium" : "Strong";
   const canSubmit = name && email && pwd && pwd2 && pwd === pwd2 && score >= 3 && status !== "loading";

   async function onSubmit(e: React.FormEvent) {
     e.preventDefault();
     if (!canSubmit) return;
     setStatus("loading");
     setErrorMsg(null);
     await new Promise((r) => setTimeout(r, 1000));
     setStatus("success");
   }
   const barColor = score <= 2 ? "bg-red-500" : score === 3 ? "bg-yellow-500" : "bg-green-500";

   return (
     <section aria-labelledby="signup-title" className="relative h-[100dvh] overflow-hidden">
       <div className="absolute inset-0 bg-gradient-to-b from-black/10 to-transparent pointer-events-none" />
       <div className="relative z-10 h-full flex items-center">
         <div className="container-edge w-full">
           <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-md mx-auto w-full">
            <motion.div initial={{ scale: 0.98, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 420, damping: 32 }} className="glass rounded-2xl p-6 shadow-md hover:shadow-lg transition-shadow backdrop-blur">
               <div className="text-center">
                 <Link href="/" className="font-display text-xl font-bold tracking-tight">
                   <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-orange-400 to-orange-600">BISTRO</span>
                   <span className="text-black">FLOW</span>
                 </Link>
                 <h1 id="signup-title" className="mt-2 font-display text-2xl md:text-3xl font-bold tracking-tight">Create Account</h1>
                 <p className="mt-1 text-sm opacity-80">Join Bistroflow to order faster.</p>
               </div>

               <form className="mt-4 space-y-4" onSubmit={onSubmit} aria-describedby={errorMsg ? "signup-error" : undefined}>
                 <div>
                   <label htmlFor="signup-name" className="block text-sm opacity-80 mb-1">Full Name</label>
                   <input id="signup-name" type="text" className="w-full glass rounded-xl px-3 py-2 border border-white/10 focus:ring-2 focus:ring-primary/50 outline-none" placeholder="Your name" value={name} onChange={(e) => setName(e.target.value)} />
                 </div>
                 <div>
                   <label htmlFor="signup-email" className="block text-sm opacity-80 mb-1">Email</label>
                   <input id="signup-email" type="email" className="w-full glass rounded-xl px-3 py-2 border border-white/10 focus:ring-2 focus:ring-primary/50 outline-none" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                 </div>
                 <div>
                   <label htmlFor="signup-password" className="block text-sm opacity-80 mb-1">Password</label>
                   <div className="relative">
                     <input id="signup-password" type={show1 ? "text" : "password"} className="w-full glass rounded-xl px-3 py-2 pr-12 border border-white/10 focus:ring-2 focus:ring-primary/50 outline-none" placeholder="Enter password" value={pwd} onChange={(e) => setPwd(e.target.value)} aria-invalid={status === "error" ? "true" : "false"} />
                     <motion.button type="button" onClick={() => setShow1((v) => !v)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} aria-label={show1 ? "Hide password" : "Show password"} className="absolute inset-y-0 right-2 flex items-center p-1 rounded-md hover:bg-white/5">
                       {show1 ? <IconEyeOff className="w-5 h-5" /> : <IconEye className="w-5 h-5" />}
                     </motion.button>
                   </div>
                   <div className="mt-3">
                     <div className="flex items-center justify-between">
                       <span className="text-sm opacity-80">Strength: {label}</span>
                       <span className="text-xs opacity-60">{pct}%</span>
                     </div>
                     <div className="mt-2 h-2 w-full rounded-full bg-white/10 overflow-hidden">
                       <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ type: "spring", stiffness: 260, damping: 30 }} className={`h-full ${barColor}`} />
                     </div>
                   </div>
                 </div>
                 <div>
                   <label htmlFor="signup-password-2" className="block text-sm opacity-80 mb-1">Confirm Password</label>
                   <div className="relative">
                     <input id="signup-password-2" type={show2 ? "text" : "password"} className="w-full glass rounded-xl px-3 py-2 pr-12 border border-white/10 focus:ring-2 focus:ring-primary/50 outline-none" placeholder="Re-enter password" value={pwd2} onChange={(e) => setPwd2(e.target.value)} aria-invalid={status === "error" ? "true" : "false"} />
                     <motion.button type="button" onClick={() => setShow2((v) => !v)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} aria-label={show2 ? "Hide password" : "Show password"} className="absolute inset-y-0 right-2 flex items-center p-1 rounded-md hover:bg-white/5">
                       {show2 ? <IconEyeOff className="w-5 h-5" /> : <IconEye className="w-5 h-5" />}
                     </motion.button>
                   </div>
                 </div>

                 {pwd && pwd2 && pwd !== pwd2 ? <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-red-500">Passwords do not match.</motion.div> : null}
                 {errorMsg ? <motion.div id="signup-error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-red-500">{errorMsg}</motion.div> : null}
                 {status === "success" ? <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-green-500">Account created</motion.div> : null}

                 <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} disabled={!canSubmit} aria-busy={status === "loading" ? "true" : "false"} className="mt-2 w-full rounded-xl bg-primary text-primary-foreground px-4 py-3 inline-flex items-center justify-center disabled:opacity-60">
                   {status === "loading" ? "Creating…" : "Create Account"}
                 </motion.button>
               </form>

               <div className="mt-4 text-center text-sm">
                 <Link href="/login" className="glass rounded-xl px-3 py-2 inline-block hover:bg-accent/50">Already have an account? Sign in</Link>
               </div>
             </motion.div>
           </motion.div>
         </div>
       </div>
     </section>
   );
 }
