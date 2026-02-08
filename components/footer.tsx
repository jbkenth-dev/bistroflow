 "use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { btnPrimary } from "@/components/ui/button-classes";

export function Footer() {
  return (
    <footer className="mt-16">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="container-edge"
      >
        <div className="rounded-2xl glass px-6 py-10 md:px-10 md:py-12 border-t border-white/10">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <Link href="/" className="inline-flex items-center gap-2">
                <span className="font-display text-xl font-semibold">
                  <span className="text-primary">BISTRO</span>
                  <span>FLOW</span>
                </span>
              </Link>
              <p className="mt-3 text-sm opacity-80">
                Integrated order & reservation experience with modern marketplace UI.
              </p>
            </div>
          </div>
          <div className="mt-8 pt-6 border-t border-white/10 text-xs flex flex-col md:flex-row items-center justify-between gap-4">
            <motion.p initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
              © {new Date().getFullYear()} East Gate Bistro • Bistroflow
            </motion.p>
          </div>
        </div>
      </motion.div>
    </footer>
  );
}
