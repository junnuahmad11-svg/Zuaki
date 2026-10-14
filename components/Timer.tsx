
import React, { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, SkipForward, Coffee } from 'lucide-react';
import { statsService } from '../services/statsService';

export const Timer: React.FC = () => {
  const [mode, setMode] = useState<'FOCUS' | 'BREAK'>('FOCUS');
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [showPopup, setShowPopup] = useState(false); // 20 min check
  
  const FOCUS_TIME = 25 * 60;
  const BREAK_TIME = 5 * 60;
  const CHECK_INTERVAL = 20 * 60; 

  const radius = 100;
  const strokeWidth = 8;
  const circumference = 2 * Math.PI * radius;

  useEffect(() => {
    let interval: any;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => {
            // Check 20 min mark relative to start (simplified for demo: if remaining time hits 5 mins in a 25 min session)
            if (mode === 'FOCUS' && prev === (FOCUS_TIME - CHECK_INTERVAL)) {
                setShowPopup(true);
                setIsActive(false); // Pause
            }
            return prev - 1;
        });
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      if (mode === 'FOCUS') {
          statsService.addStudyTime(FOCUS_TIME);
          alert("Session Complete!");
          setMode('BREAK');
          setTimeLeft(BREAK_TIME);
      }
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft, mode]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => { setIsActive(false); setTimeLeft(mode === 'FOCUS' ? FOCUS_TIME : BREAK_TIME); };
  
  const handlePopupContinue = () => { setShowPopup(false); setIsActive(true); };
  const handlePopupBreak = () => { setShowPopup(false); setMode('BREAK'); setTimeLeft(BREAK_TIME); setIsActive(true); };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const offset = circumference - ((FOCUS_TIME - timeLeft) / FOCUS_TIME) * circumference;

  return (
    <div className="h-full w-full flex items-center justify-center p-6 bg-[#020617] relative">
      <div className="w-full max-w-sm flex flex-col items-center">
        {/* SVG Circle */}
        <div className="relative w-64 h-64 mb-10">
            <svg className="w-full h-full -rotate-90">
                <circle cx="128" cy="128" r={radius} stroke="rgba(255,255,255,0.1)" strokeWidth={strokeWidth} fill="none" />
                <circle 
                    cx="128" cy="128" r={radius} 
                    stroke={mode === 'FOCUS' ? '#00f3ff' : '#9d00ff'} 
                    strokeWidth={strokeWidth} 
                    fill="none" 
                    strokeDasharray={circumference} 
                    strokeDashoffset={mode === 'FOCUS' ? offset : 0}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-linear"
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-5xl font-mono font-bold text-white">{formatTime(timeLeft)}</span>
                <span className="text-xs text-cyber-cyan uppercase tracking-widest mt-2">{isActive ? 'Focusing' : 'Paused'}</span>
            </div>
        </div>

        <div className="flex gap-6">
            <button onClick={resetTimer} className="p-4 rounded-full border border-white/20 text-slate-400 hover:text-white"><RotateCcw size={20}/></button>
            <button onClick={toggleTimer} className={`p-6 rounded-[24px] shadow-[0_0_30px_rgba(0,0,0,0.5)] transition-all ${isActive ? 'bg-cyber-pink shadow-[0_0_20px_#ff003c]' : 'bg-cyber-cyan shadow-[0_0_20px_#00f3ff]'}`}>
                {isActive ? <Pause size={32} className="text-white fill-current" /> : <Play size={32} className="text-black fill-current ml-1" />}
            </button>
            <button onClick={() => setTimeLeft(0)} className="p-4 rounded-full border border-white/20 text-slate-400 hover:text-white"><SkipForward size={20}/></button>
        </div>
      </div>

      {showPopup && (
          <div className="absolute inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50">
              <div className="bg-[#0b0f1a] border border-cyber-cyan/30 p-8 rounded-2xl text-center max-w-xs">
                  <h3 className="text-xl font-bold text-white mb-2">20 Minute Check-in</h3>
                  <p className="text-sm text-slate-400 mb-6">Great focus! Continue for XP reward or take a break?</p>
                  <div className="flex flex-col gap-3">
                      <button onClick={handlePopupContinue} className="py-3 bg-cyber-cyan text-black font-bold rounded-xl">Continue (+20 XP)</button>
                      <button onClick={handlePopupBreak} className="py-3 bg-white/10 text-white font-bold rounded-xl flex items-center justify-center gap-2"><Coffee size={16} /> Take Break</button>
                  </div>
              </div>
          </div>
      )}
    </div>
  );
};
