import React, { useState, useEffect } from 'react';
import { supabase } from './lib/supabase';
import { LoginPage } from './components/LoginPage';
import { Dashboard } from './components/Dashboard';
import { UserProfile } from './types';
import { Loader2, AlertTriangle } from 'lucide-react';

class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean, error: any }> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }

  componentDidCatch(error: any, errorInfo: any) {
    console.error('ErrorBoundary caught an error', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-6 text-center">
          <AlertTriangle className="w-16 h-16 text-rose-500 mb-6" />
          <h1 className="text-2xl font-black text-white uppercase italic mb-4">Erro de Sistema</h1>
          <p className="text-slate-400 max-w-md mb-8">Ocorreu um erro inesperado ao carregar o protocolo Digital Nexus.</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-8 py-4 bg-rose-600 text-white font-black rounded-2xl uppercase text-xs tracking-widest"
          >
            Reiniciar Sistema
          </button>
          <pre className="mt-8 p-4 bg-black/50 rounded-xl text-[10px] text-slate-600 font-mono text-left max-w-full overflow-auto">
            {this.state.error?.message || 'Unknown Error'}
          </pre>
        </div>
      );
    }
    return this.props.children;
  }
}

const App: React.FC = () => {
  const [session, setSession] = useState<any>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('Digital Nexus: App Mounted, checking session...');
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Digital Nexus: Session check complete', !!session);
      setSession(session);
      if (session) fetchProfile(session.user.id);
      else setLoading(false);
    }).catch(err => {
      console.error('Digital Nexus: Session check error', err);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      console.log('Digital Nexus: Auth state changed', _event, !!session);
      setSession(session);
      if (session) fetchProfile(session.user.id);
      else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    console.log('Digital Nexus: Fetching profile for', userId);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.warn('Digital Nexus: Profile fetch error (might not exist yet)', error);
        // If profile doesn't exist, we might need to show login/register
        setLoading(false);
        return;
      }
      console.log('Digital Nexus: Profile fetched', !!data);
      setProfile(data);
    } catch (err) {
      console.error('Digital Nexus: Profile fetch exception', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-rose-500 animate-spin" />
      </div>
    );
  }

  if (!session || !profile) {
    return (
      <ErrorBoundary>
        <LoginPage onLoginSuccess={() => {}} />
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <Dashboard user={profile} onLogout={() => supabase.auth.signOut()} />
    </ErrorBoundary>
  );
};

export default App;
