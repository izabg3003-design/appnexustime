
import React, { useEffect } from 'react';
import { ShieldCheck } from 'lucide-react';

interface Props {
  t: (key: string) => any;
}

const SplashScreen: React.FC<Props> = ({ t }) => {
  return (
    <div className="fixed inset-0 z-[5000] bg-slate-950 flex flex-col items-center justify-center p-6">
      <div className="relative">
        <div className="w-24 h-24 bg-rose-600 rounded-3xl flex items-center justify-center shadow-2xl shadow-rose-600/20 animate-pulse">
          <ShieldCheck className="w-12 h-12 text-white" />
        </div>
        <div className="absolute -inset-4 bg-rose-600/20 blur-2xl rounded-full animate-pulse -z-10"></div>
      </div>
      
      <div className="mt-12 text-center space-y-4">
        <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter">
          Digital <span className="text-rose-500">Nexus</span>
        </h1>
        <p className="text-slate-500 font-black text-[10px] uppercase tracking-[0.4em] animate-pulse">
          {t('splash.tagline')}
        </p>
      </div>

      <div className="absolute bottom-12 left-0 w-full flex flex-col items-center gap-4">
        <div className="w-48 h-1 bg-slate-900 rounded-full overflow-hidden">
          <div className="h-full bg-rose-600 animate-[loading_2s_ease-in-out_infinite]"></div>
        </div>
        <p className="text-[8px] font-black text-slate-700 uppercase tracking-widest">
          Protocol Version 16.0.0
        </p>
      </div>

      <style>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
};

export default SplashScreen;
