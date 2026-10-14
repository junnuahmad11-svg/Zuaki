
import React, { useState, useEffect } from 'react';
import { 
    Building2, Zap, Beaker, Calculator, Lock, ChevronRight, 
    Coins, Trophy, TrendingUp, ShieldAlert, Cpu, Crown, Activity 
} from 'lucide-react';
import { empireService } from '../../services/empireService';
import { EmpireState, EmpireBuilding, EmpireFloor } from '../../types';

interface Props {
  onStartSession: (floor: EmpireFloor) => void;
}

export const EmpireDashboard: React.FC<Props> = ({ onStartSession }) => {
  const [state, setState] = useState<EmpireState>(empireService.getState());

  useEffect(() => {
    return empireService.subscribe(setState);
  }, []);

  return (
    <div className="h-full w-full bg-[#02040a] flex flex-col p-6 overflow-y-auto custom-scrollbar relative">
      {/* Immersive Background */}
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_top,_#0f172a_0%,_#02040a_80%)] pointer-events-none z-0"></div>
      
      {/* Animated Dust/Particles */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <div 
            key={i} 
            className="absolute bg-cyber-cyan/40 rounded-full blur-xl animate-pulse"
            style={{
              width: Math.random() * 200 + 50,
              height: Math.random() * 200 + 50,
              left: Math.random() * 100 + '%',
              top: Math.random() * 100 + '%',
              animationDuration: (Math.random() * 5 + 3) + 's'
            }}
          ></div>
        ))}
      </div>

      <div className="relative z-10 space-y-10 pb-32">
        {/* HUD: Empire Profile */}
        <header className="flex justify-between items-start pt-4">
            <div className="space-y-1">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-cyber-yellow/10 flex items-center justify-center border border-cyber-yellow/40">
                        <Crown size={16} className="text-cyber-yellow shadow-sm" />
                    </div>
                    <h1 className="text-3xl font-display font-black text-white tracking-widest uppercase italic skew-x-[-5deg]">
                        KNOWLEDGE EMPIRE
                    </h1>
                </div>
                <div className="flex items-center gap-4 text-[10px] font-mono text-slate-500 uppercase tracking-[0.2em] ml-1">
                    <span className="flex items-center gap-1 text-cyber-cyan"><ShieldAlert size={10}/> Rank #{state.rank.toLocaleString()}</span>
                    <span className="w-1 h-1 bg-slate-800 rounded-full"></span>
                    <span>Level {state.empireLevel} Master</span>
                </div>
            </div>

            <div className="bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl px-5 py-3 shadow-[0_0_20px_rgba(0,0,0,0.4)] flex items-center gap-4">
                <div className="flex flex-col items-end">
                    <span className="text-[8px] text-slate-500 uppercase font-black tracking-widest">Liquid Assets</span>
                    <div className="flex items-center gap-1.5">
                        <Coins size={14} className="text-cyber-yellow" />
                        <span className="text-xl font-mono font-bold text-white tracking-tighter">{state.brainCoins}</span>
                        <span className="text-[10px] font-bold text-cyber-yellow">BC</span>
                    </div>
                </div>
            </div>
        </header>

        {/* Dynamic Buildings List */}
        <div className="grid grid-cols-1 gap-10">
            {state.buildings.map((building) => (
                <div key={building.id} className="relative group">
                    {/* Locked State Overlay */}
                    {!building.unlocked && (
                        <div className="absolute inset-0 z-20 bg-black/80 backdrop-blur-[4px] rounded-[40px] flex items-center justify-center border border-white/5 cursor-not-allowed">
                            <div className="text-center p-6 glass-panel rounded-3xl border border-white/10">
                                <Lock size={40} className="text-slate-600 mx-auto mb-4" />
                                <p className="text-[11px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed">
                                    Strategic Unlock Required<br/>
                                    <span className="text-cyber-purple">Level {building.subject === 'Chemistry' ? '3' : '2'} Neural Capacity</span>
                                </p>
                            </div>
                        </div>
                    )}

                    <div className={`glass-panel p-8 rounded-[40px] border transition-all duration-500 overflow-hidden relative ${building.unlocked ? 'border-white/10 group-hover:border-white/20' : 'opacity-40 grayscale border-white/5'}`}>
                        {/* Subject Glow Background */}
                        <div className={`absolute -top-10 -right-10 w-48 h-48 rounded-full blur-[80px] opacity-10 transition-opacity group-hover:opacity-20 ${getBuildingColor(building.subject, 'bg-solid')}`}></div>
                        
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10 relative z-10">
                            <div className="flex items-center gap-5">
                                <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center border-2 transition-transform duration-500 group-hover:scale-110 shadow-lg ${getBuildingColor(building.subject, 'bg')} ${getBuildingColor(building.subject, 'border')} ${getBuildingColor(building.subject, 'text')}`}>
                                    {getBuildingIcon(building.subject)}
                                </div>
                                <div>
                                    <h2 className="text-2xl font-display font-bold text-white uppercase tracking-wider">{building.subject} Sector</h2>
                                    <div className="flex items-center gap-3 mt-1">
                                        <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-[9px] text-slate-400 font-bold uppercase tracking-widest">
                                            <Zap size={10} className="text-cyber-yellow" /> Tier {building.level}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="md:text-right space-y-2">
                                <div className="flex justify-between md:justify-end items-center gap-3">
                                    <span className="text-[10px] text-slate-500 uppercase font-black tracking-widest">Structural Stability</span>
                                    <span className="text-[10px] text-white font-mono font-bold">88%</span>
                                </div>
                                <div className="w-full md:w-48 h-1.5 bg-black/40 rounded-full overflow-hidden border border-white/5">
                                    <div className={`h-full ${getBuildingColor(building.subject, 'bg-solid')} transition-all duration-1000 shadow-[0_0_8px_currentColor]`} style={{ width: '88%' }}></div>
                                </div>
                            </div>
                        </div>

                        {/* Floors List */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 relative z-10">
                            {building.floors.map((floor) => {
                                const isLocked = floor.status === 'LOCKED';
                                const isMastered = floor.status === 'MASTERED';
                                const isWeak = floor.status === 'WEAK';

                                return (
                                    <button
                                        key={floor.id}
                                        disabled={isLocked}
                                        onClick={() => onStartSession(floor)}
                                        className={`group/floor relative p-4 rounded-3xl border transition-all duration-300 flex flex-col gap-3 text-left ${
                                            isLocked 
                                            ? 'bg-black/20 border-white/5 opacity-50 cursor-not-allowed'
                                            : isMastered
                                              ? 'bg-green-500/5 border-green-500/20 hover:border-green-500/40'
                                              : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-cyber-cyan/30'
                                        }`}
                                    >
                                        <div className="flex justify-between items-start">
                                            <span className={`text-[10px] font-bold uppercase tracking-widest ${isLocked ? 'text-slate-600' : isMastered ? 'text-green-500' : 'text-slate-400'}`}>
                                                {isLocked ? 'Encrypted' : isMastered ? 'Sovereign' : 'Active'}
                                            </span>
                                            {isLocked ? <Lock size={12} className="text-slate-700" /> : isMastered ? <Crown size={12} className="text-green-500" /> : <TrendingUp size={12} className="text-cyber-cyan opacity-0 group-hover/floor:opacity-100 transition-opacity" />}
                                        </div>
                                        
                                        <h4 className={`text-sm font-bold truncate ${isLocked ? 'text-slate-600 font-mono' : 'text-white'}`}>
                                            {isLocked ? '########' : floor.name}
                                        </h4>

                                        <div className="space-y-1.5 mt-2">
                                            <div className="flex justify-between items-center text-[8px] font-mono uppercase tracking-tighter">
                                                <span className="text-slate-500">Integrity</span>
                                                <span className={isMastered ? 'text-green-400' : 'text-slate-400'}>{floor.mastery}%</span>
                                            </div>
                                            <div className="h-1 w-full bg-black/60 rounded-full overflow-hidden">
                                                <div 
                                                    className={`h-full transition-all duration-1000 ${isMastered ? 'bg-green-500' : getBuildingColor(building.subject, 'bg-solid')}`} 
                                                    style={{ width: `${floor.mastery}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                </div>
            ))}
        </div>

        {/* Manager/Strategy Section */}
        <section className="glass-panel p-8 rounded-[40px] border border-cyber-purple/20 bg-[#0c051a]/60 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-40 h-40 bg-cyber-purple/10 rounded-full blur-[50px] -mr-16 -mt-16"></div>
            
            <div className="flex items-center justify-between mb-8 relative z-10">
                <div>
                    <h3 className="text-xl font-display font-bold text-white uppercase tracking-widest flex items-center gap-2">
                        <Cpu size={20} className="text-cyber-purple" /> Empire Management
                    </h3>
                    <p className="text-[10px] text-slate-500 font-mono uppercase tracking-wider">Automated Buffs & Analysis Nodes</p>
                </div>
                <button className="px-4 py-2 bg-cyber-purple/10 border border-cyber-purple/30 rounded-xl text-[10px] font-bold text-cyber-purple uppercase tracking-widest hover:bg-cyber-purple/20 transition-all">
                    Expand Slots
                </button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
                <ManagerSlot name="Logic Analyst" status="LOCKED" icon={Activity} />
                <ManagerSlot name="Asset Optimizer" status="LOCKED" icon={TrendingUp} />
                <ManagerSlot name="Growth Architect" status="LOCKED" icon={Building2} />
                <ManagerSlot name="Formula Broker" status="LOCKED" icon={ShieldAlert} />
            </div>
        </section>
      </div>
    </div>
  );
};

