
import React from 'react';
import { Home, MessageSquare, Bot, Building2, User } from 'lucide-react';
import { ViewState } from '../types';

interface BottomNavigationProps {
  currentView: ViewState;
  onChangeView: (view: ViewState) => void;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({ currentView, onChangeView }) => {
  // Corrected sequence: Home | Chats | GenZ AI | Empire | Profile
  const navItems = [
    { id: ViewState.DASHBOARD, icon: Home, label: 'Home' },
    { id: ViewState.CHAT, icon: MessageSquare, label: 'Chats' },
    { id: ViewState.AI_ASSISTANT, icon: Bot, label: 'GenZ AI', isCenter: true },
    { id: ViewState.EMPIRE, icon: Building2, label: 'Empire' },
    { id: ViewState.PROFILE, icon: User, label: 'Profile' },
  ];

  return (
    <div className="lg:hidden fixed bottom-4 left-4 right-4 z-50 flex justify-center">
      <div className="w-full max-w-md bg-[#050818]/90 backdrop-blur-2xl border border-white/10 rounded-[30px] shadow-[0_0_40px_rgba(0,0,0,0.6)] flex items-center justify-between px-2 py-2 relative overflow-hidden">
        
        {/* Subtle Inner Neon Glow */}
        <div className="absolute inset-0 rounded-[30px] border border-cyber-cyan/20 pointer-events-none shadow-[inset_0_0_20px_rgba(0,243,255,0.05)]"></div>
        
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          const isCenter = item.isCenter;
          
          return (
            <button
              key={item.id}
              onClick={() => onChangeView(item.id)}
              className={`relative flex flex-col items-center justify-center flex-1 h-14 transition-all duration-300 ${isCenter ? '-mt-6' : ''}`}
            >
              {isCenter ? (
                // Center "GenZ AI" Floating Button
                <div className="flex flex-col items-center gap-1">
                   <div className={`w-14 h-14 rounded-full flex items-center justify-center border transition-all duration-300 shadow-[0_0_20px_rgba(157,0,255,0.4)]
                       ${isActive 
                         ? 'bg-cyber-purple border-cyber-purple text-white scale-110 shadow-[0_0_30px_#9d00ff]' 
                         : 'bg-[#02020a] border-cyber-purple/50 text-cyber-purple hover:bg-cyber-purple/20'
                       }
                   `}>
                       <item.icon size={28} strokeWidth={isActive ? 2.5 : 1.5} />
                   </div>
                   <span className={`text-[9px] font-bold tracking-[0.1em] transition-colors uppercase ${isActive ? 'text-cyber-purple drop-shadow-[0_0_5px_#9d00ff]' : 'text-slate-500'}`}>
                       {item.label}
                   </span>
                </div>
              ) : (
                // Standard Side Icons (Home, Chats, Empire, Profile)
                <>
                  <div className={`p-1.5 rounded-xl transition-all duration-300 relative group
                      ${isActive ? 'text-cyber-cyan drop-shadow-[0_0_8px_#00f3ff]' : 'text-slate-500 hover:text-slate-300'}
                  `}>
                      <item.icon size={22} strokeWidth={isActive ? 2.5 : 2} />
                      {isActive && <div className="absolute inset-0 bg-cyber-cyan/15 blur-md rounded-full"></div>}
                  </div>
                  <span className={`text-[9px] font-bold tracking-[0.1em] transition-colors mt-0.5 uppercase ${isActive ? 'text-cyber-cyan drop-shadow-[0_0_5px_#00f3ff]' : 'text-slate-500'}`}>
                      {item.label}
                  </span>
                </>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};
