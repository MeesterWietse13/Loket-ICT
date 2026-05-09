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
    dringend: 'bg-[#F2E8E9] text-[#9A5B64] border-[#E6D1D4]',
    normaal: 'bg-[#F4EFE6] text-[#96723D] border-[#EAE1D2]',
    laag: 'bg-[#EDF2EF] text-[#557560] border-[#D4E0D8]',
  };

  const getAPIChannel = (school: string) => {
    if (school === 'Matadi' || school === 'Klaverblad') return { name: 'Smartschool API', icon: <MessageSquare size={12} className="text-[#96723D]" /> };
    return { name: 'Gmail API', icon: <Mail size={12} className="text-[#487184]" /> };
  };

  return (
    <div className="space-y-8 pb-20 selection:bg-[#CFDCE2] selection:text-[#2A4652]">
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-[#FDFBF7] -mx-8 -mt-8 px-10 py-8 border-b border-[#EAE1D2] mb-8">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
             <div className="w-12 h-12 bg-[#385B69] text-white rounded-xl flex items-center justify-center shadow-sm">
                <LayoutDashboardIcon size={24} />
             </div>
             <div>
                <h2 className="text-2xl font-bold text-[#0F172A] tracking-tight">ICT-dashboard</h2>
                <div className="flex gap-2 mt-1.5">
                  <span className="px-2.5 py-0.5 rounded-md text-xs font-medium bg-[#F2E8E9] text-[#9A5B64] border border-[#E6D1D4]">
                    {requests.filter(r => r.prioriteit === 'dringend').length} Dringend
                  </span>
                  <span className="px-2.5 py-0.5 rounded-md text-xs font-medium bg-[#EAF1F4] text-[#487184] border border-[#CFDCE2]">
                    {requests.filter(r => r.status === 'nieuw').length} Nieuw
                  </span>
                </div>
             </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex flex-col items-end mr-4">
             <span className="text-xs font-medium text-stone-500">Systeemstatus</span>
             <span className="text-sm font-medium text-[#557560] flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full bg-[#557560] animate-pulse" />
                Alle API's online
             </span>
          </div>
          <button 
            onClick={() => setIsAddingRequest(true)}
            className="group px-5 py-2.5 bg-[#385B69] hover:bg-[#2A4652] text-white rounded-xl flex items-center gap-2 transition-all shadow-sm active:scale-95 text-sm font-medium"
          >
            <Plus size={18} className="transition-transform group-hover:rotate-90" />
            <span>Melding toevoegen</span>
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Totaal open', value: stats.totaal, icon: LayoutDashboardIcon, bg: 'bg-[#EDF2EF]', border: 'border-[#D4E0D8]', text: 'text-[#557560]', valueText: 'text-[#0F172A]', iconBg: 'bg-[#FDFBF7]/50 text-[#557560] border-0' },
          { label: 'Nieuwe meldingen', value: stats.nieuw, icon: AlertTriangle, bg: 'bg-[#EAF1F4]', border: 'border-[#CFDCE2]', text: 'text-[#487184]', valueText: 'text-[#0F172A]', iconBg: 'bg-[#FDFBF7] text-[#487184] border border-[#CFDCE2]' },
          { label: 'Wacht op planning', value: stats.ongepland, icon: Clock, bg: 'bg-[#F4EFE6]', border: 'border-[#EAE1D2]', text: 'text-[#96723D]', valueText: 'text-[#0F172A]', iconBg: 'bg-[#FDFBF7]/50 text-[#96723D] border-0' },
          { label: 'Bezoeken vandaag', value: stats.vandaag, icon: MapPin, bg: 'bg-[#EDF2EF]', border: 'border-[#D4E0D8]', text: 'text-[#557560]', valueText: 'text-[#0F172A]', iconBg: 'bg-[#FDFBF7]/50 text-[#557560] border-0' },
        ].map((stat, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={i} 
            className={`${stat.bg} p-6 rounded-2xl border ${stat.border} flex flex-col justify-between transition-colors group relative overflow-hidden`}
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 shadow-sm ${stat.iconBg}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className={`text-sm font-medium ${stat.text} mb-1`}>{stat.label}</p>
              <p className={`text-3xl font-bold ${stat.valueText}`}>{stat.value}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filters Section */}
      <div className="bg-[#FDFBF7] p-6 rounded-2xl shadow-sm border border-[#EAE1D2] space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
           <div className="space-y-1">
             <h3 className="text-lg font-medium text-stone-800">Filters & weergave</h3>
             <p className="text-stone-500 text-sm">Personaliseer je dashboard overzicht.</p>
           </div>
           {/* School Selection Tabs as Pill Group */}
           <div className="flex items-center gap-2 p-1.5 bg-[#F4EFE6]/50 rounded-xl border border-[#EAE1D2] overflow-x-auto no-scrollbar scroll-smooth">
            <button 
              onClick={() => setFilterSchool('Alle scholen')}
              className={`px-4 py-2 text-xs font-medium transition-all rounded-lg whitespace-nowrap ${filterSchool === 'Alle scholen' ? 'bg-[#FDFBF7] shadow-sm text-[#2A4652] border border-[#EAE1D2]' : 'text-stone-500 hover:text-stone-700'}`}
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
                  className={`px-4 py-2 text-xs font-medium transition-all rounded-lg whitespace-nowrap ${isActive ? `${theme.bg} ${theme.text} shadow-sm border ${theme.border}` : 'text-stone-500 hover:text-stone-700'}`}
                >
                  {school}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-6 border-t border-[#EAE1D2]">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 group-focus-within:text-[#385B69] transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Zoek op naam of omschrijving..." 
              className="w-full pl-11 pr-4 py-3 bg-[#F4EFE6] border border-[#EAE1D2] rounded-xl focus:ring-2 focus:ring-[#CFDCE2] focus:border-[#487184] outline-none transition-all text-sm placeholder:text-[#8BA3AC]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" size={16} />
              <select 
                className="w-full pl-11 pr-4 py-3 bg-[#F4EFE6] border border-[#EAE1D2] rounded-xl focus:ring-2 focus:ring-[#CFDCE2] focus:border-[#487184] outline-none transition-all text-sm appearance-none cursor-pointer text-stone-700"
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
              className="flex items-center justify-center gap-2 px-6 py-3 bg-[#F4EFE6] border border-[#EAE1D2] rounded-xl text-sm font-medium text-stone-600 hover:bg-stone-100 transition-all active:scale-95 whitespace-nowrap"
            >
              <ArrowUpDown size={16} />
              {sortField === 'datum' ? 'Datum' : 'Prioriteit'}
            </button>
          </div>

          <div className="flex items-center gap-4 bg-[#EAF1F4]/50 px-5 py-3 rounded-xl border border-[#CFDCE2]">
             <div className="w-10 h-10 bg-[#FDFBF7] rounded-lg flex items-center justify-center shadow-sm text-[#385B69] shrink-0 border border-[#EAF1F4]">
                <Info size={18} />
             </div>
             <div>
                <p className="text-xs font-medium text-[#2A4652]">Huidige selectie</p>
                <p className="text-sm font-medium text-[#385B69] truncate">
                  {filterSchool} • {filteredRequests.length} Meldingen
                </p>
             </div>
          </div>
        </div>
      </div>

      {/* Requests Table Component */}
      <div className="bg-[#FDFBF7] rounded-2xl shadow-sm border border-[#EAE1D2] overflow-hidden min-h-[400px]">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-[#F4EFE6]/50 border-b border-[#EAE1D2] text-xs font-semibold text-stone-500">
                <th className="px-8 py-4">Datum / School</th>
                <th className="px-8 py-4">Aanvrager / Melding</th>
                <th className="px-8 py-4 text-center">Prioriteit</th>
                <th className="px-8 py-4">Status & Locatie</th>
                <th className="px-8 py-4 text-right">Beheer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
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
                      className="hover:bg-[#F4EFE6]/50 transition-colors group"
                    >
                      <td className="px-8 py-5">
                        <div className="flex flex-col gap-1">
                          <span className="text-sm font-medium text-stone-900">{request.datum}</span>
                          <span className={`text-xs font-medium ${schoolTheme.accent}`}>{request.school}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex flex-col min-w-0 max-w-[300px]">
                          <span className="text-sm font-medium text-stone-900 truncate">{request.aanvrager}</span>
                          <p className="text-sm text-stone-500 truncate">{request.omschrijving}</p>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex justify-center">
                          <span className={`text-xs font-medium px-2.5 py-1 rounded-md border w-fit shadow-sm ${priorityColors[request.prioriteit]}`}>
                            {request.prioriteit}
                          </span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        {request.status === 'opgelost' ? (
                          <div className="flex items-center gap-2 text-[#557560] text-sm font-medium">
                            <CheckCircle2 size={16} />
                            Opgelost
                          </div>
                        ) : request.geplandeDatumSite || request.geplandeDatumRemote ? (
                          <div className="flex flex-col gap-1.5">
                            <div className={`flex items-center gap-1.5 w-fit px-2.5 py-0.5 rounded-md text-xs font-medium ${
                                request.isRemote ? 'bg-[#EAF1F4] text-[#487184] border border-[#CFDCE2]' : 'bg-[#EDF2EF] text-[#557560] border border-[#D4E0D8]'
                            }`}>
                              {request.isRemote ? <Globe size={13} /> : <MapPin size={13} />}
                              {request.isRemote ? 'Remote' : 'Aanwezig'}
                            </div>
                            <span className="text-sm font-medium text-stone-700">{request.geplandeDatumSite || request.geplandeDatumRemote?.split('T')[0]}</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-stone-400 text-sm font-medium">
                             Geen datum
                          </div>
                        )}
                      </td>
                      <td className="px-8 py-5 text-right">
                        <button 
                          onClick={() => setSelectedRequestId(request.id)}
                          className="px-4 py-2 bg-stone-100 text-stone-700 font-medium text-xs rounded-lg hover:bg-[#385B69] hover:text-white transition-all shadow-sm active:scale-95"
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
               <div className="w-16 h-16 bg-[#F4EFE6] rounded-2xl flex items-center justify-center mx-auto mb-6 border border-[#EAE1D2]">
                  <Search className="text-stone-400" size={28} />
               </div>
               <h3 className="text-lg font-medium text-stone-900 mb-2">Geen meldingen gevonden</h3>
               <p className="text-stone-500 text-sm mb-6">Probeer een andere filter of zoekterm.</p>
               <button 
                 onClick={() => { setFilterSchool('Alle scholen'); setFilterStatus('Alle statussen'); setSearchQuery(''); }}
                 className="px-6 py-2.5 bg-[#385B69] text-white rounded-xl font-medium text-sm hover:bg-[#385B69] active:scale-95 shadow-sm transition-all"
               >
                 Reset filters
               </button>
            </div>
          )}
        </div>
      </div>

      {/* Add Request Modal */}
      <AnimatePresence>
        {isAddingRequest && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[#2A4652]/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#FDFBF7] w-full max-w-2xl rounded-2xl shadow-sm overflow-hidden"
            >
              <div className="p-10">
                <div className="flex justify-between items-center mb-10">
                  <h3 className="text-2xl font-medium text-stone-800">Nieuwe Melding</h3>
                  <button onClick={() => setIsAddingRequest(false)} className="text-stone-500 hover:text-stone-800 font-medium text-xs px-4 py-2 hover:bg-[#F4EFE6] rounded-xl transition-all">Sluiten ✕</button>
                </div>

                <form onSubmit={handleAddRequest} className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-xs font-medium text-stone-500 ml-1">Naam</label>
                       <input 
                         required
                         type="text" 
                         className="w-full p-4 bg-[#F4EFE6] border border-[#EAE1D2] rounded-2xl outline-none font-bold text-sm focus:border-[#385B69] transition-colors"
                         value={newRequestData.aanvrager}
                         onChange={(e) => setNewRequestData({...newRequestData, aanvrager: e.target.value})}
                       />
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-medium text-stone-500 ml-1">E-mail</label>
                       <input 
                         required
                         type="email" 
                         className="w-full p-4 bg-[#F4EFE6] border border-[#EAE1D2] rounded-2xl outline-none font-bold text-sm focus:border-[#385B69] transition-colors"
                         value={newRequestData.email}
                         onChange={(e) => setNewRequestData({...newRequestData, email: e.target.value})}
                       />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                       <label className="text-xs font-medium text-stone-500 ml-1">School</label>
                       <select 
                         className="w-full p-4 bg-[#F4EFE6] border border-[#EAE1D2] rounded-2xl outline-none font-bold text-sm"
                         value={newRequestData.school}
                         onChange={(e) => setNewRequestData({...newRequestData, school: e.target.value})}
                       >
                         {schools.map(s => <option key={s} value={s}>{s}</option>)}
                       </select>
                    </div>
                    <div className="space-y-2">
                       <label className="text-xs font-medium text-stone-500 ml-1">Prioriteit</label>
                       <select 
                         className="w-full p-4 bg-[#F4EFE6] border border-[#EAE1D2] rounded-2xl outline-none font-bold text-sm"
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
                    <label className="text-xs font-medium text-stone-500 ml-1">Omschrijving</label>
                    <textarea 
                      required
                      rows={6}
                      className="w-full p-4 bg-[#F4EFE6] border border-[#EAE1D2] rounded-2xl outline-none font-medium text-sm focus:border-[#385B69] transition-colors"
                      value={newRequestData.omschrijving}
                      onChange={(e) => setNewRequestData({...newRequestData, omschrijving: e.target.value})}
                    />
                  </div>

                  <button className="w-full py-5 bg-[#385B69] hover:bg-[#385B69] text-white rounded-2xl font-medium text-lg transition-all shadow-sm shadow-[#385B69]/20 active:scale-95">TOEVOEGEN</button>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedRequest && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-[#2A4652]/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-[#FDFBF7] w-full max-w-4xl rounded-2xl shadow-sm overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className={`h-2 w-full ${priorityColors[selectedRequest.prioriteit].split(' ')[0]} bg-[#385B69]`} />
              
              <div className="p-10 overflow-y-auto no-scrollbar">
                <div className="flex justify-between items-start mb-10">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <span className={`px-3 py-1 rounded-lg text-xs font-medium   bg-[#EAF1F4] text-[#385B69] border border-[#CFDCE2]`}>
                        {selectedRequest.categorie}
                      </span>
                      <span className="text-stone-500 text-xs font-medium">{selectedRequest.datum}</span>
                    </div>
                    <h3 className="text-4xl font-medium text-stone-800">{selectedRequest.aanvrager}</h3>
                  </div>
                  <button onClick={() => setSelectedRequestId(null)} className="text-stone-500 hover:text-stone-800 font-medium text-xs px-4 py-2 hover:bg-[#F4EFE6] rounded-xl transition-all">Sluiten ✕</button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                  <div className="md:col-span-2 space-y-10">
                    <div className="bg-[#F4EFE6] p-8 rounded-2xl border border-[#EAE1D2]">
                      <h4 className="text-xs font-medium text-stone-500 mb-4">Omschrijving probleem</h4>
                      <p className="text-slate-700 font-medium text-lg leading-relaxed">{selectedRequest.omschrijving}</p>
                    </div>

                    {selectedRequest.beschikbareDagen && selectedRequest.beschikbareDagen.length > 0 && (
                      <div className="bg-[#F4EFE6] p-8 rounded-2xl border border-[#EAE1D2]">
                        <h4 className="text-xs font-medium text-stone-500 mb-4">Aanwezig op school</h4>
                        <div className="flex flex-wrap gap-2">
                          {selectedRequest.beschikbareDagen.map(dag => (
                            <span key={dag} className="px-3 py-1 rounded-xl text-xs font-medium bg-[#FDFBF7] border border-[#EAE1D2] text-slate-600 shadow-sm">
                              {dag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="space-y-4">
                      <label className="text-xs font-medium text-stone-500 ml-1">Interne Nota (enkel jij ziet dit)</label>
                      <textarea 
                        rows={6}
                        className="w-full p-6 bg-[#2A4652] text-white rounded-2xl outline-none font-mono text-xs leading-relaxed shadow-inner"
                        placeholder="Voeg aantekeningen toe voor collega's of jezelf..."
                        value={selectedRequest.interneNota || ''}
                        onChange={(e) => updateRequest(selectedRequest.id, { interneNota: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-8">
                     <div className="space-y-4">
                        <label className="text-xs font-medium text-stone-500 ml-1">Beheer Status</label>
                        <div className="space-y-2">
                           {['nieuw', 'ingepland', 'opgelost', 'geannuleerd'].map(s => (
                             <button 
                               key={s}
                               onClick={() => updateRequest(selectedRequest.id, { status: s as any })}
                               className={`w-full p-4 rounded-2xl text-xs font-medium   transition-all border-2 flex items-center justify-between ${
                                 selectedRequest.status === s 
                                 ? 'bg-[#385B69] border-[#385B69] text-white shadow-sm' 
                                 : 'bg-[#FDFBF7] border-[#EAE1D2] text-slate-600 hover:border-[#CFDCE2]'
                               }`}
                             >
                               {s}
                               {selectedRequest.status === s && <CheckCircle2 size={16} />}
                             </button>
                           ))}
                        </div>
                     </div>

                     <div className="space-y-4 pt-4 border-t border-[#EAE1D2]">
                        <label className="text-xs font-medium text-stone-500 ml-1">Planning (Ingepland)</label>
                        <div className="space-y-3">
                          <div className="flex items-center justify-between bg-[#F4EFE6] p-4 rounded-2xl border border-[#EAE1D2]">
                            <span className="text-xs font-medium text-slate-600">Oplosbaar op afstand</span>
                            <button 
                              onClick={() => updateRequest(selectedRequest.id, { isRemote: !selectedRequest.isRemote, geplandeDatumRemote: !selectedRequest.isRemote ? selectedRequest.geplandeDatumSite || '' : '', geplandeDatumSite: !selectedRequest.isRemote ? '' : selectedRequest.geplandeDatumRemote || '' })}
                              className={`w-12 h-6 rounded-full transition-colors relative ${selectedRequest.isRemote ? 'bg-[#385B69]' : 'bg-[#CAD6DC]'}`}
                            >
                              <div className={`w-4 h-4 rounded-full bg-[#FDFBF7] absolute top-1 transition-all ${selectedRequest.isRemote ? 'left-7' : 'left-1'}`} />
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
                            className="w-full p-4 bg-[#FDFBF7] border-2 border-[#EAE1D2] rounded-2xl outline-none font-bold text-sm text-slate-700 focus:border-[#385B69] transition-colors"
                          />
                        </div>
                     </div>

                     <div className="p-6 bg-[#EDF2EF] rounded-2xl border border-[#D4E0D8]">
                        <h4 className="text-xs font-medium text-[#557560] mb-4 flex items-center gap-2">
                           <MapPin size={12} />
                           Locatie info
                        </h4>
                        <div className="space-y-2">
                           <p className="text-xs font-medium text-[#0F172A]">{selectedRequest.school}</p>
                           <p className="text-xs text-[#557560] font-bold">API: {getAPIChannel(selectedRequest.school).name}</p>
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
       <div className="bg-[#F4EFE6] rounded-2xl p-8 border border-[#EAE1D2] overflow-hidden relative shadow-sm">
         <div className="absolute top-0 right-0 p-12 opacity-[0.03] rotate-12 -mr-16 -mt-16 text-[#0F172A]">
            <Mail size={300} />
         </div>
         <div className="relative z-10 space-y-6">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h3 className="text-xl font-medium text-stone-800">Data & API kanalen</h3>
                <p className="text-stone-500 text-sm">Automatische triggers via Smartschool & Gmail.</p>
              </div>
              <button className="px-5 py-2.5 bg-[#FDFBF7] border border-[#EAE1D2] text-stone-600 font-medium text-xs rounded-xl hover:bg-stone-100 transition-colors shadow-sm">Overzicht logboek</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                { to: 'jan.v@degrasmus.be', subject: 'Bevestiging: Melding ontvangen #872', channel: 'Gmail API', time: 'Nu' },
                { to: 'Smartschool: Matadi', subject: 'Update: ICT-bezoek ingepland', channel: 'Smartschool API', time: '14:22' },
                { to: 'an.d@deklarebron.be', subject: 'Ticket opgelost: Printertoegang', channel: 'Gmail API', time: 'Gisteren' },
              ].map((mail, i) => (
                <div key={i} className="bg-[#FDFBF7] p-4 rounded-xl border border-[#EAE1D2] shadow-sm flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                     <div className="w-8 h-8 rounded-lg bg-[#EAF1F4] text-[#385B69] border border-[#CFDCE2] flex items-center justify-center">
                        <MessageSquare size={14} />
                     </div>
                     <span className="text-xs text-stone-400">{mail.time}</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-stone-800 truncate">{mail.subject}</p>
                    <p className="text-xs text-stone-500 mt-1">{mail.channel} • {mail.to}</p>
                  </div>
                </div>
              ))}
            </div>
         </div>
      </div>
    </div>
  );
}
