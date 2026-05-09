import React, { useState } from 'react';
import { UserPlus, Users, Trash2, Key, School as SchoolIcon, Shield, Lock } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserRole } from '../types';

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
    <div className="space-y-10 pb-20 selection:bg-indigo-100 selection:text-indigo-900">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white -mx-8 -mt-8 px-10 py-8 border-b border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.02)] mb-10">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
             <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-600/20">
                <Users size={24} />
             </div>
             <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">Gebruikersbeheer</h2>
                <div className="flex gap-2 mt-1">
                  <span className="px-2 py-0.5 rounded-lg text-[10px] font-black bg-blue-50 text-blue-600 border border-blue-100 uppercase tracking-widest">
                    {accounts.length} Accounts
                  </span>
                  <span className="px-2 py-0.5 rounded-lg text-[10px] font-black bg-emerald-50 text-emerald-600 border border-emerald-100 uppercase tracking-widest">
                    {accounts.filter(a => a.role === 'directie').length} Directie
                  </span>
                </div>
             </div>
          </div>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="group px-6 py-3 bg-slate-900 hover:bg-black text-white rounded-2xl flex items-center gap-2.5 transition-all shadow-xl shadow-slate-900/10 active:scale-95 text-sm font-black uppercase tracking-widest"
        >
          <UserPlus size={18} className="transition-transform group-hover:scale-110" />
          <span>Account Aanmaken</span>
        </button>
      </div>

      <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
        <div className="space-y-8">
          <div className="space-y-2">
            <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase">Actieve Accounts</h3>
            <p className="text-slate-400 text-sm font-medium">Beheer alle toegang voor leerkrachten, directie en IT.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {accounts.map(account => (
              <div key={account.id} className="p-6 bg-slate-50 border border-slate-200 rounded-[2rem] hover:border-indigo-200 hover:shadow-lg transition-all group">
                <div className="flex justify-between items-start mb-6">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${
                    account.role === 'admin' ? 'bg-indigo-600 text-white shadow-indigo-600/30' : 
                    account.role === 'directie' ? 'bg-emerald-600 text-white shadow-emerald-600/30' : 
                    'bg-amber-500 text-white shadow-amber-500/30'
                  }`}>
                    {account.role === 'admin' ? <Shield size={24} /> : account.role === 'directie' ? <Users size={24} /> : <UserPlus size={24} />}
                  </div>
                  <button 
                    onClick={() => deleteAccount(account.id)}
                    className="w-8 h-8 rounded-xl bg-white text-slate-400 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition-colors shadow-sm"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                
                <div>
                  <h4 className="text-lg font-black text-slate-900 truncate tracking-tight">{account.name}</h4>
                  <p className="text-xs text-slate-500 font-bold truncate mb-4">{account.email}</p>
                  
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-6 h-6 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 shrink-0">
                      <SchoolIcon size={12} />
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-700">{account.school}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400 shrink-0">
                      <Key size={12} />
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-700">{account.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-xl rounded-[3rem] shadow-2xl overflow-hidden"
            >
              <div className="p-10">
                <div className="flex justify-between items-center mb-10">
                  <h3 className="text-2xl font-black text-slate-900 uppercase">Nieuwe Gebruiker</h3>
                  <button onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-slate-900 font-black text-xs uppercase tracking-widest px-4 py-2 hover:bg-slate-50 rounded-xl transition-all">Sluiten ✕</button>
                </div>

                <form onSubmit={handleAdd} className="space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Naam</label>
                      <input 
                        required
                        type="text" 
                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold text-sm focus:border-indigo-500 transition-colors"
                        value={newAccount.name}
                        onChange={(e) => setNewAccount({...newAccount, name: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email</label>
                      <input 
                        required
                        type="email" 
                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold text-sm focus:border-indigo-500 transition-colors"
                        value={newAccount.email}
                        onChange={(e) => setNewAccount({...newAccount, email: e.target.value})}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Rol</label>
                        <select 
                          className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold text-sm"
                          value={newAccount.role}
                          onChange={(e) => setNewAccount({...newAccount, role: e.target.value as UserRole})}
                        >
                          <option value="directie">Directie</option>
                          <option value="admin">Admin (IT)</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">School</label>
                        <select 
                          className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold text-sm"
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
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Tijdelijk Wachtwoord</label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input 
                          required
                          type="text"
                          placeholder="Bijv. TotaalWillekeurig!"
                          className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold text-sm focus:border-indigo-500 transition-colors"
                          value={newAccount.paswoord}
                          onChange={(e) => setNewAccount({...newAccount, paswoord: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>

                  <button type="submit" className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[2rem] font-black text-lg transition-all shadow-xl shadow-indigo-600/20 active:scale-95 inline-flex items-center justify-center gap-2">
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
