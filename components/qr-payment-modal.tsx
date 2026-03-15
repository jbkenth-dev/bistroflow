"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IconClose, IconDownload, IconCheck, IconClock } from "@/components/ui/icons";
import { SafeImage } from "@/components/ui/safe-image";

interface QRPaymentModalProps {
  isOpen: boolean;
  qrDataUrl: string;
  paymentIntentId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export function QRPaymentModal({ isOpen, qrDataUrl, paymentIntentId, onClose, onSuccess }: QRPaymentModalProps) {
  const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
  const [status, setStatus] = useState<"pending" | "success" | "expired">("pending");

  // Reset timer when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeLeft(600);
      setStatus("pending");
    }
  }, [isOpen]);

  // Countdown Timer
  useEffect(() => {
    if (!isOpen || status !== "pending") return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setStatus("expired");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen, status]);

  // Poll Payment Status
  useEffect(() => {
    if (!isOpen || status !== "pending" || !paymentIntentId) return;

    const pollInterval = setInterval(async () => {
      try {
        const res = await fetch(`http://localhost/bistroflow/bistroflow/php-backend/public/api/check-payment-status.php?id=${paymentIntentId}`);
        const data = await res.json();
        
        if (data.success && data.status === "succeeded") {
          setStatus("success");
          clearInterval(pollInterval);
          setTimeout(() => {
             onSuccess();
          }, 1500); // Show success message for 1.5s then redirect
        }
      } catch (err) {
        console.error("Polling error:", err);
      }
    }, 3000);

    return () => clearInterval(pollInterval);
  }, [isOpen, status, paymentIntentId, onSuccess]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = qrDataUrl;
    link.download = `bistroflow-qr-${paymentIntentId}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white dark:bg-zinc-900 rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-100 dark:border-zinc-800">
              <h2 className="text-xl font-bold font-display text-gray-900 dark:text-white flex items-center gap-2">
                Scan to Pay
              </h2>
              <button
                onClick={onClose}
                className="p-2 hover:bg-gray-100 dark:hover:bg-zinc-800 rounded-full transition-colors"
              >
                <IconClose className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Body */}
            <div className="p-8 flex flex-col items-center text-center space-y-6">
              
              {status === "pending" && (
                <>
                  <div className="relative bg-white p-4 rounded-xl shadow-inner border border-gray-200">
                     {/* QR Code Image */}
                     <img 
                       src={qrDataUrl} 
                       alt="Payment QR Code" 
                       className="w-64 h-64 object-contain"
                     />
                  </div>
                  
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Scan this QR code with your GCash or banking app to complete payment.
                    </p>
                    <div className="flex items-center justify-center gap-2 text-orange-500 font-bold text-lg">
                      <IconClock className="w-5 h-5" />
                      <span>Expires in {formatTime(timeLeft)}</span>
                    </div>
                  </div>

                  <button
                    onClick={handleDownload}
                    className="flex items-center gap-2 px-6 py-2.5 bg-gray-100 hover:bg-gray-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-gray-900 dark:text-white rounded-full font-medium transition-colors text-sm"
                  >
                    <IconDownload className="w-4 h-4" />
                    Download QR Code
                  </button>
                </>
              )}

              {status === "success" && (
                <div className="py-10 flex flex-col items-center animate-in fade-in zoom-in duration-300">
                  <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-6 text-green-600 dark:text-green-400">
                    <IconCheck className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Payment Successful!</h3>
                  <p className="text-gray-500">Redirecting you...</p>
                </div>
              )}

              {status === "expired" && (
                <div className="py-10 flex flex-col items-center">
                  <div className="w-20 h-20 bg-red-100 dark:bg-red-900/30 rounded-full flex items-center justify-center mb-6 text-red-600 dark:text-red-400">
                    <IconClose className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">QR Code Expired</h3>
                  <p className="text-gray-500 mb-6">Please try placing the order again.</p>
                  <button
                    onClick={onClose}
                    className="px-6 py-2 bg-primary text-white rounded-full font-bold hover:bg-primary/90 transition-colors"
                  >
                    Close
                  </button>
                </div>
              )}

            </div>
            
            {/* Footer */}
            {status === "pending" && (
               <div className="p-4 bg-gray-50 dark:bg-zinc-800/50 text-center text-xs text-gray-400 border-t border-gray-100 dark:border-zinc-800">
                 Powered by PayMongo QRPH
               </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
