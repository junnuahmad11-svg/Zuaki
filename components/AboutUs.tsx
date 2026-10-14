
import React from 'react';
import { Rocket, Star, Brain, Users, Code, Award } from 'lucide-react';

export const AboutUs: React.FC = () => {
  return (
    <div className="h-full w-full bg-[#0B0F1A] overflow-y-auto custom-scrollbar p-6 pb-24 relative">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none"></div>
      
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-display font-bold text-[#00E5FF] uppercase tracking-widest mb-2 drop-shadow-[0_0_10px_rgba(0,229,255,0.4)]">
            About Zuaki
          </h1>
          <p className="text-[#C9D1E8] text-sm font-mono opacity-80">The Story Behind the Intelligence</p>
        </div>

        {/* Our Journey */}
        <div className="glass-panel p-8 rounded-2xl border border-[#00E5FF]/20 shadow-[0_0_20px_rgba(0,229,255,0.1)]">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-[#00E5FF]/10 flex items-center justify-center text-[#00E5FF]">
              <Rocket size={24} />
            </div>
            <h2 className="text-2xl font-display font-bold text-[#4DBEFF]">Our Journey</h2>
          </div>
          <p className="text-[#C9D1E8] leading-relaxed">
            Two friends prepared for JEE, sitting amidst piles of books and endless notes. We listed every feature we wished we had in our notebooks—smart tracking, instant help, and collaborative study. Overcoming coding challenges together, sleepless nights, and countless iterations, we built <span className="text-white font-bold">Zuaki</span> to help students like us achieve their dreams.
          </p>
        </div>

        {/* Our Vision */}
        <div className="glass-panel p-8 rounded-2xl border border-[#9d00ff]/20 shadow-[0_0_20px_rgba(157,0,255,0.1)]">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-[#9d00ff]/10 flex items-center justify-center text-[#9d00ff]">
              <Star size={24} />
            </div>
            <h2 className="text-2xl font-display font-bold text-[#9d00ff]">Our Vision</h2>
          </div>
          <p className="text-[#C9D1E8] leading-relaxed">
            We envision a world where studying is smarter, not harder. Through AI-driven support, deep analytics, and accessible tools, Zuaki aims to democratize high-quality education support for every aspirant, turning stress into structure and confusion into clarity.
          </p>
        </div>

        {/* Our Skills */}
        <div className="glass-panel p-8 rounded-2xl border border-[#ff003c]/20 shadow-[0_0_20px_rgba(255,0,60,0.1)]">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-full bg-[#ff003c]/10 flex items-center justify-center text-[#ff003c]">
              <Brain size={24} />
            </div>
            <h2 className="text-2xl font-display font-bold text-[#ff003c]">Our Skills</h2>
          </div>
          <p className="text-[#C9D1E8] leading-relaxed mb-4">
            Forged in the fires of problem-solving, our skillset spans the entire digital spectrum:
          </p>
          <div className="grid grid-cols-2 gap-4">
            {['HTML & CSS Architecture', 'Advanced UI/UX Creation', 'Complex Problem Solving', 'Creative Direction'].map((skill, i) => (
              <div key={i} className="flex items-center gap-2 text-[#C9D1E8] text-sm font-mono">
                <div className="w-1.5 h-1.5 bg-[#ff003c] rounded-full"></div>
                {skill}
              </div>
            ))}
          </div>
        </div>

        {/* Founders */}
        <div className="glass-panel p-8 rounded-2xl border border-[#4DBEFF]/20 shadow-[0_0_20px_rgba(77,190,255,0.1)]">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 rounded-full bg-[#4DBEFF]/10 flex items-center justify-center text-[#4DBEFF]">
              <Users size={24} />
            </div>
            <h2 className="text-2xl font-display font-bold text-[#4DBEFF]">The Founders</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Founder 1 */}
            <div className="bg-[#081523] p-6 rounded-xl border border-white/5 hover:border-[#00E5FF]/50 transition-all group">
              <div className="flex items-center gap-3 mb-2">
                <Code className="text-[#00E5FF]" size={20} />
                <h3 className="text-white font-bold text-lg">A. Akhil Kumar</h3>
              </div>
              <p className="text-[#00E5FF] text-xs uppercase tracking-widest mb-3">Backend & Development</p>
              <p className="text-[#C9D1E8] text-sm">
                The architect behind the logic. Responsible for backend systems, core ideas, feature implementation, and full-stack development.
              </p>
            </div>

            {/* Founder 2 */}
            <div className="bg-[#081523] p-6 rounded-xl border border-white/5 hover:border-[#9d00ff]/50 transition-all group">
               <div className="flex items-center gap-3 mb-2">
                <Award className="text-[#9d00ff]" size={20} />
                <h3 className="text-white font-bold text-lg">Mohammed Zubair</h3>
              </div>
              <p className="text-[#9d00ff] text-xs uppercase tracking-widest mb-3">Frontend & Design</p>
              <p className="text-[#C9D1E8] text-sm">
                The visionary behind the interface. Crafted the frontend experience, design templates, and user-centric features.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center pt-8 opacity-50">
            <p className="text-xs text-[#C9D1E8]">© 2025 Zuaki. Built with passion by students, for students.</p>
        </div>
      </div>
    </div>
  );
};
