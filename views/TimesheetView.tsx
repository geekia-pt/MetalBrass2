
import React from 'react';
import { TimeEntry } from '../types';
import { Clock, Check, X, AlertTriangle, MapPin, Search, Filter, Calendar } from 'lucide-react';

const MOCK_ENTRIES: TimeEntry[] = [
  { id: 't1', workerId: 'w1', workerName: 'Ricardo Santos', date: '2023-11-20', hours: 8.5, status: 'PENDING', locationAlert: false },
  { id: 't2', workerId: 'w1', workerName: 'Ricardo Santos', date: '2023-11-21', hours: 9.0, status: 'PENDING', locationAlert: true },
  { id: 't3', workerId: 'w2', workerName: 'Ana Oliveira', date: '2023-11-20', hours: 8.0, status: 'APPROVED', locationAlert: false },
  { id: 't4', workerId: 'w3', workerName: 'Carlos Mendes', date: '2023-11-20', hours: 7.5, status: 'PENDING', locationAlert: false },
  { id: 't5', workerId: 'w4', workerName: 'Juliana Lima', date: '2023-11-20', hours: 8.0, status: 'DISPUTED', locationAlert: false },
];

const TimesheetView: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Módulo de Timesheet</h1>
          <p className="text-sm text-slate-500">Aprovação de horas e verificação de presença</p>
        </div>
        <div className="flex gap-2">
           <button className="px-4 py-2 text-sm font-bold border border-slate-200 rounded-md bg-white hover:bg-slate-50">Exportar Primavera</button>
           <button className="px-4 py-2 text-sm font-bold bg-industrial text-white rounded-md hover:bg-slate-800">Aprovar Todos (Válidos)</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Total Pendente</p>
           <h4 className="text-2xl font-bold text-slate-900">342 Horas</h4>
        </div>
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm border-l-4 border-l-compliance-amber">
           <p className="text-[10px] font-bold text-amber-600 uppercase tracking-widest mb-1">Alertas de GPS</p>
           <h4 className="text-2xl font-bold text-slate-900">12 Ocorrências</h4>
        </div>
        <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
           <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Custo Projetado</p>
           <h4 className="text-2xl font-bold text-slate-900">€ 14,240</h4>
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
                <th className="px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Colaborador</th>
                <th className="px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-center">Data</th>
                <th className="px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-center">Horas</th>
                <th className="px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Status</th>
                <th className="px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Verificação</th>
                <th className="px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MOCK_ENTRIES.map(entry => (
                <tr key={entry.id} className="hover:bg-slate-50/50">
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-slate-900">{entry.workerName}</p>
                    <p className="text-[10px] text-slate-400 font-medium">Obra: Lyon South</p>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-sm text-slate-600 font-mono">{entry.date}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-sm font-bold text-slate-900 tabular-nums">{entry.hours.toFixed(1)}h</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border uppercase tracking-widest ${
                      entry.status === 'APPROVED' ? 'bg-green-50 text-green-700 border-green-200' :
                      entry.status === 'DISPUTED' ? 'bg-red-50 text-red-700 border-red-200' :
                      'bg-slate-100 text-slate-600 border-slate-200'
                    }`}>
                      {entry.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {entry.locationAlert ? (
                      <div className="flex items-center gap-1.5 text-compliance-amber font-bold text-[10px] uppercase">
                        <AlertTriangle size={14} /> Fora do Raio
                      </div>
                    ) : (
                      <div className="flex items-center gap-1.5 text-compliance-green font-bold text-[10px] uppercase">
                        <MapPin size={14} /> GPS OK
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 group-hover:block transition-all">
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
