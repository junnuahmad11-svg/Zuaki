
import React, { useState } from 'react';
import { 
  Home, MessageSquare, Bot, Calendar, ClipboardList, PenTool, Users, 
  Target, FileText, Brain, Trophy, BarChart2, Calculator, 
  TrendingUp, Bell, Settings, LogOut, Search, ChevronRight, BookOpen, Award, Swords, Info, Mail, MessageSquarePlus, Presentation
} from 'lucide-react';
import { ViewState, UserProfile } from '../types';

interface NavigationProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
  onLogout: () => void;
  userProfile: Partial<UserProfile>;
}

export const Navigation: React.FC<NavigationProps> = ({ currentView, onChangeView, onLogout, userProfile }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const menuItems = [
    { id: ViewState.DASHBOARD, icon: Home, label: 'Home' },
    { id: ViewState.IDEATHON_DOSSIER, icon: Presentation, label: 'Ideathon Pitch & PDF' },
    { id: ViewState.CHAT, icon: MessageSquare, label: 'Chats' },
    { id: ViewState.AI_ASSISTANT, icon: Bot, label: 'GenZ AI' },
    { id: ViewState.PLANNER, icon: Calendar, label: 'Planner & Calendar' },
    { id: ViewState.FLASHCARDS, icon: BookOpen, label: 'Flashcards' },
    { id: ViewState.TASKS, icon: ClipboardList, label: 'To-Do List' },
    { id: ViewState.WHITEBOARD, icon: PenTool, label: 'Whiteboard' },
    { id: ViewState.STUDY_HUB, icon: Users, label: 'Study Hub' },
    { id: ViewState.DAILY_FOCUS, icon: Target, label: 'Daily Focus Mode' },
    { id: ViewState.TEST_SERIES, icon: FileText, label: 'Test Series & Quizzes' },
    { id: ViewState.QUIZ_ARENA, icon: Swords, label: 'Quiz Arena' },
    { id: ViewState.LEADERBOARD, icon: Trophy, label: 'Leaderboard' },
    { id: ViewState.ACHIEVEMENTS, icon: Award, label: 'Achievements' },
    { id: ViewState.ANALYSIS, icon: BarChart2, label: 'Weekly Analysis' },
    { id: ViewState.CALCULATOR, icon: Calculator, label: 'Calculator' },
    { id: ViewState.RANK_PREDICTOR, icon: TrendingUp, label: 'JEE Rank Predictor' },
    { id: ViewState.NOTIFICATIONS, icon: Bell, label: 'Notifications' },
    { id: ViewState.SETTINGS, icon: Settings, label: 'Settings' },
    { id: ViewState.FEEDBACK, icon: MessageSquarePlus, label: 'Feedback' },
    { id: ViewState.ABOUT_US, icon: Info, label: 'About Us' },
    { id: ViewState.CONTACT_US, icon: Mail, label: 'Contact Us' },
  ];

  const filteredItems = menuItems.filter(item => 
    item.label.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <nav className="h-full w-[300px] flex flex-col bg-gradient-to-b from-[#05061A] to-[#0B0720] border-r border-white/5 relative overflow-hidden z-50 shadow-[5px_0_30px_rgba(0,0,0,0.5)]">
      
      {/* Glowing Left Border Accent */}
      <div className="absolute top-0 left-0 w-[1px] h-full bg-gradient-to-b from-cyber-cyan via-cyber-purple to-cyber-pink opacity-50"></div>

      {/* 3. User Profile Header */}
      <div className="p-6 pb-2 relative z-10">
        <div 
            onClick={() => onChangeView(ViewState.PROFILE)}
            className="group flex items-center gap-4 p-3 rounded-2xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-cyber-cyan/30 transition-all cursor-pointer relative overflow-hidden"
        >
            <div className="absolute inset-0 bg-cyber-cyan/5 translate-x-[-100%] group-hover:translate-x-0 transition-transform duration-500"></div>
            
            <div className="relative">
                <div className="absolute inset-0 bg-cyber-cyan blur-md opacity-20 group-hover:opacity-60 transition-opacity rounded-full"></div>
                <img 
                    src={userProfile.avatar || 'https://ui-avatars.com/api/?name=User&background=00f3ff&color=000'} 
                    alt="Profile" 
                    className="w-12 h-12 rounded-full border border-cyber-cyan/50 relative z-10 object-cover" 
                />
            </div>
            
            <div className="flex-1 min-w-0">
                <h3 className="text-white font-display font-bold text-sm truncate group-hover:text-cyber-cyan transition-colors">
                    {userProfile.name}
                </h3>
                <p className="text-slate-500 text-[10px] truncate">{userProfile.email || 'user@zuaki.ai'}</p>
                <p className="text-cyber-purple text-[9px] font-mono tracking-wider mt-0.5 truncate">
                    ID: {userProfile.userId || 'ZA-XXXXX'}
                </p>
            </div>
        </div>
      </div>

      {/* 2. Search Bar */}
      <div className="px-6 py-4 relative z-10">
        <div className="relative group">
            <Search className="absolute left-3 top-2.5 text-slate-500 group-focus-within:text-cyber-cyan transition-colors" size={16} />
            <input 
                type="text" 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search features..." 
                className="w-full bg-black/30 border border-white/10 rounded-full py-2 pl-10 pr-4 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyber-cyan/50 focus:shadow-[0_0_15px_rgba(0,243,255,0.1)] transition-all font-sans"
            />
        </div>
      </div>

      {/* 4. Menu Items List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-4 pb-4 space-y-1">
        {filteredItems.map((item) => {
          const isActive = currentView === item.id;
          const isAI = item.id === ViewState.AI_ASSISTANT;

          return (
            <button
              key={item.id}
              onClick={() => onChangeView(item.id)}
              className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-300 group relative overflow-hidden ${
                  isActive 
                  ? 'bg-white/5 border border-l-4 border-y-transparent border-r-transparent border-l-cyber-cyan' 
                  : 'hover:bg-white/5 border border-transparent hover:pl-4'
              }`}
            >
              {isActive && <div className="absolute inset-0 bg-gradient-to-r from-cyber-cyan/10 to-transparent"></div>}
              
              <div className="flex items-center gap-3 relative z-10">
                <item.icon 
                    size={isAI ? 20 : 18} 
                    className={`transition-colors ${
                        isActive 
                        ? (isAI ? 'text-cyber-purple drop-shadow-[0_0_8px_currentColor]' : 'text-cyber-cyan drop-shadow-[0_0_8px_currentColor]') 
                        : 'text-slate-400 group-hover:text-white'
                    }`} 
                />
                <span className={`text-xs font-medium tracking-wide ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`}>
                    {item.label}
                </span>
              </div>

              {isActive && (
                <div className="w-1.5 h-1.5 rounded-full bg-cyber-cyan shadow-[0_0_5px_#00f3ff] mr-2"></div>
              )}
              {!isActive && (
                 <ChevronRight size={14} className="text-white/0 group-hover:text-white/30 transition-all -translate-x-2 group-hover:translate-x-0" />
              )}
            </button>
          );
        })}
      </div>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-white/5 bg-black/20 backdrop-blur-sm">
        <button 
            onClick={onLogout}
            className="w-full flex items-center gap-3 p-3 rounded-xl text-slate-400 hover:text-cyber-pink hover:bg-cyber-pink/10 hover:border hover:border-cyber-pink/30 transition-all group"
        >
            <LogOut size={18} className="group-hover:drop-shadow-[0_0_5px_rgba(255,0,60,0.5)]" />
            <span className="text-xs font-bold uppercase tracking-widest">Logout System</span>
        </button>
      </div>

    </nav>
  );
};
