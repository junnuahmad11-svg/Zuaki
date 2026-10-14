
import React, { useState } from 'react';
import { Zap, BookOpen, ArrowLeft, User, GraduationCap, MapPin, Target, Quote, ChevronRight, Share2 } from 'lucide-react';
import { MOTIVATIONAL_STORIES } from '../data/motivationalStories';
import { MotivationalStory } from '../types';

export const MotivationalZone: React.FC = () => {
    const [selectedStory, setSelectedStory] = useState<MotivationalStory | null>(null);

    const handleShare = (story: MotivationalStory) => {
        if (navigator.share) {
            navigator.share({
                title: `Success Story: ${story.name}`,
                text: `${story.hook} Read more on Zuaki!`,
                url: window.location.href,
            }).catch(() => {});
        }
    };

    if (selectedStory) {
        return (
            <div className="h-full w-full bg-[#020617] flex flex-col relative overflow-hidden animate-in fade-in duration-300">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_#0f172a_0%,_#020617_80%)] pointer-events-none"></div>

                {/* Header */}
                <div className="h-16 px-4 flex items-center justify-between border-b border-white/5 bg-black/40 backdrop-blur-xl relative z-20">
                    <button 
                        onClick={() => setSelectedStory(null)} 
                        className="p-2 rounded-full hover:bg-white/10 text-white transition-all flex items-center gap-2"
                    >
                        <ArrowLeft size={20} />
                        <span className="text-xs font-bold uppercase tracking-widest hidden sm:inline">Back to Stories</span>
                    </button>
                    <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-cyber-yellow uppercase tracking-widest px-3 py-1 bg-cyber-yellow/10 rounded-full border border-cyber-yellow/20">
                            Real Story
                        </span>
                    </div>
                    <button onClick={() => handleShare(selectedStory)} className="p-2 text-slate-400 hover:text-white">
                        <Share2 size={20} />
                    </button>
                </div>

                {/* Full Story Content */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-6 relative z-10 pb-20">
                    <div className="max-w-3xl mx-auto space-y-10">
                        
                        {/* Profile Header */}
                        <div className="flex flex-col md:flex-row items-center gap-8 text-center md:text-left border-b border-white/5 pb-10">
                            <div className="w-32 h-32 rounded-[40px] overflow-hidden border-2 border-cyber-cyan shadow-[0_0_20px_rgba(0,243,255,0.3)]">
                                <img src={selectedStory.photo} className="w-full h-full object-cover" alt={selectedStory.name} />
                            </div>
                            <div className="flex-1">
                                <h1 className="text-4xl font-display font-bold text-white mb-2">{selectedStory.name}</h1>
                                <div className="flex flex-wrap justify-center md:justify-start gap-4 text-xs font-mono text-cyber-cyan uppercase tracking-widest">
                                    <div className="flex items-center gap-1"><GraduationCap size={14}/> {selectedStory.iit}</div>
                                    <div className="flex items-center gap-1"><Target size={14}/> {selectedStory.branch}</div>
                                </div>
                                <p className="text-slate-500 text-sm mt-4 italic flex items-center justify-center md:justify-start gap-2">
                                    <MapPin size={14}/> {selectedStory.background}
                                </p>
                            </div>
                        </div>

                        {/* Story Sections */}
                        <div className="grid gap-8">
                            <Section title="The Hook" icon={Zap} color="text-cyber-yellow" content={selectedStory.hook} isBold />
                            <Section title="Initial Struggles" icon={User} color="text-cyber-pink" content={selectedStory.struggles} />
                            <Section title="The Turning Point" icon={ChevronRight} color="text-cyber-cyan" content={selectedStory.turningPoint} />
                            <Section title="The Mindset & Routine" icon={BookOpen} color="text-cyber-purple" content={selectedStory.routine} />
                            <Section title="Final Achievement" icon={GraduationCap} color="text-green-400" content={selectedStory.achievement} />
                        </div>

                        {/* Inspirational Takeaway */}
                        <div className="glass-panel p-8 rounded-[40px] border border-cyber-cyan/30 bg-cyber-cyan/5 relative overflow-hidden mt-12 mb-8">
                            <div className="absolute top-0 left-0 w-2 h-full bg-cyber-cyan"></div>
                            <Quote size={40} className="text-cyber-cyan/20 absolute right-6 top-6" />
                            <h3 className="text-white font-display font-bold text-xl mb-4 uppercase tracking-widest">Message for Aspirants</h3>
                            <p className="text-slate-200 text-lg leading-relaxed italic">
                                "{selectedStory.takeaway}"
                            </p>
                        </div>

                        <div className="text-center opacity-30 pt-10">
                            <p className="text-[10px] text-slate-500 uppercase tracking-widest">Verified Success Archive • Zuaki Mentor Network</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full w-full bg-[#020617] p-6 overflow-y-auto custom-scrollbar relative">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_#0f172a_0%,_#020617_80%)] pointer-events-none"></div>
            
            <div className="max-w-5xl mx-auto relative z-10 pb-24">
                <div className="flex items-center gap-4 mb-8 animate-in slide-in-from-top-4 duration-500">
                    <div className="w-12 h-12 rounded-2xl bg-cyber-yellow/20 flex items-center justify-center text-cyber-yellow border border-cyber-yellow/30 shadow-[0_0_20px_rgba(252,238,10,0.2)]">
                        <Zap size={24} fill="currentColor" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-display font-bold text-white uppercase tracking-widest">Motivational Zone</h1>
                        <p className="text-slate-400 text-xs font-mono uppercase tracking-wider">Real Stories from the IITian Vanguard</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {MOTIVATIONAL_STORIES.map((story, i) => (
                        <div 
                            key={story.id} 
                            onClick={() => setSelectedStory(story)}
                            className="glass-panel group rounded-[32px] border border-white/5 hover:border-cyber-cyan/40 transition-all cursor-pointer overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-4"
                            style={{ animationDelay: `${i * 100}ms` }}
                        >
                            <div className="h-48 w-full relative overflow-hidden">
                                <img src={story.photo} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={story.name} />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#020617] to-transparent opacity-60"></div>
                                <div className="absolute bottom-4 left-6">
                                    <span className="text-[10px] font-bold text-cyber-cyan bg-cyber-cyan/10 border border-cyber-cyan/30 px-3 py-1 rounded-full uppercase tracking-widest">
                                        {story.iit}
                                    {/* Fix: Changed closing tag from div to span to match the opening span on line 145 */}
                                    </span>
                                </div>
                            </div>

                            <div className="p-6 flex flex-col flex-1">
                                <h3 className="text-xl font-bold text-white mb-2 group-hover:text-cyber-cyan transition-colors">{story.name}</h3>
                                <p className="text-slate-400 text-sm leading-relaxed line-clamp-2 italic mb-6">
                                    "{story.hook}"
                                </p>
                                <div className="mt-auto flex items-center justify-between text-[10px] font-bold uppercase tracking-widest text-slate-500 group-hover:text-white transition-colors">
                                    <span>Read Full Journey</span>
                                    <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Disclaimer Footnote */}
                <div className="mt-20 p-6 border border-white/5 rounded-2xl text-center opacity-40">
                    <p className="text-[10px] text-slate-500 uppercase tracking-[0.2em] max-w-lg mx-auto">
                        These stories are based on real publicly known achievements. Motivation is the fuel, but discipline is the engine. Keep studying, Operative.
                    </p>
                </div>
            </div>
        </div>
    );
};

const Section = ({ title, icon: Icon, color, content, isBold }: { title: string, icon: any, color: string, content: string, isBold?: boolean }) => (
    <div className="space-y-3">
        <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg bg-white/5 border border-white/10 ${color}`}>
                <Icon size={18} />
            </div>
            <h3 className={`text-sm font-bold uppercase tracking-widest text-slate-400`}>{title}</h3>
        </div>
        <p className={`text-slate-300 leading-8 text-justify font-sans ${isBold ? 'text-lg text-white font-medium' : 'text-base'}`}>
            {content}
        </p>
    </div>
);
