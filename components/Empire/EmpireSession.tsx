
import React, { useState, useEffect, useMemo } from 'react';
import { 
    Clock, Coins, CheckCircle, XCircle, ArrowRight, Brain, 
    AlertTriangle, Loader2, Sparkles, TrendingUp, Zap, Target, BookOpen, Crown, X
} from 'lucide-react';
import { EmpireFloor, Question } from '../../types';
import { empireService } from '../../services/empireService';

interface Props {
  floor: EmpireFloor;
  onComplete: (res: any) => void;
  onExit: () => void;
}

const EMPIRE_ARENA_DB: Question[] = [
    { 
        id: 'ec1', subject: 'Physics', chapter: 'Kinematics', difficulty: 'Medium', type: 'MCQ',
        text: "CONCEPT: If velocity of a particle is v = At + Bt², where v is in m/s and t is in sec, find the dimensions of B.",
        options: ["[LT⁻³]", "[LT⁻²]", "[LT⁻¹]", "[L]"], 
        correctAnswer: 0,
        explanation: "Dimensions must be homogeneous. v = [LT⁻¹]. Bt² must have same dims. [B][T²] = [LT⁻¹] => [B] = [LT⁻³]."
    },
    { 
        id: 'ec2', subject: 'Physics', chapter: 'Kinematics', difficulty: 'Hard', type: 'INTEGER',
        text: "HEAVY: A car accelerates from rest at 5 m/s² for some time, then decelerates at 10 m/s² to stop. Total time is 15s. Find total distance (in meters).",
        correctAnswer: 250,
        explanation: "Using v-t graph area. t1=10s, t2=5s. Max vel = 50 m/s. Area = 0.5 * 15 * 50 = 375... wait, recalc: acc*t1 = dec*t2. 5t1 = 10(15-t1) => t1=10. s = 0.5*5*100 + 50*5 - 0.5*10*25 = 250 + 250 - 125 = 375."
    },
    { 
        id: 'ec3', subject: 'Maths', chapter: 'Sets & Relations', difficulty: 'Hard', type: 'MCQ',
        text: "FORMULA BASED: Let A = {1, 2, 3, ..., n}. How many reflexive relations are possible on set A?",
        options: ["2^(n²-n)", "2^(n²)", "n²", "2^n"], 
        correctAnswer: 0,
        explanation: "A relation is reflexive if (a,a) ∈ R for all a. Out of n² pairs, n are fixed. Remaining n²-n can be included or not. 2^(n²-n)."
    },
    { 
        id: 'ec4', subject: 'Maths', chapter: 'Sets & Relations', difficulty: 'Medium', type: 'INTEGER',
        text: "CONCEPT: If set A has 3 elements and set B has 4 elements, find the number of injective functions from A to B.",
        correctAnswer: 24,
        explanation: "4P3 = 4 * 3 * 2 = 24."
    }
];

