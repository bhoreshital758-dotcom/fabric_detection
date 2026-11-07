import React, { useState, useMemo } from 'react';
import { Search, Trash2, Clock, Filter, AlertTriangle, Compass, ChevronRight, X } from 'lucide-react';
import { HistoryItem } from '../../types/fabric';
import { Badge } from '../ui/Badge';
import { motion, AnimatePresence } from 'framer-motion';

interface HistoryScreenProps {
  history: HistoryItem[];
  onSelectScan: (item: HistoryItem) => void;
  onDeleteScan: (id: string) => void;
  onClearHistory: () => void;
  onScanClick: () => void;
}

type FilterType = 'all' | 'natural' | 'synthetic' | 'eco' | 'non-eco';

export const HistoryScreen: React.FC<HistoryScreenProps> = ({
  history,
  onSelectScan,
  onDeleteScan,
  onClearHistory,
  onScanClick,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');
  const [confirmClear, setConfirmClear] = useState(false);

  const filterPills: { id: FilterType; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'natural', label: 'Natural' },
    { id: 'synthetic', label: 'Synthetic' },
    { id: 'eco', label: 'Eco-Friendly' },
    { id: 'non-eco', label: 'Non-Eco-Friendly' },
  ];

  const filteredItems = useMemo(() => {
    return history.filter((item) => {
      // Search filter
      const matchesSearch = item.fabric_type
        .toLowerCase()
        .includes(searchQuery.toLowerCase().trim());
      if (!matchesSearch) return false;

      // Category / Fibre filter
      const fibre = item.sustainability?.fibre_type?.toLowerCase() || '';
      const category = item.sustainability?.category?.toLowerCase() || '';

      if (activeFilter === 'natural') return fibre.includes('natural');
      if (activeFilter === 'synthetic') return fibre.includes('synthetic');
      if (activeFilter === 'eco') return !category.includes('non') && category.includes('eco');
      if (activeFilter === 'non-eco') return category.includes('non');
      return true;
    });
  }, [history, searchQuery, activeFilter]);

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <span className="text-xs uppercase tracking-wider font-semibold text-rust">
            Scanned Archive
          </span>
          <h1 className="font-serif text-2xl font-bold tracking-tight text-ink mt-0.5">
            Scan History
          </h1>
          <p className="text-xs text-ink-soft mt-0.5">
            {history.length} {history.length === 1 ? 'material saved' : 'materials saved'} locally
          </p>
        </div>

        {history.length > 0 && (
          <button
            onClick={() => setConfirmClear(true)}
            className="p-2 rounded-lg text-ink-light hover:text-rust hover:bg-canvas-deep transition-colors text-xs font-semibold flex items-center gap-1"
            title="Clear all history"
          >
            <Trash2 className="w-4 h-4" />
            <span className="hidden sm:inline">Clear All</span>
          </button>
        )}
      </div>

      {/* Confirmation Dialog for Clear All */}
      <AnimatePresence>
        {confirmClear && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="p-3.5 rounded-xl bg-rust-light/70 border border-rust/40 text-xs text-ink-soft space-y-2"
          >
            <div className="flex items-center gap-2 font-bold text-rust">
              <AlertTriangle className="w-4 h-4" />
              <span>Clear all scan history?</span>
            </div>
            <p className="text-[11px]">
              This will remove all saved scans and reset your scan analytics.
            </p>
            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                onClick={() => setConfirmClear(false)}
                className="px-3 py-1.5 rounded-lg bg-canvas-card border border-tan/60 font-semibold text-xs"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  onClearHistory();
                  setConfirmClear(false);
                }}
                className="px-3 py-1.5 rounded-lg bg-rust text-white font-semibold text-xs hover:bg-rust-dark transition-colors"
              >
                Yes, Clear All
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-ink-light absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by fabric name (e.g. Cotton, Silk)..."
          className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-canvas-card border border-tan/60 text-xs text-ink placeholder:text-ink-light focus:outline-none focus:border-rust shadow-sm"
        />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-light hover:text-ink"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Filter Pills */}
      <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {filterPills.map((pill) => {
          const isActive = activeFilter === pill.id;
          return (
            <button
              key={pill.id}
              onClick={() => setActiveFilter(pill.id)}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors border ${
                isActive
                  ? 'bg-ink text-canvas border-ink shadow-sm'
                  : 'bg-canvas-card text-ink-soft border-tan/50 hover:border-tan'
              }`}
            >
              {pill.label}
            </button>
          );
        })}
      </div>

      {/* Scans List or Empty State */}
      {filteredItems.length === 0 ? (
        <div className="p-8 rounded-2xl bg-canvas-card border border-dashed border-tan/80 text-center shadow-sm space-y-3">
          <div className="w-12 h-12 rounded-full bg-canvas-deep mx-auto flex items-center justify-center text-ink-soft">
            <Clock className="w-6 h-6 text-tan" />
          </div>

          <h3 className="font-serif font-bold text-base text-ink">
            {history.length === 0 ? 'No scans yet' : 'No matching scans found'}
          </h3>

          <p className="text-xs text-ink-soft max-w-xs mx-auto">
            {history.length === 0
              ? 'Your analyzed fabrics and eco classifications will be archived here.'
              : 'Try clearing your search query or selecting a different filter pill.'}
          </p>

          {history.length === 0 && (
            <button
              onClick={onScanClick}
              className="mt-2 px-5 py-2.5 rounded-xl bg-ink text-canvas text-xs font-semibold hover:bg-rust transition-colors shadow-soft"
            >
              Scan a Fabric Now
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filteredItems.map((item) => {
            const isEco = !item.sustainability?.category?.toLowerCase().includes('non');
            const dateStr = new Date(item.timestamp).toLocaleDateString(undefined, {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            });

            return (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="p-3 bg-canvas-card rounded-2xl border border-tan/50 hover:border-tan shadow-tag flex items-center gap-3.5 group transition-all"
              >
                {/* Image Thumbnail */}
                <div
                  onClick={() => onSelectScan(item)}
                  className="w-16 h-16 rounded-xl bg-canvas-deep overflow-hidden flex-shrink-0 border border-tan/60 cursor-pointer relative"
                >
                  <img
                    src={item.image_url}
                    alt={item.fabric_type}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>

                {/* Scan Info */}
                <div
                  onClick={() => onSelectScan(item)}
                  className="flex-1 min-w-0 cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif font-bold text-base text-ink group-hover:text-rust transition-colors truncate">
                      {item.fabric_type}
                    </h3>
                    <span className="text-[10px] font-semibold text-ink-light flex-shrink-0">
                      {dateStr}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs font-bold text-ink">
                      {Math.round(item.confidence * 100)}%
                    </span>
                    <span className="text-ink-light">&bull;</span>
                    <Badge
                      type={isEco ? 'eco' : 'synthetic'}
                      text={item.sustainability?.category || (isEco ? 'Eco' : 'Synthetic')}
                      size="sm"
                    />
                  </div>
                </div>

                {/* Individual Delete action */}
                <button
                  onClick={() => onDeleteScan(item.id)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-ink-light hover:text-rust hover:bg-rust-light/50 transition-colors"
                  title="Delete scan"
                  aria-label="Delete scan"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
};
