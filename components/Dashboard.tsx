
import React, { useState, useEffect } from 'react';
import { ArrowUpRight, Users, Bot, FileText, Calculator, BookOpen, PenTool, Trophy, Quote, HelpCircle, Activity, Zap, Hexagon, Star, Swords, Presentation, Download, Sparkles } from 'lucide-react';
import { ViewState, UserProfile } from '../types';
import { statsService } from '../services/statsService';
import { nta } from '../services/backend';

interface DashboardProps {
    onChangeView: (view: ViewState) => void;
    onOpenCalc: () => void;
    userProfileProp?: Partial<UserProfile>;
}

const QUOTES = [
    "The only way to do great work is to love what you do.",
    "Success is the sum of small efforts, repeated day in and day out.",
    "Believe you can and you're halfway there.",
    "Your future is created by what you do today, not tomorrow."
];

const DiscoveryIcon = ({ active }: { active: boolean }) => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={`transition-all duration-500 ${active ? 'text-white filter drop-shadow-[0_0_8px_rgba(255,255,255,0.6)]' : 'text-slate-400 group-hover:text-cyber-cyan group-hover:filter group-hover:drop-shadow-[0_0_8px_#00f3ff]'}`}>
        <path d="M12 2L14.2 9.8L22 12L14.2 14.2L12 22L9.8 14.2L2 12L9.8 9.8L12 2Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" fill={active ? "currentColor" : "none"} fillOpacity={active ? "0.9" : "0"} />
        <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.5" opacity="0.6" />
        {active && (
            <g className="animate-spin-slow" style={{transformOrigin: '12px 12px'}}>
                <path d="M12 4C16.4183 4 20 7.58172 20 12" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeDasharray="4 4" opacity="0.5" />
                <path d="M12 20C7.58172 20 4 16.4183 4 12" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeDasharray="4 4" opacity="0.5" />
            </g>
        )}
    </svg>
);

