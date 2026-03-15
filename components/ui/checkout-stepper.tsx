"use client";

import React from "react";
import { motion } from "framer-motion";
import { IconCheck } from "@/components/ui/icons";
import { cn } from "@/lib/utils";

export interface Step {
  id: number;
  label: string;
}

interface CheckoutStepperProps {
  currentStep: number;
  steps: Step[];
  className?: string;
  onStepClick?: (stepId: number) => void;
}

export function CheckoutStepper({
  currentStep,
  steps,
  className,
  onStepClick,
}: CheckoutStepperProps) {
  // Calculate progress percentage based on (currentStep - 1) / (totalSteps - 1)
  const progress = ((currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <nav aria-label="Checkout Progress" className={cn("w-full", className)}>
      <div className="relative flex items-center justify-between w-full">
        {/* Background Track */}
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-gray-100 rounded-full z-0" />
        
        {/* Active Track */}
        <motion.div
          className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-primary rounded-full z-0"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />

        {steps.map((step) => {
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;
          const isUpcoming = currentStep < step.id;
          const isActive = isCompleted || isCurrent;

          return (
            <div
              key={step.id}
              className="relative z-10 flex flex-col items-center gap-2 group"
            >
              <motion.button
                type="button"
                onClick={() => onStepClick?.(step.id)}
                disabled={!onStepClick || isUpcoming}
                initial={false}
                animate={{
                  scale: isCurrent ? 1.1 : 1,
                  backgroundColor: isActive ? "hsl(var(--primary))" : "#ffffff",
                  borderColor: isActive ? "hsl(var(--primary))" : "#e5e7eb", // gray-200
                }}
                whileHover={!isUpcoming && onStepClick ? { scale: 1.05 } : {}}
                whileTap={!isUpcoming && onStepClick ? { scale: 0.95 } : {}}
                transition={{ duration: 0.2 }}
                className={cn(
                  "relative flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-full border-2 shadow-sm transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                  isActive ? "text-white" : "text-gray-400 hover:border-gray-300",
                  !onStepClick && "cursor-default"
                )}
                aria-current={isCurrent ? "step" : undefined}
                aria-label={`Step ${step.id}: ${step.label}${isCompleted ? ", completed" : ""}${isCurrent ? ", current" : ""}`}
              >
                <span className="sr-only">{step.label}</span>
                {isCompleted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <IconCheck className="w-4 h-4 md:w-5 md:h-5" aria-hidden="true" />
                  </motion.div>
                ) : (
                  <span className="text-xs md:text-sm font-bold font-mono">
                    {step.id}
                  </span>
                )}
              </motion.button>
              
              <span
                className={cn(
                  "text-[10px] md:text-xs font-bold uppercase tracking-wider transition-colors duration-300",
                  isActive ? "text-primary" : "text-gray-400"
                )}
                aria-hidden="true"
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </nav>
  );
}
