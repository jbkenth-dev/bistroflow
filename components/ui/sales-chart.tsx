"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface SalesChartProps {
  data: number[];
  labels: string[];
  color?: string;
  height?: number;
  currency?: string;
}

export function SalesChart({
  data,
  labels,
  color = "#f97316", // Default to orange-500
  height = 300,
  currency = "₱"
}: SalesChartProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const { points, max, min } = useMemo(() => {
    const maxVal = Math.max(...data);
    const minVal = Math.min(...data);
    // Add some padding to the range so the line doesn't touch the very top/bottom
    const range = maxVal - minVal || 1;
    const padding = range * 0.1;
    const chartMin = Math.max(0, minVal - padding);
    const chartMax = maxVal + padding;
    const chartRange = chartMax - chartMin;

    const pts = data.map((val, i) => {
      const x = (i / (data.length - 1)) * 100;
      // Invert Y because SVG coordinates start from top
      const y = 100 - ((val - chartMin) / chartRange) * 100;
      return { x, y, val, label: labels[i] };
    });

    return { points: pts, max: maxVal, min: minVal };
  }, [data, labels]);

  const pathD = useMemo(() => {
    if (points.length === 0) return "";
    
    // Start
    let d = `M ${points[0].x} ${points[0].y}`;

    // Catmull-Rom to Bezier conversion or simple cubic bezier
    // Using a simple smoothing technique
    for (let i = 0; i < points.length - 1; i++) {
      const current = points[i];
      const next = points[i + 1];
      
      const cp1x = current.x + (next.x - current.x) * 0.5;
      const cp1y = current.y;
      const cp2x = current.x + (next.x - current.x) * 0.5;
      const cp2y = next.y;

      d += ` C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${next.x} ${next.y}`;
    }
    return d;
  }, [points]);

  const areaD = useMemo(() => {
    if (points.length === 0) return "";
    return `${pathD} L 100 100 L 0 100 Z`;
  }, [pathD, points]);

  return (
    <div className="w-full relative select-none" style={{ height: `${height}px` }}>
      {/* Chart Container */}
      <div className="absolute inset-0 top-0 bottom-6 left-0 right-0">
        <svg
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          className="w-full h-full overflow-visible"
        >
          <defs>
            <linearGradient id="salesGradient" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.2" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Grid Lines & Y-Axis Labels (Visual only, approximated) */}
          {[0, 25, 50, 75, 100].map((y) => (
            <g key={y}>
              <line
                x1="0"
                y1={y}
                x2="100"
                y2={y}
                stroke="currentColor"
                strokeOpacity="0.05"
                strokeWidth="0.5"
              />
            </g>
          ))}

          {/* Area Fill */}
          <motion.path
            d={areaD}
            fill="url(#salesGradient)"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />

          {/* Line Path */}
          <motion.path
            d={pathD}
            fill="none"
            stroke={color}
            strokeWidth="2" // Thicker line
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            style={{ filter: "drop-shadow(0px 4px 6px rgba(0,0,0,0.1))" }}
          />

          {/* Interactive Layer */}
          {points.map((point, i) => (
            <g key={i}>
              {/* Invisible Hit Area for better UX */}
              <rect
                x={i === 0 ? 0 : (points[i-1].x + point.x) / 2}
                y="0"
                width={
                  i === points.length - 1
                    ? 100 - points[i].x
                    : (points[i+1].x - point.x)
                }
                height="100"
                fill="transparent"
                onMouseEnter={() => setHoveredIndex(i)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="cursor-crosshair"
              />
              
              {/* Active Point Highlight */}
              <AnimatePresence>
                {hoveredIndex === i && (
                  <>
                    {/* Vertical Line */}
                    <motion.line
                      x1={point.x}
                      y1={0}
                      x2={point.x}
                      y2={100}
                      stroke={color}
                      strokeWidth="0.5"
                      strokeDasharray="2 2"
                      initial={{ opacity: 0, y2: 0 }}
                      animate={{ opacity: 0.5, y2: 100 }}
                      exit={{ opacity: 0 }}
                    />
                    
                    {/* Pulsing Dot */}
                    <motion.circle
                      cx={point.x}
                      cy={point.y}
                      r="4" // Slightly larger
                      fill={color}
                      stroke="white"
                      strokeWidth="2"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    />
                    <motion.circle
                        cx={point.x}
                        cy={point.y}
                        r="8"
                        fill={color}
                        opacity="0.2"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1.5 }}
                        exit={{ scale: 0 }}
                        transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
                    />
                  </>
                )}
              </AnimatePresence>
            </g>
          ))}
        </svg>

        {/* Floating Tooltip */}
        <AnimatePresence>
          {hoveredIndex !== null && points[hoveredIndex] && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 5, scale: 0.9 }}
              transition={{ duration: 0.15 }}
              className="absolute pointer-events-none z-10 flex flex-col items-center"
              style={{
                left: `${points[hoveredIndex].x}%`,
                top: `${points[hoveredIndex].y}%`,
                transform: "translate(-50%, -120%)" // Position above the point
              }}
            >
              <div className="bg-popover text-popover-foreground shadow-xl rounded-lg px-3 py-2 text-xs font-medium border border-border whitespace-nowrap flex flex-col items-center gap-0.5">
                <span className="text-muted-foreground text-[10px] uppercase tracking-wider">{points[hoveredIndex].label}</span>
                <span className="text-base font-bold tabular-nums">
                  {currency}{points[hoveredIndex].val.toLocaleString()}
                </span>
              </div>
              {/* Tooltip Arrow */}
              <div className="w-2 h-2 bg-popover rotate-45 border-r border-b border-border -mt-1 shadow-sm"></div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* X-Axis Labels */}
      <div className="absolute bottom-0 left-0 right-0 flex justify-between px-2">
        {labels.map((label, i) => (
          <span
            key={i}
            className={`text-xs text-muted-foreground transition-colors duration-200 ${
              hoveredIndex === i ? "text-foreground font-semibold" : ""
            }`}
          >
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
