
import React from 'react';
import { Mail, Send, ShieldCheck, FileCheck } from 'lucide-react';
import { UserProfile } from '../types';

interface Props {
  user: UserProfile;
  t: (key: string) => any;
}

const AccountantPage: React.FC<Props> = ({ user, t }) => {
  return (
    <div className="space-y-8 animate-fade-in pb-32">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase">NEXUS<span className="text-emerald-500">ACCOUNTANT</span></h2>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">Portal de Comunicação com Contabilista</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="glass p-10 rounded-[3rem] border-white/5 space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center">
                <Mail className="w-6 h-6 text-emerald-500" />
              </div>
              <div>
                <h3 className="text-lg font-black text-white uppercase italic tracking-tight">Enviar Dados do Mês</h3>
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">O seu contabilista receberá um link seguro com os seus registos.</p>
              </div>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black text-slate-500 uppercase ml-4 tracking-widest">Email do Contabilista</label>
                <input 
                  type="email" 
                  placeholder="contabilista@empresa.pt"
                  className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:ring-1 focus:ring-emerald-500/50 transition-all"
                />
              </div>
              <button className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-black py-5 rounded-2xl uppercase text-[11px] tracking-[0.2em] shadow-xl shadow-emerald-600/20 transition-all flex items-center justify-center gap-3 group">
                Enviar Protocolo <Send className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountantPage;
