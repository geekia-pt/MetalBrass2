
import React from 'react';
import { Link } from 'react-router-dom';
import { Project, ProjectStatus } from '../types';
import { HardHat, Search, Filter, Plus, Globe, Euro, Users, ArrowUpRight } from 'lucide-react';

const MOCK_PROJECTS: Project[] = [
  { id: 'p1', name: 'Renovação Central Hidrelétrica', client: 'EDF France', country: 'FR', budget: 1250000, status: ProjectStatus.ACTIVE, completion: 45, margin: 18.2, teamCount: 24 },
  { id: 'p2', name: 'Estruturas Metálicas Porto', client: 'GaliPort', country: 'PT', budget: 450000, status: ProjectStatus.ACTIVE, completion: 82, margin: 22.5, teamCount: 12 },
  { id: 'p3', name: 'Manutenção Eólica Norte', client: 'IberWind', country: 'ES', budget: 890000, status: ProjectStatus.PLANNING, completion: 0, margin: 15.0, teamCount: 8 },
  { id: 'p4', name: 'Oleoduto Trans-Alpino', client: 'Shell Intl', country: 'BE', budget: 2100000, status: ProjectStatus.PAUSED, completion: 15, margin: 12.8, teamCount: 30 },
];

const StatusBadge = ({ status }: { status: ProjectStatus }) => {
  const config = {
    [ProjectStatus.PLANNING]: 'bg-slate-100 text-slate-600 border-slate-200',
    [ProjectStatus.ACTIVE]: 'bg-green-100 text-green-700 border-green-200',
    [ProjectStatus.PAUSED]: 'bg-amber-100 text-amber-700 border-amber-200',
    [ProjectStatus.COMPLETED]: 'bg-blue-100 text-blue-700 border-blue-200',
  };
  return (
    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-widest ${config[status]}`}>
      {status}
    </span>
  );
};

const ProjectsView: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Módulo de Projetos</h1>
          <p className="text-sm text-slate-500">Gestão de obras, contratos e alocação</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-bold bg-industrial text-white rounded-md hover:bg-slate-800 transition-all">
          <Plus size={18} /> Novo Projeto
        </button>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
        <div className="p-4 border-b border-slate-100 flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Buscar por cliente, local ou projeto..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm outline-none focus:ring-2 focus:ring-industrial/10"
            />
          </div>
          <button className="flex items-center gap-2 px-3 py-2 text-sm font-semibold border border-slate-200 rounded-md hover:bg-slate-50">
            <Filter size={16} /> Filtros
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Projeto / Cliente</th>
                <th className="px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-center">País</th>
                <th className="px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Orçamento</th>
                <th className="px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Equipe</th>
                <th className="px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Progresso</th>
                <th className="px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Status</th>
                <th className="px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Margem</th>
                <th className="px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MOCK_PROJECTS.map(project => (
                <tr key={project.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-slate-900 group-hover:text-industrial">{project.name}</p>
                    <p className="text-[11px] text-slate-500 font-medium uppercase">{project.client}</p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center justify-center w-8 h-6 bg-slate-100 rounded text-xs font-bold text-slate-600 border border-slate-200">
                      {project.country}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-slate-700 tabular-nums">€ {(project.budget / 1000000).toFixed(1)}M</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Users size={14} />
                      <span className="text-sm font-bold tabular-nums">{project.teamCount}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 min-w-[120px]">
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[10px] font-bold text-slate-400">
                        <span>{project.completion}%</span>
                      </div>
                      <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                        <div className="bg-industrial h-full" style={{ width: `${project.completion}%` }} />
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <StatusBadge status={project.status} />
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-sm font-bold ${project.margin > 15 ? 'text-compliance-green' : 'text-compliance-amber'}`}>
                      {project.margin}%
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Link to={`/projects/${project.id}`} className="p-2 text-slate-400 hover:text-industrial hover:bg-slate-100 rounded transition-all inline-block">
                      <ArrowUpRight size={18} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProjectsView;
