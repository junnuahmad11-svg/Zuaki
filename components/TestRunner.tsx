
import React, { useState, useEffect } from 'react';
import { Clock, ChevronLeft, ChevronRight, Save, Bookmark, Grid } from 'lucide-react';
import { ViewState, Question } from '../types';

interface TestRunnerProps {
    onComplete: (results: any) => void;
    onExit: () => void;
}

const MOCK_QUESTIONS: Question[] = [
    { id: 'q1', text: "A particle moves with S.H.M. If the velocity is max at equilibrium, what is acceleration at extreme?", type: 'MCQ', options: ["Maximum", "Zero", "Minimum", "Constant"], correctAnswer: 0, explanation: "At extreme position, x=A, so a = -w^2 A (max magnitude).", subject: 'Physics', chapter: 'Oscillations', difficulty: 'Easy' },
    { id: 'q2', text: "Which law conservation is implied in Kirchhoff's Current Law?", type: 'MCQ', options: ["Charge", "Energy", "Momentum", "Mass"], correctAnswer: 0, explanation: "KCL is based on conservation of charge.", subject: 'Physics', chapter: 'Current Electricity', difficulty: 'Easy' },
    { id: 'q3', text: "Calculate the molarity of 5g NaOH in 450mL solution.", type: 'NUMERICAL', correctAnswer: 0.278, explanation: "M = moles/vol(L) = (5/40) / 0.45 = 0.278 M", subject: 'Chemistry', chapter: 'Solutions', difficulty: 'Medium' },
    { id: 'q4', text: "Integration of tan(x) dx is?", type: 'MCQ', options: ["ln|sec x|", "ln|sin x|", "sec^2 x", "tan^2 x"], correctAnswer: 0, explanation: "Standard formula.", subject: 'Maths', chapter: 'Integration', difficulty: 'Easy' },
    { id: 'q5', text: "In a Young's double slit experiment, if the separation between slits is halved...", type: 'MCQ', options: ["Fringe width doubles", "Fringe width halves", "No change", "Intensity doubles"], correctAnswer: 0, explanation: "Beta = D * lambda / d. If d is halved, Beta doubles.", subject: 'Physics', chapter: 'Wave Optics', difficulty: 'Medium' }
];

