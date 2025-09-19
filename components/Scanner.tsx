import React, { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader, IScannerControls } from '@zxing/browser';

interface ScannerProps {
  onScanSuccess: (result: string) => void;
}

const Scanner: React.FC<ScannerProps> = ({ onScanSuccess }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const controlsRef = useRef<IScannerControls | null>(null);

  useEffect(() => {
    if (!videoRef.current) return;

    const codeReader = new BrowserMultiFormatReader();

    const startScanner = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setIsLoading(false);
          const controls = await codeReader.decodeFromVideoDevice(undefined, videoRef.current, (result, err) => {
            if (result) {
              onScanSuccess(result.getText());
            }
            // We can ignore NotFoundException and other minor errors that occur during scanning
          });
          controlsRef.current = controls;
        }
      } catch (err) {
        console.error("Camera access error:", err);
        setError("No se pudo acceder a la cámara. Por favor, revisa los permisos.");
        setIsLoading(false);
      }
    };

    startScanner();

    return () => {
      if (controlsRef.current) {
        controlsRef.current.stop();
        controlsRef.current = null;
      }
    };
  }, [onScanSuccess]);
  
  return (
    <div className="relative w-full aspect-square bg-black rounded-lg overflow-hidden">
      <video ref={videoRef} className="w-full h-full object-cover" autoPlay playsInline />
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="w-full max-w-xs h-2/5 border-4 border-dashed border-white/50 rounded-lg"></div>
      </div>
       {isLoading && (
        <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center text-white">
          <svg className="animate-spin h-8 w-8 text-white mb-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          Iniciando cámara...
        </div>
      )}
      {error && (
        <div className="absolute inset-0 bg-red-500/90 flex flex-col items-center justify-center text-white p-4 text-center">
            <p className="font-bold">Error</p>
            <p>{error}</p>
        </div>
      )}
      <div className="absolute bottom-4 left-4 right-4 text-white text-center bg-black/50 p-2 rounded-md">
        Apunta la cámara al código de barras del libro
      </div>
    </div>
  );
};

export default Scanner;