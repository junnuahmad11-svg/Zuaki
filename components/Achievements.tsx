import React, { useState, useEffect } from 'react';
import { Award, Zap, Clock, Target, Brain, Flame, Lock, Star, Shield, BookOpen } from 'lucide-react';
import { statsService } from '../services/statsService';
import { UserStats } from '../types';

interface Badge {
  id: string;
  title: string;
  description: string;
  icon: any;
  color: string; // 'cyan' | 'purple' | 'pink' | 'yellow'
  progress: number;
  maxProgress: number;
  unlocked: boolean;
  xpReward: number;
}

export const Achievements: React.FC = () => {
  const [stats, setStats] = useState<UserStats>(statsService.getStats());

  useEffect(() => {
    const unsubscribe = statsService.subscribe(setStats);
    return () => { unsubscribe(); };
  }, []);

  const calculateProgress = (current: number, max: number) => Math.min(100, (current / max) * 100);

  const badges: Badge[] = [
    {
      id: 'novice',
      title: 'Neural Initiate',
      description: 'Complete your first study session.',
      icon: Zap,
      color: 'cyan',
      progress: stats.totalTime > 0 ? 1 : 0,
      maxProgress: 1,
      unlocked: stats.totalTime > 0,
      xpReward: 100
    },
    {
      id: 'focus_master_1',
      title: 'Focus Apprentice',
      description: 'Accumulate 10 hours of total study time.',
      icon: Clock,
      color: 'purple',
      progress: stats.studyTimeHours,
      maxProgress: 10,
      unlocked: stats.studyTimeHours >= 10,
      xpReward: 500
    },
    {
      id: 'streak_3',
      title: 'Consistency Key',
      description: 'Maintain a 3-day study streak.',
      icon: Flame,
      color: 'pink',
      progress: stats.dailyStreak,
      maxProgress: 3,
      unlocked: stats.dailyStreak >= 3,
      xpReward: 300
    },
    {
      id: 'quiz_5',
      title: 'Quiz Hunter',
      description: 'Attempt 5 quizzes.',
      icon: Brain,
      color: 'yellow',
      progress: stats.quizzesAttempted,
      maxProgress: 5,
      unlocked: stats.quizzesAttempted >= 5,
      xpReward: 250
    },
    {
      id: 'accuracy_80',
      title: 'Sharpshooter',
      description: 'Achieve 80% accuracy in any quiz.',
      icon: Target,
      color: 'cyan',
      progress: stats.accuracy,
      maxProgress: 80,
      unlocked: stats.accuracy >= 80,
      xpReward: 400
    },
    {
      id: 'level_5',
      title: 'Rising Scholar',
      description: 'Reach Level 5.',
      icon: Star,
      color: 'purple',
      progress: stats.level,
      maxProgress: 5,
      unlocked: stats.level >= 5,
      xpReward: 1000
    },
    {
      id: 'focus_master_2',
      title: 'Deep Work Master',
      description: 'Accumulate 50 hours of total study time.',
      icon: Shield,
      color: 'pink',
      progress: stats.studyTimeHours,
      maxProgress: 50,
      unlocked: stats.studyTimeHours >= 50,
      xpReward: 2000
    },
    {
      id: 'streak_7',
      title: 'Unstoppable',
      description: 'Maintain a 7-day study streak.',
      icon: Flame,
      color: 'yellow',
      progress: stats.dailyStreak,
      maxProgress: 7,
      unlocked: stats.dailyStreak >= 7,
      xpReward: 1000
    },
    {
      id: 'ai_user',
      title: 'Neural Link',
      description: 'Ask the AI Assistant 10 doubts.',
      icon: BookOpen,
      color: 'cyan',
      progress: stats.aiDoubtsAsked,
      maxProgress: 10,
      unlocked: stats.aiDoubtsAsked >= 10,
      xpReward: 300
    }
  ];

  const getColorClass = (color: string) => {
    switch (color) {
      case 'cyan': return 'text-cyber-cyan border-cyber-cyan shadow-[0_0_15px_#00f3ff] bg-cyber-cyan/10';
      case 'purple': return 'text-cyber-purple border-cyber-purple shadow-[0_0_15px_#9d00ff] bg-cyber-purple/10';
      case 'pink': return 'text-cyber-pink border-cyber-pink shadow-[0_0_15px_#ff003c] bg-cyber-pink/10';
      case 'yellow': return 'text-cyber-yellow border-cyber-yellow shadow-[0_0_15px_#fcee0a] bg-cyber-yellow/10';
      default: return 'text-white border-white';
    }
  };

  const getProgressColor = (color: string) => {
    switch (color) {
      case 'cyan': return 'bg-cyber-cyan';
      case 'purple': return 'bg-cyber-purple';
      case 'pink': return 'bg-cyber-pink';
      case 'yellow': return 'bg-cyber-yellow';
      default: return 'bg-white';
    }
  };

  return (
    <div className="h-full w-full bg-[#020617] overflow-y-auto custom-scrollbar p-6 pb-24 relative">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none"></div>
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyber-purple/5 rounded-full blur-[100px] pointer-events-none"></div>
      
      <div className="max-w-5xl mx-auto space-y-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
                <h1 className="text-3xl font-display font-bold text-white uppercase tracking-widest mb-1 flex items-center gap-3">
                    <Award size={32} className="text-cyber-yellow" /> Hall of Achievements
                </h1>
                <p className="text-slate-400 text-xs font-mono">Unlock badges by mastering your study routine.</p>
            </div>
            
            {/* Level Circle */}
            <div className="flex items-center gap-6 glass-panel p-4 rounded-full border border-white/10 pr-8">
                 <div className="relative">
                     <div className="w-16 h-16 rounded-full border-4 border-cyber-cyan flex items-center justify-center bg-black shadow-[0_0_20px_rgba(0,243,255,0.3)] relative z-10">
                         <span className="text-2xl font-bold text-white">{stats.level}</span>
                     </div>
                     <div className="absolute inset-0 rounded-full border-4 border-cyber-purple animate-ping opacity-20"></div>
                 </div>
                 <div className="flex flex-col gap-1 w-40">
                     <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                         <span className="text-cyber-cyan">Level Progress</span>
                         <span className="text-white">{Math.floor((stats.xp % 1000) / 10)}%</span>
                     </div>
                     <div className="h-2 w-full bg-black/50 rounded-full overflow-hidden border border-white/10">
                         <div 
                           className="h-full bg-gradient-to-r from-cyber-cyan to-cyber-purple transition-all duration-1000"
                           style={{ width: `${(stats.xp % 1000) / 10}%` }}
                         ></div>
                     </div>
                     <div className="text-[10px] text-slate-500 font-mono text-right">{stats.xp} / {(stats.level + 1) * 1000} XP</div>
                 </div>
            </div>
        </div>

        {/* Badges Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {badges.map((badge, index) => (
                <div 
                  key={badge.id}
                  className={`glass-panel p-6 rounded-2xl border transition-all duration-500 relative group overflow-hidden ${
                      badge.unlocked 
                      ? `border-${badge.color === 'cyan' ? 'cyber-cyan' : badge.color === 'purple' ? 'cyber-purple' : badge.color === 'pink' ? 'cyber-pink' : 'cyber-yellow'}/30 hover:border-${badge.color === 'cyan' ? 'cyber-cyan' : badge.color === 'purple' ? 'cyber-purple' : badge.color === 'pink' ? 'cyber-pink' : 'cyber-yellow'}` 
                      : 'border-white/5 opacity-80 hover:opacity-100'
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                    {/* Background Glow */}
                    {badge.unlocked && (
                        <div className={`absolute top-0 right-0 w-32 h-32 bg-${badge.color === 'cyan' ? 'cyber-cyan' : badge.color === 'purple' ? 'cyber-purple' : badge.color === 'pink' ? 'cyber-pink' : 'cyber-yellow'}/10 rounded-full blur-[40px] -mr-10 -mt-10 transition-all group-hover:bg-${badge.color === 'cyan' ? 'cyber-cyan' : badge.color === 'purple' ? 'cyber-purple' : badge.color === 'pink' ? 'cyber-pink' : 'cyber-yellow'}/20`}></div>
                    )}

                    <div className="flex items-start justify-between mb-4 relative z-10">
                        <div className={`w-14 h-14 rounded-xl flex items-center justify-center border transition-all duration-300 ${
                            badge.unlocked 
                            ? getColorClass(badge.color)
                            : 'bg-white/5 border-white/10 text-slate-500'
                        }`}>
                            <badge.icon size={28} strokeWidth={badge.unlocked ? 2 : 1.5} />
                        </div>
                        {badge.unlocked ? (
                            <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-${badge.color === 'cyan' ? 'cyber-cyan' : badge.color === 'purple' ? 'cyber-purple' : badge.color === 'pink' ? 'cyber-pink' : 'cyber-yellow'}/10 text-${badge.color === 'cyan' ? 'cyber-cyan' : badge.color === 'purple' ? 'cyber-purple' : badge.color === 'pink' ? 'cyber-pink' : 'cyber-yellow'} border border-${badge.color === 'cyan' ? 'cyber-cyan' : badge.color === 'purple' ? 'cyber-purple' : badge.color === 'pink' ? 'cyber-pink' : 'cyber-yellow'}/20`}>
                                Unlocked
                            </div>
                        ) : (
                            <Lock size={16} className="text-slate-600" />
                        )}
                    </div>

                    <div className="relative z-10">
                        <h3 className={`text-lg font-bold font-display mb-1 ${badge.unlocked ? 'text-white' : 'text-slate-400'}`}>
                            {badge.title}
                        </h3>
                        <p className="text-xs text-slate-500 mb-4 h-8 line-clamp-2">
                            {badge.description}
                        </p>

                        {/* XP Reward & Progress */}
                        <div className="flex items-end justify-between">
                            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-cyber-yellow">
                                <Zap size={12} fill="currentColor" />
                                +{badge.xpReward} XP
                            </div>
                            
                            {!badge.unlocked && (
                                <div className="text-[10px] text-slate-400 font-mono">
                                    {Math.floor(badge.progress)} / {badge.maxProgress}
                                </div>
                            )}
                        </div>

                        {/* Progress Bar */}
                        <div className="h-1.5 w-full bg-black/40 rounded-full mt-3 overflow-hidden border border-white/5">
                            <div 
                                className={`h-full transition-all duration-1000 ${badge.unlocked ? getProgressColor(badge.color) + ' shadow-[0_0_10px_currentColor]' : 'bg-slate-600'}`}
                                style={{ width: `${calculateProgress(badge.progress, badge.maxProgress)}%` }}
                            ></div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </div>
  );
};