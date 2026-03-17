
import React, { useState } from 'react';
import { Factory, Plus, X, Users, Calendar, ArrowLeft, Camera, Wrench, Package, Clock, CheckCircle2, ChevronRight } from 'lucide-react';

type KanbanColumn = 'received' | 'preparation' | 'production' | 'quality' | 'ready' | 'shipped';

interface ProductionOrder {
  id: string;
  name: string;
  client: string;
  deadline: string;
  responsible: string;
  team: string[];
  progress: number;
  column: KanbanColumn;
  priority: 'high' | 'medium' | 'low';
}

const COLUMNS: { id: KanbanColumn; label: string; color: string }[] = [
  { id: 'received', label: 'Encomenda Recebida', color: 'border-t-slate-400' },
  { id: 'preparation', label: 'Em Preparação', color: 'border-t-blue-400' },
  { id: 'production', label: 'Em Produção', color: 'border-t-amber-400' },
  { id: 'quality', label: 'Controlo Qualidade', color: 'border-t-purple-400' },
  { id: 'ready', label: 'Pronto p/ Envio', color: 'border-t-green-400' },
  { id: 'shipped', label: 'Enviado', color: 'border-t-slate-300' },
];

const MOCK_ORDERS: ProductionOrder[] = [
  { id: 'o1', name: 'Turbina Hidrelétrica UH-04', client: 'EDF France', deadline: '2024-06-15', responsible: 'Carlos Mendes', team: ['António R.', 'Manuel P.', 'Jorge F.'], progress: 35, column: 'production', priority: 'high' },
  { id: 'o2', name: 'Estrutura Metálica Gare', client: 'SNCF', deadline: '2024-05-20', responsible: 'Ana Oliveira', team: ['Paulo M.', 'Rui A.'], progress: 70, column: 'quality', priority: 'medium' },
  { id: 'o3', name: 'Tubagem Inox ∅600', client: 'Galp Energia', deadline: '2024-04-30', responsible: 'Ricardo Santos', team: ['Nuno C.', 'Tiago S.', 'Diogo O.', 'Manuel P.'], progress: 90, column: 'ready', priority: 'high' },
  { id: 'o4', name: 'Suportes Oleoduto x48', client: 'Shell Intl', deadline: '2024-07-01', responsible: 'Marcos Silva', team: ['Jorge F.'], progress: 10, column: 'preparation', priority: 'low' },
  { id: 'o5', name: 'Válvulas Industriais x12', client: 'IberWind', deadline: '2024-04-15', responsible: 'Carlos Mendes', team: ['António R.', 'Paulo M.'], progress: 100, column: 'shipped', priority: 'medium' },
  { id: 'o6', name: 'Chassis Equipamento Solar', client: 'EDP Renováveis', deadline: '2024-08-01', responsible: 'Ana Oliveira', team: [], progress: 0, column: 'received', priority: 'low' },
];

const TEAM_MEMBERS = [
  { name: 'António Rodrigues', role: 'Soldador TIG', busy: true, task: 'Turbina UH-04' },
  { name: 'Manuel Pereira', role: 'Soldador MIG', busy: true, task: 'Turbina UH-04' },
  { name: 'Jorge Fernandes', role: 'Serralheiro', busy: true, task: 'Turbina UH-04' },
  { name: 'Paulo Martins', role: 'Ajudante', busy: false, task: '' },
  { name: 'Rui Almeida', role: 'Operador', busy: true, task: 'Estrutura Gare' },
  { name: 'Nuno Costa', role: 'Soldador TIG', busy: true, task: 'Tubagem Inox' },
  { name: 'Tiago Santos', role: 'Engenheiro', busy: true, task: 'Tubagem Inox' },
  { name: 'Diogo Oliveira', role: 'Montador', busy: true, task: 'Tubagem Inox' },
];

