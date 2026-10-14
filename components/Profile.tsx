
import React, { useEffect, useState } from 'react';
import { 
    User, Settings, Award, TrendingUp, Shield, Edit2, Clock, 
    Hexagon, LogOut, Copy, Check, Lock, Gift, Zap, Star, 
    Bell, MessageSquare, Users, Plus, ChevronRight, MapPin, Box, Cpu, ArrowUp, 
    Target, BookOpen, AlertTriangle, Play, Bookmark, X, Loader2, Brain, Droplet, BellOff
} from 'lucide-react';
import { UserProfile, ViewState, UserStats } from '../types';
import { statsService } from '../services/statsService';
import { firebase } from '../services/backend';
import { getGenZResponse } from '../services/geminiService';
import { hydrationService } from '../services/hydrationService';

interface ProfileProps {
  userProfile?: Partial<UserProfile>;
  onUpdateProfile?: (data: Partial<UserProfile>) => void;
  onNavigate?: (view: ViewState) => void;
  onLogout?: () => void;
}

interface AggregatedChapter {
    name: string;
    attempts: number;
    avgAccuracy: number;
    status: 'WEAK' | 'STRONG' | 'AVERAGE';
}

interface AIAnalysisResult {
    title: string;
    section1: { title: string, content: string };
    section2: { title: string, content: string };
    section3: { title: string, content: string[] };
}

// --- ROBOT AVATAR (Horizontal Variant) ---
const RobotAvatarHorizontal = ({ moving }: { moving: boolean }) => (
    <div className={`relative w-12 h-12 transition-transform duration-500`}>
        {/* Thrust Effect */}
        <div className={`absolute top-1/2 -left-2 -translate-y-1/2 w-6 h-3 bg-gradient-to-r from-transparent to-cyber-cyan blur-sm transition-opacity duration-300 ${moving ? 'opacity-100' : 'opacity-50'}`}></div>
        
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-[0_0_10px_rgba(0,243,255,0.8)] transform -rotate-90">
            <rect x="30" y="35" width="40" height="30" rx="5" fill="#0b0f1a" stroke="#00f3ff" strokeWidth="3" />
            <path d="M30 35 L30 25 Q30 10 50 10 Q70 10 70 25 L70 35 Z" fill="#0b0f1a" stroke="#00f3ff" strokeWidth="3" />
            <path d="M35 25 L65 25" stroke="#00f3ff" strokeWidth="4" strokeLinecap="round" className="animate-pulse">
                <animate attributeName="stroke-opacity" values="1;0.5;1" dur="2s" repeatCount="indefinite" />
            </path>
            <path d="M25 40 L25 60 Q25 70 35 70 L65 70 Q75 70 75 60 L75 40" fill="none" stroke="#00f3ff" strokeWidth="2" opacity="0.5" />
        </svg>
    </div>
);

