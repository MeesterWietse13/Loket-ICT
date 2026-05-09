import React, { useState } from 'react';
import { 
  UserPlus, UserMinus, CheckCircle2, ChevronRight, 
  Search, Filter, Calendar, Mail, 
  FileText, ClipboardCheck, History, Clock,
  Check, Square, CheckSquare, Users, Copy, CheckCircle, Info
} from 'lucide-react';
import { PersonnelNotification, PersonnelNotificationType, PersonnelStatus, School } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { SCHOOL_COLORS } from '../constants/theme';

interface PersonnelProps {
  notifications: PersonnelNotification[];
  updateNotification: (id: string, updates: Partial<PersonnelNotification>) => void;
  schools: string[];
}

export default function Personnel({ notifications, updateNotification, schools }: PersonnelProps) {
  const [filterSchool, setFilterSchool] = useState<string>('Alle scholen');
  const [activeId, setActiveId] = useState<string | null>(notifications[0]?.id || null);
  const [copyStatus, setCopyStatus] = useState<string | null>(null);

  const filtered = notifications.filter(n => filterSchool === 'Alle scholen' || n.school === filterSchool);
  const activeNotification = notifications.find(n => n.id === activeId);

  const toggleChecklistItem = (notificationId: string, itemId: string) => {
    const notification = notifications.find(n => n.id === notificationId);
    if (!notification) return;

    const newChecklist = notification.checklist.map(item => 
      item.id === itemId ? { ...item, isCompleted: !item.isCompleted } : item
    );

    const allCompleted = newChecklist.every(item => item.isCompleted);
    const someCompleted = newChecklist.some(item => item.isCompleted);
    
    let newStatus: PersonnelStatus = 'nieuw';
    if (allCompleted) newStatus = 'afgerond';
    else if (someCompleted) newStatus = 'bezig';

    updateNotification(notificationId, { 
      checklist: newChecklist,
      status: newStatus,
      datumAfgerond: allCompleted ? new Date().toISOString().split('T')[0] : undefined
    });
  };

  const generateWelcomeText = (notif: PersonnelNotification) => {
    const schoolDomain = notif.school === 'Matadi' ? 'matadi.school' : 
                         notif.school === 'De Grasmus' ? 'degrasmus.be' :
                         notif.school === 'De Klare Bron' ? 'deklarebron.be' : 'klaverblad.be';
    
    const firstName = notif.voornaam;
    const lastName = notif.naam.replace(/\s/g, '');
    const emailPrefix = `${firstName.toLowerCase()}.${lastName.toLowerCase()}`;
    const smartschoolLogin = (firstName.charAt(0).toLowerCase() + lastName.toLowerCase()).substring(0, 15);
    const basePassword = `${notif.school}123`;
    const smartschoolPassword = `${notif.school} 123`;
    
    return `Hallo ${firstName}
Welkom!

Schoolmail & Office365
Je schoolmailadres is ${emailPrefix}@${schoolDomain}
Je kan hiermee inloggen op de website: office.com
Wachtwoord: ${basePassword}

Vanuit deze omgeving kan je Office installeren op maximaal vijf toestellen.
Deze mailbox gebruiken we voor contact met externen. Intern gebruiken we Smartschool.
Je kan dit mailadres ook gebruiken om je aan te melden bij Google, maar dat is optioneel.

Standaard werken we met Smartschool en Microsoft Office

Smartschool-account
URL: https://${notif.school.toLowerCase().replace(/\s/g, '')}.smartschool.be/login
Login: ${smartschoolLogin}
Wachtwoord: ${smartschoolPassword}

Laptop school/Printer school
${notif.laptopNodig 
  ? 'Heb je een laptop nodig van de school? Laat het me weten, dan maak ik deze de komende week voor je klaar en spreken we een moment af dat je hem ophaalt.' 
  : 'Voor de installatie van de printer op school op een eigen toestel mag je altijd langskomen: \nWil je zelf proberen: https://sites.google.com/leefscholenleuven.be/sos-ict-' + notif.school.toLowerCase().replace(/\s/g, '') + '/printers-uniflow\nOpgelet: Kijk naar de naam van de driver. Het is niet meer de eerste zoals in het filmpje gezegd wordt, maar de 2e driver uit de lijst.'}

${notif.bingelAccount ? `Account Bingel:
Account: ${emailPrefix}
Wachtwoord: ${basePassword}` : ''}

${notif.scoodleAccount ? `Account Scoodle:
Account: ${emailPrefix}
Wachtwoord: ${basePassword}` : ''}`;
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopyStatus(id);
    setTimeout(() => setCopyStatus(null), 2000);
  };

  return (
    <div className="space-y-8 pb-20 selection:bg-indigo-100 selection:text-indigo-900">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white -mx-8 -mt-8 px-10 py-8 border-b border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.02)] mb-10">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-600 text-white rounded-2xl flex items-center justify-center shadow-xl shadow-emerald-600/20">
            <Users size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-black text-slate-900 tracking-tight uppercase">Personeelswissels</h2>
            <div className="flex gap-2 mt-1">
              <span className="px-2 py-0.5 rounded-lg text-[10px] font-black bg-emerald-50 text-emerald-600 border border-emerald-100 uppercase tracking-widest">
                {notifications.filter(n => n.type === 'nieuwe medewerker').length} Instroom
              </span>
              <span className="px-2 py-0.5 rounded-lg text-[10px] font-black bg-rose-50 text-rose-600 border border-rose-100 uppercase tracking-widest">
                {notifications.filter(n => n.type === 'vertrekkende medewerker').length} Uitstroom
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 p-1.5 bg-slate-50 border border-slate-100 rounded-2xl">
            <select 
              className="bg-transparent outline-none font-black text-[10px] uppercase tracking-widest text-slate-500 px-3 py-2 cursor-pointer"
              value={filterSchool}
              onChange={(e) => setFilterSchool(e.target.value)}
            >
              <option>Alle scholen</option>
              {schools.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <button className="group px-6 py-3 bg-slate-900 hover:bg-black text-white rounded-2xl flex items-center gap-2.5 transition-all shadow-xl shadow-slate-900/10 active:scale-95 text-[10px] font-black uppercase tracking-widest">
            <History size={16} />
            <span>Historiek</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* List side */}
        <div className="lg:col-span-5 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden flex flex-col h-[75vh]">
          <div className="p-6 border-b border-slate-50 bg-slate-50/30">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors" size={18} />
              <input 
                type="text" 
                placeholder="Zoek personeelslid..." 
                className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-emerald-50 outline-none text-sm font-bold placeholder:text-slate-300 transition-all"
              />
            </div>
          </div>
          <div className="flex-1 overflow-y-auto divide-y divide-slate-50 no-scrollbar">
            {filtered.map((notif) => (
              <button 
                key={notif.id}
                onClick={() => setActiveId(notif.id)}
                className={`w-full p-6 text-left transition-all hover:bg-slate-50/50 relative flex items-center gap-5 ${activeId === notif.id ? 'bg-emerald-50/30' : ''}`}
              >
                {activeId === notif.id && (
                  <motion.div layoutId="active-indicator" className="absolute left-0 top-2 bottom-2 w-1.5 bg-emerald-600 rounded-r-full" />
                )}
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-sm ${
                  notif.type === 'nieuwe medewerker' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                }`}>
                  {notif.type === 'nieuwe medewerker' ? <UserPlus size={24} /> : <UserMinus size={24} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start mb-1">
                    <h4 className="font-black text-slate-900 truncate text-base tracking-tight uppercase">{notif.voornaam} {notif.naam}</h4>
                    <span className="text-[10px] font-black text-slate-400 whitespace-nowrap tracking-wider">{notif.datum}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[9px] font-black uppercase tracking-widest ${SCHOOL_COLORS[notif.school]?.accent || 'text-slate-500'}`}>{notif.school}</span>
                    <span className="w-1 h-1 rounded-full bg-slate-200" />
                    <span className="text-[10px] font-bold text-slate-400 truncate uppercase tracking-tight">{notif.functie}</span>
                  </div>
                  
                  {/* Progress bar */}
                  <div className="mt-3 bg-slate-100 h-1.5 w-full rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${(notif.checklist.filter(c => c.isCompleted).length / notif.checklist.length) * 100}%` }}
                      className={`h-full transition-all duration-700 ease-out rounded-full ${notif.status === 'afgerond' ? 'bg-emerald-500' : 'bg-indigo-500'}`}
                    />
                  </div>
                </div>
                <ChevronRight size={18} className={`transition-transform duration-300 ${activeId === notif.id ? 'translate-x-1 text-emerald-500' : 'text-slate-300'}`} />
              </button>
            ))}
          </div>
        </div>

        {/* Detail side */}
        <div className="lg:col-span-7 h-[75vh]">
          <AnimatePresence mode="wait">
            {activeNotification ? (
              <motion.div 
                key={activeNotification.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm flex flex-col h-full overflow-hidden"
              >
                {/* Visual Accent Header */}
                <div className={`h-3 w-full bg-gradient-to-r ${activeNotification.type === 'nieuwe medewerker' ? 'from-emerald-400 via-emerald-600 to-teal-500' : 'from-rose-400 via-rose-600 to-orange-500'}`} />
                
                <div className="p-10 border-b border-slate-50 relative overflow-hidden bg-slate-50/20">
                   {/* Background decoration */}
                   <div className={`absolute top-0 right-0 w-80 h-80 ${activeNotification.type === 'nieuwe medewerker' ? 'bg-emerald-500' : 'bg-rose-500'} opacity-[0.04] -mr-20 -mt-20 rounded-full blur-3xl`} />
                   
                   <div className="relative z-10">
                      <div className="flex justify-between items-start mb-8">
                        <div className="flex items-center gap-4">
                           <div className={`px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg ${
                             activeNotification.type === 'nieuwe medewerker' ? 'bg-emerald-600 text-white shadow-emerald-500/20' : 'bg-rose-600 text-white shadow-rose-500/20'
                           }`}>
                             {activeNotification.type}
                           </div>
                           <div className={`px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg ${
                             activeNotification.status === 'afgerond' ? 'bg-indigo-600 text-white shadow-indigo-500/20' : 
                             activeNotification.status === 'bezig' ? 'bg-orange-500 text-white shadow-orange-500/20' : 
                             'bg-white text-slate-500 border border-slate-200'
                           }`}>
                             {activeNotification.status}
                           </div>
                        </div>
                        {activeNotification.datumAfgerond && (
                          <div className="flex items-center gap-2 text-emerald-600 text-[10px] font-black uppercase tracking-widest bg-emerald-50 px-5 py-2.5 rounded-2xl border border-emerald-100 shadow-sm">
                            <CheckCircle size={16} />
                            Afgehandeld op: {activeNotification.datumAfgerond}
                          </div>
                        )}
                      </div>

                      <h3 className="text-5xl font-black text-slate-900 tracking-tight uppercase mb-10 drop-shadow-sm">{activeNotification.voornaam} {activeNotification.naam}</h3>
                      
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-10">
                        <div className="bg-white/60 p-4 rounded-2xl border border-white/80 shadow-sm transition-transform hover:-translate-y-1">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">School</p>
                          <div className={`flex items-center gap-2 font-black text-sm uppercase tracking-wider ${SCHOOL_COLORS[activeNotification.school]?.accent || 'text-slate-700'}`}>
                            <FileText size={18} />
                            {activeNotification.school}
                          </div>
                        </div>
                        <div className="bg-white/60 p-4 rounded-2xl border border-white/80 shadow-sm transition-transform hover:-translate-y-1">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Email</p>
                          <div className="flex items-center gap-2 font-bold text-sm text-slate-700 truncate">
                            <Mail size={18} />
                            {activeNotification.email}
                          </div>
                        </div>
                        <div className="bg-white/60 p-4 rounded-2xl border border-white/80 shadow-sm transition-transform hover:-translate-y-1">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">Functie</p>
                          <div className="flex items-center gap-2 font-bold text-sm text-slate-700 uppercase tracking-tight">
                            <Users size={18} />
                            {activeNotification.functie}
                          </div>
                        </div>
                        <div className="bg-white/60 p-4 rounded-2xl border border-white/80 shadow-sm transition-transform hover:-translate-y-1">
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-2">{activeNotification.type === 'nieuwe medewerker' ? 'Startdatum' : 'Vertrekdatum'}</p>
                          <div className="flex items-center gap-2 font-bold text-sm text-slate-700">
                            <Calendar size={18} />
                            {activeNotification.datum}
                          </div>
                        </div>
                      </div>
                   </div>
                </div>

                <div className="flex-1 p-10 overflow-y-auto no-scrollbar bg-[radial-gradient(at_top_right,rgba(59,130,246,0.03),transparent_40%),radial-gradient(at_bottom_left,rgba(16,185,129,0.03),transparent_40%)]">
                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                      {/* Left: Checklist */}
                      <div className="bg-white/40 backdrop-blur-sm p-8 rounded-[2.5rem] border border-white/60 shadow-sm">
                        <div className="flex items-center justify-between mb-8">
                           <h4 className="text-xl font-black text-slate-900 tracking-tight uppercase flex items-center gap-3">
                            <div className="w-10 h-10 bg-emerald-500 text-white rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
                              <ClipboardCheck size={20} />
                            </div>
                            ICT Checklist
                           </h4>
                           <div className="flex flex-col items-end">
                             <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Voortgang</span>
                             <span className="text-sm font-black text-emerald-600">
                               {activeNotification.checklist.filter(c => c.isCompleted).length} / {activeNotification.checklist.length}
                             </span>
                           </div>
                        </div>
                        <div className="space-y-3">
                          {activeNotification.checklist.map((item) => (
                            <button 
                              key={item.id}
                              onClick={() => toggleChecklistItem(activeNotification.id, item.id)}
                              className={`w-full flex items-center justify-between p-5 rounded-3xl border-2 transition-all text-left shadow-sm group ${
                                item.isCompleted 
                                ? 'bg-emerald-500 border-emerald-500 text-white shadow-emerald-500/20' 
                                : 'bg-white border-slate-100 text-slate-600 hover:border-emerald-200'
                              }`}
                            >
                              <div className="flex items-center gap-4">
                                {item.isCompleted ? (
                                  <div className="w-6 h-6 bg-white/20 rounded-xl flex items-center justify-center text-white">
                                    <Check size={16} strokeWidth={4} />
                                  </div>
                                ) : (
                                  <div className="w-6 h-6 bg-slate-50 border-2 border-slate-200 rounded-xl group-hover:border-emerald-300 transition-colors" />
                                )}
                                <span className={`font-black text-xs uppercase tracking-widest ${item.isCompleted ? 'opacity-90' : ''}`}>
                                  {item.label}
                                </span>
                              </div>
                              {item.isCompleted && <CheckCircle2 size={16} className="text-white/60" />}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Right: Actions & Text */}
                      <div className="space-y-8">
                         {activeNotification.type === 'nieuwe medewerker' && (
                           <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden shadow-2xl shadow-slate-900/40 group">
                              <div className="absolute top-0 right-0 p-8 opacity-[0.05] rotate-12 -mr-12 -mt-12 group-hover:rotate-6 transition-transform duration-700">
                                 <FileText size={200} />
                              </div>
                              <div className="relative z-10">
                                <h4 className="text-2xl font-black tracking-tight uppercase mb-2">Welkomsttekst</h4>
                                <p className="text-slate-400 text-xs font-medium mb-8">Gegenereerd sjabloon om te verzenden.</p>
                                
                                <div className="p-6 bg-white/[0.03] border border-white/10 rounded-[2rem] mb-8 max-h-[250px] overflow-y-auto no-scrollbar font-mono text-[11px] leading-relaxed text-slate-300 shadow-inner">
                                   <pre className="whitespace-pre-wrap">{generateWelcomeText(activeNotification)}</pre>
                                </div>

                                <button 
                                  onClick={() => copyToClipboard(generateWelcomeText(activeNotification), 'welcome')}
                                  className={`w-full py-5 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-3 shadow-xl ${
                                    copyStatus === 'welcome' ? 'bg-emerald-500 text-white shadow-emerald-500/20' : 'bg-white text-slate-900 hover:bg-slate-100 hover:scale-[1.02] active:scale-95'
                                  }`}
                                >
                                  {copyStatus === 'welcome' ? (
                                    <>
                                      <CheckCircle2 size={20} />
                                      Gecopieerd naar klembord!
                                    </>
                                  ) : (
                                    <>
                                      <Copy size={20} />
                                      Copieer volledige tekst
                                    </>
                                  )}
                                </button>
                              </div>
                           </div>
                         )}

                         <div className="bg-white/60 backdrop-blur-sm p-8 rounded-[2.5rem] border border-white/60 shadow-sm space-y-8">
                           <h4 className="text-sm font-black text-slate-900 tracking-tight uppercase mb-6 flex items-center gap-3">
                              <Info size={18} className="text-slate-400" />
                              Details & Nota's
                           </h4>
                           <div className="space-y-6">
                             <div className="grid grid-cols-2 gap-4">
                                <div className={`p-4 rounded-2xl border ${activeNotification.laptopNodig ? 'bg-emerald-50 border-emerald-100' : 'bg-slate-100 border-slate-200 opacity-50'}`}>
                                   <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Laptop</p>
                                   <p className="text-[10px] font-black uppercase tracking-widest">{activeNotification.laptopNodig ? 'NODIG' : 'NIET NODIG'}</p>
                                </div>
                                <div className={`p-4 rounded-2xl border ${activeNotification.bingelAccount || activeNotification.scoodleAccount ? 'bg-indigo-50 border-indigo-100' : 'bg-slate-100 border-slate-200 opacity-50'}`}>
                                   <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Accounts</p>
                                   <p className="text-[10px] font-black uppercase tracking-widest">
                                     {activeNotification.bingelAccount ? 'BINGEL ' : ''}
                                     {activeNotification.scoodleAccount ? 'SCOODLE' : ''}
                                     {!activeNotification.bingelAccount && !activeNotification.scoodleAccount ? 'GEEN EXTRA' : ''}
                                   </p>
                                </div>
                             </div>
                             
                             <div>
                               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Bericht van Directie</label>
                               <div className="p-5 bg-white border border-slate-100 rounded-2xl text-xs text-slate-600 font-medium italic shadow-sm">
                                 "{activeNotification.opmerkingen || 'Geen extra opmerkingen bij deze melding.'}"
                               </div>
                             </div>

                             <div>
                               <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3 block">Mijn Interne Nota</label>
                               <textarea 
                                 className="w-full p-5 bg-white border border-slate-200 rounded-2xl text-xs font-bold text-slate-800 min-h-[120px] outline-none focus:ring-4 focus:ring-indigo-50 transition-all placeholder:text-slate-200"
                                 placeholder="Voeg eigen aantekeningen toe..."
                                 value={activeNotification.interneNota}
                                 onChange={(e) => updateNotification(activeNotification.id, { interneNota: e.target.value })}
                               />
                             </div>
                           </div>
                         </div>
                      </div>
                   </div>
                </div>
              </motion.div>
            ) : (
              <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm flex items-center justify-center h-full p-12 text-center">
                 <div>
                    <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                      <Users className="text-slate-200" size={48} />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 tracking-tight uppercase mb-2">Selectie Vereist</h3>
                    <p className="text-slate-400 text-sm font-medium">Kies een personeelslid aan de linkerkant om de afvinklijst te openen.</p>
                 </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