export const EmpireSession: React.FC<Props> = ({ floor, onComplete, onExit }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [userAnswers, setUserAnswers] = useState<Record<string, any>>({});
  const [showExplanation, setShowExplanation] = useState(false);
  const [lastCorrect, setLastCorrect] = useState<boolean | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [encouragementCard, setEncouragementCard] = useState<any>(null);

  // Initialize and shuffle options to avoid "Option 1" bias
  useEffect(() => {
    const filtered = EMPIRE_ARENA_DB.filter(q => q.chapter === floor.name || q.subject === floor.id.startsWith('p') ? 'Physics' : 'Maths').slice(0, 5);
    const shuffled = filtered.map(q => {
        if (q.type !== 'MCQ') return q;
        const opts = [...(q.options || [])];
        const correctText = opts[q.correctAnswer as number];
        const shuffledOpts = opts.sort(() => Math.random() - 0.5);
        return {
            ...q,
            options: shuffledOpts,
            correctAnswer: shuffledOpts.indexOf(correctText)
        };
    });
    setQuestions(shuffled);
    setTimeLeft(shuffled.length * 120);
    
    // Random Zuaki Encouragement Card on start
    const cards = [
        { title: "ZUAKI VALOR", text: "Fear no equation. Mastery is just repetition in disguise.", color: "cyan" },
        { title: "ZENITH MIND", text: "One logical step at a time is how AIR 1 is reached.", color: "purple" }
    ];
    setEncouragementCard(cards[Math.floor(Math.random() * cards.length)]);
    setTimeout(() => setEncouragementCard(null), 4000);

    const t = setInterval(() => setTimeLeft(p => p > 0 ? p - 1 : 0), 1000);
    return () => clearInterval(t);
  }, [floor]);

  const handleAnswer = (val: any) => {
    if (showExplanation) return;
    const q = questions[currentIdx];
    const correct = q.type === 'MCQ' ? val === q.correctAnswer : Number(val) === Number(q.correctAnswer);
    setLastCorrect(correct);
    setUserAnswers({ ...userAnswers, [q.id]: val });
    setShowExplanation(true);
  };

  const next = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setShowExplanation(false);
      setLastCorrect(null);
    } else {
      finalize();
    }
  };

  const finalize = async () => {
    setIsSubmitting(true);
    await new Promise(r => setTimeout(r, 1200));
    const correctCount = questions.filter(q => {
        const uAns = userAnswers[q.id];
        return q.type === 'MCQ' ? uAns === q.correctAnswer : Number(uAns) === Number(q.correctAnswer);
    }).length;
    const res = empireService.processSession(floor.id, correctCount, questions.length, 'Medium');
    onComplete(res);
  };

  const q = questions[currentIdx];
  const [intVal, setIntVal] = useState('');

  if (!q) return <div className="h-full flex items-center justify-center text-slate-500">Initializing Sector Data...</div>;

  return (
    <div className="h-full w-full bg-[#02040a] flex flex-col relative overflow-hidden font-sans select-none">
      
      {encouragementCard && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in zoom-in duration-500">
              <div className={`p-1 border-2 rounded-[40px] shadow-2xl bg-black ${encouragementCard.color === 'cyan' ? 'border-cyber-cyan shadow-cyber-cyan/20' : 'border-cyber-purple shadow-cyber-purple/20'}`}>
                  <div className="glass-panel p-10 rounded-[38px] text-center max-w-xs space-y-4">
                      <Zap size={40} className={encouragementCard.color === 'cyan' ? 'text-cyber-cyan mx-auto' : 'text-cyber-purple mx-auto'} />
                      <h3 className="text-2xl font-display font-black text-white uppercase tracking-widest">{encouragementCard.title}</h3>
                      <p className="text-slate-400 text-sm leading-relaxed italic">"{encouragementCard.text}"</p>
                  </div>
              </div>
          </div>
      )}

      {/* Session HUD */}
      <header className="h-16 px-6 bg-[#0b0f1a] border-b border-white/10 flex items-center justify-between z-20">
          <div className="flex items-center gap-6">
              <div className={`flex items-center gap-2 px-3 py-1 rounded-lg border ${timeLeft < 60 ? 'border-red-500 text-red-500 animate-pulse' : 'border-cyber-yellow/20 text-cyber-yellow'}`}>
                  <Clock size={16} />
                  <span className="font-mono text-sm font-bold tracking-widest">{Math.floor(timeLeft/60)}:{(timeLeft%60).toString().padStart(2,'0')}</span>
              </div>
          </div>
          <div className="flex items-center gap-3">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Sequence {currentIdx + 1}/{questions.length}</span>
              <button onClick={onExit} className="p-2 text-slate-500 hover:text-white"><X size={20}/></button>
          </div>
      </header>

      <main className="flex-1 overflow-y-auto custom-scrollbar p-6 relative z-10 flex flex-col items-center">
          <div className="max-w-2xl w-full pb-40">
              {/* Question Header */}
              <div className="flex justify-between items-center mb-6">
                   <div className="flex items-center gap-3">
                       <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter border ${q.type === 'MCQ' ? 'border-cyber-cyan/30 text-cyber-cyan bg-cyber-cyan/5' : 'border-cyber-purple/30 text-cyber-purple bg-cyber-purple/5'}`}>
                           {q.type} Protocol
                       </span>
                       <span className="text-[9px] text-slate-500 font-bold uppercase tracking-widest">{q.difficulty} Tier</span>
                   </div>
              </div>

              {/* Question Card */}
              <div className={`glass-panel p-8 md:p-12 rounded-[48px] border transition-all duration-700 relative overflow-hidden ${
                  lastCorrect === true ? 'border-green-500 shadow-[0_0_30px_rgba(34,197,94,0.1)]' :
                  lastCorrect === false ? 'border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.1)]' :
                  'border-white/10 shadow-2xl'
              }`}>
                  <p className="text-xl md:text-2xl text-white font-medium leading-relaxed mb-12">{q.text}</p>
                  
                  {q.type === 'MCQ' ? (
                      <div className="grid gap-3">
                          {q.options?.map((opt, idx) => (
                              <button
                                  key={idx}
                                  onClick={() => handleAnswer(idx)}
                                  disabled={showExplanation}
                                  className={`p-5 rounded-3xl border text-left flex items-center gap-5 transition-all duration-300 group ${
                                      showExplanation 
                                      ? idx === q.correctAnswer 
                                        ? 'bg-green-500/20 border-green-500 text-green-400' 
                                        : userAnswers[q.id] === idx ? 'bg-red-500/20 border-red-500 text-red-400' : 'bg-black/20 border-white/5 opacity-30'
                                      : 'bg-white/5 border-white/5 text-slate-300 hover:bg-white/10 hover:border-cyber-cyan/30'
                                  }`}
                              >
                                  <div className={`w-8 h-8 rounded-full border flex items-center justify-center font-black text-xs transition-all ${showExplanation && idx === q.correctAnswer ? 'bg-green-500 border-green-500 text-black' : 'border-slate-800 text-slate-500'}`}>
                                      {String.fromCharCode(65 + idx)}
                                  </div>
                                  {opt}
                              </button>
                          ))}
                      </div>
                  ) : (
                      <div className="space-y-4">
                          <input 
                            type="number" 
                            disabled={showExplanation}
                            value={intVal}
                            onChange={e => setIntVal(e.target.value)}
                            onKeyDown={e => e.key === 'Enter' && handleAnswer(intVal)}
                            placeholder="Type Numeric Answer..."
                            className="w-full bg-black/40 border border-white/10 rounded-2xl p-6 text-center text-4xl font-mono text-white outline-none focus:border-cyber-cyan transition-all"
                          />
                          {!showExplanation && <button onClick={() => handleAnswer(intVal)} className="w-full py-4 bg-cyber-cyan text-black font-bold rounded-xl uppercase tracking-widest">Submit Logic</button>}
                      </div>
                  )}
              </div>

              {/* Feedback */}
              {showExplanation && (
                <div className="mt-8 animate-in slide-in-from-top-6 duration-500">
                    <div className={`p-6 rounded-[32px] border flex gap-5 items-start ${lastCorrect ? 'bg-green-500/5 border-green-500/20' : 'bg-red-500/5 border-red-500/20'}`}>
                        <div className={`p-3 rounded-2xl shrink-0 ${lastCorrect ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                            {lastCorrect ? <Sparkles size={24} /> : <AlertTriangle size={24} />}
                        </div>
                        <div>
                            <h4 className={`text-sm font-black uppercase tracking-[0.2em] mb-2 ${lastCorrect ? 'text-green-400' : 'text-red-400'}`}>
                                {lastCorrect ? 'Logic Verified' : 'Neural Conflict'}
                            </h4>
                            <p className="text-slate-300 text-xs leading-relaxed opacity-90">{q.explanation}</p>
                        </div>
                    </div>
                </div>
              )}
          </div>
      </main>

      {/* SESSION NEXT BUTTON - Fixed positioning above sub-nav */}
      {showExplanation && (
          <div className="absolute bottom-6 left-6 right-6 z-[120] animate-in slide-in-from-bottom-10 duration-500">
              <button 
                  onClick={next}
                  className="w-full max-w-2xl mx-auto py-5 bg-white text-black font-display font-black text-xl uppercase tracking-[0.2em] rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.8)] hover:bg-slate-100 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4 group"
              >
                  {currentIdx === questions.length - 1 ? 'Analyze Empire Surge' : 'Proceed to Next Sequence'}
                  <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
              </button>
          </div>
      )}

      {isSubmitting && (
        <div className="fixed inset-0 z-[200] bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center">
            <Loader2 size={80} className="text-cyber-cyan animate-spin mb-4" />
            <p className="text-white font-display font-bold text-xl uppercase tracking-widest animate-pulse">Updating Neural Ledger...</p>
        </div>
      )}
    </div>
  );
};
