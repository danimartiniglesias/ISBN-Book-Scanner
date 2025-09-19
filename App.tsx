
import React, { useState, useCallback, useEffect } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import ISBNList from './components/ISBNList';
import Scanner from './components/Scanner';
import Modal from './components/Modal';
import { CheckCircleIcon, XCircleIcon, CameraIcon } from './components/icons';

const App: React.FC = () => {
  const [isbns, setIsbns] = useLocalStorage<string[]>('isbns', []);
  const [isScannerOpen, setIsScannerOpen] = useState<boolean>(false);
  const [scannedCode, setScannedCode] = useState<string | null>(null);

  const handleScanSuccess = useCallback((result: string) => {
    setScannedCode(result);
    setIsScannerOpen(false);
  }, []);

  const handleConfirmISBN = () => {
    if (scannedCode && !isbns.includes(scannedCode)) {
      setIsbns(prevIsbns => [...prevIsbns, scannedCode]);
    }
    setScannedCode(null);
  };

  const handleCancelConfirmation = () => {
    setScannedCode(null);
  };

  const handleDeleteISBN = (isbnToDelete: string) => {
    setIsbns(isbns.filter(isbn => isbn !== isbnToDelete));
  };

  const exportToFile = (data: string, filename: string, type: string) => {
    const blob = new Blob([data], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportTXT = () => {
    const data = isbns.join('\n');
    exportToFile(data, 'isbns.txt', 'text/plain');
  };

  const handleExportCSV = () => {
    const header = 'ISBN\n';
    const data = header + isbns.join('\n');
    exportToFile(data, 'isbns.csv', 'text/csv');
  };

  return (
    <div className="min-h-screen bg-slate-100 font-sans">
      <header className="bg-blue-600 shadow-md text-white sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">ISBN Book Scanner</h1>
        </div>
      </header>

      <main className="container mx-auto p-4 pb-28">
        <ISBNList
          isbns={isbns}
          onDelete={handleDeleteISBN}
          onExportTXT={handleExportTXT}
          onExportCSV={handleExportCSV}
        />
      </main>

      <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-top z-10">
        <div className="container mx-auto flex justify-center">
          <button
            onClick={() => setIsScannerOpen(true)}
            className="w-full max-w-md bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg shadow-lg flex items-center justify-center text-lg transition-transform transform hover:scale-105"
          >
            <CameraIcon className="w-6 h-6 mr-3" />
            Escanear nuevo ISBN
          </button>
        </div>
      </div>
      
      {isScannerOpen && (
        <Modal title="Escanear Código de Barras" onClose={() => setIsScannerOpen(false)}>
          <Scanner onScanSuccess={handleScanSuccess} />
        </Modal>
      )}

      {scannedCode && (
        <Modal title="Confirmar ISBN" onClose={handleCancelConfirmation}>
          <div className="text-center p-4">
            <p className="text-slate-600 mb-4">Se ha escaneado el siguiente ISBN:</p>
            <p className="text-2xl font-mono bg-slate-100 text-black p-3 rounded-md mb-6">{scannedCode}</p>
            {isbns.includes(scannedCode) && (
                 <p className="text-yellow-600 mb-4">Este ISBN ya está en la lista.</p>
            )}
            <div className="flex justify-center space-x-4">
              <button
                onClick={handleCancelConfirmation}
                className="flex items-center justify-center px-6 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
              >
                <XCircleIcon className="w-5 h-5 mr-2"/>
                Cancelar
              </button>
              <button
                onClick={handleConfirmISBN}
                className="flex items-center justify-center px-6 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition disabled:bg-gray-400"
                disabled={isbns.includes(scannedCode)}
              >
                <CheckCircleIcon className="w-5 h-5 mr-2"/>
                Aceptar
              </button>
            </div>
          </div>
        </Modal>
      )}

      <style>{`
        .shadow-top {
          box-shadow: 0 -4px 6px -1px rgba(0, 0, 0, 0.1), 0 -2px 4px -1px rgba(0, 0, 0, 0.06);
        }
      `}</style>
    </div>
  );
};

export default App;
