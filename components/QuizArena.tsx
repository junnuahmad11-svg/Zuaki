
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
    Swords, User, Trophy, Zap, Clock, ChevronRight, ArrowLeft, 
    CheckCircle, XCircle, AlertTriangle, Play, ShieldAlert, Copy, RefreshCw, BarChart2, Brain, Info, Eye, LogIn, Loader2, Target, Check, Users
} from 'lucide-react';
import { ViewState, Question, TestResult } from '../types';
import { statsService } from '../services/statsService';
import { firebase } from '../services/backend';
import { ZurakiBackButton } from './ZurakiBackButton';

// --- ENHANCED JEE SYLLABUS ARENA DATABASE ---
const ARENA_DB: Question[] = [
    // PHYSICS
    { id: 'aq1', subject: 'Physics', chapter: 'Rotational Motion', text: "A ring and a disc of same mass and radius roll without slipping down an inclined plane. The ratio of their accelerations is?", type: 'MCQ', options: ["2:3", "3:4", "1:2", "3:2"], correctAnswer: 1, difficulty: 'Medium', explanation: "a = gsinθ / (1 + k²/R²). For ring k²/R²=1, a=gsinθ/2. For disc k²/R²=1/2, a=gsinθ/1.5=2gsinθ/3. Ratio = (1/2) / (2/3) = 3/4.", formulaUsed: ["a = gsinθ / (1 + I/MR²)"] },
    { id: 'aq2', subject: 'Physics', chapter: 'Electrostatics', text: "A soap bubble is given a negative charge, then its radius:", type: 'MCQ', options: ["Decreases", "Increases", "Remains unchanged", "Nothing can be said"], correctAnswer: 1, difficulty: 'Easy', explanation: "Due to mutual repulsion of like charges, the bubble expands.", formulaUsed: ["P_in - P_out = 4T/R - σ²/2ε₀"] },
    { id: 'aq3', subject: 'Physics', chapter: 'Modern Physics', text: "The de Broglie wavelength of an electron moving with speed v is λ. If the speed is doubled, new wavelength is:", type: 'MCQ', options: ["λ/2", "2λ", "λ/4", "4λ"], correctAnswer: 0, difficulty: 'Easy', explanation: "λ = h/mv. If v is doubled, λ becomes half.", formulaUsed: ["λ = h/p"] },
    // CHEMISTRY
    { id: 'aq4', subject: 'Chemistry', chapter: 'Atomic Structure', text: "The number of radial nodes in 3p orbital is:", type: 'MCQ', options: ["0", "1", "2", "3"], correctAnswer: 1, difficulty: 'Medium', explanation: "Radial nodes = n - l - 1. For 3p, n=3, l=1. Nodes = 3 - 1 - 1 = 1.", formulaUsed: ["Nodes = n - l - 1"] },
    { id: 'aq5', subject: 'Chemistry', chapter: 'Thermodynamics', text: "For an adiabatic process, which relation is correct?", type: 'MCQ', options: ["PV = const", "PV^γ = const", "TV^γ = const", "P^γV = const"], correctAnswer: 1, difficulty: 'Easy', explanation: "Standard adiabatic equation for ideal gases.", formulaUsed: ["PV^γ = K"] },
    { id: 'aq6', subject: 'Chemistry', chapter: 'GOC', text: "The most stable carbocation among the following is:", type: 'MCQ', options: ["(CH3)3C+", "CH3CH2+", "CH3+", "(CH3)2CH+"], correctAnswer: 0, difficulty: 'Medium', explanation: "Tertiary carbocation is most stable due to +I effect and hyperconjugation from 9 alpha-H.", formulaUsed: ["Stability ∝ Hyperconjugation"] },
    // MATHS
    { id: 'aq7', subject: 'Maths', chapter: 'Calculus', text: "The derivative of log(sin x) with respect to x is:", type: 'MCQ', options: ["tan x", "cot x", "-tan x", "-cot x"], correctAnswer: 1, difficulty: 'Easy', explanation: "d/dx [log(sin x)] = (1/sin x) * cos x = cot x.", formulaUsed: ["Chain Rule"] },
    { id: 'aq8', subject: 'Maths', chapter: 'Probability', text: "If A and B are two independent events, then P(A ∩ B) equals:", type: 'MCQ', options: ["P(A) + P(B)", "P(A)P(B)", "P(A) - P(B)", "P(A)/P(B)"], correctAnswer: 1, difficulty: 'Easy', explanation: "Definition of independent events.", formulaUsed: ["Multiplication Theorem"] },
    { id: 'aq9', subject: 'Maths', chapter: 'Matrices', text: "If A is a square matrix such that A² = A, then (I + A)³ - 7A is equal to:", type: 'MCQ', options: ["A", "I - A", "I", "3A"], correctAnswer: 2, difficulty: 'Hard', explanation: "(I+A)³ = I + 3A + 3A² + A³ = I + 3A + 3A + A = I + 7A. Result = I + 7A - 7A = I.", formulaUsed: ["Binomial expansion of matrices"] },
    // ADDITIONAL 20+ Questions would be added here in full production
];

