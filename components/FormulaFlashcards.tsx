
import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft, Search, Filter, RotateCcw, CheckCircle, XCircle, Zap, BookOpen, Layers, MoreVertical, Eye, EyeOff, Info, HelpCircle } from 'lucide-react';
import { FormulaTopic, FormulaCard, ViewState } from '../types';
import { JEE_FORMULA_DATA } from '../data/flashcardData';

interface Props {
    onBack: () => void;
    onViewShortNotes?: () => void;
}

// --- CONSTANTS ---
const SWIPE_THRESHOLD = 80;

export const FormulaFlashcards: React.FC<Props> = ({ onBack, onViewShortNotes }) => {
    // Mode: LIBRARY or PLAYER
    const [activeTopic, setActiveTopic] = useState<FormulaTopic | null>(null);
    const [topics, setTopics] = useState<FormulaTopic[]>([]);
    const [search, setSearch] = useState('');
    const [subjectFilter, setSubjectFilter] = useState<'All' | 'Physics' | 'Chemistry' | 'Maths'>('All');

    // --- INITIAL LOAD ---
    useEffect(() => {
        const stored = localStorage.getItem('zuaki_flash_progress_v2');
        if (stored) {
            const progressMap = JSON.parse(stored);
            // Merge progress
            const merged = JEE_FORMULA_DATA.map(t => ({
                ...t,
                cards: t.cards.map(c => ({
                    ...c,
                    mastered: progressMap[c.id]?.mastered || false
                }))
            }));
            setTopics(merged);
        } else {
            setTopics(JEE_FORMULA_DATA);
        }
    }, []);

    const saveProgress = (updatedTopic: FormulaTopic) => {
        // Update local state
        const newTopics = topics.map(t => t.id === updatedTopic.id ? updatedTopic : t);
        setTopics(newTopics);

        // Persist
        const progressMap: Record<string, any> = JSON.parse(localStorage.getItem('zuaki_flash_progress_v2') || '{}');
        updatedTopic.cards.forEach(c => {
            progressMap[c.id] = { mastered: c.mastered };
        });
        localStorage.setItem('zuaki_flash_progress_v2', JSON.stringify(progressMap));
    };

    // --- LIBRARY VIEW ---
    if (!activeTopic) {
        const filteredTopics = topics.filter(t => {
            const matchesSubject = subjectFilter === 'All' || t.subject === subjectFilter;
            const matchesSearch = 
                t.chapter.toLowerCase().includes(search.toLowerCase()) || 
                t.cards.some(c => c.front.toLowerCase().includes(search.toLowerCase()));
            return matchesSubject && matchesSearch;
        });

        return (
            <div className="h-full w-full bg-[#020617] flex flex-col relative overflow-hidden">
                {/* Background Ambience */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_#0f172a_0%,_#020617_80%)] pointer-events-none"></div>
                
                {/* Header */}
                <div className="p-6 pb-2 border-b border-white/10 bg-[#0b0f1a] z-20 sticky top-0">
                    <div className="flex items-center gap-3 mb-6">
                        <button onClick={onBack} className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
                            <ArrowLeft size={20} />
                        </button>
                        <div>
                            <h1 className="text-2xl font-display font-bold text-white uppercase tracking-widest flex items-center gap-2">
                                <Zap className="text-cyber-yellow" fill="currentColor" /> Formula Deck
                            </h1>
                            <p className="text-[10px] text-slate-400 font-mono tracking-wider">JEE Main & Advanced Revision</p>
                        </div>
                    </div>

                    {/* Search */}
                    <div className="relative mb-4">
                        <Search className="absolute left-4 top-3 text-slate-500" size={18} />
                        <input 
                            type="text" 
                            value={search} 
                            onChange={e => setSearch(e.target.value)}
                            placeholder="Search formulas, chapters..." 
                            className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white text-sm focus:border-cyber-cyan outline-none transition-all placeholder:text-slate-600"
                        />
                    </div>

                    {/* Tabs */}
                    <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                        {['All', 'Physics', 'Chemistry', 'Maths'].map(sub => (
                            <button
                                key={sub}
                                onClick={() => setSubjectFilter(sub as any)}
                                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all border ${
                                    subjectFilter === sub 
                                    ? sub === 'Physics' ? 'bg-cyber-cyan/10 border-cyber-cyan text-cyber-cyan' : 
                                      sub === 'Chemistry' ? 'bg-cyber-purple/10 border-cyber-purple text-cyber-purple' : 
                                      sub === 'Maths' ? 'bg-cyber-pink/10 border-cyber-pink text-cyber-pink' :
                                      'bg-white/10 border-white text-white'
                                    : 'bg-transparent border-transparent text-slate-500 hover:text-white hover:bg-white/5'
                                }`}
                            >
                                {sub}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Content Grid */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-6 z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {filteredTopics.map(topic => {
                            const total = topic.cards.length;
                            const mastered = topic.cards.filter(c => c.mastered).length;
                            const progress = Math.round((mastered / total) * 100);
                            const color = topic.subject === 'Physics' ? 'cyber-cyan' : topic.subject === 'Chemistry' ? 'cyber-purple' : 'cyber-pink';

                            return (
                                <div 
                                    key={topic.id} 
                                    onClick={() => setActiveTopic(topic)}
                                    className={`glass-panel p-5 rounded-2xl border border-white/5 hover:border-${color}/50 group cursor-pointer relative overflow-hidden transition-all hover:translate-y-[-2px]`}
                                >
                                    <div className={`absolute top-0 right-0 w-24 h-24 bg-${color}/5 rounded-full blur-[40px] -mr-10 -mt-10 group-hover:bg-${color}/20 transition-all`}></div>
                                    
                                    <div className="relative z-10">
                                        <div className="flex justify-between items-start mb-3">
                                            <span className={`text-[10px] px-2 py-1 rounded border border-${color}/30 text-${color} bg-${color}/10 uppercase font-bold tracking-wider`}>
                                                {topic.subject}
                                            </span>
                                            {progress === 100 && <CheckCircle size={16} className="text-green-400" />}
                                        </div>
                                        
                                        <h3 className="text-white font-bold text-lg mb-1 line-clamp-1">{topic.chapter}</h3>
                                        <p className="text-slate-400 text-xs mb-4">{topic.topic}</p>

                                        {/* Progress Bar */}
                                        <div className="w-full h-1.5 bg-black/40 rounded-full overflow-hidden flex items-center">
                                            <div 
                                                className={`h-full bg-${color} transition-all duration-1000`} 
                                                style={{ width: `${progress}%` }}
                                            ></div>
                                        </div>
                                        <div className="flex justify-between mt-2 text-[10px] font-mono text-slate-500">
                                            <span>{mastered} / {total} Mastered</span>
                                            <span>{progress}%</span>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                    {filteredTopics.length === 0 && (
                        <div className="text-center py-20 text-slate-500">No chapters found matching criteria.</div>
                    )}
                </div>
            </div>
        );
    }

    // --- PLAYER VIEW ---
    return (
        <FlashcardPlayer 
            topic={activeTopic} 
            onClose={() => { saveProgress(activeTopic); setActiveTopic(null); }} 
            onUpdate={(t) => setActiveTopic({...t})}
            onViewShortNotes={onViewShortNotes}
        />
    );
};

// --- FLASHCARD PLAYER COMPONENT ---

interface PlayerProps {
    topic: FormulaTopic;
    onClose: () => void;
    onUpdate: (topic: FormulaTopic) => void;
    onViewShortNotes?: () => void;
}

const FlashcardPlayer: React.FC<PlayerProps> = ({ topic, onClose, onUpdate, onViewShortNotes }) => {
    const [queue, setQueue] = useState<FormulaCard[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    
    const [dragX, setDragX] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [exitDir, setExitDir] = useState<'LEFT' | 'RIGHT' | null>(null);
    const [showExplanation, setShowExplanation] = useState(false);

    const cardRef = useRef<HTMLDivElement>(null);
    const startX = useRef<number | null>(null);

    useEffect(() => {
        const sorted = [...topic.cards].sort((a, b) => (a.mastered === b.mastered ? 0 : a.mastered ? 1 : -1));
        setQueue(sorted);
    }, []);

    const activeCard = queue[currentIndex];
    const nextCard = queue[currentIndex + 1];

    const handleStart = (e: React.TouchEvent | React.MouseEvent) => {
        if (showExplanation) return;
        setIsDragging(true);
        startX.current = 'touches' in e ? e.touches[0].clientX : e.clientX;
    };

    const handleMove = (e: React.TouchEvent | React.MouseEvent) => {
        if (!isDragging || startX.current === null || showExplanation) return;
        const currentX = 'touches' in e ? e.touches[0].clientX : e.clientX;
        setDragX(currentX - startX.current);
    };

    const handleEnd = () => {
        if (!isDragging) return;
        setIsDragging(false);

        if (dragX > SWIPE_THRESHOLD) {
            handleSwipeRight();
        } else if (dragX < -SWIPE_THRESHOLD) {
            handleSwipeLeft();
        } else {
            setDragX(0);
        }
        startX.current = null;
    };

    const handleSwipeRight = () => {
        setExitDir('RIGHT');
        setTimeout(() => {
            const newCards = [...topic.cards];
            const cardIndex = newCards.findIndex(c => c.id === activeCard.id);
            if (cardIndex !== -1) newCards[cardIndex].mastered = true;
            onUpdate({ ...topic, cards: newCards });
            next();
        }, 300);
    };

    const handleSwipeLeft = () => {
        setExitDir('LEFT');
        setTimeout(() => {
            setShowExplanation(true);
            setExitDir(null);
            setDragX(0);
            setIsFlipped(true);
        }, 300);
    };

    const handleContinueAfterExplanation = () => {
        setShowExplanation(false);
        setIsFlipped(false);
        const newCards = [...topic.cards];
        const cardIndex = newCards.findIndex(c => c.id === activeCard.id);
        if (cardIndex !== -1) newCards[cardIndex].mastered = false;
        onUpdate({ ...topic, cards: newCards });
        const newQueue = [...queue];
        const currentItem = newQueue[currentIndex];
        newQueue.push(currentItem);
        setQueue(newQueue);
        next();
    };

    const next = () => {
        setExitDir(null);
        setDragX(0);
        setIsFlipped(false);
        if (currentIndex < queue.length - 1) {
            setCurrentIndex(prev => prev + 1);
        } else {
            alert("Set Cleared! Moving to stats...");
            onClose();
        }
    };

    const getCardStyle = () => {
        if (exitDir) {
            return {
                transform: `translateX(${exitDir === 'RIGHT' ? '150%' : '-150%'}) rotate(${exitDir === 'RIGHT' ? '20deg' : '-20deg'})`,
                opacity: 0,
                transition: 'all 0.3s ease-out'
            };
        }
        const rotate = dragX * 0.05;
        const opacity = 1 - Math.abs(dragX) / 500;
        return {
            transform: `translateX(${dragX}px) rotate(${rotate}deg)`,
            opacity: opacity,
            transition: isDragging ? 'none' : 'all 0.3s cubic-bezier(0.2, 0.8, 0.2, 1)'
        };
    };

    const overlayColor = dragX > 0 ? 'bg-green-500' : 'bg-red-500';
    const overlayOpacity = Math.min(Math.abs(dragX) / (SWIPE_THRESHOLD * 2), 0.6);

    if (!activeCard) return null;

    return (
        <div className="fixed inset-0 z-[100] bg-[#020617] flex flex-col overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#0f172a_0%,_#000000_100%)]"></div>

            <div className="relative z-20 p-4 flex justify-between items-center">
                <button onClick={onClose} className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all">
                    <ArrowLeft size={20} />
                </button>
                <div className="flex flex-col items-center">
                    <span className="text-white font-bold text-sm">{topic.chapter}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{currentIndex + 1} / {queue.length}</span>
                </div>
                <div className="w-10"></div>
            </div>

            <div className="flex-1 relative flex items-center justify-center p-6 perspective-1000">
                {nextCard && (
                    <div className="absolute w-full max-w-md aspect-[3/4] bg-white/5 border border-white/5 rounded-3xl transform scale-95 translate-y-4 opacity-50 pointer-events-none"></div>
                )}

                <div 
                    ref={cardRef}
                    className="relative w-full max-w-md aspect-[3/4] cursor-grab active:cursor-grabbing"
                    style={getCardStyle()}
                    onMouseDown={handleStart}
                    onTouchStart={handleStart}
                    onMouseMove={handleMove}
                    onTouchMove={handleMove}
                    onMouseUp={handleEnd}
                    onTouchEnd={handleEnd}
                    onMouseLeave={handleEnd}
                    onClick={() => !isDragging && !showExplanation && setIsFlipped(!isFlipped)}
                >
                    <div className={`absolute inset-0 z-30 rounded-3xl pointer-events-none flex items-center justify-center ${overlayColor}`} style={{ opacity: overlayOpacity }}>
                        {dragX > 0 ? (
                            <div className="flex flex-col items-center text-white">
                                <CheckCircle size={64} />
                                <span className="font-bold text-2xl uppercase tracking-widest mt-2">I Know It</span>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center text-white">
                                <RotateCcw size={64} />
                                <span className="font-bold text-2xl uppercase tracking-widest mt-2">Need Revision</span>
                            </div>
                        )}
                    </div>

                    <div className={`w-full h-full transition-transform duration-500 transform-style-3d ${isFlipped ? 'rotate-y-180' : ''}`}>
                        <div className="absolute inset-0 backface-hidden bg-[#0b0f1a] border border-white/10 rounded-3xl shadow-2xl flex flex-col p-8 items-center justify-center text-center relative overflow-hidden">
                            <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent ${topic.subject === 'Physics' ? 'via-cyber-cyan' : topic.subject === 'Chemistry' ? 'via-cyber-purple' : 'via-cyber-pink'} to-transparent opacity-50`}></div>
                            <span className="absolute top-6 right-6 text-[10px] font-bold text-slate-500 uppercase tracking-widest border border-white/10 px-2 py-1 rounded">{topic.subject.substring(0,3)}</span>
                            <div className="flex-1 flex items-center justify-center w-full">
                                <h2 className="text-3xl md:text-4xl font-display font-bold text-white leading-snug drop-shadow-md">{activeCard.front}</h2>
                            </div>
                            <p className="text-slate-500 text-xs font-mono uppercase tracking-widest animate-pulse mt-auto">Tap to Flip</p>
                        </div>

                        <div className="absolute inset-0 backface-hidden bg-[#1e293b] border border-white/10 rounded-3xl shadow-2xl flex flex-col p-6 rotate-y-180 relative overflow-hidden">
                            <div className="flex-1 overflow-y-auto custom-scrollbar">
                                <h3 className="text-xl font-bold text-cyber-cyan mb-4 font-mono">{activeCard.back}</h3>
                                <div className="space-y-4 text-left">
                                    <div className="p-3 bg-white/5 rounded-xl border border-white/10">
                                        <h4 className="text-[10px] font-bold text-cyber-purple uppercase tracking-widest mb-1 flex items-center gap-1"><Info size={10}/> Explanation</h4>
                                        <p className="text-xs text-slate-200 leading-relaxed">{activeCard.explanation}</p>
                                    </div>
                                    <div className="p-3 bg-black/20 rounded-xl border border-white/5">
                                        <h4 className="text-[10px] font-bold text-cyber-yellow uppercase tracking-widest mb-1 flex items-center gap-1"><HelpCircle size={10}/> Used In</h4>
                                        <p className="text-xs text-slate-300 italic">{activeCard.example || "Standard numericals & conceptual applications."}</p>
                                    </div>
                                    {onViewShortNotes && (
                                        <button onClick={(e) => { e.stopPropagation(); onViewShortNotes(); }} className="w-full py-2 bg-cyber-cyan/10 border border-cyber-cyan/30 rounded-lg text-cyber-cyan text-[10px] font-bold uppercase tracking-widest hover:bg-cyber-cyan/20 transition-all flex items-center justify-center gap-2">
                                            <BookOpen size={12}/> Open Short Notes
                                        </button>
                                    )}
                                </div>
                            </div>
                            {showExplanation && (
                                <div className="mt-4 pt-4 border-t border-white/10">
                                    <button onClick={(e) => { e.stopPropagation(); handleContinueAfterExplanation(); }} className="w-full py-3 bg-white text-black font-bold rounded-xl uppercase tracking-widest text-xs hover:bg-slate-200 transition-colors">Got it, Next Card</button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {!showExplanation && (
                <div className="h-24 px-8 pb-8 flex items-center justify-between gap-6 z-20">
                    <button onClick={handleSwipeLeft} className="flex-1 h-14 rounded-2xl border border-red-500/30 text-red-500 font-bold uppercase tracking-widest text-xs hover:bg-red-500/10 transition-all flex items-center justify-center gap-2"><RotateCcw size={18} /> Review</button>
                    <button onClick={handleSwipeRight} className="flex-1 h-14 rounded-2xl bg-green-500 text-black font-bold uppercase tracking-widest text-xs hover:bg-green-400 transition-all flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(34,197,94,0.3)]"><CheckCircle size={18} /> I Know It</button>
                </div>
            )}
        </div>
    );
};
