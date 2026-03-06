
import React from 'react';
import { UserProfile } from '../types';

interface Props {
  user: UserProfile;
  t: (key: string) => any;
}

const SubscriptionPage: React.FC<Props> = ({ user, t }) => {
  return (
    <div className="space-y-8 animate-fade-in pb-32">
      <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase">NEXUS<span className="text-rose-500">PRO</span></h2>
      <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">Gestão de Subscrição</p>
    </div>
  );
};

export default SubscriptionPage;
