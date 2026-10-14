
import React, { useState } from 'react';
import { BookOpen, ChevronRight, Zap, Calculator, Beaker, Layers, Star, CheckCircle, Tag, ArrowLeft, Target } from 'lucide-react';
import { JEE_SYLLABUS_DATA } from '../data/jeeSyllabusData';
import { SyllabusChapter, SyllabusTopic } from '../types';

interface Props {
    onBack: () => void;
}

export const JEESyllabus: React.FC<Props> = ({ onBack }) => {
    const [selectedSubject, setSelectedSubject] = useState<'Physics' | 'Chemistry' | 'Maths'>('Physics');
    const [selectedChapter, setSelectedChapter] = useState<SyllabusChapter | null>(null);
    const [chemFilter, setChemFilter] = useState<'All' | 'Physical' | 'Inorganic' | 'Organic'>('All');

    const activeData = JEE_SYLLABUS_DATA.find(s => s.id === selectedSubject);
    
    // Filter logic for Chemistry
    const displayedChapters = activeData?.chapters.filter(ch => {
        if (selectedSubject !== 'Chemistry') return true;
        if (chemFilter === 'All') return true;
        return ch.category === chemFilter;
    });

    // --- RENDER ---

    if (selectedChapter) {
        return (
            <div className="h-full w-full bg-[#020617] flex flex-col relative overflow-hidden">
                {/* Header */}
                <div className="p-6 border-b border-white/10 bg-[#0b0f1a] relative z-20 flex items-center gap-4">
                    <button onClick={() => setSelectedChapter(null)} className="p-2 rounded-full hover:bg-white/10 text-white transition-colors">
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h2 className="text-xl font-display font-bold text-white tracking-wide">{selectedChapter.name}</h2>
                        <div className="flex items-center gap-2 mt-1">
                            <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                                selectedChapter.weightage === 'High' ? 'bg-red-500/20 text-red-400 border border-red-500/30' :
                                selectedChapter.weightage === 'Medium' ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30' :
                                'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                            }`}>
                                {selectedChapter.weightage} Weightage
                            </span>
                            <span className="text-xs text-slate-500">{selectedChapter.topics.length} Lessons</span>
                        </div>
                    </div>
                </div>

                {/* Topic List */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-4 relative z-10">
                    {selectedChapter.topics.map((topic, idx) => (
                        <div key={idx} className="glass-panel p-6 rounded-2xl border border-white/10 hover:border-white/20 transition-all group">
                            <div className="flex justify-between items-start mb-4">
                                <h3 className="text-lg font-bold text-white group-hover:text-cyber-cyan transition-colors">{topic.name}</h3>
                                <div className="flex gap-2">
                                    {topic.tags.map((tag, tIdx) => (
                                        <span key={tIdx} className="text-[10px] px-2 py-1 rounded bg-white/5 border border-white/10 text-slate-400 font-mono">
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <p className="text-sm text-slate-300 leading-relaxed mb-6 border-l-2 border-white/20 pl-4">
                                {topic.concept}
                            </p>

                            <div className="bg-black/40 rounded-xl p-4 border border-white/5">
                                <h4 className="text-xs font-bold text-cyber-purple uppercase tracking-widest mb-3 flex items-center gap-2">
                                    <Target size={14} /> Exam Pattern Analysis
                                </h4>
                                <ul className="space-y-2">
                                    {topic.examPatterns.map((pt, pIdx) => (
                                        <li key={pIdx} className="flex gap-3 text-xs text-slate-400">
                                            <div className="w-1.5 h-1.5 rounded-full bg-cyber-purple/50 mt-1.5 shrink-0"></div>
                                            {pt}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    return (
        <div className="h-full w-full bg-[#020617] flex flex-col relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_#0f172a_0%,_#020617_80%)] pointer-events-none"></div>

            {/* Main Header */}
            <div className="p-6 border-b border-white/10 bg-[#0b0f1a] relative z-20">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-display font-bold text-white uppercase tracking-widest flex items-center gap-3">
                        <Layers size={32} className="text-cyber-cyan" /> JEE Syllabus
                    </h1>
                    {/* Back button for desktop/mobile consistency if navigated via other means */}
                    <button onClick={onBack} className="text-slate-500 hover:text-white text-xs font-bold uppercase tracking-widest">
                        Exit
                    </button>
                </div>

                {/* Subject Tabs */}
                <div className="flex p-1 bg-white/5 rounded-xl border border-white/10">
                    <button 
                        onClick={() => setSelectedSubject('Physics')}
                        className={`flex-1 py-3 rounded-lg text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${selectedSubject === 'Physics' ? 'bg-cyber-cyan text-black shadow-[0_0_15px_#00f3ff]' : 'text-slate-400 hover:text-white'}`}
                    >
                        <Zap size={16} /> Physics
                    </button>
                    <button 
                        onClick={() => { setSelectedSubject('Chemistry'); setChemFilter('All'); }}
                        className={`flex-1 py-3 rounded-lg text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${selectedSubject === 'Chemistry' ? 'bg-cyber-purple text-white shadow-[0_0_15px_#9d00ff]' : 'text-slate-400 hover:text-white'}`}
                    >
                        <Beaker size={16} /> Chemistry
                    </button>
                    <button 
                        onClick={() => setSelectedSubject('Maths')}
                        className={`flex-1 py-3 rounded-lg text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${selectedSubject === 'Maths' ? 'bg-cyber-pink text-white shadow-[0_0_15px_#ff003c]' : 'text-slate-400 hover:text-white'}`}
                    >
                        <Calculator size={16} /> Maths
                    </button>
                </div>

                {/* Chemistry Filter Sub-bar */}
                {selectedSubject === 'Chemistry' && (
                    <div className="flex gap-2 mt-4 overflow-x-auto no-scrollbar pb-1">
                        {['All', 'Physical', 'Inorganic', 'Organic'].map(cat => (
                            <button
                                key={cat}
                                onClick={() => setChemFilter(cat as any)}
                                className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wide border transition-all ${
                                    chemFilter === cat 
                                    ? 'bg-white text-black border-white' 
                                    : 'bg-transparent text-slate-500 border-white/10 hover:border-white/30'
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {/* Chapter Grid */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {displayedChapters?.map(chapter => (
                        <div 
                            key={chapter.id}
                            onClick={() => setSelectedChapter(chapter)}
                            className="glass-panel p-5 rounded-2xl border border-white/5 hover:border-white/20 hover:bg-white/5 transition-all cursor-pointer group relative overflow-hidden"
                        >
                            <div className="flex justify-between items-start mb-2">
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${
                                    chapter.weightage === 'High' ? 'text-red-400 border-red-500/30 bg-red-500/10' :
                                    chapter.weightage === 'Medium' ? 'text-yellow-400 border-yellow-500/30 bg-yellow-500/10' :
                                    'text-blue-400 border-blue-500/30 bg-blue-500/10'
                                }`}>
                                    {chapter.weightage}
                                </span>
                                {chapter.status === 'AVAILABLE' && <CheckCircle size={14} className="text-green-500" />}
                            </div>
                            
                            <h3 className="text-white font-bold text-lg mb-1 group-hover:text-cyber-cyan transition-colors line-clamp-1">
                                {chapter.name}
                            </h3>
                            
                            <div className="flex items-center gap-2 text-xs text-slate-500 mt-2">
                                <BookOpen size={12} /> {chapter.topics.length} Lessons
                                {chapter.category && (
                                    <>
                                        <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
                                        <span>{chapter.category}</span>
                                    </>
                                )}
                            </div>

                            <ChevronRight size={20} className="absolute bottom-5 right-5 text-slate-600 group-hover:text-white group-hover:translate-x-1 transition-all" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};