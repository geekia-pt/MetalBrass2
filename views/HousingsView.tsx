
import React, { useState } from 'react';
import { Home, Plus, Users, MapPin, X, ArrowLeft, Wrench, Package, Zap, Droplets, Wifi, Phone, Flame } from 'lucide-react';

interface Housing {
  id: string;
  name: string;
  address: string;
  city: string;
  country: string;
  capacity: number;
  occupants: string[];
  costMonthly: number;
  project: string;
  status: 'available' | 'full' | 'maintenance';
  utilities: { water: number; electricity: number; gas: number; phone: number; internet: number };
  inventory: { item: string; qty: number }[];
  maintenance: { date: string; desc: string; cost: number; resolved: boolean }[];
}

const MOCK_HOUSINGS: Housing[] = [
  {
    id: 'h1', name: 'Apt. Lyon Centro #1', address: 'Rue de la République 45, 69002', city: 'Lyon', country: 'FR',
    capacity: 4, occupants: ['Ricardo Santos', 'Carlos Mendes', 'Marcos Silva'], costMonthly: 1200, project: 'Central Hidrelétrica', status: 'available',
    utilities: { water: 45, electricity: 120, gas: 35, phone: 25, internet: 40 },
    inventory: [{ item: 'Cama Single', qty: 4 }, { item: 'Mesa', qty: 1 }, { item: 'Frigorífico', qty: 1 }, { item: 'Fogão', qty: 1 }, { item: 'Máquina Lavar', qty: 1 }],
    maintenance: [{ date: '2024-02-15', desc: 'Reparação canalização WC', cost: 180, resolved: true }, { date: '2024-03-10', desc: 'Substituição fechadura porta', cost: 95, resolved: false }]
  },
  {
    id: 'h2', name: 'Apt. Lyon Centro #2', address: 'Rue de la République 47, 69002', city: 'Lyon', country: 'FR',
    capacity: 4, occupants: ['Ana Oliveira', 'Juliana Lima', 'Sofia Costa', 'Pedro Alves'], costMonthly: 1200, project: 'Central Hidrelétrica', status: 'full',
    utilities: { water: 50, electricity: 130, gas: 40, phone: 25, internet: 40 },
    inventory: [{ item: 'Cama Single', qty: 4 }, { item: 'Mesa', qty: 1 }, { item: 'Frigorífico', qty: 1 }, { item: 'Fogão', qty: 1 }],
    maintenance: []
  },
  {
    id: 'h3', name: 'Casa Porto Industrial', address: 'Rua do Heroísmo 120, 4300', city: 'Porto', country: 'PT',
    capacity: 6, occupants: ['Bruno Ferreira', 'Trabalhador 6'], costMonthly: 800, project: 'Estruturas Metálicas', status: 'available',
    utilities: { water: 30, electricity: 85, gas: 25, phone: 20, internet: 35 },
    inventory: [{ item: 'Cama Single', qty: 6 }, { item: 'Mesa', qty: 2 }, { item: 'Frigorífico', qty: 1 }, { item: 'Fogão', qty: 1 }, { item: 'Microondas', qty: 1 }],
    maintenance: [{ date: '2024-01-20', desc: 'Pintura quartos', cost: 450, resolved: true }]
  },
  {
    id: 'h4', name: 'Apt. Bruxelas Sul', address: 'Chaussée de Charleroi 80, 1060', city: 'Bruxelas', country: 'BE',
    capacity: 3, occupants: [], costMonthly: 1500, project: 'Oleoduto Trans-Alpino', status: 'maintenance',
    utilities: { water: 55, electricity: 140, gas: 50, phone: 30, internet: 45 },
    inventory: [{ item: 'Cama Single', qty: 3 }, { item: 'Mesa', qty: 1 }, { item: 'Frigorífico', qty: 1 }],
    maintenance: [{ date: '2024-03-05', desc: 'Reparação aquecimento central', cost: 850, resolved: false }]
  },
];

