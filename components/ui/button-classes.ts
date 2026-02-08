"use client";

export const btnBase =
  "inline-flex items-center justify-center rounded-xl px-5 py-3 font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed";

export const btnPrimary =
  btnBase + " bg-primary text-primary-foreground shadow-sm hover:opacity-90 hover:shadow-md";

export const btnSecondary =
  btnBase + " glass hover:bg-accent/50 text-primary shadow-sm hover:shadow-md";
