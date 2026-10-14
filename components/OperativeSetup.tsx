
import React, { useState, useMemo } from 'react';
import { 
    User, Shield, Globe, Mic, Target, Lock, ChevronRight, BookOpen, 
    AlertCircle, Sparkles, Cpu, Award, Zap, Activity, Coffee, Volume2, UserCircle2 
} from 'lucide-react';
import { UserProfile } from '../types';

interface OperativeSetupProps {
    onComplete: (data: Partial<UserProfile>) => void;
    initialProfile: Partial<UserProfile>;
}

export const OperativeSetup: React.FC<OperativeSetupProps> = ({ onComplete, initialProfile }) => {
    const [formData, setFormData] = useState({
        name: initialProfile.name || '',
        studentClass: '' as '11' | '12' | 'Dropper' | '',
        examMode: 'JEE' as 'JEE' | 'NEET',
        language: 'English' as 'English' | 'Hindi' | 'Telugu',
        gender: '' as 'Male' | 'Female' | 'Prefer not to say' | '',
        xpTarget: 150,
        mainGoal: '',
        aiStyle: 'GenZ' as 'GenZ' | 'Calm' | 'Strict Mentor',
        aiVoice: 'Female' as 'Male' | 'Female',
        aiVoiceType: 'female' as 'male' | 'female'
    });

    const isComplete = useMemo(() => {
        return (
            formData.name.trim().length >= 3 &&
            formData.studentClass !== '' &&
            formData.mainGoal.trim().length >= 5
        );
    }, [formData]);

    const handleLockSetup = () => {
        if (!isComplete) return;
        onComplete({
            ...formData,
            setupCompleted: true,
            studentClass: formData.studentClass as any,
            joinedDate: new Date().toISOString(),
            settings: {
                notifications: true,
                aiTone: formData.aiStyle,
                privacyMode: false,
                theme: 'Default',
                studyMode: false,
                aiVoiceType: formData.aiVoiceType
            }
        });
    };

    return (
        <div className="h-full w-full bg-[#020617] flex flex-col items-center overflow-y-auto custom-scrollbar relative p-6 font-sans">
            {/* Background Ambience */}
            <div className="fixed inset-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyber-cyan/5 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyber-purple/5 rounded-full blur-[120px]"></div>
            </div>

            <div className="w-full max-w-2xl z-10 space-y-8 pb-12">
                
                {/* Header Section */}
                <div className="text-center py-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyber-cyan/10 border border-cyber-cyan/30 text-[10px] font-bold text-cyber-cyan uppercase tracking-[0.2em] mb-4 animate-pulse">
                        <Shield size={12} /> Secure Onboarding Active
                    </div>
                    <h1 className="text-4xl font-display font-bold text-white uppercase tracking-widest drop-shadow-[0_0_15px_rgba(0,243,255,0.3)]">
                        Operative Setup
                    </h1>
                    <p className="text-slate-400 text-xs mt-2 font-mono uppercase tracking-wider">Configure your study neural link</p>
                </div>

                {/* 1. Name Input */}
                <SetupCard title="Operative Identity" icon={User} color="cyan">
                    <div className="space-y-4">
                        <div>
                            <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest ml-1">Codename (Display Name)</label>
                            <input 
                                type="text" 
                                value={formData.name}
                                onChange={e => setFormData({...formData, name: e.target.value})}
                                placeholder="Enter your name..."
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white font-display text-lg focus:border-cyber-cyan outline-none transition-all placeholder-slate-700"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest ml-1">Gender (Optional)</label>
                            <div className="grid grid-cols-3 gap-2">
                                {['Male', 'Female', 'Other'].map(g => (
                                    <button 
                                        key={g}
                                        onClick={() => setFormData({...formData, gender: (g === 'Other' ? 'Prefer not to say' : g) as any})}
                                        className={`py-3 rounded-xl text-[10px] font-bold border transition-all ${formData.gender === (g === 'Other' ? 'Prefer not to say' : g) ? 'bg-cyber-cyan/20 border-cyber-cyan text-white shadow-[0_0_10px_rgba(0,243,255,0.2)]' : 'bg-white/5 border-white/10 text-slate-500'}`}
                                    >
                                        {g}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </SetupCard>

                {/* 2. Class & Exam */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <SetupCard title="Current Grade" icon={Award} color="purple">
                        <div className="grid grid-cols-3 gap-2">
                            {['11', '12', 'Dropper'].map(cls => (
                                <button 
                                    key={cls}
                                    onClick={() => setFormData({...formData, studentClass: cls as any})}
                                    className={`py-3 rounded-xl text-xs font-bold border transition-all ${formData.studentClass === cls ? 'bg-cyber-purple/20 border-cyber-purple text-white shadow-[0_0_15px_rgba(157,0,255,0.2)]' : 'bg-white/5 border-white/10 text-slate-500 hover:text-slate-300'}`}
                                >
                                    {cls}
                                </button>
                            ))}
                        </div>
                    </SetupCard>

                    <SetupCard title="Exam Mode" icon={BookOpen} color="pink">
                        <div className="flex gap-2">
                            <button 
                                onClick={() => setFormData({...formData, examMode: 'JEE'})}
                                className={`flex-1 py-3 rounded-xl text-xs font-bold border transition-all ${formData.examMode === 'JEE' ? 'bg-cyber-pink/20 border-cyber-pink text-white shadow-[0_0_15px_rgba(255,0,60,0.2)]' : 'bg-white/5 border-white/10 text-slate-400'}`}
                            >
                                JEE
                            </button>
                            <button 
                                disabled
                                className="flex-1 py-3 rounded-xl text-[10px] font-bold border border-white/5 bg-white/5 text-slate-700 cursor-not-allowed flex flex-col items-center justify-center opacity-50 relative overflow-hidden"
                            >
                                NEET
                                <span className="absolute top-1 right-1 text-[6px] bg-cyber-pink text-white px-1 rounded uppercase font-black">Coming Soon</span>
                            </button>
                        </div>
                    </SetupCard>
                </div>

                {/* 3. AI Calibration & Voice */}
                <SetupCard title="AI Calibration" icon={Cpu} color="yellow">
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-3 block flex items-center gap-2"><Globe size={12}/> Interaction Language</label>
                                <div className="grid grid-cols-3 gap-2">
                                    {['English', 'Hindi', 'Telugu'].map(lang => (
                                        <button 
                                            key={lang}
                                            onClick={() => setFormData({...formData, language: lang as any})}
                                            className={`py-2 rounded-lg text-[10px] font-bold border transition-all ${formData.language === lang ? 'bg-cyber-yellow/20 border-cyber-yellow text-white shadow-[0_0_10px_rgba(252,238,10,0.2)]' : 'bg-white/5 border-white/10 text-slate-500'}`}
                                        >
                                            {lang}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-3 block flex items-center gap-2"><Sparkles size={12}/> AI Personality Tone</label>
                                <div className="flex flex-col gap-2">
                                    {['GenZ', 'Calm', 'Strict Mentor'].map(style => (
                                        <button 
                                            key={style}
                                            onClick={() => setFormData({...formData, aiStyle: style as any})}
                                            className={`py-2 rounded-lg text-[10px] font-bold border transition-all ${formData.aiStyle === style ? 'bg-cyber-yellow/20 border-cyber-yellow text-white' : 'bg-white/5 border-white/10 text-slate-500'}`}
                                        >
                                            {style}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* NEW: AI Voice Selection */}
                        <div className="pt-4 border-t border-white/5">
                            <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-3 block flex items-center gap-2"><Volume2 size={12}/> Select Zuaki Voice Signature</label>
                            <div className="grid grid-cols-2 gap-4">
                                <button 
                                    onClick={() => setFormData({...formData, aiVoiceType: 'male'})}
                                    className={`p-4 rounded-xl border transition-all flex flex-col items-center gap-2 ${formData.aiVoiceType === 'male' ? 'bg-cyber-cyan/20 border-cyber-cyan text-white' : 'bg-white/5 border-white/10 text-slate-500'}`}
                                >
                                    <span className="text-xl">🤵</span>
                                    <span className="text-xs font-bold uppercase tracking-widest">Male Voice</span>
                                    <p className="text-[8px] opacity-50">Calm & Analytical</p>
                                </button>
                                <button 
                                    onClick={() => setFormData({...formData, aiVoiceType: 'female'})}
                                    className={`p-4 rounded-xl border transition-all flex flex-col items-center gap-2 ${formData.aiVoiceType === 'female' ? 'bg-cyber-cyan/20 border-cyber-cyan text-white' : 'bg-white/5 border-white/10 text-slate-500'}`}
                                >
                                    <span className="text-xl">👩‍🏫</span>
                                    <span className="text-xs font-bold uppercase tracking-widest">Female Voice</span>
                                    <p className="text-[8px] opacity-50">Empathetic & Firm</p>
                                </button>
                            </div>
                        </div>
                    </div>
                </SetupCard>

                {/* 4. Objectives */}
                <SetupCard title="Neural Objectives" icon={Target} color="cyan">
                    <div className="space-y-6">
                        <div>
                            <div className="flex justify-between items-center mb-3">
                                <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Daily XP Milestone</label>
                                <span className="text-cyber-cyan font-mono font-bold text-lg">{formData.xpTarget} XP</span>
                            </div>
                            <input 
                                type="range" min="50" max="1000" step="50"
                                value={formData.xpTarget}
                                onChange={e => setFormData({...formData, xpTarget: Number(e.target.value)})}
                                className="w-full h-1.5 bg-black rounded-lg appearance-none cursor-pointer accent-cyber-cyan"
                            />
                            <div className="flex justify-between mt-1 text-[8px] text-slate-600 font-bold uppercase">
                                <span>Steady</span>
                                <span>Aspirant</span>
                                <span>Top Ranker</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest ml-1">Your Ultimate JEE Goal</label>
                            <textarea 
                                value={formData.mainGoal}
                                onChange={e => setFormData({...formData, mainGoal: e.target.value})}
                                placeholder="I want to achieve a rank under 1000 in JEE Advanced..."
                                className="w-full h-24 bg-black/40 border border-white/10 rounded-xl px-5 py-4 text-white text-sm focus:border-cyber-cyan outline-none transition-all placeholder-slate-700 resize-none"
                            />
                        </div>
                    </div>
                </SetupCard>

                {/* Submit Action */}
                <div className="pt-4">
                    {!isComplete && (
                        <div className="flex items-center justify-center gap-2 text-red-500/60 text-[10px] uppercase font-bold tracking-widest mb-4 animate-bounce">
                            <AlertCircle size={12} /> Fill Codename & Goal to proceed
                        </div>
                    )}
                    <button 
                        onClick={handleLockSetup}
                        disabled={!isComplete}
                        className="w-full py-5 bg-gradient-to-r from-cyber-cyan to-cyber-purple text-white font-display font-bold text-xl uppercase tracking-[0.2em] rounded-2xl shadow-[0_0_40px_rgba(0,243,255,0.2)] hover:shadow-[0_0_60px_rgba(0,243,255,0.4)] hover:scale-[1.02] active:scale-95 transition-all disabled:opacity-30 disabled:cursor-not-allowed group relative overflow-hidden"
                    >
                        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                        <span className="relative z-10 flex items-center justify-center gap-3">
                            <Lock size={20} /> LOCK MY SETUP <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                        </span>
                    </button>
                    <p className="text-center text-slate-600 text-[10px] mt-6 uppercase tracking-widest">This is a one-time configuration. Changes possible in Settings.</p>
                </div>

            </div>
        </div>
    );
};

const SetupCard: React.FC<{ title: string; icon: any; color: 'cyan' | 'purple' | 'pink' | 'yellow'; children: React.ReactNode }> = ({ title, icon: Icon, color, children }) => {
    const colorMap = {
        cyan: 'text-cyber-cyan bg-cyber-cyan/10 border-cyber-cyan/20',
        purple: 'text-cyber-purple bg-cyber-purple/10 border-cyber-purple/20',
        pink: 'text-cyber-pink bg-cyber-pink/10 border-cyber-pink/20',
        yellow: 'text-cyber-yellow bg-cyber-yellow/10 border-cyber-yellow/20'
    };

    return (
        <div className="glass-panel p-6 rounded-[30px] border border-white/5 relative overflow-hidden group hover:border-white/10 transition-colors">
            <div className="flex items-center gap-4 mb-6">
                <div className={`p-3 rounded-2xl border ${colorMap[color]}`}>
                    <Icon size={20} />
                </div>
                <h3 className="text-white font-display font-bold uppercase tracking-[0.15em] text-sm">{title}</h3>
            </div>
            {children}
        </div>
    );
};
