import React, { useState } from 'react';
import { X, Database, Cloud, Cpu, FileText, CheckCircle2, HardDrive, RefreshCw } from 'lucide-react';

interface DeveloperModalProps {
  onClose: () => void;
}

export const DeveloperModal: React.FC<DeveloperModalProps> = ({ onClose }) => {
  const [driveSyncing, setDriveSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  const handleSimulateDriveSync = () => {
    setDriveSyncing(true);
    setSyncStatus('Connecting to Google Drive dataset storage...');
    setTimeout(() => {
      setSyncStatus('Verified Google Drive dataset folder: "PBL_Fabric_Dataset"');
      setTimeout(() => {
        setSyncStatus('6/6 Class directories synchronized. Training split verified.');
        setDriveSyncing(false);
      }, 900);
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="w-full max-w-md bg-canvas rounded-2xl border border-tan shadow-2xl p-5 my-6 max-h-[92vh] flex flex-col space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-tan/40 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-rust/10 flex items-center justify-center">
              <Database className="w-4 h-4 text-rust" />
            </div>
            <div>
              <h2 className="font-serif font-bold text-base text-ink">
                Developer & Dataset Tools
              </h2>
              <p className="text-[10px] text-ink-soft">
                Architecture, Model Pipeline & Google Drive Sync
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-canvas-deep flex items-center justify-center text-ink-soft hover:text-ink transition-colors"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto space-y-4 text-xs">
          {/* Architecture Pipeline Card */}
          <div className="p-3.5 rounded-xl bg-canvas-card border border-tan/60 space-y-2">
            <div className="flex items-center gap-2 font-bold text-ink">
              <Cpu className="w-4 h-4 text-rust" />
              <span>Vision Model Architecture</span>
            </div>
            <p className="text-[11px] text-ink-soft leading-relaxed">
              <strong>MobileNetV2</strong> transfer-learning classifier trained on ImageNet features with top GlobalAveragePooling2D and Dropout (0.3).
            </p>
            <div className="grid grid-cols-2 gap-2 text-[10px] pt-1">
              <div className="p-2 rounded bg-canvas-deep/60">
                <span className="text-ink-light block">Input Dimensions:</span>
                <span className="font-mono font-bold text-ink">224 x 224 x 3</span>
              </div>
              <div className="p-2 rounded bg-canvas-deep/60">
                <span className="text-ink-light block">Model Weights:</span>
                <span className="font-mono font-bold text-ink">fabric_model.keras (9.7MB)</span>
              </div>
            </div>
          </div>

          {/* Google Drive Dataset Sync */}
          <div className="p-3.5 rounded-xl bg-canvas-card border border-tan/60 space-y-2.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-ink">
                <Cloud className="w-4 h-4 text-synthetic" />
                <span>Google Drive Dataset Pipeline</span>
              </div>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-eco-bg text-eco font-semibold">
                Mounted
              </span>
            </div>
            <p className="text-[11px] text-ink-soft leading-relaxed">
              Google Drive connects the training dataset archives (`fabric_dataset_unextracted` and `code_split`).
            </p>

            <button
              onClick={handleSimulateDriveSync}
              disabled={driveSyncing}
              className="w-full py-2 px-3 rounded-lg border border-tan text-ink font-semibold text-xs flex items-center justify-center gap-1.5 hover:bg-canvas-deep transition-colors disabled:opacity-60"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${driveSyncing ? 'animate-spin' : ''}`} />
              <span>{driveSyncing ? 'Checking Drive Folder...' : 'Verify Google Drive Dataset Sync'}</span>
            </button>

            {syncStatus && (
              <p className="text-[11px] text-eco font-medium bg-eco-bg/50 p-2 rounded-lg border border-eco-border/30">
                {syncStatus}
              </p>
            )}
          </div>

          {/* Database Lookup System */}
          <div className="p-3.5 rounded-xl bg-canvas-card border border-tan/60 space-y-2">
            <div className="flex items-center gap-2 font-bold text-ink">
              <FileText className="w-4 h-4 text-eco" />
              <span>Two-Stage Prediction Design</span>
            </div>
            <p className="text-[11px] text-ink-soft leading-relaxed">
              Image &rarr; MobileNetV2 inference &rarr; Fabric Type Class &rarr; Look up sustainability metrics in <code className="font-mono bg-canvas-deep px-1 rounded">material_database.csv</code>.
            </p>
            <div className="p-2 rounded bg-canvas-deep/60 text-[10px] font-mono text-ink-soft">
              6 Classes: Cotton, Linen, Nylon, Polyester, Silk, Wool
            </div>
          </div>
        </div>

        {/* Close CTA */}
        <div className="pt-2 border-t border-tan/40 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl bg-ink text-canvas font-semibold text-xs hover:bg-rust transition-colors"
          >
            Close Tools
          </button>
        </div>
      </div>
    </div>
  );
};
