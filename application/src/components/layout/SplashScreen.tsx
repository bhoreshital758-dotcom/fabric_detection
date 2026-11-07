import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onComplete, 500); // Allow fade-out animation to finish
    }, 1800);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-canvas textile-grid-bg px-6"
        >
          {/* Logo container */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="relative flex items-center justify-center mb-6"
          >
            <div className="w-24 h-24 rounded-2xl bg-canvas-card border-2 border-tan/60 shadow-lift flex items-center justify-center p-3 relative overflow-hidden">
              {/* Subtle thread pattern */}
              <div className="absolute inset-0 opacity-15">
                <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="threads" width="8" height="8" patternUnits="userSpaceOnUse">
                      <path d="M 0 4 L 8 4 M 4 0 L 4 8" fill="none" stroke="#26211C" strokeWidth="1" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#threads)" />
                </svg>
              </div>

              {/* Logo SVG */}
              <img src="/logo.svg" alt="Fabric AI" className="w-16 h-16 relative z-10" />
            </div>

            {/* Glowing ring */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
              className="absolute -inset-2 rounded-3xl border border-dashed border-rust/30 pointer-events-none"
            />
          </motion.div>

          {/* Typography */}
          <motion.div
            initial={{ y: 15, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.25, duration: 0.6 }}
            className="text-center"
          >
            <h1 className="font-serif text-3xl font-bold tracking-tight text-ink">
              FABRIC <span className="text-rust">AI</span>
            </h1>
            <p className="mt-2 text-xs uppercase tracking-[0.25em] font-medium text-ink-soft">
              Identify &bull; Understand &bull; Choose Better
            </p>
          </motion.div>

          {/* Animated woven progress line */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 120 }}
            transition={{ delay: 0.4, duration: 1.0, ease: 'easeInOut' }}
            className="mt-8 h-1 bg-gradient-to-r from-tan via-rust to-eco rounded-full"
          />

          {/* Skip CTA */}
          <button
            onClick={() => {
              setVisible(false);
              setTimeout(onComplete, 200);
            }}
            className="absolute bottom-10 text-xs font-medium text-ink-light hover:text-ink transition-colors px-4 py-2"
          >
            Skip Intro &rarr;
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
