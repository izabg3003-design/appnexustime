
import React from 'react';
import { Globe, ArrowRight } from 'lucide-react';
import { Language } from '../types';

interface Props {
  onSelect: (lang: Language) => void;
}

const LanguageGate: React.FC<Props> = ({ onSelect }) => {
  return (
    <div className="fixed inset-0 z-[4000] bg-slate-950 flex items-center justify-center p-6">
      <div className="w-full max-w-md space-y-12">
        <div className="text-center space-y-4">
          <div className="inline-flex p-4 bg-white/5 rounded-3xl border border-white/10 mb-4">
            <Globe className="w-8 h-8 text-rose-500" />
          </div>
          <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">Select Protocol</h2>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">Choose your operational language</p>
        </div>

        <div className="grid gap-4">
          <button 
            onClick={() => onSelect('pt')}
            className="group flex items-center justify-between p-6 bg-slate-900 hover:bg-slate-800 border border-white/5 rounded-3xl transition-all"
          >
            <div className="flex items-center gap-4">
              <span className="text-2xl">🇵🇹</span>
              <div className="text-left">
                <p className="text-white font-black uppercase text-xs tracking-widest">Português</p>
                <p className="text-slate-500 text-[10px] font-bold">Portugal (pt-PT)</p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-700 group-hover:text-rose-500 group-hover:translate-x-1 transition-all" />
          </button>

          <button 
            onClick={() => onSelect('en')}
            className="group flex items-center justify-between p-6 bg-slate-900 hover:bg-slate-800 border border-white/5 rounded-3xl transition-all opacity-50 cursor-not-allowed"
            disabled
          >
            <div className="flex items-center gap-4">
              <span className="text-2xl">🇺🇸</span>
              <div className="text-left">
                <p className="text-white font-black uppercase text-xs tracking-widest">English</p>
                <p className="text-slate-500 text-[10px] font-bold">Coming Soon</p>
              </div>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-700" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default LanguageGate;
