
import React, { useRef, useState, useEffect, useCallback } from 'react';
import { 
    Save, Undo, Redo, Trash2, Plus, 
    ChevronLeft, ChevronRight, Pen, Eraser, Highlighter,
    Square, Circle, ArrowRight, Minus, MousePointer2,
    Download, Share2, Sparkles, Brain, Zap, Maximize2, Minimize2,
    Settings, Grid as GridIcon, Type, X, Info, Clock, Check
} from 'lucide-react';
import { Note, WhiteboardPage, WhiteboardStroke, StrokePoint } from '../types';
import { firebase } from '../services/backend';
import { analyzeWhiteboard } from '../services/geminiService';
import { ZurakiBackButton } from './ZurakiBackButton';

interface WhiteboardEditorProps {
    note: Note | null;
    onSave: (note: Note) => void;
    onExit: () => void;
    onDirty?: (dirty: boolean) => void;
}

const COLORS = ['#ffffff', '#00f3ff', '#9d00ff', '#fcee0a', '#ff003c', '#22c55e', '#64748b'];
const THICKNESSES = [2, 5, 10, 20];

export const WhiteboardEditor: React.FC<WhiteboardEditorProps> = ({ note, onSave, onExit, onDirty }) => {
    // --- BASIC STATE ---
    const [title, setTitle] = useState(note?.title || 'New Whiteboard');
    const [pages, setPages] = useState<WhiteboardPage[]>(note?.whiteboardPages || [{ id: 'p1', strokes: [] }]);
    const [activePageIndex, setActivePageIndex] = useState(0);
    
    // --- TOOL STATE ---
    const [tool, setTool] = useState<WhiteboardStroke['type']>('pen');
    const [color, setColor] = useState('#00f3ff');
    const [thickness, setThickness] = useState(2);
    const [background, setBackground] = useState<'plain' | 'grid' | 'dots'>('grid');
    
    // --- CANVAS STATE ---
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [zoom, setZoom] = useState(1);
    const [offset, setOffset] = useState({ x: 0, y: 0 });
    
    // --- UNDO / REDO ---
    const [history, setHistory] = useState<WhiteboardStroke[][]>([]);
    const [redoStack, setRedoStack] = useState<WhiteboardStroke[][]>([]);

    // --- AI STATE ---
    const [aiResult, setAiResult] = useState<string | null>(null);
    const [isAiLoading, setIsAiLoading] = useState(false);
    const [showAiPanel, setShowAiPanel] = useState(false);

    // --- RECENT TIP ---
    const [showTip, setShowTip] = useState(true);

    const getActivePage = () => pages[activePageIndex];

    // --- CANVAS ENGINE ---

    const resizeCanvas = useCallback(() => {
        if (canvasRef.current && containerRef.current) {
            const { clientWidth, clientHeight } = containerRef.current;
            canvasRef.current.width = clientWidth;
            canvasRef.current.height = clientHeight;
            redraw();
        }
    }, [activePageIndex, pages, zoom, offset, background]);

    useEffect(() => {
        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();
        return () => window.removeEventListener('resize', resizeCanvas);
    }, [resizeCanvas]);

    const redraw = useCallback(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw Background
        drawBackground(ctx);

        ctx.save();
        ctx.translate(offset.x, offset.y);
        ctx.scale(zoom, zoom);

        const page = getActivePage();
        if (page) {
            page.strokes.forEach(stroke => drawStroke(ctx, stroke));
        }
        ctx.restore();
    }, [activePageIndex, pages, zoom, offset, background]);

    const drawBackground = (ctx: CanvasRenderingContext2D) => {
        if (background === 'plain') return;
        
        ctx.save();
        ctx.strokeStyle = 'rgba(255,255,255,0.05)';
        ctx.lineWidth = 1;

        if (background === 'grid') {
            const gridSize = 40 * zoom;
            const startX = offset.x % gridSize;
            const startY = offset.y % gridSize;

            for (let x = startX; x < ctx.canvas.width; x += gridSize) {
                ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, ctx.canvas.height); ctx.stroke();
            }
            for (let y = startY; y < ctx.canvas.height; y += gridSize) {
                ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(ctx.canvas.width, y); ctx.stroke();
            }
        } else if (background === 'dots') {
            const gap = 30 * zoom;
            const startX = offset.x % gap;
            const startY = offset.y % gap;
            ctx.fillStyle = 'rgba(255,255,255,0.1)';
            for (let x = startX; x < ctx.canvas.width; x += gap) {
                for (let y = startY; y < ctx.canvas.height; y += gap) {
                    ctx.beginPath(); ctx.arc(x, y, 1, 0, Math.PI * 2); ctx.fill();
                }
            }
        }
        ctx.restore();
    };

    const drawStroke = (ctx: CanvasRenderingContext2D, stroke: WhiteboardStroke) => {
        const pts = stroke.points;
        if (pts.length < 2) return;

        ctx.beginPath();
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = stroke.color;
        ctx.lineWidth = stroke.width;

        if (stroke.type === 'eraser') {
            ctx.globalCompositeOperation = 'destination-out';
            ctx.lineWidth = stroke.width * 2;
        } else if (stroke.type === 'highlighter') {
            ctx.globalCompositeOperation = 'source-over';
            ctx.globalAlpha = 0.3;
            ctx.lineWidth = stroke.width * 3;
        } else {
            ctx.globalCompositeOperation = 'source-over';
            ctx.globalAlpha = 1;
        }

        if (stroke.type === 'pen' || stroke.type === 'highlighter' || stroke.type === 'eraser') {
            ctx.moveTo(pts[0].x, pts[0].y);
            for (let i = 1; i < pts.length; i++) {
                // Use quadratic curve for smoothness
                const xc = (pts[i].x + pts[i-1].x) / 2;
                const yc = (pts[i].y + pts[i-1].y) / 2;
                ctx.quadraticCurveTo(pts[i-1].x, pts[i-1].y, xc, yc);
            }
            ctx.stroke();
        } else {
            // Shapes
            const start = pts[0];
            const end = pts[pts.length - 1];
            if (stroke.type === 'line') {
                ctx.moveTo(start.x, start.y); ctx.lineTo(end.x, end.y); ctx.stroke();
            } else if (stroke.type === 'rect') {
                ctx.strokeRect(start.x, start.y, end.x - start.x, end.y - start.y);
            } else if (stroke.type === 'circle') {
                const radius = Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2));
                ctx.arc(start.x, start.y, radius, 0, Math.PI * 2); ctx.stroke();
            } else if (stroke.type === 'arrow') {
                drawArrow(ctx, start, end);
            }
        }
        ctx.globalAlpha = 1;
        ctx.globalCompositeOperation = 'source-over';
    };

    const drawArrow = (ctx: CanvasRenderingContext2D, start: StrokePoint, end: StrokePoint) => {
        const headlen = 15;
        const angle = Math.atan2(end.y - start.y, end.x - start.x);
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end.x, end.y);
        ctx.lineTo(end.x - headlen * Math.cos(angle - Math.PI / 6), end.y - headlen * Math.sin(angle - Math.PI / 6));
        ctx.moveTo(end.x, end.y);
        ctx.lineTo(end.x - headlen * Math.cos(angle + Math.PI / 6), end.y - headlen * Math.sin(angle + Math.PI / 6));
        ctx.stroke();
    };

    // --- INTERACTION ---

    const currentStroke = useRef<WhiteboardStroke | null>(null);

    const getCoord = (e: React.MouseEvent | React.TouchEvent): StrokePoint => {
        const rect = canvasRef.current!.getBoundingClientRect();
        const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
        const clientY = 'touches' in e ? e.touches[0].clientY : (e as React.MouseEvent).clientY;
        
        // Account for zoom and offset
        return {
            x: (clientX - rect.left - offset.x) / zoom,
            y: (clientY - rect.top - offset.y) / zoom
        };
    };

    const handleStart = (e: React.MouseEvent | React.TouchEvent) => {
        setIsDrawing(true);
        const pt = getCoord(e);
        currentStroke.current = {
            points: [pt],
            color,
            width: thickness,
            type: tool
        };
        if (onDirty) onDirty(true);
    };

    const handleMove = (e: React.MouseEvent | React.TouchEvent) => {
        if (!isDrawing || !currentStroke.current) return;
        const pt = getCoord(e);
        
        if (tool === 'pen' || tool === 'eraser' || tool === 'highlighter') {
            currentStroke.current.points.push(pt);
        } else {
            // Shapes only need 2 points (start and current end)
            currentStroke.current.points = [currentStroke.current.points[0], pt];
        }
        
        // Immediate preview redraw
        redraw();
        const ctx = canvasRef.current?.getContext('2d');
        if (ctx) {
            ctx.save();
            ctx.translate(offset.x, offset.y);
            ctx.scale(zoom, zoom);
            drawStroke(ctx, currentStroke.current);
            ctx.restore();
        }
    };

    const handleEnd = () => {
        if (!isDrawing || !currentStroke.current) return;
        setIsDrawing(false);
        
        const updatedPages = [...pages];
        updatedPages[activePageIndex].strokes.push(currentStroke.current);
        
        // Manage History
        setHistory(prev => [...prev, [...updatedPages[activePageIndex].strokes]]);
        setRedoStack([]); // Clear redo on new action

        setPages(updatedPages);
        currentStroke.current = null;
        redraw();
    };

    // --- ACTIONS ---

    const handleUndo = () => {
        if (history.length === 0) return;
        const newHistory = [...history];
        const lastStrokes = newHistory.pop();
        if (lastStrokes) {
            setRedoStack(prev => [...prev, lastStrokes]);
            const updatedPages = [...pages];
            const previousStrokes = newHistory.length > 0 ? newHistory[newHistory.length - 1] : [];
            updatedPages[activePageIndex].strokes = [...previousStrokes];
            setPages(updatedPages);
            setHistory(newHistory);
            redraw();
        }
    };

    const handleRedo = () => {
        if (redoStack.length === 0) return;
        const newRedo = [...redoStack];
        const nextStrokes = newRedo.pop();
        if (nextStrokes) {
            setHistory(prev => [...prev, nextStrokes]);
            const updatedPages = [...pages];
            updatedPages[activePageIndex].strokes = [...nextStrokes];
            setPages(updatedPages);
            setRedoStack(newRedo);
            redraw();
        }
    };

    const handleClear = () => {
        if (window.confirm("Clear board permanently?")) {
            const updatedPages = [...pages];
            updatedPages[activePageIndex].strokes = [];
            setPages(updatedPages);
            setHistory(prev => [...prev, []]);
            redraw();
        }
    };

    const handleSave = async () => {
        const thumb = canvasRef.current?.toDataURL('image/png', 0.2);
        const updatedPages = [...pages];
        updatedPages[activePageIndex].thumbnail = thumb;

        const updatedNote: Note = {
            id: note?.id || `wb-${Date.now()}`,
            title: title || 'Untitled Whiteboard',
            content: '',
            type: 'whiteboard',
            color: 'default',
            labels: note?.labels || ['Whiteboard'],
            isPinned: note?.isPinned || false,
            isArchived: note?.isArchived || false,
            isStarred: note?.isStarred || false,
            createdAt: note?.createdAt || Date.now(),
            updatedAt: Date.now(),
            whiteboardPages: updatedPages,
            subject: note?.subject,
            chapter: note?.chapter
        };

        await firebase.firestore().notes.save(updatedNote);
        onSave(updatedNote);
    };

    // --- AI ASSIST ---
    const handleAiTask = async (task: 'EXPLAIN' | 'SOLVE' | 'CHECK') => {
        if (!canvasRef.current) return;
        setIsAiLoading(true);
        setShowAiPanel(true);
        setAiResult(null);

        // Capture only the drawing part (transparent bg if possible, or just the whole canvas)
        const base64 = canvasRef.current.toDataURL('image/png');
        
        try {
            const result = await analyzeWhiteboard(base64, task);
            setAiResult(result);
        } catch (e) {
            setAiResult("Neural link interrupted. Please try again.");
        } finally {
            setIsAiLoading(false);
        }
    };

    // --- UI HELPERS ---

    const exportAsImage = () => {
        if (!canvasRef.current) return;
        const link = document.createElement('a');
        link.download = `${title}.png`;
        link.href = canvasRef.current.toDataURL('image/png');
        link.click();
    };

    return (
        <div className="fixed inset-0 z-[100] bg-[#020617] flex flex-col overflow-hidden select-none">
            
            {/* --- TOP BAR --- */}
            <header className="h-16 px-4 bg-black/40 backdrop-blur-xl border-b border-white/5 flex items-center justify-between z-30">
                <div className="flex items-center gap-4">
                    <ZurakiBackButton onClick={onExit} />
                    <div className="flex flex-col">
                        <input 
                            value={title} 
                            onChange={(e) => setTitle(e.target.value)} 
                            className="bg-transparent text-white font-display font-bold text-lg outline-none w-48 placeholder-slate-600 focus:border-b border-cyber-cyan transition-all" 
                            placeholder="Board Name"
                        />
                        <span className="text-[9px] text-slate-500 uppercase tracking-widest font-mono">Zuaki OS v4.1 • Auto-Syncing</span>
                    </div>
                </div>

                {/* Page Controls */}
                <div className="hidden md:flex items-center gap-3 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
                    <button 
                        disabled={activePageIndex === 0} 
                        onClick={() => setActivePageIndex(p => p - 1)}
                        className="p-1 text-slate-400 hover:text-white disabled:opacity-30"
                    >
                        <ChevronLeft size={18} />
                    </button>
                    <span className="text-xs font-mono text-white font-bold">PAGE {activePageIndex + 1} / {pages.length}</span>
                    <button 
                        onClick={() => {
                            if (activePageIndex === pages.length - 1) setPages([...pages, { id: `p${pages.length+1}`, strokes: [] }]);
                            setActivePageIndex(p => p + 1);
                        }}
                        className="p-1 text-slate-400 hover:text-white"
                    >
                        {activePageIndex === pages.length - 1 ? <Plus size={18} /> : <ChevronRight size={18} />}
                    </button>
                </div>

                <div className="flex items-center gap-2">
                    <button onClick={handleUndo} disabled={history.length === 0} className="p-2 text-slate-400 hover:text-white disabled:opacity-20"><Undo size={20}/></button>
                    <button onClick={handleRedo} disabled={redoStack.length === 0} className="p-2 text-slate-400 hover:text-white disabled:opacity-20"><Redo size={20}/></button>
                    <div className="w-px h-6 bg-white/10 mx-2"></div>
                    <button onClick={handleSave} className="px-5 py-2 bg-cyber-purple text-white font-bold rounded-lg shadow-[0_0_15px_#9d00ff] hover:scale-105 transition-all flex items-center gap-2">
                        <Save size={18} /> <span className="hidden sm:inline">Save Board</span>
                    </button>
                </div>
            </header>

            <main className="flex-1 relative flex overflow-hidden">
                
                {/* --- FLOATING TOOLBAR (LEFT) --- */}
                <aside className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-40">
                    <div className="glass-panel p-2 rounded-2xl border border-white/10 flex flex-col gap-2 shadow-2xl">
                        <ToolBtn active={tool === 'pen'} icon={Pen} onClick={() => setTool('pen')} color="cyan" label="Pen" />
                        <ToolBtn active={tool === 'highlighter'} icon={Highlighter} onClick={() => setTool('highlighter')} color="yellow" label="Marker" />
                        <ToolBtn active={tool === 'eraser'} icon={Eraser} onClick={() => setTool('eraser')} color="pink" label="Eraser" />
                        <div className="h-px bg-white/10 mx-1 my-1"></div>
                        <ToolBtn active={tool === 'line'} icon={Minus} onClick={() => setTool('line')} color="white" label="Line" />
                        <ToolBtn active={tool === 'arrow'} icon={ArrowRight} onClick={() => setTool('arrow')} color="white" label="Arrow" />
                        <ToolBtn active={tool === 'rect'} icon={Square} onClick={() => setTool('rect')} color="white" label="Rectangle" />
                        <ToolBtn active={tool === 'circle'} icon={Circle} onClick={() => setTool('circle')} color="white" label="Circle" />
                    </div>

                    <div className="glass-panel p-2 rounded-2xl border border-white/10 flex flex-col gap-2 shadow-2xl">
                        <button onClick={() => setBackground(b => b === 'grid' ? 'dots' : b === 'dots' ? 'plain' : 'grid')} className="p-3 text-slate-400 hover:text-white transition-colors" title="Toggle Grid">
                            <GridIcon size={20} />
                        </button>
                        <button onClick={() => setZoom(z => Math.max(0.5, z - 0.1))} className="p-3 text-slate-400 hover:text-white transition-colors" title="Zoom Out">
                            <Minimize2 size={20} />
                        </button>
                        <button onClick={() => setZoom(z => Math.min(3, z + 0.1))} className="p-3 text-slate-400 hover:text-white transition-colors" title="Zoom In">
                            <Maximize2 size={20} />
                        </button>
                    </div>
                </aside>

                {/* --- MAIN CANVAS AREA --- */}
                <section ref={containerRef} className="flex-1 bg-[#050818] cursor-crosshair overflow-hidden relative">
                    {showTip && (
                        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-40 animate-in slide-in-from-top-4 duration-500">
                            <div className="bg-cyber-cyan/10 border border-cyber-cyan/30 px-6 py-2 rounded-full backdrop-blur-xl flex items-center gap-3">
                                <Info size={14} className="text-cyber-cyan" />
                                <span className="text-[10px] font-bold text-white uppercase tracking-widest">Zuaki Whiteboard — Premium tools, zero cost.</span>
                                <button onClick={() => setShowTip(false)} className="text-slate-500 hover:text-white ml-2"><X size={14}/></button>
                            </div>
                        </div>
                    )}

                    <canvas 
                        ref={canvasRef} 
                        onMouseDown={handleStart}
                        onMouseMove={handleMove}
                        onMouseUp={handleEnd}
                        onMouseLeave={handleEnd}
                        onTouchStart={handleStart}
                        onTouchMove={handleMove}
                        onTouchEnd={handleEnd}
                        className="block touch-none"
                    />

                    {/* Navigation Mini-Map Overlay (Simulated) */}
                    <div className="absolute bottom-6 left-6 p-4 rounded-xl glass-panel border border-white/10 flex flex-col gap-2 z-20">
                        <p className="text-[10px] font-mono text-slate-500">CANVAS VIEW: {Math.round(zoom * 100)}%</p>
                        <div className="flex gap-2">
                             {COLORS.map(c => (
                                 <button 
                                    key={c} 
                                    onClick={() => setColor(c)} 
                                    className={`w-6 h-6 rounded-full border transition-all ${color === c ? 'scale-125 border-white shadow-[0_0_10px_white]' : 'border-transparent opacity-60 hover:opacity-100'}`}
                                    style={{ backgroundColor: c }}
                                 />
                             ))}
                        </div>
                    </div>
                </section>

                {/* --- RIGHT ACTION PANEL --- */}
                <aside className="h-full w-20 md:w-24 bg-black/40 border-l border-white/5 flex flex-col items-center py-8 gap-6 z-30">
                    <ActionButton icon={Brain} label="Solve" color="purple" onClick={() => handleAiTask('SOLVE')} />
                    <ActionButton icon={Sparkles} label="Explain" color="cyan" onClick={() => handleAiTask('EXPLAIN')} />
                    <ActionButton icon={Check} label="Check" color="green" onClick={() => handleAiTask('CHECK')} />
                    <div className="flex-1"></div>
                    <ActionButton icon={Download} label="Export" color="white" onClick={exportAsImage} />
                    <ActionButton icon={Trash2} label="Clear" color="pink" onClick={handleClear} />
                </aside>

                {/* --- AI ASSIST SLIDE OVER --- */}
                {showAiPanel && (
                    <div className="absolute inset-y-0 right-0 w-full md:w-96 bg-[#0b0f1a] border-l border-cyber-cyan/30 z-[60] shadow-[-20px_0_50px_rgba(0,0,0,0.5)] flex flex-col animate-in slide-in-from-right duration-300">
                        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-black/40">
                            <div className="flex items-center gap-3">
                                <div className="p-2 rounded-lg bg-cyber-purple/20 text-cyber-purple"><Brain size={20} /></div>
                                <h3 className="text-white font-bold uppercase tracking-widest text-sm">GenZ Board Analysis</h3>
                            </div>
                            <button onClick={() => setShowAiPanel(false)} className="p-2 text-slate-500 hover:text-white transition-colors">
                                <X size={24} />
                            </button>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                            {isAiLoading ? (
                                <div className="flex flex-col items-center justify-center h-full gap-4">
                                    <div className="w-12 h-12 border-4 border-cyber-cyan border-t-transparent rounded-full animate-spin"></div>
                                    <p className="text-cyber-cyan text-xs font-mono uppercase tracking-[0.2em] animate-pulse">Processing Neural Nodes...</p>
                                </div>
                            ) : aiResult ? (
                                <div className="prose prose-invert prose-sm">
                                    <div className="p-4 bg-white/5 rounded-xl border border-white/10 text-slate-300 leading-relaxed whitespace-pre-wrap font-sans">
                                        {aiResult}
                                    </div>
                                    <div className="mt-8 flex flex-col gap-4">
                                        <h4 className="text-xs font-bold text-cyber-cyan uppercase tracking-widest">Recommended Actions</h4>
                                        <button className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-white hover:bg-cyber-cyan hover:text-black transition-all">Add to Formula Vault</button>
                                        <button className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-white hover:bg-cyber-purple hover:text-white transition-all">Generate Similar Problem</button>
                                    </div>
                                </div>
                            ) : null}
                        </div>

                        <div className="p-4 bg-black/40 border-t border-white/10 flex items-center justify-center">
                            <p className="text-[9px] text-slate-500 uppercase tracking-widest text-center">Analysis powered by Zuaki Neural Link. Accuracy verified for PCM.</p>
                        </div>
                    </div>
                )}
            </main>

            {/* --- BOTTOM HUD (MOBILE ONLY) --- */}
            <div className="md:hidden h-16 bg-black/80 backdrop-blur-xl border-t border-white/10 flex items-center justify-around px-4">
                 <button onClick={handleUndo} className="p-2 text-slate-400"><Undo size={24}/></button>
                 <button onClick={() => setShowAiPanel(true)} className="p-3 bg-cyber-purple rounded-full shadow-lg"><Brain size={24} className="text-white"/></button>
                 <button onClick={handleSave} className="p-2 text-cyber-cyan"><Save size={24}/></button>
            </div>
        </div>
    );
};

