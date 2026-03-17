
import React, { useState } from 'react';
import { Download, FileSpreadsheet, FileText, CheckCircle2, Clock, ChevronRight, ArrowRight } from 'lucide-react';

type ExportStep = 1 | 2 | 3;

const DATA_OPTIONS = [
  { id: 'timesheet', label: 'Timesheet / Horas', desc: 'Registos de horas de todos os operários' },
  { id: 'billing', label: 'Faturação', desc: 'Dados de faturação por obra e cliente' },
  { id: 'payroll', label: 'Folha Salarial', desc: 'Custos salariais por operário' },
  { id: 'declarations', label: 'Declarações Trabalhadores', desc: 'Dados para declarações governamentais' },
];

const DEST_OPTIONS = [
  { id: 'primavera', label: 'Primavera (ERP)', desc: 'Formato compatível com Primavera' },
  { id: 'excel', label: 'Excel / CSV', desc: 'Download em formato tabular' },
  { id: 'onss', label: 'ONSS (Bélgica)', desc: 'Declaração segurança social belga' },
  { id: 'ss', label: 'Segurança Social (PT)', desc: 'Declaração mensal de remunerações' },
  { id: 'financas', label: 'Finanças (PT)', desc: 'Declaração fiscal portuguesa' },
];

const MOCK_HISTORY = [
  { id: 'e1', type: 'Timesheet', dest: 'Primavera', period: 'Fev 2024', status: 'completed', records: 1240, date: '2024-03-01' },
  { id: 'e2', type: 'Timesheet', dest: 'Primavera', period: 'Jan 2024', status: 'completed', records: 1180, date: '2024-02-01' },
  { id: 'e3', type: 'Faturação', dest: 'Excel', period: 'Fev 2024', status: 'completed', records: 48, date: '2024-03-01' },
  { id: 'e4', type: 'Declarações', dest: 'ONSS', period: 'Fev 2024', status: 'processing', records: 24, date: '2024-03-02' },
  { id: 'e5', type: 'Folha Salarial', dest: 'Primavera', period: 'Fev 2024', status: 'completed', records: 712, date: '2024-03-01' },
];

const ExportsView: React.FC = () => {
  const [step, setStep] = useState<ExportStep>(1);
  const [selectedData, setSelectedData] = useState<string[]>([]);
  const [selectedDest, setSelectedDest] = useState<string | null>(null);

  const toggleData = (id: string) => {
    setSelectedData(prev => prev.includes(id) ? prev.filter(d => d !== id) : [...prev, id]);
  };

  const reset = () => { setStep(1); setSelectedData([]); setSelectedDest(null); };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Exportações & Declarações</h1>
          <p className="text-sm text-slate-500">Selecione dados, destino e período</p>
        </div>
      </div>

      {/* Stepper */}
      <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
        <div className="flex items-center gap-4 mb-6">
          {[
            { n: 1 as ExportStep, label: 'Dados' },
            { n: 2 as ExportStep, label: 'Destino' },
            { n: 3 as ExportStep, label: 'Confirmar' },
          ].map((s, i) => (
            <React.Fragment key={s.n}>
              <div className={`flex items-center gap-2 ${step >= s.n ? 'text-industrial' : 'text-slate-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                  step >= s.n ? 'bg-industrial text-white' : 'bg-slate-100 text-slate-400'
                }`}>{s.n}</div>
                <span className="text-sm font-bold">{s.label}</span>
              </div>
              {i < 2 && <ArrowRight size={16} className="text-slate-300" />}
            </React.Fragment>
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <p className="text-sm text-slate-600 font-medium">Selecione os dados a exportar:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {DATA_OPTIONS.map(opt => (
                <button
                  key={opt.id}
                  onClick={() => toggleData(opt.id)}
                  className={`p-4 rounded-lg border-2 text-left transition-colors ${
                    selectedData.includes(opt.id) ? 'border-industrial bg-slate-50' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                      selectedData.includes(opt.id) ? 'border-industrial bg-industrial' : 'border-slate-300'
                    }`}>
                      {selectedData.includes(opt.id) && <CheckCircle2 size={12} className="text-white" />}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{opt.label}</p>
                      <p className="text-xs text-slate-500">{opt.desc}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => selectedData.length > 0 && setStep(2)}
                disabled={selectedData.length === 0}
                className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold bg-industrial text-white rounded-md hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Próximo <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <p className="text-sm text-slate-600 font-medium">Selecione o sistema de destino:</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {DEST_OPTIONS.map(opt => (
                <button
                  key={opt.id}
                  onClick={() => setSelectedDest(opt.id)}
                  className={`p-4 rounded-lg border-2 text-left transition-colors ${
                    selectedDest === opt.id ? 'border-industrial bg-slate-50' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <p className="text-sm font-bold text-slate-900">{opt.label}</p>
                  <p className="text-xs text-slate-500">{opt.desc}</p>
                </button>
              ))}
            </div>
            <div className="flex justify-between pt-2">
              <button onClick={() => setStep(1)} className="px-4 py-2.5 text-sm font-semibold border border-slate-200 rounded-md hover:bg-slate-50">Voltar</button>
              <button
                onClick={() => selectedDest && setStep(3)}
                disabled={!selectedDest}
                className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold bg-industrial text-white rounded-md hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Próximo <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <p className="text-sm text-slate-600 font-medium">Confirme e selecione o período:</p>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Data Início</label>
                <input type="date" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-sm" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Data Fim</label>
                <input type="date" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-sm" />
              </div>
            </div>
            <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 space-y-2">
              <p className="text-xs font-bold text-slate-500 uppercase">Resumo</p>
              <p className="text-sm text-slate-700"><b>Dados:</b> {selectedData.map(d => DATA_OPTIONS.find(o => o.id === d)?.label).join(', ')}</p>
              <p className="text-sm text-slate-700"><b>Destino:</b> {DEST_OPTIONS.find(o => o.id === selectedDest)?.label}</p>
            </div>
            <div className="flex justify-between pt-2">
              <button onClick={() => setStep(2)} className="px-4 py-2.5 text-sm font-semibold border border-slate-200 rounded-md hover:bg-slate-50">Voltar</button>
              <button
                onClick={reset}
                className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold bg-compliance-green text-white rounded-md hover:opacity-90"
              >
                <Download size={16} /> Exportar Agora
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Export History */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
        <div className="p-5 border-b border-slate-100">
          <h2 className="text-base font-bold text-slate-900">Histórico de Exportações</h2>
        </div>
        <div className="divide-y divide-slate-100">
          {MOCK_HISTORY.map(exp => (
            <div key={exp.id} className="p-4 flex items-center justify-between hover:bg-slate-50/50">
              <div className="flex items-center gap-3">
                {exp.dest === 'Excel' ? <FileSpreadsheet size={18} className="text-slate-400" /> : <FileText size={18} className="text-slate-400" />}
                <div>
                  <p className="text-sm font-bold text-slate-900">{exp.type} → {exp.dest}</p>
                  <p className="text-xs text-slate-500">{exp.period} • {exp.records} registos • {exp.date}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {exp.status === 'completed' ? (
                  <>
                    <CheckCircle2 size={16} className="text-compliance-green" />
                    <button className="p-1.5 hover:bg-slate-100 rounded text-slate-400 hover:text-industrial"><Download size={16} /></button>
                  </>
                ) : (
                  <span className="flex items-center gap-1 text-xs font-bold text-amber-600"><Clock size={14} /> A processar</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ExportsView;
