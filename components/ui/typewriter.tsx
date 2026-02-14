 "use client";
 import { useEffect, useState } from "react";
 import { motion } from "framer-motion";

export function TypewriterH1({
  text,
  className,
  glow,
  id,
  loop,
  pauseMs,
  speedMs,
  inline
}: {
  text: string;
  className?: string;
  glow?: boolean;
  id?: string;
  loop?: boolean;
  pauseMs?: number;
  speedMs?: number;
  inline?: boolean;
}) {
   const [display, setDisplay] = useState("");
   useEffect(() => {
     setDisplay("");
     let i = 0;
    const speed = speedMs ?? 35;
    let paused = false;
    const timer = setInterval(() => {
      if (i < text.length) {
        i++;
        setDisplay(text.slice(0, i));
      } else if (loop && !paused) {
        paused = true;
        setTimeout(() => {
          i = 0;
          paused = false;
          setDisplay("");
        }, pauseMs ?? 1000);
      }
    }, speed);
     return () => clearInterval(timer);
  }, [text, loop, pauseMs]);

  if (inline) {
    return (
      <motion.span
        id={id}
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`${className ?? ""} ${glow ? "text-glow-strong" : ""}`}
        aria-label={text}
      >
        {display}
      </motion.span>
    );
  }
  return (
    <motion.h1
      id={id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={`${className ?? ""} ${glow ? "text-glow-strong" : ""}`}
      aria-label={text}
    >
      {display}
    </motion.h1>
  );
 }
