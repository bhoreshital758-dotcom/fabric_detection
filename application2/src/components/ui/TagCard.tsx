import React from 'react';

interface TagCardProps {
  children: React.ReactNode;
  className?: string;
  hasEyelet?: boolean;
}

export const TagCard: React.FC<TagCardProps> = ({
  children,
  className = '',
  hasEyelet = true,
}) => {
  return (
    <div className={`relative bg-[#FAF7EE] border border-tan/60 rounded-md shadow-tag overflow-hidden ${className}`}>
      {/* Top Stitching Line */}
      <div className="absolute top-2.5 left-4 right-4 border-t border-dashed border-tan/70 pointer-events-none" />

      {/* Top Eyelet Hole */}
      {hasEyelet && (
        <div className="absolute top-1 left-1/2 -translate-x-1/2 w-3.5 h-3.5 rounded-full bg-canvas border border-ink shadow-inner pointer-events-none z-10" />
      )}

      {/* Tag Content */}
      <div className="pt-6 pb-5 px-5">
        {children}
      </div>
    </div>
  );
};
