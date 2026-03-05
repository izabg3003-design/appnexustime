import React, { useState, useEffect } from 'react';
import { UserProfile, WorkRecord, AppBanner } from '../types';
import { supabase } from '../lib/supabase';
import { 
  LogOut, 
  Clock, 
  Calendar, 
  Plus, 
  ChevronLeft, 
  ChevronRight, 
  Trash2, 
  AlertCircle,
  Megaphone,
  X,
  Lock,
  FileText,
  BarChart3,
  UserCircle
} from 'lucide-react';

interface DashboardProps {
  user: UserProfile;
  onLogout: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ user, onLogout }) => {
  const [records, setRecords] = useState<Record<string, WorkRecord>>({});
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [showPostLoginBanner, setShowPostLoginBanner] = useState(false);
  const [bannerData, setBannerData] = useState<AppBanner | null>(null);

  const isPro = user.subscription.status === 'premium' || user.role === 'admin' || user.role === 'master';

  useEffect(() => {
    fetchRecords();
    fetchBanner();
  }, [currentMonth]);

  const fetchBanner = async () => {
    try {
      const { data, error } = await supabase
        .from('app_banners')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        const targetType = isPro ? 'premium' : 'free';
        const filtered = data.filter(b => b.user_type === 'all' || b.user_type === targetType);
        if (filtered.length > 0) {
          setBannerData(filtered[0]);
          setTimeout(() => setShowPostLoginBanner(true), 1000);
        }
      }
    } catch (e) {
      console.error(e);
    }
  };

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const startOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).toISOString();
      const endOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).toISOString();

      const { data, error } = await supabase
        .from('work_records')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', startOfMonth)
        .lte('date', endOfMonth);

      if (error) throw error;

      const recordMap: Record<string, WorkRecord> = {};
      data.forEach(r => {
        recordMap[r.date] = r;
      });
      setRecords(recordMap);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddRecord = async () => {
    if (!isPro) {
      const totalHours = Object.values(records).reduce((acc, r) => acc + (parseFloat(r.exit_time) - parseFloat(r.entry_time) || 0), 0);
      if (totalHours >= 165) {
        alert('Limite de 165 horas atingido para a versão gratuita. Adquira a assinatura Premium para registar mais horas.');
        return;
      }
    }
    
    const today = new Date().toISOString().split('T')[0];
    const newRecord: Partial<WorkRecord> = {
      user_id: user.id,
      date: today,
      entry_time: '09:00',
      exit_time: '18:00',
      break_duration: 1,
      extra_hours: 0,
      is_absent: false
    };

    try {
      const { error } = await supabase.from('work_records').upsert([newRecord]);
      if (error) throw error;
      fetchRecords();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex">
      {/* Sidebar */}
      <aside className="w-72 border-r border-white/5 bg-slate-900/50 backdrop-blur-xl flex flex-col">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 rounded-xl bg-rose-600 flex items-center justify-center shadow-lg shadow-rose-600/20">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white italic uppercase tracking-tighter leading-none">Nexus <span className="text-rose-500">Time</span></h2>
              <p className="text-[8px] text-slate-500 font-bold uppercase tracking-[0.2em]">Intelligence Protocol</p>
            </div>
          </div>

          <nav className="space-y-2">
            <button className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl bg-rose-600 text-white font-black text-[10px] uppercase tracking-widest shadow-lg shadow-rose-600/20">
              <Clock className="w-5 h-5" /> Dashboard
            </button>
            <button className="w-full flex items-center justify-between px-6 py-4 rounded-2xl text-slate-500 hover:bg-white/5 font-black text-[10px] uppercase tracking-widest transition-all group">
              <div className="flex items-center gap-4">
                <BarChart3 className="w-5 h-5" /> Relatórios
              </div>
              {!isPro && <Lock className="w-4 h-4 text-slate-700" />}
            </button>
            <button className="w-full flex items-center justify-between px-6 py-4 rounded-2xl text-slate-500 hover:bg-white/5 font-black text-[10px] uppercase tracking-widest transition-all group">
              <div className="flex items-center gap-4">
                <FileText className="w-5 h-5" /> Contabilista
              </div>
              {!isPro && <Lock className="w-4 h-4 text-slate-700" />}
            </button>
          </nav>
        </div>

        <div className="mt-auto p-8 border-t border-white/5">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-2xl bg-slate-800 border border-white/5 flex items-center justify-center">
              <UserCircle className="w-8 h-8 text-slate-500" />
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-black text-white uppercase truncate">{user.full_name}</p>
              <p className="text-[9px] font-bold text-rose-500 uppercase tracking-widest">{user.nexus_id}</p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-slate-950 border border-white/5 text-slate-500 hover:text-white hover:bg-rose-600 transition-all font-black text-[10px] uppercase tracking-widest"
          >
            <LogOut className="w-4 h-4" /> Sair do Sistema
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto p-12">
        <header className="flex justify-between items-end mb-12">
          <div>
            <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter mb-2">
              Bem-vindo, <span className="text-rose-500">{(user.full_name || 'Membro').split(' ')[0]}</span>
            </h1>
            <p className="text-slate-500 font-bold text-xs uppercase tracking-[0.3em]">Status do Sistema: Operacional</p>
          </div>

          <div className="flex items-center gap-4 bg-slate-900/50 p-2 rounded-2xl border border-white/5">
            <button 
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
              className="p-3 hover:bg-white/5 rounded-xl text-slate-500 transition-all"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="px-6 text-center min-w-[180px]">
              <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-1">Período Fiscal</p>
              <p className="text-sm font-black text-white uppercase tracking-tighter italic">
                {currentMonth.toLocaleString('pt-PT', { month: 'long', year: 'numeric' })}
              </p>
            </div>
            <button 
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
              className="p-3 hover:bg-white/5 rounded-xl text-slate-500 transition-all"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </header>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <div className="bg-slate-900/50 border border-white/5 p-8 rounded-[2.5rem] relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
              <Clock className="w-24 h-24 text-white" />
            </div>
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] mb-4">Horas Registadas</p>
            <h3 className="text-5xl font-black text-white italic tracking-tighter">0.00 <span className="text-xl text-slate-600">H</span></h3>
            {!isPro && (
              <div className="mt-6 flex items-center gap-2 text-[9px] font-bold text-amber-500 uppercase tracking-widest">
                <AlertCircle className="w-4 h-4" /> Limite: 165h
              </div>
            )}
          </div>
        </div>

        {/* Calendar Placeholder */}
        <div className="bg-slate-900/50 border border-white/5 rounded-[3rem] p-10 text-center">
          <div className="max-w-md mx-auto py-20">
            <div className="w-20 h-20 rounded-3xl bg-slate-800 flex items-center justify-center mx-auto mb-8">
              <Calendar className="w-10 h-10 text-slate-600" />
            </div>
            <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter mb-4">Sem Registos</h3>
            <p className="text-slate-500 font-medium mb-10">Inicie o seu protocolo de registo diário para visualizar o mapa de horas.</p>
            <button 
              onClick={handleAddRecord}
              className="px-10 py-5 bg-rose-600 hover:bg-rose-500 text-white font-black rounded-2xl uppercase text-[11px] tracking-[0.2em] shadow-xl shadow-rose-600/20 transition-all"
            >
              Adicionar Registo Hoje
            </button>
          </div>
        </div>
      </main>

      {/* Banner Overlay */}
      {showPostLoginBanner && bannerData && (
        <div className="fixed inset-0 z-[2000] flex items-center justify-center p-6 backdrop-blur-xl bg-slate-950/70 animate-[fadeIn_0.3s_ease-out]">
          <div className={`relative w-full max-w-4xl bg-slate-900 rounded-[3rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.9)] border border-${bannerData.theme_color}-500/30 animate-[modalScale_0.4s_ease-out]`}>
            <button 
              onClick={() => setShowPostLoginBanner(false)}
              className="absolute top-6 right-6 z-50 p-3 bg-black/40 hover:bg-black/60 text-white rounded-full backdrop-blur-md transition-all border border-white/10"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="relative aspect-[16/9]">
              {bannerData.image_url ? (
                <img src={bannerData.image_url} className="w-full h-full object-cover" alt="" />
              ) : (
                <div className={`w-full h-full bg-gradient-to-br from-slate-900 to-slate-950 flex items-center justify-center`}>
                  <Megaphone className={`w-20 h-20 text-${bannerData.theme_color}-500/20`} />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex flex-col justify-end p-16 space-y-4">
                <span className={`w-fit px-4 py-1.5 rounded-full bg-${bannerData.theme_color}-500 text-white text-[10px] font-black uppercase tracking-widest shadow-lg`}>
                  {bannerData.highlight}
                </span>
                <h3 className="text-5xl font-black text-white italic uppercase tracking-tighter leading-none">
                  {bannerData.title}
                </h3>
                <p className="text-lg text-slate-300 font-medium max-w-2xl">
                  {bannerData.subtitle}
                </p>
                {bannerData.cta_link && (
                  <button 
                    onClick={() => window.open(bannerData.cta_link, '_blank')}
                    className={`w-fit px-10 py-5 bg-${bannerData.theme_color}-600 hover:bg-${bannerData.theme_color}-500 text-white font-black rounded-2xl uppercase text-xs tracking-[0.2em] shadow-2xl transition-all hover:scale-105 active:scale-95`}
                  >
                    {bannerData.cta_text}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
