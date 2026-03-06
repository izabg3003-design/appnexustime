
import React from 'react';
import { 
  LayoutGrid, 
  DollarSign, 
  BarChart3, 
  Users, 
  Settings, 
  LogOut, 
  Shield, 
  HelpCircle, 
  Zap,
  Eye,
  EyeOff,
  ChevronRight,
  User
} from 'lucide-react';
import { UserProfile, AppState } from '../types';
import { supabase } from '../lib/supabase';

interface Props {
  user: UserProfile;
  activeState: AppState;
  setAppState: (state: AppState) => void;
  t: (key: string) => any;
  hideValues: boolean;
  setHideValues: (hide: boolean) => void;
}

const Sidebar: React.FC<Props> = ({ user, activeState, setAppState, t, hideValues, setHideValues }) => {
  const menuItems = [
    { id: 'dashboard', icon: LayoutGrid, label: 'Dashboard', roles: ['user', 'admin', 'master'] },
    { id: 'finance', icon: DollarSign, label: 'Finanças', roles: ['user', 'admin', 'master'] },
    { id: 'reports', icon: BarChart3, label: 'Relatórios', roles: ['user', 'admin', 'master'] },
    { id: 'accountant', icon: Users, label: 'Contabilista', roles: ['user', 'admin', 'master'] },
  ];

  const adminItems = [
    { id: 'admin', icon: Shield, label: 'Admin Console', roles: ['admin', 'master'] },
    { id: 'support', icon: HelpCircle, label: 'Support Ops', roles: ['admin', 'master'] },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-80 bg-slate-950 border-r border-white/5 z-50 hidden lg:flex flex-col p-8">
      {/* Brand */}
      <div className="flex items-center gap-4 mb-12 group cursor-pointer" onClick={() => setAppState('dashboard')}>
        <div className="w-12 h-12 bg-rose-600 rounded-2xl flex items-center justify-center shadow-2xl shadow-rose-600/40 group-hover:scale-110 transition-all">
          <Zap className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-white italic tracking-tighter leading-none">NEXUS<span className="text-rose-500">OS</span></h1>
          <p className="text-[8px] font-black text-slate-500 uppercase tracking-[0.4em] mt-1">Protocolo V2.4.0</p>
        </div>
      </div>

      {/* User Profile Mini */}
      <div className="mb-10 p-6 bg-white/5 rounded-[2.5rem] border border-white/5 relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:rotate-12 transition-all">
          <User className="w-12 h-12" />
        </div>
        <div className="flex items-center gap-4 relative z-10">
          <div className="w-12 h-12 bg-slate-900 rounded-2xl border border-white/10 flex items-center justify-center overflow-hidden">
            {user.photo ? (
              <img src={user.photo} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
            ) : (
              <User className="w-6 h-6 text-slate-700" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-black text-white uppercase truncate">{user.full_name}</h4>
            <p className="text-[9px] font-black text-rose-500 uppercase tracking-widest mt-0.5">{user.nexus_id}</p>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <button 
            onClick={() => setHideValues(!hideValues)}
            className="p-2 bg-black/20 rounded-xl text-slate-500 hover:text-white transition-all"
          >
            {hideValues ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
          <div className="flex gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
            <span className="text-[8px] font-black text-emerald-500 uppercase tracking-widest">Online</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2">
        <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] ml-4 mb-4">Principal</p>
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setAppState(item.id as AppState)}
            className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all group ${
              activeState === item.id 
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/20' 
                : 'text-slate-500 hover:bg-white/5 hover:text-white'
            }`}
          >
            <div className="flex items-center gap-4">
              <item.icon className="w-5 h-5" />
              <span className="text-[11px] font-black uppercase tracking-widest">{item.label}</span>
            </div>
            <ChevronRight className={`w-4 h-4 transition-all ${activeState === item.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
          </button>
        ))}

        {(user.role === 'admin' || user.role === 'master') && (
          <>
            <p className="text-[9px] font-black text-slate-600 uppercase tracking-[0.3em] ml-4 mt-8 mb-4">Administração</p>
            {adminItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setAppState(item.id as AppState)}
                className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all group ${
                  activeState === item.id 
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/20' 
                    : 'text-slate-500 hover:bg-white/5 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-4">
                  <item.icon className="w-5 h-5" />
                  <span className="text-[11px] font-black uppercase tracking-widest">{item.label}</span>
                </div>
                <ChevronRight className={`w-4 h-4 transition-all ${activeState === item.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
              </button>
            ))}
          </>
        )}
      </nav>

      {/* Footer */}
      <div className="pt-8 border-t border-white/5 space-y-2">
        <button 
          onClick={() => setAppState('settings')}
          className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all ${
            activeState === 'settings' ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-white hover:bg-white/5'
          }`}
        >
          <Settings className="w-5 h-5" />
          <span className="text-[11px] font-black uppercase tracking-widest">Definições</span>
        </button>
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-4 p-4 text-slate-500 hover:text-rose-500 hover:bg-rose-500/5 rounded-2xl transition-all"
        >
          <LogOut className="w-5 h-5" />
          <span className="text-[11px] font-black uppercase tracking-widest">Sair do Sistema</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
