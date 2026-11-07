import React from 'react';
import { Sparkles, Scale, BarChart3, Database } from 'lucide-react';
import { BottomNavigation, TabType } from './BottomNavigation';

interface AppShellProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  scanCount: number;
  onOpenCompare: () => void;
  onOpenAnalytics: () => void;
  onOpenDeveloper: () => void;
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({
  currentTab,
  onSelectTab,
  scanCount,
  onOpenCompare,
  onOpenAnalytics,
  onOpenDeveloper,
  children,
}) => {
  return (
    <div className="min-h-screen bg-canvas textile-grid-bg text-ink flex flex-col items-center">
      {/* Container restricted to mobile width on small screens, gracefully expanded on larger screens */}
      <div className="w-full max-w-md min-h-screen flex flex-col bg-canvas shadow-xl relative border-x border-tan/30">
        
        {/* Luxury Header */}
        <header className="sticky top-0 z-30 bg-canvas/90 backdrop-blur-md border-b border-tan/40 px-4 py-3 flex items-center justify-between">
          <div 
            onClick={() => onSelectTab('home')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-lg bg-canvas-card border border-tan/60 flex items-center justify-center p-1 shadow-tag group-hover:border-rust transition-colors">
              <img src="/logo.svg" alt="Fabric AI Logo" className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-serif font-bold text-lg tracking-tight text-ink leading-none">
                  FABRIC <span className="text-rust">AI</span>
                </span>
                <span className="text-[9px] uppercase tracking-wider font-semibold px-1.5 py-0.5 rounded bg-eco-bg text-eco border border-eco-border/40">
                  SDG 12
                </span>
              </div>
              <p className="text-[10px] text-ink-light tracking-wide -mt-0.5">
                Identify &bull; Understand &bull; Choose Better
              </p>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex items-center gap-1">
            <button
              onClick={onOpenCompare}
              title="Compare Fabrics"
              className="w-8 h-8 rounded-full flex items-center justify-center text-ink-soft hover:text-ink hover:bg-canvas-deep transition-colors"
              aria-label="Compare Fabrics"
            >
              <Scale className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenAnalytics}
              title="Scan Insights"
              className="w-8 h-8 rounded-full flex items-center justify-center text-ink-soft hover:text-ink hover:bg-canvas-deep transition-colors"
              aria-label="Scan Insights"
            >
              <BarChart3 className="w-4 h-4" />
            </button>

            <button
              onClick={onOpenDeveloper}
              title="Developer & Dataset Tools"
              className="w-8 h-8 rounded-full flex items-center justify-center text-ink-soft hover:text-rust hover:bg-canvas-deep transition-colors"
              aria-label="Dataset Tools"
            >
              <Database className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* Main Content Area with safe padding at bottom for the navigation bar */}
        <main className="flex-1 px-4 py-4 pb-28">
          {children}
        </main>

        {/* Bottom Navigation */}
        <BottomNavigation
          currentTab={currentTab}
          onSelectTab={onSelectTab}
          scanCount={scanCount}
        />
      </div>
    </div>
  );
};
