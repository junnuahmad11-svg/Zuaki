
import React, { useEffect, useState } from 'react';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [showText, setShowText] = useState(false);

  useEffect(() => {
    const textTimer = setTimeout(() => setShowText(true), 600);
    const completeTimer = setTimeout(() => {
      onComplete();
    }, 2800);

    return () => {
      clearTimeout(textTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 bg-[#02040a] flex flex-col items-center justify-between py-12 px-6 overflow-hidden z-[200] animate-in fade-in duration-500">
        
        {/* Ambience */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,_#050818_0%,_#000000_100%)]"></div>
        
        {/* Push content to absolute center */}
        <div className="flex-1 flex flex-col items-center justify-center w-full relative z-10">
            
            {/* Centered Logo with soft outer glow */}
            <div className="relative w-48 h-48 mb-8 flex items-center justify-center animate-in fade-in zoom-in-95 duration-1000 ease-out">
                <svg viewBox="0 0 200 220" className="w-full h-full drop-shadow-[0_0_20px_rgba(0,243,255,0.4)]">
                    <defs>
                        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#ff003c" />
                            <stop offset="45%" stopColor="#d946ef" />
                            <stop offset="100%" stopColor="#00f3ff" />
                        </linearGradient>
                        <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="3" result="blur"/>
                            <feMerge>
                                <feMergeNode in="blur"/>
                                <feMergeNode in="SourceGraphic"/>
                            </feMerge>
                        </filter>
                    </defs>

                    {/* Robot Head */}
                    <g filter="url(#softGlow)" stroke="#00f3ff" strokeWidth="4" fill="none">
                        <path d="M60 50 C 60 20, 140 20, 140 50 L 140 85 C 140 105, 60 105, 60 85 Z" />
                        <path d="M50 65 C 42 65, 42 80, 50 80" />
                        <path d="M150 65 C 158 65, 158 80, 150 80" />
                        <circle cx="85" cy="65" r="7" fill="#00f3ff" stroke="none" />
                        <circle cx="115" cy="65" r="7" fill="#00f3ff" stroke="none" />
                    </g>

                    {/* The Z and Book */}
                    <g filter="url(#softGlow)" strokeLinecap="round" strokeLinejoin="round">
                         <path d="M30 135 Q 65 155 100 145" stroke="#ff003c" strokeWidth="4" fill="none" />
                         <path d="M30 135 L 35 165 Q 70 185 100 175" stroke="#ff003c" strokeWidth="4" fill="none" />
                         <path d="M170 135 Q 135 155 100 145" stroke="#00f3ff" strokeWidth="4" fill="none" />
                         <path d="M170 135 L 165 165 Q 130 185 100 175" stroke="#00f3ff" strokeWidth="4" fill="none" />
                         <path d="M75 125 L 125 125 L 75 175 L 125 175" stroke="url(#logoGradient)" strokeWidth="6" fill="none" />
                    </g>
                </svg>
            </div>

            {/* Brand Text */}
            <div className={`flex flex-col items-center transition-all duration-1000 transform ${showText ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                <h1 className="text-5xl font-display font-bold bg-clip-text text-transparent bg-gradient-to-r from-[#00f3ff] to-[#9d00ff] tracking-widest uppercase drop-shadow-[0_0_10px_rgba(0,243,255,0.3)]">
                    Zuaki
                </h1>
                <p className="text-[#00f3ff] font-sans text-sm font-medium tracking-[0.2em] mt-2 opacity-80 uppercase">
                    Your JEE Study Companion
                </p>
            </div>
        </div>

        {/* Footer Text (WhatsApp Style) */}
        <div className={`flex flex-col items-center transition-all duration-1000 delay-500 ${showText ? 'opacity-100' : 'opacity-0'}`}>
            <span className="text-slate-500 font-sans text-[10px] tracking-[0.3em] uppercase mb-1">
                from
            </span>
            <span className="text-[#00f3ff] font-sans font-light text-sm tracking-[0.15em] opacity-60">
                Zubair and Akhil
            </span>
        </div>
    </div>
  );
};