export const Dashboard: React.FC<DashboardProps> = ({ onChangeView, onOpenCalc, userProfileProp }) => {
  const [quote, setQuote] = useState(QUOTES[0]);
  const [streak, setStreak] = useState(0);
  const [userProfile, setUserProfile] = useState<Partial<UserProfile>>(userProfileProp || {});
  const [hasData, setHasData] = useState(false);
  const [ntaCount, setNtaCount] = useState(0);

  useEffect(() => {
      setQuote(QUOTES[Math.floor(Math.random() * QUOTES.length)]);
      
      const stats = statsService.getStats();
      setStreak(stats.dailyStreak);
      setHasData(stats.totalTime > 0);
      
      if (userProfileProp) setUserProfile(userProfileProp);

      const checkNta = async () => {
          const count = await nta.getUnreadCount();
          setNtaCount(count);
      };
      checkNta();
  }, [userProfileProp]);

  const todayStr = new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'long' });

  return (
    <div className="h-full w-full overflow-y-auto custom-scrollbar p-6 pb-28 relative bg-[#020617] perspective-1000">
      
      <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_#0f172a_0%,_#020617_70%)]"></div>
          {[...Array(20)].map((_, i) => (
              <div 
                key={i}
                className="absolute rounded-full bg-cyber-cyan/20 blur-md animate-pulse"
                style={{
                    width: `${Math.random() * 4 + 2}px`,
                    height: `${Math.random() * 4 + 2}px`,
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    animationDuration: `${Math.random() * 3 + 2}s`,
                    animationDelay: `${Math.random() * 2}s`
                }}
              />
          ))}
          <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-cyber-purple/10 rounded-full blur-[120px] animate-pulse-slow"></div>
          <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-cyber-cyan/10 rounded-full blur-[120px] animate-pulse-slow" style={{animationDelay: '1.5s'}}></div>
      </div>

      <div className="relative z-10 max-w-5xl mx-auto">
      
        <div className="flex justify-between items-center mb-2 animate-in slide-in-from-top-5 duration-700">
            <div className="flex items-center gap-4">
                <div className="relative group cursor-pointer" onClick={() => onChangeView(ViewState.PROFILE)}>
                    <div className="absolute inset-0 bg-gradient-to-tr from-cyber-cyan to-cyber-purple rounded-full blur-md opacity-60 group-hover:opacity-100 transition-opacity animate-spin-slow"></div>
                    <div className="w-16 h-16 rounded-full border-2 border-cyber-cyan/50 shadow-[0_0_20px_rgba(0,243,255,0.4)] p-0.5 relative z-10 bg-black overflow-hidden">
                        <img 
                            src={userProfile.avatar || "https://ui-avatars.com/api/?name=St&background=050818&color=00f3ff"} 
                            className="w-full h-full rounded-full object-cover transform group-hover:scale-110 transition-transform duration-500" 
                            alt="User" 
                        />
                    </div>
                </div>
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <h1 className="text-2xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-cyber-cyan to-white tracking-wide drop-shadow-[0_0_10px_rgba(0,243,255,0.5)]">
                            ZUAKI HUB
                        </h1>
                        <div className="px-2 py-0.5 rounded border border-cyber-purple/30 bg-cyber-purple/10 text-[10px] text-cyber-purple font-mono tracking-widest animate-pulse">
                            ONLINE
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-white font-bold text-sm">{userProfile.name}</span>
                        <div className="w-1 h-1 bg-slate-500 rounded-full"></div>
                        <p className="text-cyber-yellow text-xs tracking-[0.1em] font-bold uppercase flex items-center gap-1 animate-bounce duration-[2000ms]">
                            <Zap size={10} fill="currentColor" /> {streak} Day Streak
                        </p>
                    </div>
                </div>
            </div>
            
            <div className="flex flex-col items-center gap-2">
                <button 
                    onClick={() => onChangeView(ViewState.NOTIFICATIONS)} 
                    className="relative w-12 h-12 rounded-2xl glass-panel border border-white/10 flex items-center justify-center transition-all group overflow-visible hover:border-cyber-cyan/50 hover:bg-white/5"
                    title="Discovery Center"
                >
                    <DiscoveryIcon active={ntaCount > 0} />
                    
                    {ntaCount > 0 && (
                        <div className="absolute -top-1 -right-1">
                            <span className="flex h-5 w-5 relative">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyber-cyan opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-5 w-5 bg-cyber-cyan border-2 border-[#020617] items-center justify-center text-[9px] font-bold text-black font-mono shadow-[0_0_10px_#00f3ff]">
                                    {ntaCount > 9 ? '9+' : ntaCount}
                                </span>
                            </span>
                        </div>
                    )}
                </button>

                <button 
                    onClick={onOpenCalc}
                    className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyber-cyan to-blue-600 text-black flex items-center justify-center shadow-[0_0_20px_rgba(0,243,255,0.4)] hover:scale-110 hover:shadow-[0_0_30px_rgba(0,243,255,0.6)] transition-all"
                >
                    <Calculator size={20} />
                </button>
            </div>
        </div>

        <div className="text-slate-500 text-xs font-mono mb-4 uppercase tracking-[0.2em] pl-2 border-l-2 border-cyber-purple/50 ml-1 animate-in fade-in duration-1000 flex items-center justify-between">
            <span>{todayStr} • System Active</span>
            <span className="text-cyber-cyan font-bold flex items-center gap-1 cursor-pointer hover:underline text-[11px]" onClick={() => onChangeView(ViewState.IDEATHON_DOSSIER)}>
                <Sparkles size={12} /> Ideathon Dossier Ready
            </span>
        </div>

        {/* Ideathon Pitch Deck & PDF Banner */}
        <div 
            onClick={() => onChangeView(ViewState.IDEATHON_DOSSIER)}
            className="p-5 rounded-[24px] bg-gradient-to-r from-cyber-cyan/15 via-cyber-purple/20 to-cyber-pink/15 border-2 border-cyber-cyan/40 hover:border-cyber-cyan mb-8 relative overflow-hidden group cursor-pointer shadow-[0_0_25px_rgba(0,243,255,0.2)] hover:shadow-[0_0_35px_rgba(0,243,255,0.4)] transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4"
        >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            <div className="flex items-center gap-4 relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-black/50 border border-cyber-cyan/50 flex items-center justify-center text-cyber-cyan shadow-[0_0_15px_rgba(0,243,255,0.4)] group-hover:scale-110 transition-transform shrink-0">
                    <Presentation size={24} />
                </div>
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded bg-cyber-pink/20 text-cyber-pink border border-cyber-pink/40 text-[10px] font-bold uppercase tracking-wider font-mono">
                            IDEATHON PITCH
                        </span>
                        <span className="text-[10px] text-cyber-cyan font-mono font-bold tracking-widest animate-pulse">
                            15+ FEATURES INCLUDED
                        </span>
                    </div>
                    <h3 className="text-base font-display font-bold text-white group-hover:text-cyber-cyan transition-colors">
                        Zuaki Official Ideathon Pitch Deck & Full Feature Dossier
                    </h3>
                    <p className="text-slate-400 text-xs">
                        Download ready-to-present multi-page PDF • 3-Min stage pitch script • Judge Q&A cheat sheet
                    </p>
                </div>
            </div>

            <div className="flex items-center gap-2 relative z-10 w-full md:w-auto justify-end shrink-0">
                <button 
                    onClick={(e) => {
                        e.stopPropagation();
                        onChangeView(ViewState.IDEATHON_DOSSIER);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyber-cyan to-blue-600 text-black font-display font-bold text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(0,243,255,0.4)] group-hover:shadow-[0_0_25px_rgba(0,243,255,0.7)] transition-all flex items-center gap-2"
                >
                    <Download size={14} /> Open & Download PDF
                </button>
            </div>
        </div>

        <div className="glass-panel p-6 rounded-[24px] border border-white/10 mb-8 relative overflow-hidden group hover:border-cyber-cyan/30 transition-all duration-500 animate-in slide-in-from-bottom-6">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
            <Quote size={32} className="absolute top-4 left-4 text-white/5 rotate-180 group-hover:text-cyber-cyan/10 transition-colors" />
            <p className="text-white/90 font-display text-lg italic text-center relative z-10 drop-shadow-md">"{quote}"</p>
            <Quote size={32} className="absolute bottom-4 right-4 text-white/5 group-hover:text-cyber-cyan/10 transition-colors" />
        </div>

        <div className="h-px w-full bg-gradient-to-r from-transparent via-cyber-cyan/50 to-transparent mb-8 shadow-[0_0_10px_#00f3ff] opacity-50"></div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
            
            <div onClick={() => onChangeView(ViewState.ANALYSIS)} className="col-span-2 row-span-1 lg:row-span-2 glass-panel p-6 rounded-[30px] border border-white/10 relative overflow-hidden group cursor-pointer hover:border-cyber-cyan/50 hover:shadow-[0_0_30px_rgba(0,243,255,0.15)] transition-all duration-300 animate-in zoom-in-95 delay-100">
                <div className="absolute inset-0 bg-cyber-cyan/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="absolute -right-10 -top-10 w-40 h-40 bg-cyber-cyan/20 rounded-full blur-[50px] group-hover:bg-cyber-cyan/30 transition-all"></div>
                
                <div className="flex justify-between items-center mb-4 relative z-10">
                    <h3 className="text-white font-bold text-lg flex items-center gap-2 uppercase tracking-wide">
                        <Activity size={20} className="text-cyber-cyan animate-pulse"/> Weekly Insight
                    </h3>
                    <div className="p-2 rounded-full border border-white/10 bg-black/20 group-hover:bg-cyber-cyan group-hover:text-black transition-all">
                        <ArrowUpRight size={18} />
                    </div>
                </div>
                
                {hasData ? (
                    <div className="h-40 w-full relative z-10 flex items-end justify-between gap-3 px-2 pb-2">
                        {[40, 60, 30, 80, 50, 90, 70].map((h, i) => (
                            <div key={i} className="w-full bg-black/40 rounded-t-lg relative overflow-hidden group-hover:shadow-[0_0_15px_rgba(0,243,255,0.2)]">
                                <div style={{height: `${h}%`}} className="absolute bottom-0 w-full bg-gradient-to-t from-cyber-cyan to-blue-500 rounded-t-lg transition-all duration-1000"></div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="h-40 flex flex-col items-center justify-center text-center relative z-10">
                        <p className="text-slate-400 text-sm mb-3 font-mono">No neural data available</p>
                        <span className="text-xs text-cyber-cyan border border-cyber-cyan/30 bg-cyber-cyan/10 px-4 py-2 rounded-full font-bold uppercase tracking-widest hover:bg-cyber-cyan hover:text-black transition-colors">Start Studying</span>
                    </div>
                )}
            </div>

            <div onClick={() => onChangeView(ViewState.CHAT)} className="col-span-2 glass-panel p-6 rounded-[30px] border border-white/10 relative overflow-hidden group cursor-pointer hover:border-cyber-purple/50 hover:shadow-[0_0_30px_rgba(157,0,255,0.15)] transition-all duration-300 animate-in zoom-in-95 delay-150 h-full flex flex-col justify-between">
                 <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
                 <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-cyber-purple/20 rounded-full blur-[50px] group-hover:bg-cyber-purple/30 transition-all"></div>
                 
                 <div className="flex justify-between items-start relative z-10">
                     <div className="p-3 rounded-2xl bg-cyber-purple/10 border border-cyber-purple/30 text-cyber-purple group-hover:scale-110 group-hover:shadow-[0_0_15px_#9d00ff] transition-transform duration-300">
                         <Bot size={28} />
                     </div>
                     <span className="text-[10px] font-bold bg-cyber-purple/20 text-cyber-purple px-2 py-1 rounded border border-cyber-purple/30">AI ACTIVE</span>
                 </div>
                 <div className="relative z-10">
                     <h4 className="text-xl font-display font-bold text-white mb-1 group-hover:text-cyber-purple transition-colors">GenZ Chat</h4>
                     <p className="text-slate-400 text-xs">Ask doubts, generate images.</p>
                 </div>
            </div>

            <FeatureCard title="Quiz Arena" icon={Swords} color="purple" delay={200} onClick={() => onChangeView(ViewState.QUIZ_ARENA)} />
            <FeatureCard title="Planner" icon={FileText} color="pink" delay={250} onClick={() => onChangeView(ViewState.PLANNER)} />
            <FeatureCard title="Leaderboard" icon={Trophy} color="yellow" delay={300} onClick={() => onChangeView(ViewState.LEADERBOARD)} />
            <FeatureCard title="Flashcards" icon={BookOpen} color="white" delay={350} onClick={() => onChangeView(ViewState.FLASHCARDS)} />
            <FeatureCard title="Shortcuts" icon={Zap} color="blue" delay={400} onClick={() => {}} />
            <FeatureCard title="Formula Vault" icon={Hexagon} color="cyan" delay={450} onClick={() => onChangeView(ViewState.FORMULA_VAULT)} />

        </div>
      </div>
    </div>
  );
};

const FeatureCard = ({ title, icon: Icon, color, onClick, delay }: any) => {
    const colorMap: any = {
        purple: 'text-cyber-purple bg-cyber-purple/10 border-cyber-purple/30 group-hover:border-cyber-purple group-hover:shadow-[0_0_20px_#9d00ff]',
        pink: 'text-cyber-pink bg-cyber-pink/10 border-cyber-pink/30 group-hover:border-cyber-pink group-hover:shadow-[0_0_20px_#ff003c]',
        yellow: 'text-cyber-yellow bg-cyber-yellow/10 border-cyber-yellow/30 group-hover:border-cyber-yellow group-hover:shadow-[0_0_20px_#fcee0a]',
        white: 'text-white bg-white/10 border-white/30 group-hover:border-white group-hover:shadow-[0_0_20px_#ffffff]',
        blue: 'text-blue-400 bg-blue-400/10 border-blue-400/30 group-hover:border-blue-400 group-hover:shadow-[0_0_20px_#60a5fa]',
        cyan: 'text-cyber-cyan bg-cyber-cyan/10 border-cyber-cyan/30 group-hover:border-cyber-cyan group-hover:shadow-[0_0_20px_#00f3ff]'
    };

    return (
        <div 
            onClick={onClick} 
            className={`glass-panel p-5 rounded-[24px] border border-white/10 hover:bg-white/5 cursor-pointer group transition-all duration-300 relative overflow-hidden h-40 flex flex-col justify-between animate-in zoom-in-95`}
            style={{ animationDelay: `${delay}ms` }}
        >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all duration-300 ${colorMap[color]}`}>
                <Icon size={20} className="group-hover:scale-110 transition-transform" />
            </div>
            <div>
                <h4 className="text-white font-bold text-sm mb-1 group-hover:tracking-wide transition-all">{title}</h4>
                <div className="w-6 h-1 rounded-full bg-white/10 group-hover:w-full transition-all duration-500 bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
            </div>
            
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
                <ArrowUpRight size={14} className="text-white" />
            </div>
        </div>
    );
};
