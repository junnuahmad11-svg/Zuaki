
import React from 'react';
import { Clock, AlertTriangle, FileText, CheckCircle, Shield, Play } from 'lucide-react';
import { TestConfig } from '../types';

interface TestInstructionsProps {
    config: TestConfig;
    onStart: () => void;
    onCancel: () => void;
}

export const TestInstructions: React.FC<TestInstructionsProps> = ({ config, onStart, onCancel }) => {
    return (
        <div className="h-full w-full bg-[#020617] flex flex-col relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#0f172a_0%,_#020617_80%)] pointer-events-none"></div>
            
            {/* Header */}
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-[#0b0f1a] relative z-20">
                <h1 className="text-2xl font-display font-bold text-white uppercase tracking-widest">
                    <span className="text-cyber-cyan">Test</span> Protocol
                </h1>
                <button onClick={onCancel} className="text-slate-400 hover:text-white text-sm uppercase tracking-wider font-bold">Exit</button>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 md:p-12 relative z-10">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-4xl text-white font-bold mb-2">{config.title}</h2>
                    <p className="text-slate-400 mb-10 text-sm">Please read the following instructions carefully.</p>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        <div className="glass-panel p-6 rounded-2xl border border-white/10 text-center">
                            <Clock size={32} className="text-cyber-cyan mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-white">{config.duration} Mins</h3>
                            <p className="text-slate-500 text-xs mt-1">Total Duration</p>
                        </div>
                        <div className="glass-panel p-6 rounded-2xl border border-white/10 text-center">
                            <FileText size={32} className="text-cyber-purple mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-white">{config.questionCount} Questions</h3>
                            <p className="text-slate-500 text-xs mt-1">75 Qs (25 P / 25 C / 25 M)</p>
                        </div>
                        <div className="glass-panel p-6 rounded-2xl border border-white/10 text-center">
                            <Shield size={32} className="text-cyber-pink mx-auto mb-4" />
                            <h3 className="text-xl font-bold text-white">300 Marks</h3>
                            <p className="text-slate-500 text-xs mt-1">Full Syllabus</p>
                        </div>
                    </div>

                    <div className="space-y-6 mb-12">
                        <h3 className="text-white font-bold uppercase tracking-widest text-sm border-b border-white/10 pb-2">General Instructions</h3>
                        <ul className="space-y-4 text-slate-300 text-sm leading-relaxed">
                            <li className="flex gap-4">
                                <span className="bg-white/10 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0">1</span>
                                The test contains 3 parts: Physics, Chemistry, and Mathematics. Each part has 2 sections (MCQ & Numerical).
                            </li>
                            <li className="flex gap-4">
                                <span className="bg-white/10 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0">2</span>
                                <span>
                                    <strong>Marking Scheme:</strong> <span className="text-green-400">+4</span> for correct answer, <span className="text-red-400">-1</span> for incorrect answer. No negative marking for Numerical Value Questions.
                                </span>
                            </li>
                            <li className="flex gap-4">
                                <span className="bg-white/10 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0">3</span>
                                The clock will be set at the server. The countdown timer in the top right corner of screen will display the remaining time available for you to complete the examination.
                            </li>
                            <li className="flex gap-4">
                                <span className="bg-white/10 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0">4</span>
                                Click on <strong>Save & Next</strong> to save your answer. Questions marked for review will not be considered for evaluation if not answered.
                            </li>
                        </ul>
                    </div>

                    <div className="p-6 bg-cyber-yellow/5 border border-cyber-yellow/20 rounded-2xl flex gap-4 items-start mb-10">
                        <AlertTriangle className="text-cyber-yellow shrink-0" size={24} />
                        <div>
                            <h4 className="text-cyber-yellow font-bold text-sm mb-1 uppercase tracking-wide">Important Note</h4>
                            <p className="text-slate-300 text-xs">
                                Do not switch tabs or minimize the browser. The test will auto-submit if suspicious activity is detected. Ensure you have a stable internet connection.
                            </p>
                        </div>
                    </div>

                    <div className="flex justify-center">
                        <button 
                            onClick={onStart}
                            className="px-12 py-4 bg-gradient-to-r from-cyber-cyan to-blue-600 text-white font-display font-bold text-xl uppercase tracking-[0.2em] rounded-xl shadow-[0_0_40px_rgba(0,243,255,0.4)] hover:shadow-[0_0_60px_rgba(0,243,255,0.6)] hover:scale-105 transition-all flex items-center gap-3"
                        >
                            Start Examination <Play fill="currentColor" size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
