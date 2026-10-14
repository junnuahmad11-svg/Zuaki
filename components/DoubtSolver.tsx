
import React, { useState } from 'react';
import { Bot, PlayCircle, BookOpen, ArrowRight, Search, Zap } from 'lucide-react';
import { getGenZResponse } from '../services/geminiService';
import { youtube } from '../services/backend';

export const DoubtSolver: React.FC = () => {
    const [query, setQuery] = useState('');
    const [step, setStep] = useState<'INPUT' | 'PROCESSING' | 'RESULT'>('INPUT');
    const [aiExplanation, setAiExplanation] = useState('');
    const [formulas, setFormulas] = useState<string[]>([]);
    const [videos, setVideos] = useState<any[]>([]);

    const handleSolve = async () => {
        if (!query.trim()) return;
        setStep('PROCESSING');

        try {
            // 1. Get AI Explanation & Formulas
            const prompt = `Student asked: "${query}". 
            Provide a clear step-by-step explanation suitable for JEE aspirants. 
            Also extract key formulas used as a JSON array at the end of response like this: |||FORMULAS=["F=ma", "E=mc^2"]|||`;
            
            const rawResponse = await getGenZResponse(prompt);
            
            // Extract formulas hackily for demo
            const formulaMatch = rawResponse.match(/\|\|\|FORMULAS=(.*)\|\|\|/);
            let extractedFormulas = [];
            let cleanText = rawResponse;

            if (formulaMatch) {
                try {
                    extractedFormulas = JSON.parse(formulaMatch[1]);
                    cleanText = rawResponse.replace(formulaMatch[0], '');
                } catch (e) { console.log(e); }
            } else {
                // Fallback extraction
                if (cleanText.includes('Formula:')) {
                    extractedFormulas.push('See explanation for details');
                }
            }

            setAiExplanation(cleanText);
            setFormulas(extractedFormulas);

            // 2. Fetch Youtube
            // Fix: remove redundant API key argument as youtube.searchVideos expects only 1 argument (query: string)
            const vids = await youtube.searchVideos(query);
            setVideos(vids);
            
            setStep('RESULT');
        } catch (e) {
            console.error(e);
            setStep('INPUT');
        }
    };

    return (
        <div className="h-full w-full bg-[#020617] flex flex-col p-6 overflow-y-auto custom-scrollbar relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_#0f172a_0%,_#020617_80%)]"></div>

            {step === 'INPUT' && (
                <div className="flex-1 flex flex-col justify-center max-w-2xl mx-auto w-full relative z-10 py-10">
                    <div className="text-center mb-10">
                        <div className="w-20 h-20 mx-auto rounded-full bg-cyber-purple/10 border border-cyber-purple flex items-center justify-center text-cyber-purple mb-4 shadow-[0_0_30px_rgba(157,0,255,0.3)]">
                            <Bot size={40} />
                        </div>
                        <h1 className="text-3xl font-display font-bold text-white uppercase tracking-widest mb-2">GenZ Doubt Solver</h1>
                        <p className="text-slate-400">Ask any Physics, Chemistry, or Math question.</p>
                    </div>

                    <div className="relative">
                        <textarea 
                            value={query}
                            onChange={e => setQuery(e.target.value)}
                            placeholder="Type your question here (e.g., How to find moment of inertia of a ring?)"
                            className="w-full h-40 bg-black/40 border border-white/10 rounded-2xl p-6 text-white placeholder-slate-600 focus:outline-none focus:border-cyber-purple focus:shadow-[0_0_20px_rgba(157,0,255,0.2)] resize-none font-mono text-sm"
                        />
                        <button 
                            onClick={handleSolve}
                            className="absolute bottom-4 right-4 p-3 rounded-xl bg-cyber-purple text-white hover:bg-purple-600 transition-all shadow-lg"
                        >
                            <ArrowRight size={24} />
                        </button>
                    </div>
                </div>
            )}

            {step === 'PROCESSING' && (
                <div className="flex-1 flex flex-col items-center justify-center relative z-10">
                    <div className="w-16 h-16 border-4 border-cyber-purple border-t-transparent rounded-full animate-spin mb-6"></div>
                    <h2 className="text-xl font-display font-bold text-white animate-pulse">Analyzing Concept...</h2>
                    <p className="text-slate-500 text-xs mt-2 font-mono">Scanning Formula Database & Video Archives</p>
                </div>
            )}

            {step === 'RESULT' && (
                <div className="flex-1 overflow-y-auto custom-scrollbar relative z-10 max-w-4xl mx-auto w-full">
                    <button onClick={() => setStep('INPUT')} className="mb-6 text-slate-400 hover:text-white flex items-center gap-2 text-xs uppercase tracking-widest font-bold">
                        <ArrowRight size={14} className="rotate-180" /> Ask Another
                    </button>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Explanation Column */}
                        <div className="lg:col-span-2 space-y-6">
                            <div className="glass-panel p-6 rounded-2xl border border-white/10">
                                <h3 className="text-cyber-cyan font-bold mb-4 flex items-center gap-2">
                                    <Bot size={18} /> AI Explanation
                                </h3>
                                <div className="prose prose-invert prose-sm max-w-none text-slate-300 whitespace-pre-wrap">
                                    {aiExplanation}
                                </div>
                            </div>

                            {formulas.length > 0 && (
                                <div className="glass-panel p-6 rounded-2xl border border-cyber-pink/30 bg-cyber-pink/5">
                                    <h3 className="text-cyber-pink font-bold mb-4 flex items-center gap-2">
                                        <Zap size={18} /> Key Formulas
                                    </h3>
                                    <div className="grid gap-3">
                                        {formulas.map((f, i) => (
                                            <div key={i} className="p-3 bg-black/40 rounded-lg text-white font-mono text-center border border-white/5 text-lg">
                                                {f}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Video Column */}
                        <div className="space-y-4 pb-10">
                            <h3 className="text-white font-bold flex items-center gap-2">
                                <PlayCircle size={18} className="text-red-500" /> Video Solutions
                            </h3>
                            {videos.map((video) => (
                                <a 
                                    key={video.id}
                                    href="#"
                                    className="block glass-panel p-3 rounded-xl border border-white/5 hover:border-white/20 transition-all group"
                                >
                                    <div className="relative mb-2 aspect-video rounded-lg overflow-hidden bg-black">
                                        <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <PlayCircle size={32} className="text-white opacity-50 group-hover:opacity-100 transition-opacity" />
                                        </div>
                                    </div>
                                    <h4 className="text-white font-bold text-xs line-clamp-2 mb-1 group-hover:text-cyber-cyan">{video.title}</h4>
                                    <p className="text-slate-500 text-[10px]">{video.channel} • {video.duration}</p>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
