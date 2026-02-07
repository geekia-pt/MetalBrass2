
import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { KPIData } from '../types';

const KpiCard: React.FC<KPIData> = ({ title, value, trend, label }) => {
  const isPositive = trend >= 0;

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow">
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">{title}</p>
      <h3 className="text-3xl font-bold text-slate-900 mb-3 tabular-nums">{value}</h3>
      <div className="flex items-center gap-1.5">
        <div className={`flex items-center text-xs font-bold px-1.5 py-0.5 rounded ${
          isPositive ? 'bg-green-100 text-compliance-green' : 'bg-red-100 text-compliance-red'
        }`}>
          {isPositive ? <TrendingUp size={12} className="mr-1" /> : <TrendingDown size={12} className="mr-1" />}
          {Math.abs(trend)}%
        </div>
        <span className="text-xs text-slate-400 font-medium">{label}</span>
      </div>
    </div>
  );
};

export default KpiCard;
