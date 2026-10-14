
import React, { useState, useEffect, useRef } from 'react';
import { Search, FileText, ArrowLeft, Upload, Check, Trash2, X, Eye, Lock, BookOpen, PenTool, Hash, ChevronRight, Share2, Download, Printer, Book, Save, Image as ImageIcon } from 'lucide-react';
import { firebase, imagekit } from '../services/backend';
import { ShortNote, FullChapterNote } from '../types';
import { JEE_SHORT_NOTES } from '../data/shortNotesData';

// Hardcoded standard JEE Chapters for consistent listing
const CHAPTER_DATA = {
    Physics: [
        'Kinematics', 'Laws of Motion', 'Work Energy Power', 'Rotational Motion', 
        'Gravitation', 'Solids & Fluids', 'Thermodynamics', 'SHM & Waves', 'Electrostatics', 
        'Current Electricity', 'Magnetism', 'EMI & AC', 'Optics', 'Modern Physics'
    ],
    Chemistry: [
        'Mole Concept', 'Atomic Structure', 'Chemical Bonding', 'States of Matter', 'Thermodynamics (Chem)',
        'Equilibrium', 'Redox', 'Solid State', 'Solutions', 'Electrochemistry', 'Chemical Kinetics',
        'Surface Chemistry', 'Periodic Table', 'Metallurgy', 'p-Block', 'd-Block', 'Coordination Compounds',
        'GOC', 'Hydrocarbons', 'Haloalkanes', 'Alcohol Phenol Ether', 'Aldehydes Ketones', 'Amines'
    ],
    Maths: [
        'Sets & Relations', 'Trigonometry', 'Quadratic Equations', 'Complex Numbers', 'Permutations & Combinations',
        'Binomial Theorem', 'Sequence & Series', 'Straight Lines', 'Circles', 'Conic Sections',
        'Functions', 'Limits', 'Continuity & Differentiability', 'Derivatives', 'Indefinite Integration',
        'Definite Integration', 'Differential Equations', 'Vectors', '3D Geometry', 'Probability', 'Calculus'
    ]
};

const SECRET_CODE = 'zuaki@54321';

