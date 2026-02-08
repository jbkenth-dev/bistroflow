"use client";
import Image, { type ImageProps } from "next/image";
import { useState, useEffect } from "react";

export function SafeImage({
  fallbackClassName,
  fallbackSrc,
  onImageError,
  ...imgProps
}: ImageProps & { fallbackClassName?: string; fallbackSrc?: string; onImageError?: () => void }) {
  const [useFallback, setUseFallback] = useState(false);
  useEffect(() => {
    setUseFallback(false);
  }, [imgProps.src]);
  const fillClass = (imgProps as any).fill ? "absolute inset-0" : "";
  if (useFallback && !fallbackSrc) {
    return <div className={`${fillClass} ${fallbackClassName ?? "bg-muted w-full h-full"}`} />;
  }
  return (
    <Image
      {...imgProps}
      src={useFallback && fallbackSrc ? (fallbackSrc as any) : imgProps.src}
      onError={() => {
        if (fallbackSrc && !useFallback) {
          setUseFallback(true);
        } else {
          setUseFallback(true);
        }
        onImageError && onImageError();
      }}
    />
  );
}
