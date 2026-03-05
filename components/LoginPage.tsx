
import React, { useState, useEffect } from 'react';
import { User, Lock, ArrowRight, ArrowLeft, ShieldAlert, Loader2, ShieldCheck } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface Props {
  onLogin: (email: string) => void;
  onBack: () => void;
  t: (key: string) => any;
  externalError?: { title: string, text: string } | null;
  initialRegister?: boolean;
}

const LoginPage: React.FC<Props> = ({ onLogin, onBack, t, externalError, initialRegister = false }) => {
  const [isRegistering, setIsRegistering] = useState(initialRegister);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<{ title: string, text: string } | null>(null);

  useEffect(() => {
    if (externalError) {
      setErrorMsg(externalError);
    }
  }, [externalError]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      if (isRegistering) {
        if (password !== confirmPassword) {
          setErrorMsg({
            title: t('login.invalidTitle'),
            text: t('login.passwordsDontMatch')
          });
          setLoading(false);
          return;
        }

        const { data: authData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName
            }
          }
        });

        if (signUpError) throw signUpError;

        if (authData.user) {
          const generatedNexusId = authData.user.id.substring(0, 8);
          
          // Create profile with defaults
          const { error: profileError } = await supabase.from('profiles').upsert({
            id: authData.user.id,
            nexus_id: generatedNexusId,
            email: email,
            name: fullName,
            role: 'user',
            subscription: JSON.stringify({ 
              id: generatedNexusId,
              status: 'FREE', 
              isActive: true,
              startDate: new Date().toISOString()
            }),
            hourlyRate: 10,
            defaultEntry: '09:00',
            defaultExit: '18:00',
            socialSecurity: { value: 11, type: 'percentage' },
            irs: { value: 15, type: 'percentage' },
            isFreelancer: false,
            vat: { value: 23, type: 'percentage' },
            overtimeRates: { h1: 50, h2: 75, h3: 100 },
            settings: { language: 'pt-PT', currency: 'EUR' },
            photo: null
          });

          if (profileError) {
            console.error('Error creating profile:', profileError);
          }

          // Se o Supabase retornou uma sessão (confirmação de email desativada), o App.tsx redirecionará automaticamente
          if (authData.session) {
            setLoading(true);
            return;
          }
        }

        setErrorMsg({
          title: 'CONTA CRIADA',
          text: 'Conta criada com sucesso! Por favor, verifique a sua caixa de entrada e confirme o e-mail para ativar o seu acesso.'
        });
        setIsRegistering(false);
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          if (error.message.includes('Email not confirmed')) {
            setErrorMsg({
              title: 'CONFIRMAÇÃO PENDENTE',
              text: 'O seu e-mail ainda não foi confirmado. Por favor, verifique a sua caixa de entrada (ou spam).'
            });
            return;
          } else if (error.message.includes('Invalid login credentials')) {
            setErrorMsg({
              title: t('login.invalidTitle'),
              text: t('login.invalidMsg')
            });
            return;
          }
          throw error;
        }

        onLogin(email);
      }
    } catch (error: any) {
      setErrorMsg({
        title: t('login.systemError'),
        text: error.message
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] animate-pulse"></div>

      <div className="max-w-md w-full bg-slate-900/40 backdrop-blur-2xl border border-slate-800 p-8 rounded-[2.5rem] shadow-2xl relative z-10 overflow-hidden">
        
        {/* Top Header with Back Button */}
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={onBack}
            className="flex items-center gap-2 text-slate-500 hover:text-white transition-all group bg-slate-800/30 px-4 py-2 rounded-xl border border-slate-700/50"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-[10px] font-black uppercase tracking-widest">{t('common.back')}</span>
          </button>
          
          <div className="px-3 py-1 bg-purple-500/10 border border-purple-500/20 rounded-full">
            <span className="text-[9px] font-black text-purple-400 uppercase tracking-[0.2em]">{t('login.secureAccess')}</span>
          </div>
        </div>

        <div className="text-center mb-10">
          <h2 className="text-4xl font-black italic text-white tracking-tighter">NEXUS<span className="text-purple-400">TIME</span></h2>
          <p className="text-slate-500 mt-2 text-[10px] font-black uppercase tracking-[0.3em]">{t('login.platformNote')}</p>
        </div>

        {errorMsg && (
          <div className={`mb-8 p-5 rounded-[1.5rem] space-y-1 animate-[shake_0.5s_ease-in-out] border ${errorMsg.title.includes('BLOQUEADO') || errorMsg.title.includes('SUSPENSO') || errorMsg.title.includes('BLOCKED') || errorMsg.title.includes('CRIADA') ? 'bg-orange-500/10 border-orange-500/30' : 'bg-red-500/10 border-red-500/20'}`}>
            <div className={`flex items-center gap-2 mb-1 ${errorMsg.title.includes('BLOQUEADO') || errorMsg.title.includes('SUSPENSO') || errorMsg.title.includes('BLOCKED') || errorMsg.title.includes('CRIADA') ? 'text-orange-500' : 'text-red-500'}`}>
              <ShieldAlert className="w-4 h-4 shrink-0" />
              <p className="text-[10px] font-black uppercase tracking-widest">{errorMsg.title}</p>
            </div>
            <p className={`text-[11px] font-bold leading-relaxed ${errorMsg.title.includes('BLOQUEADO') || errorMsg.title.includes('SUSPENSO') || errorMsg.title.includes('BLOCKED') || errorMsg.title.includes('CRIADA') ? 'text-orange-400/80' : 'text-red-400/80'}`}>{errorMsg.text}</p>
          </div>
        )}

        <form onSubmit={handleAuth} className="space-y-5">
          {isRegistering && (
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{t('login.fullName')}</label>
              <div className="relative group">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-purple-400 transition-colors" />
                <input 
                  type="text" 
                  required
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl pl-14 pr-4 py-5 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-white font-medium"
                  placeholder="Seu Nome Completo"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                />
              </div>
            </div>
          )}

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{t('login.idNexus')}</label>
            <div className="relative group">
              <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-purple-400 transition-colors" />
              <input 
                type="email" 
                required
                className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl pl-14 pr-4 py-5 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-white font-medium"
                placeholder="nexus@digital.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{isRegistering ? t('login.createPassword') : t('login.securityKey')}</label>
            <div className="relative group">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-purple-400 transition-colors" />
              <input 
                type="password" 
                required
                className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl pl-14 pr-4 py-5 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-white font-medium"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {isRegistering && (
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1">{t('login.confirmPassword')}</label>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600 group-focus-within:text-purple-400 transition-colors" />
                <input 
                  type="password" 
                  required
                  className="w-full bg-slate-950/50 border border-slate-800 rounded-2xl pl-14 pr-4 py-5 focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all text-white font-medium"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </div>
            </div>
          )}

          <button 
            disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-500 text-white font-black py-5 rounded-2xl transition-all shadow-xl shadow-purple-900/20 flex items-center justify-center space-x-3 group active:scale-[0.98] disabled:opacity-50 mt-8"
          >
            {loading ? <Loader2 className="w-6 h-6 animate-spin" /> : (
              <>
                <span className="uppercase tracking-[0.2em] text-sm">{isRegistering ? t('login.register') : t('login.validateAccess')}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>

          <div className="text-center mt-6">
            <button 
              type="button"
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-[10px] font-black text-purple-400 uppercase tracking-[0.2em] hover:text-purple-300 transition-colors"
            >
              {isRegistering ? t('login.alreadyMember') : t('login.startFree')}
            </button>
          </div>
        </form>
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-5px); }
          75% { transform: translateX(5px); }
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
