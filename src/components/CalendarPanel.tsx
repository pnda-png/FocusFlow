import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, Plus, Trash2, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import type { Homework, CalendarEvent } from '../types';

interface CalendarPanelProps {
  homeworks: Homework[];
  events: CalendarEvent[];
  onAddEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  onDeleteEvent: (id: string) => void;
}

export default function CalendarPanel({ homeworks, events, onAddEvent, onDeleteEvent }: CalendarPanelProps) {
  const [viewDate, setViewDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<number | null>(new Date().getDate());
  const [isAddingEvent, setIsAddingEvent] = useState(false);

  // Form state for new event
  const [newTitle, setNewTitle] = useState('');
  const [newType, setNewType] = useState<CalendarEvent['type']>('Personal');
  const [newTime, setNewTime] = useState('12:00');

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const monthName = viewDate.toLocaleString('default', { month: 'long' });
  const weekdays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = new Date(year, month, 1).getDay();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  const prevMonth = () => {
    setViewDate(new Date(year, month - 1, 1));
    setSelectedDay(null);
  };

  const nextMonth = () => {
    setViewDate(new Date(year, month + 1, 1));
    setSelectedDay(null);
  };

  const today = new Date();
  const isSelectedMonthToday = today.getFullYear() === year && today.getMonth() === month;

  // Find homeworks in this month
  const homeworkDays = useMemo(() => {
    const map: Record<number, Homework[]> = {};
    homeworks.forEach(h => {
      const [y, m, d] = h.deadline.split('-').map(Number);
      if (y === year && m === month + 1) {
        if (!map[d]) map[d] = [];
        map[d].push(h);
      }
    });
    return map;
  }, [homeworks, year, month]);

  // Find events in this month
  const calendarEventDays = useMemo(() => {
    const map: Record<number, CalendarEvent[]> = {};
    events.forEach(e => {
      const [y, m, d] = e.date.split('-').map(Number);
      if (y === year && m === month + 1) {
        if (!map[d]) map[d] = [];
        map[d].push(e);
      }
    });
    return map;
  }, [events, year, month]);

  const selectedDayHomeworks = selectedDay ? homeworkDays[selectedDay] || [] : [];
  const selectedDayEvents = selectedDay ? calendarEventDays[selectedDay] || [] : [];

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedDay) return;
    
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(selectedDay).padStart(2, '0')}`;
    onAddEvent({
      title: newTitle,
      type: newType,
      date: dateStr,
      startTime: newTime
    });
    
    setNewTitle('');
    setIsAddingEvent(false);
  };

  const getEventTypeColor = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'Exam': return 'bg-red-500';
      case 'Study Group': return 'bg-purple-500';
      case 'Extracurricular': return 'bg-orange-500';
      case 'Personal': return 'bg-blue-500';
      default: return 'bg-slate-400';
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
      <section className="glass-panel p-6 rounded-3xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-on-surface">{monthName} {year}</h3>
          <div className="flex gap-1">
            <button 
              onClick={prevMonth}
              className="p-1.5 hover:bg-surface-container rounded-full transition-colors"
            >
              <ChevronLeft size={20} />
            </button>
            <button 
              onClick={nextMonth}
              className="p-1.5 hover:bg-surface-container rounded-full transition-colors"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-7 gap-y-2 text-center text-on-surface">
          {weekdays.map(day => (
            <div key={day} className="text-[10px] font-bold text-on-surface-variant/60 tracking-wider mb-2">
              {day}
            </div>
          ))}
          
          {emptyDays.map(i => (
            <div key={`empty-${i}`} className="p-2" />
          ))}

          {days.map(day => {
            const hws = homeworkDays[day] || [];
            const evs = calendarEventDays[day] || [];
            const isToday = isSelectedMonthToday && day === today.getDate();
            const isSelected = selectedDay === day;
            
            return (
              <button 
                key={day} 
                onClick={() => setSelectedDay(day)}
                className={`p-2 w-full aspect-square text-sm font-medium rounded-xl cursor-pointer transition-all relative flex flex-col items-center justify-center gap-1 ${
                  isToday ? 'bg-primary/10 text-primary font-bold shadow-sm' : 
                  isSelected ? 'bg-primary text-white shadow-lg' : 'hover:bg-surface-container-high'
                }`}
              >
                {day}
                {(hws.length > 0 || evs.length > 0) && !isSelected && (
                  <div className="flex gap-0.5 justify-center">
                    {evs.slice(0, 3).map((e, idx) => (
                      <span key={e.id + idx} className={`w-1 h-1 rounded-full ${getEventTypeColor(e.type)}`} />
                    ))}
                    {hws.slice(0, 2).map((h, idx) => (
                      <span key={h.id + idx} className="w-1 h-1 rounded-full bg-slate-400 opacity-50" />
                    ))}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </section>

    <section className="glass-panel p-6 rounded-3xl flex flex-col min-h-[400px]">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-primary/10 rounded-2xl text-primary">
            <CalendarIcon size={20} />
          </div>
          <div>
            <h3 className="text-lg font-bold font-display text-on-surface">
              {selectedDay ? `${monthName} ${selectedDay}, ${year}` : 'Select a date'}
            </h3>
            <p className="text-xs text-on-surface-variant uppercase tracking-widest font-bold">
              {selectedDayHomeworks.length + selectedDayEvents.length} Total items
            </p>
          </div>
        </div>
        {selectedDay && (
          <button 
            onClick={() => setIsAddingEvent(true)}
            className="p-2 bg-primary/10 text-primary rounded-xl hover:bg-primary hover:text-white transition-all shadow-sm"
            title="Add Custom Event"
          >
            <Plus size={20} />
          </button>
        )}
      </div>

      <div className="flex-1 space-y-6 overflow-y-auto pr-2 no-scrollbar">
        {/* Custom Events */}
        {selectedDayEvents.length > 0 && (
          <div>
            <h4 className="text-[10px] font-black text-on-surface-variant/40 uppercase tracking-[0.2em] mb-3">Custom Events</h4>
            <div className="space-y-3">
              {selectedDayEvents.map(event => (
                <div key={event.id} className="p-4 bg-surface-container/30 border border-primary/5 rounded-2xl flex items-center justify-between group hover:border-primary/20 transition-all">
                  <div className="flex items-center gap-4">
                    <div className={`w-2 h-10 rounded-full ${getEventTypeColor(event.type)}`} />
                    <div>
                      <h4 className="text-sm font-bold text-on-surface">{event.title}</h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-wider">{event.type}</span>
                        {event.startTime && (
                          <span className="text-[10px] font-medium text-on-surface-variant/40">• {event.startTime}</span>
                        )}
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => onDeleteEvent(event.id)}
                    className="p-2 text-on-surface-variant/0 group-hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

          {/* Homework deadlines */}
          {selectedDayHomeworks.length > 0 && (
            <div>
              <h4 className="text-[10px] font-black text-on-surface-variant/40 uppercase tracking-[0.2em] mb-3">Homework Deadlines</h4>
              <div className="space-y-3">
                {selectedDayHomeworks.map(task => (
                  <div key={task.id} className="p-4 bg-surface-container-low border border-primary/5 rounded-2xl flex items-center justify-between group hover:border-primary/20 transition-all">
                    <div className="flex items-center gap-4">
                      <div className={`w-2 h-10 rounded-full ${
                        task.priority === 'High' ? 'bg-red-500' : 
                        task.priority === 'Medium' ? 'bg-orange-500' : 'bg-green-500'
                      } opacity-40`} />
                      <div>
                        <h4 className={`text-sm font-bold ${task.completed ? 'line-through opacity-50' : ''}`}>
                          {task.name}
                        </h4>
                        <p className="text-[10px] font-bold text-on-surface-variant/60 uppercase tracking-wider">
                          {task.subject}
                        </p>
                      </div>
                    </div>
                    {task.completed && (
                      <span className="text-[10px] font-black text-green-500 border border-green-500/20 px-2 py-1 rounded-lg">DONE</span>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedDayHomeworks.length === 0 && selectedDayEvents.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center p-8 opacity-40">
              <Clock size={40} className="mb-3" />
              <p className="text-sm font-medium text-on-surface">No activities planned</p>
            </div>
          )}
        </div>
      </section>

      {/* Add Event Modal */}
      <AnimatePresence>
        {isAddingEvent && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAddingEvent(false)}
              className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative glass-panel w-full max-w-sm p-8 rounded-[32px] shadow-2xl"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-on-surface">New Event</h3>
                <button onClick={() => setIsAddingEvent(false)} className="text-on-surface-variant hover:text-on-surface">
                  <X size={24} />
                </button>
              </div>

              <form onSubmit={handleAddSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-1">Title</label>
                  <input 
                    autoFocus
                    required
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    placeholder="Study session, Exam..."
                    className="w-full bg-surface-container-low p-4 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all text-on-surface"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-1">Type</label>
                    <select 
                      value={newType}
                      onChange={e => setNewType(e.target.value as CalendarEvent['type'])}
                      className="w-full bg-surface-container-low p-4 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 appearance-none text-on-surface"
                    >
                      <option value="Exam">Exam</option>
                      <option value="Study Group">Study Group</option>
                      <option value="Extracurricular">Extracurricular</option>
                      <option value="Personal">Personal</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-1">Time</label>
                    <input 
                      type="time"
                      value={newTime}
                      onChange={e => setNewTime(e.target.value)}
                      className="w-full bg-surface-container-low p-4 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 text-on-surface"
                    />
                  </div>
                </div>

                <div className="pt-2 text-[10px] font-bold text-on-surface-variant/40 text-center uppercase tracking-widest">
                  Date: {monthName} {selectedDay}, {year}
                </div>

                <button 
                  type="submit"
                  className="w-full bg-primary text-white py-4 rounded-2xl font-bold mt-4 shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
                >
                  Save Event
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
