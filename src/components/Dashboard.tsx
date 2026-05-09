import React, { useState, useMemo } from 'react';
import { 
  LayoutDashboard as LayoutDashboardIcon, Plus, AlertTriangle, 
  Clock, MapPin, Search, Filter, ArrowUpDown, 
  CheckCircle2, Globe, Mail, MessageSquare, Info 
} from 'lucide-react';
import { ICTRequest, Priority, Status, School } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { SCHOOL_COLORS } from '../constants/theme';

interface DashboardProps {
  requests: ICTRequest[];
  updateRequest: (id: string, updates: Partial<ICTRequest>) => void;
  addRequest: (request: Omit<ICTRequest, 'id'>) => void;
  schools: string[];
}

export default function Dashboard({ requests, updateRequest, addRequest, schools }: DashboardProps) {
  const [filterSchool, setFilterSchool] = useState<string>('Alle scholen');
  const [filterStatus, setFilterStatus] = useState<string>('Alle statussen');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<'datum' | 'prioriteit'>('datum');
  const [isAddingRequest, setIsAddingRequest] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(null);

  const selectedRequest = requests.find(r => r.id === selectedRequestId);

  const [newRequestData, setNewRequestData] = useState({
    aanvrager: '',
    email: '',
    school: schools[0],
    categorie: 'Andere',
    omschrijving: '',
    prioriteit: 'normaal' as Priority
  });

  const handleAddRequest = (e: React.FormEvent) => {
    e.preventDefault();
    addRequest({
      ...newRequestData,
      datum: new Date().toISOString().split('T')[0],
      status: 'nieuw',
      isRemote: false,
      interneNota: '',
      school: newRequestData.school as School
    });
    setIsAddingRequest(false);
    setNewRequestData({
      aanvrager: '',
      email: '',
      school: schools[0],
      categorie: 'Andere',
      omschrijving: '',
      prioriteit: 'normaal'
    });
  };

  const filteredRequests = useMemo(() => {
    return requests
      .filter(r => (filterSchool === 'Alle scholen' || r.school === filterSchool))
      .filter(r => (filterStatus === 'Alle statussen' || r.status === filterStatus))
      .filter(r => (
        r.aanvrager.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.omschrijving.toLowerCase().includes(searchQuery.toLowerCase())
      ))
      .sort((a, b) => {
        if (sortField === 'datum') {
          return new Date(b.datum).getTime() - new Date(a.datum).getTime();
        } else {
          const priorityOrder = { 'dringend': 0, 'normaal': 1, 'laag': 2 };
          return priorityOrder[a.prioriteit] - priorityOrder[b.prioriteit];
        }
      });
  }, [requests, filterSchool, filterStatus, searchQuery, sortField]);

  const stats = {
    totaal: requests.length,
    nieuw: requests.filter(r => r.status === 'nieuw').length,
    ongepland: requests.filter(r => !r.geplandeDatumSite && !r.geplandeDatumRemote && r.status === 'nieuw').length,
    vandaag: requests.filter(r => r.geplandeDatumSite === new Date().toISOString().split('T')[0]).length
  };

  const priorityColors = {
    dringend: 'bg-rose-100 text-rose-700 border-rose-200',
    normaal: 'bg-amber-100 text-amber-700 border-amber-200',
    laag: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  };

  const getAPIChannel = (school: string) => {
    if (school === 'Matadi' || school === 'Klaverblad') return { name: 'Smartschool API', icon: <MessageSquare size={12} className="text-orange-500" /> };
    return { name: 'Gmail API', icon: <Mail size={12} className="text-blue-500" /> };
  };

  return (
    <div className="space-y-10 pb-20 selection:bg-indigo-100 selection:text-indigo-900">
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-white -mx-8 -mt-8 px-10 py-8 border-b border-slate-100 shadow-[0_1px_3px_rgba(0,0,0,0.02)] mb-10">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
             <div className="w-12 h-12 bg-indigo-600 text-white rounded-2xl flex items-center justify-center shadow-xl shadow-indigo-600/20">
                <LayoutDashboardIcon size={24} />
             </div>
             <div>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight">ICT Dashboard</h2>
                <div className="flex gap-2 mt-1">
                  <span className="px-2 py-0.5 rounded-lg text-[10px] font-black bg-rose-50 text-rose-600 border border-rose-100 uppercase tracking-widest">
                    {requests.filter(r => r.prioriteit === 'dringend').length} Dringend
                  </span>
                  <span className="px-2 py-0.5 rounded-lg text-[10px] font-black bg-indigo-50 text-indigo-600 border border-indigo-100 uppercase tracking-widest">
                    {requests.filter(r => r.status === 'nieuw').length} Nieuw
                  </span>
                </div>
             </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden lg:flex flex-col items-end mr-4">
             <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Systeemstatus</span>
             <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Alle API's online
             </span>
          </div>
          <button 
            onClick={() => setIsAddingRequest(true)}
            className="group px-6 py-3 bg-slate-900 hover:bg-black text-white rounded-2xl flex items-center gap-2.5 transition-all shadow-xl shadow-slate-900/10 active:scale-95 text-sm font-black uppercase tracking-widest"
          >
            <Plus size={18} className="transition-transform group-hover:rotate-90" />
            <span>Melding Toevoegen</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Totaal open', value: stats.totaal, icon: LayoutDashboardIcon, theme: 'indigo' },
          { label: 'Nieuwe meldingen', value: stats.nieuw, icon: AlertTriangle, theme: 'blue' },
          { label: 'Wacht op planning', value: stats.ongepland, icon: Clock, theme: 'amber' },
          { label: 'Bezoeken vandaag', value: stats.vandaag, icon: MapPin, theme: 'emerald' },
        ].map((stat, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={i} 
            className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm shadow-slate-200/50 flex flex-col justify-between hover:shadow-md transition-shadow group relative overflow-hidden"
          >
            <div className={`absolute top-0 right-0 w-24 h-24 bg-${stat.theme}-600 opacity-5 -mr-10 -mt-10 rounded-full group-hover:scale-110 transition-transform`} />
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-${stat.theme}-50 text-${stat.theme}-600 group-hover:scale-110 transition-transform mb-4 shadow-sm`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-1">{stat.label}</p>
              <p className="text-3xl font-black text-slate-900 tracking-tight">{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filters Section */}
      <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
           <div className="space-y-1">
             <h3 className="text-xl font-black text-slate-900 tracking-tight uppercase">Filters & Weergave</h3>
             <p className="text-slate-400 text-sm font-medium">Personaliseer je dashboard overzicht.</p>
           </div>
           {/* School Selection Tabs as Pill Group */}
           <div className="flex items-center gap-1.5 p-1.5 bg-slate-50 rounded-2xl border border-slate-100 overflow-x-auto no-scrollbar scroll-smooth">
            <button 
              onClick={() => setFilterSchool('Alle scholen')}
              className={`px-5 py-2 text-[10px] font-black uppercase tracking-widest transition-all rounded-xl whitespace-nowrap ${filterSchool === 'Alle scholen' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Alle overkoepelend
            </button>
            {schools.map(school => {
              const isActive = filterSchool === school;
              const theme = SCHOOL_COLORS[school] || SCHOOL_COLORS['default'];
              return (
                <button 
                  key={school}
                  onClick={() => setFilterSchool(school)}
                  className={`px-5 py-2 text-[10px] font-black uppercase tracking-widest transition-all rounded-xl whitespace-nowrap ${isActive ? `${theme.bg} text-white shadow-lg ${theme.border}` : 'text-slate-400 hover:text-slate-600'}`}
                >
                  {school}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-6 border-t border-slate-50">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Zoek op naam of omschrijving..." 
              className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-50 outline-none transition-all text-sm font-bold placeholder:text-slate-300 focus:border-indigo-200"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={16} />
              <select 
                className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-50 outline-none transition-all text-[10px] font-black uppercase tracking-widest appearance-none cursor-pointer"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option>Alle statussen</option>
                {['nieuw', 'ingepland', 'alternatief voorgesteld', 'opgelost', 'geannuleerd'].map(s => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </div>
            
            <button 
              onClick={() => setSortField(sortField === 'datum' ? 'prioriteit' : 'datum')}
              className="flex items-center justify-center gap-2 px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl text-[10px] font-black text-slate-500 uppercase tracking-widest hover:bg-slate-100 transition-all active:scale-95 whitespace-nowrap"
            >
              <ArrowUpDown size={14} />
              {sortField === 'datum' ? 'Datum' : 'Prioriteit'}
            </button>
          </div>

          <div className="flex items-center gap-4 bg-indigo-50 px-6 py-4 rounded-[1.5rem] border border-indigo-100">
             <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm text-indigo-600 shrink-0">
                <Info size={18} />
             </div>
             <div>
                <p className="text-[10px] font-black text-indigo-900 tracking-wider">HUIDIGE SELECTIE</p>
                <p className="text-[11px] font-bold text-indigo-600 uppercase truncate">
                  {filterSchool} • {filteredRequests.length} Meldingen
                </p>
             </div>
          </div>
        </div>
      </div>

      {/* Requests Table Component */}
      <div className="bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.03)] border border-slate-100 overflow-hidden min-h-[400px]">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100 uppercase tracking-widest text-[10px] font-black text-slate-400">
                <th className="px-8 py-5">Datum / School</th>
                <th className="px-8 py-5">Aanvrager / Melding</th>
                <th className="px-8 py-5 text-center">Prioriteit</th>
                <th className="px-8 py-5">Status & Locatie</th>
                <th className="px-8 py-5 text-right">Beheer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              <AnimatePresence mode="popLayout">
                {filteredRequests.map((request) => {
                  const schoolTheme = SCHOOL_COLORS[request.school] || SCHOOL_COLORS['default'];
                  return (
                    <motion.tr 
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      key={request.id} 
                      className="hover:bg-slate-50/50 transition-all group"
                    >
                      <td className="px-8 py-6">
                        <div className="flex flex-col gap-1">
                          <span className="text-sm font-black text-slate-900 tracking-tight">{request.datum}</span>
                          <span className={`text-[10px] font-black uppercase tracking-[0.1em] ${schoolTheme.accent}`}>{request.school}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex flex-col min-w-0 max-w-[300px]">
                          <span className="text-sm font-black text-slate-900 truncate">{request.aanvrager}</span>
                          <p className="text-xs text-slate-400 font-medium truncate">{request.omschrijving}</p>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex justify-center">
                          <span className={`text-[9px] font-black uppercase tracking-widest px-3 py-1 rounded-lg border w-fit shadow-sm ${priorityColors[request.prioriteit]}`}>
                            {request.prioriteit}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        {request.status === 'opgelost' ? (
                          <div className="flex items-center gap-2 text-emerald-600 text-[10px] font-black uppercase tracking-widest italic opacity-60">
                            <CheckCircle2 size={14} />
                            Opgelost
                          </div>
                        ) : request.geplandeDatumSite || request.geplandeDatumRemote ? (
                          <div className="flex flex-col gap-1">
                            <div className={`flex items-center gap-1.5 w-fit px-2 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-widest ${
                                request.isRemote ? 'bg-indigo-50 text-indigo-600 border border-indigo-100' : 'bg-emerald-50 text-emerald-600 border border-emerald-100'
                            }`}>
                              {request.isRemote ? <Globe size={11} /> : <MapPin size={11} />}
                              {request.isRemote ? 'Remote' : 'Aanwezig'}
                            </div>
                            <span className="text-xs font-black text-slate-700 tracking-tight">{request.geplandeDatumSite || request.geplandeDatumRemote?.split('T')[0]}</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-slate-300 uppercase italic font-black text-[10px] tracking-widest">
                             Geen datum
                          </div>
                        )}
                      </td>
                      <td className="px-8 py-6 text-right">
                        <button 
                          onClick={() => setSelectedRequestId(request.id)}
                          className="px-4 py-2 bg-slate-50 text-slate-900 font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-slate-900 hover:text-white transition-all shadow-sm active:scale-95"
                        >
                          Details
                        </button>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
          {filteredRequests.length === 0 && (
            <div className="py-24 text-center">
               <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                  <Search className="text-slate-300" size={32} />
               </div>
               <h3 className="text-xl font-black text-slate-900 tracking-tight mb-2 uppercase">Geen meldingen gevonden</h3>
               <p className="text-slate-400 text-sm font-medium mb-6">Probeer een andere filter of zoekterm.</p>
               <button 
                 onClick={() => { setFilterSchool('Alle scholen'); setFilterStatus('Alle statussen'); setSearchQuery(''); }}
                 className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-indigo-700 shadow-xl shadow-indigo-600/20 active:scale-95"
               >
                 Reset Filters
               </button>
            </div>
          )}
        </div>
      </div>

      {/* Add Request Modal */}
      <AnimatePresence>
        {isAddingRequest && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden"
            >
              <div className="p-10">
                <div className="flex justify-between items-center mb-10">
                  <h3 className="text-2xl font-black text-slate-900 uppercase">Nieuwe Melding</h3>
                  <button onClick={() => setIsAddingRequest(false)} className="text-slate-400 hover:text-slate-900 font-black text-xs uppercase tracking-widest px-4 py-2 hover:bg-slate-50 rounded-xl transition-all">Sluiten ✕</button>
                </div>

                <form onSubmit={handleAddRequest} className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Naam</label>
                       <input 
                         required
                         type="text" 
                         className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold text-sm focus:border-indigo-500 transition-colors"
                         value={newRequestData.aanvrager}
                         onChange={(e) => setNewRequestData({...newRequestData, aanvrager: e.target.value})}
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">E-mail</label>
                       <input 
                         required
                         type="email" 
                         className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold text-sm focus:border-indigo-500 transition-colors"
                         value={newRequestData.email}
                         onChange={(e) => setNewRequestData({...newRequestData, email: e.target.value})}
                       />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">School</label>
                       <select 
                         className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold text-sm"
                         value={newRequestData.school}
                         onChange={(e) => setNewRequestData({...newRequestData, school: e.target.value})}
                       >
                         {schools.map(s => <option key={s} value={s}>{s}</option>)}
                       </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Prioriteit</label>
                       <select 
                         className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold text-sm"
                         value={newRequestData.prioriteit}
                         onChange={(e) => setNewRequestData({...newRequestData, prioriteit: e.target.value as any})}
                       >
                         <option value="laag">Laag</option>
                         <option value="normaal">Normaal</option>
                         <option value="dringend">Dringend</option>
                       </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Omschrijving</label>
                    <textarea 
                      required
                      rows={6}
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-medium text-sm focus:border-indigo-500 transition-colors"
                      value={newRequestData.omschrijving}
                      onChange={(e) => setNewRequestData({...newRequestData, omschrijving: e.target.value})}
                    />
                  </div>

                  <button className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-[2rem] font-black text-lg transition-all shadow-xl shadow-indigo-600/20 active:scale-95">TOEVOEGEN</button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedRequest && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white w-full max-w-4xl rounded-[3rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className={`h-2 w-full ${priorityColors[selectedRequest.prioriteit].split(' ')[0]} bg-indigo-600`} />
              
              <div className="p-10 overflow-y-auto no-scrollbar">
                <div className="flex justify-between items-start mb-10">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest bg-indigo-50 text-indigo-600 border border-indigo-100`}>
                        {selectedRequest.categorie}
                      </span>
                      <span className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{selectedRequest.datum}</span>
                    </div>
                    <h3 className="text-4xl font-black text-slate-900 tracking-tight uppercase">{selectedRequest.aanvrager}</h3>
                  </div>
                  <button onClick={() => setSelectedRequestId(null)} className="text-slate-400 hover:text-slate-900 font-black text-xs uppercase tracking-widest px-4 py-2 hover:bg-slate-50 rounded-xl transition-all">Sluiten ✕</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                  <div className="md:col-span-2 space-y-10">
                    <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
                      <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Omschrijving probleem</h4>
                      <p className="text-slate-700 font-medium text-lg leading-relaxed">{selectedRequest.omschrijving}</p>
                    </div>

                    {selectedRequest.beschikbareDagen && selectedRequest.beschikbareDagen.length > 0 && (
                      <div className="bg-slate-50 p-8 rounded-[2rem] border border-slate-100">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Aanwezig op school</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedRequest.beschikbareDagen.map(dag => (
                            <span key={dag} className="px-3 py-1 rounded-xl text-[10px] font-black bg-white border border-slate-200 text-slate-600 uppercase tracking-widest shadow-sm">
                              {dag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Interne Nota (enkel jij ziet dit)</label>
                      <textarea 
                        rows={6}
                        className="w-full p-6 bg-slate-900 text-white rounded-[2rem] outline-none font-mono text-xs leading-relaxed shadow-inner"
                        placeholder="Voeg aantekeningen toe voor collega's of jezelf..."
                        value={selectedRequest.interneNota || ''}
                        onChange={(e) => updateRequest(selectedRequest.id, { interneNota: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-8">
                     <div className="space-y-4">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Beheer Status</label>
                        <div className="space-y-2">
                           {['nieuw', 'ingepland', 'opgelost', 'geannuleerd'].map(s => (
                             <button 
                               key={s}
                               onClick={() => updateRequest(selectedRequest.id, { status: s as any })}
                               className={`w-full p-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border-2 flex items-center justify-between ${
                                 selectedRequest.status === s 
                                 ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' 
                                 : 'bg-white border-slate-100 text-slate-600 hover:border-indigo-200'
                               }`}
                             >
                               {s}
                               {selectedRequest.status === s && <CheckCircle2 size={16} />}
                             </button>
                           ))}
                        </div>
                     </div>

                     <div className="space-y-4 pt-4 border-t border-slate-100">
                        <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Planning (Ingepland)</label>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-100">
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">Oplosbaar op afstand</span>
                            <button 
                              onClick={() => updateRequest(selectedRequest.id, { isRemote: !selectedRequest.isRemote, geplandeDatumRemote: !selectedRequest.isRemote ? selectedRequest.geplandeDatumSite || '' : '', geplandeDatumSite: !selectedRequest.isRemote ? '' : selectedRequest.geplandeDatumRemote || '' })}
                              className={`w-12 h-6 rounded-full transition-colors relative ${selectedRequest.isRemote ? 'bg-indigo-600' : 'bg-slate-300'}`}
                            >
                              <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-all ${selectedRequest.isRemote ? 'left-7' : 'left-1'}`} />
                            </button>
                          </div>
                          
                          <input 
                            type="date"
                            value={(selectedRequest.isRemote ? selectedRequest.geplandeDatumRemote?.split('T')[0] : selectedRequest.geplandeDatumSite) || ''}
                            onChange={(e) => {
                              if (selectedRequest.isRemote) {
                                updateRequest(selectedRequest.id, { geplandeDatumRemote: e.target.value });
                              } else {
                                updateRequest(selectedRequest.id, { geplandeDatumSite: e.target.value });
                              }
                            }}
                            className="w-full p-4 bg-white border-2 border-slate-100 rounded-2xl outline-none font-bold text-sm text-slate-700 focus:border-indigo-500 transition-colors"
                          />
                        </div>
                     </div>

                     <div className="p-6 bg-emerald-50 rounded-[2rem] border border-emerald-100">
                        <h4 className="text-[10px] font-black text-emerald-700 uppercase tracking-widest mb-4 flex items-center gap-2">
                           <MapPin size={12} />
                           Locatie info
                        </h4>
                        <div className="space-y-2">
                           <p className="text-xs font-black text-emerald-900 uppercase">{selectedRequest.school}</p>
                           <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-tighter">API: {getAPIChannel(selectedRequest.school).name}</p>
                        </div>
                     </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* API Preview / Quick Log */}
       <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white overflow-hidden relative border border-slate-800 shadow-[0_30px_60px_rgba(0,0,0,0.2)]">
         <div className="absolute top-0 right-0 p-12 opacity-[0.03] rotate-12 -mr-16 -mt-16">
            <Mail size={300} />
         </div>
         <div className="relative z-10 space-y-8">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-2xl font-black tracking-tight uppercase">Data & API Kanalen</h3>
                <p className="text-slate-400 text-sm font-medium">Automatische triggers via Smartschool & Gmail.</p>
              </div>
              <button className="px-6 py-3 bg-white/5 border border-white/10 text-slate-300 font-black text-[10px] uppercase tracking-widest rounded-xl hover:bg-white/10 hover:text-white transition-colors">Volledig logboek →</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { to: 'jan.v@degrasmus.be', subject: 'Bevestiging: Melding ontvangen #872', channel: 'Gmail API', time: 'Nu' },
                { to: 'Smartschool: Matadi', subject: 'Update: ICT-bezoek ingepland', channel: 'Smartschool API', time: '14:22' },
                { to: 'an.d@deklarebron.be', subject: 'Ticket opgelost: Printertoegang', channel: 'Gmail API', time: 'Gisteren' },
              ].map((mail, i) => (
                <div key={i} className="bg-white/[0.03] p-4 rounded-2xl border border-white/[0.05] hover:bg-white/[0.05] transition-all group flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                     <div className="w-8 h-8 rounded-lg bg-indigo-600/20 text-indigo-400 flex items-center justify-center">
                        <MessageSquare size={14} />
                     </div>
                     <span className="text-[10px] font-mono text-slate-500 uppercase">{mail.time}</span>
                  </div>
                  <div>
                    <p className="text-sm font-black tracking-wide truncate">{mail.subject}</p>
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tighter mt-1">{mail.channel} • {mail.to}</p>
                  </div>
                </div>
              ))}
            </div>
         </div>
      </div>
    </div>
  );
}
