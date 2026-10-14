
import React, { useState, useEffect } from 'react';
import { TrendingUp, Award, BarChart, ChevronRight, Info, AlertCircle, Zap, Brain, Target, ArrowLeft } from 'lucide-react';
import { statsService } from '../services/statsService';
import { firebase } from '../services/backend';

interface PredictionData {
  rankRange: {
    best: number;
    expected: number;
    worst: number;
  };
  percentile: number;
  confidence: number;
  insights: string[];
}

type TestSource = 'Zuaki Mock Test' | 'PYQ Paper' | 'Coaching Mock' | 'Self Estimated';
type Difficulty = 'Auto' | 'Easy' | 'Moderate' | 'Tough';
type AccuracyRange = 'Below 60%' | '60–75%' | 'Above 75%';

export const RankPredictor: React.FC = () => {
  // Input States
  const [marks, setMarks] = useState<number>(150);
  const [testSource, setTestSource] = useState<TestSource>('Zuaki Mock Test');
  const [difficulty, setDifficulty] = useState<Difficulty>('Auto');
  const [accuracy, setAccuracy] = useState<AccuracyRange | ''>('');
  const [subjectMarks, setSubjectMarks] = useState({
    physics: '',
    chemistry: '',
    maths: ''
  });

  const [prediction, setPrediction] = useState<PredictionData | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  // Auto-fill logic
  useEffect(() => {
    const stats = statsService.getStats();
    if (stats.quizzesAttempted > 0) {
      // Auto-fill accuracy if not touched
      if (!accuracy) {
        if (stats.accuracy < 60) setAccuracy('Below 60%');
        else if (stats.accuracy <= 75) setAccuracy('60–75%');
        else setAccuracy('Above 75%');
      }
      
      // Auto-fill subject trends (logic-based placeholders)
      // In a real app we'd fetch actual subject-wise averages from history
    }
  }, []);

  const calculateConfidence = () => {
    let score = 60; // Base for marks + source
    if (difficulty !== 'Auto') score += 15;
    if (accuracy) score += 10;
    if (subjectMarks.physics && subjectMarks.chemistry && subjectMarks.maths) score += 15;
    return score;
  };

  const handlePredict = async () => {
    setIsCalculating(true);
    // Simulate complex calculation
    await new Promise(r => setTimeout(r, 1500));

    const totalMarks = marks;
    // Simple mock rank logic for JEE Main 2025
    // 250+ -> < 1000
    // 200 -> ~5000
    // 150 -> ~25000
    // 100 -> ~100000
    
    const baseRank = Math.pow(300 - totalMarks, 2.2) / 2;
    const expected = Math.max(1, Math.round(baseRank));
    
    // Adjust based on difficulty
    const diffMultiplier = difficulty === 'Easy' ? 1.2 : difficulty === 'Tough' ? 0.8 : 1.0;
    const adjustedExpected = Math.round(expected * diffMultiplier);

    const result: PredictionData = {
      rankRange: {
        best: Math.max(1, Math.round(adjustedExpected * 0.85)),
        expected: adjustedExpected,
        worst: Math.round(adjustedExpected * 1.2)
      },
      percentile: parseFloat((100 - (adjustedExpected / 1200000) * 100).toFixed(2)),
      confidence: calculateConfidence(),
      insights: generateInsights(totalMarks, accuracy, subjectMarks)
    };

    setPrediction(result);
    setIsCalculating(false);
  };

  const generateInsights = (m: number, acc: string, sub: any) => {
    const tips = [];
    if (m < 150) tips.push("Focus on completing high-weightage chapters first.");
    if (acc === 'Below 60%') tips.push("Your accuracy is holding you back. Practice more PYQs.");
    else tips.push("Maintain consistency. Accuracy is your strength.");
    
    const p = parseInt(sub.physics) || 0;
    const c = parseInt(sub.chemistry) || 0;
    const ma = parseInt(sub.maths) || 0;

    if (p && c && ma) {
        const minSub = Math.min(p, c, ma);
        if (minSub === p) tips.push("Physics score is lower than average. Revise Formula Vault.");
        if (minSub === c) tips.push("Chemistry needs factual revision from Short Notes.");
        if (minSub === ma) tips.push("Maths requires more logical practice. Try Quiz Battle.");
    }
    
    return tips;
  };

  return (
    <div className="h-full w-full bg-[#020617] overflow-y-auto custom-scrollbar p-6">
      <div className="max-w-2xl mx-auto pb-24">
        
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-cyber-yellow/10 text-cyber-yellow">
              <TrendingUp size={24} />
            </div>
            <h1 className="text-3xl font-display font-bold text-white uppercase tracking-widest">Rank Predictor</h1>
          </div>
          <p className="text-slate-400 text-sm">Analyze your potential JEE rank based on current performance.</p>
        </div>

        {!prediction && !isCalculating ? (
          <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            
            {/* 1. Marks Input */}
            <section className="space-y-4">
              <div className="flex justify-between items-end">
                <label className="text-xs font-bold text-white uppercase tracking-widest">Expected JEE Marks</label>
                <div className="flex items-center gap-2">
                    <span className="text-cyber-yellow font-mono text-2xl font-bold">{marks}</span>
                    <span className="text-slate-500 text-xs uppercase">/ 300</span>
                </div>
              </div>
              <input 
                type="range" 
                min="0" max="300" 
                value={marks} 
                onChange={(e) => setMarks(parseInt(e.target.value))}
                className="w-full h-2 bg-white/5 rounded-lg appearance-none cursor-pointer accent-cyber-yellow"
              />
              <p className="text-[10px] text-slate-500 font-medium italic">Hint: Use your latest full mock or PYQ score.</p>
            </section>

            {/* 2. Test Source */}
            <section className="space-y-3">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Test Source (Required)</label>
              <div className="grid grid-cols-2 gap-2">
                {['Zuaki Mock Test', 'PYQ Paper', 'Coaching Mock', 'Self Estimated'].map((source) => (
                  <button
                    key={source}
                    onClick={() => setTestSource(source as TestSource)}
                    className={`py-3 px-4 rounded-xl text-xs font-bold transition-all border ${
                      testSource === source 
                      ? 'bg-cyber-yellow text-black border-cyber-yellow shadow-[0_0_15px_rgba(252,238,10,0.3)]' 
                      : 'bg-white/5 border-white/10 text-slate-400 hover:border-white/30'
                    }`}
                  >
                    {source}
                  </button>
                ))}
              </div>
            </section>

            {/* 3. Shift Difficulty */}
            <section className="space-y-3">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Shift Difficulty</label>
              <div className="flex bg-white/5 p-1 rounded-xl border border-white/10">
                {['Auto', 'Easy', 'Moderate', 'Tough'].map((diff) => (
                  <button
                    key={diff}
                    onClick={() => setDifficulty(diff as Difficulty)}
                    className={`flex-1 py-2.5 rounded-lg text-[10px] font-bold uppercase transition-all ${
                      difficulty === diff 
                      ? 'bg-white/10 text-white shadow-inner' 
                      : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {diff}
                  </button>
                ))}
              </div>
              {difficulty === 'Auto' && (
                <p className="text-[9px] text-cyber-cyan font-bold uppercase tracking-tighter flex items-center gap-1">
                  <Zap size={10} /> Recommended for accurate percentile estimation
                </p>
              )}
            </section>

            {/* 4. Accuracy Level (Optional) */}
            <section className="space-y-3">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Accuracy Level (Optional)</label>
              <div className="grid grid-cols-3 gap-2">
                {['Below 60%', '60–75%', 'Above 75%'].map((range) => (
                  <button
                    key={range}
                    onClick={() => setAccuracy(range as AccuracyRange)}
                    className={`py-3 rounded-xl text-[10px] font-bold uppercase transition-all border ${
                      accuracy === range 
                      ? 'bg-cyber-cyan/20 border-cyber-cyan text-cyber-cyan' 
                      : 'bg-white/5 border-white/10 text-slate-500'
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </section>

            {/* 5. Subject Wise (Optional) */}
            <section className="space-y-4">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-widest">Subject-wise Marks (Optional)</label>
              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1.5">
                  <span className="text-[9px] text-slate-500 uppercase font-bold ml-1">Physics</span>
                  <input 
                    type="number" 
                    value={subjectMarks.physics}
                    onChange={(e) => setSubjectMarks({...subjectMarks, physics: e.target.value})}
                    placeholder="0"
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white text-sm focus:border-cyber-cyan outline-none transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <span className="text-[9px] text-slate-500 uppercase font-bold ml-1">Chemistry</span>
                  <input 
                    type="number" 
                    value={subjectMarks.chemistry}
                    onChange={(e) => setSubjectMarks({...subjectMarks, chemistry: e.target.value})}
                    placeholder="0"
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white text-sm focus:border-cyber-purple outline-none transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <span className="text-[9px] text-slate-500 uppercase font-bold ml-1">Maths</span>
                  <input 
                    type="number" 
                    value={subjectMarks.maths}
                    onChange={(e) => setSubjectMarks({...subjectMarks, maths: e.target.value})}
                    placeholder="0"
                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white text-sm focus:border-cyber-pink outline-none transition-all"
                  />
                </div>
              </div>
            </section>

            {/* Confidence HUD */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <Info size={16} className="text-slate-500" />
                    <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Data Confidence</span>
                </div>
                <div className="flex items-center gap-3">
                    <div className="w-24 h-1.5 bg-black/40 rounded-full overflow-hidden">
                        <div 
                            className="h-full bg-cyber-cyan transition-all duration-500" 
                            style={{ width: `${calculateConfidence()}%` }}
                        ></div>
                    </div>
                    <span className="text-xs font-mono font-bold text-white">{calculateConfidence()}%</span>
                </div>
            </div>

            <button 
              onClick={handlePredict}
              className="w-full py-5 bg-cyber-yellow text-black font-display font-bold text-xl uppercase tracking-[0.2em] rounded-2xl shadow-[0_0_30px_rgba(252,238,10,0.3)] hover:shadow-[0_0_50px_rgba(252,238,10,0.5)] transition-all active:scale-95"
            >
              Analyze Prediction
            </button>
          </div>
        ) : isCalculating ? (
          <div className="flex flex-col items-center justify-center py-20 animate-pulse">
            <div className="w-16 h-16 border-4 border-cyber-yellow border-t-transparent rounded-full animate-spin mb-6"></div>
            <h2 className="text-xl font-display font-bold text-white uppercase tracking-widest">Processing Data...</h2>
            <p className="text-slate-500 text-xs mt-2 font-mono">Running Vercel AI Simulations</p>
          </div>
        ) : (
          <div className="space-y-6 animate-in zoom-in-95 duration-500">
            {/* Rank Result Card */}
            <div className="glass-panel p-8 rounded-[40px] border border-cyber-yellow/30 text-center relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-cyber-yellow/5 rounded-full blur-[80px] -mr-10 -mt-10"></div>
                
                <p className="text-slate-400 text-xs uppercase tracking-[0.2em] mb-4">Estimated Common Rank (CRL)</p>
                <h2 className="text-6xl md:text-7xl font-display font-bold text-white mb-2 drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]">
                    {prediction!.rankRange.expected.toLocaleString()}
                </h2>
                
                <div className="flex justify-center items-center gap-2 mb-8">
                    <div className="px-4 py-1.5 rounded-full bg-cyber-yellow/10 border border-cyber-yellow/20 text-cyber-yellow font-mono font-bold text-sm">
                        {prediction!.percentile} Percentile
                    </div>
                </div>

                <div className="grid grid-cols-3 gap-3 border-t border-white/5 pt-8">
                    <div>
                        <p className="text-[9px] text-slate-500 uppercase tracking-widest mb-1">Best Case</p>
                        <p className="text-green-400 font-bold font-mono">#{prediction!.rankRange.best.toLocaleString()}</p>
                    </div>
                    <div className="border-x border-white/5">
                        <p className="text-[9px] text-slate-500 uppercase tracking-widest mb-1">Confidence</p>
                        <p className="text-white font-bold">{prediction!.confidence}%</p>
                    </div>
                    <div>
                        <p className="text-[9px] text-slate-500 uppercase tracking-widest mb-1">Worst Case</p>
                        <p className="text-red-400 font-bold font-mono">#{prediction!.rankRange.worst.toLocaleString()}</p>
                    </div>
                </div>
            </div>

            {/* AI Insights */}
            <div className="glass-panel p-6 rounded-3xl border border-cyber-purple/30 bg-cyber-purple/5">
                <h3 className="text-cyber-purple font-bold text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
                    <Brain size={16} /> GenZ AI Insights
                </h3>
                <div className="space-y-3">
                    {prediction!.insights.map((insight, i) => (
                        <div key={i} className="flex gap-3 text-sm text-slate-300 items-start">
                            <div className="w-1.5 h-1.5 rounded-full bg-cyber-purple mt-1.5 shrink-0 shadow-[0_0_5px_#9d00ff]"></div>
                            <p>{insight}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Improvement CTA */}
            <div className="bg-black/40 border border-white/10 rounded-2xl p-6 flex items-center justify-between group cursor-pointer hover:border-cyber-cyan transition-all" onClick={() => setPrediction(null)}>
                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-cyber-cyan/10 flex items-center justify-center text-cyber-cyan group-hover:scale-110 transition-transform">
                        <Target size={24} />
                    </div>
                    <div>
                        <h4 className="text-white font-bold text-sm">Refine Prediction</h4>
                        <p className="text-slate-500 text-xs">Add more data for 100% confidence.</p>
                    </div>
                </div>
                <ChevronRight className="text-slate-500 group-hover:text-white transition-colors" />
            </div>

            <button 
              onClick={() => setPrediction(null)}
              className="w-full py-4 text-slate-500 text-xs uppercase font-bold tracking-widest hover:text-white transition-colors"
            >
              Start New Analysis
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