const ManagerSlot = ({ name, status, icon: Icon }: any) => (
    <div className="group/mgr p-4 bg-black/40 rounded-3xl border border-white/5 flex flex-col items-center text-center gap-3 transition-all hover:bg-black/60 hover:border-white/10">
        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center text-slate-600 group-hover/mgr:text-slate-400 transition-colors">
            <Icon size={24} />
        </div>
        <div>
            <p className="text-[9px] font-bold text-white uppercase tracking-tighter mb-0.5">{name}</p>
            <p className="text-[8px] text-slate-600 font-mono uppercase font-black">{status}</p>
        </div>
    </div>
);

const getBuildingIcon = (subject: string) => {
  if (subject === 'Physics') return <Zap size={32} fill="currentColor" />;
  if (subject === 'Chemistry') return <Beaker size={32} fill="currentColor" />;
  return <Calculator size={32} fill="currentColor" />;
};

const getBuildingColor = (subject: string, part: 'bg' | 'border' | 'text' | 'bg-solid') => {
  if (subject === 'Physics') {
    if (part === 'bg') return 'bg-cyber-cyan/10';
    if (part === 'border') return 'border-cyber-cyan/30';
    if (part === 'text') return 'text-cyber-cyan';
    return 'bg-cyber-cyan';
  }
  if (subject === 'Chemistry') {
    if (part === 'bg') return 'bg-cyber-purple/10';
    if (part === 'border') return 'border-cyber-purple/30';
    if (part === 'text') return 'text-cyber-purple';
    return 'bg-cyber-purple';
  }
  if (part === 'bg') return 'bg-cyber-pink/10';
  if (part === 'border') return 'border-cyber-pink/30';
  if (part === 'text') return 'text-cyber-pink';
  return 'bg-cyber-pink';
};
