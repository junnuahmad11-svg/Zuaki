
import React, { useState, useEffect, useRef } from 'react';
import { Clock, Coffee, BookOpen, Brain } from 'lucide-react';
import { statsService } from '../services/statsService';

export const ActiveTimeTracker: React.FC = () => {
  const [isActive, setIsActive] = useState(false); // Controls modal visibility
  const [canDismiss, setCanDismiss] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [sessionSeconds, setSessionSeconds] = useState(0);
  
  const idleTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  
  const SESSION_LIMIT = 1200; // 20 minutes in seconds for prompt
  const IDLE_TIMEOUT = 120; // 2 minutes to consider idle

  // Passive Tracking Loop (Real-time XP)
  useEffect(() => {
    const interval = setInterval(() => {
      // Only increment if modal is NOT open
      if (!isActive) {
        setSessionSeconds(prev => {
          // Every 60 seconds, grant 1 XP silently for "Time Spent"
          if ((prev + 1) % 60 === 0) {
             statsService.addStudyTime(60); 
          }

          if (prev >= SESSION_LIMIT) {
            triggerPopup();
            return 0;
          }
          return prev + 1;
        });
      }
    }, 1000);

    // Reset idle timer on interaction
    const resetIdle = () => {
       if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
       idleTimerRef.current = setTimeout(() => {
          // Logic for idle (could pause session)
       }, IDLE_TIMEOUT * 1000);
    };

    window.addEventListener('mousemove', resetIdle);
    window.addEventListener('keydown', resetIdle);
    window.addEventListener('touchstart', resetIdle);

    return () => {
      clearInterval(interval);
      window.removeEventListener('mousemove', resetIdle);
      window.removeEventListener('keydown', resetIdle);
      window.removeEventListener('touchstart', resetIdle);
    };
  }, [isActive]);

  const triggerPopup = () => {
    setIsActive(true);
    setCanDismiss(false);
    setTimeout(() => {
      setCanDismiss(true);
    }, 3000);
  };

  const handleContinue = async () => {
    // Log bonus XP for completing a session block
    statsService.updateStats({ xp: statsService.getStats().xp + 20 });
    
    setSessionSeconds(0);
    setIsActive(false);
  };

  const handleBreak = () => {
    setSessionSeconds(0);
    setIsActive(false);
  };

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-[#020617]/90 backdrop-blur-md"></div>

      {/* Modal */}
      <div className="relative w-full max-w-md bg-[#050818] border border-cyber-cyan/30 rounded-[30px] p-8 shadow-[0_0_50px_rgba(0,243,255,0.2)] flex flex-col items-center text-center animate-in zoom-in-95 duration-300">
        
        {/* Glow Effects */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyber-cyan to-transparent shadow-[0_0_10px_#00f3ff]"></div>
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyber-purple to-transparent shadow-[0_0_10px_#9d00ff]"></div>

        {/* Icon Animation */}
        <div className="w-20 h-20 rounded-full bg-cyber-cyan/10 border border-cyber-cyan flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(0,243,255,0.3)] animate-pulse">
            <Clock size={40} className="text-cyber-cyan" />
        </div>

        <h2 className="text-3xl font-display font-bold text-white mb-2 tracking-wide">Still Studying?</h2>
        <p className="text-slate-400 mb-8 font-sans">We've tracked a solid 20-minute session. Keep the momentum going or take a breather?</p>

        {!canDismiss ? (
           <div className="text-cyber-cyan font-bold text-xl animate-pulse mb-6">
               Verifying Session...
           </div>
        ) : (
            <div className="flex flex-col gap-3 w-full">
                <button 
                    onClick={handleContinue}
                    className="w-full py-4 rounded-xl bg-gradient-to-r from-cyber-cyan to-blue-600 text-white font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(0,243,255,0.4)] hover:shadow-[0_0_30px_rgba(0,243,255,0.6)] hover:scale-[1.02] transition-all flex items-center justify-center gap-2"
                >
                    <BookOpen size={20} /> Yes, I'm Studying (+20 XP)
                </button>
                
                <button 
                    onClick={handleBreak}
                    className="w-full py-4 rounded-xl bg-cyber-purple/20 border border-cyber-purple/50 text-white font-bold uppercase tracking-widest hover:bg-cyber-purple/30 transition-all flex items-center justify-center gap-2"
                >
                    <Coffee size={20} /> Take a Short Break
                </button>
                
                {/* AI Nudge */}
                <div className="mt-4 p-3 rounded-xl bg-white/5 border border-white/10 flex items-start gap-3 text-left">
                    <div className="p-1.5 bg-cyber-pink/20 rounded-lg text-cyber-pink mt-0.5">
                        <Brain size={14} />
                    </div>
                    <div>
                        <p className="text-xs text-white font-bold mb-0.5">GenZ Insight</p>
                        <p className="text-[10px] text-slate-400">Great focus! Try solving 5 quick physics questions to reinforce what you just read.</p>
                    </div>
                </div>
            </div>
        )}
      </div>
    </div>
  );
};
