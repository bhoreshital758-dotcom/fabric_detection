import React, { useRef, useState, useEffect } from 'react';
import { Camera, RefreshCw, X, AlertCircle } from 'lucide-react';

interface CameraCaptureProps {
  onCapture: (file: Blob, dataUrl: string) => void;
  onClose: () => void;
}

export const CameraCapture: React.FC<CameraCaptureProps> = ({ onCapture, onClose }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [facingMode, setFacingMode] = useState<'environment' | 'user'>('environment');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let activeStream: MediaStream | null = null;

    async function startCamera() {
      setIsLoading(true);
      setError(null);

      // Stop previous stream
      if (stream) {
        stream.getTracks().forEach((track) => track.stop());
      }

      try {
        const constraints: MediaStreamConstraints = {
          video: {
            facingMode: { ideal: facingMode },
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
          audio: false,
        };

        const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
        activeStream = mediaStream;
        setStream(mediaStream);

        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
        setIsLoading(false);
      } catch (err: unknown) {
        console.warn('Camera access error:', err);
        setError('Camera permission denied or camera unavailable on this device. You can upload an image from your gallery instead.');
        setIsLoading(false);
      }
    }

    startCamera();

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [facingMode]);

  const handleFlipCamera = () => {
    setFacingMode((prev) => (prev === 'environment' ? 'user' : 'environment'));
  };

  const handleTakePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;

    // Use square aspect ratio or matching video dimension
    const size = Math.min(video.videoWidth, video.videoHeight) || 600;
    canvas.width = size;
    canvas.height = size;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Crop center square
    const startX = (video.videoWidth - size) / 2;
    const startY = (video.videoHeight - size) / 2;

    ctx.drawImage(video, startX, startY, size, size, 0, 0, size, size);

    canvas.toBlob(
      (blob) => {
        if (blob) {
          const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
          if (stream) {
            stream.getTracks().forEach((t) => t.stop());
          }
          onCapture(blob, dataUrl);
        }
      },
      'image/jpeg',
      0.92
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col justify-between p-4">
      {/* Top Controls */}
      <div className="flex items-center justify-between text-white z-10 pt-2">
        <button
          onClick={() => {
            if (stream) stream.getTracks().forEach((t) => t.stop());
            onClose();
          }}
          className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/30"
          aria-label="Close Camera"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        <span className="text-xs font-semibold uppercase tracking-wider bg-black/40 px-3 py-1 rounded-full border border-white/20">
          Textile Viewfinder
        </span>

        <button
          onClick={handleFlipCamera}
          className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center hover:bg-white/30"
          aria-label="Switch Camera"
        >
          <RefreshCw className="w-5 h-5 text-white" />
        </button>
      </div>

      {/* Video Viewport with Fabric Alignment Reticle */}
      <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden rounded-2xl border border-white/20 bg-black">
        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-white/70">
            <RefreshCw className="w-8 h-8 animate-spin mb-2" />
            <span className="text-xs">Initializing camera feed...</span>
          </div>
        )}

        {error ? (
          <div className="p-6 text-center text-white max-w-xs">
            <AlertCircle className="w-10 h-10 text-rust mx-auto mb-3" />
            <p className="text-sm font-semibold">{error}</p>
            <button
              onClick={onClose}
              className="mt-4 px-4 py-2 rounded-lg bg-rust text-white text-xs font-medium"
            >
              Back to Upload
            </button>
          </div>
        ) : (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            className="w-full h-full object-cover"
          />
        )}

        {/* Framing Guide for Fabric Texture */}
        {!error && !isLoading && (
          <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
            {/* Darkened vignette around target */}
            <div className="w-64 h-64 border-2 border-dashed border-white/80 rounded-2xl relative shadow-[0_0_0_9999px_rgba(0,0,0,0.45)]">
              {/* Corner brackets */}
              <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-rust" />
              <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-rust" />
              <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-rust" />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-rust" />

              {/* Helper instruction */}
              <div className="absolute -bottom-10 left-0 right-0 text-center">
                <span className="text-[11px] font-medium text-white/90 bg-black/60 px-3 py-1 rounded-full backdrop-blur-sm border border-white/10">
                  Align fabric surface inside frame
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Hidden Canvas for capture processing */}
        <canvas ref={canvasRef} className="hidden" />
      </div>

      {/* Bottom Shutter Controls */}
      <div className="flex items-center justify-center pb-6">
        <button
          onClick={handleTakePhoto}
          disabled={Boolean(error) || isLoading}
          className="w-20 h-20 rounded-full border-4 border-white bg-rust flex items-center justify-center shadow-2xl hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
          aria-label="Capture Photo"
        >
          <Camera className="w-8 h-8 text-white" />
        </button>
      </div>
    </div>
  );
};
