
import React from 'react';
import { ComplianceStatus } from '../types';

interface BadgeProps {
  status: ComplianceStatus;
}

const Badge: React.FC<BadgeProps> = ({ status }) => {
  const config = {
    [ComplianceStatus.VALID]: {
      label: 'Válido',
      className: 'bg-green-50 text-green-700 border-green-200'
    },
    [ComplianceStatus.EXPIRING]: {
      label: 'Vencendo',
      className: 'bg-amber-50 text-amber-700 border-amber-200'
    },
    [ComplianceStatus.PENDING]: {
      label: 'Pendente',
      className: 'bg-slate-100 text-slate-600 border-slate-200'
    },
    [ComplianceStatus.CRITICAL]: {
      label: 'Crítico',
      className: 'bg-red-50 text-red-700 border-red-200'
    }
  };

  const { label, className } = config[status];

  return (
    <span className={`px-2 py-0.5 rounded text-[11px] font-bold border uppercase tracking-wide ${className}`}>
      {label}
    </span>
  );
};

export default Badge;
