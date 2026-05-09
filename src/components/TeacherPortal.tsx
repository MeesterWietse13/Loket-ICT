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
    <div className="min-h-screen bg-[#F6F5F0] flex flex-col items-center pb-12 font-sans selection:bg-[#CFDCE2] selection:text-[#2A4652]">
      <div className="w-full bg-[#EEF3F0] border-b border-[#CAD6DC] px-4 md:px-12 py-8 flex justify-center">
        <div className="max-w-5xl w-full">
          <header className="flex flex-row items-center gap-6">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="flex-shrink-0 inline-flex items-center justify-center w-16 h-16 bg-[#385B69] text-white rounded-2xl shadow-sm"
            >
              <span className="font-bold text-xl">ICT</span>
            </motion.div>
            <div className="space-y-1 text-left">
              <h1 className="text-3xl font-bold text-[#0F172A] tracking-tight">Leerkrachtenportaal</h1>
              <p className="text-stone-500 font-medium text-base">Meld een ICT-vraag, volg je ticket of geef een personeelswissel door.</p>
            </div>
          </header>
        </div>
      </div>
      
      <div className="max-w-5xl w-full px-4 md:px-12 mt-12 space-y-12">

        <section className="space-y-4">
          <VisitCalendar entries={calendarEntries} />
        </section>

        <div className="bg-[#FDFBF7] rounded-2xl shadow-sm border border-[#CAD6DC] overflow-hidden min-h-[500px] relative">
          <div className="absolute top-0 left-0 w-full h-2 bg-[#385B69]" />
          
          <AnimatePresence mode="wait">
            {view === 'welcome' && (
              <motion.div 
                key="welcome"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                className="p-10 md:p-16 space-y-10 text-center"
              >
                <div className="space-y-2 mb-4">
                  <h2 className="text-3xl font-bold text-[#0F172A]">
                    {loginMode === 'leerkracht' ? 'Kies jouw school' : 'Directie Login'}
                  </h2>
                  <p className="text-stone-500 font-medium text-lg">
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
                        className={`p-6 rounded-2xl border bg-[#FDFBF7] ${theme.border} hover:bg-stone-50 transition-colors group flex flex-row items-center gap-6 active:scale-95 text-left relative overflow-hidden`}
                      >
                        <div className={`w-14 h-14 shrink-0 ${theme.light} ${theme.accent} rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110`}>
                          <MapPin size={24} strokeWidth={2.5} />
                        </div>
                        <div className="relative z-10 space-y-1">
                          <span className="font-bold text-xl text-[#0F172A] block">{school}</span>
                          <span className={`text-sm ${theme.text} font-medium`}>Open het loket</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
                
                <div className="pt-8 border-t border-[#EAE1D2] mt-4 flex flex-col sm:flex-row items-center justify-center gap-6">
                  {loginMode === 'directie' ? (
                    <button 
                      onClick={() => setLoginMode('leerkracht')}
                      className="text-xs font-medium text-stone-500 hover:text-stone-800 transition-colors"
                    >
                      ← Terug naar Leerkrachten
                    </button>
                  ) : (
                    <div className="flex items-center justify-center gap-8">
                      <button 
                        onClick={() => setLoginMode('directie')}
                        className="text-sm font-medium text-[#385B69] hover:text-[#2A4652] transition-colors flex items-center gap-2"
                      >
                       <UserPlus size={16} /> Directie Toegang
                      </button>
                      <button 
                        onClick={() => onLogin?.('admin', 'Centraal')}
                        className="text-sm font-medium text-[#385B69] hover:text-[#2A4652] transition-colors flex items-center gap-2"
                      >
                       <LogOut size={16} /> ICT Beheer
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
                        className="flex items-center gap-2 text-xs font-medium text-[#385B69] hover:text-[#2A4652] transition-colors bg-[#EAF1F4] px-4 py-2 rounded-xl border border-[#CFDCE2]"
                      >
                         Beheer Portaal
                      </button>
                    )}
                    <button onClick={() => {
                      if (userSchool === 'Centraal') setView('welcome');
                      else logout();
                    }} className="group flex items-center gap-2 text-sm font-medium text-stone-500 hover:text-stone-800 transition-colors">
                      <div className="w-8 h-8 bg-stone-50 rounded-lg flex items-center justify-center group-hover:bg-stone-100">
                        {userSchool === 'Centraal' ? '←' : <LogOut size={16} />}
                      </div>
                      {userSchool === 'Centraal' ? 'Wissel van school' : 'Uitloggen'}
                    </button>
                  </div>
                  <div className={`px-4 py-1.5 rounded-full border text-xs font-medium flex items-center gap-2 shadow-sm ${
                    SCHOOL_COLORS[selectedSchool as string] ? `${SCHOOL_COLORS[selectedSchool as string].bg} ${SCHOOL_COLORS[selectedSchool as string].text} ${SCHOOL_COLORS[selectedSchool as string].border}` : 'bg-[#EAF1F4] text-[#2A4652] border-[#CFDCE2]'
                  }`}>
                    <MapPin size={14} />
                    {selectedSchool}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <button 
                    onClick={() => setView('form')}
                    className="p-8 bg-[#385B69] text-white rounded-2xl text-left space-y-4 hover:bg-[#2A4652] transition-colors shadow-sm active:scale-[0.98] group relative overflow-hidden"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#FDFBF7]/5 -mr-12 -mt-12 rounded-full" />
                    <div className="w-12 h-12 bg-[#FDFBF7]/10 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform text-white">
                      <PlusCircle size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-medium mb-2">Nieuwe melding</h3>
                      <p className="text-[#EAF1F4] text-sm leading-relaxed">Probleem of vraag? Meld het hier en we helpen je snel.</p>
                    </div>
                    <div className="pt-2 flex items-center gap-2 text-sm font-medium text-[#CFDCE2]">
                      Nu versturen <ArrowRight size={16} />
                    </div>
                  </button>

                  {userRole !== 'leerkracht' && (
                    <button 
                      onClick={() => setView('personnel-form')}
                      className="p-8 rounded-2xl text-left space-y-4 transition-colors active:scale-[0.98] group relative overflow-hidden bg-[#F2E8E9] border border-[#E6D1D4] text-[#0F172A] hover:bg-[#E6D1D4] shadow-sm"
                    >
                      <div className="absolute top-0 right-0 w-32 h-32 bg-[#9A5B64]/5 -mr-12 -mt-12 rounded-full" />
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110 bg-[#FDFBF7] text-[#9A5B64] shadow-sm">
                        <UserPlus size={24} />
                      </div>
                      <div>
                        <h3 className="text-xl font-medium mb-2">Wissel personeel</h3>
                        <p className="text-sm leading-relaxed text-[#9A5B64]/80">
                          Meld een nieuwe collega of een vertrek. Wij brengen alles in orde.
                        </p>
                      </div>
                      <div className="pt-2 flex items-center gap-2 text-sm font-medium text-[#9A5B64]">
                        Meld wissel <ArrowRight size={16} />
                      </div>
                    </button>
                  )}

                  <button 
                    onClick={() => setView('status')}
                    className={`p-8 bg-[#FDFBF7] border border-[#EAE1D2] rounded-2xl text-left space-y-4 hover:border-[#CFDCE2] hover:bg-[#EAF1F4]/50 transition-colors active:scale-[0.98] group shadow-sm ${
                      userRole === 'leerkracht' ? '' : 'md:col-span-2'
                    }`}
                  >
                    <div className="w-12 h-12 bg-stone-50 border border-[#EAE1D2] rounded-xl flex items-center justify-center group-hover:bg-[#CFDCE2] group-hover:text-[#385B69] transition-colors group-hover:scale-110">
                      <List size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-medium text-stone-900 mb-2">Status volgen</h3>
                      <p className="text-stone-500 text-sm leading-relaxed">Benieuwd wanneer we langskomen? Bekijk hier alle lopende tickets voor jouw school.</p>
                    </div>
                    <div className="pt-2 flex items-center gap-2 text-sm font-medium text-[#385B69]">
                      Bekijk overzicht <ArrowRight size={16} />
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
                  <button onClick={() => setView('school-home')} className="group flex items-center gap-2 text-sm font-medium text-stone-500 hover:text-stone-800 transition-colors">
                    <div className="w-8 h-8 bg-stone-50 rounded-lg flex items-center justify-center group-hover:bg-stone-100">
                      ←
                    </div>
                    Terug
                  </button>
                  <div className={`px-4 py-1.5 rounded-full text-xs font-medium shadow-sm bg-[#F2E8E9] text-[#9A5B64] border border-[#E6D1D4]`}>
                    ICT Wissel Personeel
                  </div>
                </div>

                <form onSubmit={handlePersonnelSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-stone-700 ml-1">Type Wissel</label>
                      <div className="flex bg-stone-50 p-1 rounded-xl border border-[#EAE1D2]">
                        <button 
                          type="button"
                          onClick={() => setPersonnelData({...personnelData, type: 'nieuwe medewerker'})}
                          className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                            personnelData.type === 'nieuwe medewerker' ? 'bg-[#FDFBF7] text-[#557560] shadow-sm border border-[#EAE1D2]' : 'text-stone-500 hover:text-stone-700'
                          }`}
                        >
                          Instroom
                        </button>
                        <button 
                          type="button"
                          onClick={() => setPersonnelData({...personnelData, type: 'vertrekkende medewerker'})}
                          className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                            personnelData.type === 'vertrekkende medewerker' ? 'bg-[#FDFBF7] text-[#9A5B64] shadow-sm border border-[#EAE1D2]' : 'text-stone-500 hover:text-stone-700'
                          }`}
                        >
                          Uitstroom
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-stone-700 ml-1">Datum</label>
                      <input 
                        required
                        type="date" 
                        className="w-full px-4 py-3 bg-stone-50 border border-[#EAE1D2] rounded-xl focus:ring-2 focus:ring-[#CFDCE2] focus:border-[#487184] outline-none transition-all text-sm font-medium"
                        value={personnelData.datum}
                        onChange={(e) => setPersonnelData({ ...personnelData, datum: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-stone-700 ml-1">Voornaam</label>
                      <input 
                        required
                        type="text" 
                        placeholder="Voornaam"
                        className="w-full px-4 py-3 bg-stone-50 border border-[#EAE1D2] rounded-xl focus:ring-2 focus:ring-[#CFDCE2] focus:border-[#487184] outline-none transition-all text-sm"
                        value={personnelData.voornaam}
                        onChange={(e) => setPersonnelData({ ...personnelData, voornaam: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-stone-700 ml-1">Naam</label>
                      <input 
                        required
                        type="text" 
                        placeholder="Naam"
                        className="w-full px-4 py-3 bg-stone-50 border border-[#EAE1D2] rounded-xl focus:ring-2 focus:ring-[#CFDCE2] focus:border-[#487184] outline-none transition-all text-sm"
                        value={personnelData.naam}
                        onChange={(e) => setPersonnelData({ ...personnelData, naam: e.target.value })}
                      />
                    </div>
                  </div>

                   <div className="space-y-2">
                    <label className="block text-sm font-medium text-stone-700 ml-1">Functie</label>
                    <input 
                      required
                      type="text" 
                      placeholder="bijv: Leerkracht L3, Zorgleerkracht..."
                      className="w-full px-4 py-3 bg-stone-50 border border-[#EAE1D2] rounded-xl focus:ring-2 focus:ring-[#CFDCE2] focus:border-[#487184] outline-none transition-all text-sm"
                      value={personnelData.functie}
                      onChange={(e) => setPersonnelData({ ...personnelData, functie: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                     <button 
                        type="button"
                        onClick={() => setPersonnelData({...personnelData, laptopNodig: !personnelData.laptopNodig})}
                        className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${
                          personnelData.laptopNodig ? 'bg-[#EAF1F4] border-[#CFDCE2] text-[#487184]' : 'bg-stone-50 border-[#EAE1D2] text-stone-500 hover:border-stone-300'
                        }`}
                      >
                       {personnelData.laptopNodig ? <CheckSquare size={18} /> : <Square size={18} />}
                       <span className="text-sm font-medium">Laptop nodig</span>
                     </button>

                     <button 
                        type="button"
                        onClick={() => setPersonnelData({...personnelData, bingelAccount: !personnelData.bingelAccount})}
                        className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${
                          personnelData.bingelAccount ? 'bg-[#EAF1F4] border-[#CFDCE2] text-[#487184]' : 'bg-stone-50 border-[#EAE1D2] text-stone-500 hover:border-stone-300'
                        }`}
                      >
                       {personnelData.bingelAccount ? <CheckSquare size={18} /> : <Square size={18} />}
                       <span className="text-sm font-medium">Account Bingel</span>
                     </button>

                     <button 
                        type="button"
                        onClick={() => setPersonnelData({...personnelData, scoodleAccount: !personnelData.scoodleAccount})}
                        className={`flex items-center gap-3 p-4 rounded-xl border transition-all ${
                          personnelData.scoodleAccount ? 'bg-[#EAF1F4] border-[#CFDCE2] text-[#487184]' : 'bg-stone-50 border-[#EAE1D2] text-stone-500 hover:border-stone-300'
                        }`}
                      >
                       {personnelData.scoodleAccount ? <CheckSquare size={18} /> : <Square size={18} />}
                       <span className="text-sm font-medium">Account Scoodle</span>
                     </button>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-stone-700 ml-1">Extra info / Opmerkingen</label>
                    <textarea 
                      rows={4}
                      className="w-full p-4 bg-stone-50 border border-[#EAE1D2] rounded-xl focus:ring-2 focus:ring-[#CFDCE2] focus:border-[#487184] outline-none transition-all resize-none text-sm placeholder:text-stone-400"
                      placeholder="Optionele extra informatie voor de ICT-coördinator..."
                      value={personnelData.opmerkingen}
                      onChange={(e) => setPersonnelData({ ...personnelData, opmerkingen: e.target.value })}
                    />
                  </div>

                  <div className="pt-4">
                    <button 
                      type="submit"
                      className="w-full py-4 bg-[#385B69] hover:bg-[#2A4652] text-white rounded-xl font-medium text-base transition-colors shadow-sm flex items-center justify-center gap-2 active:scale-[0.98]"
                    >
                      <UserPlus size={18} />
                      Wissel doorgeven
                    </button>
                  </div>
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
                <div className="flex items-center justify-between border-b border-[#EAE1D2] pb-8">
                  <button onClick={() => setView('school-home')} className="flex items-center gap-2 text-sm font-medium text-stone-500 hover:text-stone-800 transition-colors">
                    ← Terug
                  </button>
                  <div className="text-right">
                    <h3 className="font-medium text-stone-900 text-xl mb-1">Actieve tickets</h3>
                    <p className="text-stone-500 text-xs font-medium">{selectedSchool}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {schoolRequests.length > 0 ? schoolRequests.map((req) => (
                    <motion.div 
                      layout
                      key={req.id} 
                      className="p-5 bg-[#FDFBF7] rounded-2xl border border-[#EAE1D2] shadow-sm flex items-center justify-between group hover:border-[#CFDCE2] transition-colors"
                    >
                      <div className="flex items-center gap-5">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center border ${
                          req.status === 'opgelost' ? 'bg-[#EDF2EF] text-[#557560] border-[#D4E0D8]' : 'bg-[#EAF1F4] text-[#385B69] border-[#CFDCE2]'
                        }`}>
                          {req.status === 'opgelost' ? <CheckCircle size={24} /> : <Clock size={24} />}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-stone-900 mb-1">{req.omschrijving}</p>
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-medium text-stone-500 bg-stone-50 px-2 py-0.5 rounded-md border border-[#EAE1D2]">{req.aanvrager}</span>
                            <span className={`text-xs font-medium capitalize ${
                              req.status === 'opgelost' ? 'text-[#557560]' : 'text-[#385B69]'
                            }`}>{req.status}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        {req.geplandeDatumSite || req.geplandeDatumRemote ? (
                          <div className="flex flex-col items-end gap-1.5">
                            <div className={`flex items-center gap-1.5 px-2.5 py-0.5 rounded-md text-xs font-medium border shadow-sm ${
                              req.isRemote ? 'bg-[#EAF1F4] text-[#487184] border-[#CFDCE2]' : 'bg-[#EDF2EF] text-[#557560] border-[#D4E0D8]'
                            }`}>
                              {req.isRemote ? <Globe size={12} /> : <MapPin size={12} />}
                              {req.isRemote ? 'Remote' : 'Aanwezig'}
                            </div>
                            <span className="text-sm font-medium text-stone-700">{req.geplandeDatumSite || req.geplandeDatumRemote?.split('T')[0]}</span>
                          </div>
                        ) : (
                          <span className="text-xs text-stone-400 font-medium italic">Nog in te plannen</span>
                        )}
                      </div>
                    </motion.div>
                  )) : (
                    <div className="py-20 text-center bg-stone-50/50 rounded-2xl border border-dashed border-[#EAE1D2]">
                      <div className="w-16 h-16 bg-[#FDFBF7] border border-[#EAE1D2] rounded-xl flex items-center justify-center mx-auto mb-4 shadow-sm">
                        <Info className="text-stone-400" size={28} />
                      </div>
                      <p className="text-stone-500 font-medium text-sm">Geen actieve meldingen</p>
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
                  <button onClick={() => setView('school-home')} className="group flex items-center gap-2 text-sm font-medium text-stone-500 hover:text-stone-800 transition-colors">
                    <div className="w-8 h-8 bg-stone-50 rounded-lg flex items-center justify-center group-hover:bg-stone-100">
                      ←
                    </div>
                    Terug
                  </button>
                  <div className={`px-4 py-1.5 rounded-full text-xs font-medium shadow-sm ${
                     SCHOOL_COLORS[selectedSchool as string] ? `${SCHOOL_COLORS[selectedSchool as string].bg} ${SCHOOL_COLORS[selectedSchool as string].text} ${SCHOOL_COLORS[selectedSchool as string].border}` : 'bg-[#EAF1F4] text-[#2A4652] border-[#CFDCE2]'
                  }`}>
                    {selectedSchool}
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-stone-700 ml-1">Je naam</label>
                      <input 
                        required
                        type="text" 
                        placeholder="Voornaam Achternaam"
                        className="w-full px-4 py-3 bg-stone-50 border border-[#EAE1D2] rounded-xl focus:ring-2 focus:ring-[#CFDCE2] focus:border-[#487184] outline-none transition-all text-sm"
                        value={formData.aanvrager}
                        onChange={(e) => setFormData({ ...formData, aanvrager: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="block text-sm font-medium text-stone-700 ml-1">Emailadres</label>
                      <input 
                        required
                        type="email" 
                        placeholder="naam@leefscholenleuven.be"
                        className="w-full px-4 py-3 bg-stone-50 border border-[#EAE1D2] rounded-xl focus:ring-2 focus:ring-[#CFDCE2] focus:border-[#487184] outline-none transition-all text-sm"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-stone-700 ml-1">Waarover gaat het?</label>
                    <div className="relative">
                      <select 
                        className="w-full px-4 py-3 bg-stone-50 border border-[#EAE1D2] rounded-xl focus:ring-2 focus:ring-[#CFDCE2] focus:border-[#487184] outline-none transition-all text-sm appearance-none cursor-pointer"
                        value={formData.categorie}
                        onChange={(e) => setFormData({ ...formData, categorie: e.target.value })}
                      >
                        {categories.map(cat => <option key={cat}>{cat}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-stone-700 ml-1">Omschrijving probleem</label>
                    <textarea 
                      required
                      rows={5}
                      className="w-full p-4 bg-stone-50 border border-[#EAE1D2] rounded-xl focus:ring-2 focus:ring-[#CFDCE2] focus:border-[#487184] outline-none transition-all resize-none text-sm placeholder:text-stone-400"
                      placeholder="Beschrijf je probleem zo duidelijk mogelijk. Wat werkt er niet? Welke melding zie je?"
                      value={formData.omschrijving}
                      onChange={(e) => setFormData({ ...formData, omschrijving: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block text-sm font-medium text-stone-700 ml-1">Op welke dagen ben je op school?</label>
                    <div className="flex flex-wrap gap-2">
                      {['Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag'].map(dag => (
                        <button
                          key={dag}
                          type="button"
                          onClick={() => toggleDay(dag)}
                          className={`px-4 py-2 rounded-lg text-sm font-medium border transition-all ${
                            formData.beschikbareDagen.includes(dag)
                              ? 'bg-[#EAF1F4] border-[#CFDCE2] text-[#385B69] shadow-sm'
                              : 'bg-[#FDFBF7] border-[#EAE1D2] text-stone-500 hover:bg-stone-50'
                          }`}
                        >
                          {dag}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-4 bg-[#EAF1F4] border border-[#CFDCE2] rounded-xl">
                    <div className="w-10 h-10 bg-[#FDFBF7] rounded-lg flex items-center justify-center shadow-sm shrink-0 border border-[#CFDCE2]">
                      <Info className="text-[#487184]" size={20} />
                    </div>
                    <p className="text-sm text-[#2A4652] font-medium">
                      We houden je op de hoogte via <strong>{getAPIChannel(selectedSchool as string)}</strong>. Je aanvraag wordt direct geprioriteerd.
                    </p>
                  </div>

                  <div className="pt-4">
                    <button 
                      type="submit"
                      className="w-full py-4 bg-[#385B69] hover:bg-[#2A4652] text-white rounded-xl font-medium text-base transition-colors shadow-sm flex items-center justify-center gap-2 active:scale-[0.98]"
                    >
                      <Send size={18} />
                      Melding versturen
                    </button>
                  </div>
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
                <div className="w-20 h-20 bg-[#EDF2EF] text-[#557560] rounded-2xl flex items-center justify-center mx-auto shadow-sm border border-[#D4E0D8]">
                  <CheckCircle size={40} />
                </div>
                <div className="space-y-2">
                  <h3 className="text-3xl font-medium text-stone-900">Ontvangen!</h3>
                  <p className="text-stone-500 max-w-sm mx-auto text-sm">We hebben je melding goed ontvangen. De ICT-coördinator bekijkt het zo snel mogelijk.</p>
                </div>
                <button 
                  onClick={() => {
                    setView('school-home');
                    setFormData({ ...formData, omschrijving: '' });
                  }}
                  className="px-8 py-3 bg-[#385B69] text-white rounded-xl font-medium hover:bg-[#2A4652] transition-colors shadow-sm active:scale-95 text-sm"
                >
                  Terug naar overzicht
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <footer className="text-center space-y-4 pt-8">
          <div className="flex items-center justify-center gap-6 text-stone-400 font-medium text-xs">
             <span>Betrouwbaar</span>
             <span className="text-stone-300">•</span>
             <span>Snel</span>
             <span className="text-stone-300">•</span>
             <span>Lokaal</span>
          </div>
          <p className="text-stone-400 text-xs font-medium">
            © 2024 ICT Scholenbeheer - Wietse Oliviers
          </p>
        </footer>
      </div>
    </div>
  );
}
