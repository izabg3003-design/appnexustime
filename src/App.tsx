
import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { UserProfile, AppState, Language, Currency } from './types';
import SplashScreen from './components/SplashScreen';
import LanguageGate from './components/LanguageGate';
import LoginPage from './components/LoginPage';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import Sidebar from './components/Sidebar';
import FinancePage from './components/FinancePage';
import ReportsPage from './components/ReportsPage';
import AccountantPage from './components/AccountantPage';
import SettingsPage from './components/SettingsPage';
import AdminPage from './components/AdminPage';
import VendorDetailPage from './components/VendorDetailPage';
import VendorSalesPage from './components/VendorSalesPage';
import SupportPage from './components/SupportPage';
import UserSupportPage from './components/UserSupportPage';
import SubscriptionPage from './components/SubscriptionPage';
import PrivacyPage from './components/PrivacyPage';
import TermsPage from './components/TermsPage';
import AboutNexusPage from './components/AboutNexusPage';

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 flex items-center justify-center p-10">
          <div className="glass p-10 rounded-[3rem] border-white/5 text-center max-w-md">
            <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter mb-4">CRITICAL_ERROR</h2>
            <p className="text-slate-400 text-sm mb-8">Ocorreu um erro inesperado no protocolo Nexus. Por favor, reinicie a aplicação.</p>
            <button onClick={() => window.location.reload()} className="px-8 py-4 bg-rose-600 text-white font-black rounded-2xl uppercase text-[11px] tracking-widest">Reiniciar Sistema</button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>('splash');
  const [session, setSession] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [language, setLanguage] = useState<Language>('pt');
  const [currency, setCurrency] = useState<Currency>('EUR');
  const [hideValues, setHideValues] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchProfile(session.user.id);
      else if (appState === 'splash') setTimeout(() => setAppState('landing'), 2000);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchProfile(session.user.id);
      else setAppState('landing');
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setUserProfile(data);
      setAppState('dashboard');
    } catch (err) {
      console.error('Error fetching profile:', err);
      setAppState('login');
    }
  };

  const handleUpdateProfile = async (updates: Partial<UserProfile>) => {
    if (!userProfile) return false;
    try {
      const { error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userProfile.id);

      if (error) throw error;
      setUserProfile({ ...userProfile, ...updates });
      return true;
    } catch (err) {
      console.error('Error updating profile:', err);
      return false;
    }
  };

  const t = (key: string) => key; // Simple translation mock
  const f = (val: number) => new Intl.NumberFormat(language === 'pt' ? 'pt-PT' : 'en-US', { style: 'currency', currency }).format(val);

  const renderContent = () => {
    if (!userProfile && !['splash', 'landing', 'login', 'privacy', 'terms', 'about'].includes(appState)) {
      return <LoginPage onLoginSuccess={() => setAppState('dashboard')} t={t} />;
    }

    switch (appState) {
      case 'splash': return <SplashScreen t={t} />;
      case 'landing': return <LandingPage onStart={() => setAppState('login')} />;
      case 'login': return <LoginPage onLoginSuccess={() => setAppState('dashboard')} t={t} />;
      case 'dashboard': return <Dashboard user={userProfile!} t={t} f={f} />;
      case 'finance': return <FinancePage user={userProfile!} f={f} t={t} hideValues={hideValues} />;
      case 'reports': return <ReportsPage user={userProfile!} t={t} />;
      case 'accountant': return <AccountantPage user={userProfile!} t={t} />;
      case 'settings': return <SettingsPage user={userProfile!} onUpdateProfile={handleUpdateProfile} t={t} />;
      case 'admin': return <AdminPage user={userProfile!} t={t} />;
      case 'vendor_detail': return <VendorDetailPage user={userProfile!} t={t} />;
      case 'vendor_sales': return <VendorSalesPage user={userProfile!} t={t} />;
      case 'support': return <SupportPage user={userProfile!} t={t} />;
      case 'user_support': return <UserSupportPage user={userProfile!} t={t} />;
      case 'subscription': return <SubscriptionPage user={userProfile!} t={t} />;
      case 'privacy': return <PrivacyPage />;
      case 'terms': return <TermsPage />;
      case 'about': return <AboutNexusPage />;
      default: return <Dashboard user={userProfile!} t={t} f={f} />;
    }
  };

  const showSidebar = !['splash', 'landing', 'login'].includes(appState);

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-slate-950 text-slate-200 font-sans selection:bg-rose-500/30 selection:text-rose-200">
        {showSidebar && userProfile && (
          <Sidebar 
            user={userProfile} 
            activeState={appState} 
            setAppState={setAppState} 
            t={t} 
            hideValues={hideValues}
            setHideValues={setHideValues}
          />
        )}
        <main className={`${showSidebar ? 'lg:pl-80' : ''} transition-all duration-500`}>
          <div className="max-w-7xl mx-auto p-6 md:p-10">
            {renderContent()}
          </div>
        </main>
      </div>
    </ErrorBoundary>
  );
};

export default App;
