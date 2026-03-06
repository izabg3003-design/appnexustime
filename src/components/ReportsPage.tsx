
import React from 'react';
import { FileText, Download, Filter, Calendar, ChevronRight, CheckCircle2 } from 'lucide-react';
import { UserProfile } from '../types';

interface Props {
  user: UserProfile;
  t: (key: string) => any;
}

const ReportsPage: React.FC<Props> = ({ user, t }) => {
  return (
    <div className="space-y-8 animate-fade-in pb-32">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase">NEXUS<span className="text-rose-500">REPORTS</span></h2>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">Gerador de Relatórios de Performance</p>
        </div>
        <button className="bg-rose-600 hover:bg-rose-500 text-white px-8 py-4 rounded-2xl text-xs font-black uppercase tracking-widest transition-all flex items-center gap-3 shadow-lg shadow-rose-600/20">
          <Download className="w-4 h-4" /> Exportar Tudo (PDF)
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {[
          { title: 'Relatório Mensal', desc: 'Resumo completo de horas e ganhos do mês atual.', icon: Calendar },
          { title: 'Horas Extras', desc: 'Detalhamento de todas as horas extras validadas.', icon: FileText },
          { title: 'Mapa de Faltas', desc: 'Registo de ausências e justificações.', icon: Filter }
        ].map((report, i) => (
          <div key={i} className="glass p-8 rounded-[2.5rem] border-white/5 hover:border-rose-500/30 transition-all group cursor-pointer">
            <div className="w-12 h-12 bg-rose-600/10 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <report.icon className="w-6 h-6 text-rose-500" />
            </div>
            <h3 className="text-lg font-black text-white uppercase italic tracking-tight mb-2">{report.title}</h3>
            <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest leading-relaxed mb-6">{report.desc}</p>
            <div className="flex items-center gap-2 text-rose-500 text-[10px] font-black uppercase tracking-widest">
              Gerar Agora <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ReportsPage;
