
import React, { useState } from 'react';
import { ArrowLeft, Share2, Download, ZoomIn, ZoomOut, Bookmark, FileText, Check } from 'lucide-react';
import { FormulaChapter } from '../types';
import { firebase } from '../services/backend';

interface PDFViewerProps {
    chapter: FormulaChapter;
    onBack: () => void;
}

export const PDFViewer: React.FC<PDFViewerProps> = ({ chapter, onBack }) => {
    const [zoom, setZoom] = useState(1);
    const [downloaded, setDownloaded] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleShare = () => {
        const link = firebase.firestore().formulas.generateShareLink(chapter.id);
        navigator.clipboard.writeText(link);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleDownload = () => {
        setDownloaded(true);
        setTimeout(() => setDownloaded(false), 3000);
    };

    return (
        <div className="h-full w-full bg-[#020617] flex flex-col relative overflow-hidden">
            {/* Toolbar */}
            <div className="h-16 px-4 flex items-center justify-between border-b border-white/10 bg-black/40 backdrop-blur-md z-20">
                <div className="flex items-center gap-4">
                    <button onClick={onBack} className="p-2 rounded-full hover:bg-white/10 text-white transition-colors">
                        <ArrowLeft size={20} />
                    </button>
                    <div>
                        <h2 className="text-white font-bold text-sm line-clamp-1">{chapter.title}</h2>
                        <span className="text-[10px] text-cyber-cyan uppercase tracking-wider">{chapter.subject}</span>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <div className="hidden md:flex items-center gap-1 bg-white/5 rounded-lg p-1 border border-white/10">
                        <button onClick={() => setZoom(z => Math.max(0.5, z - 0.1))} className="p-1.5 hover:bg-white/10 rounded text-slate-300"><ZoomOut size={16}/></button>
                        <span className="text-xs font-mono w-12 text-center text-white">{Math.round(zoom * 100)}%</span>
                        <button onClick={() => setZoom(z => Math.min(2, z + 0.1))} className="p-1.5 hover:bg-white/10 rounded text-slate-300"><ZoomIn size={16}/></button>
                    </div>
                    
                    <button onClick={handleShare} className="p-2 hover:bg-white/10 rounded-lg text-cyber-purple relative group">
                        {copied ? <Check size={20} className="text-green-400"/> : <Share2 size={20} />}
                        {copied && <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 text-[10px] bg-black border border-white/20 px-2 py-1 rounded text-white whitespace-nowrap">Link Copied</span>}
                    </button>
                    
                    <button onClick={handleDownload} className={`p-2 rounded-lg transition-colors ${downloaded ? 'text-green-400' : 'text-cyber-cyan hover:bg-white/10'}`}>
                        {downloaded ? <Check size={20} /> : <Download size={20} />}
                    </button>
                </div>
            </div>

            {/* Document Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 bg-[#0b0f1a] flex justify-center">
                <div 
                    className="bg-[#1e293b] border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] transition-transform origin-top duration-200 ease-out"
                    style={{ 
                        width: '800px', 
                        minHeight: '1100px', 
                        transform: `scale(${zoom})`,
                        marginBottom: `${(zoom - 1) * 600}px` // Compensation for zoom scale layout shift
                    }}
                >
                    {/* PDF Header Simulation */}
                    <div className="h-16 border-b-2 border-cyber-cyan/30 flex items-center justify-between px-8 bg-black/20">
                        <div className="flex items-center gap-2">
                            <FileText size={20} className="text-cyber-cyan" />
                            <span className="font-display font-bold text-white tracking-widest uppercase">ZUAKI NOTES</span>
                        </div>
                        <span className="text-xs text-slate-500 font-mono">Page 1 / 1</span>
                    </div>

                    {/* PDF Body Content (Neon/Dark Mode Theme) */}
                    <div className="p-12 space-y-8">
                        <div className="text-center pb-6 border-b border-white/10">
                            <h1 className="text-4xl font-bold text-white mb-2">{chapter.title}</h1>
                            <p className="text-cyber-cyan text-sm uppercase tracking-[0.3em]">Important Formulas & Concepts</p>
                        </div>

                        {chapter.sections.length > 0 ? (
                            chapter.sections.map((sec, i) => (
                                <div key={i} className="space-y-4">
                                    <h3 className="text-xl font-bold text-cyber-purple flex items-center gap-2">
                                        <span className="w-2 h-2 bg-cyber-purple rounded-full"></span> {sec.title}
                                    </h3>
                                    <div className="grid grid-cols-1 gap-4 pl-4">
                                        {sec.content.map((formula, idx) => (
                                            <div key={idx} className="p-4 rounded-lg bg-black/40 border border-white/5 font-mono text-lg text-slate-200">
                                                {formula}
                                            </div>
                                        ))}
                                    </div>
                                    {sec.note && (
                                        <div className="p-3 bg-cyber-yellow/10 border-l-4 border-cyber-yellow text-xs text-slate-300 italic rounded-r-lg ml-4">
                                            <span className="text-cyber-yellow font-bold not-italic">Note: </span> {sec.note}
                                        </div>
                                    )}
                                </div>
                            ))
                        ) : (
                            <div className="text-center py-20 opacity-50">
                                <p className="text-white">Content generating via Zuaki AI...</p>
                                <div className="mt-4 h-2 w-32 bg-white/10 rounded-full mx-auto overflow-hidden">
                                    <div className="h-full bg-cyber-cyan w-1/2 animate-pulse"></div>
                                </div>
                            </div>
                        )}
                        
                        {/* Footer Watermark */}
                        <div className="pt-20 text-center opacity-30">
                            <p className="text-4xl font-display font-bold text-white uppercase tracking-[0.5em] rotate-[-15deg]">ZUAKI PREP</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
