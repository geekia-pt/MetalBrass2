
import React, { useState } from 'react';
import { Search, Filter, UserCheck, UserX, Eye, X, MessageSquare, FileText, CheckCircle2, Clock, AlertTriangle, Loader2, ChevronRight, Phone, Mail, MapPin, Briefcase, GraduationCap, Shield, Heart } from 'lucide-react';

type CandidateStatus = 'bot_active' | 'data_received' | 'validating' | 'validated' | 'rejected';

interface CandidateDoc {
  type: string;
  number: string;
  expiry: string;
  status: 'received' | 'ocr_processing' | 'verified' | 'missing' | 'rejected';
  fileName?: string;
}

interface Certification {
  name: string;
  issuer: string;
  date: string;
  expiry: string;
  status: 'valid' | 'expired';
}

interface WorkHistory {
  company: string;
  country: string;
  period: string;
  role: string;
}

interface Candidate {
  id: string;
  status: CandidateStatus;
  source: string;
  fullName: string;
  dateOfBirth: string;
  maritalStatus: string;
  nationality: string;
  nif: string;
  ssNumber: string;
  phone: string;
  email: string;
  address: string;
  skills: string[];
  documents: CandidateDoc[];
  certifications: Certification[];
  history: WorkHistory[];
  createdAt: string;
  docsReceived: number;
  docsTotal: number;
}

