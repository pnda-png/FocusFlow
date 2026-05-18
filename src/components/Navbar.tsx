import React, { useState, useEffect, useRef } from 'react';
import { Bell, Search, LayoutGrid, CheckSquare, BookOpen, User, LineChart, Calendar, X, LogOut, Settings, Shield, Moon, Sun } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import type { Homework, UserProfile } from '../types';

export type AppView = 'Dashboard' | 'Schedule' | 'Insights';

interface NavbarProps {
  currentView: AppView;
  onViewChange: (view: AppView) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  homeworks: Homework[];
  user: UserProfile;
  onSettingsOpen: (tab?: 'Account' | 'Privacy') => void;
  toggleTheme: () => void;
}

export default function Navbar({ 
  currentView, 
  onViewChange, 
  searchQuery, 
  setSearchQuery, 
  homeworks, 
  user, 
  onSettingsOpen,
  toggleTheme
}: NavbarProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const defaultAvatar = "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=150&h=150";

  // Close search on escape
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsSearchOpen(false);
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, []);

  const notifications = homeworks.filter(h => {
    if (h.completed) return false;
    const today = new Date().toISOString().split('T')[0];
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const tomorrowStr = tomorrow.toISOString().split('T')[0];
    return h.deadline === today || h.deadline === tomorrowStr;
  });

  return (
    <>
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 md:px-16 py-4 bg-white/80 dark:bg-surface/80 backdrop-blur-xl border-b border-white/20 dark:border-white/5 shadow-sm transition-colors duration-300">
        <div 
          className="text-2xl font-bold font-display text-primary tracking-tight cursor-pointer flex-shrink-0"
          onClick={() => onViewChange('Dashboard')}
        >
          FocusFlow
        </div>
        
        <nav className="hidden md:flex gap-8 items-center">
          {(['Dashboard', 'Schedule', 'Insights'] as AppView[]).map((view) => (
            <button 
              key={view}
              onClick={() => onViewChange(view)}
              className={`text-sm font-bold transition-all ${
                currentView === view ? 'text-primary border-b-2 border-primary pb-1' : 'text-on-surface-variant hover:text-primary dark:text-on-surface dark:hover:text-primary'
              }`}
            >
              {view}
            </button>
          ))}
        </nav>
        
        <div className="flex items-center gap-2 md:gap-4">
          <button 
            onClick={toggleTheme}
            className="p-2.5 rounded-xl border border-primary/10 text-on-surface-variant hover:text-primary hover:bg-primary/5 transition-all dark:text-white dark:border-white/10 dark:hover:bg-white/5 relative overflow-hidden"
            title="Toggle theme"
          >
            <AnimatePresence mode="wait">
              {user.theme === 'light' ? (
                <motion.div
                  key="moon"
                  initial={{ y: 20, opacity: 0, rotate: 45 }}
                  animate={{ y: 0, opacity: 1, rotate: 0 }}
                  exit={{ y: -20, opacity: 0, rotate: -45 }}
                  transition={{ duration: 0.2 }}
                  className="text-indigo-600"
                >
                  <Moon size={20} />
                </motion.div>
              ) : (
                <motion.div
                  key="sun"
                  initial={{ y: 20, opacity: 0, rotate: 45 }}
                  animate={{ y: 0, opacity: 1, rotate: 0 }}
                  exit={{ y: -20, opacity: 0, rotate: -45 }}
                  transition={{ duration: 0.2 }}
                  className="text-amber-400"
                >
                  <Sun size={20} />
                </motion.div>
              )}
            </AnimatePresence>
          </button>

          {/* Search Toggle/Input */}
          <div className="relative flex items-center" ref={searchRef}>
            <AnimatePresence>
              {isSearchOpen && (
                <motion.input
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 200, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  type="text"
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-surface-container-low dark:bg-surface-container px-4 py-2 rounded-xl text-sm outline-none border border-primary/10 focus:border-primary/30 mr-2 text-on-surface"
                  autoFocus
                />
              )}
            </AnimatePresence>
            <button 
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className={`p-2 rounded-xl transition-all ${isSearchOpen ? 'text-primary bg-primary/5' : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-low dark:text-on-surface dark:hover:bg-surface-container'}`}
            >
              {isSearchOpen ? <X size={20} /> : <Search size={20} />}
            </button>
          </div>

          {/* Notifications */}
          <div className="relative">
            <button 
              onClick={() => {
                setIsNotificationsOpen(!isNotificationsOpen);
                setIsProfileOpen(false);
              }}
              className={`p-2 rounded-xl relative transition-all ${isNotificationsOpen ? 'text-primary bg-primary/5' : 'text-on-surface-variant hover:text-primary hover:bg-surface-container-low dark:text-on-surface dark:hover:bg-surface-container'}`}
            >
              <Bell size={20} />
              {notifications.length > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900" />
              )}
            </button>

            <AnimatePresence>
              {isNotificationsOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  className="absolute right-0 mt-2 w-80 glass-panel bg-white/95 dark:bg-surface/95 rounded-2xl shadow-2xl p-4 overflow-hidden"
                >
                  <h4 className="text-sm font-bold text-on-surface mb-4 px-2">Recent Updates</h4>
                  <div className="space-y-2 max-h-60 overflow-y-auto no-scrollbar">
                    {notifications.length === 0 ? (
                      <p className="text-xs text-on-surface-variant text-center py-6">No urgent deadlines. Keep it up!</p>
                    ) : (
                      notifications.map(n => (
                        <button 
                          key={n.id} 
                          onClick={() => {
                            onViewChange('Dashboard');
                            setIsNotificationsOpen(false);
                            // Simple scroll to task
                            setTimeout(() => {
                              const element = document.getElementById(`task-${n.id}`);
                              element?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                              element?.classList.add('ring-2', 'ring-primary', 'ring-offset-2');
                              setTimeout(() => element?.classList.remove('ring-2', 'ring-primary', 'ring-offset-2'), 2000);
                            }, 100);
                          }}
                          className="w-full text-left p-3 bg-surface-container-low dark:bg-surface-container-high/50 rounded-xl flex gap-3 items-start border border-transparent hover:border-primary/10 transition-all"
                        >
                          <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${n.priority === 'High' ? 'bg-red-500' : 'bg-orange-500'}`} />
                          <div>
                            <p className="text-xs font-bold text-on-surface leading-tight text-left">{n.name}</p>
                            <p className="text-[10px] text-on-surface-variant mt-0.5">Due {n.deadline === new Date().toISOString().split('T')[0] ? 'Today' : 'Tomorrow'}</p>
                          </div>
                        </button>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Profile Popover */}
          <div className="relative">
            <button 
              onClick={() => {
                setIsProfileOpen(!isProfileOpen);
                setIsNotificationsOpen(false);
              }}
              className="w-10 h-10 rounded-xl overflow-hidden border-2 border-primary/20 p-0.5 hover:scale-105 active:scale-95 transition-all shadow-sm"
            >
              <img 
                src={user.avatar || defaultAvatar} 
                alt="Avatar" 
                className="w-full h-full object-cover rounded-lg"
              />
            </button>

            <AnimatePresence>
              {isProfileOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  className="absolute right-0 mt-2 w-64 glass-panel bg-white/95 dark:bg-surface/95 rounded-[32px] shadow-2xl overflow-hidden"
                >
                  <div className="p-6 text-center border-b border-surface-variant/10">
                    <div className="w-16 h-16 rounded-[20px] border-4 border-primary/10 mx-auto p-1 mb-3">
                      <img 
                        src={user.avatar || defaultAvatar} 
                        alt="Avatar" 
                        className="w-full h-full object-cover rounded-[14px]"
                      />
                    </div>
                    <h4 className="font-bold text-on-surface">{user.name}</h4>
                    <p className="text-xs text-on-surface-variant">{user.year}</p>
                  </div>
                  <div className="p-2 space-y-1">
                    <button 
                      onClick={() => {
                        onSettingsOpen('Account');
                        setIsProfileOpen(false);
                      }}
                      className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-surface-container-low dark:hover:bg-surface-container transition-all text-sm font-medium text-on-surface-variant"
                    >
                      <Settings size={18} />
                      Account Settings
                    </button>
                    <button 
                      onClick={() => {
                        onSettingsOpen('Privacy');
                        setIsProfileOpen(false);
                      }}
                      className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-surface-container-low dark:hover:bg-surface-container transition-all text-sm font-medium text-on-surface-variant"
                    >
                      <Shield size={18} />
                      Privacy & Security
                    </button>
                    <button 
                      onClick={() => {
                        if(confirm("Sign out and reset all your data?")) {
                          localStorage.clear();
                          window.location.reload();
                        }
                      }}
                      className="w-full flex items-center gap-3 p-3 rounded-2xl hover:bg-red-50 dark:hover:bg-red-500/5 text-red-500 transition-all text-sm font-bold"
                    >
                      <LogOut size={18} />
                      Sign Out
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </header>

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-6 left-6 right-6 z-50 flex justify-around items-center px-4 py-3 bg-white/90 dark:bg-surface/90 backdrop-blur-2xl border border-surface-variant/10 dark:border-white/5 shadow-2xl rounded-[32px] transition-colors duration-300">
        <button 
          onClick={() => onViewChange('Dashboard')}
          className={`flex flex-col items-center gap-1 transition-all ${currentView === 'Dashboard' ? 'text-primary' : 'text-on-surface-variant/40'}`}
        >
          <div className={`p-2 rounded-xl ${currentView === 'Dashboard' ? 'bg-primary/10' : ''}`}>
            <LayoutGrid size={22} />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-center mt-1">Home</span>
        </button>
        
        <button 
          onClick={() => onViewChange('Schedule')}
          className={`flex flex-col items-center gap-1 transition-all ${currentView === 'Schedule' ? 'text-primary' : 'text-on-surface-variant/40'}`}
        >
          <div className={`p-2 rounded-xl ${currentView === 'Schedule' ? 'bg-primary/10' : ''}`}>
            <Calendar size={22} />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-center mt-1">Schedule</span>
        </button>

        <button 
          onClick={() => onViewChange('Insights')}
          className={`flex flex-col items-center gap-1 transition-all ${currentView === 'Insights' ? 'text-primary' : 'text-on-surface-variant/40'}`}
        >
          <div className={`p-2 rounded-xl ${currentView === 'Insights' ? 'bg-primary/10' : ''}`}>
            <LineChart size={22} />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-center mt-1">Insights</span>
        </button>

        <button 
          onClick={() => setIsProfileOpen(true)}
          className={`flex flex-col items-center gap-1 transition-all ${isProfileOpen ? 'text-primary' : 'text-on-surface-variant/40'}`}
        >
          <div className={`p-2 rounded-xl ${isProfileOpen ? 'bg-primary/10' : ''}`}>
            <User size={22} />
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest text-center mt-1">Profile</span>
        </button>
      </nav>
    </>
  );
}
