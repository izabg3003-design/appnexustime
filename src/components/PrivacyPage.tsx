
import React from 'react';
import { ShieldCheck, ArrowLeft, Lock, Eye, FileText, Globe } from 'lucide-react';

interface Props {
  onBack?: () => void;
}

const PrivacyPage: React.FC<Props> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-20">
      <div className="max-w-4xl mx-auto space-y-12 animate-fade-in">
        <div className="flex items-center gap-6">
          <button onClick={onBack} className="p-4 bg-slate-900 border border-white/5 rounded-2xl text-slate-400 hover:text-white transition-all">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase">POLÍTICA DE <span className="text-rose-500">PRIVACIDADE</span></h2>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">Digital Nexus Solutions • Portugal 2026</p>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="glass p-8 rounded-[2.5rem] border-white/5 space-y-4">
            <Lock className="w-8 h-8 text-rose-500" />
            <h3 className="text-sm font-black uppercase tracking-widest">Dados Encriptados</h3>
            <p className="text-[10px] text-slate-500 font-bold leading-relaxed uppercase tracking-wider">Todos os seus registos de horas são encriptados antes de serem guardados na cloud.</p>
          </div>
          <div className="glass p-8 rounded-[2.5rem] border-white/5 space-y-4">
            <Eye className="w-8 h-8 text-rose-500" />
            <h3 className="text-sm font-black uppercase tracking-widest">Zero Rastreio</h3>
            <p className="text-[10px] text-slate-500 font-bold leading-relaxed uppercase tracking-wider">Não vendemos os seus dados a terceiros nem utilizamos rastreadores de publicidade.</p>
          </div>
          <div className="glass p-8 rounded-[2.5rem] border-white/5 space-y-4">
            <Globe className="w-8 h-8 text-rose-500" />
            <h3 className="text-sm font-black uppercase tracking-widest">RGPD Compliance</h3>
            <p className="text-[10px] text-slate-500 font-bold leading-relaxed uppercase tracking-wider">Totalmente em conformidade com o Regulamento Geral de Proteção de Dados da UE.</p>
          </div>
        </div>

        <div className="glass p-10 rounded-[3rem] border-white/5 space-y-8">
          <section className="space-y-4">
            <h3 className="text-xl font-black italic uppercase tracking-tight flex items-center gap-3">
              <FileText className="w-6 h-6 text-rose-500" /> 1. Recolha de Dados
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Recolhemos apenas os dados estritamente necessários para o funcionamento do protocolo NexusTime: nome, email, registos de horas de trabalho e configurações fiscais. Estes dados são utilizados exclusivamente para gerar os seus relatórios e calcular os seus rendimentos.
            </p>
          </section>

          <section className="space-y-4">
            <h3 className="text-xl font-black italic uppercase tracking-tight flex items-center gap-3">
              <ShieldCheck className="w-6 h-6 text-rose-500" /> 2. Segurança
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed">
              Implementamos medidas de segurança de nível bancário para proteger a sua informação. O acesso à sua conta é protegido por autenticação segura e todos os dados em trânsito são protegidos por protocolos SSL/TLS.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