const MOCK_CANDIDATES: Candidate[] = [
  {
    id: 'c1', status: 'validating', source: 'WhatsApp Bot', fullName: 'Miguel Ferreira', dateOfBirth: '1988-05-12', maritalStatus: 'Casado', nationality: 'Portuguesa', nif: '234.567.890', ssNumber: '12345678901', phone: '+351 916 234 567', email: 'miguel.ferreira@gmail.com', address: 'Rua das Flores 45, 4000 Porto', skills: ['TIG', 'MIG', 'ASME'], createdAt: '2024-03-15', docsReceived: 8, docsTotal: 10,
    documents: [
      { type: 'Passaporte', number: 'PT-234567890', expiry: '2028-05-12', status: 'verified', fileName: 'passaporte_miguel.pdf' },
      { type: 'Cartão Cidadão', number: 'CC-234567890', expiry: '2029-01-15', status: 'verified', fileName: 'cc_miguel.pdf' },
      { type: 'Certificado A1', number: 'A1-PT-2024-055', expiry: '2024-09-15', status: 'verified', fileName: 'a1_miguel.pdf' },
      { type: 'Seguro Saúde', number: 'SEG-2024-001', expiry: '2025-03-15', status: 'verified' },
      { type: 'Certificado Aptidão Saúde', number: 'CAS-2024-088', expiry: '2025-03-01', status: 'verified' },
      { type: 'Diploma Segurança Trabalho', number: 'DST-2024-041', expiry: '2026-01-01', status: 'verified' },
      { type: 'Diploma Trabalho em Altura', number: 'DTA-2024-019', expiry: '2025-06-01', status: 'ocr_processing' },
      { type: 'Certidão Criminal', number: 'CC-2024-312', expiry: '2024-09-15', status: 'verified' },
      { type: 'IBAN / Dados Bancários', number: '', expiry: '', status: 'missing' },
      { type: 'Foto 3x4', number: '', expiry: '', status: 'missing' },
    ],
    certifications: [
      { name: 'Soldador TIG (EN ISO 9606-1)', issuer: 'ISQ Portugal', date: '2022-03-10', expiry: '2025-03-10', status: 'valid' },
      { name: 'Soldador MIG/MAG', issuer: 'ISQ Portugal', date: '2021-06-15', expiry: '2024-06-15', status: 'valid' },
      { name: 'ASME IX', issuer: 'Bureau Veritas', date: '2023-01-20', expiry: '2026-01-20', status: 'valid' },
    ],
    history: [
      { company: 'Metalogalva', country: 'PT', period: '2020-2023', role: 'Soldador TIG' },
      { company: 'Martifer', country: 'PT', period: '2018-2020', role: 'Soldador MIG' },
      { company: 'EDF Energy', country: 'FR', period: '2017-2018', role: 'Soldador (destacamento)' },
    ],
  },
  {
    id: 'c2', status: 'bot_active', source: 'WhatsApp Bot', fullName: 'Andriy Kovalenko', dateOfBirth: '1992-11-03', maritalStatus: 'Solteiro', nationality: 'Ucraniana', nif: '', ssNumber: '', phone: '+380 67 123 4567', email: '', address: 'Lviv, Ucrânia', skills: ['TIG'], createdAt: '2024-03-16', docsReceived: 2, docsTotal: 10,
    documents: [
      { type: 'Passaporte', number: 'UA-789123456', expiry: '2027-08-20', status: 'verified' },
      { type: 'Certificado A1', number: '', expiry: '', status: 'missing' },
      { type: 'Cartão Cidadão', number: '', expiry: '', status: 'missing' },
      { type: 'Seguro Saúde', number: '', expiry: '', status: 'missing' },
      { type: 'Certificado Aptidão Saúde', number: '', expiry: '', status: 'missing' },
      { type: 'Diploma Segurança Trabalho', number: '', expiry: '', status: 'missing' },
      { type: 'Certidão Criminal', number: '', expiry: '', status: 'missing' },
      { type: 'CV / Histórico', number: '', expiry: '', status: 'received' },
      { type: 'IBAN / Dados Bancários', number: '', expiry: '', status: 'missing' },
      { type: 'Foto 3x4', number: '', expiry: '', status: 'missing' },
    ],
    certifications: [{ name: 'Soldador TIG', issuer: 'Inst. Kiev', date: '2020-05-01', expiry: '2023-05-01', status: 'expired' }],
    history: [{ company: 'Energoatom', country: 'UA', period: '2019-2024', role: 'Welder' }],
  },
  {
    id: 'c3', status: 'data_received', source: 'WhatsApp Bot', fullName: 'João Baptista', dateOfBirth: '1995-07-22', maritalStatus: 'Solteiro', nationality: 'Brasileira', nif: '345.678.901', ssNumber: '', phone: '+55 11 98765 4321', email: 'joao.baptista@outlook.com', address: 'São Paulo, Brasil', skills: ['Serralharia', 'Montagem'], createdAt: '2024-03-14', docsReceived: 6, docsTotal: 10,
    documents: [
      { type: 'Passaporte', number: 'BR-567890123', expiry: '2029-07-22', status: 'verified' },
      { type: 'Certificado A1', number: '', expiry: '', status: 'missing' },
      { type: 'Cartão Cidadão', number: '', expiry: '', status: 'missing' },
      { type: 'Seguro Saúde', number: 'SEG-BR-001', expiry: '2025-01-01', status: 'verified' },
      { type: 'Certificado Aptidão Saúde', number: 'CAS-BR-042', expiry: '2025-07-22', status: 'verified' },
      { type: 'Diploma Segurança Trabalho', number: 'NR-35', expiry: '2025-12-01', status: 'verified' },
      { type: 'Certidão Criminal', number: 'CC-BR-2024', expiry: '2024-09-14', status: 'verified' },
      { type: 'CV / Histórico', number: '', expiry: '', status: 'received' },
      { type: 'IBAN / Dados Bancários', number: '', expiry: '', status: 'missing' },
      { type: 'Foto 3x4', number: '', expiry: '', status: 'missing' },
    ],
    certifications: [
      { name: 'Serralheiro Industrial', issuer: 'SENAI', date: '2018-12-01', expiry: '2024-12-01', status: 'valid' },
    ],
    history: [
      { company: 'Gerdau', country: 'BR', period: '2019-2023', role: 'Serralheiro' },
      { company: 'CSN', country: 'BR', period: '2017-2019', role: 'Ajudante' },
    ],
  },
  {
    id: 'c4', status: 'validated', source: 'WhatsApp Bot', fullName: 'Pierre Dubois', dateOfBirth: '1985-02-18', maritalStatus: 'Casado', nationality: 'Francesa', nif: '456.789.012', ssNumber: '98765432101', phone: '+33 6 12 34 56 78', email: 'p.dubois@gmail.com', address: 'Lyon, França', skills: ['TIG', 'MIG', 'Ponte Rolante'], createdAt: '2024-03-10', docsReceived: 10, docsTotal: 10,
    documents: [
      { type: 'Passaporte', number: 'FR-456789012', expiry: '2030-02-18', status: 'verified' },
      { type: 'Cartão Cidadão', number: 'CNI-456789012', expiry: '2029-06-01', status: 'verified' },
      { type: 'Certificado A1', number: 'A1-FR-2024-112', expiry: '2025-02-18', status: 'verified' },
      { type: 'Seguro Saúde', number: 'CPAM-2024-456', expiry: '2025-12-31', status: 'verified' },
      { type: 'Certificado Aptidão Saúde', number: 'APT-FR-2024', expiry: '2025-02-18', status: 'verified' },
      { type: 'Diploma Segurança Trabalho', number: 'CACES-2024', expiry: '2029-01-01', status: 'verified' },
      { type: 'Diploma Trabalho em Altura', number: 'HAU-FR-2024', expiry: '2026-06-01', status: 'verified' },
      { type: 'Certidão Criminal', number: 'B3-FR-2024', expiry: '2024-09-10', status: 'verified' },
      { type: 'IBAN / Dados Bancários', number: 'FR76...', expiry: '', status: 'verified' },
      { type: 'Foto 3x4', number: '', expiry: '', status: 'verified' },
    ],
    certifications: [
      { name: 'Soldador TIG (EN ISO 9606-1)', issuer: 'AFNOR', date: '2023-02-01', expiry: '2026-02-01', status: 'valid' },
      { name: 'CACES R489 (Ponte Rolante)', issuer: 'AFNOR', date: '2022-06-15', expiry: '2027-06-15', status: 'valid' },
    ],
    history: [
      { company: 'Bouygues Construction', country: 'FR', period: '2015-2024', role: 'Chef Soudeur' },
      { company: 'Eiffage', country: 'FR', period: '2010-2015', role: 'Soudeur TIG' },
    ],
  },
  {
    id: 'c5', status: 'rejected', source: 'Manual', fullName: 'Henrique Vaz', dateOfBirth: '1999-09-30', maritalStatus: 'Solteiro', nationality: 'Portuguesa', nif: '567.890.123', ssNumber: '', phone: '+351 913 456 789', email: 'h.vaz@gmail.com', address: 'Lisboa, Portugal', skills: ['Ajudante'], createdAt: '2024-03-08', docsReceived: 3, docsTotal: 10,
    documents: [
      { type: 'Passaporte', number: 'PT-567890123', expiry: '2026-09-30', status: 'verified' },
      { type: 'Cartão Cidadão', number: 'CC-567890123', expiry: '2028-03-15', status: 'verified' },
      { type: 'CV / Histórico', number: '', expiry: '', status: 'received' },
    ],
    certifications: [],
    history: [{ company: 'Freelancer', country: 'PT', period: '2022-2024', role: 'Ajudante' }],
  },
];

