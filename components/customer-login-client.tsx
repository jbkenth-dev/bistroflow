 "use client";
 
 import { motion } from "framer-motion";
 import Link from "next/link";
 import { useState } from "react";
 import { IconEye, IconEyeOff } from "@/components/ui/icons";
 
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
 
  return (
    <section aria-labelledby="login-title" className="relative min-h-[70dvh] py-10 overflow-hidden">
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
                 <h1 id="login-title" className="mt-2 font-display text-2xl md:text-3xl font-bold tracking-tight">Welcome Back</h1>
                 <p className="mt-1 text-sm opacity-80">Log in to continue your order.</p>
               </div>
 
               <form className="mt-4 space-y-4" onSubmit={onSubmit} aria-describedby={errorMsg ? "login-error" : undefined}>
                 <div>
                   <label htmlFor="login-email" className="block text-sm opacity-80 mb-1">Email</label>
                   <input id="login-email" type="email" className="w-full glass rounded-xl px-3 py-2 border border-white/10 focus:ring-2 focus:ring-primary/50 outline-none" placeholder="you@example.com" autoComplete="email" />
                 </div>
                 <div>
                   <label htmlFor="login-password" className="block text-sm opacity-80 mb-1">Password</label>
                   <div className="relative">
                     <input id="login-password" type={show ? "text" : "password"} className="w-full glass rounded-xl px-3 py-2 pr-12 border border-white/10 focus:ring-2 focus:ring-primary/50 outline-none" placeholder="Enter password" autoComplete="current-password" aria-invalid={status === "error" ? "true" : "false"} />
                     <motion.button type="button" onClick={() => setShow((v) => !v)} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} aria-label={show ? "Hide password" : "Show password"} className="absolute inset-y-0 right-2 flex items-center p-1 rounded-md hover:bg-white/5">
                       {show ? <IconEyeOff className="w-5 h-5" /> : <IconEye className="w-5 h-5" />}
                     </motion.button>
                   </div>
                 </div>
 
                 {errorMsg ? (
                   <motion.div id="login-error" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-red-500">{errorMsg}</motion.div>
                 ) : null}
                 {status === "success" ? <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-green-500">Logged in</motion.div> : null}
 
                 <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} aria-busy={status === "loading" ? "true" : "false"} className="mt-2 w-full rounded-xl bg-primary text-primary-foreground px-4 py-3 inline-flex items-center justify-center">
                   {status === "loading" ? "Signing in…" : "Sign In"}
                 </motion.button>
               </form>
 
               <div className="mt-4 text-center text-sm">
                 <Link href="/signup" className="glass rounded-xl px-3 py-2 inline-block hover:bg-accent/50">Create an account</Link>
               </div>
             </motion.div>
           </motion.div>
         </div>
       </div>
     </section>
   );
 }
