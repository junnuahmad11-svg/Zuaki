
import React from 'react';
import { BarChart2, CheckCircle, XCircle, Clock, Award, ArrowRight } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, Tooltip, CartesianGrid } from 'recharts';
import { TestResult } from '../types';

interface TestAnalysisProps {
    result: TestResult;
    onExit: () => void;
}

export const TestAnalysis: React.FC<TestAnalysisProps> = ({ result, onExit }) => {
    
    // Mock Subject Breakdown
    const subjectData = [
        { name: 'Physics', score: 35, total: 100 },
        { name: 'Chemistry', score: 60, total: 100 },
        { name: 'Maths', score: 45, total: 100 },
    ];

    return (
        <div className="h-full w-full bg-[#020617] overflow-y-auto custom-scrollbar p-6">
            <div className="max-w-5xl mx-auto">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-display font-bold text-white uppercase tracking-widest flex items-center gap-3">
                        <BarChart2 size={32} className="text-cyber-cyan" /> Performance Report
                    </h1>
                    <button onClick={onExit} className="px-6 py-2 border border-white/10 rounded-xl text-slate-400 hover:text-white hover:bg-white/5">
                        Back to Hub
                    </button>
                </div>

                {/* Top Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div className="glass-panel p-6 rounded-2xl border border-cyber-cyan/30 text-center">
                        <p className="text-slate-400 text-xs uppercase tracking-widest mb-2">Total Score</p>
                        <h2 className="text-5xl font-display font-bold text-white drop-shadow-[0_0_15px_rgba(0,243,255,0.5)]">
                            {result.score} <span className="text-lg text-slate-500 font-sans">/ {result.totalMarks}</span>
                        </h2>
                    </div>
                    <div className="glass-panel p-6 rounded-2xl border border-white/10 text-center">
                        <p className="text-slate-400 text-xs uppercase tracking-widest mb-2">Percentile</p>
                        <h2 className="text-4xl font-bold text-white">94.2%</h2>
                        <p className="text-xs text-green-400 mt-1">Top 6%</p>
                    </div>
                    <div className="glass-panel p-6 rounded-2xl border border-white/10 text-center">
                        <p className="text-slate-400 text-xs uppercase tracking-widest mb-2">Global Rank</p>
                        <h2 className="text-4xl font-bold text-cyber-yellow">#421</h2>
                    </div>
                    <div className="glass-panel p-6 rounded-2xl border border-white/10 flex flex-col justify-center gap-2">
                        <div className="flex justify-between text-xs"><span className="text-green-400 flex gap-2"><CheckCircle size={14}/> Correct</span> <span>{result.correctCount}</span></div>
                        <div className="flex justify-between text-xs"><span className="text-red-400 flex gap-2"><XCircle size={14}/> Wrong</span> <span>{result.wrongCount}</span></div>
                        <div className="flex justify-between text-xs"><span className="text-slate-400 flex gap-2"><Clock size={14}/> Skipped</span> <span>{result.skippedCount}</span></div>
                    </div>
                </div>

                {/* Subject Breakdown Chart */}
                <div className="glass-panel p-6 rounded-2xl border border-white/10 mb-8">
                    <h3 className="text-white font-bold mb-6">Subject Breakdown</h3>
                    <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={subjectData} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
                                <XAxis type="number" domain={[0, 100]} hide />
                                <Tooltip 
                                    cursor={{fill: 'rgba(255,255,255,0.05)'}}
                                    contentStyle={{backgroundColor: '#000', border: '1px solid #333', borderRadius: '8px'}} 
                                />
                                <Bar dataKey="score" fill="#00f3ff" barSize={20} radius={[0, 4, 4, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Detailed Analysis Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="glass-panel p-6 rounded-2xl border border-red-500/20">
                        <h3 className="text-red-400 font-bold mb-4 uppercase tracking-widest text-xs flex items-center gap-2">
                            <XCircle size={16} /> Weak Areas
                        </h3>
                        <div className="space-y-3">
                            {['Rotational Motion', 'Ionic Equilibrium', 'Complex Numbers'].map(topic => (
                                <div key={topic} className="flex justify-between items-center p-3 bg-red-500/5 rounded-lg border border-red-500/10">
                                    <span className="text-slate-200 text-sm">{topic}</span>
                                    <span className="text-xs text-red-400 font-bold">-25% Accuracy</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="glass-panel p-6 rounded-2xl border border-green-500/20">
                        <h3 className="text-green-400 font-bold mb-4 uppercase tracking-widest text-xs flex items-center gap-2">
                            <CheckCircle size={16} /> Strong Areas
                        </h3>
                        <div className="space-y-3">
                            {['Electrostatics', 'Periodic Table', 'Vectors'].map(topic => (
                                <div key={topic} className="flex justify-between items-center p-3 bg-green-500/5 rounded-lg border border-green-500/10">
                                    <span className="text-slate-200 text-sm">{topic}</span>
                                    <span className="text-xs text-green-400 font-bold">90% Accuracy</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Solutions Link */}
                <div className="mt-8 text-center">
                    <button className="px-8 py-3 bg-cyber-purple text-white font-bold rounded-xl hover:shadow-[0_0_20px_#9d00ff] transition-all flex items-center gap-2 mx-auto">
                        View Detailed Solutions <ArrowRight size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};
