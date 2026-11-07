import React from 'react';
import { X, Sparkles, Droplet, ShieldCheck, Tag, Info, Check } from 'lucide-react';
import { MaterialEncyclopediaItem } from '../../types/fabric';
import { Badge } from '../ui/Badge';

interface FabricDetailModalProps {
  fabric: MaterialEncyclopediaItem;
  onClose: () => void;
  onCompareWith?: (fabricId: string) => void;
}

export const FabricDetailModal: React.FC<FabricDetailModalProps> = ({
  fabric,
  onClose,
  onCompareWith,
}) => {
  const isEco = fabric.sustainabilityCategory === 'Eco-Friendly';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-md bg-canvas rounded-2xl border border-tan/80 shadow-2xl overflow-hidden my-6 flex flex-col max-h-[90vh]">
        {/* Header with Sample Image & Close */}
        <div className="relative h-44 bg-canvas-deep flex-shrink-0">
          <img
            src={fabric.sampleImage}
            alt={fabric.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center hover:bg-black/70 backdrop-blur-sm transition-colors"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Title on image overlay */}
          <div className="absolute bottom-3 left-4 right-4 text-white">
            <span className="text-[10px] font-bold uppercase tracking-widest text-rust-light">
              Textile Encyclopedia
            </span>
            <div className="flex items-center justify-between">
              <h2 className="font-serif text-2xl font-bold tracking-tight">
                {fabric.name}
              </h2>
              <Badge
                type={isEco ? 'eco' : 'synthetic'}
                text={fabric.sustainabilityCategory}
                size="sm"
              />
            </div>
            <p className="text-xs text-white/80 line-clamp-1 mt-0.5">
              {fabric.tagline}
            </p>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-ink">
          {/* Overview */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-ink-soft mb-1 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-rust" />
              Overview
            </h3>
            <p className="text-xs text-ink-soft leading-relaxed">
              {fabric.overview}
            </p>
          </div>

          {/* Sustainability Classification & Database Reason */}
          <div className="p-3.5 rounded-xl bg-canvas-card border border-tan/60 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-ink">Why it is classified this way:</span>
              <span className={`text-[11px] font-bold ${isEco ? 'text-eco' : 'text-synthetic'}`}>
                {fabric.sustainabilityCategory}
              </span>
            </div>
            <p className="text-xs text-ink-soft leading-relaxed italic bg-canvas-deep/40 p-2.5 rounded-lg border border-tan/30">
              "{fabric.databaseReason}"
            </p>
            <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
              <div>
                <span className="text-ink-light block">Fibre Origin:</span>
                <span className="font-semibold text-ink">{fabric.origin}</span>
              </div>
              <div>
                <span className="text-ink-light block">Microplastics:</span>
                <span className="font-semibold text-ink">{fabric.microplasticRisk}</span>
              </div>
            </div>
          </div>

          {/* AI Detection Considerations */}
          <div className="p-3.5 rounded-xl bg-rust-light/40 border border-rust/30 space-y-2">
            <div className="flex items-center gap-1.5 text-rust">
              <Sparkles className="w-4 h-4" />
              <h3 className="text-xs font-bold uppercase tracking-wider">
                AI Detection Visual Cues
              </h3>
            </div>
            <p className="text-xs text-ink-soft leading-relaxed">
              {fabric.aiDetectionTip}
            </p>
            <div className="space-y-1 pt-1">
              {fabric.visualIndicators.map((ind, i) => (
                <div key={i} className="flex items-start gap-2 text-[11px] text-ink-soft">
                  <Check className="w-3 h-3 text-rust flex-shrink-0 mt-0.5" />
                  <span>{ind}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Common Uses */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-ink-soft mb-2 flex items-center gap-1.5">
              <Tag className="w-3.5 h-3.5 text-ink-soft" />
              Common Apparel & Applications
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {fabric.commonUses.map((use) => (
                <span
                  key={use}
                  className="px-2.5 py-1 rounded-lg bg-canvas-deep text-ink text-xs font-medium border border-tan/50"
                >
                  {use}
                </span>
              ))}
            </div>
          </div>

          {/* Care Guidelines */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-ink-soft mb-2 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-eco" />
              Care & Longevity Advice
            </h3>
            <div className="space-y-1.5">
              {fabric.careInstructions.map((tip, idx) => (
                <div key={idx} className="flex items-start gap-2 text-xs text-ink-soft">
                  <span className="w-4 h-4 rounded-full bg-eco-bg text-eco flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
                    {idx + 1}
                  </span>
                  <span>{tip}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-tan/40 bg-canvas-card flex items-center justify-between gap-3">
          {onCompareWith && (
            <button
              onClick={() => onCompareWith(fabric.id)}
              className="py-2.5 px-4 rounded-xl border border-tan/80 text-xs font-semibold text-ink hover:bg-canvas-deep transition-colors"
            >
              Compare with another fabric
            </button>
          )}

          <button
            onClick={onClose}
            className="flex-1 py-2.5 px-4 rounded-xl bg-ink text-canvas text-xs font-semibold hover:bg-rust transition-colors text-center"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
