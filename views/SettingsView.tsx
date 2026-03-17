
import React from 'react';
import { Settings, Building2, Users, ShieldCheck, FileText, Plug, Home } from 'lucide-react';

const SECTIONS = [
  { icon: Building2, title: 'Empresa / Tenant', desc: 'Nome, logo, dados fiscais da empresa', status: 'config' },
  { icon: Users, title: 'Utilizadores & Permissões', desc: 'Gestão de acessos e roles (RBAC)', status: 'config' },
  { icon: ShieldCheck, title: 'Regras de Compliance', desc: 'Documentos obrigatórios por país', status: 'config' },
  { icon: Plug, title: 'Integração Primavera', desc: 'Códigos, mapeamentos e export automático', status: 'pending' },
  { icon: FileText, title: 'Templates de Declarações', desc: 'ONSS, Segurança Social, Finanças', status: 'pending' },
  { icon: Home, title: 'Alojamento', desc: 'Regras de alocação de hospedagem', status: 'pending' },
];

const SettingsView: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Configurações</h1>
          <p className="text-sm text-slate-500">Gestão do tenant, permissões e integrações</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {SECTIONS.map((section, i) => (
          <button
            key={i}
            className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm hover:shadow-md transition-shadow text-left group"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-500 group-hover:bg-industrial group-hover:text-white transition-colors shrink-0">
                <section.icon size={20} />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">{section.title}</h3>
                <p className="text-xs text-slate-500 mt-1">{section.desc}</p>
                {section.status === 'pending' && (
                  <span className="inline-block mt-2 px-2 py-0.5 text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 rounded uppercase tracking-widest">
                    Em Desenvolvimento
                  </span>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default SettingsView;
