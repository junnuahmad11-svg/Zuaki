
import React, { useState, useEffect } from 'react';
import { ArrowLeft, BookOpen, Atom, Zap, Calculator, Search, ChevronRight, FileText } from 'lucide-react';
import { firebase } from '../services/backend';
import { FormulaChapter } from '../types';
import { PDFViewer } from './PDFViewer';

interface FormulaVaultProps {
    onBack: () => void;
}

export const FormulaVault: React.FC<FormulaVaultProps> = ({ onBack }) => {
    const [view, setView] = useState<'SUBJECT' | 'CHAPTER' | 'PDF'>('SUBJECT');
    const [selectedSubject, setSelectedSubject] = useState<string | null>(null);
    const [selectedChapter, setSelectedChapter] = useState<FormulaChapter | null>(null);
    const [chapters, setChapters] = useState<FormulaChapter[]>([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const load = async () => {
            if (selectedSubject) {
                const data = await firebase.firestore().formulas.getChapters(selectedSubject);
                setChapters(data);
            }
        };
        load();
    }, [selectedSubject]);

    const subjects = [
        { id: 'Physics', icon: Zap, color: 'cyber-cyan' },
        { id: 'Chemistry', icon: Atom, color: 'cyber-purple' },
        { id: 'Maths', icon: Calculator, color: 'cyber-pink' }
    ];

    const filteredChapters = chapters.filter(c => c.title.toLowerCase().includes(search.toLowerCase()));

    const handleSubjectSelect = (sub: string) => {
        setSelectedSubject(sub);
        setView('CHAPTER');
    };

    const handleChapterSelect = (chapter: FormulaChapter) => {
        setSelectedChapter(chapter);
        setView('PDF');
    };

    const handleInternalBack = () => {
        if (view === 'PDF') {
            setView('CHAPTER');
            setSelectedChapter(null);
        } else if (view === 'CHAPTER') {
            setView('SUBJECT');
            setSelectedSubject(null);
        } else {
            onBack();
        }
    };

    if (view === 'PDF' && selectedChapter) {
        return <PDFViewer chapter={selectedChapter} onBack={handleInternalBack} />;
    }

    return (
        <div className="h-full w-full bg-[#020617] p-6 overflow-y-auto custom-scrollbar relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_#0f172a_0%,_#020617_80%)] pointer-events-none"></div>
            
            <div className="max-w-5xl mx-auto relative z-10">
                
                {/* Header */}
                <div className="flex items-center gap-4 mb-8">
                    <button onClick={handleInternalBack} className="p-2 rounded-full hover:bg-white/10 text-white transition-colors">
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h1 className="text-3xl font-display font-bold text-white uppercase tracking-widest flex items-center gap-2">
                            <BookOpen className="text-cyber-yellow" /> Formula Vault
                        </h1>
                        <p className="text-slate-400 text-xs font-mono">
                            {view === 'SUBJECT' ? 'Select Domain' : `${selectedSubject} Modules`}
                        </p>
                    </div>
                </div>

                {/* SUBJECT VIEW */}
                {view === 'SUBJECT' && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {subjects.map(sub => (
                            <button
                                key={sub.id}
                                onClick={() => handleSubjectSelect(sub.id)}
                                className={`glass-panel p-8 rounded-3xl border border-white/5 hover:border-${sub.color}/50 group transition-all relative overflow-hidden flex flex-col items-center text-center`}
                            >
                                <div className={`absolute inset-0 bg-${sub.color}/5 group-hover:bg-${sub.color}/10 transition-colors`}></div>
                                <div className={`w-20 h-20 rounded-2xl bg-${sub.color}/10 border border-${sub.color}/30 flex items-center justify-center text-${sub.color} mb-6 group-hover:scale-110 transition-transform shadow-[0_0_30px_rgba(0,0,0,0.2)]`}>
                                    <sub.icon size={40} />
                                </div>
                                <h2 className="text-2xl font-bold text-white mb-2">{sub.id}</h2>
                                <p className="text-slate-400 text-xs">Access all chapter-wise formulas</p>
                            </button>
                        ))}
                    </div>
                )}

                {/* CHAPTER VIEW */}
                {view === 'CHAPTER' && (
                    <>
                        <div className="relative mb-6">
                            <Search className="absolute left-4 top-3.5 text-slate-500" size={18} />
                            <input 
                                type="text" 
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder={`Search ${selectedSubject} chapters...`}
                                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-cyber-cyan outline-none transition-all"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredChapters.map(chapter => (
                                <button
                                    key={chapter.id}
                                    onClick={() => handleChapterSelect(chapter)}
                                    className="glass-panel p-5 rounded-2xl border border-white/5 hover:border-white/20 hover:bg-white/5 transition-all text-left flex items-center justify-between group"
                                >
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-lg bg-black/40 flex items-center justify-center text-cyber-cyan border border-white/10">
                                            <FileText size={20} />
                                        </div>
                                        <span className="font-bold text-white text-sm group-hover:text-cyber-cyan transition-colors">
                                            {chapter.title}
                                        </span>
                                    </div>
                                    <ChevronRight size={16} className="text-slate-500 group-hover:translate-x-1 transition-transform" />
                                </button>
                            ))}
                            {filteredChapters.length === 0 && (
                                <div className="col-span-full text-center py-10 text-slate-500">
                                    No chapters found.
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};
