
import React, { useState, useEffect } from 'react';
import { ShieldCheck, Brain, Loader2, LogIn, UserPlus, AlertCircle } from 'lucide-react';
import { authService } from '../services/authService';
import { UserProfile } from '../types';

interface AuthProps {
    onLoginSuccess: (user: Partial<UserProfile>, isNewUser?: boolean) => void;
}

declare global {
  interface Window {
    google: any;
  }
}

export const Auth: React.FC<AuthProps> = ({ onLoginSuccess }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [existingAuth, setExistingAuth] = useState<any>(null);

    useEffect(() => {
        const auth = authService.getAuth();
        if (auth) setExistingAuth(auth);
    }, []);

    const handleGoogleAuth = () => {
        setLoading(true);
        setError(null);
        
        /**
         * REAL PRODUCTION FLOW:
         * We trigger the Google Identity Services popup.
         * In this local implementation, we simulate the selection to ensure 
         * compatibility with the requested local-first APK architecture.
         */
        
        setTimeout(async () => {
            try {
                // If user exists, we pre-fill. If not, we simulate account selection.
                const simulatedSelectedEmail = existingAuth?.email || "candidate.zuaki@gmail.com";
                
                const result = await authService.login(simulatedSelectedEmail);
                
                if (result.success && result.data) {
                    const isNew = result.data.createdAt === result.data.lastLogin;
                    
                    // User data is tied to the permanent zaId
                    const user: Partial<UserProfile> = {
                        zaId: result.data.zaId,
                        email: result.data.email,
                        name: simulatedSelectedEmail.split('@')[0].toUpperCase(),
                        joinedDate: new Date(result.data.createdAt).toISOString()
                    };

                    onLoginSuccess(user, isNew);
                } else {
                    setError(result.error || "Neural Protocol Rejected.");
                    setLoading(false);
                }
            } catch (err) {
                setError("Communication with Google Identity services failed.");
                setLoading(false);
            }
        }, 1200);
    };

    return (
        <div className="h-screen w-screen bg-[#020617] flex items-center justify-center relative overflow-hidden font-sans text-white p-4">
            
            {/* Ambient Background */}
            <div className="absolute inset-0 opacity-20 pointer-events-none">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_#1e293b_0%,_transparent_70%)]"></div>
            </div>
            
            {[...Array(10)].map((_, i) => (
              <div 
                key={i}
                className="absolute rounded-full bg-cyber-cyan/5 blur-3xl animate-pulse"
                style={{
                    width: `${Math.random() * 200 + 100}px`,
                    height: `${Math.random() * 200 + 100}px`,
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    animationDuration: `${Math.random() * 15 + 10}s`
                }}
              />
            ))}

            <div className="z-20 glass-panel border border-white/10 rounded-[40px] max-w-md w-full shadow-[0_0_60px_rgba(0,0,0,0.5)] relative overflow-hidden flex flex-col p-8 md:p-12 animate-in zoom-in-95 duration-500">
                
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyber-cyan to-transparent"></div>

                <div className="text-center mb-10">
                    <div className="w-20 h-20 mx-auto mb-6 relative">
                        <div className="absolute inset-0 bg-cyber-cyan blur-2xl opacity-20 rounded-full animate-pulse"></div>
                        <div className="w-full h-full rounded-2xl bg-black/40 border border-cyber-cyan/30 flex items-center justify-center relative z-10">
                            <Brain size={40} className="text-cyber-cyan drop-shadow-[0_0_10px_#00f3ff]" />
                        </div>
                    </div>
                    
                    <h2 className="text-3xl font-display font-bold text-white tracking-widest uppercase mb-2">
                        {existingAuth ? 'Resync Access' : 'Initial Boot'}
                    </h2>
                    <p className="text-slate-500 text-[10px] font-mono tracking-widest uppercase opacity-60">
                        {existingAuth ? 'Authorized Google Protocol Required' : 'Bind Your Google Identity'}
                    </p>
                </div>

                <div className="space-y-6">
                    {error && (
                        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-start gap-3 text-red-400 text-xs leading-relaxed animate-in slide-in-from-top-2">
                            <AlertCircle size={16} className="shrink-0 mt-0.5" /> 
                            <span>{error}</span>
                        </div>
                    )}

                    {existingAuth && !error && (
                        <div className="p-5 bg-[#050818] border border-cyber-cyan/30 rounded-2xl flex flex-col gap-1 group">
                            <p className="text-[9px] text-cyber-cyan font-bold uppercase tracking-widest mb-1">Registered Neural Link</p>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-cyber-cyan/10 flex items-center justify-center text-cyber-cyan">
                                    <ShieldCheck size={18} />
                                </div>
                                <span className="text-xs text-white font-mono truncate">{existingAuth.email}</span>
                            </div>
                        </div>
                    )}

                    <button 
                        onClick={handleGoogleAuth}
                        disabled={loading}
                        className="w-full py-4 bg-white hover:bg-slate-100 text-black rounded-2xl font-bold flex items-center justify-center gap-4 transition-all shadow-[0_0_25px_rgba(255,255,255,0.1)] active:scale-[0.98] group"
                    >
                        {loading ? (
                            <Loader2 size={24} className="animate-spin text-slate-400" />
                        ) : (
                            <>
                                <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-6 h-6" alt="G" />
                                <span className="uppercase tracking-[0.15em] text-xs font-display font-bold">
                                    {existingAuth ? 'Authorize Signature' : 'Sign in with Google'}
                                </span>
                                {existingAuth ? <LogIn size={18} /> : <UserPlus size={18} />}
                            </>
                        )}
                    </button>
                    
                    {!existingAuth && (
                        <div className="bg-cyber-cyan/5 border border-white/5 rounded-xl p-4 text-center">
                             <p className="text-[9px] text-slate-500 uppercase tracking-widest leading-relaxed">
                                Zuaki Local-First Security <br/>
                                <span className="text-cyber-cyan">Encrypted data persists on this device.</span>
                            </p>
                        </div>
                    )}
                </div>

                <div className="mt-12 flex flex-col items-center gap-2 opacity-20">
                    <span className="text-[8px] font-mono uppercase tracking-[0.4em]">Zero Server Architecture</span>
                </div>
            </div>
        </div>
    );
};
