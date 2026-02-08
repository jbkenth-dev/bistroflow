"use client";
import { useMemo } from "react";
import { motion } from "framer-motion";

export function Particles({
  count = 16,
  className = "",
  colorClass = "bg-primary/20"
}: { count?: number; className?: string; colorClass?: string }) {
  const dots = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => {
      const left = Math.random() * 100;
      const top = Math.random() * 100;
      const size = 4 + Math.random() * 6;
      const delay = Math.random() * 2;
      const duration = 6 + Math.random() * 6;
      return { id: i, left, top, size, delay, duration };
    });
  }, [count]);
  return (
    <div className={`absolute inset-0 ${className}`} aria-hidden>
      {dots.map((d) => (
        <motion.span
          key={d.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ delay: d.delay, duration: 0.8 }}
          style={{ left: `${d.left}%`, top: `${d.top}%`, width: d.size, height: d.size }}
          className={`absolute rounded-full ${colorClass}`}
        >
          <motion.span
            initial={{ y: 0 }}
            animate={{ y: [0, -10, 0] }}
            transition={{ repeat: Infinity, duration: d.duration, ease: "easeInOut" }}
            className="absolute inset-0 rounded-full blur-[2px]"
          />
        </motion.span>
      ))}
    </div>
  );
}
