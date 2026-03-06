
import React from 'react';
import { ArrowRight, ShieldCheck, Clock, Zap, DollarSign, Globe, Sparkles, ChevronRight } from 'lucide-react';

interface Props {
  onStart: () => void;
}

const LandingPage: React.FC<Props> = ({ onStart }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
      <nav className="fixed top-0 left-0 w-full z-[1000] bg-slate-950/50 backdrop-blur-xl border-b border-white/5 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-rose-600 rounded-xl flex items-center justify-center shadow-lg shadow-rose-600/20">
              <ShieldCheck className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-black italic uppercase tracking-tighter">Digital <span className="text-rose-500">Nexus</span></h1>
          </div>
          <button onClick={onStart} className="bg-rose-600 hover:bg-rose-500 text-white px-6 py-3 rounded-xl text-xs font-black uppercase tracking-widest transition-all shadow-lg shadow-rose-600/20">Aceder ao Sistema</button>
        </div>
      </nav>

      <section className="pt-40 pb-20 px-6 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full pointer-events-none">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-[80%] bg-rose-600/10 blur-[120px] rounded-full"></div>
        </div>
        
        <div className="max-w-5xl mx-auto text-center space-y-8 relative z-10">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full mb-4">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Protocolo Nexus v16.0 Ativo</span>
          </div>
          
          <h2 className="text-6xl md:text-8xl font-black italic uppercase tracking-tighter leading-none">
            CONTROLO TOTAL DO SEU <br />
            <span className="text-rose-500">TEMPO E RENDIMENTO</span>
          </h2>
          
          <p className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            A plataforma definitiva para profissionais que exigem precisão cirúrgica no registo de horas, gestão financeira e relatórios de performance.
          </p>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 pt-8">
            <button onClick={onStart} className="w-full md:w-auto bg-rose-600 hover:bg-rose-500 text-white px-10 py-6 rounded-2xl text-sm font-black uppercase tracking-[0.2em] transition-all shadow-2xl shadow-rose-600/20 flex items-center justify-center gap-3 group">
              Começar Agora <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </section>

      <section className="py-20 px-6 bg-slate-900/50">
        <div className="max-w-7xl mx-auto grid md:grid-cols-3 gap-8">
          {[
            { title: 'Registo Preciso', desc: 'Interface otimizada para registo rápido de entradas, saídas e pausas.', icon: Clock },
            { title: 'Nexus Finance', desc: 'Cálculos automáticos de rendimento bruto, líquido e impostos.', icon: Zap },
            { title: 'Relatórios Pro', desc: 'Gere PDFs profissionais para a sua empresa ou contabilista.', icon: DollarSign },
          ].map((adv, i) => (
            <div key={i} className="bg-slate-950 p-8 rounded-[2.5rem] border border-white/5 hover:border-rose-500/30 transition-all group">
              <div className="w-14 h-14 bg-rose-600/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <adv.icon className="w-7 h-7 text-rose-500" />
              </div>
              <h3 className="text-xl font-black text-white italic uppercase tracking-tight mb-3">{adv.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{adv.desc}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
