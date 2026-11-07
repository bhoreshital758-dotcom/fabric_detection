import React, { useState } from 'react';
import { BookOpen, Scale, ArrowRight, Sparkles } from 'lucide-react';
import { FABRICS_DATABASE } from '../../data/fabricData';
import { MaterialEncyclopediaItem } from '../../types/fabric';
import { Badge } from '../ui/Badge';
import { FabricDetailModal } from './FabricDetailModal';

interface LearnScreenProps {
  onOpenCompare: (fabA?: string, fabB?: string) => void;
  selectedFabricId?: string | null;
}

export const LearnScreen: React.FC<LearnScreenProps> = ({
  onOpenCompare,
  selectedFabricId,
}) => {
  const [activeModalFabric, setActiveModalFabric] = useState<MaterialEncyclopediaItem | null>(
    selectedFabricId ? FABRICS_DATABASE[selectedFabricId] || null : null
  );

  const fabricsList = Object.values(FABRICS_DATABASE);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Detail Modal if active */}
      {activeModalFabric && (
        <FabricDetailModal
          fabric={activeModalFabric}
          onClose={() => setActiveModalFabric(null)}
          onCompareWith={(fabricId) => {
            setActiveModalFabric(null);
            onOpenCompare(activeModalFabric.id, fabricId);
          }}
        />
      )}

      {/* Header */}
      <div>
        <span className="text-xs uppercase tracking-wider font-semibold text-rust">
          Textile Knowledge Base
        </span>
        <h1 className="font-serif text-2xl font-bold tracking-tight text-ink mt-0.5">
          Learn About Fabrics
        </h1>
        <p className="text-xs text-ink-soft mt-0.5 leading-relaxed">
          Explore botanical and synthetic fibres, visual weave indicators, care methods, and genuine sustainability data.
        </p>
      </div>

      {/* Compare Banner CTA */}
      <div 
        onClick={() => onOpenCompare('cotton', 'polyester')}
        className="p-4 rounded-xl bg-canvas-card border border-tan/60 shadow-tag flex items-center justify-between cursor-pointer hover:border-rust transition-all group"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rust-light/70 text-rust flex items-center justify-center group-hover:bg-rust group-hover:text-white transition-colors">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif font-bold text-sm text-ink">
              Compare Two Fabrics
            </h3>
            <p className="text-[11px] text-ink-soft">
              Check side-by-side water, biodegradability & durability
            </p>
          </div>
        </div>
        <ArrowRight className="w-4 h-4 text-ink-light group-hover:text-rust group-hover:translate-x-0.5 transition-all" />
      </div>

      {/* 6 Fabric Material Cards Grid */}
      <div className="space-y-3">
        <h2 className="text-xs font-bold uppercase tracking-wider text-ink-soft">
          Supported Textile Materials (6)
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
          {fabricsList.map((fabric) => {
            const isEco = fabric.sustainabilityCategory === 'Eco-Friendly';

            return (
              <div
                key={fabric.id}
                onClick={() => setActiveModalFabric(fabric)}
                className="bg-canvas-card rounded-2xl border border-tan/60 overflow-hidden shadow-soft hover:shadow-lift hover:border-tan transition-all cursor-pointer group flex flex-col"
              >
                {/* Visual Thumbnail */}
                <div className="relative h-28 bg-canvas-deep overflow-hidden">
                  <img
                    src={fabric.sampleImage}
                    alt={fabric.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-2 right-2">
                    <Badge
                      type={isEco ? 'eco' : 'synthetic'}
                      text={fabric.sustainabilityCategory}
                      size="sm"
                    />
                  </div>
                </div>

                {/* Card Body */}
                <div className="p-3.5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-0.5">
                      <h3 className="font-serif font-bold text-base text-ink group-hover:text-rust transition-colors">
                        {fabric.name}
                      </h3>
                      <span className="text-[10px] font-semibold text-ink-light uppercase">
                        {fabric.fibreType}
                      </span>
                    </div>

                    <p className="text-[11px] text-ink-soft line-clamp-2 leading-relaxed">
                      {fabric.tagline}
                    </p>
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-tan/30 flex items-center justify-between text-[10px] text-ink-light font-medium">
                    <span>Tap to view encyclopedia profile</span>
                    <span className="text-rust font-semibold group-hover:translate-x-0.5 transition-transform">&rarr;</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
