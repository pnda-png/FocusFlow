import React from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, LineChart, Line, AreaChart, Area 
} from 'recharts';
import type { Homework, Stats } from '../types';

interface InsightsViewProps {
  homeworks: Homework[];
  stats: Stats;
}

export default function InsightsView({ homeworks, stats }: InsightsViewProps) {
  // 1. Completion Rate over Priority
  const priorityData = ['Low', 'Medium', 'High'].map(priority => {
    const total = homeworks.filter(h => h.priority === priority).length;
    const completed = homeworks.filter(h => h.priority === priority && h.completed).length;
    return {
      name: priority,
      total,
      completed,
      rate: total === 0 ? 0 : Math.round((completed / total) * 100)
    };
  });

  // 2. Subject Distribution
  const subjectCounts: Record<string, number> = {};
  homeworks.forEach(h => {
    subjectCounts[h.subject] = (subjectCounts[h.subject] || 0) + 1;
  });
  const subjectData = Object.keys(subjectCounts).map(subject => ({
    name: subject,
    value: subjectCounts[subject]
  }));

  const COLORS = ['#2B5BB2', '#644FAD', '#79A3FF', '#B09AFE', '#A0A5AF'];
  
  const last10Days = Array.from({ length: 10 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().split('T')[0];
  }).reverse();

  // 3. Activity by Date (last 7 days of creation)
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().split('T')[0];
  }).reverse();

  const activityData = last7Days.map(date => {
    const created = homeworks.filter(h => new Date(h.createdAt).toISOString().split('T')[0] === date).length;
    return { name: date, tasks: created };
  });

  // 4. Progress Trend (Completion rate completion)
  const trendData = last10Days.map(date => {
    const tasks = homeworks.filter(h => new Date(h.createdAt).toISOString().split('T')[0] === date);
    const completed = tasks.filter(h => h.completed).length;
    const rate = tasks.length === 0 ? 0 : Math.round((completed / tasks.length) * 100);
    return { 
      name: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }), 
      rate 
    };
  });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 rounded-3xl">
          <h3 className="text-sm font-bold text-on-surface-variant uppercase tracking-widest mb-4">Focus Score</h3>
          <div className="flex items-center gap-4">
            <span className="text-5xl font-bold text-primary">{stats.percentage}%</span>
            <div className="flex-1 h-3 bg-surface-container rounded-full overflow-hidden">
              <div 
                className="h-full bg-primary rounded-full transition-all duration-1000" 
                style={{ width: `${stats.percentage}%` }}
              />
            </div>
          </div>
        </div>
        
        <div className="glass-panel p-6 rounded-3xl">
          <h3 className="text-sm font-bold text-on-surface-variant uppercase tracking-widest mb-4">Total Tasks</h3>
          <span className="text-5xl font-bold text-secondary">{stats.total}</span>
        </div>

        <div className="glass-panel p-6 rounded-3xl">
          <h3 className="text-sm font-bold text-on-surface-variant uppercase tracking-widest mb-4">Pending</h3>
          <span className="text-5xl font-bold text-on-surface-variant">{stats.pending}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Priority Performance */}
        <div className="glass-panel p-8 rounded-3xl">
          <h3 className="text-lg font-bold text-on-surface mb-6">Priority Completion Rate</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={priorityData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'currentColor', fontSize: 12, fontWeight: 600, opacity: 0.8 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'currentColor', fontSize: 12, opacity: 0.6 }} />
                <Tooltip 
                  cursor={{ fill: 'currentColor', fillOpacity: 0.05 }}
                  contentStyle={{ backgroundColor: 'var(--color-surface, #fff)', borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', color: 'var(--color-on-surface)' }}
                />
                <Bar dataKey="rate" fill="#2B5BB2" radius={[8, 8, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Subject Breakdown */}
        <div className="glass-panel p-8 rounded-3xl">
          <h3 className="text-lg font-bold text-on-surface mb-6">Subject Distribution</h3>
          <div className="h-[300px] w-full flex items-center">
            <div className="w-1/2 h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={subjectData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {subjectData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} className="stroke-surface dark:stroke-slate-900" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'var(--color-surface, #fff)', 
                      borderRadius: '16px', 
                      border: 'none', 
                      boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                      color: 'var(--color-on-surface)'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-1/2 space-y-3">
              {subjectData.map((item, index) => (
                <div key={item.name} className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <span className="text-xs font-bold text-on-surface-variant uppercase">{item.name}</span>
                  <span className="text-xs font-medium text-on-surface-variant ml-auto">{item.value} tasks</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Weekly Productivity Area Chart */}
        <div className="glass-panel p-8 rounded-3xl lg:col-span-2">
          <h3 className="text-lg font-bold text-on-surface mb-6">New Tasks Activity</h3>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={activityData}>
                <defs>
                  <linearGradient id="colorTasks" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#79A3FF" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#79A3FF" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'currentColor', fontSize: 10, opacity: 0.6 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: 'currentColor', fontSize: 10, opacity: 0.6 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--color-surface, #fff)', borderRadius: '16px', border: 'none', boxShadow: '0 10px 30px rgba(0,0,0,0.1)', color: 'var(--color-on-surface)' }}
                />
                <Area type="monotone" dataKey="tasks" stroke="#2B5BB2" fillOpacity={1} fill="url(#colorTasks)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Progress Trend Line Chart */}
        <div className="glass-panel p-8 rounded-3xl lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-on-surface">Overall Progress Trend</h3>
            <div className="px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-[10px] font-bold uppercase tracking-wider">
              Completion %
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'currentColor', fontSize: 10, fontWeight: 500, opacity: 0.6 }} 
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: 'currentColor', fontSize: 10, opacity: 0.6 }}
                  domain={[0, 100]}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'var(--color-surface, #fff)', 
                    borderRadius: '16px', 
                    border: 'none', 
                    boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                    color: 'var(--color-on-surface)'
                  }}
                  formatter={(value: number) => [`${value}%`, 'Completion Rate']}
                />
                <Line 
                  type="monotone" 
                  dataKey="rate" 
                  stroke="#644FAD" 
                  strokeWidth={4} 
                  dot={{ fill: '#644FAD', strokeWidth: 2, r: 4, stroke: '#fff' }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                  animationDuration={1500}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
