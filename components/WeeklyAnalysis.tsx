
import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { statsService } from '../services/statsService';
import { UserStats } from '../types';
import { BarChart2, Activity } from 'lucide-react';

export const WeeklyAnalysis: React.FC = () => {
  const [stats, setStats] = useState<UserStats>(statsService.getStats());
  const [hasData, setHasData] = useState(false);

  useEffect(() => {
    // Check if there is any study time recorded in history or quizzes attempted
    const totalWeeklySeconds = stats.studyHistory.reduce((acc, day) => acc + day.seconds, 0);
    setHasData(totalWeeklySeconds > 0 || stats.quizzesAttempted > 0);
  }, [stats]);

  const chartData = stats.studyHistory.map(day => ({
    name: day.day,
    hours: parseFloat((day.seconds / 3600).toFixed(1))
  }));

  return (
    <div className="h-full w-full bg-[#020617] overflow-y-auto custom-scrollbar p-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="mb-8">
            <h1 className="text-3xl font-display font-bold text-white uppercase tracking-widest mb-1 flex items-center gap-3">
                <BarChart2 size={32} className="text-cyber-cyan" /> Weekly Analysis
            </h1>
            <p className="text-slate-400 text-xs font-mono">Deep dive into your productivity metrics.</p>
        </div>

        {!hasData ? (
            /* EMPTY STATE */
            <div className="flex flex-col items-center justify-center py-20 text-center glass-panel rounded-[30px] border border-white/10">
                <div className="w-24 h-24 rounded-full bg-cyber-purple/10 border border-cyber-purple/30 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(157,0,255,0.2)]">
                    <Activity size={48} className="text-cyber-purple opacity-50" />
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">No study activity recorded yet.</h2>
                <p className="text-slate-400 max-w-md mx-auto mb-8">
                    Complete your first focus session, quiz, or task to see your performance graph light up here.
                </p>
                <div className="px-4 py-2 bg-white/5 rounded-full border border-white/10 text-xs text-cyber-cyan font-mono animate-pulse">
                    Awaiting Neural Input...
                </div>
            </div>
        ) : (
            /* DATA VISUALIZATION */
            <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                
                {/* Main Chart */}
                <div className="glass-panel p-6 rounded-[24px] border border-cyber-cyan/20 relative overflow-hidden shadow-[0_0_30px_rgba(0,243,255,0.05)]">
                    <div className="flex justify-between items-center mb-6">
                        <div>
                            <h3 className="text-white font-bold text-lg">Study Hours</h3>
                            <p className="text-slate-400 text-xs">Last 7 Days Performance</p>
                        </div>
                        <div className="text-right">
                            <span className="block text-2xl font-display font-bold text-cyber-cyan">
                                {stats.studyTimeHours}h
                            </span>
                            <span className="text-[10px] text-slate-500 uppercase tracking-wider">Total this week</span>
                        </div>
                    </div>

                    <div className="h-[300px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData}>
                                <defs>
                                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#00f3ff" stopOpacity={0.8}/>
                                        <stop offset="100%" stopColor="#00f3ff" stopOpacity={0.1}/>
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                <XAxis 
                                    dataKey="name" 
                                    axisLine={false} 
                                    tickLine={false} 
                                    tick={{fill: '#64748b', fontSize: 12, fontFamily: 'Rajdhani'}} 
                                    dy={10}
                                />
                                <Tooltip 
                                    cursor={{fill: 'rgba(255,255,255,0.03)'}}
                                    contentStyle={{
                                        backgroundColor: '#050818', 
                                        border: '1px solid rgba(0,243,255,0.3)', 
                                        borderRadius: '12px', 
                                        color: '#fff',
                                        boxShadow: '0 0 15px rgba(0,243,255,0.1)'
                                    }}
                                    itemStyle={{color: '#00f3ff', fontWeight: 'bold'}}
                                    formatter={(value: any) => [`${value} hrs`, 'Study Time']}
                                />
                                <Bar 
                                    dataKey="hours" 
                                    fill="url(#barGradient)" 
                                    radius={[6, 6, 0, 0]} 
                                    animationDuration={1500}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Additional Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-5 rounded-2xl bg-cyber-purple/5 border border-cyber-purple/20">
                        <p className="text-slate-400 text-xs uppercase tracking-widest mb-1">Subject Breakdown</p>
                        <div className="text-sm text-white">
                            <div className="flex justify-between"><span>Physics</span> <span>{(stats.subjectTimes['Physics']/60).toFixed(0)}m</span></div>
                            <div className="flex justify-between"><span>Chem</span> <span>{(stats.subjectTimes['Chemistry']/60).toFixed(0)}m</span></div>
                            <div className="flex justify-between"><span>Maths</span> <span>{(stats.subjectTimes['Maths']/60).toFixed(0)}m</span></div>
                        </div>
                    </div>
                    <div className="p-5 rounded-2xl bg-cyber-pink/5 border border-cyber-pink/20">
                        <p className="text-slate-400 text-xs uppercase tracking-widest mb-1">Focus Score</p>
                        <p className="text-2xl font-bold text-white">
                            {Math.min(100, stats.xp / 10)} <span className="text-sm text-slate-500 font-normal">/ 100</span>
                        </p>
                    </div>
                    <div className="p-5 rounded-2xl bg-cyber-yellow/5 border border-cyber-yellow/20">
                        <p className="text-slate-400 text-xs uppercase tracking-widest mb-1">Quizzes</p>
                        <p className="text-2xl font-bold text-white">
                            {stats.quizzesAttempted} <span className="text-sm text-slate-500 font-normal">Attempted</span>
                        </p>
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};