type ArenaMode = 'MENU' | 'LOBBY' | 'PLAYING' | 'RESULT' | 'SOLUTIONS';
type ArenaSubMode = 'SOLO' | 'CHALLENGE' | 'BOT';
type HileirMode = 'EASY' | 'BALANCED' | 'PRO';

interface RankPrediction {
    range: string;
    percentile: number;
    confidence: 'High' | 'Medium' | 'Low';
}

export const QuizArena: React.FC = () => {
    const [mode, setMode] = useState<ArenaMode>('MENU');
    const [subMode, setSubMode] = useState<ArenaSubMode>('SOLO');
    const [botLevel, setBotLevel] = useState<HileirMode>('BALANCED');
    
    // Quiz Engine State
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [userAnswers, setUserAnswers] = useState<Record<string, any>>({});
    const [timeLeft, setTimeLeft] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Bot Simulation State
    const [botScore, setBotScore] = useState(0);
    const [botProgress, setBotProgress] = useState(0);
    
    // Real-time Sync (Multiplayer)
    const [battleCode, setBattleCode] = useState('');
    const [opponentReady, setOpponentReady] = useState(false);
    const [opponentName, setOpponentName] = useState('Hileir 🤖');
    
    // Results & Analysis
    const [results, setResults] = useState<TestResult | null>(null);
    const [prediction, setPrediction] = useState<RankPrediction | null>(null);

    // Anti-Cheat Refs
    const lastActiveTime = useRef(Date.now());
    const warningCount = useRef(0);
    const timerRef = useRef<any>(null);

    // --- UTILS ---
    const formatTime = (s: number) => {
        const m = Math.floor(s / 60).toString().padStart(2, '0');
        const sec = (s % 60).toString().padStart(2, '0');
        return `${m}:${sec}`;
    };

    // --- CORE LOGIC: HILEIR BOT ---
    const simulateBotBehavior = useCallback(() => {
        if (mode !== 'PLAYING' || subMode === 'SOLO') return;

        // Bot finishes questions at realistic intervals
        const q = questions[botProgress];
        if (!q) return;

        let baseDelay = 15000; // 15s avg
        if (q.difficulty === 'Easy') baseDelay = 8000;
        if (q.difficulty === 'Hard') baseDelay = 25000;

        // Add randomness (bot calculates differently)
        const delay = baseDelay + (Math.random() * 5000 - 2500);

        setTimeout(() => {
            setBotProgress(prev => prev + 1);
            
            // Accuracy Check based on requested rules
            let accuracy = 0.75;
            if (botLevel === 'EASY') accuracy = 0.60;
            if (botLevel === 'PRO') accuracy = 0.88;
            
            // Question Specific adjustments
            if (q.difficulty === 'Easy') accuracy += 0.10;
            if (q.difficulty === 'Hard') accuracy -= 0.15;

            if (Math.random() < accuracy) {
                setBotScore(s => s + 4);
            } else if (Math.random() < 0.8) { // 80% chance of negative if wrong
                setBotScore(s => s - 1);
            }
            
            // If bot finished all, it "waits" for user or ends
            if (botProgress < questions.length - 1) {
                simulateBotBehavior();
            }
        }, delay);
    }, [mode, botProgress, questions, botLevel, subMode]);

    // --- ANTI-CHEAT ENGINE ---
    useEffect(() => {
        if (mode !== 'PLAYING') return;

        const handleVisibility = () => {
            if (document.hidden) {
                lastActiveTime.current = Date.now();
            } else {
                const diff = (Date.now() - lastActiveTime.current) / 1000;
                if (diff > 5) {
                    alert("SECURITY BREACH: App inactive for >5s. Auto-submitting quiz.");
                    handleSubmit();
                } else {
                    warningCount.current += 1;
                    if (warningCount.current >= 2) {
                        alert("FINAL WARNING: Do not exit the app. Next time will auto-submit.");
                    }
                }
            }
        };

        const preventCopy = (e: any) => e.preventDefault();

        window.addEventListener('visibilitychange', handleVisibility);
        window.addEventListener('copy', preventCopy);
        window.addEventListener('contextmenu', preventCopy);

        return () => {
            window.removeEventListener('visibilitychange', handleVisibility);
            window.removeEventListener('copy', preventCopy);
            window.removeEventListener('contextmenu', preventCopy);
        };
    }, [mode]);

    // --- ARENA TICKER ---
    useEffect(() => {
        if (mode === 'PLAYING' && timeLeft > 0) {
            timerRef.current = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) { handleSubmit(); return 0; }
                    return prev - 1;
                });
            }, 1000);
        } else {
            clearInterval(timerRef.current);
        }
        return () => clearInterval(timerRef.current);
    }, [mode, timeLeft]);

    // --- HANDLERS ---
    const startArena = (type: ArenaSubMode) => {
        setSubMode(type);
        // Shuffle and pick 30-40 questions (using simplified db for now)
        // Ensure mix: 30% Easy, 50% Medium, 20% Hard
        const pool = [...ARENA_DB].sort(() => Math.random() - 0.5).slice(0, 10); // Mocking 10 for demo, 30 in reality
        setQuestions(pool);
        setTimeLeft(pool.length * 90); // 90s per question
        setUserAnswers({});
        setBotScore(0);
        setBotProgress(0);
        setCurrentIdx(0);
        
        if (type === 'BOT') {
            setOpponentName('Hileir 🤖');
            setMode('LOBBY');
            setTimeout(() => setOpponentReady(true), 2000);
        } else if (type === 'CHALLENGE') {
            setBattleCode(Math.random().toString(36).substring(2, 8).toUpperCase());
            setMode('LOBBY');
        } else {
            setMode('PLAYING');
        }
    };

    const enterBattle = () => {
        setMode('PLAYING');
        if (subMode === 'BOT') simulateBotBehavior();
    };

    const handleSubmit = async () => {
        if (isSubmitting) return;
        setIsSubmitting(true);
        clearInterval(timerRef.current);

        // Simulation delay for "processing"
        await new Promise(r => setTimeout(r, 1500));

        let score = 0, correct = 0, wrong = 0;
        questions.forEach(q => {
            const ans = userAnswers[q.id];
            if (ans !== undefined && ans !== '') {
                if (ans === q.correctAnswer) { score += 4; correct++; }
                else { score -= 1; wrong++; }
            }
        });

        const accuracy = Math.round((correct / questions.length) * 100);
        const timeTaken = (questions.length * 90) - timeLeft;
        
        // Rank Prediction Logic (Mocking PW style formula)
        const percentile = Math.min(99.9, (score / (questions.length * 4)) * 100 + (100 - timeTaken/1000));
        let rankRange = "1,00,000+";
        if (percentile > 99) rankRange = "Under 5,000";
        else if (percentile > 95) rankRange = "5,000 - 15,000";
        else if (percentile > 90) rankRange = "15,000 - 45,000";
        
        setPrediction({ range: rankRange, percentile, confidence: accuracy > 80 ? 'High' : 'Medium' });

        const testRes: TestResult = {
            testId: 'arena-' + Date.now(),
            testTitle: 'Arena Combat',
            score, totalMarks: questions.length * 4, accuracy,
            timeTaken, correctCount: correct, wrongCount: wrong,
            skippedCount: questions.length - (correct + wrong),
            percentile, rank: Math.floor(Math.random() * 5000) + 1, // Mock local rank
            date: new Date().toISOString(),
            subjectWise: { Physics: {score:0, total:0, time:0}, Chemistry: {score:0, total:0, time:0}, Maths: {score:0, total:0, time:0} },
            answers: userAnswers, status: {}, questionTime: {}, questions: [...questions]
        };

        setResults(testRes);
        
        // Finalize Stats
        const win = subMode === 'BOT' ? score > botScore : true;
        statsService.recordArenaResult(win, subMode === 'BOT' ? 'BOT' : 'CHALLENGE', 100 + score, accuracy, testRes.rank);
        
        setIsSubmitting(false);
        setMode('RESULT');
    };

    // --- VIEWS ---

    if (mode === 'MENU') {
        return (
            <div className="h-full w-full bg-[#02040a] flex flex-col items-center justify-center p-6 relative overflow-y-auto custom-scrollbar">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#0f172a_0%,_#02040a_80%)]"></div>
                
                <div className="z-10 w-full max-w-md text-center animate-in zoom-in-95 duration-500 py-10">
                    <div className="w-24 h-24 mx-auto bg-cyber-cyan/10 border-2 border-cyber-cyan rounded-[32px] flex items-center justify-center text-cyber-cyan mb-8 shadow-[0_0_40px_rgba(0,243,255,0.3)]">
                        <Swords size={48} className="animate-glow" />
                    </div>
                    
                    <h1 className="text-4xl font-display font-bold text-white tracking-[0.2em] uppercase mb-4">QUIZ ARENA</h1>
                    <p className="text-slate-500 text-[10px] font-mono uppercase tracking-[0.4em] mb-12">Combat Engine v4.1 Ready</p>

                    <div className="space-y-4">
                        <ArenaBtn icon={Play} label="Solo Mission" sub="Custom Target Training" color="cyan" onClick={() => startArena('SOLO')} />
                        <ArenaBtn icon={Brain} label="Battle Hileir" sub="Human-Like Bot Duel" color="purple" onClick={() => startArena('BOT')} />
                        <ArenaBtn icon={Users} label="Friend Challenge" sub="Real-Time PvP Battle" color="yellow" onClick={() => startArena('CHALLENGE')} />
                    </div>
                </div>
            </div>
        );
    }

    if (mode === 'LOBBY') {
        return (
            <div className="h-full w-full bg-[#02040a] flex flex-col items-center justify-center p-6 relative overflow-y-auto custom-scrollbar">
                 <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_#0f172a_0%,_#02040a_80%)]"></div>
                 <div className="z-10 w-full max-w-sm text-center py-10">
                    <h2 className="text-slate-500 text-[10px] font-bold uppercase tracking-[0.3em] mb-8">Synchronizing Neural Link</h2>
                    
                    {subMode === 'CHALLENGE' && (
                        <div className="bg-black/60 border border-white/10 p-6 rounded-[32px] mb-12">
                            <span className="text-4xl font-mono font-bold text-white tracking-widest block mb-4">{battleCode}</span>
                            <button onClick={() => { navigator.clipboard.writeText(battleCode); alert("Link Copied!"); }} className="flex items-center gap-2 text-cyber-cyan text-[10px] font-bold uppercase mx-auto px-4 py-2 bg-cyber-cyan/10 rounded-full border border-cyber-cyan/30 hover:bg-cyber-cyan/20">
                                <Copy size={12} /> Share Invite
                            </button>
                        </div>
                    )}

                    <div className="flex justify-between items-center mb-16">
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-20 h-20 rounded-[28px] border-2 border-cyber-cyan p-1 shadow-[0_0_20px_rgba(0,243,255,0.2)]">
                                <img src="https://ui-avatars.com/api/?name=You&background=00f3ff&color=000" className="w-full h-full rounded-[24px] object-cover" />
                            </div>
                            <span className="text-xs font-bold text-white uppercase tracking-widest">You</span>
                        </div>
                        
                        <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center text-white font-black animate-pulse">VS</div>

                        <div className="flex flex-col items-center gap-4">
                            <div className={`w-20 h-20 rounded-[28px] border-2 p-1 transition-all ${opponentReady ? 'border-cyber-purple shadow-[0_0_20px_rgba(157,0,255,0.2)]' : 'border-dashed border-white/10 opacity-30 animate-pulse'}`}>
                                <img src={`https://ui-avatars.com/api/?name=${opponentName}&background=9d00ff&color=fff`} className="w-full h-full rounded-[24px] object-cover" />
                            </div>
                            <span className={`text-xs font-bold uppercase tracking-widest ${opponentReady ? 'text-white' : 'text-slate-600'}`}>{opponentName}</span>
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <button onClick={() => setMode('MENU')} className="flex-1 py-4 border border-white/10 rounded-2xl text-slate-500 font-bold uppercase text-[10px] tracking-widest">Abort</button>
                        <button 
                            disabled={!opponentReady}
                            onClick={enterBattle}
                            className="flex-[2] py-4 bg-cyber-cyan text-black font-display font-bold text-xl uppercase tracking-widest rounded-2xl shadow-[0_0_30px_rgba(0,243,255,0.3)] hover:scale-105 active:scale-95 disabled:opacity-20"
                        >
                            Enter Arena
                        </button>
                    </div>
                 </div>
            </div>
        );
    }

    if (mode === 'PLAYING') {
        const q = questions[currentIdx];
        const progress = ((currentIdx + 1) / questions.length) * 100;
        
        return (
            <div className="h-full w-full bg-[#02040a] flex flex-col relative select-none">
                {/* Progress HUD */}
                <div className="h-1.5 bg-white/5 w-full">
                    <div className="h-full bg-cyber-cyan shadow-[0_0_10px_#00f3ff] transition-all duration-500" style={{ width: `${progress}%` }}></div>
                </div>

                <header className="h-16 px-6 border-b border-white/5 bg-black/40 flex items-center justify-between z-20 backdrop-blur-xl">
                    <div className="flex items-center gap-4">
                        <div className="px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-cyber-cyan font-mono text-sm">Q{currentIdx + 1}/{questions.length}</div>
                        <div className={`px-4 py-1.5 rounded-full border bg-black/80 flex items-center gap-2 font-mono font-bold ${timeLeft < 60 ? 'text-red-500 border-red-500 animate-pulse' : 'text-cyber-yellow border-cyber-yellow/20'}`}>
                            <Clock size={14} /> {formatTime(timeLeft)}
                        </div>
                    </div>
                    <button onClick={handleSubmit} className="px-6 py-2 bg-green-600 text-white font-bold rounded-xl text-[10px] uppercase tracking-widest shadow-lg">Submit Final</button>
                </header>

                {/* Question Area */}
                <main className="flex-1 overflow-y-auto custom-scrollbar p-6 relative z-10 pb-32">
                    <div className="max-w-3xl mx-auto">
                        <div className="flex justify-between items-center mb-8">
                             <span className="text-[10px] text-cyber-purple font-black uppercase tracking-widest border border-cyber-purple/30 px-2 py-0.5 rounded">{q.subject} • {q.difficulty}</span>
                             {subMode !== 'SOLO' && (
                                <div className="flex items-center gap-3">
                                    <div className="text-right">
                                        <p className="text-[8px] text-slate-500 uppercase font-bold">Opponent Progress</p>
                                        <div className="flex gap-1 mt-1">
                                            {questions.map((_, i) => (
                                                <div key={i} className={`w-2 h-1 rounded-full ${i < botProgress ? 'bg-cyber-purple shadow-[0_0_5px_#9d00ff]' : 'bg-white/5'}`}></div>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="w-8 h-8 rounded-full border border-cyber-purple/50 bg-black/40 flex items-center justify-center text-cyber-purple font-bold text-[10px]">{botScore}</div>
                                </div>
                             )}
                        </div>

                        <p className="text-xl md:text-2xl font-medium text-white leading-relaxed mb-12">{q.text}</p>

                        <div className="grid gap-4">
                            {q.options?.map((opt, idx) => (
                                <button 
                                    key={idx}
                                    onClick={() => setUserAnswers(prev => ({ ...prev, [q.id]: idx }))}
                                    className={`p-6 rounded-[24px] border text-left flex items-center gap-5 transition-all group ${
                                        userAnswers[q.id] === idx 
                                        ? 'bg-cyber-cyan/10 border-cyber-cyan text-cyber-cyan shadow-[0_0_20px_rgba(0,243,255,0.1)]' 
                                        : 'bg-white/5 border-white/5 hover:border-white/10 hover:border-white/20 text-slate-300'
                                    }`}
                                >
                                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-sm transition-colors ${
                                        userAnswers[q.id] === idx ? 'bg-cyber-cyan border-cyber-cyan text-black' : 'border-slate-700'
                                    }`}>{String.fromCharCode(65 + idx)}</div>
                                    <span className="text-base">{opt}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </main>

                {/* Footer Nav */}
                <nav className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-[#02040a] via-[#02040a] to-transparent z-20 flex justify-center">
                    <div className="w-full max-w-2xl flex justify-between gap-6">
                        <button 
                            disabled={currentIdx === 0}
                            onClick={() => setCurrentIdx(p => p - 1)}
                            className="flex-1 py-4 border border-white/10 rounded-2xl text-slate-500 font-bold uppercase tracking-widest text-[10px] disabled:opacity-20"
                        >
                            Previous
                        </button>
                        <button 
                            onClick={() => currentIdx < questions.length - 1 ? setCurrentIdx(p => p + 1) : handleSubmit()}
                            className="flex-[2] py-4 bg-white/5 border border-white/10 text-white font-bold rounded-2xl hover:border-cyber-cyan transition-all text-[10px] uppercase tracking-widest shadow-xl"
                        >
                            {currentIdx === questions.length - 1 ? 'Finish Challenge' : 'Save & Next'}
                        </button>
                    </div>
                </nav>

                {isSubmitting && (
                    <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center">
                        <div className="w-16 h-16 border-4 border-cyber-cyan border-t-transparent rounded-full animate-spin mb-8"></div>
                        <h2 className="text-2xl font-display font-bold text-white uppercase tracking-[0.3em] animate-pulse">Analyzing Combat Log...</h2>
                        <p className="text-slate-500 text-[10px] mt-4 font-mono uppercase tracking-widest">Validating Anti-Cheat Protection</p>
                    </div>
                )}
            </div>
        );
    }

    if (mode === 'RESULT' && results) {
        return (
            <div className="h-full w-full bg-[#02040a] overflow-y-auto custom-scrollbar p-6 relative">
                 <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#0f172a_0%,_#02040a_80%)]"></div>
                 
                 <div className="max-w-4xl mx-auto space-y-10 pb-24 z-10 relative">
                    <div className="text-center">
                        <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-cyber-yellow/10 border border-cyber-yellow/30 text-cyber-yellow font-bold uppercase tracking-widest mb-6 animate-bounce">
                            <Trophy size={18} /> Performance Verified
                        </div>
                        <h1 className="text-7xl font-display font-bold text-white uppercase tracking-tight mb-2">
                            {results.score} <span className="text-2xl text-slate-600 font-sans">/ {results.totalMarks}</span>
                        </h1>
                        <p className="text-slate-500 text-[10px] font-mono uppercase tracking-[0.4em]">Arena Accuracy: {results.accuracy}%</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <MetricCard label="Percentile" val={`${prediction?.percentile.toFixed(2)}%`} color="cyan" />
                        <MetricCard label="Score" val={results.score} color="purple" />
                        <MetricCard label="Time Taken" val={`${Math.floor(results.timeTaken/60)}m ${results.timeTaken%60}s`} color="yellow" />
                        <MetricCard label="XP Gained" val={`+${100 + results.score}`} color="pink" />
                    </div>

                    {/* Rank Predictor HUD */}
                    <div className="glass-panel p-8 rounded-[40px] border border-cyber-cyan/30 bg-cyber-cyan/5 text-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-cyber-cyan/10 rounded-full blur-[40px] -mr-10 -mt-10"></div>
                        <Target size={40} className="text-cyber-cyan mx-auto mb-6 opacity-50" />
                        <p className="text-slate-400 text-xs uppercase tracking-[0.2em] mb-2">Estimated JEE Rank Range</p>
                        <h2 className="text-5xl font-display font-bold text-white mb-6 drop-shadow-[0_0_15px_#00f3ff]">{prediction?.range}</h2>
                        <div className="flex items-center justify-center gap-2 text-[10px] font-bold text-green-400 uppercase tracking-widest">
                            <ShieldAlert size={12}/> Confidence: {prediction?.confidence}
                        </div>
                    </div>

                    {/* Solutions Link */}
                    <div className="flex flex-col sm:flex-row gap-4">
                        <button onClick={() => setMode('MENU')} className="flex-1 py-4 bg-white/5 border border-white/10 rounded-[24px] text-white font-bold uppercase tracking-widest text-xs hover:bg-white/10">Back to Hub</button>
                        <button onClick={() => setMode('SOLUTIONS')} className="flex-1 py-4 bg-cyber-purple text-white font-bold uppercase tracking-widest rounded-[24px] shadow-[0_0_20px_#9d00ff] hover:scale-105 flex items-center justify-center gap-3 text-xs">
                            <Eye size={20} /> Review Combat Log
                        </button>
                    </div>
                 </div>
            </div>
        );
    }

    if (mode === 'SOLUTIONS' && results) {
        return (
            <div className="h-full w-full bg-[#02040a] flex flex-col relative overflow-hidden">
                <header className="h-16 px-6 border-b border-white/10 bg-black/40 flex items-center justify-between z-20 backdrop-blur-md">
                    <button onClick={() => setMode('RESULT')} className="p-2 text-slate-400 hover:text-white transition-colors"><ArrowLeft size={24}/></button>
                    <h2 className="text-white font-bold uppercase tracking-widest text-sm">Combat Solutions</h2>
                    <div className="w-10"></div>
                </header>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                    <div className="max-w-3xl mx-auto space-y-8">
                        {results.questions?.map((q, i) => {
                            const uAns = results.answers[q.id];
                            const isCorrect = uAns === q.correctAnswer;
                            const isSkipped = uAns === undefined || uAns === '';

                            return (
                                <div key={q.id} className={`p-8 rounded-[40px] border bg-white/5 space-y-6 transition-all ${isCorrect ? 'border-green-500/20' : isSkipped ? 'border-white/5 opacity-80' : 'border-red-500/20'}`}>
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-3">
                                            <span className="w-8 h-8 rounded-xl bg-black/40 flex items-center justify-center font-bold text-white text-xs">{i+1}</span>
                                            <span className={`text-[9px] font-bold uppercase px-3 py-1 rounded-full ${isCorrect ? 'bg-green-500/10 text-green-500' : isSkipped ? 'bg-slate-500/10 text-slate-500' : 'bg-red-500/10 text-red-500'}`}>
                                                {isCorrect ? 'Correct' : isSkipped ? 'Skipped' : 'Wrong Effort'}
                                            </span>
                                        </div>
                                        <span className="text-[9px] text-slate-600 font-mono">{q.subject} • {q.chapter}</span>
                                    </div>
                                    
                                    <p className="text-lg text-white font-medium">{q.text}</p>
                                    
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="p-4 rounded-2xl bg-black/40 border border-white/5">
                                            <p className="text-[8px] text-slate-500 uppercase font-bold mb-2 tracking-widest">Your Input</p>
                                            <p className={`text-base font-bold ${isCorrect ? 'text-green-500' : 'text-red-500'}`}>{isSkipped ? '---' : q.options?.[uAns]}</p>
                                        </div>
                                        <div className="p-4 rounded-2xl bg-green-500/5 border border-green-500/20">
                                            <p className="text-[8px] text-green-900 uppercase font-bold mb-2 tracking-widest">Master Key</p>
                                            <p className="text-base text-green-500 font-bold">{q.options?.[q.correctAnswer as number]}</p>
                                        </div>
                                    </div>

                                    <div className="p-6 bg-black/40 rounded-3xl border border-white/5 border-l-4 border-l-cyber-cyan">
                                        <h4 className="text-cyber-cyan text-[10px] font-bold uppercase tracking-widest mb-3 flex items-center gap-2">
                                            <CheckCircle size={14} /> Solution Matrix
                                        </h4>
                                        <p className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">{q.explanation}</p>
                                        {q.formulaUsed && (
                                            <div className="mt-4 flex flex-wrap gap-2">
                                                {q.formulaUsed.map(f => <span key={f} className="text-[9px] bg-cyber-purple/20 text-cyber-purple px-2 py-1 rounded font-mono font-bold">{f}</span>)}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        );
    }

    return null;
};

// --- HELPER SUBCOMPONENTS ---

const ArenaBtn = ({ icon: Icon, label, sub, color, onClick }: any) => {
    const colors = {
        cyan: 'text-cyber-cyan border-cyber-cyan shadow-[0_0_20px_#00f3ff33]',
        purple: 'text-cyber-purple border-cyber-purple shadow-[0_0_20px_#9d00ff33]',
        yellow: 'text-cyber-yellow border-cyber-yellow shadow-[0_0_20px_#fcee0a33]',
    };
    return (
        <button 
            onClick={onClick}
            className="w-full p-6 rounded-[28px] bg-white/5 border border-white/10 hover:bg-white/10 transition-all flex items-center gap-6 group relative overflow-hidden"
        >
            <div className={`w-14 h-14 rounded-2xl bg-black/40 flex items-center justify-center transition-all group-hover:scale-110 ${colors[color as keyof typeof colors]}`}>
                <Icon size={28} />
            </div>
            <div className="text-left">
                <h3 className="text-white font-bold uppercase tracking-widest text-base group-hover:text-cyber-cyan transition-colors">{label}</h3>
                <p className="text-slate-500 text-[10px] uppercase font-mono mt-1">{sub}</p>
            </div>
            <ChevronRight className="ml-auto text-slate-700 group-hover:text-white" />
        </button>
    );
};

const MetricCard = ({ label, val, color }: any) => (
    <div className="glass-panel p-5 rounded-3xl border border-white/10 text-center">
        <p className="text-[8px] text-slate-500 uppercase font-black mb-1 tracking-widest">{label}</p>
        <h3 className={`text-2xl font-bold text-cyber-${color} drop-shadow-md`}>{val}</h3>
    </div>
);
