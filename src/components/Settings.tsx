import React from 'react';
import { 
  Settings as SettingsIcon, School as SchoolIcon, 
  Tags, Mail, ListTodo, Shield, Save, Calendar as CalendarIcon,
  Trash2, PlusCircle, CheckCircle2, Zap
} from 'lucide-react';
import { Settings } from '../types';
import { SCHOOL_COLORS } from '../constants/theme';
import { motion } from 'motion/react';

interface SettingsPageProps {
  settings: Settings;
}

export default function SettingsPage({ settings }: SettingsPageProps) {
  return (
    <div className="space-y-10 pb-20 selection:bg-[#CFDCE2] selection:text-[#0F172A]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[#FDFBF7] -mx-8 -mt-8 px-10 py-8 border-b border-[#EAE1D2] shadow-sm mb-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-[#2A4652] text-white rounded-2xl flex items-center justify-center shadow-sm">
            <SettingsIcon size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-medium text-[#0F172A]">Systeem Instellingen</h2>
            <p className="text-stone-500 text-sm font-medium">Beheer scholen, categorieën en planning.</p>
          </div>
        </div>
        <button className="group px-8 py-4 bg-[#385B69] hover:bg-[#385B69] text-white rounded-2xl flex items-center gap-3 text-xs font-medium transition-all shadow-sm shadow-[#385B69]/20 active:scale-95">
          <Save size={18} />
          <span>Configuratie Opslaan</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Scholen */}
        <div className="bg-[#FDFBF7] p-8 rounded-2xl border border-[#EAE1D2] shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-stone-50">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-[#EAF1F4] text-[#385B69] rounded-xl flex items-center justify-center">
                  <SchoolIcon size={20} />
               </div>
               <h3 className="font-medium text-[#0F172A]">Beheerde Scholen</h3>
            </div>
          </div>
          <div className="space-y-3">
            {settings.scholen.map((s, i) => {
              const theme = SCHOOL_COLORS[s] || SCHOOL_COLORS['default'];
              return (
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  key={i} 
                  className="flex items-center justify-between p-4 bg-[#F4EFE6]/50 rounded-2xl border border-[#EAE1D2] group hover:border-[#CFDCE2] transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${theme.bg}`} />
                    <span className="text-sm font-medium text-slate-700">{s}</span>
                  </div>
                  <button className="p-2 text-[#8BA3AC] hover:text-[#9A5B64] hover:bg-[#F2E8E9] rounded-lg transition-all opacity-0 group-hover:opacity-100">
                    <Trash2 size={16} />
                  </button>
                </motion.div>
              );
            })}
            <button className="w-full mt-4 py-4 border-2 border-dashed border-[#EAE1D2] rounded-2xl text-stone-500 text-xs font-medium hover:border-[#5B889C] hover:text-[#385B69] transition-all flex items-center justify-center gap-2">
              <PlusCircle size={14} />
              School toevoegen
            </button>
          </div>
        </div>

        {/* Categorieën */}
        <div className="bg-[#FDFBF7] p-8 rounded-2xl border border-[#EAE1D2] shadow-sm space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-stone-50">
            <div className="w-10 h-10 bg-[#F2E8E9] text-[#9A5B64] rounded-xl flex items-center justify-center">
              <Tags size={20} />
            </div>
            <h3 className="font-medium text-[#0F172A]">Probleem Typen</h3>
          </div>
          <div className="flex flex-wrap gap-3">
            {settings.categorieen.map((c, i) => (
              <motion.span 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                key={i} 
                className="px-4 py-2 bg-[#F4EFE6] text-stone-700 border border-[#EAE1D2] rounded-xl text-xs font-medium flex items-center gap-3 group hover:border-[#5B889C] hover:bg-[#EAF1F4] transition-all cursor-default"
              >
                {c}
                <button className="text-[#8BA3AC] hover:text-[#9A5B64] transition-colors">
                  <Trash2 size={12} />
                </button>
              </motion.span>
            ))}
             <button className="px-4 py-2 border-2 border-dashed border-[#EAE1D2] rounded-xl text-stone-500 text-xs font-medium hover:border-[#B26E77] hover:text-[#9A5B64] transition-all flex items-center gap-2">
              <PlusCircle size={12} />
              Nieuw Type
            </button>
          </div>
        </div>

        {/* Agenda & Locatie Planning */}
        <div className="bg-[#FDFBF7] p-8 rounded-2xl border border-[#EAE1D2] shadow-sm space-y-8 md:col-span-2">
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-stone-50">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#EAF1F4] text-[#487184] rounded-2xl flex items-center justify-center">
                <CalendarIcon size={24} />
              </div>
              <div>
                <h3 className="font-medium text-[#0F172A]">Bezoekmatrix & Planning</h3>
                <p className="text-stone-500 text-sm font-medium">Stel je aanwezigheid per dag in.</p>
              </div>
            </div>
            <div className="flex gap-3">
               <button className="px-5 py-3 text-xs font-medium text-stone-500 hover:bg-[#F4EFE6] rounded-xl transition-all border border-[#EAE1D2] flex items-center gap-2 active:scale-95">
                 <Zap size={14} />
                 Vorige week kopiëren
               </button>
               <button className="px-5 py-3 text-xs font-medium text-white bg-[#2A4652] hover:bg-[#1f343d] rounded-xl transition-all shadow-sm active:scale-95 flex items-center gap-2">
                 <PlusCircle size={14} />
                 Batch Aanpassen
               </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-xs font-medium text-stone-500">
                  <th className="px-4 py-4">Datum</th>
                  <th className="px-4 py-4">Schooldag</th>
                  <th className="px-4 py-4">Geselecteerde Locatie</th>
                  <th className="px-4 py-4">Memo / Notitie</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-50">
                {settings.calendarEntries.slice(0, 10).map((item, i) => {
                  const dateObj = new Date(item.date);
                  const isSchool = settings.scholen.includes(item.location);
                  const theme = SCHOOL_COLORS[item.location] || SCHOOL_COLORS['default'];
                  
                  return (
                    <tr key={i} className="group hover:bg-[#F4EFE6]/50 transition-colors">
                      <td className="px-4 py-5">
                         <div className="flex flex-col">
                            <span className="text-sm font-medium text-[#0F172A]">{item.date}</span>
                            <span className="text-xs font-medium text-[#8BA3AC]">Mei 2024</span>
                         </div>
                      </td>
                      <td className="px-4 py-5">
                        <span className="text-xs font-medium text-stone-500">
                          {dateObj.toLocaleDateString('nl-BE', { weekday: 'long' })}
                        </span>
                      </td>
                      <td className="px-4 py-5">
                        <div className="relative group/select">
                          <select 
                            className={`w-full bg-[#FDFBF7] border border-[#EAE1D2] rounded-xl px-4 py-2.5 text-xs font-medium   outline-none focus:ring-4 focus:ring-[#EAF1F4] transition-all cursor-pointer appearance-none ${isSchool ? theme.accent : 'text-slate-600'}`}
                            defaultValue={item.location}
                          >
                            <option>Thuiswerk</option>
                            <option>Bureaudag</option>
                            <option>Ziek</option>
                            <option>Verlof</option>
                            {settings.scholen.map(s => <option key={s}>{s}</option>)}
                          </select>
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-20">
                             <CalendarIcon size={12} />
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-5">
                        <input 
                          type="text" 
                          placeholder="Bijv. Projectoverleg, onderhoud..."
                          className="w-full bg-transparent text-xs font-bold text-stone-500 outline-none border-b border-transparent focus:border-[#CFDCE2] py-1 transition-all placeholder:text-stone-200"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex items-center gap-5 p-6 bg-[#EDF2EF] border border-[#D4E0D8] rounded-2xl">
             <div className="w-14 h-14 bg-[#FDFBF7] text-[#557560] rounded-2xl flex items-center justify-center shrink-0 shadow-sm border border-[#D4E0D8]">
                <CheckCircle2 size={24} />
             </div>
             <div>
                <h4 className="text-lg font-medium text-[#2A4652] leading-none mb-1">Live Portaal Synchronisatie</h4>
                <p className="text-[#557560]/70 text-sm font-medium">Alle planningen zijn direct zichtbaar in de Google Agenda-weergave van de leerkrachten.</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
