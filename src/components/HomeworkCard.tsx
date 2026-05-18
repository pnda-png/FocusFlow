import React from 'react';
import { Trash2, Calendar, CheckCircle2 } from 'lucide-react';
import { motion } from 'motion/react';
import type { Homework } from '../types';

interface HomeworkCardProps {
  homework: Homework;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  key?: string;
}

export default function HomeworkCard({ homework, onToggle, onDelete }: HomeworkCardProps): React.JSX.Element {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-500';
      case 'Medium': return 'bg-orange-500';
      case 'Low': return 'bg-green-500';
      default: return 'bg-slate-400';
    }
  };

  const getPriorityText = (priority: string) => {
    switch (priority) {
      case 'High': return 'text-red-500';
      case 'Medium': return 'text-orange-500';
      case 'Low': return 'text-green-500';
      default: return 'text-slate-400';
    }
  };

  const isToday = (dateStr: string) => {
    const today = new Date().toISOString().split('T')[0];
    return dateStr === today;
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: homework.completed ? 0.7 : 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ scale: 1.01 }}
      id={`task-${homework.id}`}
      className={`glass-panel p-5 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 group transition-all duration-300 ${
        homework.completed ? 'grayscale-[0.5] opacity-60' : ''
      }`}
    >
      <div className="flex items-start gap-4">
        <button
          onClick={() => onToggle(homework.id)}
          className={`mt-1 flex-shrink-0 w-6 h-6 rounded-md border-2 transition-colors flex items-center justify-center ${
            homework.completed 
              ? 'bg-primary border-primary text-white' 
              : 'border-primary/20 text-transparent hover:border-primary hover:text-primary/50'
          }`}
        >
          <CheckCircle2 size={16} />
        </button>
        
        <div>
          <h4 className={`text-lg font-semibold text-on-surface mb-1 transition-all ${
            homework.completed ? 'line-through text-on-surface-variant' : ''
          }`}>
            {homework.name}
          </h4>
          <div className="flex flex-wrap gap-2 items-center">
            <span className={`px-3 py-1 rounded-full text-xs font-bold leading-none ${
              homework.subject === 'Biology' ? 'bg-secondary-container/50 text-secondary' :
              homework.subject === 'Mathematics' ? 'bg-primary-container/50 text-primary' :
              'bg-tertiary-container/30 text-on-surface-variant'
            }`}>
              {homework.subject}
            </span>
            <span className="flex items-center gap-1.5 text-sm font-medium text-on-surface-variant">
              <Calendar size={14} />
              {isToday(homework.deadline) ? 'Due Today' : `Due ${homework.deadline}`}
            </span>
            {homework.completed && (
              <span className="flex items-center gap-1 text-xs font-bold text-green-500 bg-green-500/10 px-2 py-0.5 rounded-full">
                COMPLETED
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between md:justify-end gap-6">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${getPriorityColor(homework.priority)}`} />
          <span className={`text-[10px] font-bold uppercase tracking-wider ${getPriorityText(homework.priority)}`}>
            {homework.priority} Priority
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <button
            onClick={() => onToggle(homework.id)}
            className={`px-4 py-2 font-bold rounded-lg transition-all ${
              homework.completed 
                ? 'bg-green-500/10 text-green-500 hover:bg-green-500/20' 
                : 'bg-primary-container/20 text-primary hover:bg-primary-container'
            }`}
          >
            {homework.completed ? 'Done' : 'Mark Done'}
          </button>
          <button
            onClick={() => onDelete(homework.id)}
            className="p-2 text-on-surface-variant hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
          >
            <Trash2 size={20} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
