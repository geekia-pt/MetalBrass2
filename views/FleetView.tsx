
import React, { useState } from 'react';
import { Truck, Plus, X, MapPin, User, Wrench, Calendar, ArrowLeft, FileText, Fuel, Shield, Search } from 'lucide-react';

interface Vehicle {
  id: string;
  plate: string;
  brand: string;
  model: string;
  type: string;
  location: string;
  driver: string;
  project: string;
  status: 'available' | 'in_use' | 'maintenance';
  km: number;
  lastMaintenance: string;
  lastMaintenanceKm: number;
  nextMaintenance: string;
  insurance: string;
  inspection: string;
  fuelType: string;
  history: { date: string; desc: string; cost: number }[];
}

const MOCK_VEHICLES: Vehicle[] = [
  { id: 'v1', plate: '45-AB-12', brand: 'Renault', model: 'Master', type: 'Carrinha', location: 'Lyon, FR', driver: 'Ricardo Santos', project: 'Central Hidrelétrica', status: 'in_use', km: 87500, lastMaintenance: '2024-02-01', lastMaintenanceKm: 85000, nextMaintenance: '2024-05-01', insurance: '2024-12-31', inspection: '2024-09-15', fuelType: 'Diesel', history: [{ date: '2024-02-01', desc: 'Revisão 85.000km', cost: 450 }, { date: '2024-01-10', desc: 'Troca pneus', cost: 680 }] },
  { id: 'v2', plate: '78-CD-34', brand: 'Mercedes', model: 'Sprinter', type: 'Carrinha', location: 'Lyon, FR', driver: 'Carlos Mendes', project: 'Central Hidrelétrica', status: 'in_use', km: 124300, lastMaintenance: '2024-01-15', lastMaintenanceKm: 120000, nextMaintenance: '2024-04-15', insurance: '2024-11-30', inspection: '2024-08-20', fuelType: 'Diesel', history: [{ date: '2024-01-15', desc: 'Revisão 120.000km', cost: 580 }] },
  { id: 'v3', plate: '12-EF-56', brand: 'Volkswagen', model: 'Caddy', type: 'Carro', location: 'Porto, PT', driver: '', project: '', status: 'available', km: 45200, lastMaintenance: '2024-03-01', lastMaintenanceKm: 45000, nextMaintenance: '2024-06-01', insurance: '2025-03-15', inspection: '2025-01-10', fuelType: 'Diesel', history: [{ date: '2024-03-01', desc: 'Revisão 45.000km', cost: 320 }] },
  { id: 'v4', plate: '90-GH-78', brand: 'Renault', model: 'Trafic', type: 'Carrinha', location: 'Bruxelas, BE', driver: 'Marcos Silva', project: 'Oleoduto Trans-Alpino', status: 'maintenance', km: 156800, lastMaintenance: '2024-02-20', lastMaintenanceKm: 155000, nextMaintenance: '2024-05-20', insurance: '2024-10-30', inspection: '2024-07-05', fuelType: 'Diesel', history: [{ date: '2024-03-10', desc: 'Avaria motor arranque', cost: 950 }, { date: '2024-02-20', desc: 'Revisão 155.000km', cost: 520 }] },
  { id: 'v5', plate: '34-IJ-90', brand: 'Ford', model: 'Transit', type: 'Carrinha', location: 'Bilbao, ES', driver: 'Paulo Martins', project: 'Eólica Norte', status: 'in_use', km: 67800, lastMaintenance: '2024-01-20', lastMaintenanceKm: 65000, nextMaintenance: '2024-04-20', insurance: '2025-01-20', inspection: '2024-11-30', fuelType: 'Diesel', history: [] },
];

