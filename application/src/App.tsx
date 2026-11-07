import React, { useState, useEffect } from 'react';
import { AppShell } from './components/layout/AppShell';
import { TabType } from './components/layout/BottomNavigation';
import { SplashScreen } from './components/layout/SplashScreen';
import { OnboardingModal } from './components/layout/OnboardingModal';
import { HomeScreen } from './components/home/HomeScreen';
import { ScanScreen } from './components/scan/ScanScreen';
import { ResultScreen } from './components/result/ResultScreen';
import { HistoryScreen } from './components/history/HistoryScreen';
import { LearnScreen } from './components/learn/LearnScreen';
import { ProfileScreen } from './components/profile/ProfileScreen';
import { CompareModal } from './components/learn/CompareModal';
import { InsightsScreen } from './components/insights/InsightsScreen';
import { DeveloperModal } from './components/developer/DeveloperModal';

import { PredictionResult, HistoryItem, UserProfile } from './types/fabric';
import {
  getScanHistory,
  saveScanToHistory,
  deleteScanFromHistory,
  clearScanHistory,
  isOnboardingCompleted,
} from './services/storage';
import { subscribeToAuth, getLocalGuestProfile } from './services/firebase';
import { AlertCircle, X } from 'lucide-react';

export const App: React.FC = () => {
  // Splash & Onboarding State
  const [showSplash, setShowSplash] = useState(true);
  const [showOnboarding, setShowOnboarding] = useState(false);

  // Navigation & Screen State
  const [currentTab, setCurrentTab] = useState<TabType>('home');
  const [activeResult, setActiveResult] = useState<PredictionResult | null>(null);
  const [activePreviewUrl, setActivePreviewUrl] = useState<string | null>(null);
  const [isSavedInHistory, setIsSavedInHistory] = useState(false);

  // Modals
  const [compareModal, setCompareModal] = useState<{ open: boolean; fabA?: string; fabB?: string }>({
    open: false,
    fabA: 'cotton',
    fabB: 'polyester',
  });
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
  const [showDeveloperModal, setShowDeveloperModal] = useState(false);
  const [selectedLearnFabric, setSelectedLearnFabric] = useState<string | null>(null);

  // Data State
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [user, setUser] = useState<UserProfile>(getLocalGuestProfile());
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Load initial data on mount
  useEffect(() => {
    setHistory(getScanHistory());

    // Check onboarding
    if (!isOnboardingCompleted()) {
      setShowOnboarding(true);
    }

    // Auth subscription
    const unsubscribe = subscribeToAuth((authProfile) => {
      setUser(authProfile);
    });

    return () => unsubscribe();
  }, []);

  // Handle successful scan
  const handleAnalysisSuccess = (result: PredictionResult, previewUrl: string) => {
    setActiveResult(result);
    setActivePreviewUrl(previewUrl);

    // Auto save to history
    const saved = saveScanToHistory(result, previewUrl);
    if (saved) {
      setHistory(getScanHistory());
      setIsSavedInHistory(true);
    }
  };

  const handleAnalysisError = (msg: string) => {
    setErrorMessage(msg);
  };

  const handleSelectHistoryItem = (item: HistoryItem) => {
    setActiveResult({
      fabric_type: item.fabric_type,
      confidence: item.confidence,
      sustainability: item.sustainability,
      ranked_predictions: item.ranked_predictions,
    });
    setActivePreviewUrl(item.image_url);
    setIsSavedInHistory(true);
  };

  const handleDeleteHistoryItem = (id: string) => {
    const updated = deleteScanFromHistory(id);
    setHistory(updated);
  };

  const handleClearAllHistory = () => {
    clearScanHistory();
    setHistory([]);
  };

  const handleScanAnother = () => {
    setActiveResult(null);
    setActivePreviewUrl(null);
    setIsSavedInHistory(false);
    setCurrentTab('scan');
  };

  return (
    <>
      {/* Splash Screen */}
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}

      {/* Onboarding Flow */}
      {showOnboarding && (
        <OnboardingModal
          isOpen={showOnboarding}
          onFinish={() => setShowOnboarding(false)}
        />
      )}

      {/* Compare Modal */}
      {compareModal.open && (
        <CompareModal
          initialFabricA={compareModal.fabA}
          initialFabricB={compareModal.fabB}
          onClose={() => setCompareModal({ open: false })}
        />
      )}

      {/* Developer & Dataset Modal */}
      {showDeveloperModal && (
        <DeveloperModal onClose={() => setShowDeveloperModal(false)} />
      )}

      {/* Error Toast Notification */}
      {errorMessage && (
        <div className="fixed top-4 left-4 right-4 z-50 max-w-md mx-auto p-3.5 bg-rust text-white rounded-xl shadow-2xl flex items-center justify-between gap-3 animate-fade-in border border-rust-dark">
          <div className="flex items-center gap-2.5 text-xs font-medium">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            onClick={() => setErrorMessage(null)}
            className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main App Container */}
      <AppShell
        currentTab={currentTab}
        onSelectTab={(tab) => {
          // If moving away from result by tapping navigation
          if (activeResult && tab !== 'scan') {
            setActiveResult(null);
          }
          setCurrentTab(tab);
        }}
        scanCount={history.length}
        onOpenCompare={() => setCompareModal({ open: true, fabA: 'cotton', fabB: 'polyester' })}
        onOpenAnalytics={() => setShowAnalyticsModal(true)}
        onOpenDeveloper={() => setShowDeveloperModal(true)}
      >
        {/* Full Analytics Overlay Modal if triggered from header */}
        {showAnalyticsModal ? (
          <div className="space-y-4">
            <button
              onClick={() => setShowAnalyticsModal(false)}
              className="text-xs font-semibold text-rust hover:underline flex items-center gap-1 mb-2"
            >
              &larr; Back to App
            </button>
            <InsightsScreen
              history={history}
              onScanClick={() => {
                setShowAnalyticsModal(false);
                handleScanAnother();
              }}
              onClose={() => setShowAnalyticsModal(false)}
            />
          </div>
        ) : activeResult && activePreviewUrl ? (
          /* Active Result View */
          <ResultScreen
            result={activeResult}
            imagePreviewUrl={activePreviewUrl}
            onScanAnother={handleScanAnother}
            onSaveToHistory={() => {
              if (!isSavedInHistory && activePreviewUrl) {
                saveScanToHistory(activeResult, activePreviewUrl);
                setHistory(getScanHistory());
                setIsSavedInHistory(true);
              }
            }}
            isSaved={isSavedInHistory}
            onViewEncyclopedia={(fabricId) => {
              setSelectedLearnFabric(fabricId);
              setActiveResult(null);
              setCurrentTab('learn');
            }}
          />
        ) : (
          /* Main Tabs */
          <>
            {currentTab === 'home' && (
              <HomeScreen
                onScanClick={() => setCurrentTab('scan')}
                onUploadClick={() => setCurrentTab('scan')}
                onHistoryClick={() => setCurrentTab('history')}
                onLearnClick={(fabricId) => {
                  setSelectedLearnFabric(fabricId || null);
                  setCurrentTab('learn');
                }}
                onCompareClick={() => setCompareModal({ open: true, fabA: 'cotton', fabB: 'polyester' })}
                recentScans={history}
                onSelectScan={(item) => handleSelectHistoryItem(item)}
              />
            )}

            {currentTab === 'scan' && (
              <ScanScreen
                onAnalysisSuccess={handleAnalysisSuccess}
                onAnalysisError={handleAnalysisError}
              />
            )}

            {currentTab === 'history' && (
              <HistoryScreen
                history={history}
                onSelectScan={(item) => handleSelectHistoryItem(item)}
                onDeleteScan={handleDeleteHistoryItem}
                onClearHistory={handleClearAllHistory}
                onScanClick={() => setCurrentTab('scan')}
              />
            )}

            {currentTab === 'learn' && (
              <LearnScreen
                selectedFabricId={selectedLearnFabric}
                onOpenCompare={(fabA, fabB) =>
                  setCompareModal({ open: true, fabA: fabA || 'cotton', fabB: fabB || 'polyester' })
                }
              />
            )}

            {currentTab === 'profile' && (
              <ProfileScreen
                user={user}
                scanCount={history.length}
                onUserUpdated={(updated) => setUser(updated)}
                onHistoryCleared={() => setHistory([])}
              />
            )}
          </>
        )}
      </AppShell>
    </>
  );
};
