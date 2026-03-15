"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  IconMenu, IconHome, IconCart, IconList, IconUsers, IconChart,
  IconSettings, IconLogOut, IconSearch, IconBell, IconChevronDown, IconReport,
  IconGrid
} from "@/components/ui/icons";
import { useAuth } from "@/store/auth";

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuth();

  useEffect(() => {
    // Auth Check
    if (!isAuthenticated) {
        // If not authenticated, redirect to login
        // Use router.push to admin login instead of default login
        router.push("/admin/login");
        return;
    }

    if (user?.role !== 'admin') {
        // If staff tries to access admin, redirect to staff dashboard
        if (user?.role === 'staff') {
            router.replace("/staff/dashboard");
        } else {
            // If customer, redirect to main
            router.replace("/dashboard");
        }
        return;
    }

    // Simulate initial loading for smooth transition
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  }, [isAuthenticated, user, router]);

  const handleLogout = () => {
    logout();
    document.cookie = "admin_session=; path=/; max-age=0";
    router.push("/admin/login");
  };

  const navGroups = [
    {
      title: "Overview",
      items: [{ label: "Dashboard", href: "/admin/dashboard", icon: IconHome }]
    },
    {
      title: "Management",
      items: [
        { label: "Orders", href: "/admin/orders", icon: IconCart, badge: "12" },
        { label: "Menu", href: "/admin/menu", icon: IconList, badge: "48" },
        { label: "Table Floor", href: "/admin/floor", icon: IconGrid },
        { label: "Staff", href: "/admin/staff", icon: IconUsers },
      ],
    },
    {
      title: "Insights",
      items: [
        { label: "Analytics", href: "/admin/analytics", icon: IconChart },
        { label: "Reports", href: "/admin/reports", icon: IconReport },
      ]
    },
    {
      title: "System",
      items: [
        { label: "Settings", href: "/admin/settings", icon: IconSettings },
        { label: "Logout", onClick: handleLogout, icon: IconLogOut, className: "text-red-500 hover:bg-red-50 hover:text-red-600" }
      ]
    },
  ];

  return (
    <div className="min-h-screen bg-muted/20 flex font-sans text-foreground">
      {/* Mobile Sidebar Backdrop */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm md:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-card border-r border-border shadow-xl md:shadow-none transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:inset-auto md:flex md:flex-col ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo Area */}
        <div className="h-16 flex items-center px-6 border-b border-border">
          <Link href="/admin/dashboard" className="flex items-center gap-3 group/logo">
            <div className="relative w-10 h-10 group-hover/logo:scale-110 transition-transform duration-500">
              <Image
                src="/assets/bistroflow-logo.jpg"
                alt="Bistroflow Logo"
                fill
                className="object-contain rounded-xl shadow-sm border border-border"
              />
            </div>
            <span className="font-display text-xl font-bold tracking-tight">
              <span className="text-primary group-hover/logo:text-orange-400 transition-colors">BISTRO</span>
              <span className="text-foreground">FLOW</span>
            </span>
          </Link>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-6 px-4 space-y-6">
          {navGroups.map((group) => (
            <div key={group.title}>
              <h3 className="px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                {group.title}
              </h3>
              <nav className="space-y-1">
                {group.items.map((item: any) => {
                  const Icon = item.icon;

                  if (item.onClick) {
                    return (
                      <button
                        key={item.label}
                        onClick={() => {
                          item.onClick();
                          setSidebarOpen(false);
                        }}
                        className={`w-full group flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                          item.className || "text-muted-foreground hover:bg-muted hover:text-foreground"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className={`w-5 h-5 ${item.className ? "" : "text-muted-foreground group-hover:text-foreground"}`} />
                          <span>{item.label}</span>
                        </div>
                      </button>
                    );
                  }

                  const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setSidebarOpen(false)}
                      className={`group flex items-center justify-between px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? "bg-primary/10 text-primary shadow-sm"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Icon className={`w-5 h-5 ${isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground"}`} />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          isActive
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground group-hover:bg-background group-hover:text-foreground shadow-sm border border-border"
                        }`}>
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </nav>
            </div>
          ))}
        </div>

        {/* User Profile Summary at Bottom */}
        <div className="p-4 border-t border-border space-y-2">
          <button className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-muted transition-colors text-left group">
            <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-primary to-orange-400 p-[2px]">
              <div className="w-full h-full rounded-full bg-card flex items-center justify-center overflow-hidden">
                <img src="/assets/test.jpg" alt="Admin" className="w-full h-full object-cover opacity-90" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">Admin User</p>
              <p className="text-xs text-muted-foreground truncate">admin@bistroflow.com</p>
            </div>
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full p-2 rounded-lg text-red-500 hover:bg-red-500/10 transition-colors text-sm font-medium"
          >
            <IconLogOut className="w-5 h-5" />
            <span>Sign Out</span>
          </button>
        </div>
      </motion.aside>

      {/* Main Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-background">
        {/* Top Header */}
        <header className="sticky top-0 z-30 h-16 bg-background/80 backdrop-blur-md border-b border-border flex items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            >
              <IconMenu className="w-6 h-6" />
            </button>

            {/* Search Bar */}
            <div className="hidden md:flex items-center relative max-w-md w-full">
              <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search anything..."
                className="w-64 lg:w-80 pl-9 pr-4 py-2 bg-muted/50 border-none rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:bg-background transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <button className="p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors relative">
              <IconBell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 ring-2 ring-background"></span>
            </button>
            <div className="h-8 w-px bg-border hidden sm:block"></div>
             {/* Mobile User Menu Trigger (optional, already in sidebar for mobile but good for desktop header) */}
             <div className="hidden md:flex items-center gap-2">
                <span className="text-sm font-medium">Hello, Admin</span>
             </div>
          </div>
        </header>

        {/* Main Content Scroll Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
