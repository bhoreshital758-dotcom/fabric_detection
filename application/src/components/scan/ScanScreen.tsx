import React, { useState, useRef } from 'react';
import { Camera, Upload, RefreshCw, X, AlertTriangle, ChevronDown, ChevronUp, Sparkles, Check, Info } from 'lucide-react';
import { CameraCapture } from './CameraCapture';
import { AnalysisLoader } from './AnalysisLoader';
import { SAMPLE_TEST_FABRICS } from '../../data/fabricData';
import { predictFabric } from '../../services/api';
import { PredictionResult } from '../../types/fabric';

interface ScanScreenProps {
  onAnalysisSuccess: (result: PredictionResult, previewUrl: string) => void;
  onAnalysisError: (errorMessage: string) => void;
}

export const ScanScreen: React.FC<ScanScreenProps> = ({
  onAnalysisSuccess,
  onAnalysisError,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | Blob | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showTips, setShowTips] = useState(false);
  const [qualityWarning, setQualityWarning] = useState<string | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFile = (file: File | Blob) => {
    setSelectedFile(file);
    setQualityWarning(null);

    const reader = new FileReader();
    reader.onload = (e) => {
      const url = e.target?.result as string;
      setPreviewUrl(url);

      // Simple image quality heuristic
      const img = new Image();
      img.onload = () => {
        if (img.width < 160 || img.height < 160) {
          setQualityWarning('Image resolution is relatively low. For best neural model precision, a close-up texture photo is recommended.');
        }
      };
      img.src = url;
    };
    reader.readAsDataURL(file);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0]);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleSelectSample = async (sample: typeof SAMPLE_TEST_FABRICS[0]) => {
    setQualityWarning(null);
    setPreviewUrl(sample.image);

    // Convert sample data SVG into Blob for genuine model inference
    try {
      const res = await fetch(sample.image);
      const blob = await res.blob();
      setSelectedFile(blob);
    } catch {
      // Fallback: create plain canvas blob
      const canvas = document.createElement('canvas');
      canvas.width = 300;
      canvas.height = 300;
      canvas.toBlob((b) => {
        if (b) setSelectedFile(b);
      }, 'image/jpeg');
    }
  };

  const handleAnalyze = async () => {
    if (!selectedFile || !previewUrl) return;

    setIsAnalyzing(true);
    try {
      // Call actual backend prediction endpoint
      const result = await predictFabric(selectedFile);
      setIsAnalyzing(false);
      onAnalysisSuccess(result, previewUrl);
    } catch (err: unknown) {
      setIsAnalyzing(false);
      const message = err instanceof Error ? err.message : 'Analysis could not be completed. Please check your network connection.';
      onAnalysisError(message);
    }
  };

  const handleClearImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setQualityWarning(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // If currently analyzing, display the analysis loader
  if (isAnalyzing && previewUrl) {
    return <AnalysisLoader imagePreviewUrl={previewUrl} />;
  }

  return (
    <div className="space-y-5 animate-fade-in">
      {/* Live Camera View Overlay */}
      {isCameraActive && (
        <CameraCapture
          onCapture={(blob, dataUrl) => {
            setSelectedFile(blob);
            setPreviewUrl(dataUrl);
            setIsCameraActive(false);
          }}
          onClose={() => setIsCameraActive(false)}
        />
      )}

      {/* Header */}
      <div>
        <span className="text-xs uppercase tracking-wider font-semibold text-rust">
          Textile Visual Classifier
        </span>
        <h1 className="font-serif text-2xl font-bold tracking-tight text-ink mt-0.5">
          Scan Fabric
        </h1>
        <p className="text-xs text-ink-soft mt-0.5">
          Take a close-up photo or choose an image to analyze weave and sustainability.
        </p>
      </div>

      {/* Main Image Selection Area */}
      {!previewUrl ? (
        <div className="space-y-4">
          {/* Primary Action Buttons: Take Photo & Gallery Upload */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setIsCameraActive(true)}
              className="flex flex-col items-center justify-center p-5 rounded-2xl bg-ink text-canvas hover:bg-rust transition-colors shadow-soft group"
            >
              <div className="w-12 h-12 rounded-xl bg-canvas/10 flex items-center justify-center mb-2.5 group-hover:bg-canvas/20">
                <Camera className="w-6 h-6 text-canvas" />
              </div>
              <span className="font-serif font-bold text-sm">Take Photo</span>
              <span className="text-[10px] text-canvas-deep/80 mt-0.5">Using Camera</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center justify-center p-5 rounded-2xl bg-canvas-card border-2 border-tan/60 hover:border-rust transition-all shadow-soft group"
            >
              <div className="w-12 h-12 rounded-xl bg-canvas-deep flex items-center justify-center mb-2.5 group-hover:bg-rust-light">
                <Upload className="w-6 h-6 text-ink group-hover:text-rust" />
              </div>
              <span className="font-serif font-bold text-sm text-ink">Upload Image</span>
              <span className="text-[10px] text-ink-soft mt-0.5">From Gallery</span>
            </button>
          </div>

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileInputChange}
          />

          {/* Desktop Drag and Drop Box */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-colors ${
              isDragOver
                ? 'border-rust bg-rust-light/30'
                : 'border-tan/70 bg-canvas-card/60 hover:border-rust hover:bg-canvas-card'
            }`}
          >
            <Upload className="w-6 h-6 text-tan mx-auto mb-1.5" />
            <p className="text-xs font-semibold text-ink">
              Drag and drop fabric image here
            </p>
            <p className="text-[10px] text-ink-light mt-0.5">
              Supports JPEG, PNG, WEBP up to 12MB
            </p>
          </div>

          {/* 1-Tap Testing with Real Fabric Samples */}
          <div className="pt-2">
            <div className="flex items-center gap-1.5 mb-2.5">
              <Sparkles className="w-3.5 h-3.5 text-rust" />
              <span className="text-xs font-bold uppercase tracking-wider text-ink-soft">
                Or test with sample fabrics:
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {SAMPLE_TEST_FABRICS.map((sample) => (
                <button
                  key={sample.name}
                  onClick={() => handleSelectSample(sample)}
                  className="p-2 rounded-xl bg-canvas-card border border-tan/60 hover:border-rust hover:shadow-soft transition-all text-left flex flex-col group"
                >
                  <div className="w-full h-14 rounded-lg overflow-hidden border border-tan/40 mb-1.5 bg-canvas-deep">
                    <img
                      src={sample.image}
                      alt={sample.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <span className="font-serif font-bold text-xs text-ink truncate">
                    {sample.name.replace(' Sample', '')}
                  </span>
                  <span className="text-[9px] text-ink-soft truncate">
                    {sample.subtitle}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Image Preview State */
        <div className="space-y-4">
          <div className="relative rounded-2xl overflow-hidden border-2 border-tan shadow-lift bg-canvas-deep">
            <img
              src={previewUrl}
              alt="Selected fabric preview"
              className="w-full max-h-80 object-cover"
            />

            {/* Remove preview button */}
            <button
              onClick={handleClearImage}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-ink/70 text-white flex items-center justify-center hover:bg-ink transition-colors shadow-md backdrop-blur-sm"
              aria-label="Remove image"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Replace button */}
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-3 right-3 px-3 py-1.5 rounded-lg bg-white/90 text-ink text-xs font-semibold flex items-center gap-1.5 hover:bg-white shadow-md backdrop-blur-sm"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Replace</span>
            </button>
          </div>

          {/* Quality Warning if applicable */}
          {qualityWarning && (
            <div className="p-3 rounded-xl bg-rust-light/70 border border-rust/30 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-rust flex-shrink-0 mt-0.5" />
              <p className="text-xs text-ink-soft leading-relaxed">
                {qualityWarning}
              </p>
            </div>
          )}

          {/* Primary CTA: Analyze Fabric */}
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing}
            className="w-full py-4 rounded-xl bg-ink text-canvas font-medium text-base hover:bg-rust transition-all flex items-center justify-center gap-2 shadow-lift active:scale-[0.99]"
          >
            <Sparkles className="w-5 h-5 text-rust-light" />
            <span>Analyze Fabric</span>
          </button>
        </div>
      )}

      {/* Expandable Image Quality Guidance Tips */}
      <div className="border border-tan/60 rounded-xl bg-canvas-card overflow-hidden">
        <button
          onClick={() => setShowTips(!showTips)}
          className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-canvas-deep/40 transition-colors"
        >
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-rust" />
            <span className="text-xs font-bold uppercase tracking-wider text-ink">
              Tips for accurate AI results
            </span>
          </div>
          {showTips ? (
            <ChevronUp className="w-4 h-4 text-ink-soft" />
          ) : (
            <ChevronDown className="w-4 h-4 text-ink-soft" />
          )}
        </button>

        {showTips && (
          <div className="px-4 pb-4 pt-1 space-y-2 border-t border-tan/30 text-xs text-ink-soft">
            <div className="flex items-start gap-2">
              <Check className="w-3.5 h-3.5 text-eco flex-shrink-0 mt-0.5" />
              <span><strong>Good lighting:</strong> Use bright, natural, indirect lighting without glare.</span>
            </div>
            <div className="flex items-start gap-2">
              <Check className="w-3.5 h-3.5 text-eco flex-shrink-0 mt-0.5" />
              <span><strong>Macro close-up:</strong> Frame 5–15 cm from the fabric to capture individual threads.</span>
            </div>
            <div className="flex items-start gap-2">
              <Check className="w-3.5 h-3.5 text-eco flex-shrink-0 mt-0.5" />
              <span><strong>Avoid heavy shadows:</strong> Ensure the woven surface is uniformly illuminated.</span>
            </div>
            <div className="flex items-start gap-2">
              <Check className="w-3.5 h-3.5 text-eco flex-shrink-0 mt-0.5" />
              <span><strong>Keep in focus:</strong> Tap your screen to focus sharply on the textile weave texture.</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
