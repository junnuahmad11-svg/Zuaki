
import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Settings, BarChart2, BookOpen, Check, History, Zap, Clock, Brain } from 'lucide-react';
import { timerService, TimerState } from '../services/timerService';
import { QuantumConfig } from '../types';
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip } from 'recharts';

const MOTIVATIONAL_QUOTES = [
    "Focus is the key to the universe.",
    "One equation at a time.",
    "Your future self is watching.",
    "Pain of discipline > Pain of regret.",
    "Quantum leaps require quantum focus."
];

export const ZuakiNeoTimer: React.FC = () => { // Kept export name same to avoid breaking imports in App.tsx
    const [timer, setTimer] = useState<TimerState>(timerService.getState());
    const [config, setConfig] = useState<QuantumConfig>(timerService.getConfig());
    const [view, setView] = useState<'TIMER' | 'STATS' | 'SETTINGS'>('TIMER');
    const [quote, setQuote] = useState(MOTIVATIONAL_QUOTES[0]);
    const [history, setHistory] = useState(timerService.getHistory());

    useEffect(() => {
        const unsub = timerService.subscribe((state) => {
            setTimer(state);
        });
        // Rotate quotes every minute
        const quoteInterval = setInterval(() => {
            setQuote(MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)]);
        }, 60000);

        return () => {
            unsub();
            clearInterval(quoteInterval);
        };
    }, []);

    // Helper for time formatting
    const formatTime = (s: number) => {
        const m = Math.floor(s / 60).toString().padStart(2, '0');
        const sec = (s % 60).toString().padStart(2, '0');
        return `${m}:${sec}`;
    };

    // Circular Progress Calc
    const radius = 120;
    const circumference = 2 * Math.PI * radius;
    let progress = 0;
    if (timer.mode === 'STOPWATCH') {
        progress = 1; // Full circle
    } else {
        progress = timer.duration > 0 ? (timer.timeLeft / timer.duration) : 0;
    }
    const strokeDashoffset = circumference - progress * circumference;

    // Theme Colors
    const getThemeColor = () => {
        if (config.theme === 'PURPLE') return '#9d00ff';
        if (config.theme === 'GOLD') return '#fcee0a';
        return '#00f3ff'; // CYAN default
    };
    const accent = getThemeColor();

    // Chart Data Preparation
    const chartData = React.useMemo(() => {
        const last7Days = Array.from({length: 7}, (_, i) => {
            const d = new Date();
            d.setDate(d.getDate() - (6 - i));
            return d.toLocaleDateString('en-US', { weekday: 'short' });
        });
        
        const dataMap: Record<string, number> = {};
        history.forEach(h => {
            const dateStr = new Date(h.timestamp).toLocaleDateString('en-US', { weekday: 'short' });
            if (last7Days.includes(dateStr)) {
                dataMap[dateStr] = (dataMap[dateStr] || 0) + (h.duration / 60); // minutes
            }
        });

        return last7Days.map(day => ({ name: day, minutes: Math.round(dataMap[day] || 0) }));
    }, [history, view]); // Recompute when history or view changes

    return (
        <div className="h-full w-full bg-[#020617] flex flex-col relative overflow-hidden">
            {/* Background Ambience */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#0f172a_0%,_#020617_80%)] pointer-events-none"></div>
            <div 
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[120px] pointer-events-none transition-colors duration-1000 opacity-20"
                style={{ backgroundColor: accent }}
            ></div>

            {/* Header Tabs */}
            <div className="flex items-center justify-center pt-6 pb-2 z-20 gap-2">
                <button onClick={() => setView('TIMER')} className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${view === 'TIMER' ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-white'}`}>TIMER</button>
                <button onClick={() => setView('STATS')} className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${view === 'STATS' ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-white'}`}>STATS</button>
                <button onClick={() => setView('SETTINGS')} className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${view === 'SETTINGS' ? 'bg-white/10 text-white' : 'text-slate-500 hover:text-white'}`}>CONFIG</button>
            </div>

            {/* MAIN TIMER VIEW */}
            {view === 'TIMER' && (
                <div className="flex-1 flex flex-col items-center justify-center relative z-10 p-6 animate-in fade-in zoom-in-95 duration-300">
                    
                    {/* Task Pill */}
                    <div className="mb-8 flex items-center gap-2 bg-white/5 border border-white/10 px-4 py-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer group" onClick={() => {
                        const s = prompt("Subject?", timer.subject);
                        const t = prompt("Task description?", timer.task);
                        if(s) timerService.setTask(s, t || '');
                    }}>
                        <div className="w-2 h-2 rounded-full animate-pulse" style={{ backgroundColor: accent }}></div>
                        <span className="text-sm font-bold text-white">{timer.subject}</span>
                        {timer.task && <span className="text-xs text-slate-400 border-l border-white/20 pl-2 ml-1">{timer.task}</span>}
                    </div>

                    {/* Timer Ring */}
                    <div className="relative w-80 h-80 flex items-center justify-center mb-10">
                        <svg className="absolute inset-0 w-full h-full -rotate-90">
                            <circle cx="160" cy="160" r={radius} stroke="rgba(255,255,255,0.05)" strokeWidth="8" fill="none" />
                            <circle 
                                cx="160" cy="160" r={radius} 
                                stroke={accent} 
                                strokeWidth="8" 
                                fill="none" 
                                strokeDasharray={circumference} 
                                strokeDashoffset={strokeDashoffset}
                                strokeLinecap="round"
                                className="transition-all duration-1000 ease-linear"
                                style={{ filter: `drop-shadow(0 0 15px ${accent})` }}
                            />
                        </svg>
                        
                        <div className="text-center z-10">
                            <div className="text-7xl font-mono font-bold text-white tracking-widest drop-shadow-2xl">
                                {formatTime(timer.timeLeft)}
                            </div>
                            <div className="text-xs uppercase tracking-[0.3em] mt-3 font-bold text-slate-400">
                                {timer.mode.replace('_', ' ')}
                            </div>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="flex items-center gap-8 mb-8">
                        <button onClick={() => timerService.reset()} className="p-4 rounded-full border border-white/10 bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all">
                            <RotateCcw size={24} />
                        </button>
                        
                        <button 
                            onClick={() => timer.status === 'RUNNING' ? timerService.pause() : timerService.start()}
                            className="w-24 h-24 rounded-[32px] flex items-center justify-center shadow-[0_0_40px_rgba(0,0,0,0.3)] transition-all hover:scale-105 active:scale-95 text-black"
                            style={{ backgroundColor: accent, boxShadow: `0 0 30px ${accent}40` }}
                        >
                            {timer.status === 'RUNNING' ? <Pause size={40} fill="currentColor" /> : <Play size={40} fill="currentColor" className="ml-1" />}
                        </button>

                        <div className="relative group">
                            <button className="p-4 rounded-full border border-white/10 bg-white/5 text-slate-400 hover:text-white hover:bg-white/10 transition-all">
                                <Zap size={24} />
                            </button>
                            {/* Quick Mode Switcher Hover */}
                            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4 bg-[#0b0f1a] border border-white/10 p-2 rounded-xl flex flex-col gap-1 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity shadow-xl">
                                <button onClick={() => timerService.setMode('FOCUS')} className="px-3 py-1.5 hover:bg-white/10 rounded text-xs text-white whitespace-nowrap text-left">Focus (25m)</button>
                                <button onClick={() => timerService.setMode('SHORT_BREAK')} className="px-3 py-1.5 hover:bg-white/10 rounded text-xs text-white whitespace-nowrap text-left">Short Break</button>
                                <button onClick={() => timerService.setMode('LONG_BREAK')} className="px-3 py-1.5 hover:bg-white/10 rounded text-xs text-white whitespace-nowrap text-left">Long Break</button>
                                <button onClick={() => timerService.setMode('STOPWATCH')} className="px-3 py-1.5 hover:bg-white/10 rounded text-xs text-white whitespace-nowrap text-left">Stopwatch</button>
                            </div>
                        </div>
                    </div>

                    <p className="text-slate-500 text-xs font-mono italic max-w-xs text-center animate-pulse">
                        "{quote}"
                    </p>
                </div>
            )}

            {/* STATS VIEW */}
            {view === 'STATS' && (
                <div className="flex-1 p-6 overflow-y-auto custom-scrollbar relative z-10 animate-in slide-in-from-right-8">
                    <div className="max-w-2xl mx-auto space-y-6">
                        <div className="glass-panel p-6 rounded-3xl border border-white/10">
                            <h3 className="text-white font-bold mb-6 flex items-center gap-2"><BarChart2 size={18} style={{ color: accent }}/> Weekly Focus</h3>
                            <div className="h-64 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={chartData}>
                                        <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#64748b', fontSize: 12}} dy={10} />
                                        <Tooltip 
                                            contentStyle={{backgroundColor: '#0b0f1a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', color: '#fff'}}
                                            cursor={{fill: 'rgba(255,255,255,0.05)'}}
                                        />
                                        <Bar dataKey="minutes" fill={accent} radius={[4, 4, 0, 0]} barSize={30} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="glass-panel rounded-3xl border border-white/10 overflow-hidden">
                            <div className="p-4 bg-white/5 border-b border-white/5">
                                <h3 className="text-white font-bold text-sm flex items-center gap-2"><History size={16}/> Session Log</h3>
                            </div>
                            <div className="max-h-60 overflow-y-auto custom-scrollbar">
                                {history.length === 0 ? (
                                    <div className="p-8 text-center text-slate-500 text-sm">No recent sessions.</div>
                                ) : (
                                    history.map((h, i) => (
                                        <div key={i} className="p-4 border-b border-white/5 flex justify-between items-center hover:bg-white/5 transition-colors">
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-white font-bold text-sm">{h.subject}</span>
                                                    <span className="text-[10px] bg-white/10 px-1.5 rounded text-slate-300">{h.mode}</span>
                                                </div>
                                                <div className="text-xs text-slate-500 mt-0.5">{new Date(h.timestamp).toLocaleString()}</div>
                                            </div>
                                            <div className="text-right">
                                                <div className="text-white font-mono font-bold">{(h.duration/60).toFixed(0)}m</div>
                                                <div className="text-[10px] text-yellow-500">+{h.xpEarned} XP</div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* SETTINGS VIEW */}
            {view === 'SETTINGS' && (
                <div className="flex-1 p-6 overflow-y-auto custom-scrollbar relative z-10 animate-in slide-in-from-right-8">
                    <div className="max-w-md mx-auto space-y-6">
                        <div className="glass-panel p-6 rounded-3xl border border-white/10 space-y-6">
                            <h3 className="text-white font-bold text-lg mb-4 flex items-center gap-2"><Settings size={20}/> Configuration</h3>
                            
                            <div>
                                <label className="text-xs text-slate-400 uppercase tracking-widest mb-3 block">Durations (Minutes)</label>
                                <div className="grid grid-cols-3 gap-3">
                                    <div>
                                        <span className="text-[10px] text-slate-500 block mb-1">Focus</span>
                                        <input 
                                            type="number" 
                                            value={config.focusDuration}
                                            onChange={(e) => timerService.updateConfig({ focusDuration: Number(e.target.value) })}
                                            className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white text-center"
                                        />
                                    </div>
                                    <div>
                                        <span className="text-[10px] text-slate-500 block mb-1">Short Break</span>
                                        <input 
                                            type="number" 
                                            value={config.shortBreak}
                                            onChange={(e) => timerService.updateConfig({ shortBreak: Number(e.target.value) })}
                                            className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white text-center"
                                        />
                                    </div>
                                    <div>
                                        <span className="text-[10px] text-slate-500 block mb-1">Long Break</span>
                                        <input 
                                            type="number" 
                                            value={config.longBreak}
                                            onChange={(e) => timerService.updateConfig({ longBreak: Number(e.target.value) })}
                                            className="w-full bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-white text-center"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="text-xs text-slate-400 uppercase tracking-widest mb-3 block">Appearance</label>
                                <div className="flex gap-3">
                                    <button onClick={() => timerService.updateConfig({ theme: 'CYAN' })} className={`flex-1 py-3 rounded-xl border ${config.theme === 'CYAN' ? 'bg-cyan-500/20 border-cyan-500 text-cyan-500' : 'bg-white/5 border-white/10 text-slate-400'}`}>Cyan</button>
                                    <button onClick={() => timerService.updateConfig({ theme: 'PURPLE' })} className={`flex-1 py-3 rounded-xl border ${config.theme === 'PURPLE' ? 'bg-purple-500/20 border-purple-500 text-purple-500' : 'bg-white/5 border-white/10 text-slate-400'}`}>Purple</button>
                                    <button onClick={() => timerService.updateConfig({ theme: 'GOLD' })} className={`flex-1 py-3 rounded-xl border ${config.theme === 'GOLD' ? 'bg-yellow-500/20 border-yellow-500 text-yellow-500' : 'bg-white/5 border-white/10 text-slate-400'}`}>Gold</button>
                                </div>
                            </div>

                            <div>
                                <label className="text-xs text-slate-400 uppercase tracking-widest mb-3 block">System</label>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-white">Sound Alerts</span>
                                        <input type="checkbox" checked={config.soundEnabled} onChange={(e) => timerService.updateConfig({ soundEnabled: e.target.checked })} className="accent-cyber-cyan w-5 h-5"/>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-sm text-white">Desktop Notifications</span>
                                        <input type="checkbox" checked={config.notificationsEnabled} onChange={(e) => timerService.updateConfig({ notificationsEnabled: e.target.checked })} className="accent-cyber-cyan w-5 h-5"/>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
