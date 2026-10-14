
import React from 'react';
import { Crown, Star, Shield, Zap, Sparkles, Lock } from 'lucide-react';
import { EmpireState } from '../../types';
import { ZUAKI_CARDS } from '../../services/empireService';

export const EmpireAssets: React.FC<{ state: EmpireState }> = ({ state }) => {
    return (
        <div className="h-full w-full bg-[#02040a] p-6 overflow-y-auto custom-scrollbar">
            <div className="max-w-2xl mx-auto space-y-10 py-6">
                <header className="flex items-center gap-4">
                    <div className="p-3 rounded-2xl bg-cyber-yellow/10 border border-cyber-yellow/30 text-cyber-yellow shadow-[0_0_20px_rgba(252,238,10,0.2)]">
                        <Crown size={24} />
                    </div>
                    <div>
                        <h1 className="text-2xl font-display font-black text-white uppercase tracking-widest italic">SOVEREIGN ASSETS</h1>
                        <p className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">Collected Zuaki Encouragement Cards</p>
                    </div>
                </header>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {ZUAKI_CARDS.map(card => {
                        const isUnlocked = state.collectedCards.includes(card.id);
                        return (
                            <div key={card.id} className={`relative p-0.5 rounded-[40px] bg-gradient-to-br ${
                                isUnlocked 
                                ? card.rarity === 'MYTHIC' ? 'from-cyber-pink to-cyber-purple' : 'from-cyber-cyan to-blue-600'
                                : 'from-slate-800 to-slate-900 opacity-40'
                            }`}>
                                <div className="h-full bg-[#050818] rounded-[38px] p-8 flex flex-col items-center text-center space-y-6 overflow-hidden relative">
                                    {!isUnlocked && (
                                        <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/60">
                                            <Lock size={32} className="text-slate-600" />
                                        </div>
                                    )}
                                    <div className={`p-4 rounded-full ${isUnlocked ? 'bg-white/5' : ''}`}>
                                        {card.rarity === 'MYTHIC' ? <Crown className="text-cyber-yellow" size={40} /> : <Zap className="text-cyber-cyan" size={40} />}
                                    </div>
                                    <div>
                                        <span className={`text-[8px] font-black uppercase tracking-[0.3em] ${isUnlocked ? 'text-cyber-cyan' : 'text-slate-600'}`}>
                                            {card.rarity} ASSET
                                        </span>
                                        <h3 className="text-white font-display font-bold text-xl uppercase tracking-widest mt-1">{card.title}</h3>
                                    </div>
                                    <p className="text-slate-400 text-xs italic leading-relaxed">"{card.quote}"</p>
                                    <div className="pt-4 border-t border-white/5 w-full">
                                        <p className="text-[9px] text-slate-600 font-mono uppercase">Zuaki Encouragement Signature</p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="p-8 text-center glass-panel border border-white/5 rounded-[40px] space-y-4">
                    <Sparkles className="text-cyber-purple mx-auto" />
                    <h4 className="text-white font-bold text-sm uppercase tracking-widest">More Assets Incoming</h4>
                    <p className="text-slate-500 text-[10px] leading-relaxed">
                        Earn Mythic cards by achieving a 100% accuracy streak in any 'Advanced' sector session.
                    </p>
                </div>
            </div>
        </div>
    );
};
