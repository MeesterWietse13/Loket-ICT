import React, { useState } from 'react';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  addDays, 
  eachDayOfInterval,
  isToday,
  parseISO
} from 'date-fns';
import { nl } from 'date-fns/locale';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, MapPin, Home, Briefcase, Pill, Plane } from 'lucide-react';
import { CalendarEntry } from '../types';
import { SCHOOL_COLORS } from '../constants/theme';

interface VisitCalendarProps {
  entries: CalendarEntry[];
  compact?: boolean;
}

const locationIcons: Record<string, React.ReactNode> = {
  'Thuiswerk': <Home size={14} />,
  'Bureaudag': <Briefcase size={14} />,
  'Ziek': <Pill size={14} />,
  'Verlof': <Plane size={14} />,
  'default': <MapPin size={14} />
};

export default function VisitCalendar({ entries, compact = false }: VisitCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [isExpanded, setIsExpanded] = useState(false);

  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));
  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

  const dateFormat = "MMMM yyyy";
  const allDaysMonth = eachDayOfInterval({ start: startDate, end: endDate });
  
  const currentWeekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const currentWeekEnd = endOfWeek(new Date(), { weekStartsOn: 1 });
  const currentWeekDays = eachDayOfInterval({ start: currentWeekStart, end: currentWeekEnd });

  const daysToRender = isExpanded ? allDaysMonth : currentWeekDays;

  return (
    <div 
      className={`bg-[#FDFBF7] rounded-2xl border border-[#CAD6DC] shadow-sm overflow-hidden transition-all duration-500 ease-in-out ${compact ? 'scale-95 origin-top' : ''} ${!isExpanded ? 'max-h-[220px]' : 'max-h-[1000px]'}`}
    >
      {/* Header */}
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="flex items-center justify-between p-6 border-b border-[#CAD6DC] bg-[#FDFBF7] cursor-pointer hover:bg-white transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#E5ECEF] rounded-xl flex items-center justify-center text-[#385B69] shadow-inner">
            <CalendarIcon size={20} />
          </div>
          <div>
            <h3 className="font-medium text-[#0F172A] capitalize text-lg">
              {isExpanded ? format(currentMonth, dateFormat, { locale: nl }) : 'Planning deze week'}
            </h3>
            <p className="text-xs text-[#2A4652] font-bold">
              {isExpanded ? 'Volledig overzicht' : 'Klik voor maandoverzicht'}
            </p>
          </div>
        </div>
        {isExpanded && (
          <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
            <button onClick={prevMonth} className="p-2.5 hover:bg-white rounded-xl transition-all border border-stone-100 hover:border-stone-200 active:scale-90 shadow-sm">
              <ChevronLeft size={20} className="text-slate-600" />
            </button>
            <button onClick={nextMonth} className="p-2.5 hover:bg-white rounded-xl transition-all border border-stone-100 hover:border-stone-200 active:scale-90 shadow-sm">
              <ChevronRight size={20} className="text-slate-600" />
            </button>
          </div>
        )}
        {!isExpanded && (
           <div className="px-3 py-1 bg-stone-100 text-slate-600 rounded-lg text-xs font-medium">
             Open
           </div>
        )}
      </div>

      {/* Weekdays */}
      <div className="grid grid-cols-7 bg-[#FDFBF7] border-b border-[#CAD6DC]">
        {['Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag', 'Zondag'].map(d => (
          <div key={d} className="py-2.5 text-center text-xs font-medium text-[#2A4652]">
            {d.substring(0, 2)}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-7 gap-px bg-[#CAD6DC]/30">
        {daysToRender.map((d, i) => {
          const dateStr = format(d, 'yyyy-MM-dd');
          const entry = entries.find(e => e.date === dateStr);
          const isSelectedMonth = isSameMonth(d, monthStart);
          const isTodayDate = isToday(d);
          const theme = entry ? (SCHOOL_COLORS[entry.location] || SCHOOL_COLORS['default']) : null;

          return (
            <div 
              key={i} 
              className={`min-h-[100px] bg-[#FDFBF7] p-3 transition-all relative group ${isExpanded && !isSelectedMonth ? 'bg-stone-50/30 opacity-40' : ''}`}
            >
              <div className="flex justify-between items-start mb-2">
                <span className={`text-xs font-medium transition-colors ${
                  isTodayDate ? 'w-7 h-7 bg-[#385B69] text-white rounded-lg flex items-center justify-center shadow-sm' : 
                  isSelectedMonth ? 'text-[#0F172A] group-hover:text-black' : 'text-[#8BA3AC]'
                }`}>
                  {format(d, 'd')}
                </span>
                {isTodayDate && (
                  <div className="w-1.5 h-1.5 rounded-full bg-[#385B69] animate-pulse" />
                )}
              </div>
              
              {entry && theme && (
                <div className={`mt-1 p-2 rounded-xl border text-xs font-medium flex flex-col gap-1 shadow-sm transition-all hover:scale-105 active:scale-95 cursor-default ${
                  theme.bg} text-white ${theme.border}
                `}>
                  <div className="flex items-center gap-1.5">
                    {locationIcons[entry.location] || locationIcons['default']}
                    <span className="truncate">{entry.location}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      {!compact && (
        <div className="p-6 bg-white border-t border-stone-100 flex flex-wrap gap-6 justify-center">
           {Object.entries(SCHOOL_COLORS).filter(([key]) => key !== 'default').map(([name, theme]) => (
             <div key={name} className="flex items-center gap-2 text-xs font-medium text-stone-500 transition-opacity hover:opacity-100 opacity-70">
                <div className={`w-3 h-3 rounded-md shadow-sm ${theme.bg}`} />
                {name}
             </div>
           ))}
        </div>
      )}
    </div>
  );
}
