import React from 'react';
import { Home, Camera, Clock, BookOpen, User } from 'lucide-react';
import { motion } from 'framer-motion';

export type TabType = 'home' | 'scan' | 'history' | 'learn' | 'profile';

interface BottomNavigationProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  scanCount?: number;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  currentTab,
  onSelectTab,
  scanCount = 0,
}) => {
  const tabs = [
    { id: 'home' as TabType, label: 'Home', icon: Home },
    { id: 'history' as TabType, label: 'History', icon: Clock, badge: scanCount > 0 ? scanCount : undefined },
    { id: 'scan' as TabType, label: 'Scan', icon: Camera, isPrimary: true },
    { id: 'learn' as TabType, label: 'Learn', icon: BookOpen },
    { id: 'profile' as TabType, label: 'Profile', icon: User },
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 bg-canvas-card/95 backdrop-blur-md border-t border-tan/40 px-3 py-2 shadow-soft md:max-w-md md:mx-auto">
      <div className="flex items-center justify-around relative">
        {tabs.map((tab) => {
          const isActive = currentTab === tab.id;
          const Icon = tab.icon;

          if (tab.isPrimary) {
            return (
              <div key={tab.id} className="relative -top-5 flex flex-col items-center">
                <motion.button
                  whileTap={{ scale: 0.92 }}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => onSelectTab(tab.id)}
                  className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lift transition-all border-2 ${
                    isActive
                      ? 'bg-rust text-canvas border-canvas shadow-rust/30'
                      : 'bg-ink text-canvas border-tan/60 hover:bg-rust shadow-ink/20'
                  }`}
                  aria-label="Scan Fabric"
                >
                  <Icon className="w-6 h-6" />
                </motion.button>
                <span className={`text-[10px] font-semibold mt-1 transition-colors ${
                  isActive ? 'text-rust' : 'text-ink-soft'
                }`}>
                  {tab.label}
                </span>
              </div>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-3 relative rounded-lg transition-colors ${
                isActive ? 'text-ink' : 'text-ink-light hover:text-ink-soft'
              }`}
            >
              <div className="relative">
                <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-110 text-ink stroke-[2.2]' : 'stroke-[1.8]'}`} />
                {tab.badge !== undefined && (
                  <span className="absolute -top-1.5 -right-2.5 bg-rust text-white text-[10px] font-bold px-1.5 py-0.2 rounded-full min-w-[16px] text-center leading-tight">
                    {tab.badge > 99 ? '99+' : tab.badge}
                  </span>
                )}
              </div>
              <span className={`text-[10px] mt-1 transition-all ${
                isActive ? 'font-bold text-ink' : 'font-medium text-ink-light'
              }`}>
                {tab.label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="activeTabDot"
                  className="w-1 h-1 bg-rust rounded-full mt-0.5"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
