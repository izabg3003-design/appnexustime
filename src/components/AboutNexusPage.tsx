
import React from 'react';
import { ShieldCheck, ArrowLeft, Zap, Globe, Users, Sparkles, Heart } from 'lucide-react';

interface Props {
  onBack?: () => void;
}

const AboutNexusPage: React.FC<Props> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-20">
      <div className="max-w-4xl mx-auto space-y-16 animate-fade-in">
        <div className="flex items-center gap-6">
          <button onClick={onBack} className="p-4 bg-slate-900 border border-white/5 rounded-2xl text-slate-400 hover:text-white transition-all">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase">SOBRE O <span className="text-rose-500">NEXUS</span></h2>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">Digital Nexus Solutions • Portugal 2026</p>
          </div>
        </div>

        <div className="space-y-12">
          <div className="relative">
            <div className="absolute -inset-4 bg-rose-600/20 blur-3xl rounded-full -z-10"></div>
            <h3 className="text-5xl md:text-7xl font-black italic uppercase tracking-tighter leading-none">
              A REVOLUÇÃO DO <br />
              <span className="text-rose-500">TRABALHO EM PT.</span>
            </h3>
          </div>

          <p className="text-slate-400 text-lg md:text-xl leading-relaxed max-w-3xl">
            Nascida em Lisboa, a Digital Nexus Solutions foi criada com uma missão clara: capacitar os trabalhadores portugueses com ferramentas de precisão para gerir o seu ativo mais valioso — o tempo.
          </p>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="glass p-10 rounded-[3rem] border-white/5 space-y-6">
              <div className="w-12 h-12 bg-rose-600/10 rounded-2xl flex items-center justify-center">
                <Zap className="w-6 h-6 text-rose-500" />
              </div>
              <h4 className="text-xl font-black italic uppercase tracking-tight text-white">Nossa Visão</h4>
              <p className="text-slate-500 text-sm leading-relaxed">
                Acreditamos que cada minuto trabalhado deve ser valorizado. O NexusTime não é apenas um app de horas; é um protocolo de justiça laboral digital.
              </p>
            </div>
            <div className="glass p-10 rounded-[3rem] border-white/5 space-y-6">
              <div className="w-12 h-12 bg-rose-600/10 rounded-2xl flex items-center justify-center">
                <Users className="w-6 h-6 text-rose-500" />
              </div>
              <h4 className="text-xl font-black italic uppercase tracking-tight text-white">Nossa Equipa</h4>
              <p className="text-slate-500 text-sm leading-relaxed">
                Somos engenheiros, contabilistas e especialistas em direito laboral focados em criar a melhor experiência de gestão de horários na Europa.
              </p>
            </div>
          </div>

          <div className="text-center py-20 space-y-6">
            <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full">
              <Heart className="w-4 h-4 text-rose-500" />
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Feito com Orgulho em Portugal</span>
            </div>
            <p className="text-slate-600 text-[10px] font-black uppercase tracking-[0.4em]">Digital Nexus Solutions &bull; 2026</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutNexusPage;
