
import React from 'react';
import { Company, KPIData } from '../types';
import KpiCard from '../components/KpiCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { AlertCircle, FileText, CheckCircle2 } from 'lucide-react';

const MOCK_CHART_DATA = [
  { name: 'Jan', val: 400 },
  { name: 'Fev', val: 300 },
  { name: 'Mar', val: 500 },
  { name: 'Abr', val: 280 },
  { name: 'Mai', val: 590 },
  { name: 'Jun', val: 430 },
];

const DashboardView: React.FC<{ company: Company }> = ({ company }) => {
  const kpis: KPIData[] = [
    { title: 'Utilização', value: '92.4%', trend: 2.1, label: 'vs mês passado' },
    { title: 'Custos Diretos', value: '€ 1.2M', trend: -0.5, label: 'vs orçamento' },
    { title: 'Compliance Médio', value: '88%', trend: 4.3, label: 'vs trim. ant.' },
    { title: 'Novas Alocações', value: '142', trend: 12, label: 'esta semana' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-sm text-slate-500">Monitoramento global de <span className="font-semibold text-slate-700">{company.name}</span></p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 text-sm font-semibold border border-slate-200 rounded-md bg-white hover:bg-slate-50 transition-colors">Exportar Relatório</button>
          <button className="px-4 py-2 text-sm font-semibold bg-industrial text-white rounded-md hover:bg-slate-800 transition-colors">Nova Alocação</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi, i) => <KpiCard key={i} {...kpi} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
          <h2 className="text-lg font-bold text-slate-900 mb-6">Volume de Produção</h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={MOCK_CHART_DATA}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                <Tooltip 
                  cursor={{ fill: '#f8fafc' }}
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="val" fill="#0f172a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm flex flex-col">
          <h2 className="text-lg font-bold text-slate-900 mb-4">Alertas de Compliance</h2>
          <div className="flex-1 space-y-4">
            <div className="p-3 bg-red-50 border-l-4 border-compliance-red rounded">
              <div className="flex items-start gap-3">
                <AlertCircle className="text-compliance-red shrink-0" size={18} />
                <div>
                  <p className="text-xs font-bold text-red-900 uppercase">Documentos Vencidos</p>
                  <p className="text-sm text-red-700">12 operários na Obra Vale estão com A1 expirado.</p>
                </div>
              </div>
            </div>
            <div className="p-3 bg-amber-50 border-l-4 border-compliance-amber rounded">
              <div className="flex items-start gap-3">
                <FileText className="text-compliance-amber shrink-0" size={18} />
                <div>
                  <p className="text-xs font-bold text-amber-900 uppercase">Aguardando Validação</p>
                  <p className="text-sm text-amber-700">8 novos envios de NIF pendentes de OCR.</p>
                </div>
              </div>
            </div>
            <div className="p-3 bg-green-50 border-l-4 border-compliance-green rounded">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="text-compliance-green shrink-0" size={18} />
                <div>
                  <p className="text-xs font-bold text-green-900 uppercase">Check-in Efetuado</p>
                  <p className="text-sm text-green-700">Toda equipe Metalbras-Central sincronizada.</p>
                </div>
              </div>
            </div>
          </div>
          <button className="mt-4 w-full py-2 text-sm font-bold text-industrial-steel hover:bg-slate-50 border border-slate-100 rounded transition-colors">Ver todos os alertas</button>
        </div>
      </div>
    </div>
  );
};

export default DashboardView;
