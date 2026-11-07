import React from 'react';
import { BarChart3, PieChart, Sparkles, Leaf, RefreshCw, Compass, ArrowRight } from 'lucide-react';
import { HistoryItem, ScanAnalytics } from '../../types/fabric';
import { calculateAnalytics } from '../../services/storage';

interface InsightsScreenProps {
  history: HistoryItem[];
  onScanClick: () => void;
  onClose: () => void;
}

export const InsightsScreen: React.FC<InsightsScreenProps> = ({
  history,
  onScanClick,
  onClose,
}) => {
  const analytics: ScanAnalytics = calculateAnalytics(history);

  if (history.length === 0) {
    return (
      <div className="space-y-6 animate-fade-in p-2">
        <div>
          <span className="text-xs uppercase tracking-wider font-semibold text-rust">
            Real Analytics
          </span>
          <h1 className="font-serif text-2xl font-bold tracking-tight text-ink mt-0.5">
            Textile Insights
          </h1>
          <p className="text-xs text-ink-soft mt-0.5">
            Statistical breakdown of your scanned wardrobe and textile choices.
          </p>
        </div>

        <div className="p-8 rounded-2xl bg-canvas-card border border-dashed border-tan/80 text-center shadow-sm space-y-3">
          <div className="w-14 h-14 rounded-full bg-canvas-deep mx-auto flex items-center justify-center text-ink-soft">
            <BarChart3 className="w-7 h-7 text-tan" />
          </div>

          <h3 className="font-serif font-bold text-base text-ink">
            No scan data yet
          </h3>

          <p className="text-xs text-ink-soft max-w-xs mx-auto">
            Scan your first fabric to start generating real sustainability metrics and material distribution charts.
          </p>

          <button
            onClick={() => {
              onClose();
              onScanClick();
            }}
            className="mt-2 px-5 py-2.5 rounded-xl bg-ink text-canvas text-xs font-semibold hover:bg-rust transition-colors shadow-soft"
          >
            Scan a Fabric Now
          </button>
        </div>
      </div>
    );
  }

  // Calculate percentages
  const naturalPct = Math.round((analytics.naturalCount / analytics.totalScans) * 100) || 0;
  const syntheticPct = 100 - naturalPct;

  const ecoPct = Math.round((analytics.ecoFriendlyCount / analytics.totalScans) * 100) || 0;
  const nonEcoPct = 100 - ecoPct;

  const avgConfidencePct = Math.round(analytics.averageConfidence * 100);

  return (
    <div className="space-y-5 animate-fade-in">
      <div>
        <span className="text-xs uppercase tracking-wider font-semibold text-rust">
          Personal Textile Metrics
        </span>
        <h1 className="font-serif text-2xl font-bold tracking-tight text-ink mt-0.5">
          Scan Analytics
        </h1>
        <p className="text-xs text-ink-soft mt-0.5">
          Based on {analytics.totalScans} verified fabric neural scans
        </p>
      </div>

      {/* Top 3 KPI Cards */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="p-3 bg-canvas-card rounded-xl border border-tan/60 text-center shadow-sm">
          <span className="text-[10px] text-ink-light uppercase tracking-wider font-semibold block">
            Total Scans
          </span>
          <span className="font-serif text-2xl font-bold text-ink">
            {analytics.totalScans}
          </span>
        </div>

        <div className="p-3 bg-canvas-card rounded-xl border border-tan/60 text-center shadow-sm">
          <span className="text-[10px] text-ink-light uppercase tracking-wider font-semibold block">
            Top Fabric
          </span>
          <span className="font-serif text-lg font-bold text-rust truncate block">
            {analytics.mostDetected}
          </span>
        </div>

        <div className="p-3 bg-canvas-card rounded-xl border border-tan/60 text-center shadow-sm">
          <span className="text-[10px] text-ink-light uppercase tracking-wider font-semibold block">
            Avg Match
          </span>
          <span className="font-serif text-2xl font-bold text-eco">
            {avgConfidencePct}%
          </span>
        </div>
      </div>

      {/* Natural vs Synthetic Breakdown Ratio */}
      <div className="p-4 bg-canvas-card rounded-2xl border border-tan/60 shadow-soft space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PieChart className="w-4 h-4 text-ink-soft" />
            <h3 className="font-serif font-bold text-sm text-ink">
              Natural vs Synthetic Ratio
            </h3>
          </div>
          <span className="text-xs font-mono font-bold text-ink-soft">
            {naturalPct}% / {syntheticPct}%
          </span>
        </div>

        {/* Dual Bar */}
        <div className="w-full h-3 rounded-full overflow-hidden bg-canvas-deep flex">
          <div
            style={{ width: `${naturalPct}%` }}
            className="bg-eco transition-all duration-700"
            title={`Natural: ${naturalPct}%`}
          />
          <div
            style={{ width: `${syntheticPct}%` }}
            className="bg-synthetic transition-all duration-700"
            title={`Synthetic: ${syntheticPct}%`}
          />
        </div>

        <div className="flex items-center justify-between text-xs pt-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-eco" />
            <span className="text-ink-soft">Natural Fibres ({analytics.naturalCount})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-synthetic" />
            <span className="text-ink-soft">Synthetics ({analytics.syntheticCount})</span>
          </div>
        </div>
      </div>

      {/* Eco-Friendly vs Non-Eco Sustainability Ratio */}
      <div className="p-4 bg-canvas-card rounded-2xl border border-tan/60 shadow-soft space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Leaf className="w-4 h-4 text-eco" />
            <h3 className="font-serif font-bold text-sm text-ink">
              Eco-Friendly Footprint
            </h3>
          </div>
          <span className="text-xs font-mono font-bold text-eco">
            {ecoPct}% Sustainable
          </span>
        </div>

        <div className="w-full h-3 rounded-full overflow-hidden bg-canvas-deep flex">
          <div
            style={{ width: `${ecoPct}%` }}
            className="bg-eco transition-all duration-700"
            title={`Eco-Friendly: ${ecoPct}%`}
          />
          <div
            style={{ width: `${nonEcoPct}%` }}
            className="bg-rust transition-all duration-700"
            title={`Non-Eco-Friendly: ${nonEcoPct}%`}
          />
        </div>

        <div className="flex items-center justify-between text-xs pt-1">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-eco" />
            <span className="text-ink-soft">Eco-Friendly ({analytics.ecoFriendlyCount})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rust" />
            <span className="text-ink-soft">High-Impact / Microplastics ({analytics.nonEcoCount})</span>
          </div>
        </div>
      </div>

      {/* Fabric Frequency Distribution Bar Chart */}
      <div className="p-4 bg-canvas-card rounded-2xl border border-tan/60 shadow-soft space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-ink-soft">
          Material Frequency Breakdown
        </h3>

        <div className="space-y-2 text-xs">
          {Object.entries(analytics.fabricBreakdown)
            .sort(([, a], [, b]) => b - a)
            .map(([fab, count]) => {
              const pct = Math.round((count / analytics.totalScans) * 100);
              return (
                <div key={fab} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium text-ink">{fab}</span>
                    <span className="text-ink-light">
                      {count} scan{count !== 1 ? 's' : ''} ({pct}%)
                    </span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-canvas-deep overflow-hidden">
                    <div
                      style={{ width: `${pct}%` }}
                      className="h-full bg-tan rounded-full"
                    />
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};
