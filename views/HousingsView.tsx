
import React from 'react';
import { Home, Plus, Users, MapPin } from 'lucide-react';

const MOCK_HOUSINGS = [
  { id: 'h1', name: 'Apt. Lyon Centro #1', city: 'Lyon', country: 'FR', capacity: 4, occupants: 3, cost: 1200, project: 'Central Hidrelétrica', status: 'available' },
  { id: 'h2', name: 'Apt. Lyon Centro #2', city: 'Lyon', country: 'FR', capacity: 4, occupants: 4, cost: 1200, project: 'Central Hidrelétrica', status: 'full' },
  { id: 'h3', name: 'Casa Porto Industrial', city: 'Porto', country: 'PT', capacity: 6, occupants: 2, cost: 800, project: 'Estruturas Metálicas', status: 'available' },
  { id: 'h4', name: 'Apt. Bruxelas Sul', city: 'Bruxelas', country: 'BE', capacity: 3, occupants: 0, cost: 1500, project: 'Oleoduto Trans-Alpino', status: 'maintenance' },
];

const HousingsView: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Alojamentos</h1>
          <p className="text-sm text-slate-500">Gestão de hospedagem dos operários por obra</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 text-sm font-bold bg-industrial text-white rounded-md hover:bg-slate-800 transition-all">
          <Plus size={18} /> Novo Alojamento
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {MOCK_HOUSINGS.map(h => (
          <div key={h.id} className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
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
                <span className="font-bold text-slate-900">{h.occupants}</span>
                <span className="text-slate-400">/ {h.capacity}</span>
              </div>
              <div className="flex-1 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full ${h.occupants >= h.capacity ? 'bg-compliance-red' : 'bg-compliance-green'}`}
                  style={{ width: `${(h.occupants / h.capacity) * 100}%` }}
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">{h.project}</span>
              <span className="font-bold text-slate-700">€ {h.cost}/mês</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HousingsView;
