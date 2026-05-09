import { LayoutDashboard, Users, Calendar, Settings as SettingsIcon, LogOut, ArrowLeftRight } from 'lucide-react';
import { motion } from 'motion/react';
import { UserRole } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  userRole: UserRole;
  userName: string;
  logout: () => void;
}

export default function Sidebar({ activeTab, setActiveTab, userRole, userName, logout }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'ICT-aanvragen', icon: LayoutDashboard },
    { id: 'personeel', label: 'Personeelswissels', icon: Users },
    { id: 'planning', label: 'Planning', icon: Calendar },
    { id: 'accounts', label: 'Gebruikers', icon: Users },
    { id: 'settings', label: 'Instellingen', icon: SettingsIcon },
  ];

  const acronym = userName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);

  return (
    <div className="w-64 bg-[#1E293B] text-slate-300 h-screen flex flex-col fixed left-0 top-0 border-r border-[#111827] z-20">
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-xl font-bold tracking-tight text-blue-400 flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-900/40">
            <span className="text-white font-black text-xs">ICT</span>
          </div>
          Scholenbeheer
        </h1>
        <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest font-bold">Beheer Dashboard</p>
      </div>

      <div className="px-4 pt-6 pb-2">
        <div className="bg-slate-800/50 rounded-xl p-3 border border-slate-700">
           <p className="text-[10px] font-bold text-slate-500 uppercase mb-2 px-1">Wissel Modus</p>
           <button 
            onClick={() => setActiveTab('teacher-view')}
            className="w-full flex items-center justify-center gap-2 py-2 bg-indigo-600/20 text-indigo-400 rounded-lg text-xs font-bold border border-indigo-600/30 hover:bg-indigo-600/30 transition-all group"
           >
             <ArrowLeftRight size={14} className="group-hover:rotate-180 transition-transform duration-500" />
             Naar Portaal
           </button>
        </div>
      </div>

      <nav className="flex-1 py-4">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-6 py-3 transition-all duration-200 group relative ${
              activeTab === item.id
                ? 'bg-blue-600 text-white border-r-4 border-white'
                : 'hover:bg-slate-800/50 hover:text-white'
            }`}
          >
            <item.icon className={`h-5 w-5 ${activeTab === item.id ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
            <span className="font-semibold text-sm">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 bg-[#111827]">
        <div className="flex items-center space-x-3">
          <div className="w-9 h-9 rounded-full bg-blue-500 flex items-center justify-center font-bold text-white text-sm shadow-inner overflow-hidden">
            {acronym}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-white truncate">{userName}</p>
            <p className="text-[10px] text-slate-400 truncate uppercase tracking-tighter">
              {userRole === 'admin' ? 'ICT Coördinator' : 'School Beheer'}
            </p>
          </div>
          <button 
            onClick={logout}
            className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-500 hover:text-red-400 transition-colors group"
            title="Uitloggen"
          >
            <LogOut size={16} className="group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}
