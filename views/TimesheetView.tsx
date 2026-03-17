
import React from 'react';
import { Check, X, AlertTriangle, MapPin, Search, Filter, Calendar, Clock, Download } from 'lucide-react';

interface TimesheetEntry {
  id: string;
  workerName: string;
  project: string;
  date: string;
  clockIn: string;
  clockOut: string;
  hours: number;
  overtime: number;
  costPerHour: number;
  status: 'PENDING' | 'APPROVED' | 'DISPUTED';
  locationAlert: boolean;
}

const MOCK_ENTRIES: TimesheetEntry[] = [
  { id: 't1', workerName: 'Ricardo Santos', project: 'Central Hidrelétrica', date: '2024-03-15', clockIn: '07:02', clockOut: '16:32', hours: 8.5, overtime: 0.5, costPerHour: 45, status: 'PENDING', locationAlert: false },
  { id: 't2', workerName: 'Ricardo Santos', project: 'Central Hidrelétrica', date: '2024-03-14', clockIn: '06:58', clockOut: '17:00', hours: 9.0, overtime: 1.0, costPerHour: 45, status: 'PENDING', locationAlert: true },
  { id: 't3', workerName: 'Ana Oliveira', project: 'Plataforma Sul', date: '2024-03-15', clockIn: '08:00', clockOut: '17:00', hours: 8.0, overtime: 0, costPerHour: 65, status: 'APPROVED', locationAlert: false },
  { id: 't4', workerName: 'Carlos Mendes', project: 'Metalbras Central', date: '2024-03-15', clockIn: '07:30', clockOut: '16:00', hours: 7.5, overtime: 0, costPerHour: 18, status: 'PENDING', locationAlert: false },
  { id: 't5', workerName: 'Juliana Lima', project: 'Obra Vale A', date: '2024-03-15', clockIn: '07:15', clockOut: '16:15', hours: 8.0, overtime: 0, costPerHour: 35, status: 'DISPUTED', locationAlert: false },
  { id: 't6', workerName: 'Marcos Silva', project: 'Plataforma Sul', date: '2024-03-15', clockIn: '06:45', clockOut: '17:45', hours: 10.0, overtime: 2.0, costPerHour: 28, status: 'PENDING', locationAlert: false },
  { id: 't7', workerName: 'Pedro Alves', project: 'Estruturas Porto', date: '2024-03-15', clockIn: '08:10', clockOut: '17:10', hours: 8.0, overtime: 0, costPerHour: 32, status: 'APPROVED', locationAlert: false },
  { id: 't8', workerName: 'Sofia Costa', project: 'Central Hidrelétrica', date: '2024-03-15', clockIn: '07:00', clockOut: '15:30', hours: 7.5, overtime: 0, costPerHour: 40, status: 'PENDING', locationAlert: true },
];

