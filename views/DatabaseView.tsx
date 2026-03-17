
import React, { useState } from 'react';
import { Database, HardHat, Users, Truck, MapPin, Upload, Download, Plus, Search } from 'lucide-react';

type DbTab = 'projects' | 'workers' | 'fleet' | 'locations';

const TABS: { id: DbTab; label: string; icon: React.ElementType; count: number }[] = [
  { id: 'projects', label: 'Obras', icon: HardHat, count: 60 },
  { id: 'workers', label: 'Funcionários', icon: Users, count: 712 },
  { id: 'fleet', label: 'Frota', icon: Truck, count: 24 },
  { id: 'locations', label: 'Localizações', icon: MapPin, count: 18 },
];

const DatabaseView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<DbTab>('projects');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Base de Dados</h1>
          <p className="text-sm text-slate-500">Visualização, upload e atualização centralizada</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold border border-slate-200 rounded-md bg-white hover:bg-slate-50">
            <Upload size={16} /> Importar CSV/Excel
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-semibold border border-slate-200 rounded-md bg-white hover:bg-slate-50">
            <Download size={16} /> Exportar
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-bold bg-industrial text-white rounded-md hover:bg-slate-800">
            <Plus size={16} /> Novo Registo
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-3">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-3 px-5 py-3 rounded-lg border-2 transition-colors ${
              activeTab === tab.id ? 'border-industrial bg-slate-50 text-industrial' : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
            }`}
          >
            <tab.icon size={18} />
            <div className="text-left">
              <p className="text-sm font-bold">{tab.label}</p>
              <p className="text-[10px] text-slate-400 font-bold">{tab.count} registos</p>
            </div>
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
        <div className="p-4 border-b border-slate-100">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input type="text" placeholder={`Buscar em ${TABS.find(t => t.id === activeTab)?.label}...`} className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm outline-none" />
          </div>
        </div>

        {activeTab === 'projects' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest">ID</th>
                  <th className="px-5 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Nome</th>
                  <th className="px-5 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Cliente</th>
                  <th className="px-5 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest">País</th>
                  <th className="px-5 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Status</th>
                  <th className="px-5 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Equipa</th>
                  <th className="px-5 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Orçamento</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  { id: 'OBR-001', name: 'Central Hidrelétrica', client: 'EDF France', country: 'FR', status: 'Ativo', team: 24, budget: '€ 1.25M' },
                  { id: 'OBR-002', name: 'Estruturas Porto', client: 'GaliPort', country: 'PT', status: 'Ativo', team: 12, budget: '€ 450k' },
                  { id: 'OBR-003', name: 'Eólica Norte', client: 'IberWind', country: 'ES', status: 'Planeamento', team: 8, budget: '€ 890k' },
                  { id: 'OBR-004', name: 'Oleoduto Trans-Alpino', client: 'Shell Intl', country: 'BE', status: 'Pausado', team: 30, budget: '€ 2.1M' },
                  { id: 'OBR-005', name: 'Ponte Ferroviária', client: 'SNCF', country: 'FR', status: 'Ativo', team: 18, budget: '€ 780k' },
                ].map(row => (
                  <tr key={row.id} className="hover:bg-slate-50/50">
                    <td className="px-5 py-3 font-mono text-xs text-industrial font-bold">{row.id}</td>
                    <td className="px-5 py-3 text-sm font-bold text-slate-900">{row.name}</td>
                    <td className="px-5 py-3 text-sm text-slate-600">{row.client}</td>
                    <td className="px-5 py-3 text-xs font-bold text-slate-500">{row.country}</td>
                    <td className="px-5 py-3"><span className={`px-2 py-0.5 text-[10px] font-bold rounded border uppercase ${row.status === 'Ativo' ? 'bg-green-50 text-green-700 border-green-200' : row.status === 'Pausado' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-slate-100 text-slate-600 border-slate-200'}`}>{row.status}</span></td>
                    <td className="px-5 py-3 text-sm font-bold text-slate-700">{row.team}</td>
                    <td className="px-5 py-3 text-sm font-bold text-slate-700">{row.budget}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'workers' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest">NIF</th>
                  <th className="px-5 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Nome</th>
                  <th className="px-5 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Função</th>
                  <th className="px-5 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Projeto</th>
                  <th className="px-5 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Status</th>
                  <th className="px-5 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Custo/h</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  { nif: '123.456.789', name: 'Ricardo Santos', role: 'Soldador TIG', project: 'Central Hidrelétrica', status: 'Alocado', cost: '€ 45' },
                  { nif: '987.654.321', name: 'Ana Oliveira', role: 'Eng. Mecânica', project: 'Plataforma Sul', status: 'Alocado', cost: '€ 65' },
                  { nif: '456.123.789', name: 'Carlos Mendes', role: 'Ajudante', project: 'Metalbras Central', status: 'Alocado', cost: '€ 18' },
                  { nif: '321.654.987', name: 'Juliana Lima', role: 'Op. Ponte', project: 'Obra Vale A', status: 'Alocado', cost: '€ 35' },
                  { nif: '159.357.486', name: 'Marcos Silva', role: 'Serralheiro', project: '—', status: 'Disponível', cost: '€ 28' },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50/50">
                    <td className="px-5 py-3 font-mono text-xs text-slate-600">{row.nif}</td>
                    <td className="px-5 py-3 text-sm font-bold text-slate-900">{row.name}</td>
                    <td className="px-5 py-3 text-sm text-slate-600">{row.role}</td>
                    <td className="px-5 py-3 text-xs text-slate-500">{row.project}</td>
                    <td className="px-5 py-3"><span className={`px-2 py-0.5 text-[10px] font-bold rounded border uppercase ${row.status === 'Alocado' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-green-50 text-green-700 border-green-200'}`}>{row.status}</span></td>
                    <td className="px-5 py-3 text-sm font-bold text-slate-700">{row.cost}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'fleet' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Matrícula</th>
                  <th className="px-5 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Veículo</th>
                  <th className="px-5 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Localização</th>
                  <th className="px-5 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Motorista</th>
                  <th className="px-5 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Obra</th>
                  <th className="px-5 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  { plate: '45-AB-12', vehicle: 'Renault Master', location: 'Lyon', driver: 'Ricardo Santos', project: 'Central Hidrelétrica', status: 'Em Uso' },
                  { plate: '78-CD-34', vehicle: 'Mercedes Sprinter', location: 'Lyon', driver: 'Carlos Mendes', project: 'Central Hidrelétrica', status: 'Em Uso' },
                  { plate: '12-EF-56', vehicle: 'VW Caddy', location: 'Porto', driver: '—', project: '—', status: 'Disponível' },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50/50">
                    <td className="px-5 py-3 font-mono text-sm font-bold text-industrial">{row.plate}</td>
                    <td className="px-5 py-3 text-sm font-bold text-slate-900">{row.vehicle}</td>
                    <td className="px-5 py-3 text-sm text-slate-600">{row.location}</td>
                    <td className="px-5 py-3 text-sm text-slate-600">{row.driver}</td>
                    <td className="px-5 py-3 text-xs text-slate-500">{row.project}</td>
                    <td className="px-5 py-3"><span className={`px-2 py-0.5 text-[10px] font-bold rounded border uppercase ${row.status === 'Em Uso' ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-green-50 text-green-700 border-green-200'}`}>{row.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'locations' && (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Local</th>
                  <th className="px-5 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest">País</th>
                  <th className="px-5 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Tipo</th>
                  <th className="px-5 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Obras</th>
                  <th className="px-5 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Alojamentos</th>
                  <th className="px-5 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Veículos</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  { name: 'Lyon', country: 'FR', type: 'Cidade', projects: 2, housings: 4, vehicles: 3 },
                  { name: 'Porto', country: 'PT', type: 'Cidade', projects: 1, housings: 2, vehicles: 2 },
                  { name: 'Bruxelas', country: 'BE', type: 'Cidade', projects: 1, housings: 1, vehicles: 1 },
                  { name: 'Bilbao', country: 'ES', type: 'Cidade', projects: 1, housings: 1, vehicles: 1 },
                  { name: 'Sede Metalbras', country: 'PT', type: 'Base', projects: 0, housings: 0, vehicles: 5 },
                ].map((row, i) => (
                  <tr key={i} className="hover:bg-slate-50/50">
                    <td className="px-5 py-3 text-sm font-bold text-slate-900 flex items-center gap-1"><MapPin size={14} className="text-slate-400" /> {row.name}</td>
                    <td className="px-5 py-3 text-xs font-bold text-slate-500">{row.country}</td>
                    <td className="px-5 py-3 text-xs text-slate-500">{row.type}</td>
                    <td className="px-5 py-3 text-sm font-bold text-slate-700">{row.projects}</td>
                    <td className="px-5 py-3 text-sm font-bold text-slate-700">{row.housings}</td>
                    <td className="px-5 py-3 text-sm font-bold text-slate-700">{row.vehicles}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DatabaseView;
