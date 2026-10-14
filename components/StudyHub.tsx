
import React, { useState } from 'react';
import { Youtube, Music, BookOpen, PlayCircle, ExternalLink, Search, FileText, Zap, Library } from 'lucide-react';
import { ViewState } from '../types';

interface StudyHubProps {
    onChangeView?: (view: ViewState) => void;
}

export const StudyHub: React.FC<StudyHubProps> = ({ onChangeView }) => {
  return (
    <div className="h-full w-full bg-[#020617] p-6 overflow-y-auto custom-scrollbar relative">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#0f172a_0%,_#020617_80%)] pointer-events-none"></div>
        
        <div className="max-w-5xl mx-auto relative z-10">
            <div className="mb-10 text-center">
                <h1 className="text-4xl font-display font-bold text-white uppercase tracking-widest mb-2">Resource Command</h1>
                <p className="text-slate-400">High-yield content to boost your rank.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                
                {/* Short Notes Card (NEW) */}
                <div 
                    onClick={() => onChangeView?.(ViewState.SHORT_NOTES)}
                    className="glass-panel p-6 rounded-3xl border border-white/10 hover:border-green-500/50 cursor-pointer group transition-all relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-green-500/10 rounded-full blur-[50px] -mr-10 -mt-10 group-hover:bg-green-500/20 transition-all"></div>
                    <div className="w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-500 mb-6 group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(34,197,94,0.2)]">
                        <FileText size={28} fill="currentColor" />
                    </div>
                    <h2 className="text-xl font-bold text-white mb-2">Short Notes</h2>
                    <p className="text-slate-400 text-xs mb-6 h-10">Concise chapter-wise summaries for quick revision.</p>
                    <span className="text-green-500 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                        Read Notes <ExternalLink size={12} />
                    </span>
                </div>

                {/* Formula Flashcards Card */}
                <div 
                    onClick={() => onChangeView?.(ViewState.FORMULA_FLASHCARDS)}
                    className="glass-panel p-6 rounded-3xl border border-white/10 hover:border-cyber-cyan/50 cursor-pointer group transition-all relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-cyber-cyan/10 rounded-full blur-[50px] -mr-10 -mt-10 group-hover:bg-cyber-cyan/20 transition-all"></div>
                    <div className="w-14 h-14 rounded-2xl bg-cyber-cyan/10 flex items-center justify-center text-cyber-cyan mb-6 group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(0,243,255,0.2)]">
                        <Zap size={28} fill="currentColor" />
                    </div>
                    <h2 className="text-xl font-bold text-white mb-2">Formula Cards</h2>
                    <p className="text-slate-400 text-xs mb-6 h-10">Master JEE concepts with interactive flip cards.</p>
                    <span className="text-cyber-cyan text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                        Start Flipping <ExternalLink size={12} />
                    </span>
                </div>

                {/* Formula Vault Card */}
                <div 
                    onClick={() => onChangeView?.(ViewState.FORMULA_VAULT)}
                    className="glass-panel p-6 rounded-3xl border border-white/10 hover:border-cyber-purple/50 cursor-pointer group transition-all relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-cyber-purple/10 rounded-full blur-[50px] -mr-10 -mt-10 group-hover:bg-cyber-purple/20 transition-all"></div>
                    <div className="w-14 h-14 rounded-2xl bg-cyber-purple/10 flex items-center justify-center text-cyber-purple mb-6 group-hover:scale-110 transition-transform shadow-[0_0_20px_#9d00ff33]">
                        <BookOpen size={28} />
                    </div>
                    <h2 className="text-xl font-bold text-white mb-2">Formula Vault</h2>
                    <p className="text-slate-400 text-xs mb-6 h-10">Physics, Chem, Maths formulas in downloadable neon PDFs.</p>
                    <span className="text-cyber-purple text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                        Open Vault <ExternalLink size={12} />
                    </span>
                </div>

                {/* ZukaiTube Card */}
                <div 
                    onClick={() => onChangeView?.(ViewState.ZUKAI_TUBE)}
                    className="glass-panel p-6 rounded-3xl border border-white/10 hover:border-red-500/50 cursor-pointer group transition-all relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 rounded-full blur-[50px] -mr-10 -mt-10 group-hover:bg-red-600/20 transition-all"></div>
                    <div className="w-14 h-14 rounded-2xl bg-red-600/10 flex items-center justify-center text-red-500 mb-6 group-hover:scale-110 transition-transform">
                        <Youtube size={28} />
                    </div>
                    <h2 className="text-xl font-bold text-white mb-2">ZukaiTube</h2>
                    <p className="text-slate-400 text-xs mb-6 h-10">Curated One-Shots, Topic Deep Dives, and Strategy Videos.</p>
                    <span className="text-red-500 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                        Watch Now <ExternalLink size={12} />
                    </span>
                </div>

                {/* Motivation Zone */}
                <div 
                    onClick={() => onChangeView?.(ViewState.MOTIVATION)}
                    className="glass-panel p-6 rounded-3xl border border-white/10 hover:border-cyber-yellow/50 cursor-pointer group transition-all relative overflow-hidden"
                >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-cyber-yellow/10 rounded-full blur-[50px] -mr-10 -mt-10 group-hover:bg-cyber-yellow/20 transition-all"></div>
                    <div className="w-14 h-14 rounded-2xl bg-cyber-yellow/10 flex items-center justify-center text-cyber-yellow mb-6 group-hover:scale-110 transition-transform">
                        <Music size={28} />
                    </div>
                    <h2 className="text-xl font-bold text-white mb-2">Motivation</h2>
                    <p className="text-slate-400 text-xs mb-6 h-10">Beats to study to, Speeches to fire you up.</p>
                    <span className="text-cyber-yellow text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                        Enter Zone <ExternalLink size={12} />
                    </span>
                </div>
            </div>
        </div>
    </div>
  );
};
