
import React, { useState } from 'react';
import { Search, Filter, CheckCircle2, Clock, XCircle, AlertTriangle, Loader2, Eye, X, ZoomIn, ZoomOut, RotateCcw, Check } from 'lucide-react';

type DocStatus = 'approved' | 'pending' | 'expired' | 'processing' | 'manual_review';

interface Document {
  id: string;
  workerName: string;
  type: string;
  number: string;
  uploadDate: string;
  expiryDate: string;
  status: DocStatus;
  confidence: number;
  source: string;
}

const MOCK_DOCUMENTS: Document[] = [
  { id: 'd1', workerName: 'Ricardo Santos', type: 'Passaporte', number: 'PT-123456789', uploadDate: '2024-03-15', expiryDate: '2026-12-15', status: 'approved', confidence: 99.2, source: 'WhatsApp' },
  { id: 'd2', workerName: 'Ana Oliveira', type: 'Certificado A1', number: 'A1-PT-2024-001', uploadDate: '2024-03-14', expiryDate: '2024-06-14', status: 'approved', confidence: 97.8, source: 'Upload' },
  { id: 'd3', workerName: 'Carlos Mendes', type: 'Passaporte', number: 'PT-456123789', uploadDate: '2024-03-13', expiryDate: '2023-11-01', status: 'expired', confidence: 98.1, source: 'WhatsApp' },
  { id: 'd4', workerName: 'Juliana Lima', type: 'Cartão Cidadão', number: 'CC-321654987', uploadDate: '2024-03-12', expiryDate: '2027-05-20', status: 'processing', confidence: 0, source: 'Upload' },
  { id: 'd5', workerName: 'Marcos Silva', type: 'Certidão Soldador', number: 'WELD-2024-159', uploadDate: '2024-03-11', expiryDate: '2025-03-11', status: 'pending', confidence: 85.3, source: 'WhatsApp' },
  { id: 'd6', workerName: 'Pedro Alves', type: 'Certificado A1', number: 'A1-PT-2024-042', uploadDate: '2024-03-10', expiryDate: '2024-09-10', status: 'manual_review', confidence: 62.1, source: 'WhatsApp' },
  { id: 'd7', workerName: 'Sofia Costa', type: 'Contrato', number: 'CTR-2024-088', uploadDate: '2024-03-09', expiryDate: '2025-01-01', status: 'approved', confidence: 99.5, source: 'Upload' },
  { id: 'd8', workerName: 'Bruno Ferreira', type: 'Passaporte', number: 'PT-789456123', uploadDate: '2024-03-08', expiryDate: '2028-07-22', status: 'approved', confidence: 98.9, source: 'Email' },
  { id: 'd9', workerName: 'Trabalhador Genérico 6', type: 'Certificado A1', number: 'A1-PT-2024-099', uploadDate: '2024-03-07', expiryDate: '2024-04-01', status: 'pending', confidence: 91.0, source: 'WhatsApp' },
  { id: 'd10', workerName: 'Trabalhador Genérico 7', type: 'Ficha Médica', number: 'MED-2024-201', uploadDate: '2024-03-06', expiryDate: '2025-03-06', status: 'manual_review', confidence: 45.2, source: 'WhatsApp' },
];

const STATUS_CONFIG: Record<DocStatus, { icon: React.ElementType; label: string; className: string }> = {
  approved: { icon: CheckCircle2, label: 'Aprovado', className: 'text-compliance-green bg-green-50' },
  pending: { icon: Clock, label: 'Pendente', className: 'text-amber-600 bg-amber-50' },
  expired: { icon: XCircle, label: 'Expirado', className: 'text-compliance-red bg-red-50' },
  processing: { icon: Loader2, label: 'OCR em Análise', className: 'text-blue-600 bg-blue-50' },
  manual_review: { icon: AlertTriangle, label: 'Revisão Manual', className: 'text-orange-600 bg-orange-50' },
};

