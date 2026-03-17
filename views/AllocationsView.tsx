
import React, { useState } from 'react';
import { GitPullRequestArrow, ArrowRight, Search, Filter, Users, MapPin, Star, CheckCircle2, X, Home, Truck, Calendar, ChevronRight } from 'lucide-react';

type ViewMode = 'by-project' | 'by-worker';

interface ProjectVacancy {
  projectId: string;
  projectName: string;
  client: string;
  country: string;
  countryFlag: string;
  vacancies: { role: string; count: number; skills: string[] }[];
  totalNeeded: number;
  totalFilled: number;
}

interface AvailableWorker {
  id: string;
  name: string;
  role: string;
  skills: string[];
  costPerHour: number;
  compliance: number;
  lastProject: string;
  matchPct?: number;
}

const MOCK_VACANCIES: ProjectVacancy[] = [
  { projectId: 'p1', projectName: 'Renovação Central Hidrelétrica', client: 'EDF France', country: 'FR', countryFlag: '🇫🇷', totalNeeded: 30, totalFilled: 24, vacancies: [
    { role: 'Soldador TIG', count: 3, skills: ['TIG', 'ASME', 'A1'] },
    { role: 'Serralheiro', count: 2, skills: ['Metal', 'Corte'] },
    { role: 'Ajudante', count: 1, skills: [] },
  ]},
  { projectId: 'p4', projectName: 'Oleoduto Trans-Alpino', client: 'Shell Intl', country: 'BE', countryFlag: '🇧🇪', totalNeeded: 35, totalFilled: 30, vacancies: [
    { role: 'Soldador MIG/MAG', count: 2, skills: ['MIG', 'MAG', 'ONSS'] },
    { role: 'Engenheiro Mecânico', count: 1, skills: ['Design', 'Project Mgmt'] },
    { role: 'Operador Ponte Rolante', count: 2, skills: ['Crane', 'Safety'] },
  ]},
  { projectId: 'p5', projectName: 'Ponte Ferroviária Sul', client: 'SNCF', country: 'FR', countryFlag: '🇫🇷', totalNeeded: 20, totalFilled: 18, vacancies: [
    { role: 'Soldador TIG', count: 1, skills: ['TIG'] },
    { role: 'Montador', count: 1, skills: ['Assembly'] },
  ]},
];

const MOCK_AVAILABLE: AvailableWorker[] = [
  { id: 'w1', name: 'António Rodrigues', role: 'Soldador TIG', skills: ['TIG', 'ASME', 'MIG'], costPerHour: 42, compliance: 100, lastProject: 'Refinaria Sines' },
  { id: 'w2', name: 'Manuel Pereira', role: 'Soldador MIG/MAG', skills: ['MIG', 'MAG', 'TIG'], costPerHour: 38, compliance: 95, lastProject: 'Ponte Vasco da Gama' },
  { id: 'w3', name: 'Jorge Fernandes', role: 'Serralheiro', skills: ['Metal', 'Corte', 'Welding'], costPerHour: 30, compliance: 88, lastProject: 'Estaleiro Naval' },
  { id: 'w4', name: 'Paulo Martins', role: 'Ajudante Geral', skills: ['Logistics', 'Safety'], costPerHour: 18, compliance: 100, lastProject: 'Obra Vale A' },
  { id: 'w5', name: 'Rui Almeida', role: 'Operador Ponte', skills: ['Crane', 'Safety', 'Rigging'], costPerHour: 35, compliance: 92, lastProject: 'Plataforma Sul' },
  { id: 'w6', name: 'Nuno Costa', role: 'Soldador TIG', skills: ['TIG', 'ASME'], costPerHour: 45, compliance: 100, lastProject: 'Central Nuclear' },
  { id: 'w7', name: 'Tiago Santos', role: 'Engenheiro Mecânico', skills: ['Design', 'Project Mgmt', 'CAD'], costPerHour: 65, compliance: 97, lastProject: 'Refinaria Sines' },
  { id: 'w8', name: 'Diogo Oliveira', role: 'Montador', skills: ['Assembly', 'Welding'], costPerHour: 28, compliance: 100, lastProject: 'Obra Vale A' },
];

