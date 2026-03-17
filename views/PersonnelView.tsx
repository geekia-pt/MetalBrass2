
import React, { useState } from 'react';
import { Worker, ComplianceStatus } from '../types';
import Badge from '../components/Badge';
import { Search, Filter, MoreHorizontal, UserPlus, X, MessageSquare, FileUp, Eye, UserX, Link2, Copy, Check } from 'lucide-react';

function generateWorkerUrl(name: string): string {
  const slug = name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/\s+/g, '-');
  return `nexus.metalbrass.com/${slug}`;
}

const MOCK_WORKERS: Worker[] = [
  { id: '1', nif: '123.456.789', name: 'Ricardo Santos', role: 'Soldador Especialista', project: 'Obra Vale A', status: ComplianceStatus.VALID, lastUpdate: '10/10/2023', skillTags: ['TIG', 'ASME'], hourlyCost: 45, phone: '+351 912 345 678', email: 'ricardo.santos@metalbras.pt' },
  { id: '2', nif: '987.654.321', name: 'Ana Oliveira', role: 'Engenheira Mecânica', project: 'Plataforma Sul', status: ComplianceStatus.EXPIRING, lastUpdate: '15/10/2023', skillTags: ['Design', 'Project Mgmt'], hourlyCost: 65, phone: '+351 912 987 654', email: 'ana.oliveira@metalbras.pt' },
  { id: '3', nif: '456.123.789', name: 'Carlos Mendes', role: 'Ajudante Geral', project: 'Metalbras Central', status: ComplianceStatus.CRITICAL, lastUpdate: '02/11/2023', skillTags: ['Logistics'], hourlyCost: 18, phone: '+351 912 456 789', email: 'carlos.mendes@metalbras.pt' },
  { id: '4', nif: '321.654.987', name: 'Juliana Lima', role: 'Operadora de Ponte', project: 'Obra Vale A', status: ComplianceStatus.VALID, lastUpdate: '05/11/2023', skillTags: ['Crane', 'Safety'], hourlyCost: 35, phone: '+351 912 321 654', email: 'juliana.lima@metalbras.pt' },
  { id: '5', nif: '159.357.486', name: 'Marcos Silva', role: 'Serralheiro', project: 'Plataforma Sul', status: ComplianceStatus.PENDING, lastUpdate: '08/11/2023', skillTags: ['Metal', 'Welding'], hourlyCost: 28, phone: '+351 912 159 357', email: 'marcos.silva@metalbras.pt' },
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

const ANNUAL_REVENUE: Record<string, string> = {
  '1': '€ 86.400', '2': '€ 124.800', '3': '€ 34.560', '4': '€ 67.200', '5': '€ 53.760',
};

const PersonnelView: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [actionsOpen, setActionsOpen] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filtered = MOCK_WORKERS.filter(w =>
    w.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    w.nif.includes(searchTerm)
  );

  const copyLink = (worker: Worker) => {
    navigator.clipboard.writeText(generateWorkerUrl(worker.name));
    setCopiedId(worker.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-900">Módulo de Pessoal</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 text-sm font-bold bg-industrial text-white rounded-md shadow hover:bg-industrial-dark transition-all"
        >
          <UserPlus size={18} />
          Cadastrar Operário
        </button>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden flex flex-col">
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

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest">NIF / ID</th>
                <th className="px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Colaborador</th>
                <th className="px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Função</th>
                <th className="px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Projeto Atual</th>
                <th className="px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Status</th>
                <th className="px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Fat. Anual</th>
                <th className="px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Link Operário</th>
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
                  <td className="px-4 py-2">
                    <span className="text-sm font-bold text-slate-700 tabular-nums">{ANNUAL_REVENUE[worker.id] || '€ 42.240'}</span>
                  </td>
                  <td className="px-4 py-2">
                    <button
                      onClick={() => copyLink(worker)}
                      className="flex items-center gap-1.5 px-2 py-1 text-[10px] font-bold text-industrial bg-slate-50 border border-slate-200 rounded hover:bg-slate-100 transition-colors"
                      title={generateWorkerUrl(worker.name)}
                    >
                      {copiedId === worker.id ? <Check size={12} className="text-compliance-green" /> : <Copy size={12} />}
                      {copiedId === worker.id ? 'Copiado!' : 'Copiar Link'}
                    </button>
                  </td>
                  <td className="px-4 py-2 text-center relative">
                    <button
                      onClick={() => setActionsOpen(actionsOpen === worker.id ? null : worker.id)}
                      className="p-1 hover:bg-slate-200 rounded transition-colors text-slate-400 hover:text-industrial"
                    >
                      <MoreHorizontal size={18} />
                    </button>

                    {actionsOpen === worker.id && (
                      <>
                        <div className="fixed inset-0 z-40" onClick={() => setActionsOpen(null)} />
                        <div className="absolute right-4 top-full mt-1 w-56 bg-white border border-slate-200 rounded-lg shadow-xl z-50 overflow-hidden">
                          <button className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors text-left">
                            <MessageSquare size={16} className="text-slate-400" />
                            Enviar Mensagem
                          </button>
                          <button className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors text-left">
                            <FileUp size={16} className="text-slate-400" />
                            Atualizar Documentação
                          </button>
                          <button className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition-colors text-left">
                            <Eye size={16} className="text-slate-400" />
                            Ver Perfil Completo
                          </button>
                          <div className="border-t border-slate-100" />
                          <button className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors text-left">
                            <UserX size={16} />
                            Desativar Colaborador
                          </button>
                        </div>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Worker Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowCreateModal(false)} />
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto no-scrollbar">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">Cadastrar Novo Operário</h2>
              <button onClick={() => setShowCreateModal(false)} className="p-1 hover:bg-slate-100 rounded">
                <X size={20} className="text-slate-400" />
              </button>
            </div>
            <div className="p-6 space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Nome Completo</label>
                  <input type="text" placeholder="Ex: Ricardo Santos" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-sm focus:ring-2 focus:ring-industrial/20 outline-none" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">NIF</label>
                  <input type="text" placeholder="000.000.000" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-sm font-mono focus:ring-2 focus:ring-industrial/20 outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Nacionalidade</label>
                  <input type="text" placeholder="Ex: Portuguesa" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-sm focus:ring-2 focus:ring-industrial/20 outline-none" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Telefone</label>
                  <input type="tel" placeholder="+351 912 345 678" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-sm focus:ring-2 focus:ring-industrial/20 outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Email</label>
                  <input type="email" placeholder="email@metalbras.pt" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-sm focus:ring-2 focus:ring-industrial/20 outline-none" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Função</label>
                  <input type="text" placeholder="Ex: Soldador TIG" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-sm focus:ring-2 focus:ring-industrial/20 outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Skills (separar por vírgula)</label>
                  <input type="text" placeholder="TIG, MIG, ASME" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-sm focus:ring-2 focus:ring-industrial/20 outline-none" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Custo/Hora (€)</label>
                  <input type="number" placeholder="0.00" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-sm focus:ring-2 focus:ring-industrial/20 outline-none" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Documentos Iniciais</label>
                <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 text-center hover:border-industrial/30 transition-colors cursor-pointer">
                  <FileUp size={24} className="mx-auto text-slate-300 mb-2" />
                  <p className="text-xs text-slate-500">Arraste ficheiros ou clique para selecionar</p>
                  <p className="text-[10px] text-slate-400 mt-1">PDF, JPG, PNG até 10MB</p>
                </div>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <div className="flex items-center gap-2">
                  <Link2 size={14} className="text-industrial" />
                  <span className="text-xs text-slate-500">Link Modo Operário será gerado automaticamente:</span>
                </div>
                <p className="text-xs font-mono text-industrial mt-1 font-bold">nexus.metalbrass.com/nome-sobrenome</p>
              </div>
            </div>
            <div className="p-6 border-t border-slate-100 flex gap-3 justify-end">
              <button onClick={() => setShowCreateModal(false)} className="px-4 py-2.5 text-sm font-semibold border border-slate-200 rounded-md hover:bg-slate-50">Cancelar</button>
              <button className="px-6 py-2.5 text-sm font-bold bg-industrial text-white rounded-md hover:bg-slate-800 transition-colors">Cadastrar Operário</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PersonnelView;
