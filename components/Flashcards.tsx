
import React, { useState, useEffect, useRef } from 'react';
import { BookOpen, Check, X, RotateCcw, Hand, ChevronRight, ChevronLeft, Zap, Layers } from 'lucide-react';
import { MOCK_FLASHCARDS } from '../data/flashcards';
import { Flashcard } from '../types';

const SWIPE_THRESHOLD = 100;

export const Flashcards: React.FC = () => {
    // --- STATE ---
    const [filterClass, setFilterClass] = useState<string>('12');
    const [filterSubject, setFilterSubject] = useState<string>('Physics');
    
    // Learning Queue
    const [queue, setQueue] = useState<Flashcard[]>([]);
    const [masteredCount, setMasteredCount] = useState(0);
    const [reviewCount, setReviewCount] = useState(0);
    const [sessionComplete, setSessionComplete] = useState(false);

    // Active Card State
    const [isAnswerRevealed, setIsAnswerRevealed] = useState(false);
    const [dragX, setDragX] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [animatingOut, setAnimatingOut] = useState<'LEFT' | 'RIGHT' | null>(null);

    // Tutorial State
    const [showTutorial, setShowTutorial] = useState(false);

    // Refs for Dragging
    const dragStartX = useRef<number | null>(null);
    const cardRef = useRef<HTMLDivElement>(null);

    // --- INITIALIZATION ---
    useEffect(() => {
        loadSession();
        const hasSeenTutorial = localStorage.getItem('zuaki_flashcards_tutorial');
        if (!hasSeenTutorial) {
            setShowTutorial(true);
        }
    }, [filterClass, filterSubject]);

    const loadSession = () => {
        // Filter and Shuffle
        const filtered = MOCK_FLASHCARDS.filter(c => c.classLevel === filterClass && c.subject === filterSubject);
        const shuffled = [...filtered].sort(() => Math.random() - 0.5);
        
        setQueue(shuffled);
        setMasteredCount(0);
        setReviewCount(0);
        setSessionComplete(false);
        resetCardState();
    };

    const resetCardState = () => {
        setIsAnswerRevealed(false);
        setDragX(0);
        setIsDragging(false);
        setAnimatingOut(null);
        dragStartX.current = null;
    };

    const dismissTutorial = () => {
        setShowTutorial(false);
        localStorage.setItem('zuaki_flashcards_tutorial', 'true');
    };

    // --- INTERACTION LOGIC ---

    const handleTouchStart = (e: React.TouchEvent | React.MouseEvent) => {
        if (sessionComplete || animatingOut) return;
        setIsDragging(true);
        const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
        dragStartX.current = clientX;
    };

    const handleTouchMove = (e: React.TouchEvent | React.MouseEvent) => {
        if (!isDragging || dragStartX.current === null) return;
        const clientX = 'touches' in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
        const delta = clientX - dragStartX.current;
        setDragX(delta);
    };

    const handleTouchEnd = () => {
        if (!isDragging) return;
        setIsDragging(false);

        if (dragX > SWIPE_THRESHOLD) {
            handleSwipe('RIGHT');
        } else if (dragX < -SWIPE_THRESHOLD) {
            handleSwipe('LEFT');
        } else {
            setDragX(0); // Reset position
        }
    };

    const handleSwipe = (direction: 'LEFT' | 'RIGHT') => {
        setAnimatingOut(direction);
        
        // Wait for animation to finish then update queue
        setTimeout(() => {
            const currentCard = queue[0];
            const remaining = queue.slice(1);

            if (direction === 'RIGHT') {
                // Completed: Remove from queue
                setMasteredCount(prev => prev + 1);
                if (remaining.length === 0) setSessionComplete(true);
                setQueue(remaining);
            } else {
                // Review: Re-insert into queue (Smart Repetition)
                setReviewCount(prev => prev + 1);
                // Insert at index 3 or end if length < 3
                const insertIndex = Math.min(remaining.length, 3);
                const newQueue = [...remaining];
                newQueue.splice(insertIndex, 0, currentCard);
                setQueue(newQueue);
            }
            
            resetCardState();
        }, 300); // Match animation duration
    };

    // Button controls for non-touch users
    const manualAction = (action: 'REVEAL' | 'PASS' | 'REVIEW') => {
        if (action === 'REVEAL') setIsAnswerRevealed(true);
        else if (action === 'PASS') handleSwipe('RIGHT');
        else if (action === 'REVIEW') handleSwipe('LEFT');
    };

    // --- RENDER HELPERS ---
    
    // Dynamic Styles for Dragging
    const cardStyle = {
        transform: animatingOut 
            ? `translateX(${animatingOut === 'RIGHT' ? 1000 : -1000}px) rotate(${animatingOut === 'RIGHT' ? 45 : -45}deg)`
            : `translateX(${dragX}px) rotate(${dragX * 0.05}deg)`,
        transition: isDragging ? 'none' : 'transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)',
        opacity: animatingOut ? 0 : 1
    };

    const overlayOpacity = Math.min(Math.abs(dragX) / (SWIPE_THRESHOLD * 1.5), 0.8);
    const overlayColor = dragX > 0 ? 'bg-cyber-cyan' : 'bg-cyber-pink';

    const activeCard = queue[0];
    const nextCard = queue[1];

    return (
        <div className="h-full w-full bg-[#020617] p-6 flex flex-col items-center relative overflow-hidden select-none">
            {/* Background Ambience */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#0f172a_0%,_#020617_80%)] pointer-events-none"></div>

            {/* Header / HUD */}
            <div className="z-20 w-full max-w-md flex flex-col gap-4 mb-6">
                <div className="flex items-center justify-between">
                    <h1 className="text-2xl font-display font-bold text-white uppercase tracking-widest flex items-center gap-2">
                        <BookOpen className="text-cyber-cyan" size={24} /> 
                        <span className="text-white">Flash</span><span className="text-cyber-cyan">Focus</span>
                    </h1>
                    
                    {/* Filter Pills */}
                    <div className="flex gap-2">
                        <select 
                            value={filterSubject} 
                            onChange={e => setFilterSubject(e.target.value)}
                            className="bg-white/5 border border-white/10 rounded-lg text-white text-[10px] uppercase font-bold p-2 outline-none focus:border-cyber-cyan transition-colors"
                        >
                            <option>Physics</option>
                            <option>Chemistry</option>
                            <option>Maths</option>
                        </select>
                    </div>
                </div>

                {/* Progress Bar */}
                <div className="flex justify-between items-center bg-black/40 rounded-full p-1 border border-white/10 relative overflow-hidden">
                    <div className="flex items-center gap-2 px-3 z-10">
                        <div className="w-2 h-2 rounded-full bg-cyber-pink animate-pulse"></div>
                        <span className="text-[10px] text-cyber-pink font-bold uppercase tracking-wider">{reviewCount} Review</span>
                    </div>
                    
                    {/* Center Queue Count */}
                    <div className="absolute left-1/2 -translate-x-1/2 text-[10px] text-slate-500 font-mono z-10">
                        {queue.length} Cards Left
                    </div>

                    <div className="flex items-center gap-2 px-3 z-10">
                        <span className="text-[10px] text-cyber-cyan font-bold uppercase tracking-wider">{masteredCount} Mastered</span>
                        <div className="w-2 h-2 rounded-full bg-cyber-cyan shadow-[0_0_5px_#00f3ff]"></div>
                    </div>
                </div>
            </div>

            {/* MAIN CARD AREA */}
            <div className="flex-1 w-full max-w-md relative flex items-center justify-center perspective-1000">
                
                {sessionComplete ? (
                    <div className="text-center animate-in zoom-in duration-300">
                        <div className="w-24 h-24 bg-cyber-cyan/10 rounded-full border border-cyber-cyan flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_#00f3ff40]">
                            <Check size={48} className="text-cyber-cyan" />
                        </div>
                        <h2 className="text-3xl font-display font-bold text-white mb-2 uppercase tracking-widest">Set Cleared</h2>
                        <p className="text-slate-400 text-sm mb-8">You've reviewed all cards for this session.</p>
                        <button 
                            onClick={loadSession}
                            className="px-8 py-3 bg-white text-black font-bold rounded-xl flex items-center gap-2 mx-auto hover:bg-slate-200 transition-colors"
                        >
                            <RotateCcw size={18} /> Restart Session
                        </button>
                    </div>
                ) : (
                    <>
                        {/* Next Card (Underneath) */}
                        {nextCard && (
                            <div className="absolute inset-4 top-8 bg-white/5 border border-white/5 rounded-3xl transform scale-95 opacity-50 translate-y-4"></div>
                        )}

                        {/* Active Card */}
                        {activeCard && (
                            <div 
                                ref={cardRef}
                                style={cardStyle}
                                onMouseDown={handleTouchStart}
                                onMouseMove={handleTouchMove}
                                onMouseUp={handleTouchEnd}
                                onMouseLeave={handleTouchEnd}
                                onTouchStart={handleTouchStart}
                                onTouchMove={handleTouchMove}
                                onTouchEnd={handleTouchEnd}
                                onClick={() => !isDragging && !isAnswerRevealed && manualAction('REVEAL')}
                                className="absolute inset-4 md:inset-0 bg-black/80 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl cursor-grab active:cursor-grabbing overflow-hidden flex flex-col"
                            >
                                {/* Drag Overlay Indicator */}
                                <div 
                                    className={`absolute inset-0 z-20 pointer-events-none transition-opacity duration-200 flex items-center justify-center ${overlayColor}`}
                                    style={{ opacity: overlayOpacity }}
                                >
                                    {dragX > 0 ? (
                                        <div className="flex flex-col items-center">
                                            <Check size={64} className="text-black mb-2" />
                                            <span className="text-black font-display font-bold text-2xl uppercase tracking-widest">Mastered</span>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center">
                                            <RotateCcw size={64} className="text-white mb-2" />
                                            <span className="text-white font-display font-bold text-2xl uppercase tracking-widest">Review</span>
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="flex-1 p-8 flex flex-col items-center justify-center text-center relative z-10">
                                    <div className="mb-6">
                                        <span className="text-[10px] text-slate-500 uppercase tracking-[0.2em] border border-white/10 px-3 py-1 rounded-full">
                                            {activeCard.chapter}
                                        </span>
                                    </div>
                                    
                                    <h2 className="text-2xl md:text-3xl font-bold text-white leading-relaxed select-none">
                                        {activeCard.front}
                                    </h2>

                                    {/* Answer Section (Conditional Reveal) */}
                                    <div className={`mt-8 w-full transition-all duration-500 ${isAnswerRevealed ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}>
                                        <div className="h-px w-16 bg-white/10 mx-auto mb-6"></div>
                                        <p className="text-lg text-cyber-cyan font-medium leading-relaxed select-none">
                                            {activeCard.back}
                                        </p>
                                    </div>
                                </div>

                                {/* Footer Hint */}
                                <div className="p-6 text-center border-t border-white/5 bg-white/5 relative z-10">
                                    {!isAnswerRevealed ? (
                                        <span className="text-xs text-slate-400 font-mono uppercase tracking-widest animate-pulse">Tap to Reveal</span>
                                    ) : (
                                        <div className="flex justify-between items-center px-4">
                                            <span className="text-[10px] font-bold text-cyber-pink flex items-center gap-1 uppercase tracking-wider"><ChevronLeft size={12}/> Swipe Left to Review</span>
                                            <span className="text-[10px] font-bold text-cyber-cyan flex items-center gap-1 uppercase tracking-wider">Swipe Right to Complete <ChevronRight size={12}/></span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Desktop Controls (Fallback) */}
            {!sessionComplete && (
                <div className="hidden md:flex gap-4 mt-6 z-20">
                    <button onClick={() => manualAction('REVIEW')} className="px-6 py-3 rounded-xl border border-cyber-pink/50 text-cyber-pink font-bold uppercase tracking-widest hover:bg-cyber-pink hover:text-white transition-all">Review</button>
                    <button onClick={() => manualAction('REVEAL')} className="px-6 py-3 rounded-xl border border-white/20 text-white font-bold uppercase tracking-widest hover:bg-white/10 transition-all">Reveal</button>
                    <button onClick={() => manualAction('PASS')} className="px-6 py-3 rounded-xl border border-cyber-cyan/50 text-cyber-cyan font-bold uppercase tracking-widest hover:bg-cyber-cyan hover:text-black transition-all">Mastered</button>
                </div>
            )}

            {/* TUTORIAL OVERLAY */}
            {showTutorial && (
                <div className="absolute inset-0 z-50 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-300">
                    <div className="relative w-full max-w-sm aspect-[3/4] border border-dashed border-white/20 rounded-3xl flex flex-col items-center justify-center mb-8">
                        <div className="absolute left-4 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2 animate-pulse">
                            <ChevronLeft size={32} className="text-cyber-pink" />
                            <span className="text-cyber-pink text-xs font-bold uppercase tracking-widest">Review</span>
                        </div>
                        <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col items-center gap-2 animate-pulse">
                            <ChevronRight size={32} className="text-cyber-cyan" />
                            <span className="text-cyber-cyan text-xs font-bold uppercase tracking-widest">Mastered</span>
                        </div>
                        
                        <Hand size={48} className="text-white mb-4 animate-bounce" />
                        <h3 className="text-2xl font-bold text-white mb-2">Swipe to Learn</h3>
                        <p className="text-slate-400 text-sm max-w-[200px]">Tap card to flip. Swipe Right if you know it, Left if you don't.</p>
                    </div>
                    <button 
                        onClick={dismissTutorial}
                        className="px-8 py-3 bg-white text-black font-bold rounded-xl uppercase tracking-widest hover:scale-105 transition-transform"
                    >
                        Got it
                    </button>
                </div>
            )}
        </div>
    );
};
