import React from 'react';
import { DownloadIcon, TrashIcon, TxtFileIcon, CsvFileIcon } from './icons';

interface ISBNListProps {
  isbns: string[];
  onDelete: (isbn: string) => void;
  onExportTXT: () => void;
  onExportCSV: () => void;
}

const ISBNList: React.FC<ISBNListProps> = ({ isbns, onDelete, onExportTXT, onExportCSV }) => {
  if (isbns.length === 0) {
    return (
      <div className="text-center p-10 bg-white rounded-lg shadow">
        <h2 className="text-xl font-semibold text-slate-700">Tu lista está vacía</h2>
        <p className="text-slate-500 mt-2">
          Presiona el botón "Escanear nuevo ISBN" para empezar a añadir libros
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-xl font-semibold text-slate-800">ISBNs Guardados ({isbns.length})</h2>
        <div className="flex space-x-2">
            <button onClick={onExportTXT} className="p-2 text-slate-600 hover:bg-slate-100 rounded-full transition" title="Exportar como TXT">
                <TxtFileIcon className="w-6 h-6"/>
            </button>
            <button onClick={onExportCSV} className="p-2 text-slate-600 hover:bg-slate-100 rounded-full transition" title="Exportar como CSV">
                <CsvFileIcon className="w-6 h-6"/>
            </button>
        </div>
      </div>
      <ul className="divide-y divide-slate-200">
        {isbns.map((isbn, index) => (
          <li key={index} className="px-4 py-3 flex justify-between items-center hover:bg-slate-50">
            <span className="font-mono text-slate-700">{isbn}</span>
            <button onClick={() => onDelete(isbn)} className="p-2 text-red-500 hover:bg-red-100 rounded-full transition" title="Eliminar ISBN">
              <TrashIcon className="w-5 h-5" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ISBNList;