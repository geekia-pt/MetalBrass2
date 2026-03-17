
import React from 'react';
import { GitPullRequestArrow, ArrowRight } from 'lucide-react';

const PIPELINE_STAGES = [
  { label: 'Proposta', count: 8, color: 'bg-slate-100 border-slate-300 text-slate-700' },
  { label: 'Confirmado', count: 3, color: 'bg-blue-50 border-blue-300 text-blue-700' },
  { label: 'Ativo', count: 42, color: 'bg-green-50 border-green-300 text-green-700' },
  { label: 'Concluído', count: 156, color: 'bg-slate-50 border-slate-200 text-slate-500' },
];

const AllocationsView: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Alocações</h1>
          <p className="text-sm text-slate-500">Pipeline de alocação de operários em obras</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-bold bg-industrial text-white rounded-md hover:bg-slate-800 transition-all">
          <GitPullRequestArrow size={18} /> Sugerir Alocação (AI)
        </button>
      </div>

      <div className="flex items-center gap-3">
        {PIPELINE_STAGES.map((stage, i) => (
          <React.Fragment key={stage.label}>
            <div className={`flex-1 p-5 rounded-lg border-2 ${stage.color} text-center`}>
              <p className="text-3xl font-black">{stage.count}</p>
              <p className="text-xs font-bold uppercase tracking-widest mt-1">{stage.label}</p>
            </div>
            {i < PIPELINE_STAGES.length - 1 && (
              <ArrowRight size={20} className="text-slate-300 shrink-0" />
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="bg-white rounded-lg border border-slate-200 p-8 shadow-sm text-center">
        <GitPullRequestArrow size={48} className="mx-auto text-slate-300 mb-4" />
        <h3 className="text-lg font-bold text-slate-900 mb-2">Módulo de Alocações</h3>
        <p className="text-sm text-slate-500 max-w-md mx-auto">
          Pipeline visual completo com matching AI, calendário de alocações por obra/operário e gestão de propostas.
          Será conectado ao backend na próxima fase.
        </p>
      </div>
    </div>
  );
};

export default AllocationsView;
