
import React, { useState } from 'react';
import { Users, ShieldCheck, Home, FileText, Plug, Plus, Edit3, Trash2 } from 'lucide-react';

type SettingsTab = 'users' | 'compliance' | 'housing' | 'templates' | 'integrations';

const TABS: { id: SettingsTab; label: string; icon: React.ElementType }[] = [
  { id: 'users', label: 'Utilizadores', icon: Users },
  { id: 'compliance', label: 'Compliance', icon: ShieldCheck },
  { id: 'housing', label: 'Alojamento', icon: Home },
  { id: 'templates', label: 'Templates', icon: FileText },
  { id: 'integrations', label: 'Integrações', icon: Plug },
];

const MOCK_USERS = [
  { name: 'Walter Sousa', email: 'walter@metalbras.pt', role: 'Admin', active: true },
  { name: 'Maria Silva', email: 'maria@metalbras.pt', role: 'Manager', active: true },
  { name: 'João Costa', email: 'joao@metalbras.pt', role: 'Validador', active: true },
  { name: 'Ana Ferreira', email: 'ana@metalbras.pt', role: 'Viewer', active: false },
];

const COMPLIANCE_RULES = [
  { country: 'Portugal', docs: ['Passaporte', 'Cartão Cidadão', 'Contrato'], alertDays: 30 },
  { country: 'França', docs: ['Passaporte', 'Certificado A1', 'Contrato', 'Ficha Médica'], alertDays: 45 },
  { country: 'Bélgica', docs: ['Passaporte', 'Certificado A1', 'ONSS', 'Contrato'], alertDays: 60 },
  { country: 'Espanha', docs: ['Passaporte', 'Certificado A1', 'Contrato'], alertDays: 30 },
];

const TEMPLATES_LIST = [
  { name: 'Declaração ONSS', type: 'Bélgica', updated: '2024-02-15' },
  { name: 'DMR Segurança Social', type: 'Portugal', updated: '2024-01-20' },
  { name: 'Modelo 10 Finanças', type: 'Portugal', updated: '2024-01-10' },
  { name: 'Email Boas-Vindas', type: 'Interno', updated: '2024-03-01' },
  { name: 'WhatsApp Pedido Docs', type: 'Interno', updated: '2024-02-28' },
];