// --- SUB COMPONENTS ---

const ToolBtn = ({ active, icon: Icon, onClick, color, label }: any) => {
    const activeStyles = {
        cyan: 'bg-cyber-cyan text-black shadow-[0_0_15px_#00f3ff]',
        yellow: 'bg-cyber-yellow text-black shadow-[0_0_15px_#fcee0a]',
        pink: 'bg-cyber-pink text-white shadow-[0_0_15px_#ff003c]',
        white: 'bg-white text-black shadow-[0_0_15px_white]',
    };

    return (
        <button 
            onClick={onClick}
            title={label}
            className={`p-3 rounded-xl transition-all relative group ${active ? activeStyles[color as keyof typeof activeStyles] : 'text-slate-500 hover:text-white hover:bg-white/5'}`}
        >
            <Icon size={22} />
            <span className="absolute left-full ml-4 px-2 py-1 bg-black/90 text-white text-[10px] font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap rounded border border-white/10 z-50">
                {label}
            </span>
        </button>
    );
};

const ActionButton = ({ icon: Icon, label, color, onClick }: any) => {
    const colors = {
        purple: 'text-cyber-purple hover:bg-cyber-purple/10',
        cyan: 'text-cyber-cyan hover:bg-cyber-cyan/10',
        green: 'text-green-400 hover:bg-green-400/10',
        white: 'text-white hover:bg-white/5',
        pink: 'text-cyber-pink hover:bg-cyber-pink/10'
    };

    return (
        <button 
            onClick={onClick}
            className={`flex flex-col items-center gap-1 transition-all group ${colors[color as keyof typeof colors]}`}
        >
            <div className="p-3 rounded-2xl border border-transparent group-hover:border-current transition-all">
                <Icon size={24} />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-tighter opacity-70 group-hover:opacity-100">{label}</span>
        </button>
    );
};
