import React from 'react';
import { 
  Calendar as CalendarIcon, MapPin, Globe, 
  UserPlus, UserMinus, Clock, ChevronRight
} from 'lucide-react';
import { ICTRequest, PersonnelNotification } from '../types';

interface PlanningProps {
  requests: ICTRequest[];
  personnel: PersonnelNotification[];
}

export default function Planning({ requests, personnel }: PlanningProps) {
  // Get upcoming visit dates
  const futureRequests = requests.filter(r => (r.geplandeDatumSite || r.geplandeDatumRemote) && r.status !== 'opgelost' && r.status !== 'geannuleerd');
  const futurePersonnel = personnel.filter(p => p.status !== 'afgerond');

  // Group by date
  const groupedEvents: { [date: string]: any[] } = {};

  futureRequests.forEach(r => {
    const d = r.geplandeDatumSite || r.geplandeDatumRemote?.split('T')[0] || 'Onbekende datum';
    if (!groupedEvents[d]) groupedEvents[d] = [];
    groupedEvents[d].push({ ...r, type: 'ICT Request' });
  });

  futurePersonnel.forEach(p => {
    const d = p.datum;
    if (!groupedEvents[d]) groupedEvents[d] = [];
    groupedEvents[d].push({ ...p, type: 'Personeelswissel' });
  });

  const sortedDates = Object.keys(groupedEvents).sort();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between h-16 bg-white -mx-8 -mt-8 px-8 border-b border-slate-200 shadow-sm mb-8">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-bold text-slate-800 font-sans tracking-tight">Planning & Agenda</h2>
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-700 uppercase tracking-wide">
            {futureRequests.length + futurePersonnel.length} Items gepland
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          {sortedDates.length > 0 ? sortedDates.map(date => (
             <div key={date} className="relative pl-8 border-l-2 border-slate-200 pb-8 last:pb-0">
                <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-white border-2 border-slate-400" />
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="text-lg font-bold text-slate-900">{new Date(date).toLocaleDateString('nl-BE', { weekday: 'long', day: 'numeric', month: 'long' })}</h3>
                  {date === new Date().toISOString().split('T')[0] && (
                    <span className="bg-rose-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">Vandaag</span>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-3">
                  {groupedEvents[date].map((event, i) => (
                    <div key={i} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between hover:border-indigo-300 transition-all cursor-default">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-lg ${
                          event.type === 'ICT Request' 
                            ? event.isRemote ? 'bg-slate-100 text-slate-700' : 'bg-indigo-100 text-indigo-700'
                            : event.type === 'nieuwe medewerker' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'
                        }`}>
                          {event.type === 'ICT Request' ? (event.isRemote ? <Globe size={20} /> : <MapPin size={20} />) : (event.type === 'nieuwe medewerker' ? <UserPlus size={20} /> : <UserMinus size={20} />)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                             <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{event.type}</span>
                             <span className="w-1 h-1 rounded-full bg-slate-300" />
                             <span className="text-xs font-bold text-indigo-600 uppercase">{event.school}</span>
                          </div>
                          <h4 className="font-bold text-slate-900">
                            {event.type === 'ICT Request' ? event.omschrijving : `${event.voornaam} ${event.naam}`}
                          </h4>
                          <div className="flex items-center gap-3 mt-1">
                            <span className="text-sm text-slate-500">{event.type === 'ICT Request' ? event.aanvrager : event.functie}</span>
                            {event.geplandeDatumRemote && event.geplandeDatumRemote.includes('T') && (
                               <div className="flex items-center gap-1 text-slate-400 text-xs">
                                  <Clock size={12} />
                                  {event.geplandeDatumRemote.split('T')[1].substring(0, 5)}
                               </div>
                            )}
                          </div>
                        </div>
                      </div>
                      <ChevronRight size={18} className="text-slate-300" />
                    </div>
                  ))}
                </div>
             </div>
          )) : (
            <div className="bg-white p-12 rounded-xl border border-slate-200 border-dashed text-center">
               <CalendarIcon size={48} className="mx-auto text-slate-200 mb-4" />
               <p className="text-slate-500 font-medium">Geen items gepland voor de komende periode.</p>
            </div>
          )}
        </div>

        <div className="space-y-6">
           <div className="bg-indigo-900 text-white p-6 rounded-2xl shadow-xl overflow-hidden relative">
              <div className="absolute top-0 right-0 p-8 opacity-10">
                <CalendarIcon size={120} />
              </div>
              <h3 className="text-xl font-bold mb-1 relative z-10">Mijn Weekoverzicht</h3>
              <p className="text-indigo-300 text-sm mb-6 relative z-10">Focuspunten voor deze week.</p>
              
              <div className="space-y-4 relative z-10">
                 {[
                   { day: 'Ma', title: 'De Grasmus', count: 3 },
                   { day: 'Di', title: 'Matadi (VM)', count: 1 },
                   { day: 'Wo', title: 'Bureaudag', count: 0 },
                   { day: 'Do', title: 'De Klare Bron', count: 4 },
                   { day: 'Vr', title: 'Klaverblad', count: 2 },
                 ].map((d, i) => (
                   <div key={i} className="flex items-center justify-between">
                     <span className="text-xs font-bold text-indigo-400 w-8">{d.day}</span>
                     <span className="flex-1 text-sm font-medium">{d.title}</span>
                     {d.count > 0 && (
                       <span className="bg-white/20 text-white text-[10px] font-bold h-5 w-5 rounded-full flex items-center justify-center">{d.count}</span>
                     )}
                   </div>
                 ))}
              </div>
              
              <button className="w-full mt-8 bg-indigo-500 hover:bg-indigo-400 text-white py-2 rounded-lg text-sm font-bold transition-all active:scale-95 shadow-lg">
                Weekrapport downloaden
              </button>
           </div>

           <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
             <h3 className="text-sm font-bold text-slate-900 mb-4">Ongeplande takenwissels</h3>
             <div className="space-y-3">
               {personnel.filter(p => p.status === 'nieuw').length > 0 ? personnel.filter(p => p.status === 'nieuw').map((p, i) => (
                  <div key={i} className="p-3 bg-slate-50 rounded-lg border border-slate-100 flex items-center justify-between">
                    <div className="min-w-0">
                      <p className="text-sm font-bold text-slate-900 truncate">{p.voornaam} {p.naam}</p>
                      <p className="text-[10px] text-slate-500 font-medium uppercase">{p.school}</p>
                    </div>
                    <button className="text-xs font-bold text-indigo-600 hover:underline">Plan in</button>
                  </div>
               )) : (
                 <p className="text-xs text-slate-400 italic">Geen dringende personeelstaken.</p>
               )}
             </div>
           </div>
        </div>
      </div>
    </div>
  );
}
