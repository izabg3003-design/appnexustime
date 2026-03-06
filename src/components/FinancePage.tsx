
import React, { useState, useEffect } from 'react';
import { format, addMonths, subMonths } from 'date-fns';
import { pt } from 'date-fns/locale';
import { 
  ChevronLeft, 
  ChevronRight, 
  DollarSign, 
  Wallet, 
  ShieldCheck, 
  PieChart as PieIcon, 
  Clock, 
  AlertCircle, 
  Zap, 
  CalendarCheck,
  TrendingUp,
  BarChart3
} from 'lucide-react';
import { UserProfile, WorkRecord, FinanceSummary } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { supabase } from '../lib/supabase';

interface ExtendedFinanceSummary extends FinanceSummary {
  daysAbsent: number;
}

interface Props {
  user: UserProfile;
  f: (value: number) => string;
  t: (key: string) => any;
  hideValues: boolean;
}

const FinancePage: React.FC<Props> = ({ user, f, t, hideValues }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [records, setRecords] = useState<WorkRecord[]>([]);
  const [loading, setLoading] = useState(true);

  const isPro = user.subscription.status === 'premium' || user.role === 'admin' || user.role === 'master';

  useEffect(() => {
    fetchRecords();
  }, [currentDate]);

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).toISOString();
      const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).toISOString();

      const { data, error } = await supabase
        .from('work_records')
        .select('*')
        .eq('user_id', user.id)
        .gte('date', startOfMonth)
        .lte('date', endOfMonth);

      if (error) throw error;
      setRecords(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const calculateFinance = (): ExtendedFinanceSummary => {
    let summary: ExtendedFinanceSummary = { 
      daysWorked: 0, 
      daysAbsent: 0,
      totalHours: 0, 
      totalExtraHours: 0, 
      extraHoursValue: 0, 
      socialSecurityTotal: 0, 
      irsTotal: 0, 
      advancesTotal: 0, 
      grossTotal: 0, 
      netTotal: 0, 
      ivaTotal: 0 
    };
    
    records.forEach((record) => {
      if (record.is_absent) {
        summary.daysAbsent += 1;
        return;
      }
      
      summary.daysWorked += 1;
      const entry = parseFloat(record.entry_time.replace(':', '.'));
      const exit = parseFloat(record.exit_time.replace(':', '.'));
      let hours = (exit - entry) - record.break_duration;
      
      summary.totalHours += hours > 0 ? hours : 0;
      summary.advancesTotal += record.advance || 0;
      
      if (record.extra_hours > 0) {
        summary.totalExtraHours += record.extra_hours;
        const rate = user.hourlyRate || 0;
        const overtimeRate = (user.overtimeRates?.r1 || 1.5) * rate;
        summary.extraHoursValue += record.extra_hours * overtimeRate;
      }
    });

    summary.grossTotal = (summary.totalHours * (user.hourlyRate || 0)) + summary.extraHoursValue;

    const ssRate = user.socialSecurity || 0.11;
    const irsRate = user.irs || 0.15;
    const vatRate = user.vat || 0.23;

    if (user.isFreelancer) {
      summary.socialSecurityTotal = summary.grossTotal * ssRate;
      summary.irsTotal = summary.grossTotal * irsRate;
      summary.ivaTotal = summary.grossTotal * vatRate;
    } else {
      summary.socialSecurityTotal = summary.grossTotal * ssRate;
      summary.irsTotal = summary.grossTotal * irsRate;
    }
    
    summary.netTotal = summary.grossTotal - summary.socialSecurityTotal - summary.irsTotal - summary.advancesTotal + (user.isFreelancer ? summary.ivaTotal : 0);
    return summary;
  };

  const summary = calculateFinance();

  const chartData = [
    { name: 'Bruto', value: summary.grossTotal, color: '#6366f1' },
    { name: 'Impostos', value: summary.irsTotal + summary.socialSecurityTotal, color: '#f43f5e' },
    { name: 'Líquido', value: summary.netTotal, color: '#10b981' }
  ];

  if (loading) {
    return (
      <div className="p-20 text-center">
        <div className="w-12 h-12 border-4 border-rose-500/20 border-t-rose-500 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">A carregar finanças...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fade-in pb-32">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase">NEXUS<span className="text-purple-400">FINANCE</span></h2>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">Monitorização de Performance Financeira — #{user.nexus_id}</p>
        </div>
        <div className="flex items-center gap-2 glass px-4 py-2 rounded-[1.5rem] border-white/10">
           <button onClick={() => setCurrentDate(subMonths(currentDate, 1))} className="p-2 hover:bg-white/10 rounded-xl transition-all"><ChevronLeft className="w-5 h-5 text-slate-400" /></button>
           <span className="text-xs font-black uppercase tracking-widest text-white min-w-[140px] text-center">{format(currentDate, 'MMMM yyyy', { locale: pt })}</span>
           <button onClick={() => setCurrentDate(addMonths(currentDate, 1))} className="p-2 hover:bg-white/10 rounded-xl transition-all"><ChevronRight className="w-5 h-5 text-slate-400" /></button>
        </div>
      </div>

      <div className="btn-primary rounded-[3rem] p-10 text-white relative overflow-hidden shadow-[0_20px_60px_rgba(99,102,241,0.3)]">
         <div className="absolute top-0 right-0 p-10 opacity-10 pointer-events-none transform translate-x-10 -translate-y-10">
            <Wallet className="w-64 h-64" />
         </div>
         <div className="relative z-10 space-y-2">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-white/70">Impacto Líquido na Carteira</p>
            </div>
            <h3 className="text-6xl font-black tracking-tighter">{hideValues ? '••••••' : f(summary.netTotal)}</h3>
            <div className="flex flex-wrap items-center gap-6 pt-6">
               <div className="flex items-center gap-2 text-white/60 text-[10px] font-black uppercase tracking-widest bg-black/20 px-4 py-2 rounded-full border border-white/5">
                  <CalendarCheck className="w-4 h-4 text-emerald-400" /> {summary.daysWorked} Dias de Trabalho
               </div>
               <div className="flex items-center gap-2 text-white/60 text-[10px] font-black uppercase tracking-widest bg-black/20 px-4 py-2 rounded-full border border-white/5">
                  <AlertCircle className="w-4 h-4 text-rose-400" /> {summary.daysAbsent} Faltas
               </div>
            </div>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="glass p-8 rounded-[2.5rem] space-y-4 border-white/5 group hover:border-purple-500/30 transition-all">
           <div className="flex justify-between items-center">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Total de Horas Base</span>
              <div className="p-3 rounded-2xl bg-slate-900 border border-white/5"><Clock className="w-5 h-5 text-purple-400" /></div>
           </div>
           <p className="text-3xl font-black text-white">{summary.totalHours.toFixed(1)} <span className="text-xs text-slate-500">Horas</span></p>
        </div>

        <div className="glass p-8 rounded-[2.5rem] space-y-4 border-white/5 group hover:border-emerald-500/30 transition-all relative overflow-hidden">
           {!isPro && (
             <div className="absolute inset-0 z-10 bg-slate-950/40 backdrop-blur-[1px] flex flex-col items-center justify-center p-4 text-center">
               <div className="w-10 h-10 bg-purple-600/20 rounded-xl flex items-center justify-center mb-2 border border-purple-500/30">
                 <Zap className="w-5 h-5 text-purple-400" />
               </div>
               <p className="text-[8px] font-black text-white uppercase tracking-widest">Premium</p>
             </div>
           )}
           <div className="flex justify-between items-center">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Horas Extras Acumuladas</span>
              <div className="p-3 rounded-2xl bg-slate-900 border border-white/5"><Zap className="w-5 h-5 text-emerald-400" /></div>
           </div>
           <p className="text-3xl font-black text-white">{summary.totalExtraHours} <span className="text-xs text-slate-500">Extras</span></p>
        </div>

        <div className="glass p-8 rounded-[2.5rem] space-y-4 border-white/5 group hover:border-indigo-500/30 transition-all relative overflow-hidden">
           {!isPro && (
             <div className="absolute inset-0 z-10 bg-slate-950/40 backdrop-blur-[1px] flex flex-col items-center justify-center p-4 text-center">
               <div className="w-10 h-10 bg-purple-600/20 rounded-xl flex items-center justify-center mb-2 border border-purple-500/30">
                 <Zap className="w-5 h-5 text-purple-400" />
               </div>
               <p className="text-[8px] font-black text-white uppercase tracking-widest">Premium</p>
             </div>
           )}
           <div className="flex justify-between items-center">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Valor das Horas Extras</span>
              <div className="p-3 rounded-2xl bg-slate-900 border border-white/5"><DollarSign className="w-5 h-5 text-indigo-400" /></div>
           </div>
           <p className="text-3xl font-black text-white">{hideValues ? '••••••' : f(summary.extraHoursValue)}</p>
        </div>

        <div className="glass p-8 rounded-[2.5rem] space-y-4 border-white/5 group hover:border-slate-500 transition-all">
           <div className="flex justify-between items-center">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Rendimento Bruto</span>
              <div className="p-3 rounded-2xl bg-slate-900 border border-white/5"><DollarSign className="w-5 h-5 text-slate-300" /></div>
           </div>
           <p className="text-3xl font-black text-white">{hideValues ? '••••••' : f(summary.grossTotal)}</p>
        </div>

        <div className="glass p-8 rounded-[2.5rem] space-y-4 border-white/5 group hover:border-rose-500/30 transition-all">
           <div className="flex justify-between items-center">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Total de Impostos</span>
              <div className="p-3 rounded-2xl bg-slate-900 border border-white/5"><ShieldCheck className="w-5 h-5 text-rose-500" /></div>
           </div>
           <p className="text-3xl font-black text-rose-500">{hideValues ? '••••••' : f(summary.irsTotal + summary.socialSecurityTotal)}</p>
        </div>

        <div className="glass p-8 rounded-[2.5rem] space-y-4 border-white/5 group hover:border-amber-500/30 transition-all">
           <div className="flex justify-between items-center">
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Vales Deduzidos</span>
              <div className="p-3 rounded-2xl bg-slate-900 border border-white/5"><AlertCircle className="w-5 h-5 text-amber-500" /></div>
           </div>
           <p className="text-3xl font-black text-amber-500">{hideValues ? '••••••' : f(summary.advancesTotal)}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="glass rounded-[3rem] p-10 space-y-8 border-white/5">
           <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] flex items-center gap-3">
                <BarChart3 className="w-5 h-5 text-purple-400" /> Composição Mensal
              </h3>
           </div>
           <div className="h-[300px] w-full mt-6">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#64748b', fontSize: 10, fontWeight: 900 }} 
                  />
                  <YAxis hide />
                  <Tooltip 
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                    contentStyle={{ backgroundColor: '#020617', border: '1px solid #1e293b', borderRadius: '16px' }}
                    itemStyle={{ color: '#fff', fontSize: '12px', fontWeight: 'bold' }}
                  />
                  <Bar dataKey="value" radius={[12, 12, 12, 12]} barSize={40}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
           </div>
        </div>

        <div className="glass rounded-[3rem] p-10 space-y-8 border-white/5">
          <h3 className="text-sm font-black text-white uppercase tracking-[0.2em] flex items-center gap-3">
            <PieIcon className="w-5 h-5 text-purple-400" /> Detalhamento de Deduções
          </h3>
          <div className="space-y-6">
             <div className="flex justify-between items-center py-4 border-b border-white/5">
                <div className="space-y-1">
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Imposto de Renda (IRS)</p>
                   <p className="text-xs text-slate-300">Baseado na taxa configurada no perfil</p>
                </div>
                <span className="text-lg font-black text-rose-500">-{hideValues ? '••••' : f(summary.irsTotal)}</span>
             </div>
             <div className="flex justify-between items-center py-4 border-b border-white/5">
                <div className="space-y-1">
                   <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Segurança Social</p>
                   <p className="text-xs text-slate-300">Contribuição obrigatória do trabalhador</p>
                </div>
                <span className="text-lg font-black text-rose-500">-{hideValues ? '••••' : f(summary.socialSecurityTotal)}</span>
             </div>
             {user.isFreelancer && (
               <div className="flex justify-between items-center py-4 border-b border-white/5">
                  <div className="space-y-1">
                     <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">IVA Recuperável</p>
                     <p className="text-xs text-slate-300">Regime de prestação de serviços</p>
                  </div>
                  <span className="text-lg font-black text-emerald-400">+{hideValues ? '••••' : f(summary.ivaTotal)}</span>
               </div>
             )}
             <div className="flex justify-between items-center py-4">
                <div className="space-y-1">
                   <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest">Vales e Antecipações</p>
                   <p className="text-xs text-slate-300">Total debitado durante o mês</p>
                </div>
                <span className="text-lg font-black text-amber-500">-{hideValues ? '••••' : f(summary.advancesTotal)}</span>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FinancePage;
