
import React, { useState } from 'react';
import { Award, Share2, Download } from 'lucide-react';
import { statsService } from '../services/statsService';
import { UserProfile } from '../types';

export const Certificate: React.FC<{ userProfile: Partial<UserProfile> }> = ({ userProfile }) => {
    const stats = statsService.getStats();
    // Use stored join date or fallback
    const joinDate = userProfile.joinedDate ? new Date(userProfile.joinedDate) : new Date(Date.now() - 31536000000); // 1 year ago fallback
    const currentDate = new Date();
    
    // Check if 2 years have passed (approx)
    const diffTime = Math.abs(currentDate.getTime() - joinDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
    const isEligible = diffDays > 700; // ~2 years

    return (
        <div className="h-full w-full bg-[#020617] flex flex-col items-center justify-center p-6 relative overflow-hidden">
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#0f172a_0%,_#020617_80%)]"></div>

             {isEligible ? (
                 <div className="relative z-10 max-w-2xl w-full">
                     <div className="bg-[#050818] border-4 border-double border-cyber-yellow/40 p-10 rounded-sm relative shadow-[0_0_50px_rgba(252,238,10,0.2)] text-center">
                         {/* Corner Ornaments */}
                         <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-cyber-yellow"></div>
                         <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-cyber-yellow"></div>
                         <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-cyber-yellow"></div>
                         <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-cyber-yellow"></div>

                         <div className="mb-8">
                             <Award size={64} className="text-cyber-yellow mx-auto mb-4" />
                             <h1 className="text-4xl font-display font-bold text-white uppercase tracking-[0.3em] mb-2">Certificate</h1>
                             <p className="text-cyber-yellow text-sm font-mono uppercase tracking-widest">of Completion & Excellence</p>
                         </div>

                         <div className="mb-8">
                             <p className="text-slate-400 text-sm mb-4">This certifies that</p>
                             <h2 className="text-3xl font-display font-bold text-white mb-2 underline decoration-cyber-yellow/30 underline-offset-8">
                                 {userProfile.name || 'Student'}
                             </h2>
                             <p className="text-slate-400 text-sm mt-4">
                                 Has successfully completed 2 years of rigorous preparation with Zuaki.
                             </p>
                         </div>

                         <div className="grid grid-cols-3 gap-4 mb-10 border-t border-b border-white/10 py-6">
                             <div>
                                 <p className="text-cyber-cyan font-bold text-xl">{stats.level}</p>
                                 <p className="text-[10px] text-slate-500 uppercase tracking-widest">Level Reached</p>
                             </div>
                             <div>
                                 <p className="text-cyber-purple font-bold text-xl">{stats.totalTime ? Math.floor(stats.totalTime / 3600) : 0}h</p>
                                 <p className="text-[10px] text-slate-500 uppercase tracking-widest">Study Hours</p>
                             </div>
                             <div>
                                 <p className="text-cyber-pink font-bold text-xl">{stats.quizzesAttempted}</p>
                                 <p className="text-[10px] text-slate-500 uppercase tracking-widest">Quizzes Crushed</p>
                             </div>
                         </div>

                         <div className="flex justify-between items-end">
                             <div className="text-left">
                                 <p className="text-xs text-slate-500">Date Issued</p>
                                 <p className="text-white font-mono">{currentDate.toLocaleDateString()}</p>
                             </div>
                             <div className="text-right">
                                 <div className="h-10 w-32 bg-white/5 mb-2"></div> {/* Fake Signature */}
                                 <p className="text-xs text-slate-500">Zuaki Founders</p>
                             </div>
                         </div>
                     </div>

                     <div className="flex justify-center gap-4 mt-8">
                         <button className="px-6 py-3 bg-cyber-yellow text-black font-bold rounded-xl flex items-center gap-2 hover:bg-yellow-400">
                             <Download size={18} /> Download
                         </button>
                         <button className="px-6 py-3 bg-white/10 text-white font-bold rounded-xl flex items-center gap-2 hover:bg-white/20">
                             <Share2 size={18} /> Share
                         </button>
                     </div>
                 </div>
             ) : (
                 <div className="text-center z-10 max-w-md p-8 glass-panel rounded-3xl border border-white/10">
                     <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                         <Award size={32} className="text-slate-500" />
                     </div>
                     <h2 className="text-2xl font-bold text-white mb-2">Certificate Locked</h2>
                     <p className="text-slate-400 mb-6">
                         This legendary item is awarded to operatives who have been with Zuaki for 2 years. Keep studying!
                     </p>
                     <div className="w-full bg-black/40 h-2 rounded-full overflow-hidden mb-2">
                         <div className="h-full bg-cyber-yellow" style={{width: `${(diffDays/730)*100}%`}}></div>
                     </div>
                     <p className="text-xs text-cyber-yellow font-mono text-right">{diffDays} / 730 Days</p>
                 </div>
             )}
        </div>
    );
};
