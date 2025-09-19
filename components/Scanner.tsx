
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
    // Dynamically load the zxing script if it's not already loaded
    const scriptId = 'zxing-scanner-script';
    let script = document.getElementById(scriptId) as HTMLScriptElement;

    const initializeScanner = () => {
        if (!videoRef.current) return;
        
        const codeReader = new BrowserMultiFormatReader();
        
        navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
            .then(stream => {
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    setIsLoading(false);
                    codeReader.decodeFromVideoDevice(undefined, videoRef.current, (result, err, controls) => {
                        controlsRef.current = controls;
                        if (result) {
                            onScanSuccess(result.getText());
                        }
                        if (err && !(err instanceof DOMException)) {
                            // We can ignore NotFoundException, which happens when no barcode is found
                        }
                    });
                }
            })
            .catch(err => {
                console.error("Camera access error:", err);
                setError("No se pudo acceder a la cámara. Por favor, revisa los permisos.");
                setIsLoading(false);
            });

        return () => {
            if (controlsRef.current) {
                controlsRef.current.stop();
                controlsRef.current = null;
            }
        };
    };
    
    if (!script) {
        script = document.createElement('script');
        script.id = scriptId;
        script.src = 'https://cdn.jsdelivr.net/npm/@zxing/browser@0.1.4/es2015/zxing-browser.min.js';
        script.async = true;
        script.onload = () => {
            console.log('ZXing script loaded.');
            initializeScanner();
        };
        document.body.appendChild(script);
    } else {
        initializeScanner();
    }
    
    return () => {
      if (controlsRef.current) {
        controlsRef.current.stop();
        controlsRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  return (
    <div className="relative w-full aspect-square bg-black rounded-lg overflow-hidden">
      <video ref={videoRef} className="w-full h-full object-cover" />
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