// --- HORIZONTAL XP TRACK COMPONENT ---
const HorizontalLevelTrack: React.FC<{ xp: number, level: number }> = ({ xp, level }) => {
    const LEVEL_BASE = 500;
    const currentLevelStart = (level - 1) * LEVEL_BASE;
    const xpInLevel = xp - currentLevelStart;
    const progressPercent = Math.min(100, Math.max(0, (xpInLevel / LEVEL_BASE) * 100));

    return (
        <div className="w-full glass-panel p-6 rounded-[24px] border border-white/10 relative overflow-hidden mb-6 shadow-[0_0_40px_rgba(0,0,0,0.4)]">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-cyber-cyan/5 via-transparent to-cyber-purple/5 pointer-events-none"></div>
            <div className="flex justify-between items-end mb-8 relative z-10">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded border border-cyber-cyan/30 bg-cyber-cyan/10 text-[10px] text-cyber-cyan font-bold uppercase tracking-widest">
                            Current Rank
                        </span>
                    </div>
                    <h2 className="text-3xl font-display font-bold text-white flex items-center gap-2">
                        LEVEL {level} <span className="text-lg text-slate-500 font-normal">Scholar</span>
                    </h2>
                </div>
                <div className="text-right">
                    <p className="text-xs text-slate-400 uppercase tracking-widest mb-1">XP Progress</p>
                    <p className="text-xl font-mono font-bold text-white">
                        <span className="text-cyber-cyan">{Math.floor(xpInLevel)}</span> 
                        <span className="text-slate-600 text-sm mx-1">/</span> 
                        <span className="text-slate-500 text-lg">{LEVEL_BASE}</span>
                    </p>
                </div>
            </div>
            <div className="relative h-16 w-full flex items-center mb-2">
                <div className="absolute w-full h-3 bg-[#020617] rounded-full border border-white/10 shadow-inner"></div>
                <div 
                    className="absolute h-3 bg-gradient-to-r from-green-400 via-cyan-400 to-blue-500 rounded-full shadow-[0_0_15px_rgba(0,243,255,0.5)] transition-all duration-1000 ease-out"
                    style={{ width: `${progressPercent}%` }}
                ></div>
                {[33, 66, 100].map((pct) => (
                    <div 
                        key={pct}
                        className="absolute w-8 h-8 -ml-4 flex items-center justify-center transition-all duration-500"
                        style={{ left: `${pct}%`, top: '50%', transform: 'translateY(-50%)' }}
                    >
                        <div className={`w-3 h-3 rounded-full ${progressPercent >= pct ? 'bg-cyber-cyan shadow-[0_0_10px_#00f3ff]' : 'bg-[#0b0f1a] border border-white/20'}`}></div>
                        {pct === 100 && (
                            <div className="absolute -top-8 animate-bounce">
                                <Gift size={18} className={progressPercent >= 100 ? "text-cyber-pink" : "text-slate-600"} />
                            </div>
                        )}
                    </div>
                ))}
                <div 
                    className="absolute top-1/2 -translate-y-1/2 transition-all duration-1000 ease-out z-20"
                    style={{ left: `calc(${progressPercent}% - 24px)` }}
                >
                    <div className="animate-[bounce_3s_infinite]">
                        <RobotAvatarHorizontal moving={progressPercent > 0} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export const Profile: React.FC<ProfileProps> = ({ userProfile, onUpdateProfile, onNavigate, onLogout }) => {
  const [stats, setStats] = useState<UserStats>(statsService.getStats());
  const [zaId, setZaId] = useState(userProfile?.userId || '');
  const [copied, setCopied] = useState(false);
  const [bookmarksCount, setBookmarksCount] = useState(0);
  
  // Data Driven State
  const [weakChapters, setWeakChapters] = useState<AggregatedChapter[]>([]);
  const [strongChapters, setStrongChapters] = useState<AggregatedChapter[]>([]);
  const [hasData, setHasData] = useState(false);
  
  // AI Modal State
  const [selectedChapter, setSelectedChapter] = useState<AggregatedChapter | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState<AIAnalysisResult | null>(null);

  // Hydration State
  const [hydration, setHydration] = useState(hydrationService.getSettings());

  useEffect(() => {
    const unsubscribe = statsService.subscribe(setStats);
    if (!zaId && userProfile?.userId) {
        setZaId(userProfile.userId);
    }
    
    // Load Bookmarks
    const b = JSON.parse(localStorage.getItem('user_bookmarks') || '[]');
    setBookmarksCount(b.length);

    // Load & Aggregate Real Data
    loadRealData();

    return () => { unsubscribe(); };
  }, [userProfile]);

  const loadRealData = async () => {
      try {
          const history = await firebase.firestore().tests.getHistory();
          
          if (!history || history.length === 0) {
              setHasData(false);
              return;
          }

          setHasData(true);
          const chapterMap: Record<string, { attempts: number, accuracySum: number }> = {};

          history.forEach(test => {
              if (test.chapterAnalysis) {
                  test.chapterAnalysis.forEach((ch: any) => {
                      if (!chapterMap[ch.name]) {
                          chapterMap[ch.name] = { attempts: 0, accuracySum: 0 };
                      }
                      chapterMap[ch.name].attempts += 1;
                      chapterMap[ch.name].accuracySum += ch.accuracy;
                  });
              }
          });

          const aggregated: AggregatedChapter[] = Object.keys(chapterMap).map(name => {
              const data = chapterMap[name];
              const avgAcc = data.accuracySum / data.attempts;
              let status: 'AVERAGE' | 'WEAK' | 'STRONG' = 'AVERAGE';
              
              if (avgAcc < 60) status = 'WEAK';
              else if (avgAcc > 80 && data.attempts >= 1) status = 'STRONG';

              return {
                  name,
                  attempts: data.attempts,
                  avgAccuracy: avgAcc,
                  status
              };
          });

          setWeakChapters(aggregated.filter(c => c.status === 'WEAK').sort((a,b) => a.avgAccuracy - b.avgAccuracy));
          setStrongChapters(aggregated.filter(c => c.status === 'STRONG').sort((a,b) => b.avgAccuracy - a.avgAccuracy));

      } catch (e) {
          console.error("Failed to load chapter data", e);
      }
  };

  const copyToClipboard = () => {
      navigator.clipboard.writeText(zaId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
  };

  const handleChapterClick = async (chapter: AggregatedChapter) => {
      setSelectedChapter(chapter);
      setAiLoading(true);
      setAiResult(null);

      const prompt = `
      Act as an expert JEE Tutor AI. Analyze the student's performance for the chapter: "${chapter.name}".
      User Accuracy: ${chapter.avgAccuracy.toFixed(1)}%.
      Status: ${chapter.status}.

      Return a strictly valid JSON object with the following structure (NO MARKDOWN, NO EMOJIS):
      {
        "title": "AI Insight for ${chapter.name}",
        "section1": {
            "title": "${chapter.status === 'WEAK' ? 'Brief Concept Explanation' : 'Why This Chapter Is Strong'}",
            "content": "${chapter.status === 'WEAK' ? 'Explain core concept in 5-8 lines simply.' : 'Analyze why user is performing well (speed/accuracy).'}"
        },
        "section2": {
            "title": "${chapter.status === 'WEAK' ? 'Why This Chapter Is Weak' : 'Maintenance Strategy'}",
            "content": "${chapter.status === 'WEAK' ? 'List common reasons for weakness (formula confusion, conceptual gaps).' : 'Suggest revision frequency (e.g. once in 7 days).'}"
        },
        "section3": {
            "title": "${chapter.status === 'WEAK' ? 'What To Do Next' : 'Advanced Suggestion'}",
            "content": [
                "${chapter.status === 'WEAK' ? 'Step 1 of action plan' : 'Step 1 of advanced challenge'}",
                "${chapter.status === 'WEAK' ? 'Step 2' : 'Step 2'}",
                "${chapter.status === 'WEAK' ? 'Step 3' : 'Step 3'}"
            ]
        }
      }
      `;

      try {
          const response = await getGenZResponse(prompt);
          if (response && typeof response === 'string') {
              const cleanJson = response.replace(/```json/g, '').replace(/```/g, '').trim();
              setAiResult(JSON.parse(cleanJson));
          } else {
              throw new Error("Invalid AI response");
          }
      } catch (e) {
          setAiResult({
              title: "Analysis Failed",
              section1: { title: "Error", content: "Could not connect to Zuaki Neural Network." },
              section2: { title: "Retry", content: "Please try again later." },
              section3: { title: "Actions", content: ["Check connection", "Retry"] }
          });
      } finally {
          setAiLoading(false);
      }
  };

  const toggleHydration = (enabled: boolean) => {
    const newSettings = { ...hydration, enabled };
    setHydration(newSettings);
    hydrationService.updateSettings(newSettings.enabled, newSettings.interval);
  };

  const updateHydrationInterval = (interval: number) => {
    const newSettings = { ...hydration, interval };
    setHydration(newSettings);
    hydrationService.updateSettings(newSettings.enabled, newSettings.interval);
  };

  return (
    <div className="h-full w-full bg-[#020617] relative overflow-hidden flex flex-col font-sans">
       <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none"></div>
       <div className="absolute top-[-20%] right-[-20%] w-[500px] h-[500px] bg-blue-900/10 rounded-full blur-[120px] pointer-events-none"></div>

       {/* HERO HEADER */}
       <div className="px-6 pt-8 pb-4 flex items-center justify-between z-20">
           <div className="flex items-center gap-4">
               <div className="relative group cursor-pointer" onClick={() => onNavigate?.(ViewState.EDIT_PROFILE)}>
                   <div className="w-16 h-16 rounded-full p-0.5 bg-gradient-to-br from-cyber-cyan/50 to-blue-600/50 shadow-[0_0_20px_rgba(0,243,255,0.15)]">
                       <img src={userProfile?.avatar || 'https://ui-avatars.com/api/?name=User'} className="w-full h-full rounded-full object-cover border-2 border-[#020617]" />
                   </div>
                   <div className="absolute bottom-0 right-0 px-1.5 py-0.5 bg-[#020617] rounded-full border border-green-500/30 flex items-center gap-1">
                       <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_5px_#22c55e]"></div>
                       <span className="text-[8px] font-bold text-green-500 uppercase tracking-wide">Online</span>
                   </div>
               </div>
               
               <div>
                   <h1 className="text-white font-display font-bold text-2xl leading-none tracking-wide">{userProfile?.name || 'Operative'}</h1>
                   <div className="flex items-center gap-2 mt-1.5">
                       <span className="px-2 py-0.5 bg-white/5 rounded text-[10px] text-cyber-cyan font-mono tracking-wider border border-white/10 flex items-center gap-1">
                           {zaId} 
                           <button onClick={copyToClipboard} className="hover:text-white transition-colors">
                               {copied ? <Check size={10} className="text-green-400"/> : <Copy size={10} />}
                           </button>
                       </span>
                       <span className="text-[10px] text-slate-500 border-l border-white/10 pl-2">
                           {userProfile?.studentClass ? `Class ${userProfile.studentClass}` : 'Class Not Set'}
                       </span>
                   </div>
               </div>
           </div>

           <div className="flex gap-2">
               <button onClick={() => onNavigate?.(ViewState.EDIT_PROFILE)} className="p-3 rounded-xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 transition-all">
                   <Settings size={20} />
               </button>
           </div>
       </div>

       <div className="flex-1 overflow-y-auto custom-scrollbar px-6 pb-24 z-10 space-y-6">
           <HorizontalLevelTrack xp={stats.xp} level={stats.level} />

           {/* 5. DATA DRIVEN ANALYTICS */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
               {/* NEED FOCUS SECTION */}
               <div className="glass-panel p-5 rounded-2xl border border-red-500/20 bg-red-500/5">
                   <div className="flex justify-between items-center mb-4">
                       <h3 className="text-red-400 font-bold text-sm uppercase tracking-widest flex items-center gap-2">
                           <AlertTriangle size={16} /> Need Focus
                       </h3>
                       {hasData && (
                           <button onClick={() => onNavigate?.(ViewState.FLASHCARDS)} className="text-[10px] bg-red-500/20 text-red-400 px-2 py-1 rounded hover:bg-red-500 hover:text-white transition-all">
                               Fix Now
                           </button>
                       )}
                   </div>
                   
                   {!hasData || weakChapters.length === 0 ? (
                       <div className="text-center py-6">
                           <p className="text-slate-500 text-xs italic mb-2">Insufficient data.</p>
                           <p className="text-slate-600 text-[10px]">Attempt quizzes, mock tests, or PYQs to unlock AI analysis.</p>
                       </div>
                   ) : (
                       <div className="space-y-3">
                           {weakChapters.slice(0, 3).map((chapter, i) => (
                               <div 
                                   key={i} 
                                   onClick={() => handleChapterClick(chapter)}
                                   className="flex justify-between items-center bg-black/40 p-3 rounded-xl border border-red-500/10 cursor-pointer hover:border-red-500/40 transition-all group"
                               >
                                   <div className="flex items-center gap-3">
                                       <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500 font-bold text-xs">
                                           {chapter.name.substring(0, 1)}
                                       </div>
                                       <div>
                                           <p className="text-white text-xs font-bold group-hover:text-red-400 transition-colors">{chapter.name}</p>
                                           <p className="text-[10px] text-slate-500">{chapter.avgAccuracy.toFixed(0)}% Accuracy</p>
                                       </div>
                                   </div>
                                   <ArrowUp className="text-red-500 rotate-180" size={14} />
                               </div>
                           ))}
                       </div>
                   )}
               </div>

               {/* STRONG HOLD SECTION */}
               <div className="glass-panel p-5 rounded-2xl border border-green-500/20 bg-green-500/5">
                   <div className="flex justify-between items-center mb-4">
                       <h3 className="text-green-400 font-bold text-sm uppercase tracking-widest flex items-center gap-2">
                           <Shield size={16} /> Strong Hold
                       </h3>
                       <span className="text-[10px] text-slate-500">Keep it up</span>
                   </div>

                   {!hasData || strongChapters.length === 0 ? (
                       <div className="text-center py-6">
                           <p className="text-slate-500 text-xs italic mb-2">Insufficient data.</p>
                           <p className="text-slate-600 text-[10px]">Complete tests with high accuracy to build your stronghold.</p>
                       </div>
                   ) : (
                       <div className="space-y-3">
                           {strongChapters.slice(0, 3).map((chapter, i) => (
                               <div 
                                   key={i} 
                                   onClick={() => handleChapterClick(chapter)}
                                   className="flex justify-between items-center bg-black/40 p-3 rounded-xl border border-green-500/10 cursor-pointer hover:border-green-500/40 transition-all group"
                               >
                                   <div className="flex items-center gap-3">
                                       <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center text-green-500 font-bold text-xs">
                                           {chapter.name.substring(0, 1)}
                                       </div>
                                       <div>
                                           <p className="text-white text-xs font-bold group-hover:text-green-400 transition-colors">{chapter.name}</p>
                                           <p className="text-[10px] text-slate-500">{chapter.avgAccuracy.toFixed(0)}% Accuracy</p>
                                       </div>
                                   </div>
                                   <ArrowUp className="text-green-500" size={14} />
                               </div>
                           ))}
                       </div>
                   )}
               </div>
           </div>

           {/* QUICK ACTIONS */}
           <div>
               <h3 className="text-white font-bold text-sm uppercase tracking-widest mb-4 pl-1 border-l-4 border-cyber-cyan ml-1">Quick Actions</h3>
               <div className="grid grid-cols-2 gap-3">
                   <button onClick={() => onNavigate?.(ViewState.DAILY_FOCUS)} className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-cyber-cyan/50 hover:bg-cyber-cyan/10 transition-all flex flex-col items-center gap-2 group">
                       <Target size={24} className="text-slate-300 group-hover:text-cyber-cyan transition-colors" />
                       <span className="text-xs font-medium text-white">Start Focus</span>
                   </button>
                   <button onClick={() => onNavigate?.(ViewState.RANK_PREDICTOR)} className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-cyber-purple/50 hover:bg-cyber-purple/10 transition-all flex flex-col items-center gap-2 group">
                       <TrendingUp size={24} className="text-slate-300 group-hover:text-cyber-purple transition-colors" />
                       <span className="text-xs font-medium text-white">Predict Rank</span>
                   </button>
               </div>

               {/* Re-Setup Protocol (Requested) */}
               <button 
                  onClick={() => onNavigate?.(ViewState.OPERATIVE_SETUP)}
                  className="w-full mt-4 p-4 rounded-2xl border border-white/10 bg-white/5 text-slate-300 flex items-center justify-center gap-3 hover:bg-white/10 transition-all group"
               >
                   <Cpu size={18} className="text-cyber-cyan group-hover:animate-spin" />
                   <span className="font-bold text-xs uppercase tracking-widest">Edit Operative Setup</span>
               </button>
               
               <button onClick={onLogout} className="w-full mt-4 p-4 rounded-2xl border border-red-500/20 bg-red-500/5 text-red-500 flex items-center justify-center gap-2 hover:bg-red-500/10 hover:border-red-500/40 transition-all">
                   <LogOut size={16} /> <span className="font-bold text-xs uppercase tracking-wider">Logout</span>
               </button>
           </div>

           {/* --- HYDRATION & HEALTH SECTION --- */}
           <div className="glass-panel p-6 rounded-2xl border border-blue-500/20 bg-blue-500/5 mt-6 relative overflow-hidden">
               <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/10 rounded-full blur-[40px] pointer-events-none"></div>
               <div className="flex items-center justify-between mb-6">
                   <div className="flex items-center gap-3">
                       <div className="p-2 rounded-lg bg-blue-500/20 text-blue-400">
                           <Droplet size={20} />
                       </div>
                       <div>
                           <h3 className="text-white font-bold text-sm uppercase tracking-widest">Hydration & Health</h3>
                           <p className="text-slate-400 text-[10px] uppercase tracking-wider">Stay hydrated to stay sharp</p>
                       </div>
                   </div>
                   <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                            type="checkbox" 
                            checked={hydration.enabled} 
                            onChange={(e) => toggleHydration(e.target.checked)} 
                            className="sr-only peer" 
                        />
                        <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-500"></div>
                    </label>
               </div>

               <div className="space-y-4">
                   <div className="flex items-center justify-between">
                       <span className="text-xs text-slate-300">Reminder Interval</span>
                       <select 
                            disabled={!hydration.enabled}
                            value={hydration.interval}
                            onChange={(e) => updateHydrationInterval(parseInt(e.target.value))}
                            className={`bg-black/40 border border-white/20 text-white text-xs rounded-lg px-2 py-1 outline-none transition-opacity ${!hydration.enabled ? 'opacity-30' : ''}`}
                       >
                           <option value={45}>Every 45 minutes</option>
                           <option value={60}>Every 60 minutes</option>
                           <option value={90}>Every 90 minutes</option>
                       </select>
                   </div>
                   <div className="p-3 bg-white/5 rounded-xl border border-white/10 flex items-start gap-3">
                       <AlertTriangle size={14} className="text-cyber-yellow shrink-0 mt-0.5" />
                       <p className="text-[10px] text-slate-400 leading-relaxed italic">
                           We recommend turning notifications OFF during intense study or exams to maintain peak focus.
                       </p>
                   </div>
               </div>
           </div>

           {/* --- GLOBAL AI GUIDANCE --- */}
           <div className="glass-panel p-6 rounded-2xl border border-cyber-cyan/20 bg-cyber-cyan/5 mt-6">
               <div className="flex items-center gap-3 mb-4">
                   <Brain size={20} className="text-cyber-cyan" />
                   <h3 className="text-white font-bold text-sm uppercase tracking-widest">Zuaki AI Study Guidance</h3>
               </div>

               {/* Philosophy */}
               <div className="mb-6 border-l-2 border-white/20 pl-4">
                   <p className="text-slate-300 text-sm italic leading-relaxed">
                       "JEE is not about studying more, it is about studying right, consistently, every day. Hard work beats talent when talent doesn't work hard."
                   </p>
               </div>

               {/* Daily Habits */}
               <div className="mb-6">
                   <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Daily Protocol</h4>
                   <ul className="space-y-2">
                       {["Set fixed study slots and stick to them.", "Prioritize error analysis over new questions.", "Take short, focused breaks to reset.", "Review formulas before sleep."].map((habit, i) => (
                           <li key={i} className="flex gap-3 text-sm text-slate-300 items-start">
                               <span className="w-1.5 h-1.5 rounded-full bg-cyber-cyan mt-2 shrink-0"></span>
                               {habit}
                           </li>
                       ))}
                   </ul>
               </div>

               {/* Hydration Reminder Placeholder (Referencing the UI above) */}
               <div className="mb-6 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                   <div className="flex items-center gap-2 mb-2">
                       <Droplet size={14} className="text-blue-400" />
                       <span className="text-blue-400 font-bold text-xs uppercase tracking-wider">Stay Hydrated</span>
                   </div>
                   <p className="text-slate-300 text-xs leading-relaxed">
                       Dehydration reduces cognitive function. Drink water regularly during long study sessions to avoid fatigue and maintain peak concentration.
                   </p>
               </div>

               {/* No Premium Promise */}
               <div className="mb-6 pt-4 border-t border-white/5">
                   <p className="text-xs text-slate-400 text-center">
                       Zuaki provides full access to learning tools without premium barriers, so every student can reach their goal.
                   </p>
               </div>

               {/* Notification Discipline */}
               <div className="flex items-center justify-center gap-2 text-[10px] text-slate-500 uppercase tracking-widest opacity-70">
                   <BellOff size={12} />
                   We prefer turning OFF notifications while studying for deep focus.
               </div>
           </div>
           
           <div className="text-center opacity-30 pt-4">
               <p className="text-[10px] text-slate-500">Zuaki OS v2.1 • Local Storage Active</p>
           </div>
       </div>

       {/* AI MODAL */}
       {selectedChapter && (
           <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
               <div className="bg-[#0b0f1a] border border-cyber-cyan/30 rounded-3xl w-full max-w-lg relative overflow-hidden shadow-[0_0_50px_rgba(0,243,255,0.5)] flex flex-col max-h-[90vh]">
                   
                   {/* Modal Header */}
                   <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                       <div className="flex items-center gap-3">
                           <div className="p-2 rounded-lg bg-cyber-purple/20 text-cyber-purple">
                               <Brain size={20} />
                           </div>
                           <div>
                               <h3 className="text-white font-bold text-lg">{selectedChapter.name}</h3>
                               <p className="text-xs text-slate-400 font-mono uppercase tracking-widest">AI Performance Analysis</p>
                           </div>
                       </div>
                       <button onClick={() => setSelectedChapter(null)} className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white">
                           <X size={20} />
                       </button>
                   </div>

                   {/* Modal Content */}
                   <div className="p-6 overflow-y-auto custom-scrollbar space-y-6">
                       {aiLoading ? (
                           <div className="flex flex-col items-center justify-center py-10 gap-4">
                               <Loader2 size={40} className="text-cyber-cyan animate-spin" />
                               <p className="text-slate-400 text-sm animate-pulse">Consulting Neural Network...</p>
                           </div>
                       ) : aiResult ? (
                           <>
                               {/* Section 1 */}
                               <div className="bg-white/5 border border-white/5 rounded-xl p-4">
                                   <h4 className="text-cyber-cyan font-bold text-sm uppercase tracking-widest mb-2 border-b border-white/5 pb-2">
                                       {aiResult.section1.title}
                                   </h4>
                                   <p className="text-slate-300 text-sm leading-relaxed">{aiResult.section1.content}</p>
                               </div>

                               {/* Section 2 */}
                               <div className={`border rounded-xl p-4 ${selectedChapter.status === 'WEAK' ? 'bg-red-500/5 border-red-500/20' : 'bg-green-500/5 border-green-500/20'}`}>
                                   <h4 className={`font-bold text-sm uppercase tracking-widest mb-2 border-b border-white/5 pb-2 ${selectedChapter.status === 'WEAK' ? 'text-red-400' : 'text-green-400'}`}>
                                       {aiResult.section2.title}
                                   </h4>
                                   <p className="text-slate-300 text-sm leading-relaxed">{aiResult.section2.content}</p>
                               </div>

                               {/* Section 3 (List) */}
                               <div className="bg-cyber-purple/5 border border-cyber-purple/20 rounded-xl p-4">
                                   <h4 className="text-cyber-purple font-bold text-sm uppercase tracking-widest mb-2 border-b border-white/5 pb-2">
                                       {aiResult.section3.title}
                                   </h4>
                                   <ul className="space-y-2">
                                       {aiResult.section3.content.map((step, idx) => (
                                           <li key={idx} className="flex gap-3 text-sm text-slate-300">
                                               <span className="w-5 h-5 rounded-full bg-cyber-purple/20 text-cyber-purple flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                                                   {idx + 1}
                                               </span>
                                               {step}
                                           </li>
                                       ))}
                                   </ul>
                               </div>
                           </>
                       ) : (
                           <div className="text-center text-red-400">Analysis failed.</div>
                       )}
                   </div>

                   {/* Modal Footer */}
                   <div className="p-4 bg-black/40 border-t border-white/5 text-center">
                       <p className="text-[10px] text-slate-500 flex items-center justify-center gap-2">
                           <Bell size={10} className="text-cyber-yellow" /> 
                           We recommend turning OFF notifications while studying for deep focus.
                       </p>
                   </div>
               </div>
           </div>
       )}
    </div>
  );
};
