import React from 'react';
import { Camera, Upload, Clock, Scale, Sparkles, ChevronRight, Leaf, ArrowUpRight, Compass } from 'lucide-react';
import { HistoryItem } from '../../types/fabric';
import { FABRICS_DATABASE } from '../../data/fabricData';
import { Badge } from '../ui/Badge';
import { motion } from 'framer-motion';

interface HomeScreenProps {
  onScanClick: () => void;
  onUploadClick: () => void;
  onHistoryClick: () => void;
  onLearnClick: (fabricId?: string) => void;
  onCompareClick: () => void;
  recentScans: HistoryItem[];
  onSelectScan: (item: HistoryItem) => void;
}

export const HomeScreen: React.FC<HomeScreenProps> = ({
  onScanClick,
  onUploadClick,
  onHistoryClick,
  onLearnClick,
  onCompareClick,
  recentScans,
  onSelectScan,
}) => {
  // Greeting based on time of day
  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  const fabricsList = Object.values(FABRICS_DATABASE);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Greeting Header */}
      <div>
        <span className="text-xs uppercase tracking-wider font-semibold text-rust">
          {greeting} 👋
        </span>
        <h1 className="font-serif text-2xl font-bold tracking-tight text-ink mt-0.5">
          What fabric are you curious about?
        </h1>
        <p className="text-xs text-ink-soft mt-1">
          Capture or upload any woven textile to detect its composition and sustainability impact.
        </p>
      </div>

      {/* Large Primary "Scan a Fabric" Hero Card */}
      <motion.div
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
        onClick={onScanClick}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-ink via-[#2D2721] to-[#1E1A16] text-canvas p-6 shadow-lift cursor-pointer border border-tan/40 group"
      >
        {/* Subtle textile thread backdrop */}
        <div className="absolute -right-8 -bottom-8 w-44 h-44 rounded-full border-[12px] border-tan/10 pointer-events-none" />
        <div className="absolute right-12 top-6 w-24 h-24 rounded-full border-4 border-dashed border-rust/30 pointer-events-none animate-spin" style={{ animationDuration: '30s' }} />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-rust flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <Camera className="w-6 h-6 text-canvas" />
            </div>
            <span className="text-[11px] font-semibold tracking-wider uppercase px-2.5 py-1 rounded-full bg-canvas/10 text-canvas-deep backdrop-blur-sm border border-canvas/10 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-rust-light" />
              AI Vision Model
            </span>
          </div>

          <h2 className="font-serif text-2xl font-bold tracking-tight text-canvas">
            Scan a Fabric
          </h2>
          <p className="text-xs text-canvas-deep/80 mt-1 max-w-[260px] leading-relaxed">
            Use your phone camera or gallery to identify material structure and environmental footprint.
          </p>

          <div className="mt-5 flex items-center justify-between pt-3 border-t border-canvas/15">
            <span className="text-xs font-semibold text-rust-light group-hover:text-canvas transition-colors">
              Identify fabric using AI &rarr;
            </span>
            <div className="w-7 h-7 rounded-full bg-canvas/10 flex items-center justify-center group-hover:bg-rust group-hover:text-canvas transition-all">
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Quick Actions Grid */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-ink-soft">
            Quick Actions
          </h3>
        </div>

        <div className="grid grid-cols-4 gap-2.5">
          <button
            onClick={onScanClick}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-canvas-card border border-tan/50 hover:border-rust hover:shadow-soft transition-all text-center group"
          >
            <div className="w-9 h-9 rounded-lg bg-rust-light/60 flex items-center justify-center mb-1.5 group-hover:bg-rust group-hover:text-white transition-colors">
              <Camera className="w-4 h-4 text-rust group-hover:text-white" />
            </div>
            <span className="text-[11px] font-medium text-ink leading-tight">Take Photo</span>
          </button>

          <button
            onClick={onUploadClick}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-canvas-card border border-tan/50 hover:border-rust hover:shadow-soft transition-all text-center group"
          >
            <div className="w-9 h-9 rounded-lg bg-canvas-deep flex items-center justify-center mb-1.5 group-hover:bg-ink group-hover:text-white transition-colors">
              <Upload className="w-4 h-4 text-ink group-hover:text-white" />
            </div>
            <span className="text-[11px] font-medium text-ink leading-tight">Upload Image</span>
          </button>

          <button
            onClick={onCompareClick}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-canvas-card border border-tan/50 hover:border-rust hover:shadow-soft transition-all text-center group"
          >
            <div className="w-9 h-9 rounded-lg bg-eco-bg flex items-center justify-center mb-1.5 group-hover:bg-eco group-hover:text-white transition-colors">
              <Scale className="w-4 h-4 text-eco group-hover:text-white" />
            </div>
            <span className="text-[11px] font-medium text-ink leading-tight">Compare</span>
          </button>

          <button
            onClick={onHistoryClick}
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-canvas-card border border-tan/50 hover:border-rust hover:shadow-soft transition-all text-center group"
          >
            <div className="w-9 h-9 rounded-lg bg-tan/30 flex items-center justify-center mb-1.5 group-hover:bg-ink group-hover:text-white transition-colors">
              <Clock className="w-4 h-4 text-ink-soft group-hover:text-white" />
            </div>
            <span className="text-[11px] font-medium text-ink leading-tight">History</span>
          </button>
        </div>
      </div>

      {/* Recent Scans Section */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-ink-soft">
            Recent Scans
          </h3>
          {recentScans.length > 0 && (
            <button
              onClick={onHistoryClick}
              className="text-xs font-semibold text-rust hover:underline flex items-center gap-0.5"
            >
              <span>View all ({recentScans.length})</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {recentScans.length === 0 ? (
          <div className="bg-canvas-card border border-dashed border-tan/80 rounded-xl p-6 text-center shadow-sm">
            <div className="w-12 h-12 rounded-full bg-canvas-deep mx-auto flex items-center justify-center text-ink-soft mb-2">
              <Compass className="w-5 h-5 text-tan" />
            </div>
            <p className="font-serif text-sm font-semibold text-ink">
              No scans yet
            </p>
            <p className="text-xs text-ink-soft mt-0.5 max-w-[220px] mx-auto">
              Your fabric discoveries and sustainability ratings will appear here.
            </p>
            <button
              onClick={onScanClick}
              className="mt-4 px-4 py-2 bg-ink text-canvas rounded-lg text-xs font-medium hover:bg-rust transition-colors shadow-soft"
            >
              Scan your first fabric
            </button>
          </div>
        ) : (
          <div className="space-y-2.5">
            {recentScans.slice(0, 3).map((scan) => {
              const isEco = !scan.sustainability?.category?.toLowerCase().includes('non');
              const timeString = new Date(scan.timestamp).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
              });

              return (
                <motion.div
                  key={scan.id}
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => onSelectScan(scan)}
                  className="p-3 bg-canvas-card rounded-xl border border-tan/50 hover:border-tan shadow-tag flex items-center gap-3.5 cursor-pointer transition-all"
                >
                  {/* Thumbnail */}
                  <div className="w-14 h-14 rounded-lg bg-canvas-deep overflow-hidden flex-shrink-0 border border-tan/60 relative">
                    <img
                      src={scan.image_url}
                      alt={scan.fabric_type}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="font-serif font-bold text-sm text-ink truncate">
                        {scan.fabric_type}
                      </h4>
                      <span className="text-[10px] font-semibold text-ink-light flex-shrink-0">
                        {timeString}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-semibold text-ink">
                        {Math.round(scan.confidence * 100)}% confidence
                      </span>
                      <span className="text-ink-light">&bull;</span>
                      <Badge
                        type={isEco ? 'eco' : 'synthetic'}
                        text={scan.sustainability?.category || (isEco ? 'Eco-Friendly' : 'Synthetic')}
                        size="sm"
                      />
                    </div>
                  </div>

                  <ChevronRight className="w-4 h-4 text-ink-light flex-shrink-0" />
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* SDG 12 Responsible Consumption Card */}
      <div className="p-4 rounded-xl bg-eco-bg/50 border border-eco-border/40 flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-eco text-white flex items-center justify-center flex-shrink-0 mt-0.5 font-serif font-bold text-xs">
          12
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-xs text-eco">UN SDG 12 Alignment</span>
            <Leaf className="w-3 h-3 text-eco" />
          </div>
          <p className="text-[11px] text-ink-soft mt-0.5 leading-relaxed">
            By identifying textiles before purchasing, you reduce demand for shedding synthetic microfibres and support circular, responsible fashion.
          </p>
        </div>
      </div>

      {/* Explore Fabrics Carousel */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-ink-soft">
            Explore 6 Core Fabrics
          </h3>
          <button
            onClick={() => onLearnClick()}
            className="text-xs font-semibold text-rust hover:underline flex items-center gap-0.5"
          >
            <span>Encyclopedia</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-none">
          {fabricsList.map((fabric) => (
            <div
              key={fabric.id}
              onClick={() => onLearnClick(fabric.id)}
              className="w-32 flex-shrink-0 bg-canvas-card rounded-xl border border-tan/50 p-2.5 cursor-pointer hover:border-rust hover:shadow-soft transition-all group"
            >
              <div className="w-full h-20 rounded-lg overflow-hidden border border-tan/40 mb-2 bg-canvas-deep">
                <img
                  src={fabric.sampleImage}
                  alt={fabric.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
              </div>
              <h5 className="font-serif font-bold text-xs text-ink truncate">
                {fabric.name}
              </h5>
              <p className="text-[10px] text-ink-soft truncate">
                {fabric.fibreType} &bull; {fabric.sustainabilityCategory === 'Eco-Friendly' ? 'Eco' : 'Synthetic'}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