const TimesheetView: React.FC = () => {
  const pendingHours = MOCK_ENTRIES.filter(e => e.status === 'PENDING').reduce((sum, e) => sum + e.hours, 0);
  const gpsAlerts = MOCK_ENTRIES.filter(e => e.locationAlert).length;
  const totalCost = MOCK_ENTRIES.reduce((sum, e) => sum + (e.hours * e.costPerHour), 0);
  const totalOvertime = MOCK_ENTRIES.reduce((sum, e) => sum + e.overtime, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Módulo de Timesheet</h1>
          <p className="text-sm text-slate-500">Aprovação de horas e verificação de presença</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-bold border border-slate-200 rounded-md bg-white hover:bg-slate-50">
            <Download size={16} /> Exportar Primavera
          </button>
          <button className="px-4 py-2 text-sm font-bold bg-industrial text-white rounded-md hover:bg-slate-800">Aprovar Todos (Válidos)</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Horas Pendentes</p>
          <h4 className="text-2xl font-bold text-slate-900">{pendingHours.toFixed(1)}h</h4>
        </div>
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm border-l-4 border-l-compliance-amber">
          <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-1">Alertas GPS</p>
          <h4 className="text-2xl font-bold text-slate-900">{gpsAlerts} Ocorrências</h4>
        </div>
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Custo Total</p>
          <h4 className="text-2xl font-bold text-slate-900">€ {totalCost.toLocaleString('pt-PT')}</h4>
        </div>
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm border-l-4 border-l-blue-400">
          <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest mb-1">Horas Extra</p>
          <h4 className="text-2xl font-bold text-slate-900">{totalOvertime.toFixed(1)}h</h4>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
        <div className="p-4 border-b border-slate-100 flex items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input type="text" placeholder="Buscar por colaborador..." className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm outline-none" />
          </div>
          <button className="flex items-center gap-2 px-3 py-2 text-sm font-semibold border border-slate-200 rounded-md"><Calendar size={16} /> Esta Semana</button>
          <button className="flex items-center gap-2 px-3 py-2 text-sm font-semibold border border-slate-200 rounded-md"><Filter size={16} /> Filtros</button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-5 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Colaborador</th>
                <th className="px-5 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Obra</th>
                <th className="px-5 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-center">Data</th>
                <th className="px-5 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-center">Entrada</th>
                <th className="px-5 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-center">Saída</th>
                <th className="px-5 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-center">Horas</th>
                <th className="px-5 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-center">Extra</th>
                <th className="px-5 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-right">Custo</th>
                <th className="px-5 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest">GPS</th>
                <th className="px-5 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Status</th>
                <th className="px-5 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MOCK_ENTRIES.map(entry => (
                <tr key={entry.id} className="group hover:bg-slate-50/50">
                  <td className="px-5 py-3">
                    <p className="text-sm font-bold text-slate-900">{entry.workerName}</p>
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-xs text-slate-500 bg-slate-50 border border-slate-100 px-2 py-0.5 rounded-full">{entry.project}</span>
                  </td>
                  <td className="px-5 py-3 text-center">
                    <span className="text-sm text-slate-600 font-mono">{entry.date}</span>
                  </td>
                  <td className="px-5 py-3 text-center">
                    <span className="text-sm font-mono font-bold text-slate-700">{entry.clockIn}</span>
                  </td>
                  <td className="px-5 py-3 text-center">
                    <span className="text-sm font-mono font-bold text-slate-700">{entry.clockOut}</span>
                  </td>
                  <td className="px-5 py-3 text-center">
                    <span className="text-sm font-bold text-slate-900 tabular-nums">{entry.hours.toFixed(1)}h</span>
                  </td>
                  <td className="px-5 py-3 text-center">
                    {entry.overtime > 0 ? (
                      <span className="text-xs font-bold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded">+{entry.overtime.toFixed(1)}h</span>
                    ) : (
                      <span className="text-xs text-slate-400">—</span>
                    )}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <span className="text-sm font-bold text-slate-700 tabular-nums">€ {(entry.hours * entry.costPerHour).toFixed(0)}</span>
                  </td>
                  <td className="px-5 py-3">
                    {entry.locationAlert ? (
                      <div className="flex items-center gap-1 text-compliance-amber font-bold text-[10px] uppercase">
                        <AlertTriangle size={14} /> Fora do Raio
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-compliance-green font-bold text-[10px] uppercase">
                        <MapPin size={14} /> OK
                      </div>
                    )}
                  </td>
                  <td className="px-5 py-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-widest ${
                      entry.status === 'APPROVED' ? 'bg-green-50 text-green-700 border-green-200' :
                      entry.status === 'DISPUTED' ? 'bg-red-50 text-red-700 border-red-200' :
                      'bg-slate-100 text-slate-600 border-slate-200'
                    }`}>
                      {entry.status === 'APPROVED' ? 'Aprovado' : entry.status === 'DISPUTED' ? 'Disputado' : 'Pendente'}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-all">
                      <button className="p-1.5 hover:bg-green-100 text-compliance-green rounded-md transition-colors"><Check size={16} /></button>
                      <button className="p-1.5 hover:bg-red-100 text-compliance-red rounded-md transition-colors"><X size={16} /></button>
                    </div>
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

export default TimesheetView;
