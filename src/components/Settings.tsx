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
    <div className="space-y-10 pb-20 selection:bg-indigo-100 selection:text-indigo-900">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white -mx-8 -mt-8 px-10 py-8 border-b border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.02)] mb-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-slate-900 text-white rounded-2xl flex items-center justify-center shadow-xl">
            <SettingsIcon size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Systeem Instellingen</h2>
            <p className="text-slate-400 text-sm font-medium">Beheer scholen, categorieën en planning.</p>
          </div>
        </div>
        <button className="group px-8 py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl flex items-center gap-3 text-xs font-black uppercase tracking-[0.1em] transition-all shadow-xl shadow-indigo-600/20 active:scale-95">
          <Save size={18} />
          <span>Configuratie Opslaan</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Scholen */}
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-slate-50">
            <div className="flex items-center gap-3">
               <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                  <SchoolIcon size={20} />
               </div>
               <h3 className="font-black text-slate-900 tracking-tight uppercase">Beheerde Scholen</h3>
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
                  className="flex items-center justify-between p-4 bg-slate-50/50 rounded-2xl border border-slate-100 group hover:border-indigo-100 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${theme.bg}`} />
                    <span className="text-sm font-black text-slate-700">{s}</span>
                  </div>
                  <button className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all opacity-0 group-hover:opacity-100">
                    <Trash2 size={16} />
                  </button>
                </motion.div>
              );
            })}
            <button className="w-full mt-4 py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 text-[10px] font-black uppercase tracking-widest hover:border-indigo-300 hover:text-indigo-600 transition-all flex items-center justify-center gap-2">
              <PlusCircle size={14} />
              School toevoegen
            </button>
          </div>
        </div>

        {/* Categorieën */}
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-slate-50">
            <div className="w-10 h-10 bg-rose-50 text-rose-600 rounded-xl flex items-center justify-center">
              <Tags size={20} />
            </div>
            <h3 className="font-black text-slate-900 tracking-tight uppercase">Probleem Typen</h3>
          </div>
          <div className="flex flex-wrap gap-3">
            {settings.categorieen.map((c, i) => (
              <motion.span 
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: i * 0.05 }}
                key={i} 
                className="px-4 py-2 bg-slate-50 text-slate-800 border border-slate-200 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 group hover:border-indigo-300 hover:bg-indigo-50 transition-all cursor-default"
              >
                {c}
                <button className="text-slate-300 hover:text-rose-500 transition-colors">
                  <Trash2 size={12} />
                </button>
              </motion.span>
            ))}
             <button className="px-4 py-2 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 text-[10px] font-black uppercase tracking-widest hover:border-rose-300 hover:text-rose-600 transition-all flex items-center gap-2">
              <PlusCircle size={12} />
              Nieuw Type
            </button>
          </div>
        </div>

        {/* Agenda & Locatie Planning */}
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm space-y-8 md:col-span-2">
           <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-slate-50">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                <CalendarIcon size={24} />
              </div>
              <div>
                <h3 className="font-black text-slate-900 tracking-tight uppercase">Bezoekmatrix & Planning</h3>
                <p className="text-slate-400 text-sm font-medium">Stel je aanwezigheid per dag in.</p>
              </div>
            </div>
            <div className="flex gap-3">
               <button className="px-5 py-3 text-[10px] font-black text-slate-500 uppercase tracking-widest hover:bg-slate-50 rounded-xl transition-all border border-slate-200 flex items-center gap-2 active:scale-95">
                 <Zap size={14} />
                 Vorige week kopiëren
               </button>
               <button className="px-5 py-3 text-[10px] font-black text-white bg-slate-900 hover:bg-black rounded-xl transition-all shadow-lg active:scale-95 flex items-center gap-2">
                 <PlusCircle size={14} />
                 Batch Aanpassen
               </button>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="uppercase tracking-[0.2em] text-[10px] font-black text-slate-400">
                  <th className="px-4 py-4">Datum</th>
                  <th className="px-4 py-4">Schooldag</th>
                  <th className="px-4 py-4">Geselecteerde Locatie</th>
                  <th className="px-4 py-4">Memo / Notitie</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {settings.calendarEntries.slice(0, 10).map((item, i) => {
                  const dateObj = new Date(item.date);
                  const isSchool = settings.scholen.includes(item.location);
                  const theme = SCHOOL_COLORS[item.location] || SCHOOL_COLORS['default'];
                  
                  return (
                    <tr key={i} className="group hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-5">
                         <div className="flex flex-col">
                            <span className="text-sm font-black text-slate-900 tracking-tight">{item.date}</span>
                            <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Mei 2024</span>
                         </div>
                      </td>
                      <td className="px-4 py-5">
                        <span className="text-xs font-black text-slate-500 uppercase tracking-wider">
                          {dateObj.toLocaleDateString('nl-BE', { weekday: 'long' })}
                        </span>
                      </td>
                      <td className="px-4 py-5">
                        <div className="relative group/select">
                          <select 
                            className={`w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-xs font-black uppercase tracking-widest outline-none focus:ring-4 focus:ring-indigo-50 transition-all cursor-pointer appearance-none ${isSchool ? theme.accent : 'text-slate-600'}`}
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
                          className="w-full bg-transparent text-xs font-bold text-slate-400 outline-none border-b border-transparent focus:border-indigo-200 py-1 transition-all placeholder:text-slate-200 tracking-tight"
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="flex items-center gap-5 p-6 bg-emerald-50 border border-emerald-100 rounded-[2rem]">
             <div className="w-14 h-14 bg-white text-emerald-600 rounded-[1.2rem] flex items-center justify-center shrink-0 shadow-sm border border-emerald-50">
                <CheckCircle2 size={24} />
             </div>
             <div>
                <h4 className="text-lg font-black text-emerald-900 tracking-tight uppercase leading-none mb-1">Live Portaal Synchronisatie</h4>
                <p className="text-emerald-700/70 text-sm font-medium">Alle planningen zijn direct zichtbaar in de Google Agenda-weergave van de leerkrachten.</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
