import { HistoryItem, ScanAnalytics, PredictionResult } from '../types/fabric';

const HISTORY_KEY = 'fabric_ai_scan_history';
const ONBOARDED_KEY = 'fabric_ai_onboarded_v1';
const SETTINGS_KEY = 'fabric_ai_settings';

export interface AppSettings {
  theme: 'light' | 'dark' | 'system';
  saveHistory: boolean;
  hapticFeedback: boolean;
}

const DEFAULT_SETTINGS: AppSettings = {
  theme: 'light',
  saveHistory: true,
  hapticFeedback: true,
};

export function getScanHistory(): HistoryItem[] {
  try {
    const raw = localStorage.getItem(HISTORY_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    console.error('Failed to load scan history:', e);
    return [];
  }
}

export function saveScanToHistory(result: PredictionResult, imageUrl: string): HistoryItem | null {
  const settings = getSettings();
  if (!settings.saveHistory) return null;

  try {
    const history = getScanHistory();
    const newItem: HistoryItem = {
      id: 'scan-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      fabric_type: result.fabric_type,
      confidence: result.confidence,
      sustainability: result.sustainability,
      ranked_predictions: result.ranked_predictions,
      image_url: imageUrl,
      timestamp: Date.now(),
    };

    // Store up to 60 most recent scans
    const updated = [newItem, ...history].slice(0, 60);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    return newItem;
  } catch (e) {
    console.error('Failed to save scan to history:', e);
    return null;
  }
}

export function deleteScanFromHistory(id: string): HistoryItem[] {
  try {
    const history = getScanHistory();
    const updated = history.filter(item => item.id !== id);
    localStorage.setItem(HISTORY_KEY, JSON.stringify(updated));
    return updated;
  } catch (e) {
    console.error('Failed to delete scan item:', e);
    return getScanHistory();
  }
}

export function clearScanHistory(): void {
  try {
    localStorage.removeItem(HISTORY_KEY);
  } catch (e) {
    console.error('Failed to clear scan history:', e);
  }
}

export function calculateAnalytics(history: HistoryItem[]): ScanAnalytics {
  if (!history || history.length === 0) {
    return {
      totalScans: 0,
      mostDetected: 'None yet',
      naturalCount: 0,
      syntheticCount: 0,
      ecoFriendlyCount: 0,
      nonEcoCount: 0,
      averageConfidence: 0,
      fabricBreakdown: {},
    };
  }

  const breakdown: Record<string, number> = {};
  let totalConfidence = 0;
  let naturalCount = 0;
  let syntheticCount = 0;
  let ecoFriendlyCount = 0;
  let nonEcoCount = 0;

  history.forEach(item => {
    const name = item.fabric_type;
    breakdown[name] = (breakdown[name] || 0) + 1;
    totalConfidence += item.confidence;

    const fibre = item.sustainability?.fibre_type?.toLowerCase() || '';
    if (fibre.includes('natural')) naturalCount++;
    else if (fibre.includes('synthetic')) syntheticCount++;

    const category = item.sustainability?.category?.toLowerCase() || '';
    if (category.includes('non')) nonEcoCount++;
    else if (category.includes('eco')) ecoFriendlyCount++;
  });

  let topFabric = 'Cotton';
  let maxCount = 0;
  Object.entries(breakdown).forEach(([fab, count]) => {
    if (count > maxCount) {
      maxCount = count;
      topFabric = fab;
    }
  });

  return {
    totalScans: history.length,
    mostDetected: topFabric,
    naturalCount,
    syntheticCount,
    ecoFriendlyCount,
    nonEcoCount,
    averageConfidence: totalConfidence / history.length,
    fabricBreakdown: breakdown,
  };
}

export function isOnboardingCompleted(): boolean {
  return localStorage.getItem(ONBOARDED_KEY) === 'true';
}

export function setOnboardingCompleted(completed: boolean): void {
  localStorage.setItem(ONBOARDED_KEY, completed ? 'true' : 'false');
}

export function getSettings(): AppSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export function saveSettings(settings: Partial<AppSettings>): AppSettings {
  try {
    const current = getSettings();
    const updated = { ...current, ...settings };
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
    return updated;
  } catch {
    return DEFAULT_SETTINGS;
  }
}
