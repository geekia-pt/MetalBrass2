
import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  HardHat, ArrowLeft, Users, Euro, TrendingUp, Calendar, 
  MapPin, CheckCircle2, MoreVertical, Search, Plus, UserPlus
} from 'lucide-react';
import KpiCard from '../components/KpiCard';
import { ComplianceStatus } from '../types';
import Badge from '../components/Badge';

const PROJECTS_DATA: Record<string, { name: string; client: string; location: string; country: string; status: string; statusColor: string; margin: string; budget: string; hours: string; compliance: string; teamMembers: { name: string; role: string; status: ComplianceStatus }[] }> = {
  'p1': {
    name: 'Renovação Central Hidrelétrica', client: 'EDF France', location: 'Lyon, França', country: 'FR',
    status: 'Ativo', statusColor: 'bg-green-100 text-green-700 border-green-200',
    margin: '18.2%', budget: '€ 452k', hours: '1,240h', compliance: '94%',
    teamMembers: [
      { name: 'Ricardo Santos', role: 'Soldador TIG', status: ComplianceStatus.VALID },
      { name: 'Ana Oliveira', role: 'Eng. Mecânica', status: ComplianceStatus.VALID },
      { name: 'Carlos Mendes', role: 'Ajudante', status: ComplianceStatus.EXPIRING },
      { name: 'Juliana Lima', role: 'Ponte Rolante', status: ComplianceStatus.PENDING },
    ]
  },
  'p2': {
    name: 'Estruturas Metálicas Porto', client: 'GaliPort', location: 'Porto, Portugal', country: 'PT',
    status: 'Ativo', statusColor: 'bg-green-100 text-green-700 border-green-200',
    margin: '22.5%', budget: '€ 320k', hours: '890h', compliance: '97%',
    teamMembers: [
      { name: 'Marcos Silva', role: 'Serralheiro', status: ComplianceStatus.VALID },
      { name: 'Pedro Alves', role: 'Soldador MIG', status: ComplianceStatus.VALID },
    ]
  },
  'p3': {
    name: 'Manutenção Eólica Norte', client: 'IberWind', location: 'Bilbao, Espanha', country: 'ES',
    status: 'Planeamento', statusColor: 'bg-slate-100 text-slate-600 border-slate-200',
    margin: '15.0%', budget: '€ 0', hours: '0h', compliance: '—',
    teamMembers: []
  },
  'p4': {
    name: 'Oleoduto Trans-Alpino', client: 'Shell Intl', location: 'Bruxelas, Bélgica', country: 'BE',
    status: 'Pausado', statusColor: 'bg-amber-100 text-amber-700 border-amber-200',
    margin: '12.8%', budget: '€ 280k', hours: '520h', compliance: '86%',
    teamMembers: [
      { name: 'Ricardo Santos', role: 'Soldador TIG', status: ComplianceStatus.VALID },
      { name: 'Carlos Mendes', role: 'Ajudante', status: ComplianceStatus.CRITICAL },
    ]
  },
};

const ProjectDetailView: React.FC = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState<'cockpit' | 'team' | 'logistics'>('cockpit');

  const project = PROJECTS_DATA[id || 'p1'] || PROJECTS_DATA['p1'];
  const teamMembers = project.teamMembers;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link to="/projects" className="p-2 hover:bg-slate-200 rounded-md transition-colors text-slate-500">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-900">{project.name}</h1>
            <span className={`px-2 py-0.5 text-[10px] font-bold rounded border uppercase tracking-tighter ${project.statusColor}`}>{project.status}</span>
          </div>
          <p className="text-sm text-slate-500 uppercase font-bold tracking-widest flex items-center gap-2">
            <MapPin size={12} /> {project.location} • <span className="text-industrial">{project.client}</span>
          </p>
        </div>
        <div className="ml-auto flex gap-2">
           <button className="px-4 py-2 text-sm font-bold border border-slate-200 rounded-md hover:bg-slate-50">Sincronizar GHL</button>
           <button className="px-4 py-2 text-sm font-bold bg-industrial text-white rounded-md hover:bg-slate-800">Nova Alocação</button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 gap-8">
        {[
          { id: 'cockpit', label: 'Cockpit do Projeto', icon: TrendingUp },
          { id: 'team', label: 'Equipe Alocada', icon: Users },
          { id: 'logistics', label: 'Logística & Materiais', icon: HardHat },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 pb-3 text-sm font-bold transition-all relative ${
              activeTab === tab.id ? 'text-industrial' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
            {activeTab === tab.id && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-industrial" />}
          </button>
        ))}
      </div>

      {activeTab === 'cockpit' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <KpiCard title="Margem Atual" value={project.margin} trend={1.2} label="vs meta" />
            <KpiCard title="Budget Gasto" value={project.budget} trend={5.4} label="da verba total" />
            <KpiCard title="Horas Alocadas" value={project.hours} trend={-2} label="esta semana" />
            <KpiCard title="Compliance Equipe" value={project.compliance} trend={8} label="docs válidos" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm">
              <h3 className="text-base font-bold text-slate-900 mb-4">Próximos Marcos</h3>
              <div className="space-y-4">
                {[
                  { title: 'Conclusão da Soldagem Nível 1', date: '15 Jan, 2024', status: 'done' },
                  { title: 'Teste de Carga de Estrutura', date: '22 Jan, 2024', status: 'pending' },
                  { title: 'Inspecção Técnica Final', date: '02 Fev, 2024', status: 'pending' },
                ].map((milestone, i) => (
                  <div key={i} className="flex items-center gap-4 group">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${milestone.status === 'done' ? 'bg-green-100 text-compliance-green' : 'bg-slate-100 text-slate-400'}`}>
                      {milestone.status === 'done' ? <CheckCircle2 size={16} /> : <div className="w-2 h-2 rounded-full bg-slate-300" />}
                    </div>
                    <div className="flex-1 border-b border-slate-50 pb-2">
                      <p className={`text-sm font-bold ${milestone.status === 'done' ? 'text-slate-900' : 'text-slate-500'}`}>{milestone.title}</p>
                      <p className="text-[11px] font-medium text-slate-400">{milestone.date}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-white rounded-lg border border-slate-200 p-6 shadow-sm flex flex-col">
              <h3 className="text-base font-bold text-slate-900 mb-4">Localização da Obra</h3>
              <div className="flex-1 bg-slate-100 rounded border border-slate-200 flex items-center justify-center overflow-hidden">
                 <div className="text-center">
                    <MapPin className="mx-auto text-industrial mb-2" size={32} />
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Geo-Fence Ativo</p>
                    <p className="text-[10px] text-slate-400">Raio de 500m • Lyon South</p>
                 </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'team' && (
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-4">
               <div className="relative">
                 <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
                 <input type="text" placeholder="Filtrar equipe..." className="pl-9 pr-4 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-md" />
               </div>
            </div>
            <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold bg-industrial text-white rounded-md">
              <UserPlus size={14} /> Adicionar Membro
            </button>
          </div>
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Membro</th>
                <th className="px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Função</th>
                <th className="px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Compliance</th>
                <th className="px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {teamMembers.map((member, i) => (
                <tr key={i} className="hover:bg-slate-50/50">
                  <td className="px-6 py-3">
                    <p className="text-sm font-bold text-slate-900">{member.name}</p>
                  </td>
                  <td className="px-6 py-3 text-sm text-slate-600 font-medium">{member.role}</td>
                  <td className="px-6 py-3">
                    <Badge status={member.status} />
                  </td>
                  <td className="px-6 py-3 text-right">
                    <button className="text-slate-400 hover:text-industrial"><MoreVertical size={16} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ProjectDetailView;
