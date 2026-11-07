import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Cpu, Layers, CheckCircle2 } from 'lucide-react';

interface AnalysisLoaderProps {
  imagePreviewUrl: string;
}

export const AnalysisLoader: React.FC<AnalysisLoaderProps> = ({ imagePreviewUrl }) => {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    { label: "Examining texture & weave surface", icon: Layers },
    { label: "Comparing microscopic fibre patterns", icon: Sparkles },
    { label: "Identifying textile classification", icon: Cpu },
    { label: "Querying sustainability database", icon: CheckCircle2 },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev < steps.length - 1 ? prev + 1 : prev));
    }, 700);
    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <div className="flex flex-col items-center justify-center p-6 space-y-6 animate-fade-in">
      {/* Visual Scanning Viewfinder */}
      <div className="relative w-64 h-64 rounded-2xl overflow-hidden border-2 border-rust shadow-lift bg-canvas-deep">
        <img
          src={imagePreviewUrl}
          alt="Fabric scanning"
          className="w-full h-full object-cover filter contrast-[1.05]"
        />

        {/* Subtle grid mesh overlay */}
        <div className="absolute inset-0 bg-rust/10 mix-blend-overlay pointer-events-none" />

        {/* Sweeping Laser / Thread Weave Scan Line */}
        <motion.div
          animate={{ y: ['0%', '100%', '0%'] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-rust to-transparent shadow-[0_0_12px_#A8451F] pointer-events-none"
        />

        {/* Corner framing reticles */}
        <div className="absolute top-3 left-3 w-4 h-4 border-t-2 border-l-2 border-canvas pointer-events-none" />
        <div className="absolute top-3 right-3 w-4 h-4 border-t-2 border-r-2 border-canvas pointer-events-none" />
        <div className="absolute bottom-3 left-3 w-4 h-4 border-b-2 border-l-2 border-canvas pointer-events-none" />
        <div className="absolute bottom-3 right-3 w-4 h-4 border-b-2 border-r-2 border-canvas pointer-events-none" />

        {/* Center Target Crosshair */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-40">
          <div className="w-10 h-10 border border-dashed border-canvas rounded-full" />
        </div>
      </div>

      {/* Heading & Subtitle */}
      <div className="text-center">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rust-light text-rust text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '4s' }} />
          <span>MobileNetV2 Neural Analysis</span>
        </div>
        <h3 className="font-serif text-xl font-bold text-ink">
          Analyzing fabric...
        </h3>
        <p className="text-xs text-ink-soft mt-0.5">
          Evaluating structural grain, thread count & eco metrics
        </p>
      </div>

      {/* Dynamic Interface Feedback Steps */}
      <div className="w-full max-w-xs bg-canvas-card rounded-xl border border-tan/60 p-3.5 space-y-2.5 shadow-soft">
        {steps.map((step, idx) => {
          const isDone = activeStep > idx;
          const isCurrent = activeStep === idx;
          const StepIcon = step.icon;

          return (
            <div
              key={idx}
              className={`flex items-center gap-3 transition-opacity ${
                isCurrent ? 'opacity-100' : isDone ? 'opacity-80' : 'opacity-35'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  isDone
                    ? 'bg-eco text-white'
                    : isCurrent
                    ? 'bg-rust text-white animate-pulse'
                    : 'bg-canvas-deep text-ink-light'
                }`}
              >
                {isDone ? '✓' : idx + 1}
              </div>

              <div className="flex-1 flex items-center justify-between">
                <span className={`text-xs ${isCurrent ? 'font-bold text-ink' : 'font-medium text-ink-soft'}`}>
                  {step.label}
                </span>
                {isCurrent && (
                  <StepIcon className="w-3.5 h-3.5 text-rust animate-spin" style={{ animationDuration: '3s' }} />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
