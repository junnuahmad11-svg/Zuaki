
import React, { useState, useEffect } from 'react';
import { 
  Home, MessageSquare, Bot, Calendar, ClipboardList, PenTool, Users, 
  Target, FileText, Brain, Trophy, BarChart2, Calculator, 
  TrendingUp, Bell, Settings, LogOut, Search, X, ChevronRight, Menu,
  Info, Mail, MessageSquarePlus, Award, ClipboardCheck, Swords, Youtube, Music, BookOpen, Library, Beaker, StickyNote, Zap, Clock, List, Presentation
} from 'lucide-react';
import { ViewState, UserProfile } from '../types';
import { timerService } from '../services/timerService';

interface SidebarMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onChangeView: (view: ViewState) => void;
  userProfile?: Partial<UserProfile>;
}

export const SidebarMenu: React.FC<SidebarMenuProps> = ({ isOpen, onClose, onChangeView, userProfile }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isTimerLive, setIsTimerLive] = useState(false);

  useEffect(() => {
      const unsub = timerService.subscribe((state) => {
          setIsTimerLive(state.status === 'RUNNING');
      });
      return () => { unsub(); };
  }, []);

  const menuGroups = [
    {
      title: "Primary Navigation",
      items: [
        { id: ViewState.DASHBOARD, icon: Home, label: 'Home' },
        { id: ViewState.IDEATHON_DOSSIER, icon: Presentation, label: 'Ideathon Pitch & PDF' },
        { id: ViewState.CHAT, icon: MessageSquare, label: 'Chats' },
        { id: ViewState.AI_ASSISTANT, icon: Bot, label: 'GenZ AI Assistant' },
        { id: ViewState.PLANNER, icon: Calendar, label: 'Planner & Schedule' },
        { id: ViewState.STUDY_HUB, icon: Users, label: 'Study Hub' },
        { id: ViewState.ZUKAI_TUBE, icon: Youtube, label: 'ZukaiTube' },
      ]
    },
    {
      title: "Study Content",
      items: [
        { id: ViewState.JEE_SYLLABUS, icon: List, label: 'JEE Syllabus' }, 
        { id: ViewState.SHORT_NOTES, icon: FileText, label: 'Short Notes' },
        { id: ViewState.STRENGTH_NOTES, icon: StickyNote, label: 'Ink Pad' },
        { id: ViewState.FORMULA_FLASHCARDS, icon: Zap, label: 'Formula Flashcards' },
        { id: ViewState.FORMULA_VAULT, icon: Library, label: 'Formula Vault' },
        { id: ViewState.PYQ_PAPERS, icon: BookOpen, label: 'PYQ Papers' },
        { id: ViewState.WHITEBOARD, icon: PenTool, label: 'Whiteboard' },
      ]
    },
    {
      title: "Practice & Testing",
      items: [
        { id: ViewState.TEST_LAB_HOME, icon: Beaker, label: 'Zuaki Test Lab' },
        { id: ViewState.QUIZ_ARENA, icon: Swords, label: 'Quiz Arena' },
        { id: ViewState.MAKE_TEST, icon: ClipboardCheck, label: 'Custom Test' },
        { id: ViewState.DAILY_FOCUS, icon: Target, label: 'Daily Focus Mode' },
      ]
    },
    {
      title: "Performance & Growth",
      items: [
        { id: ViewState.ANALYSIS, icon: BarChart2, label: 'Analysis' },
        { id: ViewState.RANK_PREDICTOR, icon: TrendingUp, label: 'Rank Predictor' },
        { id: ViewState.LEADERBOARD, icon: Trophy, label: 'Leaderboard' },
        { id: ViewState.ACHIEVEMENTS, icon: Award, label: 'Achievements' },
      ]
    },
    {
      title: "Utilities",
      items: [
        { id: ViewState.CALCULATOR, icon: Calculator, label: 'Calculator' },
        { id: ViewState.NOTIFICATIONS, icon: Bell, label: 'Notifications' },
        { id: ViewState.TASKS, icon: ClipboardList, label: 'To-Do List' },
      ]
    },
    {
      title: "Extra Zones",
      items: [
        { id: ViewState.MOTIVATION, icon: Music, label: 'Motivational Zone' },
        { id: ViewState.NEO_TIMER, icon: Clock, label: 'Zuaki Quantum' },
      ]
    },
    {
      title: "System",
      items: [
        { id: ViewState.SETTINGS, icon: Settings, label: 'Settings' },
        { id: ViewState.ABOUT_US, icon: Info, label: 'About Us' },
        { id: ViewState.CONTACT_US, icon: Mail, label: 'Contact Us' },
        { id: ViewState.FEEDBACK, icon: MessageSquarePlus, label: 'Feedback' },
      ]
    }
  ];

  const handleNavigate = (view: ViewState) => {
    onChangeView(view);
    onClose();
  };

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      ></div>

      <div className={`fixed top-0 left-0 h-full w-[300px] bg-gradient-to-b from-[#05061A] to-[#020205] border-r border-white/5 z-[70] shadow-[0_0_50px_rgba(0,243,255,0.1)] transform transition-transform duration-300 flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        <div className="absolute top-0 right-0 w-[1px] h-full bg-gradient-to-b from-transparent via-cyber-cyan to-transparent opacity-30"></div>

        <div className="p-6 pb-4 bg-white/5 backdrop-blur-md border-b border-white/5 relative overflow-hidden">
            <div className="absolute top-[-50%] left-[-50%] w-[200%] h-[200%] bg-cyber-cyan/5 rounded-full blur-3xl pointer-events-none"></div>

            <div className="flex items-center justify-between mb-6 relative z-10">
                <h2 className="text-3xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan to-white tracking-widest drop-shadow-[0_0_8px_rgba(0,243,255,0.5)]">
                    ZUAKI
                </h2>
                <button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
                    <X size={20} />
                </button>
            </div>

            <div className="flex items-center gap-4 p-3 rounded-2xl bg-black/20 border border-white/10 backdrop-blur-sm relative z-10 shadow-lg">
                <div className="relative shrink-0">
                    <div className="w-12 h-12 rounded-full p-[2px] bg-gradient-to-br from-cyber-cyan to-cyber-purple shadow-[0_0_15px_rgba(0,243,255,0.3)]">
                        <img 
                            src={userProfile?.avatar || "https://ui-avatars.com/api/?name=User&background=00f3ff&color=000"} 
                            alt="User" 
                            className="w-full h-full rounded-full object-cover border-2 border-black" 
                        />
                    </div>
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-cyber-cyan rounded-full border-2 border-[#05061A] shadow-[0_0_8px_#00f3ff]"></div>
                </div>
                <div className="flex-1 min-w-0">
                    <h3 className="text-white font-bold text-sm truncate">{userProfile?.name || 'Student'}</h3>
                    <p className="text-cyber-cyan text-[10px] font-mono tracking-wider truncate opacity-80">
                        {userProfile?.userId || 'ZA-GUEST'}
                    </p>
                </div>
            </div>

            <div className="relative group mt-6 z-10">
                <Search className="absolute left-3 top-2.5 text-slate-500 group-focus-within:text-cyber-cyan transition-colors" size={16} />
                <input 
                    type="text" 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search features..." 
                    className="w-full bg-[#020205] border border-white/10 rounded-xl py-2 pl-10 pr-4 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyber-cyan/50 focus:shadow-[0_0_15px_rgba(0,243,255,0.1)] transition-all font-sans"
                />
            </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar px-3 py-4 space-y-6">
            {menuGroups.map((group, groupIdx) => {
                const filteredItems = group.items.filter(item => 
                    item.label.toLowerCase().includes(searchQuery.toLowerCase())
                );

                if (filteredItems.length === 0) return null;

                return (
                    <div key={groupIdx}>
                        <h3 className="px-4 mb-2 text-[10px] font-bold text-slate-500 uppercase tracking-[0.15em] opacity-70">
                            {group.title}
                        </h3>
                        
                        <div className="space-y-1">
                            {filteredItems.map((item) => {
                                const isTimer = item.id === ViewState.NEO_TIMER;
                                const isLive = isTimer && isTimerLive;

                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => handleNavigate(item.id)}
                                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-300 group relative overflow-hidden
                                            hover:bg-white/5
                                            ${isLive ? 'bg-green-900/10 border border-green-500/20' : 'border border-transparent'}
                                        `}
                                    >
                                        <div className="flex items-center gap-3 relative z-10">
                                            <item.icon 
                                                size={18} 
                                                className={`transition-colors duration-300
                                                    ${isLive ? 'text-green-400 animate-pulse' : 'text-slate-400 group-hover:text-cyber-cyan group-hover:drop-shadow-[0_0_5px_#00f3ff]'}
                                                `} 
                                            />
                                            <span className={`text-sm font-medium tracking-wide transition-colors
                                                ${isLive ? 'text-green-400 font-bold' : 'text-slate-300 group-hover:text-white'}
                                            `}>
                                                {item.label}
                                            </span>
                                        </div>

                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-0 w-[2px] bg-cyber-cyan group-hover:h-1/2 transition-all duration-300 opacity-0 group-hover:opacity-100 rounded-r-full shadow-[0_0_10px_#00f3ff]"></div>
                                        
                                        {isLive && (
                                            <span className="flex h-2 w-2 relative">
                                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>

        <div className="p-4 border-t border-white/5 bg-black/40 backdrop-blur-sm">
             <button 
                onClick={() => { onChangeView(ViewState.LOGIN); onClose(); }} 
                className="w-full flex items-center justify-center gap-3 p-3 rounded-xl text-slate-400 hover:text-cyber-pink hover:bg-cyber-pink/10 border border-white/5 hover:border-cyber-pink/30 transition-all group"
            >
                <LogOut size={18} className="group-hover:scale-110 transition-transform" />
                <span className="text-xs font-bold uppercase tracking-widest">Logout System</span>
             </button>
        </div>

      </div>
    </>
  );
};
