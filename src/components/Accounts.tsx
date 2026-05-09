import React, { useState } from 'react';
import { UserPlus, Users, Trash2, Key, School as SchoolIcon, Shield, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserRole } from '../types';
import { SCHOOL_COLORS } from '../constants/theme';

interface Account {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  school: string;
  paswoord: string; // Fake password for UI purposes
}

const MOCK_ACCOUNTS: Account[] = [
  { id: '1', name: 'Wietse Oliviers', email: 'wietse.o@leefscholenleuven.be', role: 'admin', school: 'Centraal', paswoord: '********' },
  { id: '2', name: 'Directie Matadi', email: 'directie@matadi.be', role: 'directie', school: 'Matadi', paswoord: '********' },
  { id: '3', name: 'Directie Grasmus', email: 'directie@degrasmus.be', role: 'directie', school: 'De Grasmus', paswoord: '********' },
];

export default function Accounts({ schools }: { schools: string[] }) {
  const [accounts, setAccounts] = useState<Account[]>(MOCK_ACCOUNTS);
  const [isAdding, setIsAdding] = useState(false);
  const [newAccount, setNewAccount] = useState({
    name: '',
    email: '',
    role: 'directie' as UserRole,
    school: schools[0],
    paswoord: ''
  });

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    setAccounts([
      ...accounts, 
      { 
        ...newAccount, 
        id: Math.random().toString(36).substr(2, 9),
        paswoord: newAccount.paswoord || '********'
      }
    ]);
    setIsAdding(false);
    setNewAccount({
      name: '',
      email: '',
      role: 'directie',
      school: schools[0],
      paswoord: ''
    });
  };

  const deleteAccount = (id: string) => {
    setAccounts(accounts.filter(a => a.id !== id));
  };

  return (
    <div className="space-y-10 pb-20 selection:bg-[#CFDCE2] selection:text-[#0F172A]">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[#FDFBF7] -mx-8 -mt-8 px-10 py-8 border-b border-[#EAE1D2] shadow-sm mb-10">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
             <div className="w-12 h-12 bg-[#385B69] text-white rounded-2xl flex items-center justify-center shadow-sm shadow-[#385B69]/20">
                <Users size={24} />
             </div>
             <div>
                <h2 className="text-2xl font-medium text-[#0F172A]">Gebruikersbeheer</h2>
                <div className="flex gap-2 mt-1">
                  <span className="px-2 py-0.5 rounded-lg text-xs font-medium bg-[#EAF1F4] text-[#487184] border border-[#CFDCE2]">
                    {accounts.length} Accounts
                  </span>
                  <span className="px-2 py-0.5 rounded-lg text-xs font-medium bg-[#EDF2EF] text-[#557560] border border-[#D4E0D8]">
                    {accounts.filter(a => a.role === 'directie').length} Directie
                  </span>
                </div>
             </div>
          </div>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="group px-6 py-3 bg-[#2A4652] hover:bg-[#1f343d] text-white rounded-2xl flex items-center gap-2.5 transition-all shadow-sm shadow-[#2A4652]/20 active:scale-95 text-sm font-medium"
        >
          <UserPlus size={18} className="transition-transform group-hover:scale-110" />
          <span>Account Aanmaken</span>
        </button>
      </div>

      <div className="bg-[#FDFBF7] p-8 rounded-2xl shadow-sm border border-[#EAE1D2]">
        <div className="space-y-8">
          <div className="space-y-2">
            <h3 className="text-xl font-medium text-[#0F172A]">Actieve Accounts</h3>
            <p className="text-stone-500 text-sm font-medium">Beheer alle toegang voor leerkrachten, directie en IT.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {accounts.map(account => {
              const theme = account.role === 'admin' 
                ? { bg: 'bg-[#385B69]', light: 'bg-[#F4EFE6]', border: 'border-[#EAE1D2]' } 
                : (SCHOOL_COLORS[account.school] || { bg: 'bg-[#385B69]', light: 'bg-[#F4EFE6]', border: 'border-[#EAE1D2]' });
              
              return (
              <div key={account.id} className={`p-6 ${theme.light} border ${theme.border} rounded-2xl hover:shadow-sm transition-all group`}>
                <div className="flex justify-between items-start mb-6">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm text-white ${theme.bg}`}>
                    {account.role === 'admin' ? <Shield size={24} /> : account.role === 'directie' ? <Users size={24} /> : <UserPlus size={24} />}
                  </div>
                  <button 
                    onClick={() => deleteAccount(account.id)}
                    className="w-8 h-8 rounded-xl bg-[#FDFBF7] text-stone-500 hover:text-[#9A5B64] hover:bg-[#F2E8E9] flex items-center justify-center transition-colors shadow-sm"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                
                <div>
                  <h4 className="text-lg font-medium text-[#0F172A] truncate">{account.name}</h4>
                  <p className="text-xs text-stone-500 font-bold truncate mb-4">{account.email}</p>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-6 h-6 rounded-lg bg-[#FDFBF7] border border-[#EAE1D2] flex items-center justify-center text-stone-500 shrink-0">
                      <SchoolIcon size={12} />
                    </span>
                    <span className="text-xs font-medium text-slate-700">{account.school}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-[#FDFBF7] border border-[#EAE1D2] flex items-center justify-center text-stone-500 shrink-0">
                      <Key size={12} />
                    </span>
                    <span className="text-xs font-medium text-slate-700">{account.role}</span>
                  </div>
                </div>
              </div>
            )})}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[#2A4652]/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#FDFBF7] w-full max-w-xl rounded-2xl shadow-sm overflow-hidden"
            >
              <div className="p-10">
                <div className="flex justify-between items-center mb-10">
                  <h3 className="text-2xl font-medium text-[#0F172A]">Nieuwe Gebruiker</h3>
                  <button onClick={() => setIsAdding(false)} className="text-stone-500 hover:text-[#0F172A] font-medium text-xs px-4 py-2 hover:bg-[#F4EFE6] rounded-xl transition-all">Sluiten ✕</button>
                </div>

                <form onSubmit={handleAdd} className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-stone-500 ml-1">Naam</label>
                      <input 
                        required
                        type="text" 
                        className="w-full p-4 bg-[#F4EFE6] border border-[#EAE1D2] rounded-2xl outline-none font-bold text-sm focus:border-[#385B69] transition-colors"
                        value={newAccount.name}
                        onChange={(e) => setNewAccount({...newAccount, name: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-stone-500 ml-1">Email</label>
                      <input 
                        required
                        type="email" 
                        className="w-full p-4 bg-[#F4EFE6] border border-[#EAE1D2] rounded-2xl outline-none font-bold text-sm focus:border-[#385B69] transition-colors"
                        value={newAccount.email}
                        onChange={(e) => setNewAccount({...newAccount, email: e.target.value})}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-medium text-stone-500 ml-1">Rol</label>
                        <select 
                          className="w-full p-4 bg-[#F4EFE6] border border-[#EAE1D2] rounded-2xl outline-none font-bold text-sm"
                          value={newAccount.role}
                          onChange={(e) => setNewAccount({...newAccount, role: e.target.value as UserRole})}
                        >
                          <option value="directie">Directie</option>
                          <option value="admin">Admin (IT)</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-xs font-medium text-stone-500 ml-1">School</label>
                        <select 
                          className="w-full p-4 bg-[#F4EFE6] border border-[#EAE1D2] rounded-2xl outline-none font-bold text-sm"
                          value={newAccount.school}
                          onChange={(e) => setNewAccount({...newAccount, school: e.target.value})}
                          disabled={newAccount.role === 'admin'}
                        >
                          {newAccount.role === 'admin' ? (
                            <option value="Centraal">Centraal (Alle)</option>
                          ) : (
                            schools.map(s => <option key={s} value={s}>{s}</option>)
                          )}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2 relative">
                      <label className="text-xs font-medium text-stone-500 ml-1">Tijdelijk Wachtwoord</label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-500" size={16} />
                        <input 
                          required
                          type="text"
                          placeholder="Bijv. TotaalWillekeurig!"
                          className="w-full pl-12 pr-4 py-4 bg-[#F4EFE6] border border-[#EAE1D2] rounded-2xl outline-none font-bold text-sm focus:border-[#385B69] transition-colors"
                          value={newAccount.paswoord}
                          onChange={(e) => setNewAccount({...newAccount, paswoord: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>

                  <button type="submit" className="w-full py-5 bg-[#385B69] hover:bg-[#385B69] text-white rounded-2xl font-medium text-lg transition-all shadow-sm shadow-[#385B69]/20 active:scale-95 inline-flex items-center justify-center gap-2">
                    <UserPlus size={20} />
                    GEBRUIKER TOEVOEGEN
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
