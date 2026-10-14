
import React, { useState, useRef, useEffect } from 'react';
import { User, Check, Mic, Globe, ChevronRight, Plus, Upload, Camera, AlertCircle, School, BookOpen, Lock, ShieldCheck, Zap, Activity, Coffee, Volume2 } from 'lucide-react';
import { UserProfile } from '../types';

interface OnboardingProps {
  step: 'AVATAR' | 'INFO';
  onComplete: (profile: Partial<UserProfile>) => void;
  initialProfile?: Partial<UserProfile>;
}

// Updated Dragon Avatars with new concise labels
const DRAGON_AVATARS = [
  { id: 'ice', name: 'Ice', color: '#00f3ff', initials: '❄️', gradient: 'from-cyan-400 to-blue-600' },
  { id: 'fire', name: 'Fire', color: '#ff3d00', initials: '🔥', gradient: 'from-orange-500 to-red-600' },
  { id: 'lightning', name: 'Lightning', color: '#ffea00', initials: '⚡', gradient: 'from-yellow-300 to-yellow-600' },
  { id: 'water', name: 'Aqua', color: '#0099ff', initials: '💧', gradient: 'from-blue-400 to-indigo-600' },
  { id: 'crystal', name: 'Shadow', color: '#d500f9', initials: '💎', gradient: 'from-purple-400 to-fuchsia-600' },
  { id: 'wind', name: 'Earth', color: '#00e676', initials: '🌪️', gradient: 'from-emerald-400 to-teal-600' },
  { id: 'tech', name: 'Tech', color: '#651fff', initials: '🤖', gradient: 'from-indigo-400 to-violet-800' },
  { id: 'knowledge', name: 'Wisdom', color: '#f50057', initials: '📚', gradient: 'from-pink-500 to-rose-700' },
];

