
import React, { useState, useRef } from 'react';
import { ArrowLeft, Camera, Save, Copy, Check, Shield, Bell, Cpu, BookOpen, AlertCircle } from 'lucide-react';
import { UserProfile, UserSettings } from '../types';
import { imagekit, firebase } from '../services/backend';

// Reuse dragon avatars from onboarding with new labels
const DRAGON_AVATARS = [
  { id: 'ice', name: 'Ice', color: '#00f3ff', initials: '❄️', gradient: 'from-cyan-400 to-blue-600' },
  { id: 'fire', name: 'Fire', color: '#ff3d00', initials: '🔥', gradient: 'from-orange-500 to-red-600' },
  { id: 'lightning', name: 'Lightning', color: '#ffea00', initials: '⚡', gradient: 'from-yellow-300 to-yellow-600' },
  { id: 'water', name: 'Aqua', color: '#0099ff', initials: '💧', gradient: 'from-blue-400 to-indigo-600' },
];

interface EditProfileProps {
  userProfile: Partial<UserProfile>;
  onSave: (data: Partial<UserProfile>) => void;
  onBack: () => void;
}

export const EditProfile: React.FC<EditProfileProps> = ({ userProfile, onSave, onBack }) => {
  const [formData, setFormData] = useState<Partial<UserProfile>>(userProfile);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [copied, setCopied] = useState(false);
  const [nameError, setNameError] = useState<string | null>(null);

  // Settings State
  const [settings, setSettings] = useState<UserSettings>(userProfile.settings || {
    notifications: true,
    aiTone: 'Friendly',
    privacyMode: false,
    theme: 'Neon Blue',
    studyMode: false
  });

  // Validation Logic reused
  const handleInputChange = (field: keyof UserProfile, value: any) => {
    if (field === 'name') {
        setFormData(prev => ({ ...prev, [field]: value })); // Always allow typing

        if (value.length > 0 && value.length < 3) {
            setNameError("At least 3 chars");
        } else if (value.length > 25) {
            setNameError("Max 25 chars");
        } else if (!/^[a-zA-Z0-9_ ]*$/.test(value)) {
            setNameError("Invalid chars (A-Z, 0-9, space)");
        } else {
            setNameError(null);
        }
        return;
    }
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSettingChange = (field: keyof UserSettings, value: any) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        setLoading(true);
        const reader = new FileReader();
        reader.onloadend = async () => {
             const base64 = reader.result as string;
             // FIX: imagekit.uploadFile expects 1 argument
             const url = await imagekit.uploadFile(base64);
             setFormData(prev => ({ ...prev, avatar: url }));
             setLoading(false);
        };
        reader.readAsDataURL(file);
    }
  };

  const handleDragonSelect = (dragon: any) => {
      const url = `https://ui-avatars.com/api/?name=${dragon.initials}&background=${dragon.color.replace('#','')}&color=fff&size=256&font-size=0.5&length=2&rounded=true&bold=true`;
      setFormData(prev => ({ ...prev, avatar: url }));
  };

  const handleSave = async () => {
      if (nameError || !formData.name?.trim()) return;
      setLoading(true);
      const finalData = { ...formData, settings };
      await firebase.firestore().doc(`users/${formData.userId}`).update(finalData);
      onSave(finalData);
      setLoading(false);
      onBack();
  };

  const copyID = () => {
      navigator.clipboard.writeText(formData.userId || '');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="h-full w-full bg-[#020617] flex flex-col relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-cyber-purple/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-cyber-cyan/10 rounded-full blur-[120px] pointer-events-none"></div>

        {/* 1. Header Section */}
        <div className="p-6 relative z-10 flex items-center justify-between border-b border-white/5 bg-black/20 backdrop-blur-md">
            <button onClick={onBack} className="p-2 rounded-full hover:bg-white/10 text-white transition-colors">
                <ArrowLeft size={24} />
            </button>
            <h1 className="text-xl font-display font-bold text-white tracking-widest uppercase">Edit Profile</h1>
            <div className="w-10"></div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8 relative z-10 pb-24">
            
            {/* Avatar Section */}
            <div className="flex flex-col items-center gap-4">
                <div className="relative group">
                    <div className="absolute inset-0 bg-cyber-cyan blur-md opacity-30 group-hover:opacity-50 transition-opacity rounded-full"></div>
                    <img 
                        src={formData.avatar} 
                        alt="Profile" 
                        className="w-28 h-28 rounded-full border-2 border-cyber-cyan object-cover relative z-10"
                    />
                    <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-black border border-cyber-cyan flex items-center justify-center text-cyber-cyan z-20 hover:scale-110 transition-transform shadow-[0_0_10px_#00f3ff]"
                    >
                        {loading ? <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div> : <Camera size={16} />}
                    </button>
                    <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*" className="hidden" />
                </div>
                
                {/* Dragon Selection */}
                <div className="flex gap-2 overflow-x-auto pb-2 w-full justify-center">
                    {DRAGON_AVATARS.map(d => (
                         <button 
                            key={d.id} 
                            onClick={() => handleDragonSelect(d)}
                            className="w-10 h-10 rounded-full border-2 border-white/10 hover:scale-110 transition-all flex items-center justify-center"
                            style={{ backgroundColor: d.color }}
                         >
                             <span className="text-sm">{d.initials}</span>
                         </button>
                    ))}
                </div>

                {/* ZA-ID Card */}
                <div className="flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10">
                    <span className="text-slate-400 text-xs font-mono">ID:</span>
                    <span className="text-cyber-cyan font-mono font-bold tracking-wider">{formData.userId || 'ZA-XXXXX'}</span>
                    <button onClick={copyID} className="text-slate-500 hover:text-white transition-colors">
                        {copied ? <Check size={14} className="text-green-400" /> : <Copy size={14} />}
                    </button>
                </div>
            </div>

            {/* 2. Editable Fields */}
            <div className="space-y-6">
                <div className="grid gap-6">
                    <div className="space-y-2">
                        <label className="text-xs text-cyber-purple font-bold uppercase tracking-widest ml-1">Full Name</label>
                        <input 
                            type="text" 
                            value={formData.name} 
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            className={`w-full bg-black/40 border rounded-xl px-4 py-3 text-white focus:outline-none transition-all ${nameError ? 'border-red-500 focus:border-red-500' : 'border-white/10 focus:border-cyber-purple focus:shadow-[0_0_15px_rgba(157,0,255,0.2)]'}`}
                        />
                        {nameError && (
                            <div className="text-red-400 text-[10px] flex items-center gap-1">
                                <AlertCircle size={10} /> {nameError}
                            </div>
                        )}
                    </div>

                    <div className="space-y-2">
                         <label className="text-xs text-cyber-yellow font-bold uppercase tracking-widest ml-1 flex items-center gap-2"><BookOpen size={12}/> Class / Batch</label>
                         <div className="grid grid-cols-3 gap-2">
                             {['11', '12', 'Dropper'].map(c => (
                                 <button
                                    key={c}
                                    onClick={() => handleInputChange('studentClass', c)}
                                    className={`py-2 rounded-lg border text-sm transition-all ${
                                        formData.studentClass === c 
                                        ? 'bg-cyber-yellow/20 border-cyber-yellow text-cyber-yellow'
                                        : 'bg-white/5 border-white/10 text-slate-400'
                                    }`}
                                 >
                                     {c}
                                 </button>
                             ))}
                         </div>
                    </div>
                    
                    <div className="space-y-2">
                        <label className="text-xs text-cyber-purple font-bold uppercase tracking-widest ml-1">Email</label>
                        <input 
                            type="email" 
                            value={formData.email} 
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyber-purple focus:shadow-[0_0_15px_rgba(157,0,255,0.2)] outline-none transition-all"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs text-cyber-pink font-bold uppercase tracking-widest ml-1">College</label>
                            <input 
                                type="text" 
                                value={formData.college || ''} 
                                onChange={(e) => handleInputChange('college', e.target.value)}
                                placeholder="e.g. Narayana"
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyber-pink focus:shadow-[0_0_15px_rgba(255,0,60,0.2)] outline-none transition-all"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs text-cyber-pink font-bold uppercase tracking-widest ml-1">Phone</label>
                            <input 
                                type="text" 
                                value={formData.phone || ''} 
                                onChange={(e) => handleInputChange('phone', e.target.value)}
                                placeholder="+91..."
                                className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:border-cyber-pink focus:shadow-[0_0_15px_rgba(255,0,60,0.2)] outline-none transition-all"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* 3. Settings Section */}
            <div className="space-y-4">
                <h3 className="text-white font-display font-bold text-lg mb-2 border-l-4 border-cyber-cyan pl-3">System Settings</h3>
                
                {/* Toggle Item */}
                <div className="glass-panel p-4 rounded-xl border border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-cyber-yellow/10 flex items-center justify-center text-cyber-yellow"><Bell size={20} /></div>
                        <div>
                            <p className="text-white font-bold text-sm">Notifications</p>
                            <p className="text-slate-500 text-xs">Alerts for quizzes & chat</p>
                        </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={settings.notifications} onChange={(e) => handleSettingChange('notifications', e.target.checked)} className="sr-only peer" />
                        <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyber-cyan"></div>
                    </label>
                </div>

                {/* Select Item */}
                <div className="glass-panel p-4 rounded-xl border border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-cyber-purple/10 flex items-center justify-center text-cyber-purple"><Cpu size={20} /></div>
                        <div>
                            <p className="text-white font-bold text-sm">AI Tone</p>
                            <p className="text-slate-500 text-xs">How Gemini responds</p>
                        </div>
                    </div>
                    <select 
                        value={settings.aiTone}
                        onChange={(e) => handleSettingChange('aiTone', e.target.value)}
                        className="bg-black/40 border border-white/20 text-white text-xs rounded-lg px-2 py-1 outline-none"
                    >
                        <option>Friendly</option>
                        <option>Fast</option>
                        <option>Detailed</option>
                        <option>Parent</option>
                    </select>
                </div>

                 {/* Privacy Toggle */}
                 <div className="glass-panel p-4 rounded-xl border border-white/5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-cyber-pink/10 flex items-center justify-center text-cyber-pink"><Shield size={20} /></div>
                        <div>
                            <p className="text-white font-bold text-sm">Privacy Mode</p>
                            <p className="text-slate-500 text-xs">Hide stats from leaderboard</p>
                        </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" checked={settings.privacyMode} onChange={(e) => handleSettingChange('privacyMode', e.target.checked)} className="sr-only peer" />
                        <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyber-pink"></div>
                    </label>
                </div>
            </div>

            {/* 4. Save Button */}
            <button 
                onClick={handleSave}
                disabled={loading || !!nameError}
                className="w-full py-4 rounded-xl bg-gradient-to-r from-cyber-cyan to-cyber-purple font-display font-bold text-white uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(0,243,255,0.4)] hover:shadow-[0_0_35px_rgba(0,243,255,0.6)] transition-all active:scale-95 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? <span className="animate-pulse">Saving Neural Data...</span> : <><Save size={20} /> Save Changes</>}
            </button>

        </div>
    </div>
  );
};

