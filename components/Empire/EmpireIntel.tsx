
import React from 'react';
import { Database, Info, Shield, HelpCircle, ChevronRight, Zap } from 'lucide-react';

export const EmpireIntel: React.FC = () => {
    return (
        <div className="h-full w-full bg-[#02040a] p-6 overflow-y-auto custom-scrollbar relative">
            <div className="absolute top-0 right-0 w-64 h-64 bg-cyber-purple/10 rounded-full blur-[80px] pointer-events-none"></div>
            
            <div className="max-w-xl mx-auto space-y-10 py-6">
                <header className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-cyber-purple/10 border border-cyber-purple/30 text-cyber-purple shadow-[0_0_20px_rgba(157,0,255,0.2)]">
                        <Database size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-display font-black text-white uppercase tracking-widest italic">EMPIRE INTEL</h1>
                        <p className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">System Documentation & Market Data</p>
                    </div>
                </header>

                <div className="space-y-4">
                    <IntelCard 
                        title="What are BrainCoins (BC)?" 
                        text="BC is the liquid fuel of your knowledge empire. Unlike other currencies, it cannot be bought. It is minted through accuracy. 90%+ accuracy grants 2x yields, while random guessing (<40%) incurs heavy leakage penalties." 
                    />
                    <IntelCard 
                        title="Sector Stability" 
                        text="Every chapter (floor) has a stability rating. Ignoring a chapter for too long or performing poorly in sessions causes stability to drop. Low stability leads to BC leakage every 24 hours." 
                    />
                    <IntelCard 
                        title="Building Tiers" 
                        text="Buildings evolve as you master more chapters. Level 1 is a local institute, while Level 10 is an AI-Governed Knowledge Hub. Higher levels unlock tougher 'Advanced' floors with 5x BC rewards." 
                    />
                </div>

                <div className="p-6 bg-cyber-cyan/5 border border-cyber-cyan/20 rounded-[32px] relative overflow-hidden">
                    <Zap className="absolute top-4 right-4 text-cyber-cyan opacity-20" size={40} />
                    <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-2">Tactical Advantage</h4>
                    <p className="text-slate-400 text-xs leading-relaxed italic">
                        "Operatives who focus on 'Heavy' and 'Integer' question types see a 40% faster empire expansion rate compared to standard MCQ farming."
                    </p>
                </div>
            </div>
        </div>
    );
};

const IntelCard = ({ title, text }: any) => (
    <div className="glass-panel p-6 rounded-3xl border border-white/5 space-y-3">
        <h3 className="text-white font-bold text-sm uppercase tracking-widest flex items-center justify-between">
            {title} <ChevronRight size={14} className="text-slate-700" />
        </h3>
        <p className="text-slate-400 text-xs leading-relaxed">{text}</p>
    </div>
);
