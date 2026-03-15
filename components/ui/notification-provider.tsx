"use client";

import React, { createContext, useContext, useState, ReactNode, useCallback, useMemo } from "react";
import { AlertBox, AlertType } from "@/components/ui/alert-box";
import { AnimatePresence } from "framer-motion";

interface Notification {
  id: string;
  type: AlertType;
  title: string;
  message: string;
  duration?: number;
}

interface NotificationContextType {
  showNotification: (type: AlertType, title: string, message: string, duration?: number) => void;
  hideNotification: () => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notification, setNotification] = useState<Notification | null>(null);

  const showNotification = useCallback((type: AlertType, title: string, message: string, duration?: number) => {
    const id = Math.random().toString(36).substr(2, 9);
    setNotification({ id, type, title, message, duration });
  }, []);

  const hideNotification = useCallback(() => {
    setNotification(null);
  }, []);

  const contextValue = useMemo(() => ({ showNotification, hideNotification }), [showNotification, hideNotification]);

  return (
    <NotificationContext.Provider value={contextValue}>
      {children}
      <AnimatePresence>
        {notification && (
          <AlertBox
            key={notification.id}
            type={notification.type}
            title={notification.title}
            message={notification.message}
            onClose={hideNotification}
            duration={notification.duration}
          />
        )}
      </AnimatePresence>
    </NotificationContext.Provider>
  );
}

export function useNotification() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error("useNotification must be used within a NotificationProvider");
  }
  return context;
}
