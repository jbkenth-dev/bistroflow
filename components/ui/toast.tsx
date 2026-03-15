"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  IconCheck, IconAlertCircle, IconClose 
} from "@/components/ui/icons";
import { useEffect } from "react";

interface ToastProps {
  type: 'success' | 'error';
  message: string;
  onClose: () => void;
  duration?: number;
}

export function Toast({ type, message, onClose, duration = 4000 }: ToastProps) {
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(onClose, duration);
      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9, x: "-50%", y: "-50%" }}
      animate={{ opacity: 1, scale: 1, x: "-50%", y: "-50%" }}
      exit={{ opacity: 0, scale: 0.9, x: "-50%", y: "-50%" }}
      className={`fixed top-1/2 left-1/2 z-[9999] flex items-center gap-3 px-6 py-4 rounded-xl shadow-2xl border backdrop-blur-md min-w-[320px] max-w-md w-full md:w-auto ${
        type === 'success' 
          ? 'bg-green-50/95 border-green-200 text-green-800' 
          : 'bg-red-50/95 border-red-200 text-red-800'
      }`}
      role="alert"
      aria-live="assertive"
    >
      <div className={`shrink-0 p-1.5 rounded-full ${type === 'success' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}`}>
        {type === 'success' ? <IconCheck className="w-4 h-4" /> : <IconAlertCircle className="w-4 h-4" />}
      </div>
      <div className="flex-1 text-sm font-medium leading-tight">{message}</div>
      <button 
        onClick={onClose}
        className={`p-1 rounded-lg transition-colors ${
          type === 'success' 
            ? 'hover:bg-green-100 text-green-600' 
            : 'hover:bg-red-100 text-red-600'
        }`}
        aria-label="Close notification"
      >
        <IconClose className="w-4 h-4" />
      </button>
    </motion.div>
  );
}
