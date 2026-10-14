
import React, { useState } from 'react';
import { Swords, Copy, ArrowRight, User, Trophy, Zap, Clock } from 'lucide-react';

export const QuizChallenge: React.FC = () => {
    const [mode, setMode] = useState<'MENU' | 'CREATE' | 'JOIN' | 'LOBBY' | 'PLAYING' | 'RESULT'>('MENU');
    const [code, setCode] = useState('');
    const [joinInput, setJoinInput] = useState('');
    const [opponent, setOpponent] = useState<string | null>(null);
    const [myScore, setMyScore] = useState(0);
    const [oppScore, setOppScore] = useState(0);

    const generateCode = () => {
        const newCode = Math.random().toString(36).substring(2, 8).toUpperCase();
        setCode(newCode);
        setMode('LOBBY');
        // Simulate opponent joining after 3 seconds
        setTimeout(() => {
            setOpponent('Unit 734');
        }, 3000);
    };

    const joinGame = () => {
        if (!joinInput.trim()) return;
        setMode('LOBBY');
        setOpponent('Host User');
        setCode(joinInput);
    };

    const startGame = () => {
        setMode('PLAYING');
        // Simulate a game
        setTimeout(() => {
            setMyScore(Math.floor(Math.random() * 100));
            setOppScore(Math.floor(Math.random() * 100));
            setMode('RESULT');
        }, 3000); // Fast forward for UI demo
    };

    return (
        <div className="h-full w-full bg-[#020617] flex flex-col items-center justify-center p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#0f172a_0%,_#020617_80%)]"></div>
            
            {/* Background effects */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyber-cyan via-cyber-purple to-cyber-pink animate-pulse"></div>

            {mode === 'MENU' && (
                <div className="z-10 w-full max-w-md space-y-8 animate-in zoom-in-95 duration-300">
                    <div className="text-center">
                        <div className="w-24 h-24 mx-auto bg-cyber-purple/10 border border-cyber-purple rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_#9d00ff]">
                            <Swords size={48} className="text-cyber-purple" />
                        </div>
                        <h1 className="text-4xl font-display font-bold text-white tracking-widest uppercase mb-2">Quiz Battle</h1>
                        <p className="text-slate-400 text-sm">Challenge friends in real-time 1v1 duels.</p>
                    </div>

                    <div className="grid gap-4">
                        <button 
                            onClick={generateCode}
                            className="w-full py-5 bg-gradient-to-r from-cyber-cyan to-blue-600 rounded-2xl font-bold text-white text-lg uppercase tracking-widest shadow-[0_0_20px_rgba(0,243,255,0.3)] hover:scale-105 transition-transform"
                        >
                            Create Challenge
                        </button>
                        <button 
                            onClick={() => setMode('JOIN')}
                            className="w-full py-5 bg-black/40 border border-white/20 rounded-2xl font-bold text-slate-300 text-lg uppercase tracking-widest hover:bg-white/10 hover:border-white transition-all"
                        >
                            Join with Code
                        </button>
                    </div>
                </div>
            )}

            {mode === 'JOIN' && (
                <div className="z-10 w-full max-w-sm glass-panel p-8 rounded-3xl border border-white/10 text-center animate-in slide-in-from-bottom-4">
                    <h2 className="text-2xl font-bold text-white mb-6">Enter Battle Code</h2>
                    <input 
                        type="text" 
                        value={joinInput}
                        onChange={(e) => setJoinInput(e.target.value.toUpperCase())}
                        placeholder="XK9-29A"
                        className="w-full bg-black/50 border border-white/20 rounded-xl py-4 text-center text-2xl font-mono text-cyber-cyan uppercase tracking-widest mb-6 focus:border-cyber-cyan outline-none"
                    />
                    <button 
                        onClick={joinGame}
                        className="w-full py-3 bg-cyber-cyan text-black font-bold rounded-xl uppercase tracking-widest hover:shadow-[0_0_15px_#00f3ff] transition-all"
                    >
                        Enter Arena
                    </button>
                    <button onClick={() => setMode('MENU')} className="mt-4 text-slate-500 text-xs hover:text-white">Cancel</button>
                </div>
            )}

            {mode === 'LOBBY' && (
                <div className="z-10 w-full max-w-md text-center animate-in fade-in duration-500">
                    <h2 className="text-slate-400 text-sm uppercase tracking-widest mb-2">Battle Code</h2>
                    <div className="flex items-center justify-center gap-3 mb-10">
                        <span className="text-5xl font-mono font-bold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">{code}</span>
                        <button className="text-slate-500 hover:text-white"><Copy size={20} /></button>
                    </div>

                    <div className="flex justify-between items-center mb-12 px-8">
                        <div className="flex flex-col items-center gap-2">
                            <div className="w-20 h-20 rounded-full border-2 border-cyber-cyan bg-cyber-cyan/10 flex items-center justify-center">
                                <img src="https://ui-avatars.com/api/?name=You&background=00f3ff&color=000" className="w-full h-full rounded-full opacity-80" />
                            </div>
                            <span className="text-cyber-cyan font-bold text-sm">YOU</span>
                        </div>
                        
                        <div className="flex flex-col items-center">
                            <div className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center text-black font-bold text-xl animate-bounce">VS</div>
                        </div>

                        <div className="flex flex-col items-center gap-2">
                            <div className={`w-20 h-20 rounded-full border-2 flex items-center justify-center transition-all ${opponent ? 'border-cyber-pink bg-cyber-pink/10' : 'border-white/10 border-dashed animate-pulse'}`}>
                                {opponent ? (
                                    <img src="https://ui-avatars.com/api/?name=OP&background=ff003c&color=fff" className="w-full h-full rounded-full opacity-80" />
                                ) : (
                                    <User size={32} className="text-slate-600" />
                                )}
                            </div>
                            <span className={`font-bold text-sm ${opponent ? 'text-cyber-pink' : 'text-slate-600'}`}>{opponent || 'Waiting...'}</span>
                        </div>
                    </div>

                    {opponent && (
                        <button 
                            onClick={startGame}
                            className="w-full py-4 bg-red-600 hover:bg-red-500 text-white font-display font-bold text-2xl uppercase tracking-[0.2em] rounded-xl shadow-[0_0_30px_#ef4444] transition-all animate-pulse"
                        >
                            Start Battle
                        </button>
                    )}
                    <p className="mt-6 text-slate-500 text-xs">Share the code to invite a friend.</p>
                </div>
            )}

            {mode === 'PLAYING' && (
                <div className="text-center z-10">
                    <h2 className="text-4xl font-bold text-white mb-4 animate-pulse">Battle in Progress...</h2>
                    <div className="w-64 h-2 bg-white/10 rounded-full overflow-hidden mx-auto">
                        <div className="h-full bg-cyber-cyan animate-[width_3s_linear_infinite]" style={{ width: '100%' }}></div>
                    </div>
                </div>
            )}

            {mode === 'RESULT' && (
                <div className="z-10 w-full max-w-lg glass-panel p-8 rounded-3xl border border-white/10 text-center animate-in zoom-in-95">
                    <div className="mb-8">
                        {myScore > oppScore ? (
                            <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-cyber-yellow/20 border border-cyber-yellow text-cyber-yellow font-bold uppercase tracking-widest mb-4">
                                <Trophy size={18} /> You Won!
                            </div>
                        ) : (
                            <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-red-500/20 border border-red-500 text-red-500 font-bold uppercase tracking-widest mb-4">
                                Defeated
                            </div>
                        )}
                        <h2 className="text-3xl font-display font-bold text-white">Battle Results</h2>
                    </div>

                    <div className="flex items-center justify-center gap-12 mb-10">
                        <div className="text-center">
                            <div className="text-5xl font-bold text-cyber-cyan mb-2 drop-shadow-[0_0_10px_#00f3ff]">{myScore}</div>
                            <div className="text-xs text-slate-400 uppercase tracking-widest">Your Score</div>
                        </div>
                        <div className="h-16 w-px bg-white/10"></div>
                        <div className="text-center">
                            <div className="text-5xl font-bold text-cyber-pink mb-2 drop-shadow-[0_0_10px_#ff003c]">{oppScore}</div>
                            <div className="text-xs text-slate-400 uppercase tracking-widest">Opponent</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-8">
                        <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                            <div className="text-xs text-slate-500 mb-1">Time Taken</div>
                            <div className="text-white font-mono">04:23</div>
                        </div>
                        <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                            <div className="text-xs text-slate-500 mb-1">Accuracy</div>
                            <div className="text-white font-mono">85%</div>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button onClick={() => setMode('MENU')} className="flex-1 py-3 border border-white/20 rounded-xl text-white hover:bg-white/5 transition-all">Main Menu</button>
                        <button onClick={() => { setMode('LOBBY'); setOpponent(null); }} className="flex-1 py-3 bg-cyber-cyan text-black font-bold rounded-xl hover:shadow-[0_0_15px_#00f3ff] transition-all">Rematch</button>
                    </div>
                </div>
            )}
        </div>
    );
};
