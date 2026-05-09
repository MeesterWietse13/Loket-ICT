import React, { useState, useMemo, useEffect } from 'react';
import { Send, MapPin, Info, CheckCircle, AlertCircle, Calendar, List, PlusCircle, Search, Clock, Globe, ArrowRight, UserPlus, Square, CheckSquare, LogOut } from 'lucide-react';
import { School, ICTRequest, CalendarEntry } from '../types';
import VisitCalendar from './VisitCalendar';
import { motion, AnimatePresence } from 'motion/react';
import { SCHOOL_COLORS } from '../constants/theme';
import { UserRole } from '../types';

interface TeacherPortalProps {
  userRole: UserRole;
  userSchool: School | 'Centraal' | '';
  logout: () => void;
  goToDashboard?: () => void;
  onLogin?: (role: UserRole, school: string) => void;
  schools: string[];
  categories: string[];
  calendarEntries: CalendarEntry[];
  addRequest: (request: any) => void;
  addPersonnelNotification: (notification: any) => void;
  requests: ICTRequest[];
  standaardChecklistNieuw: string[];
  standaardChecklistVertrek: string[];
}

export default function TeacherPortal({ 
  userRole, userSchool, logout, goToDashboard, onLogin,
  schools, categories, calendarEntries, addRequest, addPersonnelNotification, 
  requests, standaardChecklistNieuw, standaardChecklistVertrek 
}: TeacherPortalProps) {
  const [view, setView] = useState<'welcome' | 'school-home' | 'form' | 'personnel-form' | 'status' | 'success'>('welcome');
  const [selectedSchool, setSelectedSchool] = useState<School | ''>(userSchool === 'Centraal' ? '' : userSchool);
  const [loginMode, setLoginMode] = useState<'leerkracht' | 'directie'>('leerkracht');

  useEffect(() => {
    const newSchool = userSchool === 'Centraal' ? '' : userSchool;
    setSelectedSchool(newSchool);
    if (!newSchool) {
      setView('welcome');
      setLoginMode('leerkracht');
    }
  }, [userSchool]);

  useEffect(() => {
    if (selectedSchool && view === 'welcome') {
      setView('school-home');
    }
  }, [selectedSchool, view]);
  const [formData, setFormData] = useState({
    aanvrager: '',
    email: '',
    categorie: categories[0],
    omschrijving: '',
    prioriteit: 'normaal' as any,
    beschikbareDagen: [] as string[]
  });

  const toggleDay = (day: string) => {
    setFormData(prev => ({
      ...prev,
      beschikbareDagen: prev.beschikbareDagen.includes(day)
        ? prev.beschikbareDagen.filter(d => d !== day)
        : [...prev.beschikbareDagen, day]
    }));
  };

  const [personnelData, setPersonnelData] = useState({
    naam: '',
    voornaam: '',
    type: 'nieuwe medewerker' as any,
    datum: '',
    functie: '',
    opmerkingen: '',
    laptopNodig: false,
    bingelAccount: false,
    scoodleAccount: false
  });

  const schoolRequests = useMemo(() => {
    return requests.filter(r => r.school === selectedSchool);
  }, [requests, selectedSchool]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSchool) return;

    addRequest({
      school: selectedSchool,
      ...formData,
      datum: new Date().toISOString().split('T')[0],
      status: 'nieuw',
      isRemote: false,
      interneNota: ''
    });
    setView('success');
  };

  const handlePersonnelSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSchool) return;

    const checklistLabels = personnelData.type === 'nieuwe medewerker' 
      ? standaardChecklistNieuw 
      : standaardChecklistVertrek;

    const checklist = checklistLabels.map((label, idx) => ({
      id: `c-${idx}-${Date.now()}`,
      label,
      isCompleted: false
    }));

    addPersonnelNotification({
      school: selectedSchool,
      ...personnelData,
      email: `${personnelData.voornaam.toLowerCase()}.${personnelData.naam.toLowerCase().replace(/\s/g, '')}@leefscholenleuven.be`,
      status: 'nieuw',
      interneNota: '',
      checklist
    });
    setView('success');
  };

  const getAPIChannel = (school: string) => {
    if (school === 'Matadi' || school === 'Klaverblad') return 'Smartschool';
    return 'Gmail';
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] flex flex-col items-center p-4 md:p-12 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <div className="max-w-4xl w-full space-y-12">
        <header className="text-center space-y-4">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-slate-900 text-white rounded-[2rem] shadow-2xl shadow-slate-900/20 mb-2"
          >
            <span className="font-black text-2xl tracking-tighter">ICT</span>
          </motion.div>
          <div className="space-y-1">
            <h1 className="text-4xl font-black text-slate-900 tracking-tight sm:text-5xl">Leerkrachten Portaal</h1>
            <p className="text-slate-400 font-medium text-lg">Snelle ICT-ondersteuning voor jouw klas.</p>
          </div>
        </header>

        <section className="space-y-4">
          <VisitCalendar entries={calendarEntries} />
        </section>

        <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden min-h-[500px] relative">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-indigo-600" />
          
          <AnimatePresence mode="wait">
            {view === 'welcome' && (
              <motion.div 
                key="welcome"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                className="p-10 md:p-16 space-y-10 text-center"
              >
                <div className="space-y-2">
                  <h2 className="text-2xl font-black text-slate-900 uppercase tracking-tight">
                    {loginMode === 'leerkracht' ? 'Kies jouw school' : 'Directie Login'}
                  </h2>
                  <p className="text-slate-400">
                    {loginMode === 'leerkracht' ? 'Selecteer de vestiging waar je hulp nodig hebt.' : 'Voor welke school wil je inloggen als directie?'}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {schools.map((school) => {
                    const theme = SCHOOL_COLORS[school] || SCHOOL_COLORS['default'];
                    return (
                      <button
                        key={school}
                        onClick={() => {
                          if (loginMode === 'directie' && onLogin) {
                            onLogin('directie', school);
                          } else if (onLogin) {
                            onLogin('leerkracht', school);
                          } else {
                            setSelectedSchool(school as School);
                            setView('school-home');
                          }
                        }}
                        className={`p-8 rounded-[2rem] border-2 bg-white ${theme.border} hover:shadow-xl transition-all group flex flex-col items-center gap-4 active:scale-95 text-left relative overflow-hidden`}
                      >
                        <div className={`absolute top-0 right-0 w-24 h-24 ${theme.bg} opacity-5 -mr-8 -mt-8 rounded-full group-hover:scale-110 transition-transform`} />
                        <div className={`w-16 h-16 ${theme.light} ${theme.text} rounded-2xl flex items-center justify-center transition-transform group-hover:rotate-6 shadow-sm`}>
                          <MapPin size={32} />
                        </div>
                        <div className="text-center relative z-10">
                          <span className="font-black text-xl text-slate-900 block mb-1 tracking-tight">{school}</span>
                          <span className={`text-[10px] ${theme.text} font-black uppercase tracking-widest`}>Tik om te openen</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
                
                <div className="pt-8 border-t border-slate-100 mt-4 flex flex-col sm:flex-row items-center justify-center gap-6">
                  {loginMode === 'directie' ? (
                    <button 
                      onClick={() => setLoginMode('leerkracht')}
                      className="text-[10px] font-black text-slate-400 hover:text-slate-900 uppercase tracking-widest transition-colors"
                    >
                      ← Terug naar Leerkrachten
                    </button>
                  ) : (
                    <div className="flex items-center gap-8">
                      <button 
                        onClick={() => setLoginMode('directie')}
                        className="text-[10px] font-black text-slate-400 hover:text-emerald-600 uppercase tracking-widest transition-colors flex items-center gap-2"
                      >
                       <UserPlus size={14} /> Directie Toegang
                      </button>
                      <button 
                        onClick={() => onLogin?.('admin', 'Centraal')}
                        className="text-[10px] font-black text-slate-400 hover:text-indigo-600 uppercase tracking-widest transition-colors flex items-center gap-2"
                      >
                       <LogOut size={14} /> ICT Beheer
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {view === 'school-home' && (
              <motion.div 
                key="school-home"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="p-10 md:p-16 space-y-10"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {userRole === 'admin' && goToDashboard && (
                      <button 
                        onClick={goToDashboard}
                        className="flex items-center gap-2 text-[10px] font-black text-indigo-600 hover:text-indigo-800 transition-colors uppercase tracking-widest bg-indigo-50 px-4 py-2 rounded-xl border border-indigo-100"
                      >
                         Beheer Portaal
                      </button>
                    )}
                    <button onClick={() => {
                      if (userSchool === 'Centraal') setView('welcome');
                      else logout();
                    }} className="group flex items-center gap-2 text-sm font-black text-slate-400 hover:text-slate-900 transition-colors">
                      <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center group-hover:bg-slate-100">
                        {userSchool === 'Centraal' ? '←' : <LogOut size={16} />}
                      </div>
                      {userSchool === 'Centraal' ? 'WISSEL VAN SCHOOL' : 'UITLOGGEN'}
                    </button>
                  </div>
                  <div className={`px-5 py-2 rounded-2xl border text-sm font-black uppercase tracking-widest flex items-center gap-2 shadow-sm ${
                    SCHOOL_COLORS[selectedSchool as string]?.bg || 'bg-indigo-600'
                  } text-white`}>
                    <MapPin size={14} />
                    {selectedSchool}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <button 
                    onClick={() => setView('form')}
                    className="p-10 bg-slate-900 text-white rounded-[2rem] text-left space-y-6 hover:bg-black transition-all shadow-2xl shadow-slate-900/10 active:scale-[0.98] group relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 -mr-12 -mt-12 rounded-full" />
                    <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform text-white">
                      <PlusCircle size={28} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black tracking-tight mb-2 uppercase">Nieuwe Melding</h3>
                      <p className="text-slate-400 text-sm leading-relaxed font-bold">Probleem of vraag? Meld het hier en we helpen je snel.</p>
                    </div>
                    <div className="pt-2 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-emerald-400">
                      Nu versturen <ArrowRight size={14} />
                    </div>
                  </button>

                  {userRole !== 'leerkracht' && (
                    <button 
                      onClick={() => setView('personnel-form')}
                      className="p-10 rounded-[2rem] text-left space-y-6 transition-all shadow-2xl active:scale-[0.98] group relative overflow-hidden bg-indigo-600 text-white hover:bg-indigo-700 shadow-indigo-600/10"
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 -mr-12 -mt-12 rounded-full" />
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 bg-white/20 text-white">
                        <UserPlus size={28} />
                      </div>
                      <div>
                        <h3 className="text-2xl font-black tracking-tight mb-2 uppercase text-white">Wissel Personeel</h3>
                        <p className="text-sm leading-relaxed font-bold text-indigo-100/70">
                          Meld een nieuwe collega of een vertrek. Wij brengen alles in orde.
                        </p>
                      </div>
                      <div className="pt-2 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-white">
                        Meld wissel <ArrowRight size={14} />
                      </div>
                    </button>
                  )}

                  <button 
                    onClick={() => setView('status')}
                    className={`p-10 bg-white border-2 border-slate-100 rounded-[2rem] text-left space-y-6 hover:border-indigo-600/20 hover:bg-indigo-50/30 transition-all active:scale-[0.98] group ${
                      userRole === 'leerkracht' ? '' : 'md:col-span-2'
                    }`}
                  >
                    <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-all group-hover:scale-110 shadow-sm">
                      <List size={28} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-slate-900 tracking-tight mb-2">Status Volgen</h3>
                      <p className="text-slate-500 text-sm leading-relaxed">Benieuwd wanneer we langskomen? Bekijk hier alle lopende tickets voor jouw school.</p>
                    </div>
                    <div className="pt-2 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-indigo-600">
                      Bekijk overzicht <ArrowRight size={14} />
                    </div>
                  </button>
                </div>
              </motion.div>
            )}

            {view === 'personnel-form' && (
              <motion.div 
                key="personnel-form"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                className="p-10 md:p-16"
              >
                <div className="flex items-center justify-between mb-12">
                  <button onClick={() => setView('school-home')} className="group flex items-center gap-2 text-xs font-black text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest">
                    <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center group-hover:bg-slate-100">
                      ←
                    </div>
                    TERUG
                  </button>
                  <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm bg-emerald-600 text-white`}>
                    ICT WISSEL PERSONEEL
                  </div>
                </div>

                <form onSubmit={handlePersonnelSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Type Wissel</label>
                      <div className="flex bg-slate-100 p-1.5 rounded-2xl">
                        <button 
                          type="button"
                          onClick={() => setPersonnelData({...personnelData, type: 'nieuwe medewerker'})}
                          className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                            personnelData.type === 'nieuwe medewerker' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                          }`}
                        >
                          Instroom
                        </button>
                        <button 
                          type="button"
                          onClick={() => setPersonnelData({...personnelData, type: 'vertrekkende medewerker'})}
                          className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                            personnelData.type === 'vertrekkende medewerker' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'
                          }`}
                        >
                          Uitstroom
                        </button>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Datum</label>
                      <input 
                        required
                        type="date" 
                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold text-sm"
                        value={personnelData.datum}
                        onChange={(e) => setPersonnelData({ ...personnelData, datum: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Voornaam</label>
                      <input 
                        required
                        type="text" 
                        placeholder="Voornaam"
                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold text-sm"
                        value={personnelData.voornaam}
                        onChange={(e) => setPersonnelData({ ...personnelData, voornaam: e.target.value })}
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Naam</label>
                      <input 
                        required
                        type="text" 
                        placeholder="Naam"
                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold text-sm"
                        value={personnelData.naam}
                        onChange={(e) => setPersonnelData({ ...personnelData, naam: e.target.value })}
                      />
                    </div>
                  </div>

                   <div className="space-y-3">
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Functie</label>
                    <input 
                      required
                      type="text" 
                      placeholder="bijv: Leerkracht L3, Zorgleerkracht..."
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold text-sm"
                      value={personnelData.functie}
                      onChange={(e) => setPersonnelData({ ...personnelData, functie: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
                     <button 
                        type="button"
                        onClick={() => setPersonnelData({...personnelData, laptopNodig: !personnelData.laptopNodig})}
                        className={`flex items-center gap-4 p-5 rounded-[1.5rem] border-2 transition-all ${
                          personnelData.laptopNodig ? 'bg-indigo-50 border-indigo-600 text-indigo-600' : 'bg-slate-50 border-slate-100 text-slate-400'
                        }`}
                      >
                       {personnelData.laptopNodig ? <CheckSquare size={20} /> : <Square size={20} />}
                       <span className="text-[10px] font-black uppercase tracking-widest">Laptop Nodig</span>
                     </button>

                     <button 
                        type="button"
                        onClick={() => setPersonnelData({...personnelData, bingelAccount: !personnelData.bingelAccount})}
                        className={`flex items-center gap-4 p-5 rounded-[1.5rem] border-2 transition-all ${
                          personnelData.bingelAccount ? 'bg-indigo-50 border-indigo-600 text-indigo-600' : 'bg-slate-50 border-slate-100 text-slate-400'
                        }`}
                      >
                       {personnelData.bingelAccount ? <CheckSquare size={20} /> : <Square size={20} />}
                       <span className="text-[10px] font-black uppercase tracking-widest">Account Bingel</span>
                     </button>

                     <button 
                        type="button"
                        onClick={() => setPersonnelData({...personnelData, scoodleAccount: !personnelData.scoodleAccount})}
                        className={`flex items-center gap-4 p-5 rounded-[1.5rem] border-2 transition-all ${
                          personnelData.scoodleAccount ? 'bg-amber-50 border-amber-600 text-amber-600' : 'bg-slate-50 border-slate-100 text-slate-400'
                        }`}
                      >
                       {personnelData.scoodleAccount ? <CheckSquare size={20} /> : <Square size={20} />}
                       <span className="text-[10px] font-black uppercase tracking-widest">Account Scoodle</span>
                     </button>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Extra Info / Opmerkingen</label>
                    <textarea 
                      rows={5}
                      className="w-full p-5 bg-slate-50 border border-slate-200 rounded-[2rem] outline-none font-medium resize-none shadow-inner"
                      placeholder="Optionele extra informatie voor de ICT-coördinator..."
                      value={personnelData.opmerkingen}
                      onChange={(e) => setPersonnelData({ ...personnelData, opmerkingen: e.target.value })}
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-[2rem] font-black text-lg transition-all shadow-2xl shadow-emerald-600/30 flex items-center justify-center gap-3 active:scale-[0.98]"
                  >
                    <UserPlus size={20} />
                    WISSEL DOORGEVEN
                  </button>
                </form>
              </motion.div>
            )}

            {view === 'status' && (
              <motion.div 
                key="status"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="p-10 md:p-16 space-y-8"
              >
                <div className="flex items-center justify-between border-b border-slate-100 pb-8">
                  <button onClick={() => setView('school-home')} className="flex items-center gap-2 text-xs font-black text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest">
                    ← Terug
                  </button>
                  <div className="text-right">
                    <h3 className="font-black text-slate-900 text-xl tracking-tight leading-none mb-1">Actieve Tickets</h3>
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-tighter">{selectedSchool}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {schoolRequests.length > 0 ? schoolRequests.map((req) => (
                    <motion.div 
                      layout
                      key={req.id} 
                      className="p-5 bg-white rounded-3xl border border-slate-100 shadow-[0_4px_20px_rgba(0,0,0,0.02)] flex items-center justify-between group hover:border-indigo-200 transition-all"
                    >
                      <div className="flex items-center gap-5">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-sm ${
                          req.status === 'opgelost' ? 'bg-emerald-50 text-emerald-600' : 'bg-indigo-50 text-indigo-600'
                        }`}>
                          {req.status === 'opgelost' ? <CheckCircle size={24} /> : <Clock size={24} />}
                        </div>
                        <div>
                          <p className="text-base font-black text-slate-900 leading-tight mb-1">{req.omschrijving}</p>
                          <div className="flex items-center gap-3">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest bg-slate-50 px-2 py-0.5 rounded-full">{req.aanvrager}</span>
                            <span className="w-1 h-1 rounded-full bg-slate-200" />
                            <span className={`text-[10px] font-black uppercase tracking-widest ${
                              req.status === 'opgelost' ? 'text-emerald-600' : 'text-indigo-600'
                            }`}>{req.status}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        {req.geplandeDatumSite || req.geplandeDatumRemote ? (
                          <div className="flex flex-col items-end">
                            <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest mb-1 shadow-sm ${
                              req.isRemote ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                            }`}>
                              {req.isRemote ? <Globe size={10} /> : <MapPin size={10} />}
                              {req.isRemote ? 'Remote' : 'Ter Plaatse'}
                            </div>
                            <span className="text-xs font-black text-slate-700 tracking-tight">{req.geplandeDatumSite || req.geplandeDatumRemote?.split('T')[0]}</span>
                          </div>
                        ) : (
                          <span className="text-[10px] text-slate-300 font-bold uppercase tracking-widest italic">Nog in te plannen</span>
                        )}
                      </div>
                    </motion.div>
                  )) : (
                    <div className="py-20 text-center bg-slate-50/50 rounded-[2.5rem] border-2 border-dashed border-slate-200">
                      <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                        <Info className="text-slate-300" size={32} />
                      </div>
                      <p className="text-slate-400 font-bold uppercase tracking-widest text-sm">Geen actieve meldingen</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {view === 'form' && (
              <motion.div 
                key="form"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                className="p-10 md:p-16"
              >
                <div className="flex items-center justify-between mb-12">
                  <button onClick={() => setView('school-home')} className="group flex items-center gap-2 text-xs font-black text-slate-400 hover:text-slate-900 transition-colors uppercase tracking-widest">
                    <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center group-hover:bg-slate-100">
                      ←
                    </div>
                    TERUG
                  </button>
                  <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${
                     SCHOOL_COLORS[selectedSchool as string]?.bg || 'bg-indigo-600'
                  } text-white`}>
                    {selectedSchool}
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Je Naam</label>
                      <input 
                        required
                        type="text" 
                        placeholder="Voornaam Achternaam"
                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all font-bold placeholder:text-slate-300"
                        value={formData.aanvrager}
                        onChange={(e) => setFormData({ ...formData, aanvrager: e.target.value })}
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Emailadres</label>
                      <input 
                        required
                        type="email" 
                        placeholder="naam@leefscholenleuven.be"
                        className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all font-bold placeholder:text-slate-300"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Waarover gaat het?</label>
                    <select 
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all font-black appearance-none cursor-pointer"
                      value={formData.categorie}
                      onChange={(e) => setFormData({ ...formData, categorie: e.target.value })}
                    >
                      {categories.map(cat => <option key={cat}>{cat}</option>)}
                    </select>
                  </div>

                  <div className="space-y-3">
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Omschrijving probleem</label>
                    <textarea 
                      required
                      rows={6}
                      className="w-full p-5 bg-slate-50 border border-slate-200 rounded-[2rem] focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 outline-none transition-all resize-none font-medium placeholder:text-slate-300"
                      placeholder="Beschrijf je probleem zo duidelijk mogelijk. Wat werkt er niet? Welke melding zie je?"
                      value={formData.omschrijving}
                      onChange={(e) => setFormData({ ...formData, omschrijving: e.target.value })}
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="block text-xs font-black text-slate-400 uppercase tracking-widest ml-1">Op welke dagen ben je op school?</label>
                    <div className="flex flex-wrap gap-3">
                      {['Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag'].map(dag => (
                        <button
                          key={dag}
                          type="button"
                          onClick={() => toggleDay(dag)}
                          className={`px-4 py-2 rounded-xl text-sm font-bold border-2 transition-all ${
                            formData.beschikbareDagen.includes(dag)
                              ? 'bg-indigo-50 border-indigo-600 text-indigo-700 shadow-sm'
                              : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                          }`}
                        >
                          {dag}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-5 p-6 bg-indigo-50/50 border border-indigo-100 rounded-[2rem]">
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm shrink-0">
                      <Info className="text-indigo-600" size={24} />
                    </div>
                    <p className="text-sm text-indigo-900 font-medium leading-relaxed">
                      We houden je op de hoogte via <strong>{getAPIChannel(selectedSchool as string)}</strong>. Je aanvraag wordt direct geprioriteerd.
                    </p>
                  </div>

                  <button 
                    type="submit"
                    className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[2rem] font-black text-lg transition-all shadow-2xl shadow-indigo-600/30 flex items-center justify-center gap-3 active:scale-[0.98]"
                  >
                    <Send size={20} />
                    MELDING VERSTUREN
                  </button>
                </form>
              </motion.div>
            )}

            {view === 'success' && (
              <motion.div 
                key="success"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-16 text-center space-y-8"
              >
                <div className="w-24 h-24 bg-emerald-50 text-emerald-600 rounded-[2.5rem] flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle size={48} />
                </div>
                <div className="space-y-3">
                  <h3 className="text-4xl font-black text-slate-900 tracking-tight">Top, ontvangen!</h3>
                  <p className="text-slate-500 max-w-sm mx-auto font-medium text-lg">We hebben je melding goed ontvangen. De ICT-coördinator bekijkt het zo snel mogelijk.</p>
                </div>
                <button 
                  onClick={() => {
                    setView('school-home');
                    setFormData({ ...formData, omschrijving: '' });
                  }}
                  className="px-12 py-5 bg-slate-900 text-white rounded-[2rem] font-black hover:bg-black transition-all shadow-xl active:scale-95 uppercase tracking-widest text-sm"
                >
                  Terug naar overzicht
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <footer className="text-center space-y-4 pt-8">
          <div className="flex items-center justify-center gap-8 text-slate-300 uppercase tracking-[0.2em] font-black text-[10px]">
             <span>Betrouwbaar</span>
             <span>•</span>
             <span>Snel</span>
             <span>•</span>
             <span>Lokaal</span>
          </div>
          <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest">
            © 2024 ICT Scholenbeheer - Wietse Oliviers
          </p>
        </footer>
      </div>
    </div>
  );
}
