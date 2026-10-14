
import React, { useState, useEffect, useRef } from 'react';
import { 
    Search, Plus, Grid, List, Pin, Archive, Trash2, Edit3, Image as ImageIcon, 
    Mic, CheckSquare, Palette, Share2, MoreVertical, X, Star, Download,
    PenTool, Clock, Tag, Check, Layout
} from 'lucide-react';
import { Note, NoteColor } from '../types';
import { firebase } from '../services/backend';
import { WhiteboardEditor } from './WhiteboardEditor';
import { ZurakiBackButton } from './ZurakiBackButton';

const COLORS: Record<NoteColor, string> = {
    default: 'border-white/10 shadow-none',
    red: 'border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.2)] bg-red-900/10',
    orange: 'border-orange-500/50 shadow-[0_0_15px_rgba(249,115,22,0.2)] bg-orange-900/10',
    yellow: 'border-yellow-400/50 shadow-[0_0_15px_rgba(250,204,21,0.2)] bg-yellow-900/10',
    green: 'border-green-500/50 shadow-[0_0_15px_rgba(34,197,94,0.2)] bg-green-900/10',
    blue: 'border-blue-500/50 shadow-[0_0_15px_rgba(59,130,246,0.2)] bg-blue-900/10',
    purple: 'border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.2)] bg-purple-900/10',
};

interface StrengthNotesProps {
    onBack?: () => void;
    onDirty?: (dirty: boolean) => void;
}

