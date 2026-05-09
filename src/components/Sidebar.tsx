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
    <div className="w-64 bg-[#EAF1F4] text-[#0F172A] h-screen flex flex-col fixed left-0 top-0 border-r border-[#CFDCE2] z-20">
      <div className="p-6 border-b border-[#CFDCE2]">
        <h1 className="text-xl font-bold tracking-tight text-[#0F172A] flex items-center gap-3">
          <div className="w-10 h-10 bg-[#385B69] rounded-xl flex items-center justify-center shadow-sm shrink-0">
            <span className="text-white font-bold text-sm">ICT</span>
          </div>
          Loket ICT
        </h1>
        <p className="text-xs text-[#487184] font-medium leading-relaxed pr-2 mt-3">Overzicht en opvolging voor de scholen.</p>
      </div>

      <div className="px-5 pt-6 pb-2">
        <div className="bg-[#F4EFE6] rounded-2xl p-4 border border-[#EAE1D2]">
           <p className="text-xs font-medium text-[#96723D] mb-3">Snelle toegang</p>
           <button 
            onClick={() => setActiveTab('teacher-view')}
            className="w-full flex items-center justify-center gap-2 py-3 bg-[#FDFBF7] text-[#0F172A] rounded-xl text-sm font-medium border border-[#EAE1D2] hover:bg-[#FDFBF7] transition-all group shadow-sm"
           >
             <ArrowLeftRight size={16} className="group-hover:rotate-180 transition-transform duration-500 text-[#96723D]" />
             Naar Portaal
           </button>
        </div>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl transition-all duration-200 group relative ${
              activeTab === item.id
                ? 'bg-[#FDFBF7] text-[#0F172A] shadow-sm border border-[#CFDCE2]'
                : 'text-[#487184] hover:bg-[#FDFBF7]/40 hover:text-[#0F172A]'
            }`}
          >
            <item.icon className={`h-5 w-5 ${activeTab === item.id ? 'text-[#385B69]' : 'text-[#487184] group-hover:text-[#385B69]'}`} strokeWidth={activeTab === item.id ? 2.5 : 2} />
            <span className="font-medium text-sm">{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-4 bg-[#CFDCE2]/30 border-t border-[#CFDCE2]">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-[#FDFBF7] border border-[#CFDCE2] flex items-center justify-center font-bold text-[#385B69] text-sm overflow-hidden shadow-sm">
            {acronym}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-[#0F172A] truncate">{userName}</p>
            <p className="text-xs text-[#487184] font-medium truncate">
               {userRole === 'admin' ? 'ICT Coördinator' : 'School Beheer'}
            </p>
          </div>
          <button 
            onClick={logout}
            className="p-2 hover:bg-[#FDFBF7]/60 rounded-xl text-[#487184] hover:text-[#9A5B64] transition-colors group"
            title="Uitloggen"
          >
            <LogOut size={18} className="group-hover:scale-110 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
}
