 "use client";
 
 import { motion } from "framer-motion";
 import Link from "next/link";
 
 export function ForgotPasswordClient() {
   return (
     <section aria-labelledby="forgot-title" className="relative h-[100dvh] overflow-hidden">
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
                 <h1 id="forgot-title" className="font-display text-2xl md:text-3xl font-bold tracking-tight">Forgot Password</h1>
                 <p className="mt-2 text-sm opacity-80">Enter your email to receive a reset link.</p>
               </div>
               <form className="mt-4 space-y-4" onSubmit={(e) => e.preventDefault()}>
                 <div>
                   <label htmlFor="forgot-email" className="block text-sm opacity-80 mb-1">Email</label>
                   <input
                     id="forgot-email"
                     type="email"
                     className="w-full glass rounded-xl px-3 py-2 border border-white/10 focus:ring-2 focus:ring-primary/50 outline-none"
                     placeholder="you@bistroflow.com"
                     autoComplete="email"
                   />
                 </div>
                 <motion.button
                   whileHover={{ scale: 1.02 }}
                   whileTap={{ scale: 0.98 }}
                   className="mt-2 w-full rounded-xl bg-primary text-primary-foreground px-4 py-3 inline-flex items-center justify-center"
                 >
                   Send Reset Link
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
