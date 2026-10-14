
import React, { useState, useEffect, useRef } from 'react';
import { Clock, ChevronLeft, ChevronRight, Bookmark, Grid, Save, Pause, Info, Maximize2, Minimize2, LogOut, Check, AlertTriangle, Calculator, Flag } from 'lucide-react';
import { TestConfig, Question, ChapterPerformance } from '../types';

interface TestInterfaceProps {
    config: TestConfig;
    onComplete: (results: any) => void;
    onExit: () => void;
    onOpenCalc?: () => void;
    onDirty?: (dirty: boolean) => void;
}

const STATUS_COLORS = {
    not_visited: 'bg-white/5 border-white/20 text-slate-500',
    not_answered: 'bg-red-500/20 border-red-500 text-red-500',
    answered: 'bg-green-500 text-black border-green-500 font-bold',
    marked: 'bg-cyber-purple text-white border-cyber-purple',
    marked_answered: 'bg-cyber-purple text-white border-cyber-purple relative after:content-[""] after:absolute after:bottom-[-2px] after:right-[-2px] after:w-3 after:h-3 after:bg-green-500 after:rounded-full after:border-2 after:border-black'
};

export const TestInterface: React.FC<TestInterfaceProps> = ({ config, onComplete, onExit, onOpenCalc, onDirty }) => {
    const [activeSubject, setActiveSubject] = useState(config.subjects[0]);
    const [currentQIndex, setCurrentQIndex] = useState(0); 
    const [answers, setAnswers] = useState<Record<string, string | number>>({});
    const [status, setStatus] = useState<Record<string, string>>({});
    const [timeLeft, setTimeLeft] = useState(config.duration * 60);
    const [isPaused, setIsPaused] = useState(false);
    const [isPaletteOpen, setIsPaletteOpen] = useState(false);
    const [showSubmitModal, setShowSubmitModal] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    
    const [timeSpent, setTimeSpent] = useState<Record<string, number>>({});
    const [bookmarks, setBookmarks] = useState<string[]>([]);

    const STORAGE_KEY = `zuaki_test_progress_${config.id}`;
    const currentQ = config.questions[currentQIndex];

    useEffect(() => {
        const saved = localStorage.getItem(STORAGE_KEY);
        if (saved) {
            try {
                const data = JSON.parse(saved);
                setAnswers(data.answers || {});
                setStatus(data.status || {});
                setTimeLeft(data.timeLeft || config.duration * 60);
                setTimeSpent(data.timeSpent || {});
                setBookmarks(data.bookmarks || []);
                if (typeof data.currentIndex === 'number') setCurrentQIndex(data.currentIndex);
            } catch (e) { console.error("Recovery failed", e); }
        } else {
            const initStatus: any = {};
            config.questions.forEach(q => initStatus[q.id] = 'not_visited');
            setStatus(initStatus);
        }
    }, []);

    useEffect(() => {
        const hasAnswers = Object.keys(answers).length > 0;
        if (onDirty) onDirty(hasAnswers);
    }, [answers, onDirty]);

    useEffect(() => {
        const interval = setInterval(() => {
            const state = {
                answers,
                status,
                timeLeft,
                timeSpent,
                bookmarks,
                currentIndex: currentQIndex
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        }, 5000);
        return () => clearInterval(interval);
    }, [answers, status, timeLeft, timeSpent, bookmarks, currentQIndex]);

    useEffect(() => {
        let timer: any;
        if (!isPaused && timeLeft > 0) {
            timer = setInterval(() => setTimeLeft(p => {
                if (p <= 1) { handleSubmit(); return 0; }
                return p - 1;
            }), 1000);
        }
        return () => clearInterval(timer);
    }, [isPaused, timeLeft]);

    useEffect(() => {
        let qTimer: any;
        if (!isPaused) {
            qTimer = setInterval(() => {
                setTimeSpent(prev => ({
                    ...prev,
                    [currentQ.id]: (prev[currentQ.id] || 0) + 1
                }));
            }, 1000);
        }
        return () => clearInterval(qTimer);
    }, [currentQIndex, isPaused]);

    useEffect(() => {
        if (status[currentQ.id] === 'not_visited') {
            setStatus(prev => ({ ...prev, [currentQ.id]: 'not_answered' }));
        }
        if (currentQ.subject !== activeSubject) {
            setActiveSubject(currentQ.subject);
        }
    }, [currentQIndex]);

    const handleAnswer = (val: string | number) => {
        setAnswers(prev => ({ ...prev, [currentQ.id]: val }));
    };

    const handleSaveNext = () => {
        const qId = currentQ.id;
        const hasAns = answers[qId] !== undefined && answers[qId] !== '';
        setStatus(prev => ({ ...prev, [qId]: hasAns ? 'answered' : 'not_answered' }));
        if (currentQIndex < config.questions.length - 1) setCurrentQIndex(currentQIndex + 1);
    };

    const handleMarkReview = () => {
        const qId = currentQ.id;
        const hasAns = answers[qId] !== undefined && answers[qId] !== '';
        setStatus(prev => ({ ...prev, [qId]: hasAns ? 'marked_answered' : 'marked' }));
        if (currentQIndex < config.questions.length - 1) setCurrentQIndex(currentQIndex + 1);
    };

    const handleBookmark = () => {
        const qId = currentQ.id;
        if (bookmarks.includes(qId)) setBookmarks(prev => prev.filter(id => id !== qId));
        else setBookmarks(prev => [...prev, qId]);
    };

    const handleClear = () => {
        const qId = currentQ.id;
        const newAns = { ...answers };
        delete newAns[qId];
        setAnswers(newAns);
        setStatus(prev => ({ ...prev, [qId]: 'not_answered' }));
    };

    const jumpToQuestion = (globalIdx: number) => {
        setCurrentQIndex(globalIdx);
        setIsPaletteOpen(false); 
    };

    const handleSubmit = () => {
        if (onDirty) onDirty(false);
        let score = 0, correct = 0, wrong = 0;
        const chapterStats: Record<string, { correct: number, wrong: number, total: number, time: number }> = {};

        config.questions.forEach(q => {
            if (!chapterStats[q.chapter]) chapterStats[q.chapter] = { correct: 0, wrong: 0, total: 0, time: 0 };
            chapterStats[q.chapter].total++;
            chapterStats[q.chapter].time += (timeSpent[q.id] || 0);

            const ans = answers[q.id];
            if (ans !== undefined && ans !== '') {
                if ((q.type === 'MCQ' && ans === q.correctAnswer) || (q.type === 'NUMERICAL' && Number(ans) === Number(q.correctAnswer))) {
                    score += 4; correct++;
                    chapterStats[q.chapter].correct++;
                } else {
                    score -= 1; wrong++;
                    chapterStats[q.chapter].wrong++;
                }
            }
        });

        const chapterAnalysis: ChapterPerformance[] = Object.keys(chapterStats).map(chap => {
            const data = chapterStats[chap];
            const attempted = data.correct + data.wrong;
            const accuracy = attempted > 0 ? (data.correct / attempted) * 100 : 0;
            const avgTime = data.time / data.total;
            let status: 'Strong' | 'Weak' | 'Average' = 'Average';
            if (accuracy > 80 && avgTime < 120) status = 'Strong';
            else if (accuracy < 50 || avgTime > 180) status = 'Weak';
            return { name: chap, accuracy, avgTime, status };
        });

        const result = {
            testId: config.id, testTitle: config.title,
            score, totalMarks: config.questions.length * 4,
            correctCount: correct, wrongCount: wrong,
            skippedCount: config.questions.length - (correct + wrong),
            answers, status,
            timeTaken: (config.duration * 60) - timeLeft,
            date: new Date().toISOString(),
            accuracy: correct + wrong > 0 ? Math.round((correct / (correct + wrong)) * 100) : 0,
            percentile: Math.min(99.9, (score / 300) * 100), 
            rank: Math.floor(Math.random() * 10000) + 1,
            subjectWise: { Physics: {score:0, total:0, time:0}, Chemistry: {score:0, total:0, time:0}, Maths: {score:0, total:0, time:0} },
            questionTime: timeSpent,
            chapterAnalysis
        };
        localStorage.removeItem(STORAGE_KEY);
        onComplete(result);
    };

    const formatTime = (s: number) => {
        const h = Math.floor(s / 3600);
        const m = Math.floor((s % 3600) / 60);
        const sec = s % 60;
        return `${h}:${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
    };

    return (
        <div className={`h-full w-full bg-[#020617] flex flex-col relative overflow-hidden ${isExpanded ? 'fixed inset-0 z-[200]' : ''}`}>
            <div className="h-16 border-b border-white/10 bg-[#0b0f1a] flex items-center justify-between px-6 z-20">
                <div className="flex items-center gap-6">
                    <h2 className="text-white font-display font-bold text-lg hidden md:block">{config.title}</h2>
                    <div className="flex bg-white/5 rounded-lg p-1 border border-white/10">
                        {config.subjects.map(sub => (
                            <button 
                                key={sub}
                                onClick={() => { setActiveSubject(sub); jumpToQuestion(config.questions.findIndex(q => q.subject === sub)); }}
                                className={`px-4 py-1.5 rounded-md text-xs font-bold transition-all ${activeSubject === sub ? 'bg-cyber-cyan text-black shadow-[0_0_10px_#00f3ff]' : 'text-slate-400 hover:text-white'}`}
                            >
                                {sub}
                            </button>
                        ))}
                    </div>
                </div>
                
                <div className="flex items-center gap-4">
                    <button onClick={onOpenCalc} className="p-2 rounded-lg bg-white/5 border border-white/10 text-slate-300 hover:text-cyber-cyan transition-all" title="Calculator"><Calculator size={18} /></button>
                    <div className={`hidden md:flex px-4 py-2 rounded-lg border bg-black/40 items-center gap-2 font-mono font-bold ${timeLeft < 300 ? 'text-red-500 border-red-500 animate-pulse' : 'text-cyber-cyan border-cyber-cyan/30'}`}>
                        <Clock size={16} /> {formatTime(timeLeft)}
                    </div>
                    <button onClick={() => setShowSubmitModal(true)} className="px-6 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-500 transition-colors shadow-lg">Submit</button>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden relative">
                <div className="flex-1 overflow-y-auto custom-scrollbar p-6 relative z-10 pb-24">
                    <div className="max-w-5xl mx-auto">
                        <div className="glass-panel rounded-2xl border border-white/10 overflow-hidden relative">
                            <div className="p-4 border-b border-white/10 bg-white/5 flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-bold text-white">Question {currentQIndex + 1}</span>
                                    <span className="text-xs text-slate-400 border-l border-white/10 pl-3">{currentQ.type}</span>
                                    <span className="text-xs text-cyber-yellow border-l border-white/10 pl-3 flex items-center gap-1">
                                        <Clock size={12}/> {formatTime(timeSpent[currentQ.id] || 0)}
                                    </span>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={handleBookmark} className={`p-2 rounded-lg transition-colors ${bookmarks.includes(currentQ.id) ? 'text-cyber-pink bg-cyber-pink/10' : 'text-slate-400 hover:bg-white/10'}`}>
                                        <Bookmark size={16} fill={bookmarks.includes(currentQ.id) ? "currentColor" : "none"}/>
                                    </button>
                                    <button onClick={() => setIsExpanded(!isExpanded)} className="p-2 hover:bg-white/10 rounded-lg text-slate-400"><Maximize2 size={16}/></button>
                                </div>
                            </div>

                            <div className="p-8">
                                <p className="text-lg md:text-xl font-medium text-white leading-relaxed mb-8">{currentQ.text}</p>
                                {currentQ.type === 'MCQ' ? (
                                    <div className="grid gap-3">
                                        {currentQ.options?.map((opt, idx) => (
                                            <button key={idx} onClick={() => handleAnswer(idx)} className={`p-4 rounded-xl border text-left flex items-center gap-4 transition-all group ${answers[currentQ.id] === idx ? 'bg-cyber-cyan/10 border-cyber-cyan text-cyber-cyan shadow-[0_0_15px_rgba(0,243,255,0.1)]' : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20 text-slate-300'}`}>
                                                <div className={`w-8 h-8 rounded-full border flex items-center justify-center text-sm font-bold transition-colors ${answers[currentQ.id] === idx ? 'border-cyber-cyan bg-cyber-cyan text-black' : 'border-slate-500 group-hover:border-white'}`}>{String.fromCharCode(65 + idx)}</div>
                                                <span className="text-sm md:text-base">{opt}</span>
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="bg-black/30 p-6 rounded-xl border border-white/10">
                                        <label className="text-sm text-slate-400 mb-2 block">Numerical Value Answer</label>
                                        <input type="number" value={answers[currentQ.id] || ''} onChange={(e) => handleAnswer(e.target.value)} className="w-full max-w-sm bg-black/50 border border-white/20 rounded-lg px-4 py-3 text-white text-lg font-mono focus:border-cyber-cyan outline-none" placeholder="Enter numeric value" />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="hidden md:flex justify-between items-center mt-6">
                            <button onClick={() => jumpToQuestion(Math.max(0, currentQIndex - 1))} disabled={currentQIndex === 0} className="px-6 py-3 rounded-xl border border-white/10 hover:bg-white/5 text-white disabled:opacity-50 flex items-center gap-2"><ChevronLeft size={18} /> Previous</button>
                            <div className="flex gap-3">
                                <button onClick={handleMarkReview} className="px-6 py-3 rounded-xl border border-cyber-purple/50 text-cyber-purple hover:bg-cyber-purple/10 flex items-center gap-2"><Flag size={18} /> Mark for Review</button>
                                <button onClick={handleClear} className="px-6 py-3 rounded-xl border border-white/10 text-slate-300 hover:text-white">Clear</button>
                            </div>
                            <button onClick={handleSaveNext} className="px-10 py-3 rounded-xl bg-gradient-to-r from-cyber-cyan to-blue-600 text-white font-bold hover:scale-105 transition-transform flex items-center gap-2 shadow-lg">Save & Next <ChevronRight size={18} /></button>
                        </div>
                    </div>
                </div>

                <div className={`fixed inset-y-0 right-0 w-[320px] bg-[#0b0f1a] border-l border-white/10 z-30 transform transition-transform duration-300 ${isPaletteOpen ? 'translate-x-0' : 'translate-x-full md:translate-x-0'} md:relative`}>
                    <div className="h-full flex flex-col">
                        <div className="p-4 border-b border-white/10 flex items-center gap-3 bg-white/5">
                            <img src="https://ui-avatars.com/api/?name=User" className="w-10 h-10 rounded-full border border-cyber-cyan/30" alt="User" />
                            <div>
                                <h4 className="text-white font-bold text-sm">Student</h4>
                                <p className="text-[10px] text-slate-400">Time: <span className="text-cyber-cyan font-mono">{formatTime(timeLeft)}</span></p>
                            </div>
                            <button onClick={() => setIsPaletteOpen(false)} className="md:hidden ml-auto p-2"><ChevronRight /></button>
                        </div>
                        <div className="p-4 grid grid-cols-2 gap-2 border-b border-white/10 text-[10px] text-slate-400 bg-black/20">
                            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-green-500 rounded"></div> Answered</div>
                            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-red-500/20 border border-red-500 rounded"></div> Not Answered</div>
                            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-white/5 border border-white/20 rounded"></div> Not Visited</div>
                            <div className="flex items-center gap-2"><div className="w-3 h-3 bg-cyber-purple rounded"></div> Marked</div>
                        </div>
                        <div className="flex-1 overflow-y-auto custom-scrollbar p-4">
                            <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-4 sticky top-0 bg-[#0b0f1a] py-2 z-10">{activeSubject} Palette</h4>
                            <div className="grid grid-cols-5 gap-2">
                                {config.questions.map((q, idx) => {
                                    if (q.subject !== activeSubject) return null;
                                    const isActive = currentQIndex === idx;
                                    const qStatus = status[q.id] || 'not_visited';
                                    return (
                                        <button key={q.id} onClick={() => jumpToQuestion(idx)} className={`w-10 h-10 rounded-lg flex items-center justify-center text-xs font-bold border transition-all ${STATUS_COLORS[qStatus as keyof typeof STATUS_COLORS]} ${isActive ? 'ring-2 ring-white scale-110 z-10' : ''} ${bookmarks.includes(q.id) ? 'ring-1 ring-cyber-pink' : ''}`}>
                                            {idx + 1}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {showSubmitModal && (
                <div className="absolute inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-[#0b0f1a] border border-cyber-cyan/30 p-8 rounded-3xl max-w-sm w-full text-center">
                        <Check size={48} className="text-cyber-cyan mx-auto mb-4 bg-cyber-cyan/10 rounded-full p-2" />
                        <h2 className="text-2xl font-bold text-white mb-2">Submit Test?</h2>
                        <div className="flex gap-3">
                            <button onClick={() => setShowSubmitModal(false)} className="flex-1 py-3 bg-white/10 text-white rounded-xl font-bold">Review</button>
                            <button onClick={handleSubmit} className="flex-1 py-3 bg-green-600 text-white rounded-xl font-bold shadow-[0_0_20px_#22c55e]">Confirm Submit</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