export const ShortNotes: React.FC = () => {
    const [subject, setSubject] = useState<'Physics' | 'Chemistry' | 'Maths'>('Physics');
    const [search, setSearch] = useState('');
    const [isAdmin, setIsAdmin] = useState(false);
    const [notesMap, setNotesMap] = useState<Record<string, ShortNote>>({});
    const [uploadingChapter, setUploadingChapter] = useState<string | null>(null);
    const [activeViewerUrl, setActiveViewerUrl] = useState<string | null>(null);
    const [activeFullNote, setActiveFullNote] = useState<FullChapterNote | null>(null); 
    const [showDownloadMenu, setShowDownloadMenu] = useState(false);
    const [isSavingLocal, setIsSavingLocal] = useState(false);
    
    const fileInputRef = useRef<HTMLInputElement>(null);
    const noteRef = useRef<HTMLDivElement>(null);

    // Initial Load
    useEffect(() => {
        loadNotes();
    }, []);

    const loadNotes = async () => {
        const allNotes: ShortNote[] = await firebase.firestore().shortNotes.getAll();
        const mapping: Record<string, ShortNote> = {};
        allNotes.forEach(n => {
            mapping[`${n.subject}-${n.chapter}`] = n;
        });
        setNotesMap(mapping);
    };

    const handleSaveLocal = async (note: FullChapterNote) => {
        setIsSavingLocal(true);
        try {
            const savedNotes = JSON.parse(localStorage.getItem('zuaki_offline_notes') || '[]');
            const exists = savedNotes.find((n: any) => n.title === note.title && n.subject === note.subject);
            if (!exists) {
                savedNotes.push({ ...note, savedAt: Date.now() });
                localStorage.setItem('zuaki_offline_notes', JSON.stringify(savedNotes));
            }
            setTimeout(() => {
                setIsSavingLocal(false);
                alert("Notes saved for offline access.");
            }, 800);
        } catch (e) {
            setIsSavingLocal(false);
        }
    };

    const handleDownload = (format: 'pdf' | 'png') => {
        if (!activeFullNote) return;
        
        const dateStr = new Date().toISOString().split('T')[0];
        /* Using title instead of non-existent chapter property on activeFullNote */
        const fileName = `Zuaki_${activeFullNote.subject}_${(activeFullNote.title || 'Note').replace(/\s/g, '_')}_${dateStr}.${format}`;
        
        if (format === 'png' && noteRef.current) {
            alert(`Generating high-quality PNG... Check your notification for ${fileName}`);
        } else {
            alert(`Generating JEE-standard PDF... Check your Downloads > Zuaki folder for ${fileName}`);
        }
        setShowDownloadMenu(false);
    };

    const handleSecretClick = () => {
        if (isAdmin) return;
        const input = prompt("Enter Admin Code:");
        if (input === SECRET_CODE) {
            setIsAdmin(true);
            alert("Founder Mode Activated 🔓");
        }
    };

    const handleUploadClick = (chapter: string) => {
        setUploadingChapter(chapter);
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file || !uploadingChapter) return;
        e.target.value = '';
        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64 = reader.result as string;
            /* Corrected imagekit.uploadFile call to pass only base64 string */
            const url = await imagekit.uploadFile(base64);
            const newNote: ShortNote = {
                id: `sn-${Date.now()}`,
                subject: subject,
                chapter: uploadingChapter,
                fileUrl: url,
                fileType: file.type === 'application/pdf' ? 'pdf' : 'image',
                uploadedAt: Date.now()
            };
            await firebase.firestore().shortNotes.upload(newNote);
            setUploadingChapter(null);
            loadNotes();
        };
        reader.readAsDataURL(file);
    };

    const filteredChapters = CHAPTER_DATA[subject].filter(ch => 
        ch.toLowerCase().includes(search.toLowerCase())
    );

    return (
        <div className="h-full w-full bg-[#020617] flex flex-col relative overflow-hidden print:bg-white print:text-black">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_#0f172a_0%,_#020617_80%)] pointer-events-none print:hidden"></div>
            <div onClick={handleSecretClick} className="absolute top-4 right-4 w-1 h-1 rounded-full cursor-default z-50 opacity-0 hover:opacity-100 bg-white print:hidden"></div>

            <div className="p-6 border-b border-white/5 bg-[#0b0f1a]/80 backdrop-blur-xl z-20 flex flex-col gap-4 print:hidden">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-display font-bold text-white uppercase tracking-widest flex items-center gap-2">
                        <FileText size={24} className="text-cyber-cyan" /> Chapter Notes
                    </h1>
                    {isAdmin && <div className="text-[10px] bg-red-600 px-2 py-1 rounded text-white font-bold animate-pulse">ADMIN ACTIVE</div>}
                </div>
                <div className="relative">
                    <Search className="absolute left-4 top-3 text-slate-500" size={18} />
                    <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search any topic..." className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-12 pr-4 text-white text-sm focus:border-cyber-cyan outline-none transition-all" />
                </div>
                <div className="flex p-1 bg-white/5 rounded-xl border border-white/10">
                    {(['Physics', 'Chemistry', 'Maths'] as const).map(sub => (
                        <button key={sub} onClick={() => setSubject(sub)} className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wide transition-all ${subject === sub ? sub === 'Physics' ? 'bg-cyber-cyan text-black shadow-[0_0_10px_#00f3ff]' : sub === 'Chemistry' ? 'bg-cyber-purple text-white shadow-[0_0_10px_#9d00ff]' : 'bg-cyber-pink text-white shadow-[0_0_10px_#ff003c]' : 'text-slate-400 hover:text-white'}`}>{sub}</button>
                    ))}
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 z-10 print:hidden">
                <div className="max-w-3xl mx-auto space-y-3">
                    {filteredChapters.map((chapter) => {
                        const fileNote = notesMap[`${subject}-${chapter}`];
                        const generatedNote = (JEE_SHORT_NOTES as any)[subject]?.[chapter];
                        const hasContent = !!fileNote || !!generatedNote;

                        return (
                            <div key={chapter} className="glass-panel p-4 rounded-xl border border-white/5 hover:border-white/20 transition-all flex items-center justify-between group">
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg ${subject === 'Physics' ? 'bg-cyber-cyan/10 text-cyber-cyan' : subject === 'Chemistry' ? 'bg-cyber-purple/10 text-cyber-purple' : 'bg-cyber-pink/10 text-cyber-pink'}`}>{chapter.charAt(0)}</div>
                                    <div>
                                        <h3 className="text-white font-bold text-sm">{chapter}</h3>
                                        <div className="flex items-center gap-2">
                                            <span className={`text-[10px] uppercase tracking-wider ${hasContent ? 'text-green-400' : 'text-slate-500'}`}>{hasContent ? 'Available' : 'Coming Soon'}</span>
                                            {generatedNote && <span className="text-[8px] bg-cyber-cyan/20 text-cyber-cyan px-1.5 py-0.5 rounded border border-cyber-cyan/30 uppercase">Full Summary</span>}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    {generatedNote && (
                                        <button onClick={() => setActiveFullNote(generatedNote)} className="px-4 py-2 bg-white/10 text-white text-xs font-bold rounded-lg hover:bg-white/20 flex items-center gap-2">
                                            <BookOpen size={14} /> Read
                                        </button>
                                    )}
                                    {fileNote && !generatedNote && (
                                        <button onClick={() => setActiveViewerUrl(fileNote.fileUrl)} className="px-4 py-2 bg-white/10 text-white text-xs font-bold rounded-lg hover:bg-white/20 flex items-center gap-2">
                                            <Eye size={14} /> PDF
                                        </button>
                                    )}
                                    {isAdmin && (
                                        <button onClick={() => handleUploadClick(chapter)} className="p-2 bg-white/5 border border-white/10 rounded-lg hover:text-cyber-cyan hover:border-cyber-cyan transition-all" title="Upload/Replace PDF"><Upload size={16} /></button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*,application/pdf" className="hidden" />

            {activeFullNote && (
                <div className="fixed inset-0 z-[100] bg-[#020617] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200 print:bg-white print:text-black print:overflow-visible print:static">
                    <div className="h-16 px-6 border-b border-white/10 bg-[#0b0f1a]/95 backdrop-blur-md flex items-center justify-between z-20 print:hidden">
                        <div className="flex items-center gap-4">
                            <button onClick={() => setActiveFullNote(null)} className="p-2 rounded-full hover:bg-white/10 text-white">
                                <ArrowLeft size={20} />
                            </button>
                            <div>
                                <h2 className="text-white font-display font-bold text-lg tracking-wide line-clamp-1">{activeFullNote.title}</h2>
                                <span className="text-[10px] text-cyber-cyan uppercase tracking-widest">{activeFullNote.subject} Mastery Notes</span>
                            </div>
                        </div>
                        <div className="flex gap-2 relative">
                            <button 
                                onClick={() => handleSaveLocal(activeFullNote)} 
                                disabled={isSavingLocal}
                                className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${isSavingLocal ? 'bg-green-500 text-black' : 'bg-white/5 border border-white/10 text-white hover:bg-white/10'}`}
                            >
                                {isSavingLocal ? <Check size={14}/> : <Save size={14} />} Save
                            </button>
                            
                            <button 
                                onClick={() => setShowDownloadMenu(!showDownloadMenu)}
                                className="px-4 py-2 bg-cyber-cyan text-black rounded-lg text-xs font-bold flex items-center gap-2 hover:shadow-[0_0_15px_#00f3ff]"
                            >
                                <Download size={14} /> Download
                            </button>

                            {showDownloadMenu && (
                                <div className="absolute top-full right-0 mt-2 w-40 bg-[#1e293b] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50 animate-in slide-in-from-top-2">
                                    <button onClick={() => handleDownload('pdf')} className="w-full px-4 py-3 text-left text-xs text-white hover:bg-white/10 flex items-center gap-3"><FileText size={14} className="text-red-400"/> PDF Document</button>
                                    <button onClick={() => handleDownload('png')} className="w-full px-4 py-3 text-left text-xs text-white hover:bg-white/10 flex items-center gap-3"><ImageIcon size={14} className="text-blue-400"/> PNG Image</button>
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar p-4 md:p-8 bg-[#020617] flex justify-center print:bg-white print:p-0 print:overflow-visible">
                        <div ref={noteRef} className="max-w-4xl w-full space-y-8 pb-20 print:pb-0">
                            <div className="text-center border-b border-white/10 pb-6 mb-8 print:border-black/20">
                                <div className="flex justify-center mb-4 opacity-30 print:opacity-100">
                                     <h4 className="text-4xl font-display font-bold text-white print:text-black tracking-[0.4em] uppercase">ZUAKI</h4>
                                </div>
                                <h1 className="text-4xl font-display font-bold text-white mb-2 print:text-black">{activeFullNote.title}</h1>
                                <p className="text-cyber-cyan font-mono text-sm uppercase tracking-widest print:text-black">JEE High-Yield Concept Revision</p>
                            </div>

                            <div className="space-y-8">
                                {activeFullNote.sections.map((sec, i) => (
                                    <div key={i} className="prose prose-invert max-w-none print:prose">
                                        <h3 className="text-xl font-bold text-cyber-cyan mb-3 flex items-center gap-2 print:text-blue-700">
                                            <span className="w-1.5 h-6 bg-cyber-cyan rounded print:bg-blue-700"></span>
                                            {sec.heading}
                                        </h3>
                                        <p className="text-slate-300 text-sm leading-7 mb-4 text-justify print:text-gray-800">{sec.content}</p>
                                        {sec.subsections && (
                                            <div className="grid gap-4 pl-4 border-l-2 border-white/10 print:border-gray-300">
                                                {sec.subsections.map((sub, j) => (
                                                    <div key={j}>
                                                        <h4 className="text-white font-bold text-sm mb-1 print:text-black">{sub.title}</h4>
                                                        <p className="text-slate-400 text-sm print:text-gray-700">{sub.text}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="bg-[#0f172a] border border-cyber-cyan/20 rounded-xl p-6 shadow-[0_0_30px_rgba(0,243,255,0.05)] relative overflow-hidden print:bg-white print:border-2 print:border-gray-300 print:shadow-none break-inside-avoid">
                                <div className="absolute top-0 left-0 w-1 h-full bg-cyber-cyan print:bg-blue-600"></div>
                                <h3 className="text-cyber-cyan font-bold font-sans text-lg uppercase tracking-widest mb-6 flex items-center gap-2 border-b border-white/10 pb-2 print:text-blue-700 print:border-gray-200">
                                    <Hash size={18} /> Key Formulas
                                </h3>
                                <div className="grid gap-4 md:grid-cols-2">
                                    {activeFullNote.formulas.map((f, i) => (
                                        <div key={i} className="flex flex-col p-4 rounded-lg bg-black/20 border border-white/5 hover:border-cyber-cyan/30 transition-colors print:bg-gray-50 print:border-gray-200">
                                            <span className="text-slate-400 text-xs uppercase font-bold tracking-wider mb-2 print:text-gray-500">{f.name}</span>
                                            <code className="text-cyber-cyan font-mono text-sm md:text-base drop-shadow-[0_0_5px_rgba(0,243,255,0.3)] print:text-black print:drop-shadow-none">{f.eq}</code>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6 break-inside-avoid">
                                <div className="bg-[#1e1b4b] border border-indigo-500/30 rounded-xl p-6 print:bg-white print:border-gray-300">
                                    <h3 className="text-indigo-400 font-bold mb-4 flex items-center gap-2 uppercase tracking-wide print:text-indigo-800"><Book size={16} /> NCERT Focus</h3>
                                    <ul className="space-y-2">
                                        {activeFullNote.ncertPoints.map((pt, i) => (
                                            <li key={i} className="text-slate-300 text-sm flex gap-2 print:text-gray-800"><span className="text-indigo-500">•</span> {pt}</li>
                                        ))}
                                    </ul>
                                </div>
                                <div className="bg-[#3f1922] border border-pink-500/30 rounded-xl p-6 print:bg-white print:border-gray-300">
                                    <h3 className="text-pink-400 font-bold mb-4 flex items-center gap-2 uppercase tracking-wide print:text-pink-700"><PenTool size={16} /> JEE Strategy</h3>
                                    <div className="space-y-3 text-sm">
                                        <div className="flex justify-between border-b border-white/10 pb-2 print:border-gray-200"><span className="text-slate-400 print:text-gray-600">Exam Weightage</span><span className="text-white font-bold print:text-black">{activeFullNote.examInsights.weightage}</span></div>
                                        <div><span className="text-slate-400 text-xs uppercase tracking-wider block mb-1 print:text-gray-600">Common Mistakes</span><ul className="list-disc pl-4 text-slate-300 print:text-gray-800">{activeFullNote.examInsights.commonMistakes.map((m, i) => <li key={i}>{m}</li>)}</ul></div>
                                    </div>
                                </div>
                            </div>
                            <div className="text-center opacity-30 pt-8 print:opacity-100 print:mt-10">
                                <p className="text-xs text-slate-500 font-mono print:text-black">Zuaki App • Educational Archive • {activeFullNote.subject} • 2025</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
