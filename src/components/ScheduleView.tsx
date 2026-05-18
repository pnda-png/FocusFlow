import React, { useState } from 'react';
import { Clock, Plus, Trash2, Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import type { ScheduleItem } from '../types';

interface ScheduleViewProps {
  schedule: ScheduleItem[];
  onAdd: (item: Omit<ScheduleItem, 'id'>) => void;
  onDelete: (id: string) => void;
}

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const SUBJECTS = ['Mathematics', 'Biology', 'History', 'Physics', 'Literature', 'Art', 'Other'];
const COLORS = [
  'bg-blue-500/10 text-blue-500', 
  'bg-purple-500/10 text-purple-500', 
  'bg-emerald-500/10 text-emerald-500', 
  'bg-orange-500/10 text-orange-500', 
  'bg-rose-500/10 text-rose-500',
  'bg-teal-500/10 text-teal-500',
  'bg-slate-500/10 text-slate-500'
];

export default function ScheduleView({ schedule, onAdd, onDelete }: ScheduleViewProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [selectedDay, setSelectedDay] = useState(DAYS[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1]);
  
  // Form state
  const [activity, setActivity] = useState('');
  const [subject, setSubject] = useState(SUBJECTS[0]);
  const [startTime, setStartTime] = useState('09:00');
  const [endTime, setEndTime] = useState('10:00');
  const [formDay, setFormDay] = useState(selectedDay);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({ activity, subject, startTime, endTime, dayOfWeek: formDay });
    setIsAdding(false);
    setActivity('');
  };

  const filteredSchedule = schedule
    .filter(item => item.dayOfWeek === selectedDay)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-on-surface">Weekly Planner</h2>
          <p className="text-on-surface-variant">Organize your study sessions and classes</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-primary text-white px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-primary/20"
        >
          <Plus size={20} />
          Add Activity
        </button>
      </div>

      {/* Days Selector */}
      <div className="flex bg-surface-container/50 p-2 rounded-2xl overflow-x-auto no-scrollbar scroll-smooth">
        {DAYS.map((day) => (
          <button
            key={day}
            onClick={() => setSelectedDay(day)}
            className={`px-6 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
              selectedDay === day 
                ? 'bg-white dark:bg-primary text-primary dark:text-white shadow-sm' 
                : 'text-on-surface-variant/40 hover:text-on-surface-variant dark:hover:text-white'
            }`}
          >
            {day}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-4">
          <AnimatePresence mode="popLayout">
            {filteredSchedule.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="glass-panel p-20 rounded-3xl flex flex-col items-center justify-center text-center space-y-4"
              >
                <div className="w-20 h-20 bg-surface-container rounded-full flex items-center justify-center text-on-surface-variant/20">
                  <Clock size={40} />
                </div>
                <h3 className="text-xl font-bold text-on-surface">Nothing scheduled for {selectedDay}</h3>
                <p className="text-on-surface-variant max-w-xs mx-auto">Use the button above to add classes or study blocks.</p>
              </motion.div>
            ) : (
              filteredSchedule.map((item) => (
                <motion.div
                  layout
                  key={item.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="glass-panel p-6 rounded-2xl flex items-center justify-between group hover:border-primary/20 transition-all"
                >
                  <div className="flex items-center gap-6">
                    <div className="text-center min-w-[70px]">
                      <p className="text-sm font-bold text-primary">{item.startTime}</p>
                      <div className="w-px h-4 bg-surface-container mx-auto my-1" />
                      <p className="text-xs font-medium text-on-surface-variant/40">{item.endTime}</p>
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-on-surface mb-1">{item.activity}</h4>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        COLORS[SUBJECTS.indexOf(item.subject) % COLORS.length]
                      }`}>
                        {item.subject}
                      </span>
                    </div>
                  </div>
                  <button 
                    onClick={() => onDelete(item.id)}
                    className="p-2 text-on-surface-variant/20 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>

        {/* Mini Calendar or Info Panel */}
        <div className="lg:col-span-4 space-y-6">
          <div className="glass-panel p-8 rounded-3xl">
            <h3 className="text-lg font-bold text-on-surface mb-4">Study Tip</h3>
            <p className="text-sm text-on-surface-variant leading-relaxed">
              Research shows that studying in 25-50 minute blocks with 5-10 minute breaks (Pomodoro) is most effective for retention. 
            </p>
            <div className="mt-6 flex items-center gap-4 p-4 bg-primary/5 rounded-2xl text-primary">
              <Clock size={20} />
              <span className="text-sm font-bold">Try the 50/10 rule today!</span>
            </div>
          </div>
        </div>
      </div>

      {/* Add Activity Modal/Overlay */}
      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsAdding(false)}
              className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative glass-panel w-full max-w-md p-8 rounded-[32px] shadow-2xl"
            >
              <h3 className="text-2xl font-bold text-on-surface mb-6">New Activity</h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-1">Activity Name</label>
                  <input 
                    autoFocus
                    value={activity}
                    onChange={e => setActivity(e.target.value)}
                    className="w-full bg-surface-container-low p-4 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    placeholder="e.g., Biology Class, Study Math"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-1">Subject</label>
                    <select 
                      value={subject}
                      onChange={e => setSubject(e.target.value)}
                      className="w-full bg-surface-container-low p-4 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 appearance-none"
                    >
                      {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-1">Day</label>
                    <select 
                      value={formDay}
                      onChange={e => setFormDay(e.target.value)}
                      className="w-full bg-surface-container-low p-4 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 appearance-none"
                    >
                      {DAYS.map(d => <option key={d} value={d}>{d}</option>)}
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-1">Start Time</label>
                    <input 
                      type="time"
                      value={startTime}
                      onChange={e => setStartTime(e.target.value)}
                      className="w-full bg-surface-container-low p-4 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-on-surface-variant uppercase tracking-wider block mb-1">End Time</label>
                    <input 
                      type="time"
                      value={endTime}
                      onChange={e => setEndTime(e.target.value)}
                      className="w-full bg-surface-container-low p-4 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20"
                      required
                    />
                  </div>
                </div>
                <button 
                  type="submit"
                  className="w-full bg-primary text-white py-4 rounded-2xl font-bold mt-4 shadow-lg shadow-primary/20"
                >
                  Create Activity
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
