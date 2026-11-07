import React from 'react';
import { Leaf, RefreshCw, Sparkles, Feather } from 'lucide-react';

interface BadgeProps {
  type: 'eco' | 'synthetic' | 'natural' | 'confidence';
  text: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  type,
  text,
  size = 'md',
  className = '',
}) => {
  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-medium',
  };

  if (type === 'eco') {
    return (
      <span className={`inline-flex items-center rounded-full font-medium bg-eco-bg text-eco border border-eco-border/40 ${sizeClasses[size]} ${className}`}>
        <Leaf className="w-3.5 h-3.5 flex-shrink-0" />
        <span>{text}</span>
      </span>
    );
  }

  if (type === 'synthetic') {
    return (
      <span className={`inline-flex items-center rounded-full font-medium bg-synthetic-bg text-synthetic border border-synthetic-border/40 ${sizeClasses[size]} ${className}`}>
        <RefreshCw className="w-3.5 h-3.5 flex-shrink-0" />
        <span>{text}</span>
      </span>
    );
  }

  if (type === 'natural') {
    return (
      <span className={`inline-flex items-center rounded-full font-medium bg-canvas-deep text-ink-soft border border-tan/40 ${sizeClasses[size]} ${className}`}>
        <Feather className="w-3.5 h-3.5 flex-shrink-0" />
        <span>{text}</span>
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center rounded-full font-medium bg-rust-light text-rust border border-rust/20 ${sizeClasses[size]} ${className}`}>
      <Sparkles className="w-3.5 h-3.5 flex-shrink-0" />
      <span>{text}</span>
    </span>
  );
};
