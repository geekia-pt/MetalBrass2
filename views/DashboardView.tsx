
import React, { useState } from 'react';
import { Company, KPIData } from '../types';
import KpiCard from '../components/KpiCard';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AlertCircle, FileText, CheckCircle2, Users, Euro, HardHat, MapPin, ChevronRight } from 'lucide-react';

const MOCK_CHART_DATA = [
  { name: 'Jan', val: 400 },
  { name: 'Fev', val: 300 },
  { name: 'Mar', val: 500 },
  { name: 'Abr', val: 280 },
  { name: 'Mai', val: 590 },
  { name: 'Jun', val: 430 },
];

const ACTIVE_PROJECTS = [
  { id: 'p1', name: 'Renovação Central Hidrelétrica', client: 'EDF France', country: '🇫🇷', workers: 24, maxWorkers: 30, revenue: 48200, progress: 45 },
  { id: 'p2', name: 'Estruturas Metálicas Porto', client: 'GaliPort', country: '🇵🇹', workers: 12, maxWorkers: 15, revenue: 18900, progress: 82 },
  { id: 'p3', name: 'Manutenção Eólica Norte', client: 'IberWind', country: '🇪🇸', workers: 8, maxWorkers: 12, revenue: 0, progress: 0 },
  { id: 'p4', name: 'Oleoduto Trans-Alpino', client: 'Shell Intl', country: '🇧🇪', workers: 30, maxWorkers: 35, revenue: 62100, progress: 15 },
  { id: 'p5', name: 'Ponte Ferroviária Sul', client: 'SNCF', country: '🇫🇷', workers: 18, maxWorkers: 20, revenue: 31400, progress: 60 },
  { id: 'p6', name: 'Refinaria Sines', client: 'Galp Energia', country: '🇵🇹', workers: 45, maxWorkers: 50, revenue: 89300, progress: 35 },
];

type PayrollPeriod = 'day' | 'week' | 'month';
const PAYROLL: Record<PayrollPeriod, string> = { day: '€ 14.2k', week: '€ 71k', month: '€ 312k' };

const DashboardView: React.FC<{ company: Company }> = ({ company }) => {
  const [payrollPeriod, setPayrollPeriod] = useState<PayrollPeriod>('month');

  const kpis: KPIData[] = [
    { title: 'Utilização', value: '92.4%', trend: 2.1, label: 'vs mês passado' },
    { title: 'Funcionários Ativos', value: '687 / 712', trend: 1.8, label: 'em atuação' },
    { title: 'Faturamento Hoje', value: '€ 48.200', trend: 5.2, label: 'vs média diária' },
    { title: 'Compliance Médio', value: '88%', trend: 4.3, label: 'vs trim. ant.' },
    { title: 'Obras Ativas', value: '58 / 60', trend: 3.4, label: 'em andamento' },
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

      {/* KPIs Row - 6 cards including payroll with toggle */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {kpis.map((kpi, i) => <KpiCard key={i} {...kpi} />)}
        {/* Payroll card with period toggle */}
        <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Folha Salarial</p>
          <h3 className="text-2xl font-bold text-slate-900 mb-3 tabular-nums">{PAYROLL[payrollPeriod]}</h3>
          <div className="flex gap-1">
            {(['day', 'week', 'month'] as PayrollPeriod[]).map(p => (
              <button
                key={p}
                onClick={() => setPayrollPeriod(p)}
                className={`px-2 py-0.5 text-[10px] font-bold rounded uppercase tracking-wide transition-colors ${
                  payrollPeriod === p
                    ? 'bg-industrial text-white'
                    : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
              >
                {p === 'day' ? 'Dia' : p === 'week' ? 'Sem' : 'Mês'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Active Projects Row - horizontal scroll */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-bold text-slate-900">Obras Ativas</h2>
          <a href="#/projects" className="text-xs font-bold text-industrial hover:underline flex items-center gap-1">
            Ver todas <ChevronRight size={14} />
          </a>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
          {ACTIVE_PROJECTS.map(project => (
            <a
              key={project.id}
              href={`#/projects/${project.id}`}
              className="min-w-[260px] bg-white rounded-lg border border-slate-200 p-4 shadow-sm hover:shadow-md transition-shadow shrink-0"
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-900 truncate">{project.name}</p>
                  <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">{project.country} {project.client}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 mb-3 text-xs">
                <span className="flex items-center gap-1 text-slate-600">
                  <Users size={12} className="text-slate-400" />
                  <b>{project.workers}</b>/{project.maxWorkers}
                </span>
                <span className="flex items-center gap-1 text-slate-600">
                  <Euro size={12} className="text-slate-400" />
                  <b>€ {(project.revenue / 1000).toFixed(1)}k</b>
                </span>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] font-bold text-slate-400">
                  <span>{project.progress}%</span>
                </div>
                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-industrial h-full rounded-full transition-all" style={{ width: `${project.progress}%` }} />
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Chart + Alerts */}
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
