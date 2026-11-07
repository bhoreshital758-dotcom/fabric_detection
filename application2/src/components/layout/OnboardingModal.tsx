import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Layers, Leaf, ArrowRight, Check } from 'lucide-react';
import { setOnboardingCompleted } from '../../services/storage';

interface OnboardingModalProps {
  isOpen: boolean;
  onFinish: () => void;
}

export const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onFinish }) => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      title: "Discover your fabric",
      subtitle: "Identify from a photograph",
      description: "Use deep learning to instantly identify common fabric types like Cotton, Linen, Silk, Wool, Polyester, and Nylon from a close-up texture photo.",
      icon: Sparkles,
      iconColor: "#A8451F",
      bgColor: "bg-rust/10",
      graphic: (
        <div className="w-full h-44 rounded-xl bg-canvas-deep/80 border border-tan/60 flex items-center justify-center relative overflow-hidden p-4">
          <div className="textile-grid-bg absolute inset-0 opacity-40" />
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-20 h-20 rounded-xl bg-canvas-card border border-tan flex items-center justify-center shadow-soft mb-2">
              <Sparkles className="w-10 h-10 text-rust" />
            </div>
            <span className="text-xs font-serif font-bold text-ink">MobileNetV2 Textile Vision</span>
            <span className="text-[10px] text-ink-soft">224x224 Texture Analysis</span>
          </div>
        </div>
      ),
    },
    {
      title: "Understand the material",
      subtitle: "Fibre type & alternative matches",
      description: "Explore exact confidence percentages, natural vs synthetic distinctions, and multi-class probability rankings for hybrid textiles.",
      icon: Layers,
      iconColor: "#B7A98A",
      bgColor: "bg-tan/20",
      graphic: (
        <div className="w-full h-44 rounded-xl bg-canvas-deep/80 border border-tan/60 flex items-center justify-center relative overflow-hidden p-4">
          <div className="w-full max-w-[240px] bg-canvas-card p-3 rounded-lg border border-tan shadow-soft space-y-2">
            <div className="flex justify-between text-xs font-serif font-bold text-ink">
              <span>Cotton</span>
              <span className="text-eco">92%</span>
            </div>
            <div className="w-full bg-canvas-deep h-1.5 rounded-full overflow-hidden">
              <div className="bg-eco h-full w-[92%]" />
            </div>
            <div className="flex justify-between text-[10px] text-ink-soft">
              <span>Linen match</span>
              <span>5%</span>
            </div>
            <div className="w-full bg-canvas-deep h-1.5 rounded-full overflow-hidden">
              <div className="bg-tan h-full w-[5%]" />
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Make informed choices",
      subtitle: "Sustainability & lifecycle guidance",
      description: "Check genuine biodegradability, washing care, microplastic shed risk, and environmental impact aligned with UN SDG 12.",
      icon: Leaf,
      iconColor: "#54683C",
      bgColor: "bg-eco/10",
      graphic: (
        <div className="w-full h-44 rounded-xl bg-canvas-deep/80 border border-tan/60 flex items-center justify-center relative overflow-hidden p-4">
          <div className="bg-[#FAF7EE] border border-tan/80 rounded-lg p-4 max-w-[240px] text-center shadow-soft">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-eco-bg text-eco text-xs font-semibold mb-2">
              <Leaf className="w-3.5 h-3.5" />
              <span>Eco-Friendly Certified</span>
            </div>
            <p className="text-[11px] text-ink-soft line-clamp-2">
              Biodegradable plant-based cellulose. Saves energy with cold washing.
            </p>
          </div>
        </div>
      ),
    },
  ];

  if (!isOpen) return null;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = () => {
    setOnboardingCompleted(true);
    onFinish();
  };

  const step = steps[currentStep];
  const Icon = step.icon;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 backdrop-blur-sm p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="w-full max-w-sm bg-canvas rounded-2xl border border-tan/70 shadow-2xl overflow-hidden flex flex-col"
      >
        {/* Top visual graphic */}
        <div className="p-5 pb-0">
          {step.graphic}
        </div>

        {/* Content body */}
        <div className="p-6">
          <div className="flex items-center gap-2 mb-2">
            <div className={`w-7 h-7 rounded-lg ${step.bgColor} flex items-center justify-center`}>
              <Icon className="w-4 h-4" style={{ color: step.iconColor }} />
            </div>
            <span className="text-[11px] font-bold uppercase tracking-widest text-rust">
              {step.subtitle}
            </span>
          </div>

          <h2 className="font-serif text-2xl font-bold text-ink mb-2">
            {step.title}
          </h2>

          <p className="text-sm text-ink-soft leading-relaxed min-h-[64px]">
            {step.description}
          </p>

          {/* Dots Indicator */}
          <div className="flex items-center justify-center gap-2 my-6">
            {steps.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentStep(i)}
                className={`h-1.5 rounded-full transition-all ${
                  currentStep === i ? 'w-6 bg-rust' : 'w-1.5 bg-tan/60'
                }`}
                aria-label={`Step ${i + 1}`}
              />
            ))}
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-between gap-3 pt-2">
            <button
              onClick={handleComplete}
              className="text-xs font-semibold text-ink-light hover:text-ink transition-colors px-3 py-2"
            >
              Skip
            </button>

            <button
              onClick={handleNext}
              className="flex-1 flex items-center justify-center gap-2 py-3 px-5 rounded-xl bg-ink text-canvas font-medium text-sm hover:bg-rust transition-colors shadow-soft"
            >
              {currentStep === steps.length - 1 ? (
                <>
                  <span>Get Started</span>
                  <Check className="w-4 h-4" />
                </>
              ) : (
                <>
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
