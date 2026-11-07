import React, { useState } from 'react';
import { X, Scale, ArrowRightLeft, Leaf, RefreshCw } from 'lucide-react';
import { FABRICS_DATABASE } from '../../data/fabricData';
import { Badge } from '../ui/Badge';

interface CompareModalProps {
  initialFabricA?: string;
  initialFabricB?: string;
  onClose: () => void;
}

export const CompareModal: React.FC<CompareModalProps> = ({
  initialFabricA = 'cotton',
  initialFabricB = 'polyester',
  onClose,
}) => {
  const [fabricKeyA, setFabricKeyA] = useState(initialFabricA);
  const [fabricKeyB, setFabricKeyB] = useState(initialFabricB);

  const fabrics = Object.values(FABRICS_DATABASE);
  const fabA = FABRICS_DATABASE[fabricKeyA] || fabrics[0];
  const fabB = FABRICS_DATABASE[fabricKeyB] || fabrics[4];

  const handleSwap = () => {
    setFabricKeyA(fabricKeyB);
    setFabricKeyB(fabricKeyA);
  };

  const rows = [
    {
      label: "Fibre Type",
      valA: fabA.fibreType,
      valB: fabB.fibreType,
    },
    {
      label: "Sustainability",
      valA: (
        <Badge
          type={fabA.sustainabilityCategory === 'Eco-Friendly' ? 'eco' : 'synthetic'}
          text={fabA.sustainabilityCategory}
          size="sm"
        />
      ),
      valB: (
        <Badge
          type={fabB.sustainabilityCategory === 'Eco-Friendly' ? 'eco' : 'synthetic'}
          text={fabB.sustainabilityCategory}
          size="sm"
        />
      ),
    },
    {
      label: "Criteria / Reason",
      valA: <p className="text-[11px] leading-relaxed text-ink-soft">{fabA.databaseReason}</p>,
      valB: <p className="text-[11px] leading-relaxed text-ink-soft">{fabB.databaseReason}</p>,
    },
    {
      label: "Biodegradability",
      valA: fabA.biodegradability,
      valB: fabB.biodegradability,
    },
    {
      label: "Microplastic Shed",
      valA: fabA.microplasticRisk,
      valB: fabB.microplasticRisk,
    },
    {
      label: "Water Intensity",
      valA: fabA.waterIntensity,
      valB: fabB.waterIntensity,
    },
    {
      label: "AI Visual Cue",
      valA: <p className="text-[11px] text-ink-soft">{fabA.aiDetectionTip}</p>,
      valB: <p className="text-[11px] text-ink-soft">{fabB.aiDetectionTip}</p>,
    },
    {
      label: "Typical Garments",
      valA: fabA.commonUses.slice(0, 2).join(', '),
      valB: fabB.commonUses.slice(0, 2).join(', '),
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-lg bg-canvas rounded-2xl border border-tan shadow-2xl p-5 my-6 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-tan/40 pb-3">
          <div className="flex items-center gap-2">
            <Scale className="w-5 h-5 text-rust" />
            <div>
              <h2 className="font-serif font-bold text-lg text-ink">
                Compare Fabrics
              </h2>
              <p className="text-[10px] text-ink-soft">
                Side-by-side textile and sustainability comparison
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-canvas-deep flex items-center justify-center text-ink-soft hover:text-ink transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Fabric Selectors Bar */}
        <div className="grid grid-cols-[1fr,auto,1fr] items-center gap-2 py-3 border-b border-tan/40">
          <div>
            <label className="text-[10px] uppercase font-bold text-ink-light block mb-1">
              Fabric 1
            </label>
            <select
              value={fabricKeyA}
              onChange={(e) => setFabricKeyA(e.target.value)}
              className="w-full text-xs font-serif font-bold p-2 rounded-lg bg-canvas-card border border-tan/80 text-ink focus:outline-none focus:border-rust"
            >
              {fabrics.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleSwap}
            title="Swap fabrics"
            className="w-8 h-8 rounded-full bg-canvas-deep border border-tan/60 flex items-center justify-center text-ink-soft hover:text-rust transition-colors mt-4"
          >
            <ArrowRightLeft className="w-3.5 h-3.5" />
          </button>

          <div>
            <label className="text-[10px] uppercase font-bold text-ink-light block mb-1">
              Fabric 2
            </label>
            <select
              value={fabricKeyB}
              onChange={(e) => setFabricKeyB(e.target.value)}
              className="w-full text-xs font-serif font-bold p-2 rounded-lg bg-canvas-card border border-tan/80 text-ink focus:outline-none focus:border-rust"
            >
              {fabrics.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Comparison Matrix Table */}
        <div className="flex-1 overflow-y-auto py-2 space-y-2">
          {rows.map((row, idx) => (
            <div
              key={idx}
              className="p-2.5 rounded-xl bg-canvas-card border border-tan/40 text-xs space-y-1.5"
            >
              <div className="text-[10px] uppercase tracking-wider font-bold text-ink-light text-center">
                {row.label}
              </div>
              <div className="grid grid-cols-2 gap-3 text-ink">
                <div className="border-r border-tan/40 pr-2">
                  <span className="font-serif font-semibold text-xs block mb-0.5 text-rust">
                    {fabA.name}
                  </span>
                  {row.valA}
                </div>
                <div className="pl-1">
                  <span className="font-serif font-semibold text-xs block mb-0.5 text-synthetic">
                    {fabB.name}
                  </span>
                  {row.valB}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-tan/40 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-ink text-canvas font-medium text-xs hover:bg-rust transition-colors"
          >
            Done Comparing
          </button>
        </div>
      </div>
    </div>
  );
};
