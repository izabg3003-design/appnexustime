export interface UserProfile {
  id: string;
  nexus_id: string;
  full_name: string;
  email: string;
  role: 'user' | 'admin' | 'master';
  subscription: {
    status: 'free' | 'premium' | 'trial';
    plan: 'monthly' | 'yearly' | 'none';
    expires_at?: string;
  };
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
  notes?: string;
}
