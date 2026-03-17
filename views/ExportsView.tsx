
import React from 'react';
import { Download, FileSpreadsheet, FileText, CheckCircle2, Clock, AlertCircle } from 'lucide-react';

const MOCK_EXPORTS = [
  { id: 'e1', type: 'Timesheet', period: 'Fev 2024', status: 'completed', records: 1240, date: '2024-03-01' },
  { id: 'e2', type: 'Timesheet', period: 'Jan 2024', status: 'completed', records: 1180, date: '2024-02-01' },
  { id: 'e3', type: 'Faturação', period: 'Fev 2024', status: 'processing', records: 48, date: '2024-03-01' },
];

const MOCK_DECLARATIONS = [
  { id: 'd1', type: 'ONSS', worker: 'Ricardo Santos', country: 'BE', status: 'confirmed', ref: 'ONSS-2024-0892' },
  { id: 'd2', type: 'Segurança Social', worker: 'Ana Oliveira', country: 'PT', status: 'submitted', ref: 'SS-2024-1204' },
  { id: 'd3', type: 'Finanças', worker: 'Carlos Mendes', country: 'PT', status: 'draft', ref: '—' },
];

const ExportsView: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Exportações & Declarações</h1>
          <p className="text-sm text-slate-500">Primavera, ONSS, Segurança Social, Finanças</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-bold bg-industrial text-white rounded-md hover:bg-slate-800 transition-all">
          <Download size={18} /> Nova Exportação
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Exports Primavera */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
          <div className="p-5 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <FileSpreadsheet size={18} className="text-industrial" />
              <h2 className="text-base font-bold text-slate-900">Exportações Primavera</h2>
            </div>
          </div>
          <div className="divide-y divide-slate-100">
            {MOCK_EXPORTS.map(exp => (
              <div key={exp.id} className="p-4 flex items-center justify-between hover:bg-slate-50/50">
                <div>
                  <p className="text-sm font-bold text-slate-900">{exp.type} — {exp.period}</p>
                  <p className="text-xs text-slate-500">{exp.records} registos • {exp.date}</p>
                </div>
                <div className="flex items-center gap-2">
                  {exp.status === 'completed' ? (
                    <>
                      <CheckCircle2 size={16} className="text-compliance-green" />
                      <button className="p-1.5 hover:bg-slate-100 rounded text-slate-400 hover:text-industrial">
                        <Download size={16} />
                      </button>
                    </>
                  ) : (
                    <span className="flex items-center gap-1 text-xs font-bold text-amber-600">
                      <Clock size={14} /> A processar
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Declarations */}
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
          <div className="p-5 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <FileText size={18} className="text-industrial" />
              <h2 className="text-base font-bold text-slate-900">Declarações Governamentais</h2>
            </div>
          </div>
          <div className="divide-y divide-slate-100">
            {MOCK_DECLARATIONS.map(dec => (
              <div key={dec.id} className="p-4 flex items-center justify-between hover:bg-slate-50/50">
                <div>
                  <p className="text-sm font-bold text-slate-900">{dec.type} — {dec.worker}</p>
                  <p className="text-xs text-slate-500">{dec.country} • Ref: {dec.ref}</p>
                </div>
                <span className={`px-2 py-0.5 text-[10px] font-bold rounded border uppercase tracking-widest ${
                  dec.status === 'confirmed' ? 'bg-green-50 text-green-700 border-green-200' :
                  dec.status === 'submitted' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                  'bg-slate-100 text-slate-600 border-slate-200'
                }`}>
                  {dec.status === 'confirmed' ? 'Confirmado' : dec.status === 'submitted' ? 'Submetido' : 'Rascunho'}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExportsView;
