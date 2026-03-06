
export type AppState = 'splash' | 'language' | 'landing' | 'login' | 'dashboard' | 'finance' | 'reports' | 'accountant' | 'settings' | 'admin' | 'vendor_sales' | 'vendor_detail' | 'support' | 'user_support' | 'subscription' | 'privacy' | 'terms' | 'about';
export type Language = 'pt' | 'en';
export type Currency = 'EUR' | 'USD';

export interface UserProfile {
  id: string;
  nexus_id: string;
  full_name: string;
  email: string;
  nif?: string;
  phone?: string;
  photo?: string;
  role: 'user' | 'admin' | 'master';
  subscription: {
    status: 'free' | 'premium' | 'trial';
    plan: 'monthly' | 'yearly' | 'none';
    expires_at?: string;
  };
  hourlyRate?: number;
  overtimeRates?: {
    r1: number;
    r2: number;
    r3: number;
  };
  socialSecurity?: number;
  irs?: number;
  vat?: number;
  isFreelancer?: boolean;
  defaultEntry?: string;
  defaultExit?: string;
  created_at: string;
}

export interface AppBanner {
  id: string;
  title: string;
  highlight: string;
  subtitle: string;
  cta_text: string;
  cta_link?: string;
  image_url?: string;
  theme_color: 'emerald' | 'purple' | 'amber' | 'rose' | 'blue';
  is_active: boolean;
  user_type: 'all' | 'free' | 'premium';
  created_at?: string;
}

export interface WorkRecord {
  id: string;
  user_id: string;
  date: string;
  entry_time: string;
  exit_time: string;
  break_duration: number;
  extra_hours: number;
  is_absent: boolean;
  location?: string;
  notes?: string;
  advance?: number;
}

export interface FinanceSummary {
  totalHours: number;
  totalExtraHours: number;
  extraHoursValue: number;
  grossTotal: number;
  socialSecurityTotal: number;
  irsTotal: number;
  ivaTotal: number;
  advancesTotal: number;
  netTotal: number;
  daysWorked: number;
}
