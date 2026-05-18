import React from 'react';
import type { Stats } from '../types';

interface StatsPanelProps {
  stats: Stats;
}

export default function StatsPanel({ stats }: StatsPanelProps) {
  return (
    <section className="glass-panel p-6 rounded-xl">
      <div className="flex justify-between items-end mb-3">
        <div>
          <h2 className="text-xl font-bold text-primary mb-1">Weekly Focus</h2>
          <p className="text-sm text-on-surface-variant">
            {stats.total === 0 
              ? "Start by adding a task!" 
              : `You've completed ${stats.percentage}% of your tasks!`}
          </p>
        </div>
        <span className="text-2xl font-bold text-primary">{stats.percentage}%</span>
      </div>
      
      <div className="w-full bg-surface-container rounded-full h-3 mb-6 overflow-hidden">
        <div 
          className="bg-primary h-full rounded-full transition-all duration-1000 ease-out"
          style={{ width: `${stats.percentage}%` }}
        />
      </div>

      <div className="flex gap-2">
        <div className="flex-1 p-4 bg-primary/10 dark:bg-primary/20 rounded-xl text-center">
          <p className="text-[10px] font-bold text-primary uppercase tracking-widest mb-1">COMPLETED</p>
          <p className="text-2xl font-bold text-primary">{stats.completed}</p>
        </div>
        <div className="flex-1 p-4 bg-secondary/10 dark:bg-secondary/20 rounded-xl text-center">
          <p className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-1">PENDING</p>
          <p className="text-2xl font-bold text-secondary">{stats.pending}</p>
        </div>
      </div>
    </section>
  );
}