const SettingsView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>('users');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Configurações</h1>
        <p className="text-sm text-slate-500">Gestão do tenant, permissões e integrações</p>
      </div>

      <div className="flex gap-6 min-h-[600px]">
        {/* Side nav */}
        <nav className="w-56 shrink-0 space-y-1">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-industrial text-white'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <tab.icon size={16} />
              {tab.label}
            </button>
          ))}
        </nav>

        {/* Content */}
        <div className="flex-1 bg-white rounded-lg border border-slate-200 shadow-sm p-6">
          {activeTab === 'users' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900">Utilizadores & Permissões</h2>
                <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold bg-industrial text-white rounded-md">
                  <Plus size={14} /> Convidar
                </button>
              </div>
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Nome</th>
                    <th className="px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Email</th>
                    <th className="px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Role</th>
                    <th className="px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Status</th>
                    <th className="px-4 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {MOCK_USERS.map((u, i) => (
                    <tr key={i} className="hover:bg-slate-50/50">
                      <td className="px-4 py-3 text-sm font-bold text-slate-900">{u.name}</td>
                      <td className="px-4 py-3 text-sm text-slate-600">{u.email}</td>
                      <td className="px-4 py-3">
                        <span className="text-[10px] font-bold text-industrial bg-slate-100 px-2 py-0.5 rounded uppercase">{u.role}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className={`w-2 h-2 rounded-full inline-block ${u.active ? 'bg-compliance-green' : 'bg-slate-300'}`} />
                        <span className="text-xs text-slate-500 ml-1.5">{u.active ? 'Ativo' : 'Inativo'}</span>
                      </td>
                      <td className="px-4 py-3 flex gap-1">
                        <button className="p-1 hover:bg-slate-100 rounded text-slate-400"><Edit3 size={14} /></button>
                        <button className="p-1 hover:bg-red-50 rounded text-slate-400 hover:text-red-500"><Trash2 size={14} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'compliance' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900">Regras de Compliance por País</h2>
                <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold bg-industrial text-white rounded-md">
                  <Plus size={14} /> Adicionar País
                </button>
              </div>
              <div className="space-y-3">
                {COMPLIANCE_RULES.map((rule, i) => (
                  <div key={i} className="border border-slate-200 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-sm font-bold text-slate-900">{rule.country}</h3>
                      <span className="text-xs text-slate-500">Alerta: <b>{rule.alertDays} dias</b> antes do vencimento</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {rule.docs.map((doc, j) => (
                        <span key={j} className="px-2 py-0.5 text-[10px] font-bold bg-slate-100 text-slate-600 rounded border border-slate-200 uppercase tracking-wide">
                          {doc}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'housing' && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-slate-900">Regras de Alojamento</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Custo Máximo por Pessoa/Mês (€)</label>
                  <input type="number" defaultValue={400} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-sm" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Ocupação Máxima por Quarto</label>
                  <input type="number" defaultValue={2} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-sm" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Raio Máximo Alojamento-Obra (km)</label>
                  <input type="number" defaultValue={15} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-sm" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Dias Aviso Check-out</label>
                  <input type="number" defaultValue={7} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-md text-sm" />
                </div>
              </div>
              <button className="px-4 py-2 text-sm font-bold bg-industrial text-white rounded-md mt-2">Guardar Alterações</button>
            </div>
          )}

          {activeTab === 'templates' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-slate-900">Templates de Documentos</h2>
                <button className="flex items-center gap-2 px-3 py-1.5 text-xs font-bold bg-industrial text-white rounded-md">
                  <Plus size={14} /> Novo Template
                </button>
              </div>
              <div className="space-y-2">
                {TEMPLATES_LIST.map((t, i) => (
                  <div key={i} className="flex items-center justify-between p-3 border border-slate-200 rounded-lg hover:bg-slate-50/50">
                    <div className="flex items-center gap-3">
                      <FileText size={18} className="text-slate-400" />
                      <div>
                        <p className="text-sm font-bold text-slate-900">{t.name}</p>
                        <p className="text-xs text-slate-500">{t.type} • Atualizado: {t.updated}</p>
                      </div>
                    </div>
                    <div className="flex gap-1">
                      <button className="p-1.5 hover:bg-slate-100 rounded text-slate-400"><Edit3 size={14} /></button>
                      <button className="p-1.5 hover:bg-red-50 rounded text-slate-400 hover:text-red-500"><Trash2 size={14} /></button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'integrations' && (
            <div className="space-y-4">
              <h2 className="text-lg font-bold text-slate-900">Integrações</h2>
              <div className="space-y-3">
                <div className="border border-slate-200 rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Primavera ERP</h3>
                    <p className="text-xs text-slate-500">Exportação automática de timesheets e faturação</p>
                  </div>
                  <span className="flex items-center gap-1.5 text-xs font-bold text-compliance-green"><span className="w-2 h-2 rounded-full bg-compliance-green" /> Conectado</span>
                </div>
                <div className="border border-slate-200 rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">WhatsApp (OpenClaw)</h3>
                    <p className="text-xs text-slate-500">Captação de documentos e comunicação</p>
                  </div>
                  <span className="flex items-center gap-1.5 text-xs font-bold text-compliance-green"><span className="w-2 h-2 rounded-full bg-compliance-green" /> Conectado</span>
                </div>
                <div className="border border-slate-200 rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Kimi Claw (AI)</h3>
                    <p className="text-xs text-slate-500">Orquestrador central, OCR e matching</p>
                  </div>
                  <span className="flex items-center gap-1.5 text-xs font-bold text-compliance-green"><span className="w-2 h-2 rounded-full bg-compliance-green" /> Conectado</span>
                </div>
                <div className="border border-slate-200 rounded-lg p-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">Ollama / Qwen 2.5</h3>
                    <p className="text-xs text-slate-500">LLM local para OCR e chatbot</p>
                  </div>
                  <span className="flex items-center gap-1.5 text-xs font-bold text-compliance-green"><span className="w-2 h-2 rounded-full bg-compliance-green" /> Conectado</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
