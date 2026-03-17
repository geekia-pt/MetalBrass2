
import React, { useState, useEffect } from 'react';
import { Camera, LogOut, MapPin, Navigation, Clock, Wallet, FileText, ChevronRight, Lock, User, Bell, AlertTriangle, CheckCircle2, Eye, EyeOff } from 'lucide-react';

const WorkerAppView: React.FC<{ onExit: () => void }> = ({ onExit }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [working, setWorking] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeView, setActiveView] = useState<'home' | 'docs' | 'money' | 'profile'>('home');
  const [locationName, setLocationName] = useState('Buscando localização...');
  const [currentTime, setCurrentTime] = useState(new Date());

  const notifications = 2; // docs expiring

  useEffect(() => {
    setTimeout(() => setLocationName('Metalbras - Estaleiro Central (Norte)'), 1500);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handlePunch = () => {
    setLoading(true);
    setTimeout(() => { setWorking(!working); setLoading(false); }, 1200);
  };

  // Login Screen
  if (!isLoggedIn) {
    return (
      <div className="flex-1 flex flex-col bg-industrial-dark max-w-md mx-auto w-full relative h-full">
        <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-8">
          <div className="text-center">
            <div className="w-20 h-20 rounded-2xl bg-industrial-steel flex items-center justify-center mx-auto mb-4 shadow-lg">
              <span className="text-2xl font-black text-white">MB</span>
            </div>
            <h1 className="text-2xl font-black text-white">MetalBrass Nexus</h1>
            <p className="text-sm text-slate-400 mt-1">Modo Operário</p>
          </div>

          <div className="w-full space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">URL de Acesso</label>
              <div className="flex items-center bg-white/5 border border-white/10 rounded-xl px-4 py-3">
                <span className="text-xs text-slate-500 mr-1">nexus.metalbrass.com/</span>
                <input
                  type="text"
                  placeholder="nome-sobrenome"
                  className="flex-1 bg-transparent text-white text-sm font-bold outline-none placeholder:text-slate-600"
                />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Senha</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-12 py-3 bg-white/5 border border-white/10 rounded-xl text-white text-sm outline-none placeholder:text-slate-600 focus:border-white/30"
                />
                <button
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button
              onClick={() => setIsLoggedIn(true)}
              className="w-full py-3.5 bg-compliance-green text-white font-bold rounded-xl shadow-lg shadow-green-900/30 active:scale-95 transition-transform"
            >
              Entrar
            </button>
            <button className="w-full text-center text-xs text-slate-500 hover:text-slate-300 transition-colors">
              Esqueci a minha senha
            </button>
          </div>
        </div>
        <div className="p-4 text-center">
          <button onClick={onExit} className="text-xs text-slate-600 hover:text-slate-400">← Voltar ao Dashboard Admin</button>
        </div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeView) {
      case 'docs':
        return (
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Meus Documentos</h2>
              <button onClick={() => setActiveView('home')} className="text-xs text-slate-500">← Voltar</button>
            </div>
            <div className="bg-red-50 border border-red-100 p-4 rounded-2xl flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-red-900 uppercase tracking-tighter">A1 Vencendo!</p>
                <p className="text-[11px] text-red-700">Expira em 4 dias. Envie foto nova.</p>
              </div>
              <button className="p-3 bg-red-600 text-white rounded-xl shadow-lg shadow-red-200">
                <Camera size={20} />
              </button>
            </div>
            <div className="space-y-3">
              {[
                { label: 'Passaporte', status: 'Válido', date: 'Exp: 10/2026', icon: CheckCircle2, color: 'text-compliance-green' },
                { label: 'Certidão Soldador', status: 'Válido', date: 'Exp: 05/2024', icon: CheckCircle2, color: 'text-compliance-green' },
                { label: 'Certificado A1', status: 'Vencendo', date: 'Exp: 4 dias', icon: AlertTriangle, color: 'text-amber-500' },
                { label: 'Contrato Metalbras', status: 'Assinado', date: '01/01/2024', icon: CheckCircle2, color: 'text-compliance-green' },
              ].map((doc, i) => (
                <div key={i} className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400">
                      <FileText size={20} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{doc.label}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{doc.date}</p>
                    </div>
                  </div>
                  <doc.icon size={16} className={doc.color} />
                </div>
              ))}
            </div>
            <button className="w-full py-3 bg-industrial text-white font-bold rounded-2xl text-sm active:scale-95 transition-transform flex items-center justify-center gap-2">
              <Camera size={16} /> Enviar Novo Documento
            </button>
          </div>
        );
      case 'money':
        return (
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Meu Dinheiro</h2>
              <button onClick={() => setActiveView('home')} className="text-xs text-slate-500">← Voltar</button>
            </div>
            <div className="bg-industrial-dark p-6 rounded-3xl shadow-xl text-white mb-2">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Horas Aprovadas (Mês)</p>
              <h3 className="text-3xl font-black mb-1">142.5 h</h3>
              <p className="text-[11px] text-compliance-green font-bold uppercase tracking-wider">Aprovação Final: Pendente</p>
            </div>
            <div className="space-y-2">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Esta Semana</p>
              {[
                { day: 'Hoje', hours: '—', status: 'Em Curso' },
                { day: 'Ontem', hours: '8.5h', status: 'Aprovado' },
                { day: 'Terça-feira', hours: '9.0h', status: 'Aprovado' },
                { day: 'Segunda-feira', hours: '8.0h', status: 'Em Revisão' },
                { day: 'Sexta-feira', hours: '7.5h', status: 'Aprovado' },
              ].map((item, i) => (
                <div key={i} className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between shadow-sm">
                  <div className="flex items-center gap-3">
                    <Clock size={16} className="text-slate-300" />
                    <span className="text-sm font-bold text-slate-700">{item.day}</span>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-slate-900">{item.hours}</p>
                    <p className={`text-[10px] font-bold uppercase ${item.status === 'Aprovado' ? 'text-compliance-green' : item.status === 'Em Curso' ? 'text-blue-500' : 'text-compliance-amber'}`}>{item.status}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'profile':
        return (
          <div className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Meu Perfil</h2>
              <button onClick={() => setActiveView('home')} className="text-xs text-slate-500">← Voltar</button>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-industrial-steel flex items-center justify-center text-white text-xl font-bold">RM</div>
                <div>
                  <p className="text-lg font-bold text-slate-900">Ricardo Meireles</p>
                  <p className="text-xs text-slate-500">ID #88220 • Soldador TIG</p>
                  <p className="text-xs text-slate-400">ricardo.meireles@metalbras.pt</p>
                </div>
              </div>
              <div className="border-t border-slate-100 pt-4 space-y-3">
                {[
                  { label: 'Telefone', value: '+351 912 345 678' },
                  { label: 'Projeto Atual', value: 'Central Hidrelétrica - Lyon' },
                  { label: 'Alojamento', value: 'Apt. Lyon Centro #1' },
                  { label: 'Custo/Hora', value: '€ 45.00' },
                ].map((item, i) => (
                  <div key={i} className="flex justify-between">
                    <span className="text-xs text-slate-500 font-bold uppercase">{item.label}</span>
                    <span className="text-sm font-bold text-slate-900">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
            <button className="w-full py-3 bg-slate-100 text-slate-700 font-bold rounded-2xl text-sm border border-slate-200">
              Alterar Senha
            </button>
          </div>
        );
      default:
        return (
          <div className="flex-1 p-6 flex flex-col items-center justify-center space-y-8">
            <div className="relative group">
              {working && <div className="absolute inset-0 rounded-full bg-compliance-red animate-pulse scale-110 opacity-20" />}
              <button
                disabled={loading}
                onClick={handlePunch}
                className={`w-48 h-48 rounded-full flex flex-col items-center justify-center shadow-2xl transition-all active:scale-95 ${
                  working ? 'bg-compliance-red ring-8 ring-red-100' : 'bg-compliance-green ring-8 ring-green-100'
                }`}
              >
                {loading ? (
                  <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Clock size={48} className="text-white mb-2" />
                    <span className="text-xl font-black text-white uppercase tracking-wider">{working ? 'SAIR' : 'ENTRAR'}</span>
                    <span className="text-[10px] text-white/70 font-bold uppercase tracking-widest">Ponto Digital</span>
                  </>
                )}
              </button>
            </div>

            <div className="grid grid-cols-3 gap-3 w-full">
              <button onClick={() => setActiveView('docs')} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center gap-2 active:bg-slate-50">
                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 relative">
                  <Camera size={20} />
                  {notifications > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-compliance-red text-white text-[9px] font-bold rounded-full flex items-center justify-center">{notifications}</span>
                  )}
                </div>
                <span className="text-[10px] font-bold text-slate-700 uppercase">Docs</span>
              </button>
              <button onClick={() => setActiveView('money')} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center gap-2 active:bg-slate-50">
                <div className="w-10 h-10 rounded-full bg-green-50 flex items-center justify-center text-compliance-green">
                  <Wallet size={20} />
                </div>
                <span className="text-[10px] font-bold text-slate-700 uppercase">Dinheiro</span>
              </button>
              <button onClick={() => setActiveView('profile')} className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center gap-2 active:bg-slate-50">
                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                  <User size={20} />
                </div>
                <span className="text-[10px] font-bold text-slate-700 uppercase">Perfil</span>
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 max-w-md mx-auto w-full relative h-full">
      <header className="bg-industrial-dark p-5 rounded-b-3xl shadow-lg shrink-0">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-industrial-steel flex items-center justify-center border-2 border-industrial text-white font-bold text-sm">RM</div>
            <div>
              <p className="text-white font-bold text-sm">Ricardo Meireles</p>
              <p className="text-slate-400 text-[10px]">ID #88220 | Soldador</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <button className="p-2 text-slate-400 hover:text-white relative">
              <Bell size={18} />
              {notifications > 0 && (
                <span className="absolute top-1 right-1 w-3 h-3 bg-compliance-red rounded-full border border-industrial-dark" />
              )}
            </button>
            <button onClick={() => { setIsLoggedIn(false); setActiveView('home'); }} className="p-2 text-slate-400 hover:text-white">
              <LogOut size={18} />
            </button>
          </div>
        </div>
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-3 rounded-2xl">
          <div className="flex items-center gap-2 mb-1">
            <Navigation size={12} className="text-compliance-amber" />
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Localização Atual</span>
          </div>
          <p className="text-white font-medium text-xs truncate">{locationName}</p>
        </div>
      </header>

      <div className="flex-1 overflow-auto no-scrollbar">
        {renderContent()}
      </div>

      <footer className="p-3 bg-white border-t border-slate-200 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <div className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
          </div>
          <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">GPS Ativo</span>
        </div>
        <span className="text-sm font-bold text-slate-900 tabular-nums">{currentTime.toLocaleTimeString('pt-PT')}</span>
      </footer>
    </div>
  );
};

export default WorkerAppView;
