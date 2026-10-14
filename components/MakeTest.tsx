import React, { useState, useEffect, useRef, useCallback } from 'react';
/* Added missing Layers and Eye icons to the lucide-react imports */
import { ArrowLeft, Clock, AlertTriangle, CheckCircle, BarChart2, Share2, Play, ChevronRight, Check, Zap, Brain, Target, BookOpen, Search, XCircle, Layers, Eye } from 'lucide-react';
import { ViewState, Question, TestResult } from '../types';
import { statsService } from '../services/statsService';
import { firebase } from '../services/backend';
import { JEE_CHAPTERS } from '../data/jeeChapters';
import { getGenZResponse } from '../services/geminiService';

interface MakeTestProps {
    onBack?: () => void;
    onChallenge?: (code: string) => void;
}

export const MakeTest: React.FC<MakeTestProps> = ({ onBack, onChallenge }) => {
    const [step, setStep] = useState<'SETUP' | 'TAKING' | 'ANALYSIS'>('SETUP');
    const [config, setConfig] = useState({ 
        subject: 'Physics' as 'Physics' | 'Chemistry' | 'Maths', 
        chapters: [] as string[], 
        count: 10, 
        time: 30,
        difficulty: 'Mixed' as 'Easy' | 'Medium' | 'Hard' | 'Mixed'
    });
    
    // Test Taking State
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentIdx, setCurrentIdx] = useState(0);
    const [timeLeft, setTimeLeft] = useState(0);
    const [answers, setAnswers] = useState<Record<string, number>>({});
    const [submitted, setSubmitted] = useState(false);
    const [timeSpent, setTimeSpent] = useState<Record<string, number>>({});

    // Anti-Cheat State
    const [warningCount, setWarningCount] = useState(0);
    const lastActiveRef = useRef<number>(Date.now());
    const [isCheatingSubmitting, setIsCheatingSubmitting] = useState(false);

    // Analysis State
    const [aiSuggestions, setAiSuggestions] = useState<string>('');
    const [xpGained, setXpGained] = useState(0);

    // --- SETUP LOGIC ---

    const toggleChapter = (chap: string) => {
        setConfig(prev => ({
            ...prev,
            chapters: prev.chapters.includes(chap) 
                ? prev.chapters.filter(c => c !== chap) 
                : [...prev.chapters, chap]
        }));
    };

    const startTest = async () => {
        if (config.chapters.length === 0) {
            alert("Please select at least one chapter.");
            return;
        }

        // Fetch questions using existing backend test generator but with custom config
        try {
            const res = await firebase.firestore().tests.generateTest({
                type: 'CHAPTER',
                subject: config.subject,
                chapter: config.chapters[0], // Simplified for now to primary chapter
                count: config.count
            });

            // Adjust difficulty if not mixed (client-side shuffle/filter simulation)
            let pool = [...res.questions];
            if (config.difficulty !== 'Mixed') {
                pool = pool.map(q => ({ ...q, difficulty: config.difficulty as any }));
            }

            setQuestions(pool);
            setTimeLeft(config.time * 60);
            setAnswers({});
            setTimeSpent({});
            setWarningCount(0);
            setStep('TAKING');
        } catch (e) {
            alert("Neural engine failed to generate test. Try again.");
        }
    };

    // --- TAKING LOGIC ---

    useEffect(() => {
        let timer: any;
        if (step === 'TAKING' && timeLeft > 0 && !submitted) {
            timer = setInterval(() => setTimeLeft(p => {
                if (p <= 1) { handleSubmit(); return 0; }
                return p - 1;
            }), 1000);
        }
        return () => clearInterval(timer);
    }, [step, timeLeft, submitted]);

    // Question Time Tracker
    useEffect(() => {
        let qTimer: any;
        if (step === 'TAKING' && !submitted) {
            qTimer = setInterval(() => {
                const qId = questions[currentIdx]?.id;
                if (qId) {
                    setTimeSpent(prev => ({
                        ...prev,
                        [qId]: (prev[qId] || 0) + 1
                    }));
                }
            }, 1000);
        }
        return () => clearInterval(qTimer);
    }, [currentIdx, step, submitted, questions]);

    // Anti-Cheat Engine
    useEffect(() => {
        if (step !== 'TAKING' || submitted) return;

        const handleVisibilityChange = () => {
            if (document.hidden) {
                lastActiveRef.current = Date.now();
            } else {
                const diff = (Date.now() - lastActiveRef.current) / 1000;
                if (diff > 5) {
                    setWarningCount(prev => {
                        const newCount = prev + 1;
                        if (newCount >= 3) {
                            alert("SECURITY VIOLATION: Continuous app switching detected. Test auto-submitting.");
                            setIsCheatingSubmitting(true);
                            handleSubmit();
                        } else {
                            alert(`WARNING: No app switching allowed. Warning ${newCount}/3.`);
                        }
                        return newCount;
                    });
                }
            }
        };

        window.addEventListener('visibilitychange', handleVisibilityChange);
        const preventCopy = (e: any) => e.preventDefault();
        window.addEventListener('copy', preventCopy);
        window.addEventListener('contextmenu', preventCopy);

        return () => {
            window.removeEventListener('visibilitychange', handleVisibilityChange);
            window.removeEventListener('copy', preventCopy);
            window.removeEventListener('contextmenu', preventCopy);
        };
    }, [step, submitted]);

    const handleSubmit = async () => {
        if (submitted) return;
        setSubmitted(true);
        
        let correct = 0;
        let wrong = 0;
        let score = 0;

        questions.forEach(q => {
            const uAns = answers[q.id];
            if (uAns !== undefined) {
                if (uAns === q.correctAnswer) {
                    correct++;
                    score += 4;
                } else {
                    wrong++;
                    score -= 1;
                }
            }
        });

        const totalAttempted = correct + wrong;
        const accuracy = totalAttempted > 0 ? Math.round((correct / totalAttempted) * 100) : 0;
        const timeTaken = (config.time * 60) - timeLeft;

        // Sync with statsService
        const earned = statsService.completeCustomTest(correct, accuracy, timeTaken, questions.length);
        setXpGained(earned);

        // Record history in backend
        const result: TestResult = {
            testId: `custom-${Date.now()}`,
            testTitle: `Custom: ${config.chapters.join(', ')}`,
            score,
            totalMarks: questions.length * 4,
            accuracy,
            timeTaken,
            correctCount: correct,
            wrongCount: wrong,
            skippedCount: questions.length - totalAttempted,
            percentile: Math.min(99.9, (score / (questions.length * 4)) * 100),
            rank: 0, // Calculated globally later
            date: new Date().toISOString(),
            subjectWise: { Physics: {score:0, total:0, time:0}, Chemistry: {score:0, total:0, time:0}, Maths: {score:0, total:0, time:0} },
            answers: answers as any,
            status: {},
            questionTime: timeSpent
        };
        await firebase.firestore().tests.saveResult(result);

        // Fetch AI Suggestions
        generateAiTips(correct, wrong, accuracy, config.chapters);

        setStep('ANALYSIS');
    };

    const generateAiTips = async (c: number, w: number, acc: number, chaps: string[]) => {
        const prompt = `Student finished a Custom Test on chapters: ${chaps.join(', ')}. 
        Results: ${c} correct, ${w} wrong, ${acc}% accuracy. 
        Provide 3 bullet points of JEE revision advice. Mention specific focus for these chapters. Keep it GenZ style and motivating.`;
        try {
            const advice = await getGenZResponse(prompt);
            setAiSuggestions(advice);
        } catch (e) {
            setAiSuggestions("Keep grinding! Your dedication is the key to under 5k rank. 🚀");
        }
    };

    // --- RENDER VIEWS ---

    const currentQ = questions[currentIdx];

    return (
        <div className="h-full w-full bg-[#020617] flex flex-col overflow-hidden relative select-none">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_#0f172a_0%,_#020617_70%)] pointer-events-none"></div>

            {/* SETUP VIEW */}
            {step === 'SETUP' && (
                <div className="flex-1 overflow-y-auto custom-scrollbar p-6 relative z-10">
                    <div className="flex items-center gap-4 mb-8">
                        {onBack && <button onClick={onBack} className="p-2 rounded-full hover:bg-white/10 text-white transition-all"><ArrowLeft size={24} /></button>}
                        <h1 className="text-3xl font-display font-bold text-white tracking-widest uppercase">Custom Protocol</h1>
                    </div>

                    <div className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8 pb-10">
                        
                        {/* LEFT: SELECTIONS */}
                        <div className="lg:col-span-2 space-y-6">
                            {/* Subject Tabs */}
                            <div className="glass-panel p-2 rounded-2xl border border-white/10 flex gap-2">
                                {['Physics', 'Chemistry', 'Maths'].map(sub => (
                                    <button 
                                        key={sub}
                                        onClick={() => setConfig({ ...config, subject: sub as any, chapters: [] })}
                                        className={`flex-1 py-3 rounded-xl font-bold uppercase tracking-widest text-xs transition-all ${config.subject === sub ? 'bg-cyber-cyan text-black shadow-[0_0_15px_#00f3ff]' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
                                    >
                                        {sub}
                                    </button>
                                ))}
                            </div>

                            {/* Chapter Grid */}
                            <div className="glass-panel p-6 rounded-2xl border border-white/10 h-[500px] flex flex-col">
                                <div className="flex justify-between items-center mb-6">
                                    <h3 className="text-white font-bold text-sm uppercase tracking-widest flex items-center gap-2"><Layers size={16} className="text-cyber-cyan"/> Target Chapters</h3>
                                    <span className="text-[10px] text-slate-500 font-mono uppercase">{config.chapters.length} Selected</span>
                                </div>
                                <div className="flex-1 overflow-y-auto custom-scrollbar grid grid-cols-1 md:grid-cols-2 gap-2">
                                    {(JEE_CHAPTERS as any)[config.subject === 'Maths' ? 'Mathematics' : config.subject].map((chap: string) => (
                                        <button 
                                            key={chap}
                                            onClick={() => toggleChapter(chap)}
                                            className={`p-3 rounded-xl text-left text-xs border transition-all flex items-center justify-between group ${config.chapters.includes(chap) ? 'bg-cyber-purple/20 border-cyber-purple text-white shadow-[0_0_10px_rgba(157,0,255,0.1)]' : 'bg-black/20 border-white/5 text-slate-500 hover:border-white/20'}`}
                                        >
                                            <span className="truncate">{chap}</span>
                                            {config.chapters.includes(chap) ? <CheckCircle size={14} className="text-cyber-purple"/> : <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity"/>}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* RIGHT: PARAMETERS */}
                        <div className="space-y-6">
                            <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-8">
                                <h3 className="text-white font-bold text-xs uppercase tracking-widest border-b border-white/5 pb-3">Test Matrix</h3>
                                
                                <div>
                                    <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-4 block flex justify-between">
                                        <span>Difficulty</span>
                                        <span className="text-cyber-pink">{config.difficulty}</span>
                                    </label>
                                    <div className="grid grid-cols-2 gap-2">
                                        {['Easy', 'Medium', 'Hard', 'Mixed'].map(d => (
                                            <button 
                                                key={d}
                                                onClick={() => setConfig({...config, difficulty: d as any})}
                                                className={`py-2 rounded-lg text-[10px] font-bold border transition-all ${config.difficulty === d ? 'bg-cyber-pink/20 border-cyber-pink text-white' : 'bg-white/5 border-transparent text-slate-500'}`}
                                            >
                                                {d}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-4">
                                        <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Question Count</label>
                                        <span className="text-white font-mono font-bold">{config.count} Qs</span>
                                    </div>
                                    <input 
                                        type="range" min="10" max="90" step="5"
                                        value={config.count}
                                        onChange={(e) => setConfig({...config, count: Number(e.target.value), time: Math.ceil(Number(e.target.value) * 1.5)})}
                                        className="w-full h-1.5 bg-black rounded-lg appearance-none cursor-pointer accent-cyber-cyan"
                                    />
                                </div>

                                <div>
                                    <div className="flex justify-between items-center mb-4">
                                        <label className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Allocated Time</label>
                                        <span className="text-cyber-cyan font-mono font-bold">{config.time} Mins</span>
                                    </div>
                                    <input 
                                        type="range" min="15" max="180" step="5"
                                        value={config.time}
                                        onChange={(e) => setConfig({...config, time: Number(e.target.value)})}
                                        className="w-full h-1.5 bg-black rounded-lg appearance-none cursor-pointer accent-cyber-cyan"
                                    />
                                </div>

                                <div className="p-4 bg-white/5 border border-white/5 rounded-xl flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-cyber-yellow/10 flex items-center justify-center text-cyber-yellow">
                                        <Zap size={20}/>
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Potential Gain</p>
                                        <p className="text-white font-mono font-bold">~{config.count * 10} XP</p>
                                    </div>
                                </div>
                            </div>

                            <button 
                                onClick={startTest}
                                className="w-full py-5 bg-gradient-to-r from-cyber-cyan via-blue-600 to-cyber-purple rounded-xl font-display font-bold text-xl uppercase tracking-widest text-white shadow-[0_0_30px_rgba(0,243,255,0.3)] hover:scale-[1.02] transition-all flex items-center justify-center gap-3"
                            >
                                Construct Test <Play fill="currentColor" size={20} />
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* TAKING VIEW */}
            {step === 'TAKING' && currentQ && (
                <div className="flex-1 flex flex-col relative z-10">
                    <div className="h-16 border-b border-white/10 bg-black/60 backdrop-blur-xl flex items-center justify-between px-6">
                        <div className="flex items-center gap-4">
                             <div className="px-3 py-1 bg-cyber-cyan/10 border border-cyber-cyan/30 rounded text-cyber-cyan font-mono text-xs">Q {currentIdx + 1}/{questions.length}</div>
                             <div className={`px-4 py-1.5 rounded-full border flex items-center gap-2 font-mono font-bold ${timeLeft < 300 ? 'bg-red-500/10 border-red-500 text-red-500 animate-pulse' : 'bg-white/5 border-white/10 text-cyber-cyan'}`}>
                                <Clock size={16} /> {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
                             </div>
                        </div>
                        <div className="flex items-center gap-3">
                             {warningCount > 0 && <span className="text-[9px] text-red-500 font-black animate-bounce uppercase">Violation Warning {warningCount}/3</span>}
                             <button onClick={handleSubmit} className="px-6 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-500 transition-colors shadow-lg">Submit</button>
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                        <div className="max-w-3xl mx-auto">
                            <div className="flex justify-between items-center mb-6">
                                <span className="text-[10px] text-cyber-purple font-black uppercase tracking-widest border border-cyber-purple/30 px-2 py-0.5 rounded">{currentQ.subject} • {currentQ.chapter}</span>
                                <span className="text-xs text-slate-500 font-mono">Time Spent: {timeSpent[currentQ.id] || 0}s</span>
                            </div>

                            <p className="text-xl md:text-2xl font-medium text-white leading-relaxed mb-12">{currentQ.text}</p>

                            <div className="grid gap-4">
                                {currentQ.options?.map((opt, idx) => (
                                    <button 
                                        key={idx}
                                        onClick={() => setAnswers({...answers, [currentQ.id]: idx})}
                                        className={`p-6 rounded-[24px] border text-left flex items-center gap-5 transition-all group ${answers[currentQ.id] === idx ? 'bg-cyber-cyan/10 border-cyber-cyan text-cyber-cyan' : 'bg-white/5 border-white/5 hover:border-white/20 text-slate-400'}`}
                                    >
                                        <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center font-bold text-sm transition-colors ${answers[currentQ.id] === idx ? 'bg-cyber-cyan border-cyber-cyan text-black' : 'border-slate-700'}`}>{String.fromCharCode(65 + idx)}</div>
                                        <span className="text-base">{opt}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="h-20 border-t border-white/5 flex items-center justify-center gap-6 px-6 bg-black/40">
                         <button 
                            disabled={currentIdx === 0} 
                            onClick={() => setCurrentIdx(p => p - 1)}
                            className="px-8 py-3 rounded-xl border border-white/10 text-slate-400 hover:text-white disabled:opacity-20"
                         >
                            Previous
                         </button>
                         <button 
                            onClick={() => currentIdx < questions.length - 1 ? setCurrentIdx(p => p + 1) : handleSubmit()}
                            className="px-10 py-3 bg-cyber-purple text-white font-bold rounded-xl shadow-lg hover:scale-105 transition-all uppercase tracking-widest text-xs"
                         >
                            {currentIdx === questions.length - 1 ? 'Finish Test' : 'Save & Next'}
                         </button>
                    </div>
                </div>
            )}

            {/* ANALYSIS VIEW */}
            {step === 'ANALYSIS' && (
                <div className="flex-1 overflow-y-auto custom-scrollbar p-6 relative z-10 flex flex-col items-center">
                    <div className="max-w-4xl w-full pb-20">
                        <div className="text-center mb-10">
                            <div className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-cyber-yellow/10 border border-cyber-yellow/30 text-cyber-yellow font-bold uppercase tracking-[0.2em] mb-6 animate-pulse">
                                <CheckCircle size={18} /> Performance Analyzed
                            </div>
                            <h1 className="text-5xl font-display font-bold text-white mb-2 uppercase tracking-tight">MISSION REPORT</h1>
                            <p className="text-slate-400 font-mono text-sm uppercase tracking-widest">{config.subject} • Custom Protocol</p>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                             <StatCard label="Accuracy" val={`${(correctCount() / Math.max(1, (correctCount() + wrongCount()))) * 100}%`} color="cyan" />
                             <StatCard label="Net XP" val={`+${xpGained}`} color="yellow" />
                             <StatCard label="Time Taken" val={`${Math.floor(((config.time * 60) - timeLeft) / 60)}m`} color="purple" />
                             <StatCard label="Correct Qs" val={`${correctCount()}/${questions.length}`} color="green" />
                        </div>

                        {/* AI Tips Section */}
                        <div className="glass-panel p-8 rounded-[40px] border border-cyber-purple/30 bg-cyber-purple/5 mb-8 relative overflow-hidden">
                             <div className="absolute top-0 right-0 w-32 h-32 bg-cyber-purple/10 rounded-full blur-[40px] -mr-10 -mt-10"></div>
                             <div className="flex items-center gap-4 mb-6">
                                <div className="p-3 bg-cyber-purple/20 rounded-2xl text-cyber-purple"><Brain size={28}/></div>
                                <div>
                                    <h3 className="text-white font-bold text-lg uppercase tracking-wider">Zuaki AI Counsel</h3>
                                    <p className="text-slate-500 text-[9px] uppercase tracking-widest font-mono">Neural Guidance Logic</p>
                                </div>
                             </div>
                             <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap">
                                 {aiSuggestions || "Syncing with neural link..."}
                             </div>
                             <div className="mt-8 flex gap-3">
                                 <button onClick={() => window.alert("Navigating to Short Notes...")} className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-[10px] font-bold text-white uppercase tracking-widest hover:bg-white/10">Read Ch. Notes</button>
                                 <button onClick={() => window.alert("Opening Formula Vault...")} className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-[10px] font-bold text-white uppercase tracking-widest hover:bg-white/10">Formula Cards</button>
                             </div>
                        </div>

                        {/* Subject Breakdown */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="glass-panel p-6 rounded-3xl border border-red-500/20 bg-red-500/5">
                                <h3 className="text-red-400 font-bold text-xs uppercase tracking-widest mb-4 flex items-center gap-2"><XCircle size={16}/> Weak Topics</h3>
                                <div className="space-y-2">
                                    {config.chapters.slice(0, 3).map(c => (
                                        <div key={c} className="p-3 bg-black/40 rounded-xl border border-white/5 flex justify-between items-center">
                                            <span className="text-white text-xs">{c}</span>
                                            <span className="text-red-400 font-bold text-[10px] uppercase">Revise Required</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                            <div className="glass-panel p-6 rounded-3xl border border-green-500/20 bg-green-500/5">
                                <h3 className="text-green-400 font-bold text-xs uppercase tracking-widest mb-4 flex items-center gap-2"><CheckCircle size={16}/> Stronghold</h3>
                                <div className="space-y-2">
                                    <div className="p-3 bg-black/40 rounded-xl border border-white/5 flex justify-between items-center">
                                        <span className="text-white text-xs">Concept Precision</span>
                                        <span className="text-green-400 font-bold text-[10px] uppercase">Elite Tier</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="mt-12 flex flex-col md:flex-row gap-4">
                             <button onClick={() => setStep('SETUP')} className="flex-1 py-4 bg-white/5 border border-white/10 rounded-2xl text-white font-bold uppercase tracking-widest text-xs hover:bg-white/10 transition-all">New Test Configuration</button>
                             <button onClick={() => window.alert("Review functionality coming soon!")} className="flex-1 py-4 bg-cyber-cyan text-black font-bold uppercase tracking-widest rounded-2xl shadow-[0_0_20px_#00f3ff] hover:scale-105 transition-all text-xs flex items-center justify-center gap-3">
                                <Eye size={20} /> Review Solutions
                             </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

    function correctCount() {
        return questions.filter(q => answers[q.id] === q.correctAnswer).length;
    }
    function wrongCount() {
        return questions.filter(q => answers[q.id] !== undefined && answers[q.id] !== q.correctAnswer).length;
    }
};

const StatCard = ({ label, val, color }: { label: string, val: string | number, color: string }) => {
    const colorClasses: any = {
        cyan: 'text-cyber-cyan border-cyber-cyan/30 bg-cyber-cyan/5',
        yellow: 'text-cyber-yellow border-cyber-yellow/30 bg-cyber-yellow/5',
        purple: 'text-cyber-purple border-cyber-purple/30 bg-cyber-purple/5',
        green: 'text-green-400 border-green-500/30 bg-green-500/5'
    };
    return (
        <div className={`p-6 rounded-[28px] border text-center transition-all hover:scale-105 ${colorClasses[color]}`}>
            <p className="text-[10px] text-slate-500 uppercase font-black mb-2 tracking-widest">{label}</p>
            <h3 className="text-3xl font-display font-bold drop-shadow-md">{val}</h3>
        </div>
    );
};