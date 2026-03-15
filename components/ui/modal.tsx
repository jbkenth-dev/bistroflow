"use client";

import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { twMerge } from "tailwind-merge";
import { IconClose } from "@/components/ui/icons";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  className?: string;
  hideCloseButton?: boolean;
}

export function Modal({
  isOpen,
  onClose,
  children,
  className,
  hideCloseButton = false,
}: ModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);

  // Handle ESC key and Body Scroll Lock
  useEffect(() => {
    if (isOpen) {
      const handleEsc = (e: KeyboardEvent) => {
        if (e.key === "Escape") onClose();
      };
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";

      return () => {
        document.removeEventListener("keydown", handleEsc);
        document.body.style.overflow = "unset";
      };
    }
  }, [isOpen, onClose]);

  // Focus Trap (Simple implementation)
  useEffect(() => {
    if (isOpen && modalRef.current) {
      modalRef.current.focus();
    }
  }, [isOpen]);

  // Render using Portal to ensure it sits on top of everything
  // We check for document to avoid SSR issues
  const [mounted, setMounted] = React.useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Modal Content */}
          <motion.div
            ref={modalRef}
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ type: "spring", duration: 0.3, bounce: 0 }}
            className={twMerge(
              "relative w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5 dark:bg-zinc-900 dark:ring-white/10",
              className
            )}
            role="dialog"
            aria-modal="true"
            tabIndex={-1}
          >
            {!hideCloseButton && (
              <button
                onClick={onClose}
                className="absolute right-4 top-4 z-10 rounded-full p-2 text-zinc-500 hover:bg-zinc-100 hover:text-zinc-700 focus:outline-none focus:ring-2 focus:ring-primary dark:text-zinc-400 dark:hover:bg-zinc-800 dark:hover:text-zinc-200"
                aria-label="Close modal"
              >
                <IconClose className="h-5 w-5" />
              </button>
            )}
            {children}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
}

export function ModalHeader({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={twMerge(
        "flex flex-col space-y-1.5 px-6 py-6 text-center sm:text-left",
        className
      )}
    >
      {children}
    </div>
  );
}

export function ModalTitle({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={twMerge(
        "text-lg font-semibold leading-none tracking-tight text-zinc-900 dark:text-zinc-100",
        className
      )}
    >
      {children}
    </h2>
  );
}

export function ModalDescription({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={twMerge(
        "text-sm text-zinc-500 dark:text-zinc-400",
        className
      )}
    >
      {children}
    </p>
  );
}

export function ModalBody({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={twMerge("px-6 py-2", className)}>{children}</div>
  );
}

export function ModalFooter({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={twMerge(
        "flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 px-6 py-6",
        className
      )}
    >
      {children}
    </div>
  );
}
