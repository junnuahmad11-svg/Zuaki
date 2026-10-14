
import React, { useState } from 'react';
import { FileText, Calendar, Download, ArrowLeft, Zap, Trophy, ShieldCheck, Printer, FileDown, CheckCircle, ChevronRight, Lock } from 'lucide-react';
import { firebase } from '../services/backend';
import { ViewState, TestConfig } from '../types';
import { TestInterface } from './TestInterface';
import { TestInstructions } from './TestInstructions';
import { TestResultFull } from './TestResultFull';

type SelectionStep = 'YEAR' | 'SESSION' | 'SHIFT' | 'MODE';

export const PYQPapers: React.FC = () => {
    const [step, setStep] = useState<SelectionStep>('YEAR');
    const [selection, setSelection] = useState({ year: 2025, session: '', shift: '' });
    const [activeTest, setActiveTest] = useState<TestConfig | null>(null);
    const [view, setView] = useState<'SELECTION' | 'INSTRUCTIONS' | 'INTERFACE' | 'RESULT' | 'PDF_VIEW'>('SELECTION');
    const [testResult, setTestResult] = useState<any>(null);

    const years = [2025, 2024, 2023, 2022, 2021, 2020];
    const sessions = ["January", "April"];
    const shifts = ["Shift 1", "Shift 2"];

    const handleBack = () => {
        if (step === 'YEAR') return; 
        if (step === 'SESSION') setStep('YEAR');
        if (step === 'SHIFT') setStep('SESSION');
        if (step === 'MODE') setStep('SHIFT');
    };

    const handleSelectYear = (y: number) => { setSelection({...selection, year: y}); setStep('SESSION'); };
    const handleSelectSession = (s: string) => { setSelection({...selection, session: s}); setStep('SHIFT'); };
    const handleSelectShift = (sh: string) => { setSelection({...selection, shift: sh}); setStep('MODE'); };

    const initializeAction = async (mode: 'ATTEMPT' | 'PDF' | 'VIEW') => {
        const config = await firebase.firestore().pyq.generatePaper(selection.year, selection.session, selection.shift);
        setActiveTest(config);
        
        if (mode === 'ATTEMPT') {
            setView('INSTRUCTIONS');
        } else if (mode === 'VIEW') {
            setView('PDF_VIEW');
        } else {
            generateAndDownloadPDF(config);
        }
    };

    const generateAndDownloadPDF = (config: TestConfig) => {
        const printWindow = window.open('', '_blank');
        if (!printWindow) return alert("Please allow pop-ups to download PDF.");
        
        const content = `
            <html>
                <head>
                    <title>Zuaki_JEE_PYQ_${config.year}_${config.shift}</title>
                    <style>
                        body { font-family: 'Inter', sans-serif; padding: 50px; color: #333; line-height: 1.6; }
                        .cover { text-align: center; border-bottom: 3px solid #000; padding-bottom: 50px; margin-bottom: 50px; }
                        .branding { color: #00f3ff; font-weight: bold; letter-spacing: 5px; font-size: 40px; }
                        .credits { font-size: 14px; margin-top: 10px; color: #666; }
                        .q-block { margin-bottom: 40px; page-break-inside: avoid; border-bottom: 1px solid #eee; padding-bottom: 20px; }
                        .q-meta { font-weight: 800; color: #555; font-size: 13px; text-transform: uppercase; margin-bottom: 10px; }
                        .options { display: grid; grid-template-cols: 1fr 1fr; gap: 15px; margin-top: 15px; }
                        .option { border: 1px solid #ddd; padding: 10px; border-radius: 5px; font-size: 14px; }
                        .footer { text-align: center; font-size: 10px; margin-top: 50px; opacity: 0.5; }
                        @media print { .no-print { display: none; } }
                    </style>
                </head>
                <body>
                    <div class="cover">
                        <div class="branding">ZUAKI</div>
                        <h1>JEE MAIN PYQ ARCHIVE: ${config.year}</h1>
                        <p>${config.session} Session • ${config.shift === 1 ? 'Morning' : 'Evening'} Shift</p>
                        <div class="credits">Curated by ZUAKI – From Zubair & Akhil</div>
                    </div>
                    ${config.questions.map((q, i) => `
                        <div class="q-block">
                            <div class="q-meta">Q.${i+1} (${config.year} – ${config.session} – Shift ${config.shift}) • ${q.subject}</div>
                            <div class="q-text">${q.text}</div>
                            ${q.type === 'MCQ' ? `
                                <div class="options">
                                    ${q.options?.map((opt, idx) => `<div class="option">(${String.fromCharCode(65+idx)}) ${opt}</div>`).join('')}
                                </div>
                            ` : '<div style="margin-top:15px;"><b>Numerical Answer Type</b></div>'}
                        </div>
                    `).join('')}
                    <div class="footer">ZUAKI Verified Archive • Strictly For Educational Use</div>
                </body>
            </html>
        `;
        printWindow.document.write(content);
        printWindow.document.close();
        setTimeout(() => printWindow.print(), 500);
    };

    const handleComplete = async (res: any) => {
        const { xp, percentile, rankRange } = firebase.firestore().pyq.calculateRankAndXP(res, selection.year);
        const finalResult = { ...res, xpEarned: xp, percentile, rankRange, testType: 'PYQ' };
        await firebase.firestore().pyq.saveResult(finalResult);
        setTestResult(finalResult);
        setView('RESULT');
    };

    if (view === 'INSTRUCTIONS' && activeTest) return <TestInstructions config={activeTest} onStart={() => setView('INTERFACE')} onCancel={() => setView('SELECTION')} />;
    if (view === 'INTERFACE' && activeTest) return <TestInterface config={activeTest} onComplete={handleComplete} onExit={() => setView('SELECTION')} />;
    if (view === 'RESULT' && testResult) return <TestResultFull result={testResult} onExit={() => setView('SELECTION')} />;
    
    if (view === 'PDF_VIEW' && activeTest) {
        return (
            <div className="h-full w-full bg-[#020617] flex flex-col">
                <div className="h-16 px-6 border-b border-white/10 bg-[#0b0f1a] flex justify-between items-center z-20">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setView('SELECTION')} className="p-2 rounded-full hover:bg-white/10 text-white transition-colors"><ArrowLeft size={20}/></button>
                        <h2 className="text-white font-bold text-sm">Reviewing: {activeTest.title}</h2>
                    </div>
                    <button onClick={() => generateAndDownloadPDF(activeTest)} className="px-4 py-2 bg-cyber-cyan text-black rounded-lg font-bold text-xs flex items-center gap-2">
                        <Download size={14} /> Download PDF
                    </button>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                    <div className="max-w-3xl mx-auto space-y-6 pb-20">
                        {activeTest.questions.map((q, i) => (
                            <div key={q.id} className="glass-panel p-6 rounded-3xl border border-white/5 space-y-4">
                                <div className="flex justify-between items-center text-[10px] uppercase font-bold text-slate-500">
                                    <span>Q.{i+1} • {q.subject}</span>
                                    <span className="text-cyber-cyan">{q.chapter}</span>
                                </div>
                                <p className="text-white leading-relaxed">{q.text}</p>
                                {q.type === 'MCQ' && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {q.options?.map((opt, idx) => (
                                            <div key={idx} className="p-3 bg-white/5 border border-white/10 rounded-xl text-xs text-slate-300">
                                                ({String.fromCharCode(65+idx)}) {opt}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full w-full bg-[#020617] flex flex-col relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_#0f172a_0%,_#020617_80%)] pointer-events-none"></div>
            
            <div className="p-6 border-b border-white/10 bg-[#0b0f1a]/80 backdrop-blur-xl z-20 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    {step !== 'YEAR' && <button onClick={handleBack} className="p-2 rounded-full hover:bg-white/10 text-white"><ArrowLeft size={20}/></button>}
                    <div>
                        <h1 className="text-3xl font-display font-bold text-white uppercase tracking-widest flex items-center gap-3">
                            <FileText size={32} className="text-cyber-yellow" /> PYQ Archives
                        </h1>
                        <p className="text-slate-400 text-xs font-mono uppercase">Selection Protocol: {step}</p>
                    </div>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 z-10 flex items-center justify-center">
                <div className="max-w-2xl w-full grid grid-cols-1 gap-6">
                    
                    {step === 'YEAR' && (
                        <div className="animate-in fade-in zoom-in-95 duration-300">
                            <h2 className="text-center text-white font-bold uppercase tracking-[0.2em] mb-8">Target Examination Year</h2>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {years.map(y => (
                                    <button key={y} onClick={() => handleSelectYear(y)} className="glass-panel p-8 rounded-2xl border border-white/10 hover:border-cyber-cyan/50 hover:bg-cyber-cyan/5 transition-all group">
                                        <Calendar size={24} className="mx-auto mb-4 text-slate-500 group-hover:text-cyber-cyan" />
                                        <span className="text-2xl font-display font-bold text-white group-hover:text-cyber-cyan">{y}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 'SESSION' && (
                        <div className="animate-in slide-in-from-right-4 duration-300">
                            <h2 className="text-center text-white font-bold uppercase tracking-[0.2em] mb-8">Select Exam Session</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {sessions.map(s => (
                                    <button key={s} onClick={() => handleSelectSession(s)} className="glass-panel p-8 rounded-2xl border border-white/10 hover:border-cyber-purple/50 hover:bg-cyber-purple/5 transition-all group flex flex-col items-center">
                                        <Zap size={32} className="mb-4 text-slate-500 group-hover:text-cyber-purple" />
                                        <span className="text-2xl font-display font-bold text-white group-hover:text-cyber-purple">{s}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 'SHIFT' && (
                        <div className="animate-in slide-in-from-right-4 duration-300">
                            <h2 className="text-center text-white font-bold uppercase tracking-[0.2em] mb-8">Select Shift Slot</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {shifts.map(sh => (
                                    <button key={sh} onClick={() => handleSelectShift(sh)} className="glass-panel p-8 rounded-2xl border border-white/10 hover:border-cyber-pink/50 hover:bg-cyber-pink/5 transition-all group flex flex-col items-center">
                                        <ShieldCheck size={32} className="mb-4 text-slate-500 group-hover:text-cyber-pink" />
                                        <span className="text-2xl font-display font-bold text-white group-hover:text-cyber-pink">{sh}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {step === 'MODE' && (
                        <div className="space-y-8 animate-in zoom-in-95 duration-300">
                            <div className="text-center">
                                <h2 className="text-white font-bold uppercase tracking-[0.2em] mb-2">Protocol Ready</h2>
                                <p className="text-slate-400 font-mono text-sm">{selection.year} • {selection.session} • {selection.shift}</p>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <button onClick={() => initializeAction('VIEW')} className="glass-panel p-6 rounded-[28px] border border-cyber-cyan/30 hover:bg-cyber-cyan/10 transition-all group flex flex-col items-center text-center">
                                    <Printer size={32} className="text-cyber-cyan mb-4 group-hover:scale-110" />
                                    <h3 className="text-white font-bold mb-1">View Only</h3>
                                    <p className="text-[10px] text-slate-500">Quick scroll through archive.</p>
                                </button>

                                <button onClick={() => initializeAction('ATTEMPT')} className="glass-panel p-6 rounded-[28px] border border-green-500/30 hover:bg-green-500/10 transition-all group flex flex-col items-center text-center">
                                    <Trophy size={32} className="text-green-500 mb-4 group-hover:scale-110" />
                                    <h3 className="text-white font-bold mb-1">Attempt Test</h3>
                                    <p className="text-[10px] text-slate-500">Unlock Rank & XP analysis.</p>
                                </button>
                                
                                <button onClick={() => initializeAction('PDF')} className="glass-panel p-6 rounded-[28px] border border-cyber-purple/30 hover:bg-cyber-purple/10 transition-all group flex flex-col items-center text-center">
                                    <FileDown size={32} className="text-cyber-purple mb-4 group-hover:scale-110" />
                                    <h3 className="text-white font-bold mb-1">Download</h3>
                                    <p className="text-[10px] text-slate-500">Offline-ready ZUAKI PDF.</p>
                                </button>
                            </div>
                        </div>
                    )}

                </div>
            </div>
            
            <div className="p-4 bg-black/40 border-t border-white/5 z-20">
                <p className="text-center text-[10px] text-slate-500 uppercase tracking-widest">Verified NTA Question Data Flow • No Placeholder Content</p>
            </div>
        </div>
    );
};
