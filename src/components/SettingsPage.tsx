
import React, { useState } from 'react';
import { User, Shield, Bell, Globe, Lock, Save, Camera, CreditCard, Zap, CheckCircle2, AlertCircle } from 'lucide-react';
import { UserProfile } from '../types';

interface Props {
  user: UserProfile;
  onUpdateProfile: (updates: Partial<UserProfile>) => Promise<boolean>;
  t: (key: string) => any;
}

const SettingsPage: React.FC<Props> = ({ user, onUpdateProfile, t }) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    full_name: user.full_name,
    email: user.email,
    phone: user.phone || '',
    nif: user.nif || '',
    hourlyRate: user.hourlyRate || 0,
    isFreelancer: user.isFreelancer || false,
    socialSecurity: user.socialSecurity || 0.11,
    irs: user.irs || 0.15,
    vat: user.vat || 0.23,
    defaultEntry: user.defaultEntry || '09:00',
    defaultExit: user.defaultExit || '18:00',
  });

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    
    const result = await onUpdateProfile(formData);
    if (result) {
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } else {
      setError('Erro ao atualizar perfil.');
    }
    setLoading(false);
  };

  return (
    <div className="space-y-8 animate-fade-in pb-32">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase">NEXUS<span className="text-rose-500">SETTINGS</span></h2>
          <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">Configuração do Protocolo de Utilizador</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={loading}
          className="flex items-center gap-3 px-8 py-4 bg-rose-600 hover:bg-rose-500 text-white font-black rounded-2xl uppercase text-[11px] tracking-[0.2em] shadow-xl shadow-rose-600/20 transition-all disabled:opacity-50"
        >
          {loading ? 'A processar...' : <><Save className="w-4 h-4" /> Guardar Alterações</>}
        </button>
      </div>

      {success && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-3 text-emerald-500 text-xs font-black uppercase tracking-widest animate-bounce">
          <CheckCircle2 className="w-5 h-5" /> Perfil atualizado com sucesso!
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-8">
          <div className="glass p-10 rounded-[3rem] border-white/5 flex flex-col items-center text-center">
            <div className="relative group cursor-pointer">
              <div className="w-32 h-32 bg-slate-900 rounded-[2.5rem] flex items-center justify-center mb-6 border-2 border-white/5 group-hover:border-rose-500/50 transition-all overflow-hidden">
                {user.photo ? (
                  <img src={user.photo} className="w-full h-full object-cover" alt="" referrerPolicy="no-referrer" />
                ) : (
                  <User className="w-16 h-16 text-slate-700" />
                )}
              </div>
              <div className="absolute bottom-4 right-0 p-2 bg-rose-600 rounded-xl text-white shadow-lg opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                <Camera className="w-4 h-4" />
              </div>
            </div>
            <h3 className="text-2xl font-black text-white italic uppercase tracking-tight">{user.full_name}</h3>
            <p className="text-rose-500 text-[10px] font-black uppercase tracking-[0.3em] mt-2">{user.nexus_id}</p>
            
            <div className="w-full mt-10 p-6 bg-white/5 rounded-[2rem] border border-white/5 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Plano Atual</span>
                <span className="px-3 py-1 bg-rose-600 text-white rounded-full text-[8px] font-black uppercase tracking-widest">Nexus Pro</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Membro Desde</span>
                <span className="text-[10px] font-black text-white uppercase tracking-widest">Jan 2026</span>
              </div>
            </div>
          </div>

          <div className="glass p-8 rounded-[2.5rem] border-white/5 space-y-6">
            <h4 className="text-xs font-black text-white uppercase tracking-widest flex items-center gap-3">
              <Shield className="w-5 h-5 text-rose-500" /> Segurança
            </h4>
            <button className="w-full flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-all group">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Alterar Palavra-passe</span>
              <Lock className="w-4 h-4 text-slate-600 group-hover:text-rose-500" />
            </button>
            <button className="w-full flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 hover:bg-white/10 transition-all group">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tight">Autenticação 2FA</span>
              <div className="w-8 h-4 bg-slate-800 rounded-full relative">
                <div className="absolute left-1 top-1 w-2 h-2 bg-slate-600 rounded-full"></div>
              </div>
            </button>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <div className="glass p-10 rounded-[3rem] border-white/5 space-y-10">
            <div className="grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="text-xs font-black text-white uppercase tracking-widest">Dados Pessoais</h4>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase ml-4 tracking-widest">Nome Completo</label>
                    <input 
                      type="text" 
                      value={formData.full_name}
                      onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                      className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:ring-1 focus:ring-rose-500/50 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase ml-4 tracking-widest">Email</label>
                    <input 
                      type="email" 
                      value={formData.email}
                      disabled
                      className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-4 text-slate-500 font-bold outline-none opacity-50"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase ml-4 tracking-widest">Telefone</label>
                    <input 
                      type="text" 
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:ring-1 focus:ring-rose-500/50 transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-black text-white uppercase tracking-widest">Dados Fiscais</h4>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase ml-4 tracking-widest">NIF (Portugal)</label>
                    <input 
                      type="text" 
                      value={formData.nif}
                      onChange={(e) => setFormData({...formData, nif: e.target.value})}
                      className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:ring-1 focus:ring-rose-500/50 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase ml-4 tracking-widest">Valor Hora Base (€)</label>
                    <input 
                      type="number" 
                      value={formData.hourlyRate}
                      onChange={(e) => setFormData({...formData, hourlyRate: parseFloat(e.target.value)})}
                      className="w-full bg-slate-950 border border-white/5 rounded-2xl px-6 py-4 text-white font-bold outline-none focus:ring-1 focus:ring-rose-500/50 transition-all"
                    />
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                    <div className="flex-1">
                      <p className="text-[10px] font-black text-white uppercase tracking-widest">Trabalhador Independente</p>
                      <p className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">Ativar cálculo de IVA e Recibos Verdes</p>
                    </div>
                    <button 
                      onClick={() => setFormData({...formData, isFreelancer: !formData.isFreelancer})}
                      className={`w-12 h-6 rounded-full relative transition-all ${formData.isFreelancer ? 'bg-rose-600' : 'bg-slate-800'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${formData.isFreelancer ? 'left-7' : 'left-1'}`}></div>
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-10 border-t border-white/5 grid md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <h4 className="text-xs font-black text-white uppercase tracking-widest">Preferências de Horário</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase ml-4 tracking-widest">Entrada Padrão</label>
                    <input 
                      type="time" 
                      value={formData.defaultEntry}
                      onChange={(e) => setFormData({...formData, defaultEntry: e.target.value})}
                      className="w-full bg-slate-950 border border-white/5 rounded-2xl px-4 py-4 text-white font-bold outline-none focus:ring-1 focus:ring-rose-500/50 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-500 uppercase ml-4 tracking-widest">Saída Padrão</label>
                    <input 
                      type="time" 
                      value={formData.defaultExit}
                      onChange={(e) => setFormData({...formData, defaultExit: e.target.value})}
                      className="w-full bg-slate-950 border border-white/5 rounded-2xl px-4 py-4 text-white font-bold outline-none focus:ring-1 focus:ring-rose-500/50 transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-xs font-black text-white uppercase tracking-widest">Taxas de Imposto (%)</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-[8px] font-black text-slate-500 uppercase ml-2 tracking-widest">IRS</label>
                    <input 
                      type="number" 
                      step="0.01"
                      value={formData.irs}
                      onChange={(e) => setFormData({...formData, irs: parseFloat(e.target.value)})}
                      className="w-full bg-slate-950 border border-white/5 rounded-2xl px-4 py-4 text-white font-bold outline-none focus:ring-1 focus:ring-rose-500/50 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[8px] font-black text-slate-500 uppercase ml-2 tracking-widest">Seg. Social</label>
                    <input 
                      type="number" 
                      step="0.01"
                      value={formData.socialSecurity}
                      onChange={(e) => setFormData({...formData, socialSecurity: parseFloat(e.target.value)})}
                      className="w-full bg-slate-950 border border-white/5 rounded-2xl px-4 py-4 text-white font-bold outline-none focus:ring-1 focus:ring-rose-500/50 transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[8px] font-black text-slate-500 uppercase ml-2 tracking-widest">IVA</label>
                    <input 
                      type="number" 
                      step="0.01"
                      value={formData.vat}
                      onChange={(e) => setFormData({...formData, vat: parseFloat(e.target.value)})}
                      className="w-full bg-slate-950 border border-white/5 rounded-2xl px-4 py-4 text-white font-bold outline-none focus:ring-1 focus:ring-rose-500/50 transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