export const TestRunner: React.FC<TestRunnerProps> = ({ onComplete, onExit }) => {
    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [answers, setAnswers] = useState<Record<string, string | number>>({});
    const [marked, setMarked] = useState<string[]>([]);
    const [timeLeft, setTimeLeft] = useState(3 * 60 * 60); // 3 Hours
    const [isPaletteOpen, setIsPaletteOpen] = useState(false);

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 0) {
                    handleSubmit();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const handleAnswer = (val: string | number) => {
        setAnswers(prev => ({ ...prev, [MOCK_QUESTIONS[currentQIndex].id]: val }));
    };

    const toggleMark = () => {
        const qId = MOCK_QUESTIONS[currentQIndex].id;
        if (marked.includes(qId)) setMarked(prev => prev.filter(id => id !== qId));
        else setMarked(prev => [...prev, qId]);
    };

    const handleSubmit = () => {
        // Calculate basic result
        let score = 0;
        let correct = 0;
        let wrong = 0;
        
        MOCK_QUESTIONS.forEach(q => {
            const userAns = answers[q.id];
            if (userAns !== undefined) {
                // Simplified checking (index for MCQ, value for numerical)
                if (q.type === 'MCQ' && userAns === q.correctAnswer) {
                    score += 4;
                    correct++;
                } else if (q.type === 'NUMERICAL' && Number(userAns) === Number(q.correctAnswer)) { // Approx check needed in real app
                    score += 4;
                    correct++;
                } else {
                    score -= 1;
                    wrong++;
                }
            }
        });

        onComplete({
            score,
            totalMarks: MOCK_QUESTIONS.length * 4,
            correctCount: correct,
            wrongCount: wrong,
            skippedCount: MOCK_QUESTIONS.length - (correct + wrong),
            answers,
            timeTaken: (3 * 60 * 60) - timeLeft
        });
    };

    const formatTime = (s: number) => {
        const h = Math.floor(s / 3600);
        const m = Math.floor((s % 3600) / 60);
        const sec = s % 60;
        return `${h}:${m.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
    };

    const currentQ = MOCK_QUESTIONS[currentQIndex];

    return (
        <div className="h-full w-full bg-[#020617] flex flex-col relative overflow-hidden">
            {/* Header */}
            <div className="h-16 border-b border-white/10 bg-black/40 backdrop-blur-md flex items-center justify-between px-6 z-20">
                <h2 className="text-white font-bold text-lg">JEE Full Mock 1</h2>
                <div className="flex items-center gap-4">
                    <div className={`px-4 py-2 rounded-full border border-white/10 bg-white/5 flex items-center gap-2 font-mono font-bold ${timeLeft < 300 ? 'text-red-500 animate-pulse' : 'text-cyber-cyan'}`}>
                        <Clock size={16} />
                        {formatTime(timeLeft)}
                    </div>
                    <button onClick={handleSubmit} className="px-6 py-2 bg-green-500 text-black font-bold rounded-lg hover:bg-green-400 transition-colors shadow-[0_0_15px_#22c55e]">
                        Submit Test
                    </button>
                </div>
            </div>

            <div className="flex-1 flex overflow-hidden">
                {/* Question Area */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-10 relative z-10">
                    <div className="max-w-4xl mx-auto">
                        <div className="flex items-center justify-between mb-6">
                            <span className="text-cyber-purple font-bold text-sm uppercase tracking-widest">{currentQ.subject} • {currentQ.chapter}</span>
                            <div className="flex items-center gap-2">
                                <span className="text-xs text-slate-400">Marking: +4, -1</span>
                                <button onClick={toggleMark} className={`p-2 rounded-full transition-colors ${marked.includes(currentQ.id) ? 'bg-cyber-yellow text-black' : 'bg-white/5 text-slate-400 hover:text-white'}`}>
                                    <Bookmark size={18} fill={marked.includes(currentQ.id) ? "currentColor" : "none"} />
                                </button>
                            </div>
                        </div>

                        <div className="glass-panel p-8 rounded-3xl border border-white/10 mb-8">
                            <h3 className="text-xl md:text-2xl font-medium text-white leading-relaxed mb-8">
                                <span className="text-slate-500 mr-4">Q{currentQIndex + 1}.</span> 
                                {currentQ.text}
                            </h3>

                            {currentQ.type === 'MCQ' ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {currentQ.options?.map((opt, idx) => (
                                        <button 
                                            key={idx}
                                            onClick={() => handleAnswer(idx)}
                                            className={`p-5 rounded-xl border text-left flex items-center gap-4 transition-all group ${
                                                answers[currentQ.id] === idx 
                                                ? 'bg-cyber-cyan/10 border-cyber-cyan text-cyber-cyan shadow-[0_0_15px_rgba(0,243,255,0.1)]' 
                                                : 'bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20 text-slate-300'
                                            }`}
                                        >
                                            <div className={`w-8 h-8 rounded-full border flex items-center justify-center text-sm font-bold transition-colors ${answers[currentQ.id] === idx ? 'border-cyber-cyan bg-cyber-cyan text-black' : 'border-slate-500 text-slate-500 group-hover:border-white group-hover:text-white'}`}>
                                                {String.fromCharCode(65 + idx)}
                                            </div>
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <div>
                                    <label className="text-xs text-slate-400 mb-2 block">Enter Numerical Value</label>
                                    <input 
                                        type="number" 
                                        value={answers[currentQ.id] || ''} 
                                        onChange={(e) => handleAnswer(e.target.value)}
                                        className="w-full max-w-xs bg-black/40 border border-white/10 rounded-xl px-4 py-4 text-white text-xl font-mono focus:border-cyber-cyan outline-none"
                                        placeholder="0.00"
                                    />
                                </div>
                            )}
                        </div>

                        <div className="flex justify-between items-center">
                            <button 
                                onClick={() => setCurrentQIndex(prev => Math.max(0, prev - 1))}
                                disabled={currentQIndex === 0}
                                className="px-6 py-3 rounded-xl border border-white/10 hover:bg-white/5 text-white disabled:opacity-50 flex items-center gap-2"
                            >
                                <ChevronLeft size={18} /> Previous
                            </button>
                            <button 
                                onClick={() => setCurrentQIndex(prev => Math.min(MOCK_QUESTIONS.length - 1, prev + 1))}
                                className="px-8 py-3 rounded-xl bg-cyber-purple text-white font-bold hover:shadow-[0_0_20px_#9d00ff] transition-all flex items-center gap-2"
                            >
                                {currentQIndex === MOCK_QUESTIONS.length - 1 ? 'Finish' : 'Save & Next'} <ChevronRight size={18} />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Palette Toggle (Mobile/Desktop) */}
                <button 
                    onClick={() => setIsPaletteOpen(!isPaletteOpen)}
                    className={`absolute right-0 top-1/2 -translate-y-1/2 bg-black/80 border-l border-y border-white/20 p-2 rounded-l-xl text-white z-30 transition-transform ${isPaletteOpen ? 'translate-x-[-280px]' : 'translate-x-0'}`}
                >
                    <Grid size={24} />
                </button>

                {/* Question Palette Sidebar */}
                <div className={`absolute top-0 right-0 h-full w-[280px] bg-[#050818] border-l border-white/10 z-20 transition-transform duration-300 ${isPaletteOpen ? 'translate-x-0' : 'translate-x-full'}`}>
                    <div className="p-6 h-full flex flex-col">
                        <h3 className="text-white font-bold mb-4">Question Palette</h3>
                        <div className="flex-1 overflow-y-auto custom-scrollbar grid grid-cols-4 gap-3 content-start">
                            {MOCK_QUESTIONS.map((q, idx) => {
                                const isAnswered = answers[q.id] !== undefined;
                                const isMarked = marked.includes(q.id);
                                const isCurrent = currentQIndex === idx;
                                
                                let bg = 'bg-white/5 text-slate-400 border-white/10';
                                if (isCurrent) bg = 'ring-2 ring-white text-white';
                                else if (isMarked) bg = 'bg-cyber-yellow text-black border-cyber-yellow';
                                else if (isAnswered) bg = 'bg-green-500 text-black border-green-500';

                                return (
                                    <button 
                                        key={q.id}
                                        onClick={() => setCurrentQIndex(idx)}
                                        className={`w-10 h-10 rounded-lg border flex items-center justify-center text-sm font-bold transition-all ${bg}`}
                                    >
                                        {idx + 1}
                                    </button>
                                );
                            })}
                        </div>
                        
                        <div className="mt-6 space-y-2 text-xs text-slate-400 border-t border-white/10 pt-4">
                            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-green-500"></div> Answered</div>
                            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-cyber-yellow"></div> Marked for Review</div>
                            <div className="flex items-center gap-2"><div className="w-3 h-3 rounded bg-white/5 border border-white/10"></div> Not Visited</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
