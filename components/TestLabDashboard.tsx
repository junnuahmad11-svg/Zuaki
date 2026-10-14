
import React, { useState, useEffect } from 'react';
import { Play, Layers, Zap, Clock, Trophy, BarChart2, ChevronRight, History, Brain, Target, AlertTriangle, FileText, Sparkles, BookOpen } from 'lucide-react';
import { ViewState, TestResult } from '../types';
import { firebase } from '../services/backend';
import { statsService } from '../services/statsService';

interface TestLabDashboardProps {
    onStartTest: (config: any) => void;
    onViewHistory: (result: TestResult) => void;
}

export const TestLabDashboard: React.FC<TestLabDashboardProps> = ({ onStartTest, onViewHistory }) => {
    const [history, setHistory] = useState<TestResult[]>([]);
    const [streak, setStreak] = useState(0);
    const [xp, setXp] = useState(0);

    useEffect(() => {
        const load = async () => {
            const data = await firebase.firestore().tests.getHistory();
            setHistory(data.slice(0, 3)); // Top 3
            
            const stats = statsService.getStats();
            setStreak(stats.dailyStreak);
            setXp(stats.xp);

            // Check if there is a pending JEE 2025 selection
            const pendingConfig = localStorage.getItem('zuaki_selected_test_config');
            if (pendingConfig) {
                const conf = JSON.parse(pendingConfig);
                if (conf.type === 'JEE_2025') {
                    localStorage.removeItem('zuaki_selected_test_config'); // Consume
                    const generated = await firebase.firestore().tests.generateJEE2025Test(conf.shift);
                    onStartTest(generated); // Pass the full config object, not just params
                }
            }
        };
        load();
    }, []);

    const handleQuickStart = (type: string, sub?: string) => {
        if (type === 'AI_AUTO') {
            // Simulate AI generation delay
            const confirm = window.confirm("Zuaki AI will construct a 75-question mock based on your weak areas. Proceed?");
            if(confirm) onStartTest({ type: 'MOCK', count: 75 });
        } else if (type === 'NTA' || type === 'PYQ') {
            onStartTest({ type: 'MOCK', count: 75 });
        } else if (type === 'WEAK') {
            onStartTest({ type: 'CHAPTER', count: 30, subject: 'Physics' }); // Mock subject
        } else {
            onStartTest({ type, count: 75 });
        }
    };

    return (
        <div className="h-full w-full bg-[#020617] p-6 overflow-y-auto custom-scrollbar relative">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#0f172a_0%,_#020617_70%)] pointer-events-none"></div>
            
            <div className="max-w-7xl mx-auto relative z-10">
                
                {/* Header & Stats */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
                    <div>
                        <h1 className="text-4xl font-display font-bold text-white uppercase tracking-widest flex items-center gap-3">
                            <span className="text-cyber-cyan drop-shadow-[0_0_10px_rgba(0,243,255,0.5)]">ZUAKI</span> MOCK TESTS
                        </h1>
                        <p className="text-slate-400 text-sm font-mono mt-2 flex items-center gap-2">
                            <Brain size={14} className="text-cyber-purple"/> Neural Exam Engine v4.0
                        </p>
                    </div>
                    
                    <div className="flex gap-4">
                        <div className="bg-white/5 border border-white/10 rounded-2xl px-5 py-2 flex items-center gap-3">
                            <Zap size={20} className="text-cyber-yellow fill-current" />
                            <div>
                                <p className="text-[10px] text-slate-400 uppercase tracking-widest">Streak</p>
                                <p className="text-white font-bold">{streak} Days</p>
                            </div>
                        </div>
                        <div className="bg-white/5 border border-white/10 rounded-2xl px-5 py-2 flex items-center gap-3">
                            <Trophy size={20} className="text-cyber-pink" />
                            <div>
                                <p className="text-[10px] text-slate-400 uppercase tracking-widest">Rank XP</p>
                                <p className="text-white font-bold">{xp.toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* AI & Premium Features */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
                    {/* Auto Generate */}
                    <div 
                        onClick={() => handleQuickStart('AI_AUTO')}
                        className="glass-panel p-8 rounded-3xl border border-cyber-purple/30 bg-cyber-purple/5 hover:bg-cyber-purple/10 relative overflow-hidden group cursor-pointer transition-all hover:scale-[1.01]"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-cyber-purple/20 rounded-full blur-[80px] -mr-20 -mt-20 group-hover:bg-cyber-purple/30 transition-all"></div>
                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-cyber-purple/20 rounded-2xl text-cyber-purple border border-cyber-purple/30">
                                    <Sparkles size={32} />
                                </div>
                                <span className="px-3 py-1 bg-cyber-purple text-white text-[10px] font-bold rounded-full uppercase tracking-widest animate-pulse">AI Recommended</span>
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">AI Auto-Generate Test</h2>
                            <p className="text-slate-300 text-sm mb-6 max-w-sm">
                                Construct a 75-question mock based on your recent mistakes, weak chapters, and NTA trends.
                            </p>
                            <button className="px-6 py-3 bg-white text-black font-bold rounded-xl flex items-center gap-2 group-hover:shadow-[0_0_20px_rgba(255,255,255,0.4)] transition-all">
                                <Play size={18} fill="currentColor" /> Generate Now
                            </button>
                        </div>
                    </div>

                    {/* Weakness Repair */}
                    <div 
                        onClick={() => handleQuickStart('WEAK')}
                        className="glass-panel p-8 rounded-3xl border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 relative overflow-hidden group cursor-pointer transition-all hover:scale-[1.01]"
                    >
                        <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 rounded-full blur-[80px] -mr-20 -mt-20 group-hover:bg-red-500/20 transition-all"></div>
                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 bg-red-500/20 rounded-2xl text-red-500 border border-red-500/30">
                                    <Target size={32} />
                                </div>
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">Weakness Repair</h2>
                            <p className="text-slate-300 text-sm mb-6 max-w-sm">
                                Focused test on "Rotational Motion" and "Calculus" based on your last 3 attempts.
                            </p>
                            <button className="px-6 py-3 bg-red-600 text-white font-bold rounded-xl flex items-center gap-2 shadow-[0_0_15px_#dc2626] transition-all">
                                <Zap size={18} fill="currentColor" /> Fix Weak Areas
                            </button>
                        </div>
                    </div>
                </div>

                {/* Test Banks */}
                <h3 className="text-white font-bold text-lg mb-6 pl-1 border-l-4 border-cyber-cyan ml-1">Standard Test Banks</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
                    <BankCard title="Full Syllabus Mock" sub="90 Qs • 3 Hrs • JEE Pattern" icon={Layers} color="cyan" onClick={() => handleQuickStart('MOCK')} />
                    <BankCard title="NTA Abhyas" sub="Official NTA Question Bank" icon={BookOpen} color="green" onClick={() => handleQuickStart('NTA')} />
                    <BankCard title="PYQ Archives" sub="2019-2024 Papers" icon={Clock} color="yellow" onClick={() => handleQuickStart('PYQ')} />
                    <BankCard title="Chapter Wise" sub="Custom Selection" icon={BarChart2} color="pink" onClick={() => handleQuickStart('CHAPTER', 'Physics')} />
                </div>

                {/* Recent History Table */}
                <div className="glass-panel rounded-3xl border border-white/10 overflow-hidden">
                    <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/5">
                        <h3 className="text-white font-bold flex items-center gap-2"><History size={18} className="text-slate-400"/> Recent Attempts</h3>
                        <button className="text-xs text-cyber-cyan hover:underline">View All History</button>
                    </div>
                    {history.length === 0 ? (
                        <div className="p-12 text-center">
                            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                                <AlertTriangle size={32} className="text-slate-600" />
                            </div>
                            <p className="text-slate-500 text-sm">No test history available. Start your first mock!</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-white/5">
                            {history.map((h, i) => (
                                <div key={i} className="p-5 flex items-center justify-between hover:bg-white/5 transition-colors group">
                                    <div className="flex items-center gap-5">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg text-black shadow-lg ${h.percentile > 90 ? 'bg-green-500 shadow-[0_0_15px_#22c55e]' : h.percentile > 75 ? 'bg-yellow-500' : 'bg-red-500'}`}>
                                            {h.score}
                                        </div>
                                        <div>
                                            <h4 className="text-white font-bold text-base group-hover:text-cyber-cyan transition-colors">{h.testTitle}</h4>
                                            <div className="flex items-center gap-3 text-xs text-slate-400 mt-1">
                                                <span>{new Date(h.date).toLocaleDateString()}</span>
                                                <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
                                                <span>{h.accuracy}% Accuracy</span>
                                                <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
                                                <span className="text-cyber-purple">{h.percentile.toFixed(1)} %ile</span>
                                            </div>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => onViewHistory(h)}
                                        className="px-5 py-2.5 border border-white/10 rounded-xl text-xs font-bold text-white hover:bg-white/10 hover:border-cyber-cyan transition-all flex items-center gap-2"
                                    >
                                        Analysis <ChevronRight size={14} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

const BankCard = ({ title, sub, icon: Icon, color, onClick }: any) => {
    const colorMap: any = {
        cyan: 'text-cyber-cyan bg-cyber-cyan/10 border-cyber-cyan/30 group-hover:shadow-[0_0_20px_#00f3ff]',
        green: 'text-green-400 bg-green-400/10 border-green-400/30 group-hover:shadow-[0_0_20px_#4ade80]',
        yellow: 'text-cyber-yellow bg-cyber-yellow/10 border-cyber-yellow/30 group-hover:shadow-[0_0_20px_#fcee0a]',
        pink: 'text-cyber-pink bg-cyber-pink/10 border-cyber-pink/30 group-hover:shadow-[0_0_20px_#ff003c]'
    };

    return (
        <button 
            onClick={onClick}
            className="w-full text-left glass-panel p-6 rounded-2xl border border-white/10 hover:bg-white/5 transition-all group flex flex-col items-start gap-4 relative overflow-hidden"
        >
            <div className={`p-3 rounded-xl border transition-all duration-300 ${colorMap[color]}`}>
                <Icon size={24} />
            </div>
            <div>
                <h3 className="text-white font-bold text-lg leading-tight group-hover:text-white transition-colors">{title}</h3>
                <p className="text-slate-400 text-xs mt-1">{sub}</p>
            </div>
            <div className={`absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0 ${color === 'cyan' ? 'text-cyber-cyan' : color === 'green' ? 'text-green-400' : color === 'yellow' ? 'text-cyber-yellow' : 'text-cyber-pink'}`}>
                <ChevronRight size={20} />
            </div>
        </button>
    );
};
