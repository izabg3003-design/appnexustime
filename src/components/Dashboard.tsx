
import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Clock, 
  Zap, 
  Calendar, 
  ChevronRight, 
  MoreHorizontal, 
  TrendingUp, 
  AlertCircle,
  CalendarCheck,
  History,
  LayoutGrid,
  Filter,
  Download
} from 'lucide-react';
import { UserProfile, WorkRecord, AppBanner } from '../types';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay } from 'date-fns';
import { pt } from 'date-fns/locale';
import { supabase } from '../lib/supabase';

interface Props {
  user: UserProfile;
  t: (key: string) => any;
  f: (value: number) => string;
}

const Dashboard: React.FC<Props> = ({ user, t, f }) => {
  const [records, setRecords] = useState<WorkRecord[]>([]);
  const [banners, setBanners] = useState<AppBanner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
    fetchData();
  }, [currentMonth]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const start = startOfMonth(currentMonth).toISOString();
      const end = endOfMonth(currentMonth).toISOString();

      const { data: recordsData, error: recordsError } = await supabase
        .from('work_records')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', start)
        .lte('date', end)
        .order('date', { ascending: false });

      if (recordsError) throw recordsError;
      setRecords(recordsData || []);

      const { data: bannersData } = await supabase
        .from('app_banners')
        .select('*')
        .eq('active', true);
      
      setBanners(bannersData || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const stats = {
    totalHours: records.reduce((acc, r) => {
      if (r.is_absent) return acc;
      const entry = parseFloat(r.entry_time.replace(':', '.'));
      const exit = parseFloat(r.exit_time.replace(':', '.'));
      return acc + (exit - entry - r.break_duration);
    }, 0),
    extraHours: records.reduce((acc, r) => acc + (r.extra_hours || 0), 0),
    daysWorked: records.filter(r => !r.is_absent).length,
    absences: records.filter(r => r.is_absent).length
  };

  return (
    <div className="space-y-8 animate-fade-in pb-32">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-4xl font-black text-white italic tracking-tighter uppercase leading-none">
            BEM-VINDO, <span className="text-rose-500">{user.full_name.split(' ')[0]}</span>
          </h2>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.4em] mt-2 flex items-center gap-2">
            <LayoutGrid className="w-3 h-3" /> Painel de Controlo Operacional — {format(new Date(), 'dd MMMM yyyy', { locale: pt })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-4 bg-slate-900 border border-white/5 rounded-2xl text-slate-400 hover:text-white transition-all">
            <Filter className="w-5 h-5" />
          </button>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-3 px-8 py-4 bg-rose-600 hover:bg-rose-500 text-white font-black rounded-2xl uppercase text-[11px] tracking-[0.2em] shadow-xl shadow-rose-600/20 transition-all group"
          >
            <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform" /> Registar Horas
          </button>
        </div>
      </div>

      {/* Banners Section */}
      {banners.length > 0 && (
        <div className="grid grid-cols-1 gap-4">
          {banners.map(banner => (
            <div key={banner.id} className="p-6 bg-gradient-to-r from-rose-600/20 to-purple-600/20 border border-white/10 rounded-[2rem] flex items-center justify-between group cursor-pointer hover:border-white/20 transition-all">
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 bg-rose-600 rounded-2xl flex items-center justify-center shadow-lg shadow-rose-600/20">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-white uppercase tracking-widest">{banner.title}</h4>
                  <p className="text-xs text-slate-400 mt-1">{banner.subtitle}</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-600 group-hover:text-white transition-all" />
            </div>
          ))}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="glass p-8 rounded-[2.5rem] border-white/5 space-y-4 group hover:border-rose-500/30 transition-all">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Horas Registadas</span>
            <div className="p-3 rounded-2xl bg-slate-900 border border-white/5"><Clock className="w-5 h-5 text-rose-500" /></div>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-4xl font-black text-white tracking-tighter">{stats.totalHours.toFixed(1)}</p>
            <span className="text-[10px] font-black text-slate-500 uppercase">Total H</span>
          </div>
          <div className="flex items-center gap-2 text-[9px] font-black text-emerald-500 uppercase tracking-widest">
            <TrendingUp className="w-3 h-3" /> +12% vs mês anterior
          </div>
        </div>

        <div className="glass p-8 rounded-[2.5rem] border-white/5 space-y-4 group hover:border-purple-500/30 transition-all">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Horas Extra</span>
            <div className="p-3 rounded-2xl bg-slate-900 border border-white/5"><Zap className="w-5 h-5 text-purple-500" /></div>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-4xl font-black text-white tracking-tighter">{stats.extraHours}</p>
            <span className="text-[10px] font-black text-slate-500 uppercase">Extra H</span>
          </div>
          <div className="flex items-center gap-2 text-[9px] font-black text-purple-500 uppercase tracking-widest">
            {f(stats.extraHours * (user.hourlyRate || 0) * 1.5)} acumulados
          </div>
        </div>

        <div className="glass p-8 rounded-[2.5rem] border-white/5 space-y-4 group hover:border-emerald-500/30 transition-all">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Dias Trabalhados</span>
            <div className="p-3 rounded-2xl bg-slate-900 border border-white/5"><CalendarCheck className="w-5 h-5 text-emerald-500" /></div>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-4xl font-black text-white tracking-tighter">{stats.daysWorked}</p>
            <span className="text-[10px] font-black text-slate-500 uppercase">Dias</span>
          </div>
          <div className="flex items-center gap-2 text-[9px] font-black text-slate-500 uppercase tracking-widest">
            Meta Mensal: 22 Dias
          </div>
        </div>

        <div className="glass p-8 rounded-[2.5rem] border-white/5 space-y-4 group hover:border-amber-500/30 transition-all">
          <div className="flex justify-between items-center">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Faltas / Ausências</span>
            <div className="p-3 rounded-2xl bg-slate-900 border border-white/5"><AlertCircle className="w-5 h-5 text-amber-500" /></div>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-4xl font-black text-white tracking-tighter">{stats.absences}</p>
            <span className="text-[10px] font-black text-slate-500 uppercase">Faltas</span>
          </div>
          <div className="flex items-center gap-2 text-[9px] font-black text-amber-500 uppercase tracking-widest">
            Justificadas: {stats.absences}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activity Table */}
        <div className="lg:col-span-2 glass rounded-[3rem] border-white/5 overflow-hidden">
          <div className="p-10 border-b border-white/5 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-rose-600/10 rounded-xl flex items-center justify-center">
                <History className="w-5 h-5 text-rose-500" />
              </div>
              <h3 className="text-sm font-black text-white uppercase tracking-[0.2em]">Registos Recentes</h3>
            </div>
            <button className="text-[10px] font-black text-slate-500 hover:text-white uppercase tracking-widest flex items-center gap-2 transition-all">
              <Download className="w-4 h-4" /> Exportar CSV
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white/[0.02]">
                  <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Data</th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Entrada/Saída</th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Pausa</th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Total</th>
                  <th className="px-10 py-6 text-[10px] font-black text-slate-500 uppercase tracking-widest">Status</th>
                  <th className="px-10 py-6"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {records.map((record) => (
                  <tr key={record.id} className="hover:bg-white/[0.02] transition-all group">
                    <td className="px-10 py-6">
                      <p className="text-xs font-black text-white uppercase">{format(new Date(record.date), 'dd MMM', { locale: pt })}</p>
                      <p className="text-[9px] text-slate-500 font-bold uppercase">{format(new Date(record.date), 'EEEE', { locale: pt })}</p>
                    </td>
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-2 text-xs font-black text-slate-300">
                        {record.is_absent ? '---' : `${record.entry_time} → ${record.exit_time}`}
                      </div>
                    </td>
                    <td className="px-10 py-6 text-xs font-black text-slate-500">
                      {record.is_absent ? '---' : `${record.break_duration}h`}
                    </td>
                    <td className="px-10 py-6">
                      <span className="px-3 py-1 bg-slate-900 border border-white/5 rounded-lg text-[10px] font-black text-white">
                        {record.is_absent ? '0.0h' : `${(parseFloat(record.exit_time.replace(':','.')) - parseFloat(record.entry_time.replace(':','.')) - record.break_duration).toFixed(1)}h`}
                      </span>
                    </td>
                    <td className="px-10 py-6">
                      <div className={`flex items-center gap-2 text-[9px] font-black uppercase tracking-widest ${record.is_absent ? 'text-amber-500' : 'text-emerald-500'}`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${record.is_absent ? 'bg-amber-500' : 'bg-emerald-500'}`}></div>
                        {record.is_absent ? 'Ausente' : 'Presente'}
                      </div>
                    </td>
                    <td className="px-10 py-6 text-right">
                      <button className="p-2 text-slate-600 hover:text-white transition-all opacity-0 group-hover:opacity-100">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Calendar / Side Info */}
        <div className="space-y-8">
          <div className="glass rounded-[3rem] border-white/5 p-10">
            <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] mb-8 flex items-center gap-3">
              <Calendar className="w-5 h-5 text-rose-500" /> Calendário Operacional
            </h3>
            <div className="grid grid-cols-7 gap-2">
              {['S', 'T', 'Q', 'Q', 'S', 'S', 'D'].map(d => (
                <div key={d} className="text-center text-[9px] font-black text-slate-600 mb-2">{d}</div>
              ))}
              {eachDayOfInterval({
                start: startOfMonth(currentMonth),
                end: endOfMonth(currentMonth)
              }).map((day, i) => {
                const hasRecord = records.find(r => isSameDay(new Date(r.date), day));
                return (
                  <div 
                    key={i} 
                    className={`aspect-square rounded-xl flex items-center justify-center text-[10px] font-black transition-all cursor-pointer
                      ${isSameDay(day, new Date()) ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/20' : 'text-slate-500 hover:bg-white/5'}
                      ${hasRecord ? 'border border-rose-500/30' : ''}
                    `}
                  >
                    {format(day, 'd')}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="glass rounded-[3rem] border-white/5 p-10 bg-gradient-to-br from-rose-600/5 to-transparent">
            <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] mb-4">Nexus Insights</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-medium">
              A sua produtividade este mês está <span className="text-emerald-400 font-black">8% acima</span> da média. 
              Mantenha o ritmo para atingir o bónus de performance projetado.
            </p>
            <button className="mt-6 text-[10px] font-black text-rose-500 uppercase tracking-widest flex items-center gap-2 group">
              Ver Relatório Detalhado <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
