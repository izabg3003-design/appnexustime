
import React from 'react';
import { ShieldAlert, Users, Search, Filter, ChevronRight, ShieldCheck } from 'lucide-react';
import { UserProfile } from '../types';

interface Props {
  user: UserProfile;
  t: (key: string) => any;
}

const AdminPage: React.FC<Props> = ({ user, t }) => {
  return (
    <div className="space-y-8 animate-fade-in pb-32">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase">NEXUS<span className="text-rose-500">ADMIN</span></h2>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">Consola de Administração Central</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass p-8 rounded-[2.5rem] border-white/5 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Membros Ativos</span>
            <Users className="w-5 h-5 text-rose-500" />
          </div>
          <p className="text-3xl font-black text-white">1,284</p>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
