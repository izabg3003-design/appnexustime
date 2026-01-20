import React, { useState, useEffect, useCallback, useRef } from 'react';
import SplashScreen from './components/SplashScreen';
import LanguageGate from './components/LanguageGate';
import LandingPage from './components/LandingPage';
import SubscriptionPage from './components/SubscriptionPage';
import LoginPage from './components/LoginPage';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import FinancePage from './components/FinancePage';
import ReportsPage from './components/ReportsPage';
import AccountantPage from './components/AccountantPage';
import SettingsPage from './components/SettingsPage';
import AdminPage from './components/AdminPage';
import VendorDetailPage from './components/VendorDetailPage';
import VendorSalesPage from './components/VendorSalesPage';
import SupportPage from './components/SupportPage';
import UserSupportPage from './components/UserSupportPage';
import PrivacyPage from './components/PrivacyPage';
import TermsPage from './components/TermsPage';
import AboutNexusPage from './components/AboutNexusPage';
import { AppState, UserProfile, WorkRecord, Language, Currency } from './types';
import { supabase, isConfigured } from './lib/supabase';
import { translations } from './translations';

declare global {
  interface window {
    gtag: (...args: any[]) => void;
    jivo_api: {
      showWidget: () => void;
      hideWidget: () => void;
      open: () => void;
      close: () => void;
    };
  }
}