const STATUS_CONFIG: Record<CandidateStatus, { icon: React.ElementType; label: string; className: string }> = {
  bot_active: { icon: Loader2, label: 'Bot Ativo', className: 'text-blue-600 bg-blue-50 border-blue-200' },
  data_received: { icon: FileText, label: 'Dados Recebidos', className: 'text-amber-600 bg-amber-50 border-amber-200' },
  validating: { icon: Clock, label: 'Em Validação', className: 'text-purple-600 bg-purple-50 border-purple-200' },
  validated: { icon: CheckCircle2, label: 'Validado', className: 'text-green-700 bg-green-50 border-green-200' },
  rejected: { icon: UserX, label: 'Rejeitado', className: 'text-red-600 bg-red-50 border-red-200' },
};

const DOC_STATUS_ICON: Record<string, { className: string }> = {
  verified: { className: 'text-compliance-green' },
  received: { className: 'text-blue-500' },
  ocr_processing: { className: 'text-amber-500 animate-spin' },
  missing: { className: 'text-slate-300' },
  rejected: { className: 'text-compliance-red' },
};

const CandidatesView: React.FC = () => {
  const [filter, setFilter] = useState<CandidateStatus | 'all'>('all');
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [activeTab, setActiveTab] = useState<'dados' | 'docs' | 'certs' | 'history'>('dados');

  const filtered = filter === 'all' ? MOCK_CANDIDATES : MOCK_CANDIDATES.filter(c => c.status === filter);
  const counts = {
    all: MOCK_CANDIDATES.length,
    bot_active: MOCK_CANDIDATES.filter(c => c.status === 'bot_active').length,
    data_received: MOCK_CANDIDATES.filter(c => c.status === 'data_received').length,
    validating: MOCK_CANDIDATES.filter(c => c.status === 'validating').length,
    validated: MOCK_CANDIDATES.filter(c => c.status === 'validated').length,
    rejected: MOCK_CANDIDATES.filter(c => c.status === 'rejected').length,
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Candidatos</h1>
          <p className="text-sm text-slate-500">Pipeline de entrada via Bot WhatsApp → Validação → Disponível</p>
        </div>
      </div>

      {/* Pipeline stages */}
      <div className="flex gap-3">
        {[
          { status: 'bot_active' as CandidateStatus, label: 'Bot em Conversa', count: counts.bot_active, color: 'border-t-blue-400' },
          { status: 'data_received' as CandidateStatus, label: 'Dados Recebidos', count: counts.data_received, color: 'border-t-amber-400' },
          { status: 'validating' as CandidateStatus, label: 'Em Validação', count: counts.validating, color: 'border-t-purple-400' },
          { status: 'validated' as CandidateStatus, label: 'Validado', count: counts.validated, color: 'border-t-green-400' },
        ].map((stage, i) => (
          <React.Fragment key={stage.status}>
            <div className={`flex-1 bg-white p-4 rounded-lg border border-slate-200 border-t-4 ${stage.color} shadow-sm text-center`}>
              <p className="text-2xl font-black text-slate-900">{stage.count}</p>
              <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mt-0.5">{stage.label}</p>
            </div>
            {i < 3 && <div className="flex items-center"><ChevronRight size={18} className="text-slate-300" /></div>}
          </React.Fragment>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap">
        {[
          { key: 'all' as const, label: 'Todos' },
          { key: 'bot_active' as const, label: 'Bot Ativo' },
          { key: 'data_received' as const, label: 'Dados Recebidos' },
          { key: 'validating' as const, label: 'Em Validação' },
          { key: 'validated' as const, label: 'Validados' },
          { key: 'rejected' as const, label: 'Rejeitados' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-3 py-1.5 text-xs font-bold rounded-full border transition-colors ${
              filter === tab.key ? 'bg-industrial text-white border-industrial' : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
            }`}
          >
            {tab.label} ({counts[tab.key]})
          </button>
        ))}
      </div>

      {/* Candidates table */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm">
        <div className="p-4 border-b border-slate-100">
          <div className="relative max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input type="text" placeholder="Buscar candidato..." className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-md text-sm outline-none" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-5 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Status</th>
                <th className="px-5 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Nome</th>
                <th className="px-5 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Nacionalidade</th>
                <th className="px-5 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Telefone</th>
                <th className="px-5 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Skills</th>
                <th className="px-5 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Documentos</th>
                <th className="px-5 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Entrada</th>
                <th className="px-5 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest">Fonte</th>
                <th className="px-5 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-widest"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map(candidate => {
                const cfg = STATUS_CONFIG[candidate.status];
                const StatusIcon = cfg.icon;
                return (
                  <tr key={candidate.id} className="hover:bg-slate-50/50">
                    <td className="px-5 py-3">
                      <span className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-bold border ${cfg.className}`}>
                        <StatusIcon size={12} className={candidate.status === 'bot_active' ? 'animate-spin' : ''} />
                        {cfg.label}
                      </span>
                    </td>
                    <td className="px-5 py-3">
                      <p className="text-sm font-bold text-slate-900">{candidate.fullName}</p>
                      <p className="text-[10px] text-slate-400">{candidate.dateOfBirth}</p>
                    </td>
                    <td className="px-5 py-3 text-sm text-slate-600">{candidate.nationality}</td>
                    <td className="px-5 py-3 text-xs font-mono text-slate-600">{candidate.phone}</td>
                    <td className="px-5 py-3">
                      <div className="flex gap-1 flex-wrap">
                        {candidate.skills.map(s => (
                          <span key={s} className="px-1.5 py-0.5 text-[9px] font-bold bg-slate-100 text-slate-600 rounded uppercase">{s}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${candidate.docsReceived >= candidate.docsTotal ? 'bg-compliance-green' : candidate.docsReceived >= candidate.docsTotal * 0.6 ? 'bg-amber-400' : 'bg-compliance-red'}`} style={{ width: `${(candidate.docsReceived / candidate.docsTotal) * 100}%` }} />
                        </div>
                        <span className="text-[10px] font-bold text-slate-500">{candidate.docsReceived}/{candidate.docsTotal}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-xs text-slate-500 font-mono">{candidate.createdAt}</td>
                    <td className="px-5 py-3 text-[10px] font-bold text-slate-500 uppercase">{candidate.source}</td>
                    <td className="px-5 py-3">
                      <button onClick={() => { setSelectedCandidate(candidate); setActiveTab('dados'); }} className="p-1.5 text-slate-400 hover:text-industrial hover:bg-slate-100 rounded transition-colors">
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Candidate Detail Modal */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setSelectedCandidate(null)} />
          <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-slate-100 shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-industrial-steel flex items-center justify-center text-white text-lg font-bold">
                  {selectedCandidate.fullName.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-slate-900">{selectedCandidate.fullName}</h2>
                    {(() => { const cfg = STATUS_CONFIG[selectedCandidate.status]; const Icon = cfg.icon; return (
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold border ${cfg.className}`}>
                        <Icon size={10} /> {cfg.label}
                      </span>
                    ); })()}
                  </div>
                  <p className="text-xs text-slate-500">{selectedCandidate.nationality} • {selectedCandidate.phone}</p>
                </div>
              </div>
              <button onClick={() => setSelectedCandidate(null)} className="p-1 hover:bg-slate-100 rounded"><X size={20} className="text-slate-400" /></button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-slate-200 px-6 shrink-0">
              {[
                { id: 'dados' as const, label: 'Dados Pessoais' },
                { id: 'docs' as const, label: `Documentos (${selectedCandidate.docsReceived}/${selectedCandidate.docsTotal})` },
                { id: 'certs' as const, label: `Certificações (${selectedCandidate.certifications.length})` },
                { id: 'history' as const, label: `Histórico (${selectedCandidate.history.length})` },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-3 text-xs font-bold transition-colors relative ${activeTab === tab.id ? 'text-industrial' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  {tab.label}
                  {activeTab === tab.id && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-industrial" />}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 no-scrollbar">
              {activeTab === 'dados' && (
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: null, label: 'Nome Completo', value: selectedCandidate.fullName },
                    { icon: null, label: 'Data Nascimento', value: selectedCandidate.dateOfBirth },
                    { icon: Heart, label: 'Estado Civil', value: selectedCandidate.maritalStatus },
                    { icon: null, label: 'Nacionalidade', value: selectedCandidate.nationality },
                    { icon: null, label: 'NIF', value: selectedCandidate.nif || '—' },
                    { icon: null, label: 'Nº Segurança Social', value: selectedCandidate.ssNumber || '—' },
                    { icon: Phone, label: 'Telefone / WhatsApp', value: selectedCandidate.phone },
                    { icon: Mail, label: 'Email', value: selectedCandidate.email || '—' },
                    { icon: MapPin, label: 'Endereço', value: selectedCandidate.address },
                    { icon: null, label: 'Skills Declarados', value: selectedCandidate.skills.join(', ') || '—' },
                  ].map((item, i) => (
                    <div key={i} className="p-3 bg-slate-50 rounded-lg">
                      <p className="text-[10px] font-bold text-slate-400 uppercase">{item.label}</p>
                      <p className="text-sm font-bold text-slate-900 mt-0.5">{item.value}</p>
                    </div>
                  ))}
                </div>
              )}

              {activeTab === 'docs' && (
                <div className="space-y-2">
                  {selectedCandidate.documents.map((doc, i) => {
                    const iconCfg = DOC_STATUS_ICON[doc.status];
                    return (
                      <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-100">
                        <div className="flex items-center gap-3">
                          {doc.status === 'verified' ? <CheckCircle2 size={16} className={iconCfg.className} /> :
                           doc.status === 'ocr_processing' ? <Loader2 size={16} className={iconCfg.className} /> :
                           doc.status === 'missing' ? <AlertTriangle size={16} className={iconCfg.className} /> :
                           doc.status === 'rejected' ? <UserX size={16} className={iconCfg.className} /> :
                           <FileText size={16} className={iconCfg.className} />}
                          <div>
                            <p className="text-sm font-bold text-slate-700">{doc.type}</p>
                            {doc.number && <p className="text-[10px] font-mono text-slate-400">{doc.number} {doc.expiry && `• Exp: ${doc.expiry}`}</p>}
                          </div>
                        </div>
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                          doc.status === 'verified' ? 'bg-green-50 text-green-700' :
                          doc.status === 'received' ? 'bg-blue-50 text-blue-600' :
                          doc.status === 'ocr_processing' ? 'bg-amber-50 text-amber-600' :
                          doc.status === 'missing' ? 'bg-slate-100 text-slate-400' :
                          'bg-red-50 text-red-600'
                        }`}>
                          {doc.status === 'verified' ? 'Verificado' : doc.status === 'received' ? 'Recebido' : doc.status === 'ocr_processing' ? 'OCR...' : doc.status === 'missing' ? 'Em Falta' : 'Rejeitado'}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}

              {activeTab === 'certs' && (
                <div className="space-y-3">
                  {selectedCandidate.certifications.length > 0 ? selectedCandidate.certifications.map((cert, i) => (
                    <div key={i} className="p-4 bg-slate-50 rounded-lg border border-slate-100">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-sm font-bold text-slate-900 flex items-center gap-2">
                            <GraduationCap size={14} className="text-slate-400" />
                            {cert.name}
                          </p>
                          <p className="text-xs text-slate-500 mt-1">{cert.issuer} • Emitido: {cert.date}</p>
                        </div>
                        <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${cert.status === 'valid' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}>
                          {cert.status === 'valid' ? 'Válido' : 'Expirado'}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-1">Validade: {cert.expiry}</p>
                    </div>
                  )) : <p className="text-sm text-slate-400 italic text-center py-8">Sem certificações registadas</p>}
                </div>
              )}

              {activeTab === 'history' && (
                <div className="space-y-3">
                  {selectedCandidate.history.map((h, i) => (
                    <div key={i} className="p-4 bg-slate-50 rounded-lg border border-slate-100 flex items-start gap-3">
                      <Briefcase size={16} className="text-slate-400 mt-0.5 shrink-0" />
                      <div>
                        <p className="text-sm font-bold text-slate-900">{h.company}</p>
                        <p className="text-xs text-slate-500">{h.role} • {h.country} • {h.period}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Actions */}
            {selectedCandidate.status !== 'validated' && selectedCandidate.status !== 'rejected' && (
              <div className="p-6 border-t border-slate-100 flex gap-3 shrink-0">
                <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold border border-slate-200 rounded-md hover:bg-slate-50">
                  <MessageSquare size={16} /> Pedir Docs via WhatsApp
                </button>
                <div className="flex-1" />
                <button className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold bg-compliance-red text-white rounded-md hover:opacity-90">
                  <UserX size={16} /> Rejeitar
                </button>
                <button className="flex items-center gap-2 px-6 py-2.5 text-sm font-bold bg-compliance-green text-white rounded-md hover:opacity-90">
                  <UserCheck size={16} /> Aprovar Candidato
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CandidatesView;
