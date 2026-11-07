import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Camera, Share2, Bookmark, Check, Sparkles, BookOpen, AlertCircle, Droplet, ShieldCheck, Thermometer } from 'lucide-react';
import { PredictionResult, AIInsights } from '../../types/fabric';
import { ConfidenceRing } from '../ui/ConfidenceRing';
import { Badge } from '../ui/Badge';
import { TagCard } from '../ui/TagCard';
import { ShareModal } from './ShareModal';
import { fetchAiInsights } from '../../services/api';
import confetti from 'canvas-confetti';

interface ResultScreenProps {
  result: PredictionResult;
  imagePreviewUrl: string;
  onScanAnother: () => void;
  onSaveToHistory: () => void;
  isSaved: boolean;
  onViewEncyclopedia: (fabricId: string) => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({
  result,
  imagePreviewUrl,
  onScanAnother,
  onSaveToHistory,
  isSaved,
  onViewEncyclopedia,
}) => {
  const [showShareModal, setShowShareModal] = useState(false);
  const [aiInsights, setAiInsights] = useState<AIInsights | null>(null);
  const [loadingAi, setLoadingAi] = useState(true);

  const isEco = !result.sustainability.category.toLowerCase().includes('non');
  const fabricKey = result.fabric_type.toLowerCase();

  useEffect(() => {
    // Trigger celebratory confetti if high confidence eco-friendly match!
    if (result.confidence > 0.7 && isEco) {
      try {
        confetti({
          particleCount: 30,
          spread: 55,
          origin: { y: 0.7 },
          colors: ['#54683C', '#B7A98A', '#A8451F'],
        });
      } catch {
        // Confetti optional
      }
    }

    // Fetch Gemini AI deep textile insights
    let isMounted = true;
    async function loadInsights() {
      setLoadingAi(true);
      try {
        const insights = await fetchAiInsights(
          result.fabric_type,
          result.confidence,
          result.sustainability
        );
        if (isMounted) setAiInsights(insights);
      } catch (err) {
        console.warn('Failed to load AI insights:', err);
      } finally {
        if (isMounted) setLoadingAi(false);
      }
    }

    loadInsights();
    return () => {
      isMounted = false;
    };
  }, [result, isEco]);

  return (
    <div className="space-y-6 animate-fade-in pb-4">
      {/* Share Modal */}
      {showShareModal && (
        <ShareModal result={result} onClose={() => setShowShareModal(false)} />
      )}

      {/* Top Banner with Image & Primary Confidence Ring */}
      <div className="relative rounded-2xl overflow-hidden bg-canvas-card border border-tan/60 p-5 shadow-lift">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          {/* Scanned Image Thumbnail with framing badge */}
          <div className="relative w-36 h-36 rounded-xl overflow-hidden border-2 border-tan/70 flex-shrink-0 bg-canvas-deep shadow-soft">
            <img
              src={imagePreviewUrl}
              alt={result.fabric_type}
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/60 text-white text-[9px] font-semibold backdrop-blur-sm">
              Source
            </div>
          </div>

          {/* Visual Confidence Ring */}
          <div className="flex-1 flex flex-col items-center sm:items-start text-center sm:text-left">
            <span className="text-[11px] font-bold uppercase tracking-widest text-rust">
              AI Identification
            </span>
            <h1 className="font-serif text-3xl font-bold tracking-tight text-ink mt-0.5">
              {result.fabric_type}
            </h1>

            <div className="flex items-center gap-2 mt-2">
              <Badge
                type={isEco ? 'eco' : 'synthetic'}
                text={result.sustainability.category}
                size="sm"
              />
              <Badge
                type="natural"
                text={`${result.sustainability.fibre_type} Fibre`}
                size="sm"
              />
            </div>
          </div>

          {/* Animated Circular Ring */}
          <div className="flex-shrink-0">
            <ConfidenceRing confidence={result.confidence} size={92} />
          </div>
        </div>
      </div>

      {/* Fabric Result Card: Styled as a tactile Garment Care Label Tag */}
      <TagCard hasEyelet={true}>
        <div className="space-y-3.5">
          <div className="flex items-center justify-between border-b border-dashed border-tan/60 pb-2.5">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-widest text-ink-light">
                Garment Profile
              </span>
              <h2 className="font-serif text-xl font-bold text-ink">
                {result.fabric_type.toUpperCase()}
              </h2>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-ink-light block">Classification</span>
              <span className={`text-xs font-bold ${isEco ? 'text-eco' : 'text-synthetic'}`}>
                {isEco ? '🌱 Eco-Friendly' : '♻️ Synthetic Material'}
              </span>
            </div>
          </div>

          {/* Material Database Reason / Criteria */}
          <div>
            <span className="text-[10px] font-bold uppercase tracking-widest text-ink-light block mb-1">
              Sustainability Criteria (From Database)
            </span>
            <p className="text-xs text-ink-soft leading-relaxed bg-canvas-deep/40 p-3 rounded-lg border border-tan/40">
              {result.sustainability.reason}
            </p>
          </div>

          {/* Micro Data Columns */}
          <div className="grid grid-cols-2 gap-3 pt-1 text-xs">
            <div className="p-2.5 rounded-lg bg-canvas-card border border-tan/40">
              <span className="text-[10px] text-ink-light uppercase tracking-wider block">Fibre Origin</span>
              <span className="font-semibold text-ink">{result.sustainability.fibre_type}</span>
            </div>

            <div className="p-2.5 rounded-lg bg-canvas-card border border-tan/40">
              <span className="text-[10px] text-ink-light uppercase tracking-wider block">Prediction Confidence</span>
              <span className="font-semibold text-ink">{Math.round(result.confidence * 100)}%</span>
            </div>
          </div>
        </div>
      </TagCard>

      {/* Gemini AI Deep Textile Intelligence */}
      <div className="bg-canvas-card rounded-2xl border border-tan/60 p-4 shadow-soft space-y-3">
        <div className="flex items-center justify-between border-b border-tan/40 pb-2">
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-rust" />
            <h3 className="font-serif font-bold text-sm text-ink">
              AI Textile Care & Lifecycle Intelligence
            </h3>
          </div>
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-rust-light text-rust border border-rust/30">
            Smart Advisor
          </span>
        </div>

        {loadingAi ? (
          <div className="py-4 text-center text-xs text-ink-soft space-y-2">
            <div className="w-5 h-5 border-2 border-rust border-t-transparent rounded-full animate-spin mx-auto" />
            <p>Generating personalized textile care intelligence...</p>
          </div>
        ) : aiInsights ? (
          <div className="space-y-3 text-xs">
            <div className="flex items-start gap-2.5">
              <Thermometer className="w-4 h-4 text-rust flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-ink block">Care & Wash Protocol:</span>
                <span className="text-ink-soft">{aiInsights.recommended_care}</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <Droplet className="w-4 h-4 text-synthetic flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-ink block">Microplastic Impact:</span>
                <span className="text-ink-soft">{aiInsights.microplastic_risk}</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-eco flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-ink block">Sustainable Choice Tip:</span>
                <span className="text-ink-soft">{aiInsights.eco_tip}</span>
              </div>
            </div>
          </div>
        ) : null}
      </div>

      {/* Alternative Predictions (Other Possible Matches) */}
      <div className="bg-canvas-card rounded-2xl border border-tan/60 p-4 shadow-soft space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-ink-soft">
            Other Possible Matches
          </h3>
          <span className="text-[10px] text-ink-light">Top 4 Ranked</span>
        </div>

        <div className="space-y-2.5">
          {result.ranked_predictions.slice(0, 4).map((item, idx) => {
            const percentage = Math.round(item.confidence * 100);
            const isTop = idx === 0;

            return (
              <div key={item.fabric} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className={`font-medium ${isTop ? 'font-bold text-ink' : 'text-ink-soft'}`}>
                    {item.fabric}
                  </span>
                  <span className={`font-mono text-[11px] ${isTop ? 'font-bold text-rust' : 'text-ink-light'}`}>
                    {percentage}%
                  </span>
                </div>

                <div className="w-full h-2 rounded-full bg-canvas-deep overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.max(percentage, 2)}%` }}
                    transition={{ duration: 0.8, delay: idx * 0.1, ease: 'easeOut' }}
                    className={`h-full rounded-full ${
                      isTop ? 'bg-rust' : 'bg-tan'
                    }`}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Primary Action CTAs */}
      <div className="space-y-2.5 pt-2">
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={onScanAnother}
            className="py-3.5 px-4 rounded-xl bg-ink text-canvas font-semibold text-xs flex items-center justify-center gap-2 hover:bg-rust transition-colors shadow-soft"
          >
            <Camera className="w-4 h-4" />
            <span>Scan Another</span>
          </button>

          <button
            onClick={onSaveToHistory}
            className={`py-3.5 px-4 rounded-xl border font-semibold text-xs flex items-center justify-center gap-2 transition-all ${
              isSaved
                ? 'bg-eco-bg text-eco border-eco-border/60'
                : 'bg-canvas-card text-ink border-tan hover:bg-canvas-deep'
            }`}
          >
            {isSaved ? (
              <>
                <Check className="w-4 h-4 text-eco" />
                <span>Saved to History</span>
              </>
            ) : (
              <>
                <Bookmark className="w-4 h-4" />
                <span>Save Result</span>
              </>
            )}
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setShowShareModal(true)}
            className="py-3 px-4 rounded-xl bg-canvas-card border border-tan/60 text-ink-soft font-semibold text-xs flex items-center justify-center gap-1.5 hover:text-ink hover:border-tan transition-colors"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Share Result</span>
          </button>

          <button
            onClick={() => onViewEncyclopedia(fabricKey)}
            className="py-3 px-4 rounded-xl bg-canvas-card border border-tan/60 text-ink-soft font-semibold text-xs flex items-center justify-center gap-1.5 hover:text-rust hover:border-rust transition-colors"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Fabric Guide</span>
          </button>
        </div>
      </div>
    </div>
  );
};