const DEFAULT_USER: UserProfile = {
  name: 'Membro Nexus',
  email: '',
  photo: null,
  hourlyRate: 10,
  defaultEntry: '09:00',
  defaultExit: '18:00',
  socialSecurity: { value: 11, type: 'percentage' },
  irs: { value: 15, type: 'percentage' },
  isFreelancer: false,
  vat: { value: 23, type: 'percentage' },
  role: 'user',
  overtimeRates: { h1: 50, h2: 75, h3: 100 },
  settings: { language: 'pt-PT', currency: 'EUR' }
};

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('splash');
  const [authInitialized, setAuthInitialized] = useState(false);
  const [systemLang, setSystemLang] = useState<Language>('pt-PT');
  const [user, setUser] = useState<UserProfile>(DEFAULT_USER);
  const [records, setRecords] = useState<Record<string, WorkRecord>>({});
  const [selectedVendorData, setSelectedVendorData] = useState<any>(null);
  const [adminOverrideVendor, setAdminOverrideVendor] = useState<any>(null);
  const [authError, setAuthError] = useState<{ title: string, text: string } | null>(null);
  const [hideValues, setHideValues] = useState(false);
  
  const isInitialLoad = useRef(true);

  // Lista de estados considerados "Públicos" (Antes do Login)
  const PUBLIC_STATES: AppState[] = ['landing', 'privacy', 'terms', 'subscription', 'login', 'about-nexus', 'splash', 'language-gate'];

  useEffect(() => {
    const isPublicPage = PUBLIC_STATES.includes(appState);
    document.body.classList.toggle('jivo-visible', isPublicPage);

    const updateJivo = () => {
      try {
        const api = (window as any).jivo_api;
        if (api && typeof api.showWidget === 'function') {
          if (isPublicPage) api.showWidget();
          else { api.hideWidget(); if (typeof api.close === 'function') api.close(); }
        }
      } catch (e) {}
    };

    updateJivo();
    const interval = setInterval(() => {
      if (isPublicPage && !document.body.classList.contains('jivo-visible')) document.body.classList.add('jivo-visible');
      updateJivo();
    }, 300);
    const timeout = setTimeout(() => clearInterval(interval), 5000);
    return () => { clearInterval(interval); clearTimeout(timeout); };
  }, [appState]);

  useEffect(() => {
    if (typeof (window as any).gtag === 'function' && appState !== 'splash') {
      (window as any).gtag('event', 'page_view', {
        page_location: window.location.href,
        page_path: `/${appState}`,
        send_to: 'G-YD6Q53C4K2'
      });
    }
  }, [appState]);

  const t = useCallback((key: string): any => {
    try {
      const parts = key.split('.');
      let result: any = translations['pt-PT'];
      for (const part of parts) {
        if (result && typeof result === 'object' && part in result) result = result[part];
        else { result = null; break; }
      }
      return result || key;
    } catch (e) { return key; }
  }, []);

  const formatCurrency = useCallback((value: number) => {
    if (hideValues) return "••••";
    try {
      // Forçado pt-PT para garantir que decimais usem vírgula e símbolo € à direita (padrão Portugal)
      return new Intl.NumberFormat('pt-PT', { 
        style: 'currency', 
        currency: 'EUR' 
      }).format(value);
    } catch (e) {
      return `${value.toFixed(2)} €`;
    }
  }, [hideValues]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(DEFAULT_USER);
    setAppState('landing');
    setAuthError(null);
  };

  const loadUserData = useCallback(async (userId: string, retryCount = 0) => {
    try {
      const { data: { user: authUser } } = await supabase.auth.getUser();
      if (authUser?.is_anonymous) { setAppState('landing'); setAuthInitialized(true); return; }

      const { data: profile } = await supabase.from('profiles').select('*').eq('id', userId).maybeSingle();
      if (!profile && retryCount < 3) { setTimeout(() => loadUserData(userId, retryCount + 1), 1000); return; }
      if (profile) {
        const sub = profile.subscription;
        const parsedSub = typeof sub === 'string' ? JSON.parse(sub) : (sub || {});
        if (parsedSub.isActive === false && profile.email !== 'master@digitalnexus.com') {
          await supabase.auth.signOut();
          setAuthError({ title: 'ACESSO BLOQUEADO', text: 'Subscrição inativa. Contacte a Digital Nexus Solutions Portugal.' });
          setAppState('login');
          setAuthInitialized(true);
          return;
        }
        setUser(profile);
        if (profile.email === 'master@digitalnexus.com') setAppState('admin');
        else if (profile.role === 'vendor') setAppState('vendor-detail');
        else if (profile.role === 'support') setAppState('support');
        else setAppState('dashboard');
        
        const { data: dbRecords } = await supabase.from('work_records').select('*').eq('user_id', userId);
        if (dbRecords) {
          const formatted: Record<string, WorkRecord> = {};
          dbRecords.forEach((r: any) => { if (r.data) formatted[r.date] = r.data; });
          setRecords(formatted);
        }
      } else setAppState('landing');
    } catch (e) { setAppState('landing'); }
    finally { setTimeout(() => setAuthInitialized(true), 100); }
  }, []);

  useEffect(() => {
    if (!isConfigured) { setAppState('landing'); return; }
    const initAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) loadUserData(session.user.id);
      else { setAppState('landing'); setAuthInitialized(true); }
    };
    if (isInitialLoad.current) { initAuth(); isInitialLoad.current = false; }
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event: any, session: any) => {
      if (event === 'SIGNED_IN' && session) { setAuthInitialized(false); loadUserData(session.user.id); }
      else if (event === 'SIGNED_OUT') { setAppState('landing'); setUser(DEFAULT_USER); setAuthInitialized(true); }
    });
    return () => subscription.unsubscribe();
  }, [loadUserData]);

  useEffect(() => {
    if (appState === 'splash' && authInitialized) setAppState('language-gate');
  }, [appState, authInitialized]);

  return (
    <div className="min-h-screen text-slate-100 bg-[#020617] selection:bg-purple-500/30">
      {appState === 'splash' ? <SplashScreen t={t} /> : null}
      {appState === 'language-gate' && <LanguageGate onSelect={(lang) => { setSystemLang(lang); setAppState('landing'); }} />}
      {appState === 'landing' && <LandingPage onLogin={() => setAppState('login')} onSubscribe={() => setAppState('subscription')} t={t} lang={systemLang} setLang={setSystemLang} onPrivacy={() => setAppState('privacy')} onTerms={() => setAppState('terms')} onAbout={() => setAppState('about-nexus')} />}
      {appState === 'privacy' && <PrivacyPage onBack={() => setAppState('landing')} />}
      {appState === 'terms' && <TermsPage onBack={() => setAppState('landing')} />}
      {appState === 'subscription' && <SubscriptionPage onSuccess={() => setAppState('login')} onBack={() => setAppState('landing')} t={t} />}
      {appState === 'login' && <LoginPage onLogin={() => {}} onBack={() => setAppState('landing')} t={t} externalError={authError} />}
      {appState === 'about-nexus' && <AboutNexusPage onBack={() => setAppState(user.id ? 'dashboard' : 'landing')} />}
      
      {['dashboard', 'finance', 'reports', 'accountant', 'settings', 'admin', 'vendor-detail', 'vendor-sales', 'support', 'user-support'].includes(appState) && (
        <div className="flex h-screen overflow-hidden relative">
          <Sidebar activeTab={appState} setActiveTab={setAppState} user={user} onLogout={handleLogout} t={t} hideValues={hideValues} togglePrivacy={() => setHideValues(!hideValues)} />
          <main className="flex-1 overflow-y-auto overflow-x-hidden px-4 md:px-12 pt-6 md:pt-12 pb-40 md:pb-12 ml-0 md:ml-24 scroll-smooth">
            <div className="max-w-5xl mx-auto w-full">
              {appState === 'dashboard' && <Dashboard user={user} records={records} onAddRecord={async (r) => {
                if (!user.id) return false;
                const { error } = await supabase.from('work_records').upsert({ user_id: user.id, date: r.date, data: r }, { onConflict: 'user_id,date' });
                if (error) return false;
                setRecords(prev => ({ ...prev, [r.date]: r }));
                return true;
              }} t={t} hideValues={hideValues} />}
              {appState === 'finance' && <FinancePage user={user} records={records} t={t} f={formatCurrency} />}
              {appState === 'reports' && <ReportsPage user={user} records={records} t={t} f={formatCurrency} />}
              {appState === 'accountant' && <AccountantPage user={user} records={records} t={t} f={formatCurrency} />}
              {appState === 'settings' && <SettingsPage user={user} setUser={async (updatedUser) => {
                if (!user.id) return false;
                const { id, email, created_at, ...updateData } = updatedUser;
                const { error } = await supabase.from('profiles').update(updateData).eq('id', user.id);
                if (error) return false;
                setUser(updatedUser);
                return true;
              }} t={t} hideValues={hideValues} />}
              {appState === 'admin' && <AdminPage currentUser={user} f={formatCurrency} onLogout={handleLogout} t={t} onUpdateProfile={async (u) => { const { id, email, created_at, ...data } = u; const { error } = await supabase.from('profiles').update(data).eq('id', u.id); if (error) return false; return true; }} hideValues={hideValues} />}
              {appState === 'vendor-detail' && <VendorDetailPage vendorId={selectedVendorData || user.id!} currentUser={user} onBack={() => setAppState('admin')} f={formatCurrency} isVendorSelf={!selectedVendorData} />}
              {appState === 'vendor-sales' && <VendorSalesPage user={user} adminOverrideVendor={adminOverrideVendor} onBackToAdmin={() => setAppState('admin')} />}
              {appState === 'support' && <SupportPage user={user} f={formatCurrency} t={t} />}
              {appState === 'user-support' && <UserSupportPage user={user} t={t} />}
            </div>
          </main>
        </div>
      )}
    </div>
  );
};

export default App;