export const Onboarding: React.FC<OnboardingProps> = ({ step, onComplete, initialProfile }) => {
  const [selectedAvatarId, setSelectedAvatarId] = useState<string>(DRAGON_AVATARS[0].id);
  const [name, setName] = useState(initialProfile?.name || '');
  const [language, setLanguage] = useState<'English' | 'Hindi' | 'Telugu'>('English');
  const [voice, setVoice] = useState<'Male' | 'Female'>('Female');
  const [studentClass, setStudentClass] = useState<'11' | '12'>('11');
  const [examMode, setExamMode] = useState<'JEE' | 'NEET'>('JEE');
  
  // Advanced Settings
  const [studyRoutine, setStudyRoutine] = useState<'Focus Grind' | 'Balanced' | 'Chill Revision'>('Balanced');
  const [dailyTarget, setDailyTarget] = useState(50);

  // Custom Avatar Upload State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [customAvatar, setCustomAvatar] = useState<string | null>(initialProfile?.avatar || null);

  // Validation State
  const [nameError, setNameError] = useState<string | null>(null);

  // Initial Check if avatar already exists
  useEffect(() => {
      if (step === 'AVATAR' && initialProfile?.avatar) {
          setCustomAvatar(initialProfile.avatar);
          setSelectedAvatarId('custom');
      }
  }, [initialProfile, step]);

  const getAvatarUrl = (initials: string, color: string) => {
    const hex = color.replace('#', '');
    return `https://ui-avatars.com/api/?name=${initials}&background=${hex}&color=fff&size=256&font-size=0.5&length=2&rounded=true&bold=true`;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomAvatar(reader.result as string);
        setSelectedAvatarId('custom');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const val = e.target.value;
      setName(val); 

      // Validation
      if (val.length > 0 && val.length < 3) {
          setNameError("Min 3 characters");
      } else if (val.length > 25) {
          setNameError("Max 25 characters");
      } else if (!/^[a-zA-Z0-9_ ]*$/.test(val)) {
          setNameError("Invalid characters");
      } else {
          setNameError(null);
      }
  };

  const currentAvatar = DRAGON_AVATARS.find(a => a.id === selectedAvatarId) || DRAGON_AVATARS[0];

  const handleNextStep = () => {
      let finalAvatar = getAvatarUrl(currentAvatar.initials, currentAvatar.color);
      if (selectedAvatarId === 'custom' && customAvatar) {
          finalAvatar = customAvatar;
      }

      onComplete({ 
          avatar: finalAvatar,
      });
  };

  const handleInfoSubmit = () => {
      onComplete({ 
          name, 
          language, 
          aiVoice: voice, 
          studentClass, 
          examMode,
          studyRoutine,
          dailyTarget
      });
  };

  // --- AVATAR STEP ---
  if (step === 'AVATAR') {
    return (
      <div className="h-full w-full flex flex-col items-center p-6 relative overflow-hidden bg-[#020617] text-white">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#0f172a_0%,_#020617_100%)] z-0"></div>
        <div className="absolute top-[-20%] left-[20%] w-[600px] h-[600px] bg-cyber-cyan/5 rounded-full blur-[120px] pointer-events-none animate-pulse-slow"></div>
        
        <div className="relative z-10 w-full max-w-4xl flex flex-col items-center h-full">
            <h1 className="text-3xl md:text-5xl font-display font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyber-cyan to-white tracking-wide uppercase drop-shadow-[0_0_15px_rgba(0,243,255,0.5)] mb-8 text-center mt-4">
                Choose Your Zuaki Avatar
            </h1>

            {/* Custom Upload Area */}
            <div className="flex items-center gap-6 mb-12">
                <div className="relative group">
                    <div className="absolute inset-0 bg-cyber-cyan blur-md opacity-20 group-hover:opacity-40 transition-opacity duration-500 rounded-2xl"></div>
                    <div className="w-24 h-24 bg-black/40 backdrop-blur-xl border border-cyber-cyan/30 rounded-2xl flex items-center justify-center relative shadow-[0_0_30px_rgba(0,243,255,0.1)] group-hover:border-cyber-cyan/60 transition-all duration-300">
                        <svg viewBox="0 0 100 100" className="w-14 h-14 drop-shadow-[0_0_8px_#00f3ff]">
                            <path d="M20 20 L 80 20 L 20 80 L 80 80" stroke="#00f3ff" strokeWidth="8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <div className="absolute -top-1 -right-1 w-3 h-3 bg-white rounded-full animate-ping"></div>
                    </div>
                </div>

                <div className="h-1 w-16 bg-gradient-to-r from-cyber-cyan/20 to-transparent rounded-full"></div>

                <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
                <button 
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative group ${selectedAvatarId === 'custom' ? 'scale-105' : ''}`}
                >
                    <div className={`absolute inset-0 bg-cyber-purple blur-md transition-opacity duration-500 rounded-2xl ${selectedAvatarId === 'custom' ? 'opacity-60' : 'opacity-20 group-hover:opacity-40'}`}></div>
                    <div className={`w-24 h-24 bg-black/40 backdrop-blur-xl border rounded-2xl flex flex-col items-center justify-center relative shadow-lg transition-all duration-300 cursor-pointer overflow-hidden ${selectedAvatarId === 'custom' ? 'border-cyber-purple shadow-[0_0_20px_rgba(157,0,255,0.5)]' : 'border-white/10 group-hover:border-white/30'}`}>
                        {customAvatar ? (
                             <img src={customAvatar} alt="Custom" className="w-full h-full object-cover" />
                        ) : (
                            <>
                                <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform text-cyber-cyan">
                                    <Plus size={24} />
                                </div>
                                <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 group-hover:text-white">Upload</span>
                            </>
                        )}
                        {selectedAvatarId === 'custom' && (
                            <div className="absolute top-0 right-0 w-6 h-6 bg-cyber-purple flex items-center justify-center rounded-bl-xl shadow-[0_0_10px_#9d00ff]">
                                <Check size={12} className="text-white" />
                            </div>
                        )}
                    </div>
                </button>
            </div>

            {/* Avatar Grid */}
            <div className="flex-1 w-full overflow-y-auto custom-scrollbar px-4 pb-4">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 max-w-4xl mx-auto">
                    {DRAGON_AVATARS.map((avatar) => {
                        const isSelected = selectedAvatarId === avatar.id;
                        return (
                            <button
                                key={avatar.id}
                                onClick={() => setSelectedAvatarId(avatar.id)}
                                className="group relative flex flex-col items-center"
                            >
                                <div className={`absolute inset-0 rounded-full blur-xl transition-all duration-500 ${isSelected ? 'opacity-60 scale-110' : 'opacity-0 group-hover:opacity-30 scale-100'}`} style={{ backgroundColor: avatar.color }}></div>
                                <div className={`w-28 h-28 md:w-36 md:h-36 rounded-full relative z-10 transition-all duration-300 p-1 flex items-center justify-center ${isSelected ? 'scale-105' : 'group-hover:scale-105'}`}>
                                    <div className={`absolute inset-0 rounded-full border-2 transition-all duration-300 ${isSelected ? 'border-opacity-100 shadow-[0_0_20px_inset]' : 'border-opacity-30 border-white/20'}`} style={{ borderColor: avatar.color, boxShadow: isSelected ? `0 0 20px ${avatar.color}` : 'none' }}></div>
                                    <div className="w-full h-full rounded-full overflow-hidden bg-black/50 relative flex items-center justify-center backdrop-blur-sm">
                                        <div className={`absolute inset-0 bg-gradient-to-br ${avatar.gradient} opacity-20`}></div>
                                        <div className="text-4xl md:text-5xl filter drop-shadow-[0_0_10px_rgba(255,255,255,0.5)] transform group-hover:scale-110 transition-transform duration-300">
                                            {avatar.initials}
                                        </div>
                                    </div>
                                    {isSelected && (
                                        <div className="absolute top-0 right-0 w-8 h-8 rounded-full bg-white text-black flex items-center justify-center shadow-[0_0_15px_white] z-20 animate-in zoom-in spin-in-12 duration-300">
                                            <Check size={16} strokeWidth={4} />
                                        </div>
                                    )}
                                </div>
                                <span className={`mt-4 text-xs md:text-sm font-display font-bold uppercase tracking-widest transition-colors duration-300 ${isSelected ? 'text-white drop-shadow-[0_0_5px_rgba(255,255,255,0.8)]' : 'text-slate-500 group-hover:text-slate-300'}`}>
                                    {avatar.name}
                                </span>
                            </button>
                        );
                    })}
                </div>
            </div>

            <div className="w-full max-w-md mt-6 mb-4">
                 <button 
                    onClick={handleNextStep}
                    className="w-full py-5 relative group overflow-hidden rounded-xl"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-cyber-cyan to-cyber-purple opacity-80 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <div className="relative z-10 flex items-center justify-center gap-3 text-white font-display font-bold text-xl uppercase tracking-[0.25em]">
                        <span>Enter Zuaki</span>
                        <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                </button>
            </div>
        </div>
      </div>
    );
  }

  // --- INFO STEP (PLAYER SETUP) ---
  return (
    <div className="h-full w-full flex flex-col items-center p-4 bg-gradient-to-b from-[#020412] to-[#08021c] overflow-y-auto relative selection:bg-cyber-cyan selection:text-black">
       {/* Background Particles & Glows */}
       <div className="absolute inset-0 pointer-events-none">
           <div className="absolute top-[-10%] right-[-20%] w-[500px] h-[500px] bg-cyber-purple/10 rounded-full blur-[100px] animate-pulse-slow"></div>
           <div className="absolute bottom-[-10%] left-[-20%] w-[500px] h-[500px] bg-cyber-cyan/10 rounded-full blur-[100px] animate-pulse-slow delay-1000"></div>
           <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5"></div>
       </div>

       <div className="w-full max-w-lg z-10 space-y-6 pb-24">
            
            {/* 1. Top Status Card */}
            <div className="w-full bg-[#050818] border border-cyber-cyan/30 rounded-2xl p-4 flex items-center justify-between shadow-[0_0_25px_rgba(0,243,255,0.1)] relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-cyber-cyan/5 to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
                <div className="flex items-center gap-4 relative z-10">
                    <div className="w-10 h-10 rounded-full bg-cyber-cyan/10 border border-cyber-cyan flex items-center justify-center text-cyber-cyan shadow-[0_0_10px_#00f3ff] animate-pulse">
                        <ShieldCheck size={20} />
                    </div>
                    <div>
                        <h3 className="text-white font-display font-bold tracking-widest text-sm uppercase">Authenticated</h3>
                        <p className="text-cyber-cyan text-xs font-mono">{initialProfile?.email || 'user@zuaki.ai'}</p>
                    </div>
                </div>
                <div className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_#22c55e] animate-ping"></div>
            </div>

            <h1 className="text-2xl font-display font-bold text-center text-white tracking-[0.2em] uppercase drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]">
                Player Setup
            </h1>

            {/* 2. Operative Name */}
            <div className="bg-black/40 border border-white/10 rounded-2xl p-5 backdrop-blur-md">
                <label className="text-[10px] text-cyber-cyan font-bold uppercase tracking-widest mb-3 block flex items-center gap-2">
                    <User size={12} /> Operative Name
                </label>
                <div className="relative">
                    <input 
                        type="text" 
                        value={name}
                        onChange={handleNameChange}
                        placeholder="Enter Code Name"
                        className={`w-full bg-[#0b0f1a] border rounded-xl px-4 py-3 text-white font-mono text-sm outline-none transition-all placeholder-slate-600 focus:shadow-[0_0_20px_rgba(0,243,255,0.15)] ${nameError ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-cyber-cyan'}`}
                    />
                    {nameError && (
                        <div className="absolute right-3 top-3 text-red-500 text-xs animate-pulse flex items-center gap-1">
                            <AlertCircle size={12}/> {nameError}
                        </div>
                    )}
                </div>
            </div>

            {/* 3. Class Selection */}
            <div className="bg-black/40 border border-white/10 rounded-2xl p-5 backdrop-blur-md">
                <label className="text-[10px] text-cyber-cyan font-bold uppercase tracking-widest mb-3 block flex items-center gap-2">
                    <School size={12} /> Select Class
                </label>
                <div className="flex gap-3">
                    {['11', '12'].map((cls) => (
                        <button
                            key={cls}
                            onClick={() => setStudentClass(cls as any)}
                            className={`flex-1 py-3 rounded-xl text-sm font-bold border transition-all relative overflow-hidden group ${
                                studentClass === cls 
                                ? 'bg-cyber-cyan/20 border-cyber-cyan text-cyber-cyan shadow-[0_0_15px_rgba(0,243,255,0.3)]' 
                                : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                            }`}
                        >
                            Class {cls}
                            {studentClass === cls && <div className="absolute inset-0 bg-cyber-cyan/10 blur-md"></div>}
                        </button>
                    ))}
                </div>
            </div>

            {/* 4. Exam Mode */}
            <div className="bg-black/40 border border-white/10 rounded-2xl p-5 backdrop-blur-md">
                <label className="text-[10px] text-cyber-cyan font-bold uppercase tracking-widest mb-3 block flex items-center gap-2">
                    <BookOpen size={12} /> Exam Mode
                </label>
                <div className="flex gap-3">
                    <button
                        onClick={() => setExamMode('JEE')}
                        className={`flex-1 py-3 rounded-xl text-sm font-bold border transition-all ${
                            examMode === 'JEE' 
                            ? 'bg-cyber-cyan/20 border-cyber-cyan text-cyber-cyan shadow-[0_0_15px_rgba(0,243,255,0.3)]' 
                            : 'bg-white/5 border-white/10 text-slate-400'
                        }`}
                    >
                        JEE
                    </button>
                    <button
                        disabled
                        className="flex-1 py-3 rounded-xl text-sm font-bold border border-white/5 bg-white/5 text-slate-600 relative overflow-hidden cursor-not-allowed opacity-50"
                    >
                        NEET
                        <div className="absolute -top-1 -right-1 bg-cyber-pink text-white text-[8px] px-2 py-0.5 rounded-bl-lg font-bold">SOON</div>
                    </button>
                </div>
            </div>

            {/* 5. Language & Voice */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-black/40 border border-white/10 rounded-2xl p-5 backdrop-blur-md">
                    <label className="text-[10px] text-cyber-cyan font-bold uppercase tracking-widest mb-3 block flex items-center gap-2">
                        <Globe size={12} /> AI Language
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                        {['English', 'Hindi', 'Telugu'].map((lang) => (
                            <button
                                key={lang}
                                onClick={() => setLanguage(lang as any)}
                                className={`py-2 rounded-lg text-[10px] font-bold border transition-all ${
                                    language === lang 
                                    ? 'bg-cyber-cyan/20 border-cyber-cyan text-cyber-cyan shadow-[0_0_10px_rgba(0,243,255,0.2)]' 
                                    : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                                }`}
                            >
                                {lang}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="bg-black/40 border border-white/10 rounded-2xl p-5 backdrop-blur-md">
                    <label className="text-[10px] text-cyber-cyan font-bold uppercase tracking-widest mb-3 block flex items-center gap-2">
                        <Mic size={12} /> AI Voice
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                        {['Male', 'Female'].map((v) => (
                            <button
                                key={v}
                                onClick={() => setVoice(v as any)}
                                className={`py-2 rounded-lg text-[10px] font-bold border transition-all flex items-center justify-center gap-2 ${
                                    voice === v 
                                    ? 'bg-cyber-cyan/20 border-cyber-cyan text-cyber-cyan shadow-[0_0_10px_rgba(0,243,255,0.2)]' 
                                    : 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10'
                                }`}
                            >
                                {v} <Volume2 size={12} />
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* 6. Advanced Study Settings */}
            <div className="bg-[#050818]/80 border border-cyber-purple/30 rounded-2xl p-6 backdrop-blur-md shadow-[0_0_30px_rgba(157,0,255,0.1)] relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-cyber-purple/10 rounded-full blur-[40px] pointer-events-none"></div>
                <h3 className="text-white font-bold text-sm mb-6 flex items-center gap-2 border-b border-white/10 pb-2">
                    <Activity size={16} className="text-cyber-purple" /> Advanced Protocols
                </h3>

                <div className="mb-6">
                    <label className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-3 block">Study Mode</label>
                    <div className="grid grid-cols-3 gap-2">
                        <button onClick={() => setStudyRoutine('Focus Grind')} className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-all ${studyRoutine === 'Focus Grind' ? 'bg-cyber-purple/20 border-cyber-purple text-cyber-purple' : 'bg-white/5 border-white/10 text-slate-500'}`}>
                            <Zap size={16} /> <span className="text-[9px] font-bold">Grind</span>
                        </button>
                        <button onClick={() => setStudyRoutine('Balanced')} className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-all ${studyRoutine === 'Balanced' ? 'bg-cyber-purple/20 border-cyber-purple text-cyber-purple' : 'bg-white/5 border-white/10 text-slate-500'}`}>
                            <Activity size={16} /> <span className="text-[9px] font-bold">Balanced</span>
                        </button>
                        <button onClick={() => setStudyRoutine('Chill Revision')} className={`p-2 rounded-xl border flex flex-col items-center gap-1 transition-all ${studyRoutine === 'Chill Revision' ? 'bg-cyber-purple/20 border-cyber-purple text-cyber-purple' : 'bg-white/5 border-white/10 text-slate-500'}`}>
                            <Coffee size={16} /> <span className="text-[9px] font-bold">Chill</span>
                        </button>
                    </div>
                </div>

                <div>
                    <label className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-2 block flex justify-between">
                        <span>Daily Target</span>
                        <span className="text-cyber-purple font-mono">{dailyTarget} Qs</span>
                    </label>
                    <input 
                        type="range" min="20" max="200" step="10" 
                        value={dailyTarget} 
                        onChange={(e) => setDailyTarget(Number(e.target.value))}
                        className="w-full h-2 bg-black rounded-lg appearance-none cursor-pointer accent-cyber-purple" 
                    />
                    <div className="mt-2 flex justify-between items-center bg-black/40 p-2 rounded-lg border border-white/5">
                        <span className="text-[10px] text-slate-500">Predicted XP Gain</span>
                        <span className="text-xs font-mono font-bold text-cyber-cyan flex items-center gap-1">
                            <Zap size={10} fill="currentColor" /> ~{dailyTarget * 5} XP/Day
                        </span>
                    </div>
                </div>
            </div>

            {/* Final Action Button */}
            <button 
                onClick={handleInfoSubmit}
                disabled={!name.trim() || !!nameError}
                className="w-full py-5 bg-gradient-to-r from-cyan-500 via-purple-500 to-blue-600 text-white font-display font-bold text-lg uppercase tracking-[0.25em] rounded-xl shadow-[0_0_30px_rgba(0,243,255,0.4)] hover:shadow-[0_0_50px_rgba(0,243,255,0.6)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group relative overflow-hidden"
            >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>
                <span className="relative z-10 flex items-center gap-3">
                    Lock My Setup <ChevronRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </span>
            </button>

       </div>
    </div>
  );
};