const PIPELINE_STAGES = [
  { label: 'Proposta', count: 12, color: 'bg-slate-100 border-slate-300 text-slate-700' },
  { label: 'Confirmado', count: 5, color: 'bg-blue-50 border-blue-300 text-blue-700' },
  { label: 'Ativo', count: 42, color: 'bg-green-50 border-green-300 text-green-700' },
  { label: 'Concluído', count: 156, color: 'bg-slate-50 border-slate-200 text-slate-500' },
];

const AllocationsView: React.FC = () => {
  const [viewMode, setViewMode] = useState<ViewMode>('by-project');
  const [selectedVacancy, setSelectedVacancy] = useState<{ project: ProjectVacancy; vacancy: { role: string; count: number; skills: string[] } } | null>(null);
  const [selectedWorker, setSelectedWorker] = useState<AvailableWorker | null>(null);
  const [showAllocateModal, setShowAllocateModal] = useState(false);

  const getMatchedWorkers = (skills: string[]) => {
    return MOCK_AVAILABLE.map(w => {
      const matched = skills.filter(s => w.skills.includes(s)).length;
      const matchPct = skills.length > 0 ? Math.round((matched / skills.length) * 100) : 100;
      return { ...w, matchPct };
    }).sort((a, b) => (b.matchPct || 0) - (a.matchPct || 0));
  };

  const getMatchedProjects = (worker: AvailableWorker) => {
    return MOCK_VACANCIES.flatMap(p =>
      p.vacancies.filter(v => {
        const matched = v.skills.filter(s => worker.skills.includes(s)).length;
        return v.skills.length === 0 || matched > 0;
      }).map(v => ({ ...p, vacancy: v, matchPct: v.skills.length > 0 ? Math.round((v.skills.filter(s => worker.skills.includes(s)).length / v.skills.length) * 100) : 100 }))
    ).sort((a, b) => b.matchPct - a.matchPct);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Alocações</h1>
          <p className="text-sm text-slate-500">Matching inteligente de operários com obras</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-100 rounded-lg p-0.5">
            <button onClick={() => { setViewMode('by-project'); setSelectedVacancy(null); setSelectedWorker(null); }} className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${viewMode === 'by-project' ? 'bg-white text-industrial shadow-sm' : 'text-slate-500'}`}>Por Obra</button>
            <button onClick={() => { setViewMode('by-worker'); setSelectedVacancy(null); setSelectedWorker(null); }} className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${viewMode === 'by-worker' ? 'bg-white text-industrial shadow-sm' : 'text-slate-500'}`}>Por Funcionário</button>
          </div>
        </div>
      </div>

      {/* Pipeline */}
      <div className="flex items-center gap-3">
        {PIPELINE_STAGES.map((stage, i) => (
          <React.Fragment key={stage.label}>
            <div className={`flex-1 p-4 rounded-lg border-2 ${stage.color} text-center`}>
              <p className="text-2xl font-black">{stage.count}</p>
              <p className="text-[10px] font-bold uppercase tracking-widest mt-0.5">{stage.label}</p>
            </div>
            {i < PIPELINE_STAGES.length - 1 && <ArrowRight size={18} className="text-slate-300 shrink-0" />}
          </React.Fragment>
        ))}
      </div>

      <div className="flex gap-6 min-h-[500px]">
        {/* Left panel */}
        <div className="flex-1 bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="p-4 border-b border-slate-100 flex items-center gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input type="text" placeholder={viewMode === 'by-project' ? 'Buscar obra...' : 'Buscar operário...'} className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm outline-none focus:ring-2 focus:ring-industrial/20" />
            </div>
            <button className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold border border-slate-200 rounded-md"><Filter size={14} /> Filtros</button>
          </div>

          <div className="flex-1 overflow-y-auto no-scrollbar">
            {viewMode === 'by-project' ? (
              <div className="divide-y divide-slate-100">
                {MOCK_VACANCIES.map(project => (
                  <div key={project.projectId} className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-sm font-bold text-slate-900">{project.countryFlag} {project.projectName}</p>
                        <p className="text-[10px] text-slate-500 uppercase font-bold">{project.client}</p>
                      </div>
                      <span className="text-xs font-bold text-slate-500">{project.totalFilled}/{project.totalNeeded}</span>
                    </div>
                    <div className="space-y-2">
                      {project.vacancies.map((v, i) => (
                        <button
                          key={i}
                          onClick={() => { setSelectedVacancy({ project, vacancy: v }); setSelectedWorker(null); }}
                          className={`w-full flex items-center justify-between p-3 rounded-lg border text-left transition-colors ${
                            selectedVacancy?.project.projectId === project.projectId && selectedVacancy?.vacancy.role === v.role
                              ? 'border-industrial bg-slate-50' : 'border-slate-100 hover:border-slate-200'
                          }`}
                        >
                          <div>
                            <p className="text-sm font-bold text-slate-700">{v.count}× {v.role}</p>
                            <div className="flex gap-1 mt-1">
                              {v.skills.map(s => (
                                <span key={s} className="px-1.5 py-0.5 text-[9px] font-bold bg-slate-100 text-slate-500 rounded uppercase">{s}</span>
                              ))}
                            </div>
                          </div>
                          <ChevronRight size={16} className="text-slate-400" />
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {MOCK_AVAILABLE.map(worker => (
                  <button
                    key={worker.id}
                    onClick={() => { setSelectedWorker(worker); setSelectedVacancy(null); }}
                    className={`w-full p-4 text-left transition-colors ${selectedWorker?.id === worker.id ? 'bg-slate-50' : 'hover:bg-slate-50/50'}`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-sm font-bold text-slate-900">{worker.name}</p>
                        <p className="text-xs text-slate-500">{worker.role} • €{worker.costPerHour}/h</p>
                        <div className="flex gap-1 mt-1.5">
                          {worker.skills.map(s => (
                            <span key={s} className="px-1.5 py-0.5 text-[9px] font-bold bg-slate-100 text-slate-500 rounded uppercase">{s}</span>
                          ))}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`text-xs font-bold ${worker.compliance >= 95 ? 'text-compliance-green' : 'text-compliance-amber'}`}>{worker.compliance}%</span>
                        <p className="text-[9px] text-slate-400 mt-0.5">Compliance</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right panel - matches */}
        <div className="w-[400px] bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          {selectedVacancy ? (
            <>
              <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                <p className="text-xs text-slate-500 uppercase font-bold">Candidatos para</p>
                <p className="text-sm font-bold text-slate-900">{selectedVacancy.vacancy.count}× {selectedVacancy.vacancy.role}</p>
                <p className="text-[10px] text-slate-500">{selectedVacancy.project.projectName}</p>
              </div>
              <div className="flex-1 overflow-y-auto no-scrollbar divide-y divide-slate-100">
                {getMatchedWorkers(selectedVacancy.vacancy.skills).map(worker => (
                  <div key={worker.id} className="p-4 hover:bg-slate-50/50">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="text-sm font-bold text-slate-900">{worker.name}</p>
                        <p className="text-xs text-slate-500">{worker.role} • €{worker.costPerHour}/h</p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Star size={12} className={worker.matchPct! >= 80 ? 'text-amber-400 fill-amber-400' : 'text-slate-300'} />
                        <span className={`text-sm font-black ${worker.matchPct! >= 80 ? 'text-compliance-green' : worker.matchPct! >= 50 ? 'text-amber-600' : 'text-slate-400'}`}>{worker.matchPct}%</span>
                      </div>
                    </div>
                    <div className="flex gap-1 mb-3">
                      {worker.skills.map(s => (
                        <span key={s} className={`px-1.5 py-0.5 text-[9px] font-bold rounded uppercase ${
                          selectedVacancy.vacancy.skills.includes(s) ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-400'
                        }`}>{s}</span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] text-slate-400">Última: {worker.lastProject}</span>
                      <button
                        onClick={() => setShowAllocateModal(true)}
                        className="px-3 py-1 text-[10px] font-bold bg-industrial text-white rounded hover:bg-slate-800 transition-colors"
                      >
                        Alocar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : selectedWorker ? (
            <>
              <div className="p-4 border-b border-slate-100 bg-slate-50/50">
                <p className="text-xs text-slate-500 uppercase font-bold">Obras compatíveis com</p>
                <p className="text-sm font-bold text-slate-900">{selectedWorker.name}</p>
                <p className="text-[10px] text-slate-500">{selectedWorker.role} • Skills: {selectedWorker.skills.join(', ')}</p>
              </div>
              <div className="flex-1 overflow-y-auto no-scrollbar divide-y divide-slate-100">
                {getMatchedProjects(selectedWorker).map((match, i) => (
                  <div key={i} className="p-4 hover:bg-slate-50/50">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="text-sm font-bold text-slate-900">{match.countryFlag} {match.projectName}</p>
                        <p className="text-xs text-slate-500">{match.vacancy.count}× {match.vacancy.role}</p>
                      </div>
                      <span className={`text-sm font-black ${match.matchPct >= 80 ? 'text-compliance-green' : 'text-amber-600'}`}>{match.matchPct}%</span>
                    </div>
                    <button
                      onClick={() => setShowAllocateModal(true)}
                      className="px-3 py-1 text-[10px] font-bold bg-industrial text-white rounded hover:bg-slate-800 transition-colors"
                    >
                      Alocar a esta Obra
                    </button>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
              <GitPullRequestArrow size={40} className="text-slate-200 mb-3" />
              <p className="text-sm font-bold text-slate-400">Selecione uma vaga ou operário</p>
              <p className="text-xs text-slate-400 mt-1">para ver os candidatos compatíveis</p>
            </div>
          )}
        </div>
      </div>

      {/* Allocate Confirmation Modal */}
      {showAllocateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowAllocateModal(false)} />
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">Confirmar Alocação</h2>
              <button onClick={() => setShowAllocateModal(false)} className="p-1 hover:bg-slate-100 rounded"><X size={20} className="text-slate-400" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="p-4 bg-slate-50 rounded-lg border border-slate-100 space-y-2">
                <div className="flex items-center gap-2">
                  <Users size={14} className="text-slate-400" />
                  <span className="text-sm font-bold text-slate-700">António Rodrigues → Central Hidrelétrica</span>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5"><Home size={12} /> Alojamento Sugerido</label>
                <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-sm">
                  <option>Apt. Lyon Centro #1 (1 vaga disponível)</option>
                  <option>Apt. Lyon Centro #2 (Lotado)</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5"><Truck size={12} /> Viatura Sugerida</label>
                <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-sm">
                  <option>Renault Master - 45-AB-12 (Lyon)</option>
                  <option>Mercedes Sprinter - 78-CD-34 (Lyon)</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest flex items-center gap-1.5"><Calendar size={12} /> Data Início</label>
                  <input type="date" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-sm" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Data Fim (prevista)</label>
                  <input type="date" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-sm" />
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-slate-100 flex gap-3 justify-end">
              <button onClick={() => setShowAllocateModal(false)} className="px-4 py-2.5 text-sm font-semibold border border-slate-200 rounded-md hover:bg-slate-50">Cancelar</button>
              <button onClick={() => setShowAllocateModal(false)} className="px-6 py-2.5 text-sm font-bold bg-compliance-green text-white rounded-md hover:opacity-90">Confirmar Alocação</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllocationsView;
