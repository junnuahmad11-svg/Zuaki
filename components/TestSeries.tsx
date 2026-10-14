
import React, { useState } from 'react';
import { FileText, Trophy, Clock, BookOpen, Layers, Settings, ChevronRight, Lock, Calendar } from 'lucide-react';
import { ViewState } from '../types';

interface TestSeriesProps {
    onChangeView?: (view: ViewState) => void;
}

export const TestSeries: React.FC<TestSeriesProps> = ({ onChangeView }) => {
  const [activeYear, setActiveYear] = useState<number | null>(null);

  const handleShiftSelect = (year: number, shift: 1 | 2) => {
      // In a real app, this would trigger generating that specific test
      // For now, we utilize the standard flow but we should probably pass params
      // Since existing flow uses TestLabDashboard for generation, we might direct there
      // BUT per instructions, we integrate here.
      // Let's assume we route to TestLabDashboard which handles the generation
      
      // Store selected config in local storage to be picked up by TestLabDashboard or handle direct routing
      localStorage.setItem('zuaki_selected_test_config', JSON.stringify({ type: 'JEE_2025', shift }));
      onChangeView?.(ViewState.TEST_LAB_HOME);
  };

  return (
    <div className="h-full w-full bg-[#020617] p-6 overflow-y-auto custom-scrollbar relative">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#0f172a_0%,_#020617_70%)] pointer-events-none"></div>
      
      <div className="max-w-5xl mx-auto relative z-10">
          <div className="mb-8">
              <h1 className="text-3xl font-display font-bold text-white uppercase tracking-widest flex items-center gap-3">
                  <FileText size={32} className="text-cyber-cyan" /> Test Engine
              </h1>
              <p className="text-slate-400 text-xs font-mono">Select a mode to begin your assessment.</p>
          </div>

          {/* New JEE MAIN 2025 SECTION */}
          <div className="mb-10 animate-in fade-in slide-in-from-bottom-4">
              <h2 className="text-white font-bold text-lg mb-4 pl-1 border-l-4 border-cyber-cyan ml-1 flex items-center gap-2">
                  <Calendar size={18} className="text-cyber-cyan" /> JEE Main Series
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* 2025 Card */}
                  <div className="glass-panel p-6 rounded-2xl border border-cyber-cyan/30 bg-cyber-cyan/5">
                      <div className="flex justify-between items-center mb-4">
                          <h3 className="text-2xl font-bold text-white">2025</h3>
                          <span className="px-3 py-1 rounded-full bg-cyber-cyan/20 text-cyber-cyan text-xs font-bold border border-cyber-cyan/30 animate-pulse">
                              LIVE
                          </span>
                      </div>
                      
                      <div className="space-y-3">
                          <button 
                              onClick={() => handleShiftSelect(2025, 1)}
                              className="w-full p-4 rounded-xl bg-black/40 border border-white/10 flex justify-between items-center hover:border-cyber-cyan hover:bg-cyber-cyan/10 transition-all group"
                          >
                              <div className="text-left">
                                  <div className="text-white font-bold text-sm group-hover:text-cyber-cyan">Shift 1</div>
                                  <div className="text-slate-500 text-xs">75 Questions • 300 Marks</div>
                              </div>
                              <ChevronRight size={16} className="text-slate-500 group-hover:text-white" />
                          </button>

                          <button 
                              onClick={() => handleShiftSelect(2025, 2)}
                              className="w-full p-4 rounded-xl bg-black/40 border border-white/10 flex justify-between items-center hover:border-cyber-cyan hover:bg-cyber-cyan/10 transition-all group"
                          >
                              <div className="text-left">
                                  <div className="text-white font-bold text-sm group-hover:text-cyber-cyan">Shift 2</div>
                                  <div className="text-slate-500 text-xs">75 Questions • 300 Marks</div>
                              </div>
                              <ChevronRight size={16} className="text-slate-500 group-hover:text-white" />
                          </button>
                      </div>
                  </div>

                  {/* 2024 Card (Disabled) */}
                  <div className="glass-panel p-6 rounded-2xl border border-white/10 opacity-60 grayscale relative overflow-hidden">
                      <div className="absolute inset-0 bg-black/20 backdrop-blur-[1px] flex items-center justify-center z-20">
                          <div className="px-4 py-2 bg-black/80 border border-white/20 rounded-xl text-xs font-bold text-slate-300 flex items-center gap-2">
                              <Lock size={14} /> Archives Coming Soon
                          </div>
                      </div>
                      <div className="flex justify-between items-center mb-4">
                          <h3 className="text-2xl font-bold text-white">2024</h3>
                      </div>
                      <div className="space-y-3">
                          <div className="w-full p-4 rounded-xl bg-black/40 border border-white/10">
                              <div className="text-white font-bold text-sm">Shift 1</div>
                          </div>
                          <div className="w-full p-4 rounded-xl bg-black/40 border border-white/10">
                              <div className="text-white font-bold text-sm">Shift 2</div>
                          </div>
                      </div>
                  </div>
              </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                  { id: 'MOCK', title: "Full Mock Tests", desc: "Standard 90 Qs Pattern", icon: Trophy, color: "cyber-cyan", action: () => onChangeView?.(ViewState.TEST_RUNNER) },
                  { id: 'CHAPTER', title: "Chapter-Wise", desc: "Target specific topics", icon: Layers, color: "cyber-purple", action: () => onChangeView?.(ViewState.MAKE_TEST) },
                  { id: 'PYQ', title: "PYQ Papers", desc: "Historical Archives", icon: Clock, color: "cyber-yellow", action: () => onChangeView?.(ViewState.PYQ_PAPERS) }
              ].map(card => (
                  <div 
                    key={card.id}
                    onClick={card.action}
                    className={`glass-panel p-6 rounded-2xl border border-white/5 hover:border-${card.color}/50 group cursor-pointer transition-all hover:translate-y-[-5px]`}
                  >
                      <div className={`w-14 h-14 rounded-xl bg-${card.color}/10 border border-${card.color}/30 flex items-center justify-center text-${card.color} mb-6 group-hover:scale-110 transition-transform shadow-[0_0_20px_rgba(0,0,0,0.2)]`}>
                          <card.icon size={28} />
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyber-cyan transition-colors">{card.title}</h3>
                      <p className="text-sm text-slate-400 mb-6">{card.desc}</p>
                      
                      <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-500 group-hover:text-white transition-colors">
                          Start Now <ChevronRight size={14} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                  </div>
              ))}
          </div>

          {/* Quick Stats */}
          <div className="mt-12 glass-panel p-6 rounded-2xl border border-white/10 flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="text-center md:text-left">
                  <h3 className="text-white font-bold mb-1">Your Performance</h3>
                  <p className="text-slate-400 text-xs">Last 7 Days</p>
              </div>
              <div className="flex gap-8">
                  <div className="text-center">
                      <div className="text-2xl font-display font-bold text-cyber-cyan">12</div>
                      <div className="text-[10px] text-slate-500 uppercase tracking-widest">Tests Taken</div>
                  </div>
                  <div className="text-center">
                      <div className="text-2xl font-display font-bold text-cyber-purple">85%</div>
                      <div className="text-[10px] text-slate-500 uppercase tracking-widest">Avg Accuracy</div>
                  </div>
                  <div className="text-center">
                      <div className="text-2xl font-display font-bold text-cyber-pink">14k</div>
                      <div className="text-[10px] text-slate-500 uppercase tracking-widest">Global Rank</div>
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
};
