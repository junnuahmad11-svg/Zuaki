
import React, { useState, useEffect } from 'react';
import { EmpireDashboard } from './EmpireDashboard';
import { EmpireSession } from './EmpireSession';
import { EmpireIntel } from './EmpireIntel';
import { EmpireAssets } from './EmpireAssets';
import { EmpireState, EmpireFloor } from '../../types';
import { empireService } from '../../services/empireService';
import { 
    LayoutGrid, ShieldCheck, Database, Settings as SettingsIcon, 
    ArrowRight, Coins, Crown, Zap, Info, X, ChevronRight, Sparkles 
} from 'lucide-react';

type EmpireSubView = 'DASHBOARD' | 'INTEL' | 'ASSETS' | 'SETTINGS' | 'ONBOARDING' | 'SESSION';

export const KnowledgeEmpire: React.FC = () => {
  const [empireState, setEmpireState] = useState<EmpireState>(empireService.getState());
  const [currentView, setCurrentView] = useState<EmpireSubView>('DASHBOARD');
  const [activeFloor, setActiveFloor] = useState<EmpireFloor | null>(null);
  const [sessionResult, setSessionResult] = useState<any>(null);
  const [isBooting, setIsBooting] = useState(true);

  useEffect(() => {
    // Immersive Boot Sequence
    const timer = setTimeout(() => {
        setIsBooting(false);
        if (!empireState.hasSeenTutorial) {
            setCurrentView('ONBOARDING');
        }
    }, 2500);

    const unsub = empireService.subscribe(setEmpireState);
    return () => {
        unsub();
        clearTimeout(timer);
    };
  }, []);

  const handleStartSession = (floor: EmpireFloor) => {
      setActiveFloor(floor);
      setCurrentView('SESSION');
  };

  const completeOnboarding = () => {
      empireService.updateState({ hasSeenTutorial: true });
      setCurrentView('DASHBOARD');
  };

  if (isBooting) {
    return (
        <div className="fixed inset-0 z-[200] bg-[#02040a] flex flex-col items-center justify-center">
            <div className="relative mb-8">
                <div className="absolute inset-0 bg-cyber-cyan blur-[60px] opacity-20 animate-pulse"></div>
                <Zap size={64} className="text-cyber-cyan animate-bounce relative z-10" />
            </div>
            <h1 className="text-3xl font-display font-black text-white tracking-[0.4em] uppercase mb-2">ZUAKI EMPIRE</h1>
            <p className="text-slate-600 text-[10px] font-mono tracking-widest uppercase">Initializing Business Protocols...</p>
            <div className="w-48 h-1 bg-white/5 rounded-full mt-8 overflow-hidden">
                <div className="h-full bg-cyber-cyan animate-[width_2.5s_ease-in-out]" style={{ width: '100%' }}></div>
            </div>
        </div>
    );
  }

  // Sub-Navigation UI for the Game
  const renderNav = () => (
    <div className="h-20 bg-black/80 backdrop-blur-2xl border-t border-white/10 flex items-center justify-around px-4 z-[110]">
        <NavButton active={currentView === 'DASHBOARD'} icon={LayoutGrid} label="Empire" onClick={() => setCurrentView('DASHBOARD')} />
        <NavButton active={currentView === 'INTEL'} icon={Database} label="Intel" onClick={() => setCurrentView('INTEL')} />
        <NavButton active={currentView === 'ASSETS'} icon={Crown} label="Assets" onClick={() => setCurrentView('ASSETS')} />
        <NavButton active={currentView === 'SETTINGS'} icon={SettingsIcon} label="Config" onClick={() => setCurrentView('SETTINGS')} />
    </div>
  );

  return (
    <div className="fixed inset-0 z-[150] bg-[#02040a] flex flex-col font-sans overflow-hidden">
        {/* Top immersive HUD bar */}
        <div className="h-14 px-6 border-b border-white/5 bg-[#0b0f1a]/80 backdrop-blur-xl flex items-center justify-between z-[110]">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-cyber-cyan/10 border border-cyber-cyan/40 flex items-center justify-center text-cyber-cyan font-black text-xs italic">Z</div>
                <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest">Active Operative Session</span>
            </div>
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 px-3 py-1 bg-black/40 rounded-lg border border-cyber-yellow/20">
                    <Coins size={14} className="text-cyber-yellow" />
                    <span className="text-sm font-mono font-bold text-white">{empireState.brainCoins}</span>
                </div>
            </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 relative overflow-hidden bg-[#02040a]">
            {currentView === 'DASHBOARD' && <EmpireDashboard onStartSession={handleStartSession} />}
            {currentView === 'INTEL' && <EmpireIntel />}
            {currentView === 'ASSETS' && <EmpireAssets state={empireState} />}
            {currentView === 'SETTINGS' && <div className="p-10 text-center text-slate-500">System configuration online. No adjustments required.</div>}
            
            {currentView === 'ONBOARDING' && (
                <div className="absolute inset-0 z-[150] bg-black/95 flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-500">
                    <div className="max-w-md space-y-10">
                        <div className="space-y-4">
                            <Sparkles size={48} className="text-cyber-purple mx-auto animate-pulse" />
                            <h2 className="text-4xl font-display font-black text-white uppercase tracking-tighter italic">BUSINESS MENTORSHIP</h2>
                            <p className="text-slate-400 text-sm leading-relaxed">
                                Welcome to the <span className="text-cyber-cyan font-bold">ZUAKI Knowledge Empire</span>. 
                                Here, JEE preparation is a business. Solve questions to earn <span className="text-cyber-yellow font-bold">BrainCoins (BC)</span>. 
                                Reinvest BC to upgrade subject sectors. Master all floors to achieve the National Rank Academy status.
                            </p>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-3">
                            <BriefingItem label="BrainCoins (BC)" text="Internal currency earned via high-accuracy problem solving." />
                            <BriefingItem label="The Goal" text="Convert concepts into liquid assets. Low stability = BC leakage." />
                        </div>

                        <button 
                            onClick={completeOnboarding}
                            className="w-full py-5 bg-white text-black font-display font-black text-2xl uppercase tracking-widest rounded-2xl shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-4 group"
                        >
                            Establish My Empire <ArrowRight size={28} className="group-hover:translate-x-2 transition-transform" />
                        </button>
                    </div>
                </div>
            )}

            {currentView === 'SESSION' && activeFloor && (
                <div className="absolute inset-0 z-[160] bg-[#02040a]">
                    <EmpireSession 
                        floor={activeFloor} 
                        onExit={() => { setActiveFloor(null); setCurrentView('DASHBOARD'); }}
                        onComplete={(res) => {
                            setSessionResult(res);
                            setActiveFloor(null);
                            setCurrentView('DASHBOARD');
                        }}
                    />
                </div>
            )}
        </div>

        {/* Global Result Overlay */}
        {sessionResult && (
            <div className="fixed inset-0 z-[180] bg-black/95 backdrop-blur-2xl flex flex-col items-center justify-center p-8 animate-in zoom-in-95 duration-500">
                 <div className="max-w-sm w-full text-center space-y-8">
                    <div className={`w-24 h-24 rounded-[32px] mx-auto flex items-center justify-center border-2 ${sessionResult.success ? 'bg-green-500/10 border-green-500 text-green-500' : 'bg-red-500/10 border-red-500 text-red-500'}`}>
                        {sessionResult.success ? <Crown size={48} /> : <ShieldCheck size={48} className="rotate-180" />}
                    </div>
                    <div>
                        <h2 className="text-4xl font-display font-black text-white uppercase italic">{sessionResult.success ? 'MARKET SURGE' : 'ASSET DEVALUED'}</h2>
                        <p className="text-slate-500 text-[10px] font-mono tracking-widest uppercase mt-2">{sessionResult.floorName} Audit Complete</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                            <p className="text-[8px] text-slate-500 uppercase font-black mb-1">Efficiency</p>
                            <p className="text-2xl font-bold text-white">{Math.round(sessionResult.accuracy)}%</p>
                        </div>
                        <div className="bg-white/5 p-4 rounded-2xl border border-white/5">
                            <p className="text-[8px] text-slate-500 uppercase font-black mb-1">Coin Change</p>
                            <p className={`text-2xl font-bold ${sessionResult.earned >= 0 ? 'text-green-500' : 'text-red-500'}`}>{sessionResult.earned >= 0 ? '+' : ''}{sessionResult.earned}</p>
                        </div>
                    </div>
                    <button onClick={() => setSessionResult(null)} className="w-full py-5 bg-cyber-cyan text-black font-display font-black text-xl uppercase tracking-widest rounded-2xl shadow-[0_0_30px_#00f3ff]">RE-INTEGRATE</button>
                 </div>
            </div>
        )}

        {currentView !== 'SESSION' && renderNav()}
    </div>
  );
};

const NavButton = ({ active, icon: Icon, label, onClick }: any) => (
    <button onClick={onClick} className={`flex flex-col items-center gap-1.5 transition-all ${active ? 'text-cyber-cyan' : 'text-slate-600 hover:text-slate-400'}`}>
        <div className={`p-2 rounded-xl transition-all ${active ? 'bg-cyber-cyan/10 shadow-[0_0_15px_rgba(0,243,255,0.2)]' : ''}`}>
            <Icon size={22} strokeWidth={active ? 2.5 : 2} />
        </div>
        <span className={`text-[9px] font-black uppercase tracking-widest ${active ? 'opacity-100' : 'opacity-40'}`}>{label}</span>
    </button>
);

const BriefingItem = ({ label, text }: any) => (
    <div className="p-4 bg-white/5 border border-white/10 rounded-2xl text-left">
        <h4 className="text-xs font-bold text-cyber-cyan uppercase tracking-widest mb-1">{label}</h4>
        <p className="text-[10px] text-slate-500 leading-relaxed">{text}</p>
    </div>
);
