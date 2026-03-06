"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";

interface SimpleLineChartProps {
  data: number[];
  labels: string[];
  color?: string;
  height?: number;
}

export function SimpleLineChart({
  data,
  labels,
  color = "currentColor",
  height = 300
}: SimpleLineChartProps) {
  const points = useMemo(() => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;

    return data.map((val, i) => {
      const x = (i / (data.length - 1)) * 100;
      // Normalize y to 0-100 range, where 100 is bottom (0 value) and 0 is top (max value)
      // We leave some padding (10%) at top and bottom
      const y = 100 - (((val - min) / range) * 80 + 10);
      return { x, y, val };
    });
  }, [data]);

  const pathD = useMemo(() => {
    if (points.length === 0) return "";

    // Start at first point
    let d = `M ${points[0].x} ${points[0].y}`;

    // Create smooth bezier curves
    for (let i = 0; i < points.length - 1; i++) {
      const current = points[i];
      const next = points[i + 1];

      // Control points for smooth curve
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
    <div className="w-full h-full relative" style={{ height: `${height}px` }}>
      <svg
        viewBox="0 0 100 115"
        preserveAspectRatio="none"
        className="w-full h-full overflow-visible"
      >
        <defs>
          <linearGradient id="chartGradient" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.2" />
            <stop offset="100%" stopColor={color} stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Grid Lines */}
        {[0, 25, 50, 75, 100].map((y) => (
          <line
            key={y}
            x1="0"
            y1={y}
            x2="100"
            y2={y}
            stroke="currentColor"
            strokeOpacity="0.1"
            strokeWidth="0.5"
            strokeDasharray="2 2"
          />
        ))}

        {/* Area */}
        <motion.path
          d={areaD}
          fill="url(#chartGradient)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
        />

        {/* Line */}
        <motion.path
          d={pathD}
          fill="none"
          stroke={color}
          strokeWidth="2"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.5, ease: "easeInOut" }}
        />

        {/* Labels */}
        {labels.map((label, i) => (
          <text
            key={i}
            x={(i / (labels.length - 1)) * 100}
            y="112"
            textAnchor="middle"
            fontSize="4"
            fill="currentColor"
            opacity="0.5"
          >
            {label}
          </text>
        ))}
      </svg>
    </div>
  );
}