export const StrengthNotes: React.FC<StrengthNotesProps> = ({ onBack, onDirty }) => {
    const [notes, setNotes] = useState<Note[]>([]);
    const [search, setSearch] = useState('');
    const [selectedNote, setSelectedNote] = useState<Note | null>(null);
    const [openWhiteboard, setOpenWhiteboard] = useState<Note | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [view, setView] = useState<'GRID' | 'LIST'>('GRID');
    
    useEffect(() => {
        loadNotes();
    }, []);

    const loadNotes = async () => {
        const data = await firebase.firestore().notes.getAll();
        setNotes(data);
    };

    const filteredNotes = notes.filter(n => 
        !n.isArchived && (
            n.title.toLowerCase().includes(search.toLowerCase()) || 
            n.content.toLowerCase().includes(search.toLowerCase()) ||
            n.checklist?.some(i => i.text.toLowerCase().includes(search.toLowerCase()))
        )
    );

    const pinnedNotes = filteredNotes.filter(n => n.isPinned);
    const otherNotes = filteredNotes.filter(n => !n.isPinned);

    const handleCreateNote = () => {
        const newNote: Note = {
            id: Date.now().toString(),
            title: '',
            content: '',
            type: 'text',
            color: 'default',
            labels: [],
            isPinned: false,
            isArchived: false,
            isStarred: false,
            createdAt: Date.now()
        };
        setSelectedNote(newNote);
    };

    const handleCreateWhiteboard = () => {
        setOpenWhiteboard({
            id: Date.now().toString(),
            title: 'New Whiteboard',
            content: '',
            type: 'whiteboard',
            color: 'default',
            labels: ['Whiteboard'],
            isPinned: false,
            isArchived: false,
            isStarred: false,
            createdAt: Date.now(),
            whiteboardPages: [{ id: 'p1', strokes: [] }]
        });
    };

    const handleSaveNote = async (note: Note) => {
        if (!note.title.trim() && !note.content.trim() && (!note.checklist || note.checklist.length === 0) && note.type !== 'whiteboard') {
            if (notes.find(n => n.id === note.id)) await firebase.firestore().notes.delete(note.id);
        } else {
            await firebase.firestore().notes.save(note);
        }
        setSelectedNote(null);
        setOpenWhiteboard(null);
        if (onDirty) onDirty(false);
        loadNotes();
    };

    const handlePin = async (e: React.MouseEvent, note: Note) => {
        e.stopPropagation();
        const updated = { ...note, isPinned: !note.isPinned };
        await firebase.firestore().notes.save(updated);
        loadNotes();
    };

    const handleStar = async (e: React.MouseEvent, note: Note) => {
        e.stopPropagation();
        const updated = { ...note, isStarred: !note.isStarred };
        await firebase.firestore().notes.save(updated);
        loadNotes();
    };

    if (openWhiteboard) {
        return (
            <WhiteboardEditor 
                note={openWhiteboard}
                onSave={handleSaveNote}
                onExit={() => { setOpenWhiteboard(null); loadNotes(); if(onDirty) onDirty(false); }}
                onDirty={onDirty}
            />
        );
    }

    return (
        <div className="h-full w-full bg-[#020617] flex flex-col relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_#0f172a_0%,_#020617_80%)] pointer-events-none"></div>

            <div className="p-4 md:p-6 z-10 flex items-center gap-4 bg-[#020617]/80 backdrop-blur-md border-b border-white/5">
                {onBack && <ZurakiBackButton onClick={onBack} />}
                
                <div className="flex-1 max-w-2xl mx-auto relative group">
                    <Search className="absolute left-4 top-3 text-slate-500 group-focus-within:text-cyber-cyan transition-colors" size={20} />
                    <input 
                        type="text" 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search notes & whiteboards..."
                        className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-cyber-cyan focus:shadow-[0_0_15px_rgba(0,243,255,0.1)] outline-none transition-all"
                    />
                </div>

                <div className="flex gap-2">
                    <button onClick={() => setView(view === 'GRID' ? 'LIST' : 'GRID')} className="p-3 bg-white/5 rounded-xl text-slate-400 hover:text-white transition-all">
                        {view === 'GRID' ? <List size={20} /> : <Grid size={20} />}
                    </button>
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-cyber-cyan to-blue-600 p-0.5">
                        <img src="https://ui-avatars.com/api/?name=User" className="w-full h-full rounded-full object-cover border-2 border-[#020617]" alt="User" />
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-6 z-10">
                <div className="max-w-5xl mx-auto">
                    <div className="mb-10 max-w-2xl mx-auto grid grid-cols-4 gap-3">
                        <button 
                            onClick={() => { setIsCreating(true); handleCreateNote(); }}
                            className="col-span-3 flex items-center gap-4 p-4 bg-white/5 border border-white/10 rounded-xl cursor-pointer hover:border-white/30 transition-all shadow-lg group"
                        >
                            <Plus size={24} className="text-slate-400 group-hover:text-white" />
                            <span className="text-slate-400 font-bold group-hover:text-white">Take a text note...</span>
                        </button>
                        <button 
                            onClick={handleCreateWhiteboard}
                            className="col-span-1 flex flex-col items-center justify-center bg-cyber-purple/10 border border-cyber-purple/30 rounded-xl cursor-pointer hover:bg-cyber-purple/20 transition-all shadow-[0_0_15px_rgba(157,0,255,0.1)] group"
                        >
                            <PenTool size={20} className="text-cyber-purple mb-1 group-hover:scale-110 transition-transform" />
                            <span className="text-[10px] text-cyber-purple font-bold uppercase tracking-wide">Whiteboard</span>
                        </button>
                    </div>

                    {pinnedNotes.length > 0 && (
                        <div className="mb-8">
                            <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 pl-2">Pinned</h3>
                            <div className={`grid gap-4 ${view === 'GRID' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                                {pinnedNotes.map(note => (
                                    <NoteCard key={note.id} note={note} onClick={() => note.type === 'whiteboard' ? setOpenWhiteboard(note) : setSelectedNote(note)} onPin={handlePin} onStar={handleStar} />
                                ))}
                            </div>
                        </div>
                    )}

                    {otherNotes.length > 0 && (
                        <div>
                            {pinnedNotes.length > 0 && <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 pl-2">Others</h3>}
                            <div className={`grid gap-4 ${view === 'GRID' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                                {otherNotes.map(note => (
                                    <NoteCard key={note.id} note={note} onClick={() => note.type === 'whiteboard' ? setOpenWhiteboard(note) : setSelectedNote(note)} onPin={handlePin} onStar={handleStar} />
                                ))}
                            </div>
                        </div>
                    )}

                    {notes.length === 0 && !isCreating && (
                        <div className="text-center py-20 opacity-50">
                            <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                                <Archive size={48} className="text-slate-500" />
                            </div>
                            <p className="text-slate-400">Your strength notes appear here.</p>
                        </div>
                    )}
                </div>
            </div>

            {selectedNote && (
                <NoteEditor 
                    note={selectedNote} 
                    onClose={() => handleSaveNote(selectedNote)} 
                    onChange={(updated) => { setSelectedNote(updated); if(onDirty) onDirty(true); }}
                    onDelete={async () => {
                        await firebase.firestore().notes.delete(selectedNote.id);
                        setSelectedNote(null);
                        setIsCreating(false);
                        if(onDirty) onDirty(false);
                        loadNotes();
                    }}
                />
            )}
        </div>
    );
};

const NoteCard: React.FC<{ note: Note, onClick: () => void, onPin: (e: any, n: Note) => void, onStar: (e: any, n: Note) => void }> = ({ note, onClick, onPin, onStar }) => {
    const isWhiteboard = note.type === 'whiteboard';
    const thumbnail = isWhiteboard && note.whiteboardPages?.[0]?.thumbnail;
    return (
        <div onClick={onClick} className={`group relative p-5 rounded-2xl border bg-black/40 backdrop-blur-sm cursor-pointer transition-all hover:scale-[1.02] flex flex-col gap-3 overflow-hidden ${isWhiteboard ? 'border-cyber-purple/40 shadow-[0_0_10px_rgba(157,0,255,0.1)]' : COLORS[note.color]} ${note.isPinned ? 'ring-1 ring-white/20' : ''}`}>
            {thumbnail && (
                <div className="absolute inset-0 opacity-20 pointer-events-none">
                    <img src={thumbnail} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all" alt="WB" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent"></div>
                </div>
            )}
            <div className="flex justify-between items-start relative z-10">
                <div className="flex items-center gap-2">
                    {isWhiteboard && <PenTool size={14} className="text-cyber-purple" />}
                    <h4 className="text-white font-bold text-lg line-clamp-2">{note.title || 'Untitled'}</h4>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={(e) => onStar(e, note)} className={`p-1.5 rounded-full hover:bg-white/10 ${note.isStarred ? 'text-cyber-yellow' : 'text-slate-400'}`}><Star size={16} fill={note.isStarred ? "currentColor" : "none"} /></button>
                    <button onClick={(e) => onPin(e, note)} className={`p-1.5 rounded-full hover:bg-white/10 ${note.isPinned ? 'text-cyber-cyan' : 'text-slate-400'}`}><Pin size={16} fill={note.isPinned ? "currentColor" : "none"} /></button>
                </div>
            </div>
            <div className="text-slate-300 text-sm line-clamp-6 font-sans relative z-10 min-h-[40px]">
                {isWhiteboard ? (
                    <div className="flex flex-col gap-1 mt-2">
                        <div className="text-xs text-slate-500 font-mono">{note.whiteboardPages?.length || 1} Page(s) • Last edited {new Date(note.updatedAt || Date.now()).toLocaleDateString()}</div>
                    </div>
                ) : (
                    note.type === 'list' ? (
                        <div className="space-y-1">
                            {note.checklist?.slice(0, 4).map((item, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <div className={`w-3 h-3 border rounded-sm ${item.checked ? 'bg-slate-500 border-slate-500' : 'border-slate-500'}`}></div>
                                    <span className={item.checked ? 'line-through text-slate-500' : ''}>{item.text}</span>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="whitespace-pre-wrap">{note.content}</p>
                    )
                )}
            </div>
        </div>
    );
};

const NoteEditor: React.FC<{ note: Note, onClose: () => void, onChange: (n: Note) => void, onDelete: () => void }> = ({ note, onClose, onChange, onDelete }) => {
    const [showColors, setShowColors] = useState(false);
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const handleContentChange = (val: string) => {
        onChange({ ...note, content: val });
        if (textareaRef.current) {
            textareaRef.current.style.height = "auto";
            textareaRef.current.style.height = textareaRef.current.scrollHeight + "px";
        }
    };
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className={`w-full max-w-2xl max-h-[85vh] flex flex-col rounded-3xl border bg-[#0b0f1a] relative shadow-2xl transition-all duration-300 ${COLORS[note.color]}`}>
                <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                    <input type="text" value={note.title} onChange={(e) => onChange({ ...note, title: e.target.value })} placeholder="Title" className="w-full bg-transparent text-xl font-bold text-white placeholder-slate-500 outline-none mb-4" />
                    <textarea ref={textareaRef} value={note.content} onChange={(e) => handleContentChange(e.target.value)} placeholder="Take a note..." className="w-full bg-transparent text-slate-200 text-sm leading-relaxed outline-none resize-none min-h-[200px]" />
                </div>
                <div className="p-4 border-t border-white/5 flex items-center justify-between bg-black/40 relative">
                    <div className="flex items-center gap-1 md:gap-2">
                        <button onClick={() => setShowColors(!showColors)} className="p-2 hover:bg-white/10 rounded-full text-slate-400 hover:text-white"><Palette size={18} /></button>
                        <button onClick={() => onChange({ ...note, isArchived: !note.isArchived })} className={`p-2 hover:bg-white/10 rounded-full ${note.isArchived ? 'text-cyber-purple' : 'text-slate-400 hover:text-white'}`}><Archive size={18} /></button>
                    </div>
                    <div className="flex items-center gap-4">
                        <button onClick={onDelete} className="p-2 hover:bg-red-500/20 text-slate-400 hover:text-red-500 rounded-full transition-colors"><Trash2 size={18} /></button>
                        <button onClick={onClose} className="px-6 py-2 bg-white text-black font-bold rounded-lg hover:bg-slate-200 transition-colors">Close</button>
                    </div>
                    {showColors && (
                        <div className="absolute bottom-16 left-4 p-3 bg-[#1e1e2e] border border-white/10 rounded-xl shadow-xl flex gap-2 animate-in slide-in-from-bottom-2">
                            {Object.keys(COLORS).map((c) => (
                                <button key={c} onClick={() => { onChange({ ...note, color: c as NoteColor }); setShowColors(false); }} className={`w-6 h-6 rounded-full border border-white/20 hover:scale-110 transition-transform`} style={{ backgroundColor: c === 'default' ? 'transparent' : c }} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
