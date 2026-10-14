
import React, { useState, useEffect, useRef } from 'react';
import { X, Pin, Maximize2, Minimize2, Move } from 'lucide-react';

interface CalculatorPopupProps {
  onClose: () => void;
}

export const CalculatorPopup: React.FC<CalculatorPopupProps> = ({ onClose }) => {
  const [display, setDisplay] = useState('0');
  const [position, setPosition] = useState({ x: window.innerWidth / 2 - 160, y: window.innerHeight / 2 - 250 });
  const [size, setSize] = useState(1); // Scale factor
  const [isPinned, setIsPinned] = useState(false);
  
  const isDragging = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const panelRef = useRef<HTMLDivElement>(null);

  // Load Saved State
  useEffect(() => {
      const saved = localStorage.getItem('zuaki_calc_pref');
      if (saved) {
          try {
              const pref = JSON.parse(saved);
              setPosition(pref.position);
              setSize(pref.size);
              setIsPinned(pref.pinned);
          } catch(e) {}
      }
  }, []);

  // Save State on Change
  useEffect(() => {
      localStorage.setItem('zuaki_calc_pref', JSON.stringify({ position, size, pinned: isPinned }));
  }, [position, size, isPinned]);

  // Drag Logic
  useEffect(() => {
      const handleMouseMove = (e: MouseEvent) => {
          if (isDragging.current) {
              setPosition({
                  x: e.clientX - dragOffset.current.x,
                  y: e.clientY - dragOffset.current.y
              });
          }
      };
      
      const handleMouseUp = () => {
          isDragging.current = false;
      };

      const handleTouchMove = (e: TouchEvent) => {
          if (isDragging.current) {
              setPosition({
                  x: e.touches[0].clientX - dragOffset.current.x,
                  y: e.touches[0].clientY - dragOffset.current.y
              });
          }
      };

      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleMouseUp);

      return () => {
          window.removeEventListener('mousemove', handleMouseMove);
          window.removeEventListener('mouseup', handleMouseUp);
          window.removeEventListener('touchmove', handleTouchMove);
          window.removeEventListener('touchend', handleMouseUp);
      };
  }, []);

  const startDrag = (e: React.MouseEvent | React.TouchEvent) => {
      isDragging.current = true;
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
      const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
      dragOffset.current = {
          x: clientX - position.x,
          y: clientY - position.y
      };
  };

  const handlePress = (v: string) => {
      if (v === 'C') setDisplay('0');
      else if (v === '=') {
          try { 
              // Basic sanitization
              let expression = display
                .replace(/sin/g, 'Math.sin')
                .replace(/cos/g, 'Math.cos')
                .replace(/tan/g, 'Math.tan')
                .replace(/log/g, 'Math.log10')
                .replace(/ln/g, 'Math.log')
                .replace(/√/g, 'Math.sqrt')
                .replace(/π/g, 'Math.PI')
                .replace(/e/g, 'Math.E')
                .replace(/\^/g, '**');
              
              // eslint-disable-next-line no-eval
              let result = eval(expression);
              
              // Handle formatting
              if (!Number.isInteger(result)) result = (result as number).toFixed(4);
              setDisplay(result.toString()); 
          } catch (e) { setDisplay('Error'); }
      } 
      else if (['sin', 'cos', 'tan', 'log', 'ln', '√'].includes(v)) {
          setDisplay(prev => prev === '0' ? v + '(' : prev + v + '(');
      }
      else {
          setDisplay(prev => prev === '0' ? v : prev + v);
      }
  };

  return (
    <div 
        ref={panelRef}
        className="fixed z-[9999] bg-[#0b0f1a]/95 backdrop-blur-xl border border-cyber-cyan/30 rounded-3xl shadow-[0_0_50px_rgba(0,243,255,0.2)] overflow-hidden animate-in fade-in zoom-in duration-300 origin-center"
        style={{ 
            left: position.x, 
            top: position.y, 
            transform: `scale(${size})`,
            width: '340px',
            touchAction: 'none'
        }}
    >
        {/* Header / Drag Handle */}
        <div 
            onMouseDown={startDrag}
            onTouchStart={startDrag}
            className="bg-black/40 h-10 flex items-center justify-between px-3 cursor-move border-b border-white/5"
        >
            <div className="flex items-center gap-2 text-slate-400">
                <Move size={14} />
                <span className="text-[10px] font-bold uppercase tracking-widest text-cyber-cyan">Sci-Calc</span>
            </div>
            <div className="flex items-center gap-1">
                <button 
                    onClick={() => setSize(s => Math.max(0.6, s - 0.1))} 
                    className="p-1 hover:bg-white/10 rounded text-slate-400"
                    title="Shrink"
                >
                    <Minimize2 size={12} />
                </button>
                <button 
                    onClick={() => setSize(s => Math.min(1.5, s + 0.1))} 
                    className="p-1 hover:bg-white/10 rounded text-slate-400"
                    title="Enlarge"
                >
                    <Maximize2 size={12} />
                </button>
                <button 
                    onClick={() => setIsPinned(!isPinned)} 
                    className={`p-1 hover:bg-white/10 rounded transition-colors ${isPinned ? 'text-cyber-yellow' : 'text-slate-400'}`}
                    title="Pin to top"
                >
                    <Pin size={12} fill={isPinned ? "currentColor" : "none"} />
                </button>
                <button 
                    onClick={onClose} 
                    className="p-1 hover:bg-red-500/20 hover:text-red-500 rounded text-slate-400 ml-1"
                >
                    <X size={14} />
                </button>
            </div>
        </div>

        {/* Content */}
        <div className="p-4">
            <div className="bg-black/60 h-20 rounded-xl mb-4 flex items-center justify-end px-4 text-2xl text-white font-mono border border-white/10 shadow-inner overflow-hidden break-all">
                {display}
            </div>

            <div className="grid grid-cols-5 gap-2">
                {/* Scientific Row 1 */}
                {['sin', 'cos', 'tan', 'C', 'AC'].map(btn => (
                    <button key={btn} onMouseDown={(e) => { e.stopPropagation(); handlePress(btn === 'AC' ? 'C' : btn); }} className="h-8 rounded bg-cyber-purple/20 text-cyber-purple text-xs font-bold border border-cyber-purple/30 hover:bg-cyber-purple/40">{btn}</button>
                ))}
                
                {/* Scientific Row 2 */}
                {['log', 'ln', '(', ')', '^'].map(btn => (
                    <button key={btn} onMouseDown={(e) => { e.stopPropagation(); handlePress(btn); }} className="h-8 rounded bg-white/5 text-slate-300 text-xs border border-white/10 hover:bg-white/10">{btn}</button>
                ))}

                {/* Scientific Row 3 */}
                {['√', 'π', 'e', '%', '/'].map(btn => (
                    <button key={btn} onMouseDown={(e) => { e.stopPropagation(); handlePress(btn); }} className="h-8 rounded bg-white/5 text-slate-300 text-xs border border-white/10 hover:bg-white/10">{btn}</button>
                ))}

                {/* Numbers & Basic Ops */}
                {['7', '8', '9', '*', '4', '5', '6', '-', '1', '2', '3', '+', '0', '.', '='].map(btn => (
                    <button 
                        key={btn} 
                        onMouseDown={(e) => { e.stopPropagation(); handlePress(btn); }} 
                        className={`h-10 rounded-lg font-bold transition-all active:scale-95 text-sm col-span-1 ${
                            ['*', '-', '+'].includes(btn) 
                            ? 'bg-cyber-purple/10 border border-cyber-purple/30 text-white' 
                            : btn === '=' 
                                ? 'bg-cyber-cyan text-black shadow-[0_0_10px_#00f3ff] col-span-1' 
                                : 'bg-white/10 text-white hover:bg-white/20 border border-white/5'
                        }`}
                        style={{ gridColumn: btn === '0' ? 'span 2' : 'span 1' }}
                    >
                        {btn}
                    </button>
                ))}
            </div>
        </div>
    </div>
  );
};
