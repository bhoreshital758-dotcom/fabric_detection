import React from 'react';
import { motion } from 'framer-motion';

interface ConfidenceRingProps {
  confidence: number; // 0.0 to 1.0
  size?: number;
  strokeWidth?: number;
  showLabel?: boolean;
}

export const ConfidenceRing: React.FC<ConfidenceRingProps> = ({
  confidence,
  size = 110,
  strokeWidth = 9,
  showLabel = true,
}) => {
  const percentage = Math.round(confidence * 100);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (confidence * circumference);

  // Confidence qualitative tier
  let tierLabel = 'High Confidence';
  let colorClass = '#54683C'; // eco green
  let trackClass = '#E3E8D6';

  if (confidence < 0.5) {
    tierLabel = 'Low Confidence';
    colorClass = '#A8451F'; // rust
    trackClass = '#F5DFD6';
  } else if (confidence < 0.75) {
    tierLabel = 'Moderate Confidence';
    colorClass = '#B7A98A'; // tan
    trackClass = '#EFE9DC';
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="transform -rotate-90">
          {/* Background track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={trackClass}
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Animated fill ring */}
          <motion.circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={colorClass}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            strokeLinecap="round"
            fill="transparent"
          />
        </svg>

        {/* Center percentage readout */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-serif text-2xl font-bold tracking-tight text-ink">
            {percentage}%
          </span>
          <span className="text-[10px] uppercase tracking-wider font-semibold text-ink-light -mt-0.5">
            match
          </span>
        </div>
      </div>

      {showLabel && (
        <span 
          className="mt-2 text-xs font-medium px-2.5 py-0.5 rounded-full border"
          style={{ 
            color: colorClass, 
            borderColor: colorClass + '40', 
            backgroundColor: trackClass + '60' 
          }}
        >
          {tierLabel}
        </span>
      )}
    </div>
  );
};
