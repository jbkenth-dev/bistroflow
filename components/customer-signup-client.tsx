 "use client";

 import { motion } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useState, useEffect } from "react";
import { IconEye, IconEyeOff } from "@/components/ui/icons";
import { Particles } from "@/components/ui/particles";
import { Modal, ModalBody } from "@/components/ui/modal";
import { useAuth } from "@/store/auth";

export function CustomerSignupClient() {
   const router = useRouter();
   const { login } = useAuth();
   const [firstName, setFirstName] = useState("");
   const [middleName, setMiddleName] = useState("");
   const [lastName, setLastName] = useState("");
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
  const canSubmit = firstName && lastName && email && pwd && pwd2 && pwd === pwd2 && score >= 3 && status !== "loading";
  const barColor = score <= 2 ? "bg-red-500" : score === 3 ? "bg-yellow-500" : "bg-green-500";

  useEffect(() => {
    if (status === "success") {
      const timer = setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [status, router]);

  async function onSubmit(e: React.FormEvent) {
     e.preventDefault();
     if (!canSubmit) return;
     setStatus("loading");
     setErrorMsg(null);

     try {
       const response = await fetch("http://localhost/bistroflow/bistroflow/php-backend/public/api/register.php", {
         method: "POST",
         headers: {
           "Content-Type": "application/json",
         },
         body: JSON.stringify({
           firstName,
           middleName,
           lastName,
           email,
           password: pwd,
         }),
       });

       const data = await response.json();

       if (!response.ok) {
         throw new Error(data.message || "Registration failed");
       }

       // Auto login on success
       login({
         id: data.userId,
         firstName: firstName,
         lastName: lastName,
         name: `${firstName} ${lastName}`,
         email: email,
         role: 'customer'
       });

       setStatus("success");
     } catch (err) {
       setStatus("error");
       setErrorMsg(err instanceof Error ? err.message : "Something went wrong");
     }
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
        <Particles count={20} className="opacity-50" />
      </div>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="w-full max-w-5xl flex flex-col md:flex-row glass rounded-[2.5rem] overflow-hidden shadow-2xl relative z-10 border border-white/20"
      >
        {/* Brand Side */}
        <div className="hidden md:flex md:w-1/2 bg-primary relative p-12 flex-col justify-between overflow-hidden">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="absolute -right-20 -bottom-20 w-80 h-80 bg-white/10 rounded-full blur-3xl"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            className="absolute -left-20 -top-20 w-64 h-64 bg-orange-400/20 rounded-full blur-3xl"
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
              className="font-display text-4xl lg:text-5xl font-bold text-white leading-tight flex flex-col gap-2"
            >
              <div className="flex items-center gap-4">
                Hi
                <motion.span
                  animate={{ rotate: [0, 14, -8, 14, -4, 10, 0, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1 }}
                  className="inline-block origin-[70%_70%]"
                >
                  👋
                </motion.span>
              </div>
              Welcome
            </motion.h2>
            <motion.div variants={itemVariants} className="mt-6 flex items-start gap-4 p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
              <div className="p-2 bg-white rounded-xl text-orange-500 shrink-0 shadow-lg">
                 <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-map-pin"><path d="M20 10c0 6-9 13-9 13s-9-7-9-13a9 9 0 0 1 18 0Z"/><circle cx="12" cy="10" r="3"/></svg>
              </div>
              <div>
                <h3 className="text-white font-bold text-lg mb-1">Our Location</h3>
                <p className="text-white/80 text-sm leading-relaxed">
                  National Highway beside Sea Oil,<br/>Guihulngan City, Negros Oriental
                </p>
              </div>
            </motion.div>
          </div>

          <div className="relative z-10 flex gap-4">
            <div className="flex -space-x-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-primary bg-white/20 backdrop-blur-sm flex items-center justify-center text-[10px] font-bold text-white">
                  {i}
                </div>
              ))}
            </div>
            <div className="text-white/60 text-xs flex flex-col justify-center">
              <span className="font-bold text-white">6 Reviews</span>
              <span>Across guihulngan city</span>
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
              <h1 id="signup-title" className="font-display text-3xl font-bold tracking-tight text-foreground">
                Create Account
              </h1>
              <p className="mt-2 text-muted-foreground">Join Bistroflow and start your culinary journey.</p>
            </motion.div>

            {status === "error" && errorMsg && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-red-500/10 border border-red-500/20 rounded-xl text-red-600 dark:text-red-400 text-sm text-center font-medium"
              >
                {errorMsg}
              </motion.div>
            )}

            <form className="mt-8 space-y-5" onSubmit={onSubmit} aria-describedby={errorMsg ? "signup-error" : undefined}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <motion.div variants={itemVariants}>
                  <label htmlFor="signup-firstname" className="block text-sm font-medium mb-2 text-foreground/80">
                    First Name
                  </label>
                  <input
                    id="signup-firstname"
                    type="text"
                    required
                    className="w-full bg-white/50 dark:bg-white/5 rounded-2xl px-4 py-3 border border-white/20 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                    placeholder="John"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <label htmlFor="signup-middlename" className="block text-sm font-medium mb-2 text-foreground/80">
                    Middle Name
                  </label>
                  <input
                    id="signup-middlename"
                    type="text"
                    className="w-full bg-white/50 dark:bg-white/5 rounded-2xl px-4 py-3 border border-white/20 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                    placeholder="Quincy"
                    value={middleName}
                    onChange={(e) => setMiddleName(e.target.value)}
                  />
                </motion.div>

                <motion.div variants={itemVariants}>
                  <label htmlFor="signup-lastname" className="block text-sm font-medium mb-2 text-foreground/80">
                    Last Name
                  </label>
                  <input
                    id="signup-lastname"
                    type="text"
                    required
                    className="w-full bg-white/50 dark:bg-white/5 rounded-2xl px-4 py-3 border border-white/20 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                    placeholder="Doe"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </motion.div>
              </div>

              <motion.div variants={itemVariants}>
                <label htmlFor="signup-email" className="block text-sm font-medium mb-2 text-foreground/80">
                  Email Address
                </label>
                <input
                  id="signup-email"
                  type="email"
                  required
                  className="w-full bg-white/50 dark:bg-white/5 rounded-2xl px-4 py-3 border border-white/20 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <label htmlFor="signup-password" className="block text-sm font-medium mb-2 text-foreground/80">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="signup-password"
                    type={show1 ? "text" : "password"}
                    required
                    className="w-full bg-white/50 dark:bg-white/5 rounded-2xl px-4 py-3 pr-12 border border-white/20 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                    placeholder="••••••••"
                    value={pwd}
                    onChange={(e) => setPwd(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShow1((v) => !v)}
                    className="absolute inset-y-0 right-3 flex items-center p-2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {show1 ? <IconEyeOff className="w-5 h-5" /> : <IconEye className="w-5 h-5" />}
                  </button>
                </div>

                <div className="mt-3">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-muted-foreground">Strength: <span className="font-semibold text-foreground">{label}</span></span>
                    <span className="text-muted-foreground font-medium">{pct}%</span>
                  </div>
                  <div className="h-1.5 w-full rounded-full bg-black/5 dark:bg-white/5 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${pct}%` }}
                      className={`h-full rounded-full transition-colors duration-500 ${barColor}`}
                    />
                  </div>
                </div>
              </motion.div>

              <motion.div variants={itemVariants}>
                <label htmlFor="signup-password-2" className="block text-sm font-medium mb-2 text-foreground/80">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="signup-password-2"
                    type={show2 ? "text" : "password"}
                    required
                    className="w-full bg-white/50 dark:bg-white/5 rounded-2xl px-4 py-3 pr-12 border border-white/20 focus:border-primary/50 focus:ring-4 focus:ring-primary/10 outline-none transition-all"
                    placeholder="••••••••"
                    value={pwd2}
                    onChange={(e) => setPwd2(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShow2((v) => !v)}
                    className="absolute inset-y-0 right-3 flex items-center p-2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {show2 ? <IconEyeOff className="w-5 h-5" /> : <IconEye className="w-5 h-5" />}
                  </button>
                </div>
              </motion.div>

              {pwd && pwd2 && pwd !== pwd2 && (
                <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-xs text-destructive">
                  Passwords do not match.
                </motion.p>
              )}

              <motion.div variants={itemVariants} className="pt-2">
                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="w-full bg-primary text-primary-foreground font-semibold rounded-2xl px-6 py-4 shadow-xl shadow-primary/20 hover:shadow-primary/30 active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 transition-all flex items-center justify-center gap-2"
                >
                  {status === "loading" ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Creating Account...
                    </>
                  ) : (
                    "Create Account"
                  )}
                </button>
              </motion.div>
            </form>

            <motion.div variants={itemVariants} className="mt-8 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/login" className="text-primary font-semibold hover:underline">
                  Sign in
                </Link>
              </p>
            </motion.div>

            <Modal
              isOpen={status === "success"}
              onClose={() => {}}
              hideCloseButton={true}
              className="max-w-sm"
            >
              <ModalBody className="flex flex-col items-center justify-center py-8 text-center">
                <motion.div
                  initial={{ scale: 0, rotate: -45 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", duration: 0.5 }}
                  className="mb-4 rounded-full bg-green-100 p-3 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-8 w-8"
                  >
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                </motion.div>
                <motion.h3
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  className="mb-2 text-xl font-bold text-gray-900 dark:text-white"
                >
                  Welcome to the family!
                </motion.h3>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-sm text-gray-500 dark:text-gray-400"
                >
                  Redirecting to dashboard...
                </motion.p>
                <div className="mt-6 w-full max-w-[200px]">
                  <div className="h-1.5 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 1.5, ease: "easeInOut" }}
                      className="h-full bg-green-500"
                    />
                  </div>
                </div>
              </ModalBody>
            </Modal>
          </div>
        </div>
      </motion.div>
    </section>
  );
 }