const HousingsView: React.FC = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedHousing, setSelectedHousing] = useState<Housing | null>(null);

  if (selectedHousing) {
    const h = selectedHousing;
    const utilTotal = h.utilities.water + h.utilities.electricity + h.utilities.gas + h.utilities.phone + h.utilities.internet;
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button onClick={() => setSelectedHousing(null)} className="p-2 hover:bg-slate-200 rounded-md transition-colors text-slate-500">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900">{h.name}</h1>
            <p className="text-sm text-slate-500 flex items-center gap-1"><MapPin size={12} /> {h.address}</p>
          </div>
          <div className="ml-auto">
            <span className={`px-3 py-1 text-xs font-bold rounded-full border uppercase ${
              h.status === 'available' ? 'bg-green-50 text-green-700 border-green-200' :
              h.status === 'full' ? 'bg-red-50 text-red-700 border-red-200' :
              'bg-amber-50 text-amber-700 border-amber-200'
            }`}>
              {h.status === 'available' ? 'Disponível' : h.status === 'full' ? 'Lotado' : 'Manutenção'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Occupants + Capacity */}
          <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2"><Users size={16} /> Ocupantes ({h.occupants.length}/{h.capacity})</h3>
            <div className="mb-3">
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${h.occupants.length >= h.capacity ? 'bg-compliance-red' : 'bg-compliance-green'}`} style={{ width: `${(h.occupants.length / h.capacity) * 100}%` }} />
              </div>
            </div>
            <div className="space-y-2">
              {h.occupants.map((name, i) => (
                <div key={i} className="flex items-center gap-3 p-2 bg-slate-50 rounded-lg">
                  <div className="w-8 h-8 rounded-full bg-industrial-steel flex items-center justify-center text-white text-xs font-bold">
                    {name.split(' ').map(n => n[0]).join('')}
                  </div>
                  <span className="text-sm font-medium text-slate-700">{name}</span>
                </div>
              ))}
              {h.occupants.length === 0 && <p className="text-sm text-slate-400 italic">Sem ocupantes</p>}
            </div>
          </div>

          {/* Costs */}
          <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2"><Zap size={16} /> Custos Fixos Mensais</h3>
            <div className="space-y-3">
              {[
                { icon: Droplets, label: 'Água', value: h.utilities.water },
                { icon: Zap, label: 'Eletricidade', value: h.utilities.electricity },
                { icon: Flame, label: 'Gás', value: h.utilities.gas },
                { icon: Phone, label: 'Telefone', value: h.utilities.phone },
                { icon: Wifi, label: 'Internet', value: h.utilities.internet },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="flex items-center gap-2 text-sm text-slate-600">
                    <item.icon size={14} className="text-slate-400" /> {item.label}
                  </span>
                  <span className="text-sm font-bold text-slate-900 tabular-nums">€ {item.value}</span>
                </div>
              ))}
              <div className="border-t border-slate-200 pt-3 flex items-center justify-between">
                <span className="text-sm font-bold text-slate-700">Utilidades Total</span>
                <span className="text-sm font-black text-slate-900 tabular-nums">€ {utilTotal}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-slate-700">Renda</span>
                <span className="text-sm font-black text-slate-900 tabular-nums">€ {h.costMonthly}</span>
              </div>
              <div className="bg-industrial-dark text-white p-3 rounded-lg flex items-center justify-between">
                <span className="text-sm font-bold">Total Mensal</span>
                <span className="text-lg font-black tabular-nums">€ {h.costMonthly + utilTotal}</span>
              </div>
            </div>
          </div>

          {/* Inventory */}
          <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2"><Package size={16} /> Inventário</h3>
            <div className="space-y-2">
              {h.inventory.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                  <span className="text-sm text-slate-700">{item.item}</span>
                  <span className="text-sm font-bold text-slate-900">×{item.qty}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Maintenance Log */}
        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2"><Wrench size={16} /> Registos de Manutenção</h3>
            <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold bg-industrial text-white rounded-md hover:bg-slate-800">
              <Plus size={14} /> Registar Manutenção
            </button>
          </div>
          {h.maintenance.length > 0 ? (
            <table className="w-full text-left">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-4 py-2 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Data</th>
                  <th className="px-4 py-2 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Descrição</th>
                  <th className="px-4 py-2 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-right">Custo</th>
                  <th className="px-4 py-2 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {h.maintenance.map((m, i) => (
                  <tr key={i}>
                    <td className="px-4 py-2 text-sm font-mono text-slate-600">{m.date}</td>
                    <td className="px-4 py-2 text-sm text-slate-700">{m.desc}</td>
                    <td className="px-4 py-2 text-sm font-bold text-slate-900 text-right tabular-nums">€ {m.cost}</td>
                    <td className="px-4 py-2">
                      <span className={`px-2 py-0.5 text-[10px] font-bold rounded border uppercase ${m.resolved ? 'bg-green-50 text-green-700 border-green-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                        {m.resolved ? 'Resolvido' : 'Pendente'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-sm text-slate-400 italic text-center py-4">Sem registos de manutenção</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Alojamentos</h1>
          <p className="text-sm text-slate-500">Gestão de hospedagem dos operários por obra</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* New Housing Card */}
        <button
          onClick={() => setShowCreateModal(true)}
          className="border-2 border-dashed border-slate-300 rounded-lg p-8 flex flex-col items-center justify-center gap-3 hover:border-industrial hover:bg-slate-50/50 transition-all group"
        >
          <div className="w-14 h-14 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-industrial group-hover:text-white transition-colors">
            <Plus size={28} />
          </div>
          <span className="text-sm font-bold text-slate-500 group-hover:text-industrial">Novo Alojamento</span>
        </button>

        {MOCK_HOUSINGS.map(h => (
          <button
            key={h.id}
            onClick={() => setSelectedHousing(h)}
            className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow text-left"
          >
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="text-sm font-bold text-slate-900">{h.name}</h3>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                  <MapPin size={10} /> {h.city}, {h.country}
                </p>
              </div>
              <span className={`px-2 py-0.5 text-[10px] font-bold rounded border uppercase tracking-widest ${
                h.status === 'available' ? 'bg-green-50 text-green-700 border-green-200' :
                h.status === 'full' ? 'bg-red-50 text-red-700 border-red-200' :
                'bg-amber-50 text-amber-700 border-amber-200'
              }`}>
                {h.status === 'available' ? 'Disponível' : h.status === 'full' ? 'Lotado' : 'Manutenção'}
              </span>
            </div>
            <div className="flex items-center gap-4 mb-3">
              <div className="flex items-center gap-1.5 text-sm">
                <Users size={14} className="text-slate-400" />
                <span className="font-bold text-slate-900">{h.occupants.length}</span>
                <span className="text-slate-400">/ {h.capacity}</span>
              </div>
              <div className="flex-1 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${h.occupants.length >= h.capacity ? 'bg-compliance-red' : 'bg-compliance-green'}`} style={{ width: `${(h.occupants.length / h.capacity) * 100}%` }} />
              </div>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">{h.project}</span>
              <span className="font-bold text-slate-700">€ {h.costMonthly}/mês</span>
            </div>
            {h.maintenance.filter(m => !m.resolved).length > 0 && (
              <div className="mt-2 flex items-center gap-1 text-[10px] font-bold text-amber-600">
                <Wrench size={10} /> {h.maintenance.filter(m => !m.resolved).length} manutenção pendente
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Create Housing Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowCreateModal(false)} />
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">Novo Alojamento</h2>
              <button onClick={() => setShowCreateModal(false)} className="p-1 hover:bg-slate-100 rounded"><X size={20} className="text-slate-400" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Nome</label>
                <input type="text" placeholder="Ex: Apt. Lyon Centro #3" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-sm outline-none focus:ring-2 focus:ring-industrial/20" />
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Morada</label>
                <input type="text" placeholder="Endereço completo" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-sm outline-none focus:ring-2 focus:ring-industrial/20" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Cidade</label>
                  <input type="text" placeholder="Lyon" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-sm outline-none focus:ring-2 focus:ring-industrial/20" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">País</label>
                  <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-sm">
                    <option>Portugal</option><option>França</option><option>Espanha</option><option>Bélgica</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Capacidade (pessoas)</label>
                  <input type="number" placeholder="4" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-sm outline-none focus:ring-2 focus:ring-industrial/20" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Custo Mensal (€)</label>
                  <input type="number" placeholder="1200" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-sm outline-none focus:ring-2 focus:ring-industrial/20" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Obra Vinculada</label>
                <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-sm">
                  <option>Central Hidrelétrica - Lyon</option>
                  <option>Estruturas Metálicas - Porto</option>
                  <option>Oleoduto Trans-Alpino - Bruxelas</option>
                  <option>Manutenção Eólica - Bilbao</option>
                </select>
              </div>
            </div>
            <div className="p-6 border-t border-slate-100 flex gap-3 justify-end">
              <button onClick={() => setShowCreateModal(false)} className="px-4 py-2.5 text-sm font-semibold border border-slate-200 rounded-md hover:bg-slate-50">Cancelar</button>
              <button className="px-6 py-2.5 text-sm font-bold bg-industrial text-white rounded-md hover:bg-slate-800">Criar Alojamento</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HousingsView;
