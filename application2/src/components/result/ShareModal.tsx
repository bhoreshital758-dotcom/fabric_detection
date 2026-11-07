import React, { useState } from 'react';
import { X, Copy, Check, Share2 } from 'lucide-react';
import { PredictionResult } from '../../types/fabric';

interface ShareModalProps {
  result: PredictionResult;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ result, onClose }) => {
  const [copied, setCopied] = useState(false);

  const shareText = `FABRIC AI — Identification Result
Material: ${result.fabric_type} (${Math.round(result.confidence * 100)}% Confidence)
Fibre Type: ${result.sustainability.fibre_type}
Sustainability: ${result.sustainability.category}
Note: ${result.sustainability.reason}

"Identify. Understand. Choose Better."`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Fabric AI: ${result.fabric_type}`,
          text: shareText,
          url: window.location.href,
        });
      } catch (e) {
        console.warn('Share cancelled or not supported:', e);
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-sm bg-canvas rounded-2xl border border-tan shadow-2xl p-5 space-y-4">
        <div className="flex items-center justify-between border-b border-tan/40 pb-3">
          <div className="flex items-center gap-2">
            <Share2 className="w-4 h-4 text-rust" />
            <span className="font-serif font-bold text-base text-ink">
              Share Result
            </span>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-canvas-deep flex items-center justify-center text-ink-soft hover:text-ink"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Sharable Preview Card */}
        <div className="p-4 rounded-xl bg-[#FAF7EE] border border-dashed border-tan/80 text-center relative">
          <div className="w-10 h-10 rounded-full bg-canvas-card border border-tan/60 mx-auto flex items-center justify-center mb-2 shadow-tag">
            <img src="/logo.svg" alt="Fabric AI" className="w-6 h-6" />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-rust">
            Fabric AI Intelligence
          </span>
          <h3 className="font-serif text-2xl font-bold text-ink mt-0.5">
            {result.fabric_type}
          </h3>
          <p className="text-xs font-semibold text-eco mt-0.5">
            {Math.round(result.confidence * 100)}% Confidence &bull; {result.sustainability.fibre_type}
          </p>
          <div className="my-2.5 py-1.5 px-3 rounded-full bg-eco-bg text-eco inline-block text-[11px] font-medium border border-eco-border/40">
            {result.sustainability.category}
          </div>
          <p className="text-[11px] text-ink-soft italic line-clamp-3 px-2">
            "{result.sustainability.reason}"
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={handleCopy}
            className="flex-1 py-3 px-4 rounded-xl border border-tan/80 bg-canvas-card text-ink font-semibold text-xs flex items-center justify-center gap-1.5 hover:bg-canvas-deep transition-colors"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-eco" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-ink-soft" />
                <span>Copy Summary</span>
              </>
            )}
          </button>

          <button
            onClick={handleNativeShare}
            className="flex-1 py-3 px-4 rounded-xl bg-ink text-canvas font-semibold text-xs flex items-center justify-center gap-1.5 hover:bg-rust transition-colors shadow-soft"
          >
            <Share2 className="w-4 h-4" />
            <span>Share via App</span>
          </button>
        </div>
      </div>
    </div>
  );
};
