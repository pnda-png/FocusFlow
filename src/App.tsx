/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Filter, Search, Plus, LayoutGrid, X, User, Shield, Moon, Sun, Camera } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import Navbar, { AppView } from './components/Navbar';
import StatsPanel from './components/StatsPanel';
import AddTaskForm from './components/AddTaskForm';
import HomeworkCard from './components/HomeworkCard';
import CalendarPanel from './components/CalendarPanel';
import InsightsView from './components/InsightsView';
import ScheduleView from './components/ScheduleView';
import type { Homework, Priority, Stats, ScheduleItem, CalendarEvent, UserProfile } from './types';

const STORAGE_KEY = 'focusflow_homework';
const SCHEDULE_KEY = 'focusflow_schedule';
const EVENTS_KEY = 'focusflow_events';
const USER_KEY = 'focusflow_user';

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>('Dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [settingsTab, setSettingsTab] = useState<'Account' | 'Privacy'>('Account');
  
  const [user, setUser] = useState<UserProfile>(() => {
    const defaultUser: UserProfile = {
      name: 'Alex Johnston',
      year: 'Class of 2026',
      school: 'Northwood High School',
      theme: 'light',
      privacy: {
        marketingEmails: false,
        dataAnalytics: true,
        publicProfile: false
      }
    };

    const saved = localStorage.getItem(USER_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          ...defaultUser,
          ...parsed,
          privacy: {
            ...defaultUser.privacy,
            ...(parsed.privacy || {})
          }
        };
      } catch (e) {
        // Fallback to default if parse fails
      }
    }
    return defaultUser;
  });

  // Handle Theme
  useEffect(() => {
    if (user.theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [user.theme]);

  const [homeworks, setHomeworks] = useState<Homework[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  const [schedule, setSchedule] = useState<ScheduleItem[]>(() => {
    const saved = localStorage.getItem(SCHEDULE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  const [events, setEvents] = useState<CalendarEvent[]>(() => {
    const saved = localStorage.getItem(EVENTS_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  const [filter, setFilter] = useState<'All' | 'Pending' | 'Completed'>('All');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(homeworks));
  }, [homeworks]);

  useEffect(() => {
    localStorage.setItem(SCHEDULE_KEY, JSON.stringify(schedule));
  }, [schedule]);

  useEffect(() => {
    localStorage.setItem(EVENTS_KEY, JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  }, [user]);

  const stats = useMemo<Stats>(() => {
    const total = homeworks.length;
    const completed = homeworks.filter(h => h.completed).length;
    const pending = total - completed;
    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
    return { total, completed, pending, percentage };
  }, [homeworks]);

  const filteredHomeworks = useMemo(() => {
    let result = [...homeworks];
    
    // Apply View Filter
    if (filter === 'Pending') result = result.filter(h => !h.completed);
    if (filter === 'Completed') result = result.filter(h => h.completed);
    
    // Apply Search Filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(h => 
        h.name.toLowerCase().includes(q) || 
        h.subject.toLowerCase().includes(q)
      );
    }
    
    const priorityMap: Record<Priority, number> = { High: 0, Medium: 1, Low: 2 };
    return result.sort((a, b) => {
      if (a.completed !== b.completed) return a.completed ? 1 : -1;
      if (priorityMap[a.priority] !== priorityMap[b.priority]) {
        return priorityMap[a.priority] - priorityMap[b.priority];
      }
      return new Date(a.deadline).getTime() - new Date(b.deadline).getTime();
    });
  }, [homeworks, filter, searchQuery]);

  const handleAddHomework = (data: { name: string; subject: string; deadline: string; priority: Priority }) => {
    const newHomework: Homework = {
      id: Math.random().toString(36).substr(2, 9),
      ...data,
      completed: false,
      createdAt: Date.now(),
    };
    setHomeworks([newHomework, ...homeworks]);
  };

  const handleToggleHomework = (id: string) => {
    setHomeworks(homeworks.map(h => 
      h.id === id ? { ...h, completed: !h.completed } : h
    ));
  };

  const handleDeleteHomework = (id: string) => {
    setHomeworks(homeworks.filter(h => h.id !== id));
  };

  const handleAddSchedule = (item: Omit<ScheduleItem, 'id'>) => {
    const newItem: ScheduleItem = {
      id: Math.random().toString(36).substr(2, 9),
      ...item
    };
    setSchedule([...schedule, newItem]);
  };

  const handleDeleteSchedule = (id: string) => {
    setSchedule(schedule.filter(s => s.id !== id));
  };

  const handleAddEvent = (event: Omit<CalendarEvent, 'id'>) => {
    const newEvent: CalendarEvent = {
      id: Math.random().toString(36).substr(2, 9),
      ...event
    };
    setEvents([...events, newEvent]);
  };

  const handleDeleteEvent = (id: string) => {
    setEvents(events.filter(e => e.id !== id));
  };

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUser({ ...user, avatar: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const openSettings = (tab: 'Account' | 'Privacy' = 'Account') => {
    setSettingsTab(tab);
    setIsSettingsOpen(true);
  };

  const toggleTheme = () => {
    setUser({ ...user, theme: user.theme === 'light' ? 'dark' : 'light' });
  };

  const scrollToAddTask = () => {
    if (currentView !== 'Dashboard') {
      setCurrentView('Dashboard');
    }
    setTimeout(() => {
      const element = document.getElementById('add-task-form');
      element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      element?.classList.add('ring-2', 'ring-primary', 'ring-offset-2');
      setTimeout(() => element?.classList.remove('ring-2', 'ring-primary', 'ring-offset-2'), 2000);
    }, 100);
  };

  return (
    <div className="min-h-screen bg-surface transition-colors duration-300">
      <Navbar 
        currentView={currentView} 
        onViewChange={setCurrentView} 
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        homeworks={homeworks}
        user={user}
        onSettingsOpen={openSettings}
        toggleTheme={toggleTheme}
      />
      
      <main className="pt-24 pb-32 px-6 md:px-16 max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          {currentView === 'Dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8"
            >
              <div className="lg:col-span-4 space-y-8">
                <StatsPanel stats={stats} />
                <AddTaskForm onAdd={handleAddHomework} />
              </div>

              <div className="lg:col-span-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-on-surface">Active Assignments</h2>
                  <div className="flex gap-2">
                    <div className="flex bg-surface-container-high p-1 rounded-xl">
                      {(['All', 'Pending', 'Completed'] as const).map((f) => (
                        <button
                          key={f}
                          onClick={() => setFilter(f)}
                          className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all ${
                            filter === f 
                              ? 'bg-white dark:bg-primary text-primary dark:text-white shadow-sm' 
                              : 'text-on-surface-variant/60 hover:text-on-surface-variant dark:hover:text-white'
                          }`}
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                    <button className="p-2 rounded-xl bg-surface-container-high text-on-surface-variant hover:bg-primary-container hover:text-on-primary-container transition-colors">
                      <Filter size={18} />
                    </button>
                  </div>
                </div>

                <AnimatePresence mode="popLayout">
                  {filteredHomeworks.length === 0 ? (
                    <motion.div
                      key="empty"
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="glass-panel p-16 rounded-[40px] flex flex-col items-center justify-center text-center space-y-6"
                    >
                      <div className="w-48 h-48 bg-primary/5 rounded-full flex items-center justify-center text-primary/20">
                        <LayoutGrid size={80} />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-on-surface mb-2">No tasks found!</h3>
                        <p className="text-on-surface-variant max-w-xs mx-auto">
                          {filter === 'All' 
                            ? "Your schedule is clear. Take a deep breath and enjoy your focus time."
                            : `You don't have any ${filter.toLowerCase()} tasks yet.`}
                        </p>
                      </div>
                      {filter !== 'All' && (
                        <button 
                          onClick={() => setFilter('All')} 
                          className="bg-primary text-white px-6 py-3 rounded-xl font-bold"
                        >
                          Show All Tasks
                        </button>
                      )}
                    </motion.div>
                  ) : (
                    <div className="space-y-4">
                      <AnimatePresence mode="popLayout">
                        {filteredHomeworks.map((hw: Homework) => (
                          <HomeworkCard
                            key={hw.id}
                            homework={hw}
                            onToggle={handleToggleHomework}
                            onDelete={handleDeleteHomework}
                          />
                        ))}
                      </AnimatePresence>
                    </div>
                  )}
                </AnimatePresence>

                <CalendarPanel 
                  homeworks={homeworks} 
                  events={events}
                  onAddEvent={handleAddEvent}
                  onDeleteEvent={handleDeleteEvent}
                />
              </div>
            </motion.div>
          )}

          {currentView === 'Schedule' && (
            <motion.div
              key="schedule"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <ScheduleView 
                schedule={schedule} 
                onAdd={handleAddSchedule} 
                onDelete={handleDeleteSchedule} 
              />
            </motion.div>
          )}

          {currentView === 'Insights' && (
            <motion.div
              key="insights"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <InsightsView homeworks={homeworks} stats={stats} />
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Floating Action Button for Mobile */}
      <button 
        onClick={scrollToAddTask}
        className="lg:hidden fixed bottom-28 right-6 w-14 h-14 bg-primary text-white rounded-2xl shadow-xl shadow-primary/20 flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-40"
      >
        <Plus size={32} />
      </button>

      {/* Settings Modal */}
      <AnimatePresence>
        {isSettingsOpen && (
          <div className="fixed inset-0 z-[101] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSettingsOpen(false)}
              className="absolute inset-0 bg-on-surface/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative glass-panel w-full max-w-lg overflow-hidden flex flex-col max-h-[85vh] rounded-[40px] shadow-2xl"
            >
              <div className="p-8 border-b border-on-surface/5 flex justify-between items-center bg-surface-container-low/50">
                <div>
                  <h3 className="text-2xl font-bold text-on-surface">Configuration</h3>
                  <p className="text-xs font-bold text-on-surface-variant uppercase tracking-widest mt-1">Manage your experience</p>
                </div>
                <button onClick={() => setIsSettingsOpen(false)} className="p-2 hover:bg-on-surface/10 rounded-full transition-colors">
                  <X size={24} />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex px-8 pt-4 gap-6 border-b border-on-surface/5 bg-surface-container-low/50">
                <button 
                  onClick={() => setSettingsTab('Account')}
                  className={`pb-4 text-sm font-bold transition-all relative ${
                    settingsTab === 'Account' ? 'text-primary' : 'text-on-surface-variant/40 hover:text-on-surface-variant'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <User size={16} />
                    Account
                  </div>
                  {settingsTab === 'Account' && (
                    <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-full" />
                  )}
                </button>
                <button 
                  onClick={() => setSettingsTab('Privacy')}
                  className={`pb-4 text-sm font-bold transition-all relative ${
                    settingsTab === 'Privacy' ? 'text-primary' : 'text-on-surface-variant/40 hover:text-on-surface-variant'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <Shield size={16} />
                    Privacy & Security
                  </div>
                  {settingsTab === 'Privacy' && (
                    <motion.div layoutId="tab-underline" className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-full" />
                  )}
                </button>
              </div>

              <div className="p-8 overflow-y-auto no-scrollbar flex-1 bg-surface-container-low/30 backdrop-blur-md">
                <AnimatePresence mode="wait">
                  {settingsTab === 'Account' ? (
                    <motion.div
                      key="account"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      className="space-y-6"
                    >
                      {/* Avatar Upload */}
                      <div className="flex flex-col items-center mb-8">
                        <div className="relative group">
                          <div className="w-24 h-24 rounded-[32px] overflow-hidden border-4 border-primary/20 bg-primary/5 flex items-center justify-center">
                            {user.avatar ? (
                              <img src={user.avatar} alt="Profile" className="w-full h-full object-cover" />
                            ) : (
                              <User size={40} className="text-primary/40" />
                            )}
                          </div>
                          <label className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-[32px] cursor-pointer">
                            <Camera size={24} className="text-white" />
                            <input type="file" accept="image/*" className="hidden" onChange={handleAvatarUpload} />
                          </label>
                        </div>
                        <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mt-4">Change Profile Picture</p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="col-span-full">
                          <label className="text-xs font-black text-on-surface-variant/40 uppercase tracking-wider block mb-2 px-1">Display Name</label>
                          <input 
                            value={user.name}
                            onChange={e => setUser({ ...user, name: e.target.value })}
                            className="w-full bg-on-surface/5 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all text-on-surface font-bold"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-black text-on-surface-variant/40 uppercase tracking-wider block mb-2 px-1">Class / Bio</label>
                          <input 
                            value={user.year}
                            onChange={e => setUser({ ...user, year: e.target.value })}
                            className="w-full bg-on-surface/5 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all text-on-surface font-bold"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-black text-on-surface-variant/40 uppercase tracking-wider block mb-2 px-1">School</label>
                          <input 
                            value={user.school}
                            onChange={e => setUser({ ...user, school: e.target.value })}
                            className="w-full bg-on-surface/5 p-4 rounded-2xl outline-none focus:ring-2 focus:ring-primary/20 transition-all text-on-surface font-bold"
                          />
                        </div>
                      </div>

                      <div className="pt-4">
                        <label className="text-xs font-black text-on-surface-variant/40 uppercase tracking-wider block mb-4 px-1">Appearance</label>
                        <button 
                          onClick={toggleTheme}
                          className="w-full flex items-center justify-between p-4 rounded-2xl bg-on-surface/5 hover:bg-on-surface/10 transition-all group"
                        >
                          <div className="flex items-center gap-4">
                            <div className={`p-3 rounded-xl transition-all ${user.theme === 'light' ? 'bg-indigo-500/10 text-indigo-600' : 'bg-amber-500/10 text-amber-400'} group-hover:scale-110`}>
                              {user.theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                            </div>
                            <div className="text-left">
                              <p className="text-sm font-bold text-on-surface">{user.theme === 'light' ? 'Light' : 'Dark'} Mode</p>
                              <p className="text-[10px] font-medium text-on-surface-variant/60">Toggle interface appearance</p>
                            </div>
                          </div>
                          <div className={`w-12 h-6 rounded-full relative transition-colors ${user.theme === 'dark' ? 'bg-primary' : 'bg-on-surface/20'}`}>
                            <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${user.theme === 'dark' ? 'left-7' : 'left-1'}`} />
                          </div>
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="privacy"
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -10 }}
                      className="space-y-6"
                    >
                      <div className="space-y-4">
                        <h4 className="text-xs font-black text-on-surface-variant/40 uppercase tracking-wider px-1">Data Usage</h4>
                        {[
                          { id: 'dataAnalytics', label: 'Usage Analytics', desc: 'Allow anonymous usage reports to help us improve the app.' },
                          { id: 'marketingEmails', label: 'Product Updates', desc: 'Receive emails about new features and study tips.' },
                          { id: 'publicProfile', label: 'Public Profile', desc: 'Make your profile visible to other focus members.' }
                        ].map(item => (
                          <div key={item.id} className="flex items-center justify-between p-4 rounded-2xl bg-on-surface/5">
                            <div className="max-w-[70%]">
                              <p className="text-sm font-bold text-on-surface">{item.label}</p>
                              <p className="text-[10px] font-medium text-on-surface-variant/60 leading-relaxed mt-1">{item.desc}</p>
                            </div>
                            <button 
                              onClick={() => {
                                const privacy = user.privacy || { marketingEmails: false, dataAnalytics: true, publicProfile: false };
                                setUser({ 
                                  ...user, 
                                  privacy: { 
                                    ...privacy, 
                                    [item.id]: !((privacy as any)[item.id])
                                  } 
                                });
                              }}
                              className={`w-12 h-6 rounded-full relative transition-colors shrink-0 ${
                                (user.privacy || {})[item.id as keyof typeof user.privacy] ? 'bg-primary' : 'bg-on-surface/20'
                              }`}
                            >
                              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${
                                (user.privacy || {})[item.id as keyof typeof user.privacy] ? 'left-7' : 'left-1'
                              }`} />
                            </button>
                          </div>
                        ))}
                      </div>

                      <div className="pt-6 space-y-4">
                        <h4 className="text-xs font-black text-on-surface-variant/40 uppercase tracking-wider px-1">Security Action</h4>
                        <button 
                          onClick={() => {
                            if(confirm("Generate a summary of all your data for review?")) {
                              const data = { homeworks, events, schedule, user };
                              const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
                              const url = URL.createObjectURL(blob);
                              const a = document.createElement('a');
                              a.href = url;
                              a.download = 'focusflow-data-audit.json';
                              a.click();
                            }
                          }}
                          className="w-full text-left p-4 rounded-2xl bg-blue-500/5 hover:bg-blue-500/10 border border-blue-500/10 transition-all"
                        >
                          <p className="text-sm font-bold text-blue-500">Request Data Audit</p>
                          <p className="text-[10px] font-medium text-blue-500/60 mt-0.5">Download a copy of all information stored locally.</p>
                        </button>
                        
                        <button 
                          onClick={() => {
                            if(confirm("Are you absolutely sure? This will wipe ALL your data irrecoverably.")) {
                              localStorage.clear();
                              window.location.reload();
                            }
                          }}
                          className="w-full text-left p-4 rounded-2xl bg-red-500/5 hover:bg-red-500/10 border border-red-500/10 transition-all group"
                        >
                          <p className="text-sm font-bold text-red-500 group-hover:scale-[1.01] transition-transform">Delete Account & Data</p>
                          <p className="text-[10px] font-medium text-red-500/60 mt-0.5">Permanently clear local storage and reset all settings.</p>
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="p-8 border-t border-on-surface/5 bg-surface-container-low/80">
                <button 
                  onClick={() => setIsSettingsOpen(false)}
                  className="w-full bg-primary text-white py-5 rounded-[24px] font-black uppercase tracking-[0.15em] text-xs shadow-xl shadow-primary/30 hover:scale-[1.02] active:scale-95 transition-all"
                >
                  Confirm Changes
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

