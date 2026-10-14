
import React, { useState } from 'react';
import { Bot, Clock, CheckSquare, BookOpen, BarChart2, Zap, Hexagon, ArrowRight } from 'lucide-react';

interface FeatureShowcaseProps {
  onComplete: () => void;
}

const STEPS = [
  {
    id: 1,
    title: "Welcome to Zuaki",
    subtitle: "A smart study companion — track study time, get AI help, and level up.",
    icon: Hexagon,
    secondaryIcon: Zap,
    color: "text-cyber-cyan",
    activeDotColor: "bg-cyber-cyan",
    bg: "bg-cyber-cyan/10",
    border: "border-cyber-cyan",
    shadow: "shadow-[0_0_20px_rgba(0,243,255,0.3)]"
  },
  {
    id: 2,
    title: "GenZ AI",
    subtitle: "Ask the AI anything — text, voice, images, or upload files. GenZ-powered replies with emojis & quick actions.",
    icon: Bot,
    secondaryIcon: null,
    color: "text-cyber-purple",
    activeDotColor: "bg-cyber-purple",
    bg: "bg-cyber-purple/10",
    border: "border-cyber-purple",
    shadow: "shadow-[0_0_20px_rgba(157,0,255,0.3)]"
  },
  {
    id: 3,
    title: "Smart Planner",
    subtitle: "Upload your college schedule or let AI generate day-by-day JEE plans from selected chapters.",
    icon: Clock,
    secondaryIcon: CheckSquare,
    color: "text-cyber-pink",
    activeDotColor: "bg-cyber-pink",
    bg: "bg-cyber-pink/10",
    border: "border-cyber-pink",
    shadow: "shadow-[0_0_20px_rgba(255,0,60,0.3)]"
  },
  {
    id: 4,
    title: "Quiz & Rank",
    subtitle: "Weekly mock tests, chapter quizzes and rank predictor to track improvements.",
    icon: BookOpen,
    secondaryIcon: BarChart2,
    color: "text-blue-400",
    activeDotColor: "bg-blue-400",
    bg: "bg-blue-400/10",
    border: "border-blue-400",
    shadow: "shadow-[0_0_20px_rgba(96,165,250,0.3)]"
  }
];

export const FeatureShowcase: React.FC<FeatureShowcaseProps> = ({ onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    if (currentIndex < STEPS.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      onComplete();
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const currentStep = STEPS[currentIndex];

  return (
    <div className="h-full w-full bg-[#020617] flex flex-col items-center relative overflow-hidden font-sans text-white">
      {/* Background Ambience */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#050818_0%,_#000000_100%)] z-0"></div>
      <div className={`absolute top-[-20%] right-[-20%] w-[500px] h-[500px] rounded-full blur-[120px] transition-all duration-700 ease-in-out ${currentStep.bg}`}></div>
      <div className={`absolute bottom-[-20%] left-[-20%] w-[500px] h-[500px] rounded-full blur-[120px] transition-all duration-700 ease-in-out ${currentStep.bg}`}></div>

      {/* Top Bar: Skip Button */}
      <div className="w-full max-w-md p-6 flex justify-end relative z-20 mt-4 h-20 items-center">
        <button 
          onClick={handleSkip}
          className="px-5 py-2 rounded-full border border-white/20 text-xs font-mono tracking-widest uppercase hover:bg-white/10 hover:border-cyber-cyan hover:text-cyber-cyan transition-all backdrop-blur-md"
        >
          Skip
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 w-full max-w-md flex flex-col items-center justify-center p-6 relative z-10">
        
        {/* Dynamic Card */}
        <div className={`w-full glass-panel rounded-[40px] p-8 flex flex-col items-center text-center border transition-all duration-500 relative overflow-hidden ${currentStep.border} ${currentStep.shadow}`}>
             {/* Inner Glow */}
             <div className={`absolute inset-0 ${currentStep.bg} opacity-20 blur-2xl transition-all duration-500`}></div>

             {/* Illustration/Icon Area */}
             <div className="relative mb-12 mt-4 transform transition-all duration-500 hover:scale-105">
                <div className={`w-36 h-36 rounded-full border-2 ${currentStep.border} flex items-center justify-center bg-black/40 relative z-10 shadow-[0_0_30px_rgba(0,0,0,0.5)]`}>
                    <currentStep.icon size={72} className={`${currentStep.color} drop-shadow-[0_0_15px_currentColor]`} strokeWidth={1.5} />
                </div>
                
                {/* Secondary Icon Badge */}
                {currentStep.secondaryIcon && (
                    <div className={`absolute -bottom-2 -right-2 w-16 h-16 rounded-full border ${currentStep.border} bg-[#020617] flex items-center justify-center z-20 shadow-lg`}>
                        <currentStep.secondaryIcon size={28} className={`${currentStep.color}`} />
                    </div>
                )}

                {/* Decorative floating particles */}
                <div className="absolute top-0 right-0 w-2 h-2 bg-white rounded-full animate-pulse shadow-[0_0_5px_white]"></div>
                <div className="absolute bottom-4 left-0 w-1.5 h-1.5 bg-white/50 rounded-full animate-bounce delay-75"></div>
                <div className="absolute top-1/2 -left-4 w-1 h-1 bg-white/30 rounded-full animate-pulse delay-150"></div>
             </div>

             {/* Text Content */}
             <h2 className="text-4xl font-display font-bold text-white mb-6 tracking-wide drop-shadow-md">
               {currentStep.title}
             </h2>
             <p className="text-slate-300 text-sm leading-relaxed font-sans px-2 opacity-90">
               {currentStep.subtitle}
             </p>
        </div>
      </div>

      {/* Bottom Section: Pagination & Action Button */}
      <div className="w-full max-w-md p-8 pb-12 flex flex-col items-center gap-8 relative z-20">
        
        {/* Pagination Dots */}
        <div className="flex gap-3">
            {STEPS.map((step, idx) => (
                <div 
                    key={idx}
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                        idx === currentIndex 
                        ? `w-8 ${step.activeDotColor} shadow-[0_0_10px_currentColor]` 
                        : 'w-2 bg-white/20'
                    }`}
                />
            ))}
        </div>

        {/* Continue / Get Started Button */}
        <button
            onClick={handleNext}
            className={`w-full py-5 rounded-2xl font-display font-bold text-lg uppercase tracking-[0.15em] flex items-center justify-center gap-3 transition-all duration-300 group relative overflow-hidden
            ${currentIndex === 3 
                ? 'bg-gradient-to-r from-cyber-cyan to-cyber-purple text-white shadow-[0_0_30px_rgba(0,243,255,0.4)] hover:shadow-[0_0_50px_rgba(0,243,255,0.6)] border border-transparent' 
                : 'bg-white/5 border border-cyber-cyan/30 hover:bg-cyber-cyan/10 hover:border-cyber-cyan text-white shadow-[0_0_15px_rgba(0,243,255,0.1)]'
            }`}
        >
            <span className="relative z-10 flex items-center gap-3">
                {currentIndex === 3 ? 'Get Started' : 'Continue'}
                {currentIndex !== 3 && <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />}
            </span>
            {currentIndex !== 3 && <div className="absolute inset-0 bg-cyber-cyan/10 translate-y-full group-hover:translate-y-0 transition-transform duration-300"></div>}
        </button>

      </div>
    </div>
  );
};