const DocumentOcrView: React.FC = () => {
  const [filter, setFilter] = useState<DocStatus | 'all'>('all');
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [zoom, setZoom] = useState(100);
  const [rotation, setRotation] = useState(0);

  const filtered = filter === 'all' ? MOCK_DOCUMENTS : MOCK_DOCUMENTS.filter(d => d.status === filter);

  const counts = {
    all: MOCK_DOCUMENTS.length,
    approved: MOCK_DOCUMENTS.filter(d => d.status === 'approved').length,
    pending: MOCK_DOCUMENTS.filter(d => d.status === 'pending').length,
    expired: MOCK_DOCUMENTS.filter(d => d.status === 'expired').length,
    processing: MOCK_DOCUMENTS.filter(d => d.status === 'processing').length,
    manual_review: MOCK_DOCUMENTS.filter(d => d.status === 'manual_review').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Documentos</h1>
          <p className="text-sm text-slate-500">Lista geral de documentos — validação OCR em background</p>
        </div>
        <div className="flex items-center gap-2">
          {counts.manual_review > 0 && (
            <span className="text-xs font-bold text-orange-700 bg-orange-50 px-3 py-1.5 rounded-full border border-orange-200">
              {counts.manual_review} requer revisão manual
            </span>
          )}
        </div>
      </div>

      {/* Status filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {[
          { key: 'all' as const, label: 'Todos' },
          { key: 'approved' as const, label: 'Aprovados' },
          { key: 'pending' as const, label: 'Pendentes' },
          { key: 'manual_review' as const, label: 'Revisão Manual' },
          { key: 'processing' as const, label: 'Em Análise' },
          { key: 'expired' as const, label: 'Expirados' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-3 py-1.5 text-xs font-bold rounded-full border transition-colors ${
              filter === tab.key
                ? 'bg-industrial text-white border-industrial'
                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {tab.label} ({counts[tab.key]})
          </button>
        ))}
      </div>

      {/* Documents table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
        <div className="p-4 border-b border-slate-100 flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input type="text" placeholder="Buscar por operário ou documento..." className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm outline-none focus:ring-2 focus:ring-industrial/20" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Status</th>
                <th className="px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Operário</th>
                <th className="px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Tipo</th>
                <th className="px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Número</th>
                <th className="px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Upload</th>
                <th className="px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Validade</th>
                <th className="px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Fonte</th>
                <th className="px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest">OCR</th>
                <th className="px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(doc => {
                const statusCfg = STATUS_CONFIG[doc.status];
                const StatusIcon = statusCfg.icon;
                return (
                  <tr key={doc.id} className="group hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-3">
                      <div className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide ${statusCfg.className}`}>
                        <StatusIcon size={12} className={doc.status === 'processing' ? 'animate-spin' : ''} />
                        {statusCfg.label}
                      </div>
                    </td>
                    <td className="px-6 py-3">
                      <p className="text-sm font-bold text-slate-900">{doc.workerName}</p>
                    </td>
                    <td className="px-6 py-3 text-sm text-slate-600 font-medium">{doc.type}</td>
                    <td className="px-6 py-3">
                      <span className="font-mono text-xs text-slate-600 bg-slate-50 px-1.5 py-0.5 rounded">{doc.number}</span>
                    </td>
                    <td className="px-6 py-3 text-xs text-slate-500 font-mono">{doc.uploadDate}</td>
                    <td className="px-6 py-3 text-xs font-mono">
                      <span className={doc.status === 'expired' ? 'text-compliance-red font-bold' : 'text-slate-500'}>{doc.expiryDate}</span>
                    </td>
                    <td className="px-6 py-3">
                      <span className="text-[10px] font-bold text-slate-500 uppercase">{doc.source}</span>
                    </td>
                    <td className="px-6 py-3">
                      {doc.confidence > 0 ? (
                        <span className={`text-xs font-bold ${doc.confidence >= 90 ? 'text-compliance-green' : doc.confidence >= 70 ? 'text-amber-600' : 'text-compliance-red'}`}>
                          {doc.confidence}%
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-6 py-3">
                      <button
                        onClick={() => { setSelectedDoc(doc); setZoom(100); setRotation(0); }}
                        className="p-1.5 text-slate-400 hover:text-industrial hover:bg-slate-100 rounded transition-colors"
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Document Preview Modal */}
      {selectedDoc && (
        <div className="fixed inset-0 z-50 flex">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSelectedDoc(null)} />
          <div className="relative flex w-full max-w-5xl mx-auto my-8 gap-0 z-10">
            {/* Document viewer */}
            <div className="flex-1 bg-slate-900 rounded-l-xl flex flex-col relative overflow-hidden">
              <div className="absolute top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-industrial/80 backdrop-blur-md p-1.5 rounded-full z-10">
                <button onClick={() => setZoom(z => Math.max(z - 10, 50))} className="p-2 hover:bg-white/10 rounded-full text-white"><ZoomOut size={18} /></button>
                <span className="text-xs font-bold text-white px-2">{zoom}%</span>
                <button onClick={() => setZoom(z => Math.min(z + 10, 200))} className="p-2 hover:bg-white/10 rounded-full text-white"><ZoomIn size={18} /></button>
                <div className="w-px h-4 bg-white/20 mx-1" />
                <button onClick={() => setRotation(r => (r + 90) % 360)} className="p-2 hover:bg-white/10 rounded-full text-white"><RotateCcw size={18} /></button>
              </div>
              <div className="flex-1 overflow-auto flex items-center justify-center p-8 no-scrollbar">
                <div className="bg-white shadow-2xl transition-all duration-300" style={{ width: `${zoom}%`, maxWidth: '500px', aspectRatio: '1 / 1.41', transform: `rotate(${rotation}deg)` }}>
                  <div className="h-full w-full flex flex-col p-8 border-[12px] border-slate-100">
                    <div className="h-12 w-full bg-slate-200 mb-8 rounded" />
                    <div className="flex-1 space-y-4">
                      <div className="h-4 w-3/4 bg-slate-100 rounded" />
                      <div className="h-4 w-1/2 bg-slate-100 rounded" />
                      <div className="h-24 w-full bg-slate-50 border-2 border-dashed border-slate-200 rounded flex items-center justify-center text-slate-300 font-bold uppercase tracking-widest text-xs">Documento</div>
                      <div className="h-4 w-full bg-slate-100 rounded" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Data panel */}
            <div className="w-[380px] bg-white rounded-r-xl flex flex-col">
              <div className="flex items-center justify-between p-5 border-b border-slate-100">
                <h2 className="text-base font-bold text-slate-900">Dados do Documento</h2>
                <button onClick={() => setSelectedDoc(null)} className="p-1 hover:bg-slate-100 rounded"><X size={18} className="text-slate-400" /></button>
              </div>
              <div className="flex-1 overflow-y-auto p-5 space-y-4 no-scrollbar">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Operário</label>
                  <p className="text-sm font-bold text-slate-900">{selectedDoc.workerName}</p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tipo</label>
                    <p className="text-sm font-semibold text-slate-700">{selectedDoc.type}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Número</label>
                    <p className="text-sm font-mono text-industrial">{selectedDoc.number}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Upload</label>
                    <p className="text-sm text-slate-600">{selectedDoc.uploadDate}</p>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Validade</label>
                    <p className={`text-sm font-bold ${selectedDoc.status === 'expired' ? 'text-compliance-red' : 'text-slate-600'}`}>{selectedDoc.expiryDate}</p>
                  </div>
                </div>
                {selectedDoc.confidence > 0 && (
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Confiança OCR</label>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${selectedDoc.confidence >= 90 ? 'bg-compliance-green' : selectedDoc.confidence >= 70 ? 'bg-amber-500' : 'bg-compliance-red'}`} style={{ width: `${selectedDoc.confidence}%` }} />
                      </div>
                      <span className="text-xs font-bold text-slate-700">{selectedDoc.confidence}%</span>
                    </div>
                  </div>
                )}
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Fonte</label>
                  <p className="text-sm text-slate-600">{selectedDoc.source}</p>
                </div>
              </div>
              {/* Only show approve/reject for manual_review */}
              {selectedDoc.status === 'manual_review' && (
                <div className="p-5 border-t border-slate-100 flex gap-3">
                  <button className="flex-1 flex items-center justify-center gap-2 py-3 bg-compliance-red text-white font-bold rounded-md hover:opacity-90 transition-opacity text-sm">
                    <X size={16} /> Rejeitar
                  </button>
                  <button className="flex-[2] flex items-center justify-center gap-2 py-3 bg-compliance-green text-white font-bold rounded-md hover:opacity-90 transition-opacity text-sm">
                    <Check size={16} /> Aprovar
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentOcrView;