const FleetView: React.FC = () => {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(null);

  if (selectedVehicle) {
    const v = selectedVehicle;
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button onClick={() => setSelectedVehicle(null)} className="p-2 hover:bg-slate-200 rounded-md text-slate-500"><ArrowLeft size={20} /></button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-slate-900">{v.brand} {v.model}</h1>
            <p className="text-sm text-slate-500 font-mono font-bold">{v.plate} • {v.type}</p>
          </div>
          <span className={`px-3 py-1 text-xs font-bold rounded-full border uppercase ${
            v.status === 'available' ? 'bg-green-50 text-green-700 border-green-200' :
            v.status === 'in_use' ? 'bg-blue-50 text-blue-700 border-blue-200' :
            'bg-amber-50 text-amber-700 border-amber-200'
          }`}>{v.status === 'available' ? 'Disponível' : v.status === 'in_use' ? 'Em Uso' : 'Manutenção'}</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Quilómetros</p>
            <h4 className="text-xl font-bold text-slate-900 tabular-nums">{v.km.toLocaleString('pt-PT')} km</h4>
          </div>
          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Localização</p>
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1"><MapPin size={14} /> {v.location}</h4>
          </div>
          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Motorista</p>
            <h4 className="text-sm font-bold text-slate-900">{v.driver || '—'}</h4>
          </div>
          <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Obra</p>
            <h4 className="text-sm font-bold text-slate-900">{v.project || 'Sem afetação'}</h4>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2"><FileText size={16} /> Documentos & Validades</h3>
            <div className="space-y-3">
              {[
                { icon: Shield, label: 'Seguro', date: v.insurance },
                { icon: FileText, label: 'Inspeção', date: v.inspection },
                { icon: Wrench, label: 'Próxima Manutenção', date: v.nextMaintenance },
                { icon: Wrench, label: 'Última Manutenção', date: `${v.lastMaintenance} (${v.lastMaintenanceKm.toLocaleString('pt-PT')} km)` },
                { icon: Fuel, label: 'Combustível', date: v.fuelType },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                  <span className="flex items-center gap-2 text-sm text-slate-600"><item.icon size={14} className="text-slate-400" /> {item.label}</span>
                  <span className="text-sm font-bold text-slate-900">{item.date}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm">
            <h3 className="text-sm font-bold text-slate-900 mb-4 flex items-center gap-2"><Wrench size={16} /> Histórico de Manutenção</h3>
            {v.history.length > 0 ? (
              <div className="space-y-2">
                {v.history.map((h, i) => (
                  <div key={i} className="flex items-center justify-between p-2 bg-slate-50 rounded">
                    <div>
                      <p className="text-sm text-slate-700">{h.desc}</p>
                      <p className="text-[10px] text-slate-400 font-mono">{h.date}</p>
                    </div>
                    <span className="text-sm font-bold text-slate-900 tabular-nums">€ {h.cost}</span>
                  </div>
                ))}
                <div className="border-t border-slate-200 pt-2 flex justify-between">
                  <span className="text-xs font-bold text-slate-500">Total Manutenção</span>
                  <span className="text-sm font-black text-slate-900">€ {v.history.reduce((s, h) => s + h.cost, 0)}</span>
                </div>
              </div>
            ) : (
              <p className="text-sm text-slate-400 italic text-center py-4">Sem registos</p>
            )}
            <button className="mt-3 w-full flex items-center justify-center gap-2 py-2 border border-dashed border-slate-300 rounded-lg text-xs font-bold text-slate-500 hover:border-industrial hover:text-industrial">
              <Plus size={14} /> Registar Manutenção
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Frota</h1>
          <p className="text-sm text-slate-500">Gestão de veículos e carrinhas por obra</p>
        </div>
        <button onClick={() => setShowCreateModal(true)} className="flex items-center gap-2 px-4 py-2 text-sm font-bold bg-industrial text-white rounded-md hover:bg-slate-800">
          <Plus size={18} /> Novo Veículo
        </button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Total Frota</p>
          <h4 className="text-2xl font-bold text-slate-900">{MOCK_VEHICLES.length}</h4>
        </div>
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm border-l-4 border-l-compliance-green">
          <p className="text-[10px] font-bold text-green-600 uppercase mb-1">Disponíveis</p>
          <h4 className="text-2xl font-bold text-slate-900">{MOCK_VEHICLES.filter(v => v.status === 'available').length}</h4>
        </div>
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm border-l-4 border-l-compliance-amber">
          <p className="text-[10px] font-bold text-amber-600 uppercase mb-1">Em Manutenção</p>
          <h4 className="text-2xl font-bold text-slate-900">{MOCK_VEHICLES.filter(v => v.status === 'maintenance').length}</h4>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
        <div className="p-4 border-b border-slate-100">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input type="text" placeholder="Buscar por matrícula, modelo ou obra..." className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm outline-none" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-5 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Matrícula</th>
                <th className="px-5 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Veículo</th>
                <th className="px-5 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Tipo</th>
                <th className="px-5 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Localização</th>
                <th className="px-5 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Motorista</th>
                <th className="px-5 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Obra</th>
                <th className="px-5 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-right">Km</th>
                <th className="px-5 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Últ. Manutenção</th>
                <th className="px-5 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MOCK_VEHICLES.map(v => (
                <tr key={v.id} className="hover:bg-slate-50/50 cursor-pointer" onClick={() => setSelectedVehicle(v)}>
                  <td className="px-5 py-3"><span className="font-mono text-sm font-bold text-industrial">{v.plate}</span></td>
                  <td className="px-5 py-3 text-sm font-bold text-slate-900">{v.brand} {v.model}</td>
                  <td className="px-5 py-3 text-xs text-slate-500">{v.type}</td>
                  <td className="px-5 py-3 text-sm text-slate-600 flex items-center gap-1"><MapPin size={12} className="text-slate-400" /> {v.location}</td>
                  <td className="px-5 py-3 text-sm text-slate-600">{v.driver || '—'}</td>
                  <td className="px-5 py-3"><span className="text-xs text-slate-500 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-full">{v.project || 'Sem afetação'}</span></td>
                  <td className="px-5 py-3 text-sm font-mono text-slate-600 text-right tabular-nums">{v.km.toLocaleString('pt-PT')}</td>
                  <td className="px-5 py-3 text-xs text-slate-500 font-mono">{v.lastMaintenance}</td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-0.5 text-[10px] font-bold rounded border uppercase tracking-widest ${
                      v.status === 'available' ? 'bg-green-50 text-green-700 border-green-200' :
                      v.status === 'in_use' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                      'bg-amber-50 text-amber-700 border-amber-200'
                    }`}>{v.status === 'available' ? 'Disponível' : v.status === 'in_use' ? 'Em Uso' : 'Manutenção'}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowCreateModal(false)} />
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <h2 className="text-lg font-bold text-slate-900">Novo Veículo</h2>
              <button onClick={() => setShowCreateModal(false)} className="p-1 hover:bg-slate-100 rounded"><X size={20} className="text-slate-400" /></button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Matrícula</label>
                  <input type="text" placeholder="00-AA-00" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-sm font-mono outline-none" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Tipo</label>
                  <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-sm">
                    <option>Carrinha</option><option>Carro</option><option>Camião</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Marca</label>
                  <input type="text" placeholder="Ex: Renault" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-sm outline-none" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Modelo</label>
                  <input type="text" placeholder="Ex: Master" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-sm outline-none" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Km Atuais</label>
                  <input type="number" placeholder="0" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-sm outline-none" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Combustível</label>
                  <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-sm">
                    <option>Diesel</option><option>Gasolina</option><option>Elétrico</option><option>Híbrido</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Validade Seguro</label>
                  <input type="date" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-sm" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Validade Inspeção</label>
                  <input type="date" className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-sm" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Obra Vinculada (opcional)</label>
                <select className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-sm">
                  <option value="">Sem afetação</option>
                  <option>Central Hidrelétrica - Lyon</option>
                  <option>Estruturas Metálicas - Porto</option>
                  <option>Oleoduto Trans-Alpino - Bruxelas</option>
                </select>
              </div>
            </div>
            <div className="p-6 border-t border-slate-100 flex gap-3 justify-end">
              <button onClick={() => setShowCreateModal(false)} className="px-4 py-2.5 text-sm font-semibold border border-slate-200 rounded-md hover:bg-slate-50">Cancelar</button>
              <button onClick={() => setShowCreateModal(false)} className="px-6 py-2.5 text-sm font-bold bg-industrial text-white rounded-md hover:bg-slate-800">Registar Veículo</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FleetView;