const AllocationsView: React.FC = () => {
  const [selectedOrder, setSelectedOrder] = useState<ProductionOrder | null>(null);
  const [showNewOrder, setShowNewOrder] = useState(false);

  if (selectedOrder) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-slate-200 rounded-md text-slate-500"><ArrowLeft size={20} /></button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-slate-900">{selectedOrder.name}</h1>
            <p className="text-sm text-slate-500">{selectedOrder.client} • Resp: {selectedOrder.responsible}</p>
          </div>
          <span className={`px-3 py-1 text-xs font-bold rounded-full border uppercase ${
            selectedOrder.priority === 'high' ? 'bg-red-50 text-red-700 border-red-200' :
            selectedOrder.priority === 'medium' ? 'bg-amber-50 text-amber-700 border-amber-200' :
            'bg-slate-100 text-slate-600 border-slate-200'
          }`}>{selectedOrder.priority === 'high' ? 'Urgente' : selectedOrder.priority === 'medium' ? 'Normal' : 'Baixa'}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Progresso</p>
            <h4 className="text-2xl font-bold text-slate-900">{selectedOrder.progress}%</h4>
            <div className="w-full bg-slate-100 h-1.5 rounded-full mt-2"><div className="bg-industrial h-full rounded-full" style={{ width: `${selectedOrder.progress}%` }} /></div>
          </div>
          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Prazo</p>
            <h4 className="text-lg font-bold text-slate-900">{selectedOrder.deadline}</h4>
          </div>
          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Equipa</p>
            <h4 className="text-2xl font-bold text-slate-900">{selectedOrder.team.length}</h4>
          </div>
          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Fase</p>
            <h4 className="text-sm font-bold text-slate-900">{COLUMNS.find(c => c.id === selectedOrder.column)?.label}</h4>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2"><Users size={16} /> Equipa Afeta</h3>
            <div className="space-y-2">
              {selectedOrder.team.map((member, i) => (
                <div key={i} className="flex items-center gap-3 p-2 bg-slate-50 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-industrial-steel flex items-center justify-center text-white text-xs font-bold">
                    {member.split(' ').map(n => n[0]).join('')}
                  </div>
                  <span className="text-sm font-medium text-slate-700">{member}</span>
                </div>
              ))}
              {selectedOrder.team.length === 0 && <p className="text-sm text-slate-400 italic">Sem equipa afeta</p>}
              <button className="w-full flex items-center justify-center gap-2 py-2 border border-dashed border-slate-300 rounded-lg text-xs font-bold text-slate-500 hover:border-industrial hover:text-industrial">
                <Plus size={14} /> Adicionar Membro
              </button>
            </div>
          </div>
          <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2"><Wrench size={16} /> Tarefas de Produção</h3>
            <div className="space-y-2">
              {[
                { task: 'Corte de chapas', status: 'done' },
                { task: 'Soldadura TIG nível 1', status: 'done' },
                { task: 'Soldadura TIG nível 2', status: 'active' },
                { task: 'Montagem estrutural', status: 'pending' },
                { task: 'Teste de pressão', status: 'pending' },
                { task: 'Acabamento e pintura', status: 'pending' },
              ].map((t, i) => (
                <div key={i} className="flex items-center gap-3 p-2 rounded-lg border border-slate-100">
                  {t.status === 'done' ? <CheckCircle2 size={16} className="text-compliance-green shrink-0" /> :
                   t.status === 'active' ? <Clock size={16} className="text-amber-500 shrink-0" /> :
                   <div className="w-4 h-4 rounded-full border-2 border-slate-300 shrink-0" />}
                  <span className={`text-sm ${t.status === 'done' ? 'text-slate-400 line-through' : 'text-slate-700 font-medium'}`}>{t.task}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2"><Package size={16} /> Materiais</h3>
            <div className="space-y-2">
              {[
                { item: 'Chapa Inox 304 - 10mm', qty: '24 un', used: '18 un' },
                { item: 'Tubo Inox ∅200', qty: '12m', used: '8m' },
                { item: 'Varetas TIG ER308L', qty: '50 kg', used: '32 kg' },
                { item: 'Gás Argon', qty: '6 garrafas', used: '4 garrafas' },
              ].map((m, i) => (
                <div key={i} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                  <span className="text-sm text-slate-700">{m.item}</span>
                  <span className="text-xs font-bold text-slate-500">{m.used} / {m.qty}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2"><Camera size={16} /> Fotos de Progresso</h3>
            <div className="grid grid-cols-3 gap-2">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="aspect-square bg-slate-100 rounded-lg border border-slate-200 flex items-center justify-center text-slate-300">
                  <Camera size={20} />
                </div>
              ))}
              <button className="aspect-square border-2 border-dashed border-slate-300 rounded-lg flex items-center justify-center text-slate-400 hover:border-industrial hover:text-industrial">
                <Plus size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Indústria</h1>
          <p className="text-sm text-slate-500">Gestão de produção na sede — Kanban de encomendas</p>
        </div>
        <button onClick={() => setShowNewOrder(true)} className="flex items-center gap-2 px-4 py-2 text-sm font-bold bg-industrial text-white rounded-md hover:bg-slate-800">
          <Plus size={18} /> Nova Encomenda
        </button>
      </div>

      {/* Team sidebar + Kanban */}
      <div className="flex gap-6">
        {/* Team */}
        <div className="w-56 shrink-0 bg-white rounded-lg border border-slate-200 shadow-sm p-4">
          <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-3">Equipa Indústria ({TEAM_MEMBERS.length})</h3>
          <div className="space-y-2">
            {TEAM_MEMBERS.map((m, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className={`w-2 h-2 rounded-full ${m.busy ? 'bg-amber-400' : 'bg-compliance-green'}`} />
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-700 truncate">{m.name}</p>
                  <p className="text-[9px] text-slate-400 truncate">{m.busy ? m.task : 'Disponível'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Kanban */}
        <div className="flex-1 flex gap-3 overflow-x-auto pb-2 no-scrollbar">
          {COLUMNS.map(col => {
            const orders = MOCK_ORDERS.filter(o => o.column === col.id);
            return (
              <div key={col.id} className="min-w-[200px] flex-1">
                <div className={`bg-white rounded-lg border border-slate-200 border-t-4 ${col.color} shadow-sm flex flex-col`}>
                  <div className="p-3 border-b border-slate-100 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{col.label}</span>
                    <span className="text-xs font-bold text-slate-400 bg-slate-100 w-5 h-5 rounded-full flex items-center justify-center">{orders.length}</span>
                  </div>
                  <div className="p-2 space-y-2 min-h-[200px]">
                    {orders.map(order => (
                      <button
                        key={order.id}
                        onClick={() => setSelectedOrder(order)}
                        className="w-full p-3 bg-slate-50 hover:bg-slate-100 rounded-lg text-left transition-colors border border-slate-100"
                      >
                        {order.priority === 'high' && <span className="text-[9px] font-bold text-red-600 uppercase">Urgente</span>}
                        <p className="text-xs font-bold text-slate-900 mt-0.5">{order.name}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">{order.client}</p>
                        <div className="flex items-center justify-between mt-2">
                          <div className="flex -space-x-1">
                            {order.team.slice(0, 3).map((_, i) => (
                              <div key={i} className="w-5 h-5 rounded-full bg-industrial-steel border border-white text-[8px] text-white flex items-center justify-center font-bold" />
                            ))}
                            {order.team.length > 3 && <span className="text-[9px] text-slate-400 ml-1">+{order.team.length - 3}</span>}
                          </div>
                          <span className="text-[9px] text-slate-400">{order.deadline}</span>
                        </div>
                        <div className="w-full bg-slate-200 h-1 rounded-full mt-2">
                          <div className="bg-industrial h-full rounded-full" style={{ width: `${order.progress}%` }} />
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* New Order Modal */}
      {showNewOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowNewOrder(false)} />
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">Nova Encomenda</h2>
              <button onClick={() => setShowNewOrder(false)} className="p-1 hover:bg-slate-100 rounded"><X size={20} className="text-slate-400" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Nome / Descrição</label>
                <input type="text" placeholder="Ex: Turbina Hidrelétrica UH-05" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-sm outline-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Cliente</label>
                  <input type="text" placeholder="Ex: EDF France" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-sm outline-none" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Prazo de Entrega</label>
                  <input type="date" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-sm" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Responsável</label>
                  <input type="text" placeholder="Nome do responsável" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-sm outline-none" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Prioridade</label>
                  <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-sm">
                    <option>Baixa</option><option>Normal</option><option>Urgente</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="p-6 border-t border-slate-100 flex gap-3 justify-end">
              <button onClick={() => setShowNewOrder(false)} className="px-4 py-2.5 text-sm font-semibold border border-slate-200 rounded-md hover:bg-slate-50">Cancelar</button>
              <button onClick={() => setShowNewOrder(false)} className="px-6 py-2.5 text-sm font-bold bg-industrial text-white rounded-md hover:bg-slate-800">Criar Encomenda</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllocationsView;
