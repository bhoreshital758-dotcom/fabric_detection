import React, { useState } from 'react';
import { X, Moon, Sun, Shield, Info, Trash2, Heart } from 'lucide-react';
import { getSettings, saveSettings, clearScanHistory, AppSettings } from '../../services/storage';

interface SettingsModalProps {
  onClose: () => void;
  onHistoryCleared: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  onClose,
  onHistoryCleared,
}) => {
  const [settings, setSettings] = useState<AppSettings>(getSettings());
  const [clearedNotice, setClearedNotice] = useState(false);

  const handleToggleHistory = () => {
    const updated = saveSettings({ saveHistory: !settings.saveHistory });
    setSettings(updated);
  };

  const handleClearHistory = () => {
    clearScanHistory();
    onHistoryCleared();
    setClearedNotice(true);
    setTimeout(() => setClearedNotice(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-md bg-canvas rounded-2xl border border-tan shadow-2xl p-5 my-6 max-h-[92vh] flex flex-col space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-tan/40 pb-3">
          <h2 className="font-serif font-bold text-lg text-ink">
            Settings & Preferences
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-canvas-deep flex items-center justify-center text-ink-soft hover:text-ink transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Settings Body */}
        <div className="flex-1 overflow-y-auto space-y-5 text-xs text-ink">
          {/* History Preferences */}
          <div className="p-3.5 bg-canvas-card rounded-xl border border-tan/60 space-y-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-ink-soft">
              History & Storage
            </h3>

            <div className="flex items-center justify-between">
              <div>
                <span className="font-semibold block">Save Scan History</span>
                <span className="text-[11px] text-ink-light">Store your scans on this device</span>
              </div>

              {/* Mobile Toggle Switch */}
              <button
                onClick={handleToggleHistory}
                className={`w-11 h-6 rounded-full transition-colors relative p-0.5 ${
                  settings.saveHistory ? 'bg-rust' : 'bg-tan/60'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow-sm transform transition-transform ${
                    settings.saveHistory ? 'translate-x-5' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="pt-2 border-t border-tan/30 flex items-center justify-between">
              <span className="text-[11px] text-ink-soft">Erase all scans from device</span>
              <button
                onClick={handleClearHistory}
                className="px-3 py-1.5 rounded-lg border border-rust/40 text-rust hover:bg-rust-light/50 font-semibold text-[11px] flex items-center gap-1 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear History</span>
              </button>
            </div>

            {clearedNotice && (
              <p className="text-[11px] text-eco font-medium pt-1">
                Scan history successfully cleared.
              </p>
            )}
          </div>

          {/* Privacy & Transparency */}
          <div className="p-3.5 bg-canvas-card rounded-xl border border-tan/60 space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-xs text-ink">
              <Shield className="w-4 h-4 text-eco" />
              <span>Privacy & AI Transparency</span>
            </div>
            <p className="text-[11px] text-ink-soft leading-relaxed">
              When you tap <strong>Analyze Fabric</strong>, your image is sent securely to the local neural vision service to compute class probabilities.
            </p>
            <p className="text-[11px] text-ink-soft leading-relaxed">
              Your images are processed transiently in memory and are <strong>not stored permanently</strong> on external ad networks or sold to third parties. All sensitive API keys remain strictly secure on the server side.
            </p>
          </div>

          {/* About Fabric AI */}
          <div className="p-3.5 bg-canvas-card rounded-xl border border-tan/60 space-y-2">
            <div className="flex items-center gap-1.5 font-bold text-xs text-ink">
              <Info className="w-4 h-4 text-rust" />
              <span>About FABRIC AI</span>
            </div>
            <p className="text-[11px] text-ink-soft leading-relaxed">
              <strong>FABRIC AI: Eco-Friendly or Not</strong> is an AI-powered textile detection system designed to support UN Sustainable Development Goal 12 (Responsible Consumption & Production).
            </p>
            <div className="pt-2 border-t border-tan/30 text-[10px] text-ink-light space-y-0.5">
              <p>Project Authors: <strong>Aditya Bhore</strong> & <strong>Vedant Garule</strong></p>
              <p>Version: 1.0.0 &bull; Release: September 2026</p>
              <p>Model: MobileNetV2 Transfer Learning</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-tan/40 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-ink text-canvas font-semibold text-xs hover:bg-rust transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
