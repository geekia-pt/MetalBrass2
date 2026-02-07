
import React, { useState } from 'react';
import { Worker, ComplianceStatus } from '../types';
import Badge from '../components/Badge';
import { Search, Filter, MoreHorizontal, UserPlus } from 'lucide-react';

const MOCK_WORKERS: Worker[] = [
  // Added missing fields: skillTags, hourlyCost, phone, email to match Worker interface
  { 
    id: '1', nif: '123.456.789', name: 'Ricardo Santos', role: 'Soldador Especialista', 
    project: 'Obra Vale A', status: ComplianceStatus.VALID, lastUpdate: '10/10/2023',
    skillTags: ['TIG', 'ASME'], hourlyCost: 45, phone: '+351 912 345 678', email: 'ricardo.santos@metalbras.pt'
  },
  { 
    id: '2', nif: '987.654.321', name: 'Ana Oliveira', role: 'Engenheira Mecânica', 
    project: 'Plataforma Sul', status: ComplianceStatus.EXPIRING, lastUpdate: '15/10/2023',
    skillTags: ['Design', 'Project Mgmt'], hourlyCost: 65, phone: '+351 912 987 654', email: 'ana.oliveira@metalbras.pt'
  },
  { 
    id: '3', nif: '456.123.789', name: 'Carlos Mendes', role: 'Ajudante Geral', 
    project: 'Metalbras Central', status: ComplianceStatus.CRITICAL, lastUpdate: '02/11/2023',
    skillTags: ['Logistics'], hourlyCost: 18, phone: '+351 912 456 789', email: 'carlos.mendes@metalbras.pt'
  },
  { 
    id: '4', nif: '321.654.987', name: 'Juliana Lima', role: 'Operadora de Ponte', 
    project: 'Obra Vale A', status: ComplianceStatus.VALID, lastUpdate: '05/11/2023',
    skillTags: ['Crane', 'Safety'], hourlyCost: 35, phone: '+351 912 321 654', email: 'juliana.lima@metalbras.pt'
  },
  { 
    id: '5', nif: '159.357.486', name: 'Marcos Silva', role: 'Serralheiro', 
    project: 'Plataforma Sul', status: ComplianceStatus.PENDING, lastUpdate: '08/11/2023',
    skillTags: ['Metal', 'Welding'], hourlyCost: 28, phone: '+351 912 159 357', email: 'marcos.silva@metalbras.pt'
  },
  // Adding more for density demo
  // Updated generator to include missing fields
  ...Array.from({ length: 15 }).map((_, i) => ({
    id: `id-${i + 6}`,
    nif: `${Math.floor(Math.random() * 900) + 100}.000.000`,
    name: `Trabalhador Genérico ${i + 6}`,
    role: 'Técnico de Manutenção',
    project: 'Local Diversos',
    status: [ComplianceStatus.VALID, ComplianceStatus.EXPIRING, ComplianceStatus.PENDING, ComplianceStatus.CRITICAL][Math.floor(Math.random() * 4)],
    lastUpdate: '10/11/2023',
    skillTags: ['Maintenance'],
    hourlyCost: 22,
    phone: `+351 912 000 ${String(i + 6).padStart(3, '0')}`,
    email: `worker${i + 6}@metalbras.pt`
  }))
];

const PersonnelView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = MOCK_WORKERS.filter(w => 
    w.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    w.nif.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Módulo de Pessoal</h1>
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-bold bg-industrial text-white rounded-md shadow hover:bg-industrial-dark transition-all">
          <UserPlus size={18} />
          Cadastrar Operário
        </button>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden flex flex-col">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-100 flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Buscar por NIF ou Nome..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-industrial/20"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-2 px-3 py-2 text-sm font-semibold border border-slate-200 rounded-md hover:bg-slate-50 transition-colors">
            <Filter size={16} className="text-slate-500" />
            Filtros
          </button>
          <div className="ml-auto text-xs text-slate-500 font-medium">
            Mostrando <b>{filtered.length}</b> de {MOCK_WORKERS.length} registros
          </div>
        </div>

        {/* Dense Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest">NIF / ID</th>
                <th className="px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Colaborador</th>
                <th className="px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Função</th>
                <th className="px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Projeto Atual</th>
                <th className="px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Status</th>
                <th className="px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Últ. Sync</th>
                <th className="px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((worker, i) => (
                <tr key={worker.id} className={`group hover:bg-slate-50/50 transition-colors ${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/20'}`}>
                  <td className="px-4 py-2">
                    <span className="font-mono text-[13px] text-slate-600 font-medium bg-slate-100 px-1.5 py-0.5 rounded">{worker.nif}</span>
                  </td>
                  <td className="px-4 py-2">
                    <p className="text-sm font-bold text-slate-900">{worker.name}</p>
                    <p className="text-[11px] text-slate-400">ID: {worker.id}</p>
                  </td>
                  <td className="px-4 py-2 text-sm text-slate-600 font-medium">{worker.role}</td>
                  <td className="px-4 py-2">
                    <span className="text-xs text-slate-500 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-full">{worker.project}</span>
                  </td>
                  <td className="px-4 py-2">
                    <Badge status={worker.status} />
                  </td>
                  <td className="px-4 py-2 text-xs text-slate-400 font-medium">{worker.lastUpdate}</td>
                  <td className="px-4 py-2 text-center">
                    <button className="p-1 hover:bg-slate-200 rounded transition-colors text-slate-400 hover:text-industrial">
                      <MoreHorizontal size={18} />
                    </button>
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

export default PersonnelView;
