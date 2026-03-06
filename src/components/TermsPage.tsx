
import React from 'react';
import { FileText, ArrowLeft, CheckCircle2, AlertTriangle, ShieldCheck } from 'lucide-react';

interface Props {
  onBack?: () => void;
}

const TermsPage: React.FC<Props> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-white p-6 md:p-20">
      <div className="max-w-4xl mx-auto space-y-12 animate-fade-in">
        <div className="flex items-center gap-6">
          <button onClick={onBack} className="p-4 bg-slate-900 border border-white/5 rounded-2xl text-slate-400 hover:text-white transition-all">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <div>
            <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase">TERMOS DE <span className="text-rose-500">UTILIZAÇÃO</span></h2>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">Digital Nexus Solutions • Portugal 2026</p>
          </div>
        </div>

        <div className="glass p-10 rounded-[3rem] border-white/5 space-y-12">
          <section className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-rose-600/10 rounded-xl flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 text-rose-500" />
              </div>
              <h3 className="text-xl font-black italic uppercase tracking-tight">1. Aceitação dos Termos</h3>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Ao aceder ao protocolo NexusTime, o utilizador concorda em cumprir estes termos de serviço, todas as leis e regulamentos aplicáveis ​​em território português e concorda que é responsável pelo cumprimento de todas as leis locais aplicáveis.
            </p>
          </section>

          <section className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-rose-600/10 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-rose-500" />
              </div>
              <h3 className="text-xl font-black italic uppercase tracking-tight">2. Licença de Uso</h3>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              É concedida permissão para descarregar temporariamente uma cópia dos materiais (informações ou software) no site NexusTime, apenas para visualização transitória pessoal e não comercial. Esta é a concessão de uma licença, não uma transferência de título.
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              {[
                'Não modificar ou copiar os materiais',
                'Não usar para fins comerciais sem licença Pro',
                'Não tentar descompilar o software',
                'Não remover direitos de autor'
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 bg-white/5 p-4 rounded-2xl border border-white/5">
                  <AlertTriangle className="w-4 h-4 text-rose-500/50" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">{item}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-rose-600/10 rounded-xl flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-rose-500" />
              </div>
              <h3 className="text-xl font-black italic uppercase tracking-tight">3. Isenção de Responsabilidade</h3>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              Os materiais no site da NexusTime são fornecidos 'como estão'. A Digital Nexus Solutions não oferece garantias, expressas ou implícitas, e, por este meio, isenta e nega todas as outras garantias, incluindo, sem limitação, garantias implícitas ou condições de comercialização.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
