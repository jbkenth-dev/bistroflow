"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef } from "react";
import { 
  IconCheck, IconAlertCircle, IconClose, IconInfo 
} from "@/components/ui/icons";

export type AlertType = 'success' | 'error' | 'warning' | 'info';

interface AlertBoxProps {
  type: AlertType;
  title: string;
  message: string;
  onClose: () => void;
  duration?: number;
}

const styles = {
  error: {
    bg: "bg-white dark:bg-zinc-900",
    border: "border-l-4 border-red-500",
    iconColor: "text-red-500",
    iconBg: "bg-red-500/10",
    titleColor: "text-red-600 dark:text-red-400",
    shadow: "shadow-2xl shadow-red-500/20"
  },
  warning: {
    bg: "bg-white dark:bg-zinc-900",
    border: "border-l-4 border-amber-500",
    iconColor: "text-amber-500",
    iconBg: "bg-amber-500/10",
    titleColor: "text-amber-600 dark:text-amber-400",
    shadow: "shadow-2xl shadow-amber-500/20"
  },
  info: {
    bg: "bg-white dark:bg-zinc-900",
    border: "border-l-4 border-blue-500",
    iconColor: "text-blue-500",
    iconBg: "bg-blue-500/10",
    titleColor: "text-blue-600 dark:text-blue-400",
    shadow: "shadow-2xl shadow-blue-500/20"
  },
  success: {
    bg: "bg-white dark:bg-zinc-900",
    border: "border-l-4 border-green-500",
    iconColor: "text-green-500",
    iconBg: "bg-green-500/10",
    titleColor: "text-green-600 dark:text-green-400",
    shadow: "shadow-2xl shadow-green-500/20"
  }
};

const icons = {
  error: IconAlertCircle,
  warning: IconAlertCircle,
  info: IconInfo,
  success: IconCheck
};

export function AlertBox({ type, title, message, onClose, duration = 0 }: AlertBoxProps) {
  const alertRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Auto-close timer
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  // Focus Trap & Keyboard Navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
      
      // Simple focus trap
      if (e.key === "Tab" && alertRef.current) {
        const focusableElements = alertRef.current.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement?.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement?.focus();
          }
        }
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    
    // Lock body scroll
    document.body.style.overflow = "hidden";
    
    // Focus the close button initially for accessibility
    setTimeout(() => closeButtonRef.current?.focus(), 50);

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [onClose]);

  const style = styles[type];
  const Icon = icons[type];

  return (
    <motion.div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4" 
      role="presentation"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      
      <motion.div
        ref={alertRef}
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ 
          type: "spring", 
          stiffness: 350, 
          damping: 25 
        }}
        className={`relative w-full max-w-md rounded-2xl p-6 md:p-8 shadow-2xl ${style.bg} ${style.border} ${style.shadow}`}
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="alert-title"
        aria-describedby="alert-message"
      >
        <button 
          ref={closeButtonRef}
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-gray-400 hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors focus:outline-none focus:ring-2 focus:ring-primary"
          aria-label="Close notification"
        >
          <IconClose className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center">
          <motion.div 
            initial={{ scale: 0, rotate: -45 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 300, damping: 15 }}
            className={`w-16 h-16 rounded-full flex items-center justify-center mb-5 ${style.iconBg} ${style.iconColor}`}
          >
            <Icon className="w-8 h-8" />
          </motion.div>

          <h3 id="alert-title" className={`text-xl font-bold mb-3 ${style.titleColor}`}>
            {title}
          </h3>
          
          <p id="alert-message" className="text-gray-600 dark:text-zinc-300 text-base leading-relaxed">
            {message}
          </p>
        </div>

        {/* Progress bar for auto-dismiss */}
        {duration > 0 && (
          <div className="absolute bottom-0 left-0 h-1 bg-gray-100 dark:bg-zinc-800 w-full overflow-hidden rounded-b-2xl">
            <motion.div
              initial={{ width: "100%" }}
              animate={{ width: "0%" }}
              transition={{ duration: duration / 1000, ease: "linear" }}
              className={`h-full ${style.iconBg.replace('/10', '')}`} 
            />
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}
