
import React, { useState } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Check, X, Info, Search } from 'lucide-react';

const DocumentOcrView: React.FC = () => {
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);

  const mockDoc = {
    workerName: 'Carlos Mendes',
    docType: 'Passaporte',
    nif: 'PT-456.123.789',
    expiryDate: '2025-12-15',
    confidence: 98.4
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Validação de OCR</h1>
          <p className="text-sm text-slate-500">Conferência manual de extrações automáticas</p>
        </div>
        <div className="flex items-center gap-3">
           <span className="text-xs font-bold text-compliance-amber bg-amber-50 px-3 py-1.5 rounded-full border border-amber-200">Aguardando Validação: 08</span>
        </div>
      </div>

      <div className="flex-1 flex gap-4 min-h-0">
        {/* Left Side: Viewer */}
        <div className="flex-1 bg-slate-900 rounded-lg flex flex-col relative overflow-hidden group">
          {/* Viewer Tools */}
          <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-industrial/80 backdrop-blur-md p-1.5 rounded-full z-10 opacity-0 group-hover:opacity-100 transition-opacity">
            <button onClick={() => setZoom(z => Math.max(z - 10, 50))} className="p-2 hover:bg-white/10 rounded-full text-white"><ZoomOut size={18}/></button>
            <span className="text-xs font-bold text-white px-2">{zoom}%</span>
            <button onClick={() => setZoom(z => Math.min(z + 10, 200))} className="p-2 hover:bg-white/10 rounded-full text-white"><ZoomIn size={18}/></button>
            <div className="w-px h-4 bg-white/20 mx-1" />
            <button onClick={() => setRotation(r => (r + 90) % 360)} className="p-2 hover:bg-white/10 rounded-full text-white"><RotateCcw size={18}/></button>
          </div>

          <div className="flex-1 overflow-auto flex items-center justify-center p-8 no-scrollbar">
            <div 
              className="bg-white shadow-2xl transition-all duration-300"
              style={{ 
                width: `${zoom}%`, 
                maxWidth: '600px', 
                aspectRatio: '1 / 1.41',
                transform: `rotate(${rotation}deg)`
              }}
            >
              <div className="h-full w-full flex flex-col p-8 border-[12px] border-slate-100">
                 <div className="h-12 w-full bg-slate-200 mb-8 rounded" />
                 <div className="flex-1 space-y-4">
                    <div className="h-4 w-3/4 bg-slate-100 rounded" />
                    <div className="h-4 w-1/2 bg-slate-100 rounded" />
                    <div className="h-24 w-full bg-slate-50 border-2 border-dashed border-slate-200 rounded flex items-center justify-center text-slate-300 font-bold uppercase tracking-widest">
                       Foto / Documento
                    </div>
                    <div className="h-4 w-full bg-slate-100 rounded" />
                    <div className="h-4 w-5/6 bg-slate-100 rounded" />
                 </div>
                 <div className="h-16 w-full bg-slate-100 mt-auto rounded border border-slate-200 flex items-center px-4">
                    <div className="w-full space-y-2">
                       <div className="h-2 w-full bg-slate-200 rounded" />
                       <div className="h-2 w-2/3 bg-slate-200 rounded" />
                    </div>
                 </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Form */}
        <div className="w-[450px] bg-white rounded-lg border border-slate-200 flex flex-col shadow-sm">
          <div className="p-5 border-b border-slate-100 bg-slate-50/50">
            <h2 className="text-base font-bold text-slate-900">Dados Extraídos</h2>
            <div className="flex items-center gap-2 mt-1">
              <div className="w-full bg-slate-200 h-1 rounded-full overflow-hidden">
                <div className="bg-compliance-green h-full" style={{ width: '98%' }} />
              </div>
              <span className="text-[10px] font-bold text-compliance-green whitespace-nowrap">OCR: 98% CONFIDÊNCIA</span>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-5 no-scrollbar">
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Nome Completo</label>
              <input 
                type="text" 
                defaultValue={mockDoc.workerName}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md font-semibold text-slate-900 focus:ring-2 focus:ring-industrial/10 outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Tipo</label>
                <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md font-semibold text-slate-900">
                  <option>Passaporte</option>
                  <option>Cartão Cidadão</option>
                  <option>A1</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">NIF / Número</label>
                <input 
                  type="text" 
                  defaultValue={mockDoc.nif}
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md font-mono text-industrial outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Data de Validade</label>
              <input 
                type="date" 
                defaultValue={mockDoc.expiryDate}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md font-semibold text-slate-900"
              />
            </div>

            <div className="p-4 bg-slate-50 rounded-lg border border-slate-100">
               <div className="flex items-start gap-3">
                  <Info size={16} className="text-industrial shrink-0 mt-0.5" />
                  <p className="text-xs text-slate-600 leading-relaxed">
                    A extração automática identificou o país de origem como <b>Portugal</b> e o tipo como <b>Documento de Identidade</b>.
                  </p>
               </div>
            </div>
          </div>

          <div className="p-5 border-t border-slate-100 flex gap-3">
            <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-compliance-red text-white font-bold rounded-md hover:opacity-90 transition-opacity">
              <X size={18} /> Rejeitar
            </button>
            <button className="flex-[2] flex items-center justify-center gap-2 py-3 bg-compliance-green text-white font-bold rounded-md hover:opacity-90 transition-opacity">
              <Check size={18} /> Aprovar Documento
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentOcrView;
