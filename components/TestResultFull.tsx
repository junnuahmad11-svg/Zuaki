
import React, { useState } from 'react';
import { BarChart2, CheckCircle, XCircle, Clock, Award, ArrowRight, Share2, Layers, Zap, Brain, TrendingUp, AlertTriangle, MessageSquare, Bookmark, ShieldCheck, Star, MapPin } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import { TestResult, Question } from '../types';
import { getGenZResponse } from '../services/geminiService';

interface TestResultFullProps {
    result: TestResult;
    onExit: () => void;
}

export const TestResultFull: React.FC<TestResultFullProps> = ({ result, onExit }) => {
    const [tab, setTab] = useState<'OVERVIEW' | 'AI_INSIGHTS' | 'SOLUTIONS'>('OVERVIEW');
    const [explainingId, setExplainingId] = useState<string | null>(null);
    const [aiExplanations, setAiExplanations] = useState<Record<string, string>>({});

    const pieData = [
        { name: 'Correct', value: result.correctCount, color: '#22c55e' },
        { name: 'Wrong', value: result.wrongCount, color: '#ef4444' },
        { name: 'Skipped', value: result.skippedCount, color: '#64748b' }
    ];

    const handleExplainAI = async (q: Question, userAnswer: any) => {
        setExplainingId(q.id);
        const prompt = `Act as Zuaki AI. Deep dive explain this JEE PYQ.
        Q: ${q.text}
        User Answer: ${userAnswer}, Correct Answer: ${q.correctAnswer}.
        Focus on concept trap and formula derivation.`;
        try {
            const resp = await getGenZResponse(prompt);
            setAiExplanations(prev => ({ ...prev, [q.id]: resp }));
        } catch (e) { setAiExplanations(prev => ({ ...prev, [q.id]: "Sync failed. Try again." })); }
        finally { setExplainingId(null); }
    };

    return (
        <div className="h-full w-full bg-[#020617] overflow-y-auto custom-scrollbar p-6">
            <div className="max-w-6xl mx-auto pb-24">
                
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
                    <div>
                        <h1 className="text-3xl font-display font-bold text-white uppercase tracking-widest flex items-center gap-3">
                            <ShieldCheck size={32} className="text-green-500" /> Mission Summary
                        </h1>
                        <p className="text-slate-400 font-mono text-sm">{result.testTitle}</p>
                    </div>
                    <div className="flex gap-4">
                        <div className="bg-cyber-yellow/10 border border-cyber-yellow/30 p-3 rounded-2xl flex items-center gap-3">
                             <Zap className="text-cyber-yellow" fill="currentColor" />
                             <div>
                                 <p className="text-[10px] text-slate-500 uppercase font-bold">XP Gained</p>
                                 <p className="text-white font-mono font-bold">+{result.xpEarned || 0}</p>
                             </div>
                        </div>
                        <button onClick={onExit} className="px-8 py-3 bg-cyber-cyan text-black font-bold rounded-xl hover:shadow-[0_0_15px_#00f3ff]">EXIT HUB</button>
                    </div>
                </div>

                <div className="flex bg-white/5 p-1 rounded-xl border border-white/10 w-fit mb-8">
                    <button onClick={() => setTab('OVERVIEW')} className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${tab === 'OVERVIEW' ? 'bg-white/10 text-white' : 'text-slate-500'}`}>ANALYSIS</button>
                    <button onClick={() => setTab('SOLUTIONS')} className={`px-6 py-2 rounded-lg text-xs font-bold transition-all ${tab === 'SOLUTIONS' ? 'bg-white/10 text-white' : 'text-slate-500'}`}>SOLUTIONS</button>
                </div>

                {tab === 'OVERVIEW' && (
                    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="glass-panel p-6 rounded-2xl border border-cyber-cyan/30 text-center">
                                <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mb-1">Raw Score</p>
                                <h2 className="text-5xl font-display font-bold text-white">{result.score}<span className="text-lg text-slate-600">/300</span></h2>
                            </div>
                            <div className="glass-panel p-6 rounded-2xl border border-cyber-purple/30 text-center">
                                <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mb-1">Percentile</p>
                                <h2 className="text-4xl font-display font-bold text-white">{result.percentile?.toFixed(2) || '0.00'}</h2>
                            </div>
                            <div className="glass-panel p-6 rounded-2xl border border-cyber-yellow/30 text-center relative overflow-hidden col-span-2">
                                <p className="text-slate-500 text-[10px] uppercase font-bold tracking-widest mb-1">Predicted Rank Range</p>
                                <h2 className="text-4xl font-display font-bold text-white">#{result.rankRange || '---'}</h2>
                                <p className="text-[10px] text-green-400 uppercase font-mono mt-1 flex items-center justify-center gap-1"><MapPin size={10}/> Data-Backed Estimation</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2 glass-panel p-8 rounded-3xl border border-white/10 flex flex-col items-center justify-center">
                                <div className="w-full flex justify-between items-center mb-8">
                                    <h3 className="text-white font-bold uppercase tracking-widest text-sm flex items-center gap-2">
                                        <TrendingUp size={18} className="text-cyber-cyan" /> Admission Probability
                                    </h3>
                                    <span className="text-[10px] text-slate-500 font-mono">Historical Calibration</span>
                                </div>
                                <div className="w-full space-y-6">
                                    <ProbMeter label="Top NIT (CS)" prob={result.percentile ? (result.percentile > 99.5 ? 90 : result.percentile > 98.5 ? 40 : 5) : 0} color="#00f3ff" />
                                    <ProbMeter label="General NIT Admission" prob={result.percentile ? (result.percentile > 97.5 ? 95 : result.percentile > 95 ? 60 : 20) : 0} color="#9d00ff" />
                                    <ProbMeter label="JEE Advanced Qualification" prob={result.percentile ? (result.percentile > 90 ? 100 : result.percentile > 85 ? 70 : 10) : 0} color="#ff003c" />
                                </div>
                            </div>
                            
                            <div className="glass-panel p-8 rounded-3xl border border-white/10 flex flex-col items-center">
                                <h3 className="text-white font-bold mb-6 w-full font-display uppercase tracking-widest text-center">Accuracy Matrix</h3>
                                <div className="h-56 w-56 relative">
                                    <ResponsiveContainer>
                                        <PieChart>
                                            <Pie data={pieData} innerRadius={70} outerRadius={90} paddingAngle={5} dataKey="value">
                                                {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                                            </Pie>
                                        </PieChart>
                                    </ResponsiveContainer>
                                    <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                                        <span className="text-3xl font-bold">{result.accuracy}%</span>
                                        <span className="text-[10px] text-slate-500 uppercase tracking-widest">Efficiency</span>
                                    </div>
                                </div>
                                <div className="mt-8 grid grid-cols-3 gap-4 w-full">
                                    <div className="text-center"><p className="text-[10px] text-green-500 font-bold">{result.correctCount}</p><p className="text-[8px] text-slate-500">CORRECT</p></div>
                                    <div className="text-center"><p className="text-[10px] text-red-500 font-bold">{result.wrongCount}</p><p className="text-[8px] text-slate-500">WRONG</p></div>
                                    <div className="text-center"><p className="text-[10px] text-slate-400 font-bold">{result.skippedCount}</p><p className="text-[8px] text-slate-500">SKIPPED</p></div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {tab === 'SOLUTIONS' && (
                    <div className="space-y-4 animate-in fade-in">
                        {result.questions?.map((q, i) => {
                            const uAns = result.answers[q.id];
                            const isCorrect = uAns === q.correctAnswer;
                            const isSkipped = uAns === undefined || uAns === '';

                            return (
                                <div key={q.id} className="glass-panel p-8 rounded-[32px] border border-white/5 hover:border-white/10 transition-all">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs font-bold text-slate-500 uppercase border border-white/10 px-2 py-1 rounded">Q{i+1}</span>
                                            <span className="text-xs font-bold text-cyber-purple uppercase">{q.subject} • {q.chapter}</span>
                                            {q.tag && <span className="text-[8px] font-black uppercase bg-red-600 text-white px-2 py-0.5 rounded animate-pulse">{q.tag}</span>}
                                        </div>
                                        <div className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase ${isCorrect ? 'bg-green-500/10 text-green-500 border border-green-500/20' : isSkipped ? 'bg-slate-500/10 text-slate-500 border border-white/10' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}>
                                            {isCorrect ? 'SUCCESS' : isSkipped ? 'SKIPPED' : 'FAILED'}
                                        </div>
                                    </div>

                                    <p className="text-white text-base leading-relaxed mb-6 font-medium">{q.text}</p>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                        <div className="p-4 rounded-2xl bg-black/40 border border-white/5">
                                            <p className="text-[8px] text-slate-500 uppercase mb-2">User Protocol Input</p>
                                            <p className={`text-sm font-bold ${isCorrect ? 'text-green-500' : 'text-red-500'}`}>{isSkipped ? '---' : q.options?.[uAns as number] || uAns}</p>
                                        </div>
                                        <div className="p-4 rounded-2xl bg-green-500/5 border border-green-500/20">
                                            <p className="text-[8px] text-green-700 uppercase mb-2">NTA Official Key</p>
                                            <p className="text-sm font-bold text-green-500">{q.options?.[q.correctAnswer as number] || q.correctAnswer}</p>
                                        </div>
                                    </div>

                                    <div className="p-6 bg-[#0b0f1a] rounded-3xl border border-white/5 border-l-4 border-l-cyber-cyan mb-4">
                                        <h4 className="text-xs font-bold text-cyber-cyan uppercase mb-3 flex items-center gap-2"><CheckCircle size={14}/> Full Solution & Steps</h4>
                                        <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap mb-4">{q.explanation}</p>
                                        <div className="p-4 bg-white/5 rounded-xl text-xs text-slate-400 italic font-mono">
                                            {q.solutionSteps}
                                        </div>
                                        <div className="mt-6 flex flex-wrap gap-2">
                                            {q.formulaUsed?.map(f => <span key={f} className="text-[10px] font-mono font-bold bg-cyber-purple/20 text-cyber-purple px-3 py-1 rounded-full border border-cyber-purple/30">{f}</span>)}
                                        </div>
                                    </div>

                                    {aiExplanations[q.id] ? (
                                        <div className="p-6 bg-cyber-purple/5 border border-cyber-purple/20 rounded-3xl animate-in slide-in-from-top-2">
                                            <h4 className="text-xs font-bold text-cyber-purple uppercase mb-3 flex items-center gap-2"><Brain size={16}/> Neural Link Insight</h4>
                                            <div className="text-slate-400 text-sm leading-relaxed prose prose-invert max-w-none">
                                                {aiExplanations[q.id]}
                                            </div>
                                        </div>
                                    ) : (
                                        <button onClick={() => handleExplainAI(q, uAns)} className="w-full py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-2xl text-[10px] font-bold text-cyber-purple uppercase tracking-widest transition-all flex items-center justify-center gap-2">
                                            <MessageSquare size={14} /> Request AI Synthesis
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                )}

            </div>
        </div>
    );
};

const ProbMeter = ({ label, prob, color }: any) => (
    <div className="w-full">
        <div className="flex justify-between text-[10px] uppercase font-bold mb-1.5">
            <span className="text-slate-400">{label}</span>
            <span style={{ color }}>{prob}% Probability</span>
        </div>
        <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden border border-white/5">
            <div 
                className="h-full transition-all duration-1000 ease-out shadow-[0_0_10px_currentColor]" 
                style={{ width: `${prob}%`, backgroundColor: color, color: color }}
            ></div>
        </div>
    </div>
);
