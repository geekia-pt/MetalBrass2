
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  FolderOpen,
  HardHat,
  Clock,
  Settings,
  ChevronDown,
  Check,
  Smartphone,
  GitPullRequestArrow,
  Home,
  Download
} from 'lucide-react';
import { Company } from '../types';

interface SidebarProps {
  companies: Company[];
  activeCompany: Company;
  onCompanyChange: (c: Company) => void;
  onSwitchToWorker: () => void;
}

// Added React.PropsWithChildren to ensure the compiler recognizes children passed via JSX
const NavLink = ({ to, icon: Icon, children }: React.PropsWithChildren<{ to: string, icon: any }>) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={`flex items-center gap-3 px-4 py-2.5 rounded-md transition-colors ${
        isActive 
          ? 'bg-industrial-steel text-white' 
          : 'text-slate-400 hover:text-white hover:bg-white/5'
      }`}
    >
      <Icon size={18} />
      <span className="text-sm font-medium">{children}</span>
    </Link>
  );
};

const Sidebar: React.FC<SidebarProps> = ({ companies, activeCompany, onCompanyChange, onSwitchToWorker }) => {
  const [showCompanyMenu, setShowCompanyMenu] = useState(false);

  return (
    <aside className="w-64 bg-industrial-dark flex flex-col h-full border-r border-slate-800 shrink-0">
      {/* Company Switcher */}
      <div className="p-4 border-b border-slate-800">
        <button 
          onClick={() => setShowCompanyMenu(!showCompanyMenu)}
          className="w-full flex items-center justify-between p-2 rounded-md bg-white/5 hover:bg-white/10 transition-all border border-white/10"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-industrial-steel flex items-center justify-center text-white font-bold text-xs uppercase tracking-wider">
              {activeCompany.avatar}
            </div>
            <div className="text-left overflow-hidden">
              <p className="text-white text-xs font-bold truncate leading-tight">{activeCompany.name}</p>
              <p className="text-slate-400 text-[10px] uppercase tracking-tighter">Multi-Tenant</p>
            </div>
          </div>
          <ChevronDown size={16} className={`text-slate-400 transition-transform ${showCompanyMenu ? 'rotate-180' : ''}`} />
        </button>

        {showCompanyMenu && (
          <div className="absolute left-4 top-16 w-56 mt-2 bg-slate-900 border border-slate-800 rounded-lg shadow-2xl z-50 overflow-hidden">
            <div className="p-2 max-h-64 overflow-y-auto no-scrollbar">
              {companies.map(company => (
                <button
                  key={company.id}
                  onClick={() => {
                    onCompanyChange(company);
                    setShowCompanyMenu(false);
                  }}
                  className="w-full flex items-center justify-between p-2 rounded hover:bg-white/5 transition-colors group"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded bg-slate-800 flex items-center justify-center text-white text-[10px] font-bold">
                      {company.avatar}
                    </div>
                    <span className="text-sm text-slate-300 group-hover:text-white truncate">{company.name}</span>
                  </div>
                  {activeCompany.id === company.id && <Check size={14} className="text-compliance-green" />}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        <p className="px-4 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Geral</p>
        <NavLink to="/" icon={LayoutDashboard}>Dashboard</NavLink>
        <NavLink to="/personnel" icon={Users}>Pessoal</NavLink>
        <NavLink to="/projects" icon={HardHat}>Projetos</NavLink>
        <NavLink to="/documents" icon={FolderOpen}>Documentos</NavLink>
        <NavLink to="/timesheet" icon={Clock}>Timesheet</NavLink>
        <NavLink to="/allocations" icon={GitPullRequestArrow}>Alocações</NavLink>
        <NavLink to="/housings" icon={Home}>Alojamentos</NavLink>

        <div className="mt-8">
          <p className="px-4 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Sistema</p>
          <NavLink to="/exports" icon={Download}>Exportações</NavLink>
          <NavLink to="/settings" icon={Settings}>Configurações</NavLink>
        </div>
      </nav>

      {/* Footer / Worker App Switcher */}
      <div className="p-4 border-t border-slate-800">
        <button 
          onClick={onSwitchToWorker}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-md bg-compliance-green hover:bg-green-700 text-white transition-all shadow-lg shadow-green-900/20"
        >
          <Smartphone size={18} />
          <span className="text-sm font-bold">Modo Operário</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
