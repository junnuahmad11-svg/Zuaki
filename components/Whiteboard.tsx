
import React, { useState, useEffect } from 'react';
/* Added Brain to the lucide-react imports */
import { Plus, PenTool, History, Search, FileText, ChevronRight, Clock, Star, Trash2, Brain } from 'lucide-react';
import { ViewState, Note } from '../types';
import { firebase } from '../services/backend';
import { WhiteboardEditor } from './WhiteboardEditor';

export const Whiteboard: React.FC = () => {
    const [view, setView] = useState<'LIST' | 'EDITOR'>('LIST');
    const [history, setHistory] = useState<Note[]>([]);
    const [selectedNote, setSelectedNote] = useState<Note | null>(null);
    const [search, setSearch] = useState('');

    useEffect(() => {
        loadHistory();
    }, [view]);

    const loadHistory = async () => {
        const notes = await firebase.firestore().notes.getAll();
        setHistory(notes.filter(n => n.type === 'whiteboard'));
    };

    const handleNew = () => {
        setSelectedNote(null);
        setView('EDITOR');
    };

    const handleEdit = (note: Note) => {
        setSelectedNote(note);
        setView('EDITOR');
    };

    const handleDelete = async (id: string) => {
        if (window.confirm("Delete this whiteboard permanently?")) {
            await firebase.firestore().notes.delete(id);
            loadHistory();
        }
    };

    if (view === 'EDITOR') {
        return (
            <WhiteboardEditor 
                note={selectedNote}
                onExit={() => setView('LIST')}
                onSave={() => {}} // LocalStorage handles auto-save
            />
        );
    }

    const filteredHistory = history.filter(h => h.title.toLowerCase().includes(search.toLowerCase()));

    return (
        <div className="h-full w-full bg-[#020617] flex flex-col relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_#0f172a_0%,_#020617_80%)] pointer-events-none"></div>

            {/* Header */}
            <div className="p-6 md:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 z-20">
                <div>
                    <h1 className="text-4xl font-display font-bold text-white uppercase tracking-widest flex items-center gap-4">
                        <PenTool size={40} className="text-cyber-cyan drop-shadow-[0_0_10px_rgba(0,243,255,0.5)]" />
                        Zuaki Whiteboard
                    </h1>
                    <p className="text-slate-400 text-sm font-mono mt-2 uppercase tracking-widest">Think. Draw. Solve. Crack JEE.</p>
                </div>
                
                <button 
                    onClick={handleNew}
                    className="px-8 py-4 bg-gradient-to-r from-cyber-cyan to-blue-600 text-black font-bold rounded-2xl shadow-[0_0_30px_rgba(0,243,255,0.3)] hover:shadow-[0_0_50px_rgba(0,243,255,0.5)] hover:scale-[1.02] transition-all flex items-center justify-center gap-3 uppercase tracking-widest"
                >
                    <Plus size={24} /> New Drawing
                </button>
            </div>

            {/* Search & Filter */}
            <div className="px-6 md:px-8 mb-6 z-20">
                <div className="relative max-w-xl group">
                    <Search className="absolute left-4 top-3.5 text-slate-500 group-focus-within:text-cyber-cyan transition-colors" size={20} />
                    <input 
                        type="text" 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search whiteboard history..."
                        className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-white focus:border-cyber-cyan focus:shadow-[0_0_15px_rgba(0,243,255,0.1)] outline-none transition-all font-sans"
                    />
                </div>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar px-6 md:px-8 pb-24 z-10">
                {filteredHistory.length === 0 ? (
                    <div className="h-64 border-2 border-dashed border-white/10 rounded-[30px] flex flex-col items-center justify-center text-center opacity-50">
                        <History size={48} className="text-slate-600 mb-4" />
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No recent sessions found.</p>
                        <p className="text-slate-600 text-[10px] mt-1">Start a new drawing to begin your JEE breakdown.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredHistory.map(note => (
                            <div 
                                key={note.id}
                                className="glass-panel group rounded-3xl border border-white/10 hover:border-cyber-cyan/30 transition-all hover:translate-y-[-4px] overflow-hidden flex flex-col shadow-xl"
                            >
                                {/* Thumbnail Preview */}
                                <div onClick={() => handleEdit(note)} className="aspect-video bg-[#050818] relative cursor-pointer overflow-hidden border-b border-white/5">
                                    {note.whiteboardPages?.[0]?.thumbnail ? (
                                        <img 
                                            src={note.whiteboardPages[0].thumbnail} 
                                            className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" 
                                            alt="Preview" 
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center opacity-10">
                                            <FileText size={48} />
                                        </div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f1a] to-transparent opacity-60"></div>
                                    <div className="absolute bottom-3 right-3 p-2 bg-black/60 rounded-lg text-white opacity-0 group-hover:opacity-100 transition-opacity">
                                        <ChevronRight size={20} />
                                    </div>
                                    {note.isStarred && (
                                        <div className="absolute top-3 right-3 text-cyber-yellow drop-shadow-[0_0_5px_rgba(252,238,10,0.5)]">
                                            <Star size={18} fill="currentColor" />
                                        </div>
                                    )}
                                </div>

                                {/* Meta */}
                                <div className="p-5 flex flex-col gap-3">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 onClick={() => handleEdit(note)} className="text-white font-bold text-lg leading-tight cursor-pointer hover:text-cyber-cyan transition-colors truncate w-full max-w-[200px]">{note.title}</h3>
                                            <div className="flex items-center gap-2 mt-1">
                                                <Clock size={12} className="text-slate-500" />
                                                <span className="text-[10px] text-slate-500 font-mono uppercase">
                                                    {new Date(note.updatedAt || note.createdAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        </div>
                                        <button onClick={() => handleDelete(note.id)} className="p-2 text-slate-600 hover:text-cyber-pink transition-colors">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>

                                    <div className="flex gap-2">
                                        {note.subject && (
                                            <span className="text-[9px] px-2 py-0.5 rounded-full bg-cyber-purple/10 border border-cyber-purple/20 text-cyber-purple font-bold uppercase">
                                                {note.subject}
                                            </span>
                                        )}
                                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-400 font-bold uppercase">
                                            {note.whiteboardPages?.length || 1} Pages
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* AI HUD Footer */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 md:flex hidden">
                <div className="glass-panel px-6 py-3 rounded-full border border-cyber-cyan/30 flex items-center gap-4 shadow-2xl backdrop-blur-2xl">
                     <Brain size={18} className="text-cyber-purple animate-pulse" />
                     <span className="text-xs font-bold text-slate-300">Zuaki GenZ Engine ready for real-time board analysis.</span>
                     <div className="h-4 w-px bg-white/10"></div>
                     <span className="text-[10px] text-cyber-cyan uppercase font-bold tracking-widest">Neural Link v4.1 Active</span>
                </div>
            </div>
        </div>
    );
};
