
import React, { useState, useEffect } from 'react';
import { Camera, LogOut, MapPin, CheckCircle2, Navigation, Clock, User, ShieldCheck, Wallet, FileText, ChevronRight } from 'lucide-react';

const WorkerAppView: React.FC<{ onExit: () => void }> = ({ onExit }) => {
  const [working, setWorking] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeView, setActiveView] = useState<'home' | 'docs' | 'money'>('home');
  const [locationName, setLocationName] = useState('Buscando localização...');
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    setTimeout(() => {
      setLocationName('Metalbras - Estaleiro Central (Norte)');
    }, 1500);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handlePunch = () => {
    setLoading(true);
    setTimeout(() => {
      setWorking(!working);
      setLoading(false);
    }, 1200);
  };

  const renderContent = () => {
    switch(activeView) {
      case 'docs':
        return (
          <div className="p-6 space-y-4">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Meus Documentos</h2>
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
                { label: 'Passaporte', status: 'Válido', date: 'Exp: 10/2026' },
                { label: 'Certidão Soldador', status: 'Válido', date: 'Exp: 05/2024' },
                { label: 'Contrato Metalbras', status: 'Assinado', date: '01/01/2024' },
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
                  <span className="text-[10px] font-bold text-compliance-green uppercase">{doc.status}</span>
                </div>
              ))}
            </div>
          </div>
        );
      case 'money':
        return (
          <div className="p-6 space-y-4">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Meu Dinheiro</h2>
            <div className="bg-industrial-dark p-6 rounded-3xl shadow-xl text-white mb-6">
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Horas Aprovadas (Mês)</p>
               <h3 className="text-3xl font-black mb-1">142.5 h</h3>
               <p className="text-[11px] text-compliance-green font-bold uppercase tracking-wider">Aprovação Final: Pendente</p>
            </div>
            <div className="space-y-2">
               <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest px-1">Últimos Lançamentos</p>
               {[
                 { day: 'Ontem', hours: '8.5h', status: 'Aprovado' },
                 { day: 'Terça-feira', hours: '9.0h', status: 'Aprovado' },
                 { day: 'Segunda-feira', hours: '8.0h', status: 'Em Revisão' },
               ].map((item, i) => (
                 <div key={i} className="bg-white p-4 rounded-2xl border border-slate-200 flex items-center justify-between shadow-sm active:bg-slate-50">
                    <div className="flex items-center gap-3">
                       <Clock size={16} className="text-slate-300" />
                       <span className="text-sm font-bold text-slate-700">{item.day}</span>
                    </div>
                    <div className="text-right">
                       <p className="text-sm font-black text-slate-900">{item.hours}</p>
                       <p className={`text-[10px] font-bold uppercase ${item.status === 'Aprovado' ? 'text-compliance-green' : 'text-compliance-amber'}`}>{item.status}</p>
                    </div>
                 </div>
               ))}
            </div>
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
                  working 
                    ? 'bg-compliance-red ring-8 ring-red-100' 
                    : 'bg-compliance-green ring-8 ring-green-100'
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

            <div className="grid grid-cols-2 gap-4 w-full">
              <button onClick={() => setActiveView('docs')} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center gap-2 active:bg-slate-50 transition-colors">
                <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
                  <Camera size={24} />
                </div>
                <span className="text-xs font-bold text-slate-700 uppercase">Documentos</span>
              </button>
              <button onClick={() => setActiveView('money')} className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm flex flex-col items-center gap-2 active:bg-slate-50 transition-colors">
                <div className="w-12 h-12 rounded-full bg-green-50 flex items-center justify-center text-compliance-green">
                  <Wallet size={24} />
                </div>
                <span className="text-xs font-bold text-slate-700 uppercase">Meu Dinheiro</span>
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 max-w-md mx-auto w-full relative h-full">
      {/* Header */}
      <header className="bg-industrial-dark p-6 rounded-b-3xl shadow-lg shrink-0">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-industrial-steel flex items-center justify-center border-2 border-industrial text-white font-bold">
              RM
            </div>
            <div>
              <p className="text-white font-bold">Ricardo Meireles</p>
              <p className="text-slate-400 text-xs">ID #88220 | Soldador</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {activeView !== 'home' && (
              <button onClick={() => setActiveView('home')} className="p-2 text-slate-400 hover:text-white bg-white/5 rounded-full">
                <ChevronRight size={20} className="rotate-180" />
              </button>
            )}
            <button onClick={onExit} className="p-2 text-slate-400 hover:text-white transition-colors">
              <LogOut size={20} />
            </button>
          </div>
        </div>

        <div className="bg-white/5 backdrop-blur-sm border border-white/10 p-4 rounded-2xl">
          <div className="flex items-center gap-2 mb-2">
            <Navigation size={14} className="text-compliance-amber" />
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Localização Atual</span>
          </div>
          <p className="text-white font-medium text-sm truncate">{locationName}</p>
        </div>
      </header>

      {/* Content Area */}
      <div className="flex-1 overflow-auto no-scrollbar">
        {renderContent()}
      </div>

      {/* Bottom Status Bar */}
      <footer className="p-4 bg-white border-t border-slate-200 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
          </div>
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">GPS Ativo & Validado</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock size={12} className="text-slate-400" />
          <span className="text-sm font-bold text-slate-900 tabular-nums">{currentTime.toLocaleTimeString('pt-PT')}</span>
        </div>
      </footer>
    </div>
  );
};

export default WorkerAppView;
