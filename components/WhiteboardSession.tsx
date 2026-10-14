import React, { useRef, useState, useEffect } from 'react';
import { X, Pen, Eraser, Cloud, Brain, Sparkles, Loader2, Check, Download, Trash2 } from 'lucide-react';
import { vercel } from '../services/backend';
import { analyzeWhiteboard } from '../services/geminiService';

interface WhiteboardSessionProps {
  groupId: string;
  onClose: () => void;
}

export const WhiteboardSession: React.FC<WhiteboardSessionProps> = ({ groupId, onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [tool, setTool] = useState<'pen' | 'eraser'>('pen');
  const [color, setColor] = useState('#00f3ff');
  const [activeUsers, setActiveUsers] = useState(['You']);
  
  // AI Solution State
  const [aiLoading, setAiLoading] = useState(false);
  const [aiSolution, setAiSolution] = useState<string | null>(null);
  const [showAiModal, setShowAiModal] = useState(false);

  useEffect(() => {
    // Simulate real-time socket connection
    vercel.api.whiteboardSocket(groupId);
    // Add mock peers
    const timer = setTimeout(() => {
        setActiveUsers(prev => [...prev, 'Peer-402']);
    }, 1500);
    return () => clearTimeout(timer);
  }, [groupId]);

  const startDrawing = (e: React.MouseEvent) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const ctx = canvasRef.current?.getContext('2d');
    ctx?.beginPath();
  };

  const draw = (e: React.MouseEvent) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineWidth = tool === 'eraser' ? 24 : 3.5;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = color;
    
    if (tool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
    } else {
      ctx.globalCompositeOperation = 'source-over';
    }

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (canvas && ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  // Resize handler
  const handleResize = () => {
     if (canvasRef.current) {
         canvasRef.current.width = canvasRef.current.parentElement?.clientWidth || 800;
         canvasRef.current.height = canvasRef.current.parentElement?.clientHeight || 600;
     }
  };

  useEffect(() => {
      window.addEventListener('resize', handleResize);
      handleResize();
      return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleAiSolve = async (task: 'SOLVE' | 'EXPLAIN' = 'SOLVE') => {
    if (!canvasRef.current) return;
    setAiLoading(true);
    setShowAiModal(true);
    setAiSolution(null);

    const base64 = canvasRef.current.toDataURL('image/png');
    try {
      const result = await analyzeWhiteboard(base64, task);
      setAiSolution(result);
    } catch (e) {
      setAiSolution("Neural processing encountered an error. Please try again.");
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="absolute inset-2 md:inset-4 z-50 rounded-[28px] overflow-hidden glass-panel border border-cyber-cyan/40 shadow-[0_0_60px_rgba(0,243,255,0.2)] flex flex-col bg-black/95 backdrop-blur-2xl animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="h-14 border-b border-white/10 flex items-center justify-between px-6 bg-white/5">
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                    <Cloud size={18} className="text-cyber-cyan animate-pulse" />
                    <div>
                      <span className="text-white font-bold text-xs uppercase tracking-wider block">Live In-Chat Whiteboard</span>
                      <span className="text-[10px] text-cyber-cyan font-mono">Synchronized Channel: {groupId}</span>
                    </div>
                </div>
                <div className="hidden sm:flex -space-x-2">
                    {activeUsers.map((u, i) => (
                        <div key={i} className="w-7 h-7 rounded-full border-2 border-black bg-cyber-purple/40 flex items-center justify-center text-[9px] text-white font-bold uppercase shadow-sm" title={u}>
                          {u.substring(0, 2)}
                        </div>
                    ))}
                </div>
            </div>

            {/* AI Action Header Buttons */}
            <div className="flex items-center gap-2">
                <button
                    onClick={() => handleAiSolve('SOLVE')}
                    className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyber-purple to-pink-600 text-white font-display font-bold text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(157,0,255,0.4)] hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5"
                    title="Solve handwritten equation or integration step-by-step with AI"
                >
                    <Brain size={14} />
                    <span>AI Solve Step-by-Step</span>
                </button>

                <button
                    onClick={() => handleAiSolve('EXPLAIN')}
                    className="hidden sm:flex px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-cyber-cyan border border-cyber-cyan/30 text-xs font-bold uppercase tracking-wider items-center gap-1.5 transition-all"
                >
                    <Sparkles size={13} />
                    <span>Explain</span>
                </button>

                <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-slate-400 hover:text-white transition-colors">
                  <X size={20} />
                </button>
            </div>
        </div>

        {/* Tools Sidebar */}
        <div className="absolute top-20 left-4 flex flex-col gap-2 bg-black/70 p-2 rounded-2xl border border-white/10 z-20 shadow-2xl backdrop-blur-md">
            <button 
                onClick={() => setTool('pen')}
                className={`p-3 rounded-xl transition-all ${tool === 'pen' ? 'bg-cyber-cyan text-black shadow-[0_0_15px_#00f3ff]' : 'text-slate-400 hover:text-white'}`}
                title="Pen"
            >
                <Pen size={18} />
            </button>
            <button 
                onClick={() => setTool('eraser')}
                className={`p-3 rounded-xl transition-all ${tool === 'eraser' ? 'bg-cyber-pink text-white shadow-[0_0_15px_#ff003c]' : 'text-slate-400 hover:text-white'}`}
                title="Eraser"
            >
                <Eraser size={18} />
            </button>
            <button
                onClick={clearCanvas}
                className="p-3 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                title="Clear Board"
            >
                <Trash2 size={18} />
            </button>

            <div className="h-px w-full bg-white/10 my-1"></div>

            {['#00f3ff', '#9d00ff', '#fcee0a', '#ff003c', '#ffffff'].map(c => (
                <button 
                    key={c} 
                    onClick={() => { setColor(c); setTool('pen'); }}
                    className={`w-6 h-6 rounded-full border-2 transition-all mx-auto ${color === c && tool === 'pen' ? 'border-white scale-125 shadow-[0_0_10px_white]' : 'border-transparent opacity-60 hover:opacity-100'}`}
                    style={{ backgroundColor: c }}
                />
            ))}
        </div>

        {/* Canvas Body */}
        <div className="flex-1 relative cursor-crosshair bg-[#030712] overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-40 pointer-events-none"></div>
            <canvas 
                ref={canvasRef}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                className="block w-full h-full relative z-10"
            />

            {/* AI Result Slide-Over Drawer */}
            {showAiModal && (
                <div className="absolute inset-y-0 right-0 w-full sm:w-[420px] bg-[#0b0f1a]/95 border-l border-cyber-cyan/40 z-30 shadow-[-20px_0_50px_rgba(0,0,0,0.8)] backdrop-blur-xl flex flex-col animate-in slide-in-from-right duration-300">
                    <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/40">
                        <div className="flex items-center gap-2.5">
                            <div className="p-2 rounded-lg bg-cyber-purple/20 text-cyber-purple">
                                <Brain size={18} />
                            </div>
                            <div>
                                <h4 className="text-white font-bold text-xs uppercase tracking-wider">AI Step-by-Step Derivation</h4>
                                <span className="text-[10px] text-cyber-cyan font-mono">Gemini 2.5 Multimodal STEM Engine</span>
                            </div>
                        </div>
                        <button onClick={() => setShowAiModal(false)} className="p-1.5 text-slate-400 hover:text-white">
                            <X size={18} />
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-5 custom-scrollbar">
                        {aiLoading ? (
                            <div className="flex flex-col items-center justify-center h-full gap-4 text-center">
                                <div className="w-12 h-12 border-4 border-cyber-cyan border-t-transparent rounded-full animate-spin"></div>
                                <div>
                                    <p className="text-cyber-cyan font-display font-bold text-sm tracking-wider uppercase animate-pulse">
                                        Analyzing Handwritten Equations...
                                    </p>
                                    <p className="text-slate-400 text-xs mt-1">
                                        Parsing calculus symbols, integrations, and physics mechanisms.
                                    </p>
                                </div>
                            </div>
                        ) : aiSolution ? (
                            <div className="space-y-4">
                                <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-slate-200 text-xs leading-relaxed whitespace-pre-wrap font-sans selection:bg-cyber-cyan selection:text-black">
                                    {aiSolution}
                                </div>
                                <div className="p-3 bg-cyber-cyan/10 border border-cyber-cyan/30 rounded-xl text-[11px] text-cyber-cyan flex items-center gap-2">
                                    <Sparkles size={14} className="shrink-0" />
                                    <span>Peer synchronized: Solution is visible to your squad.</span>
                                </div>
                            </div>
                        ) : null}
                    </div>

                    <div className="p-3 border-t border-white/10 bg-black/60 flex items-center justify-between">
                        <span className="text-[10px] text-slate-400 font-mono">Zuaki AI Vision</span>
                        <button 
                            onClick={() => handleAiSolve('SOLVE')} 
                            className="text-xs text-cyber-cyan font-bold hover:underline"
                        >
                            Re-analyze
                        </button>
                    </div>
                </div>
            )}
        </div>

        {/* Footer Hint */}
        <div className="p-2.5 bg-black/60 border-t border-white/5 text-[10px] text-slate-400 flex items-center justify-between px-6 font-mono">
            <span>● Real-time peer synchronized canvas • Write integrations or problems & click AI Solve</span>
            <span className="text-cyber-cyan font-bold">Latency: 12ms</span>
        </div>
    </div>
  );
};
