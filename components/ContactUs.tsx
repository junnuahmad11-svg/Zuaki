
import React from 'react';
import { Mail, User, AlertTriangle, Bug, Ban, ArrowUpRight } from 'lucide-react';

export const ContactUs: React.FC = () => {
  
  const openMail = (email: string, subject: string) => {
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}`;
  };

  return (
    <div className="h-full w-full bg-[#0B0F1A] overflow-y-auto custom-scrollbar p-6 pb-24 relative">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none"></div>

      <div className="max-w-2xl mx-auto space-y-6">
         {/* Header */}
         <div className="text-center mb-10">
          <h1 className="text-4xl font-display font-bold text-[#00E5FF] uppercase tracking-widest mb-2 drop-shadow-[0_0_10px_rgba(0,229,255,0.4)]">
            Contact Us
          </h1>
          <p className="text-[#C9D1E8] text-sm font-mono opacity-80">We are here to help & listen</p>
        </div>

        {/* Official Email */}
        <button 
          onClick={() => openMail('zuaki.AI@gmail.com', 'General Inquiry')}
          className="w-full glass-panel p-6 rounded-2xl border border-[#00E5FF]/30 flex items-center justify-between group hover:bg-[#00E5FF]/10 transition-all hover:shadow-[0_0_20px_rgba(0,229,255,0.2)]"
        >
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#00E5FF]/10 flex items-center justify-center text-[#00E5FF]">
                    <Mail size={24} />
                </div>
                <div className="text-left">
                    <h3 className="text-white font-bold text-lg">Official Email</h3>
                    <p className="text-[#00E5FF] font-mono text-sm">zuaki.AI@gmail.com</p>
                </div>
            </div>
            <ArrowUpRight className="text-[#00E5FF] opacity-50 group-hover:opacity-100 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
        </button>

        <h3 className="text-[#C9D1E8] font-bold uppercase tracking-widest text-xs mt-8 mb-4 pl-2">Founders</h3>

        {/* Founder 1 */}
        <button 
          onClick={() => openMail('aithagoniakhil131@gmail.com', 'Message for Founder Akhil')}
          className="w-full glass-panel p-5 rounded-xl border border-white/10 flex items-center justify-between group hover:border-[#4DBEFF] hover:bg-[#081523] transition-all mb-3"
        >
             <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#4DBEFF]/10 flex items-center justify-center text-[#4DBEFF]">
                    <User size={20} />
                </div>
                <div className="text-left">
                    <h3 className="text-white font-bold">Akhil</h3>
                    <p className="text-slate-400 text-xs font-mono">Backend Lead</p>
                </div>
            </div>
            <Mail className="text-slate-500 group-hover:text-[#4DBEFF] transition-colors" size={18} />
        </button>

        {/* Founder 2 */}
        <button 
          onClick={() => openMail('kingamsingham12@gmail.com', 'Message for Founder Zubair')}
          className="w-full glass-panel p-5 rounded-xl border border-white/10 flex items-center justify-between group hover:border-[#9d00ff] hover:bg-[#081523] transition-all"
        >
             <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-full bg-[#9d00ff]/10 flex items-center justify-center text-[#9d00ff]">
                    <User size={20} />
                </div>
                <div className="text-left">
                    <h3 className="text-white font-bold">Zubair</h3>
                    <p className="text-slate-400 text-xs font-mono">Frontend Lead</p>
                </div>
            </div>
             <Mail className="text-slate-500 group-hover:text-[#9d00ff] transition-colors" size={18} />
        </button>

        <h3 className="text-[#C9D1E8] font-bold uppercase tracking-widest text-xs mt-8 mb-4 pl-2">Report Issues</h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Report Problem */}
            <button 
                onClick={() => openMail('zuaki.AI@gmail.com', 'Problem / Bug Report')}
                className="glass-panel p-5 rounded-xl border border-red-500/20 bg-red-500/5 hover:bg-red-500/10 hover:border-red-500 flex flex-col items-center justify-center gap-3 transition-all group"
            >
                <Bug className="text-red-500 group-hover:scale-110 transition-transform" size={24} />
                <span className="text-white font-bold">Report a Problem</span>
            </button>

             {/* Complaint */}
             <button 
                onClick={() => openMail('zuaki.AI@gmail.com', 'Complaint Against User')}
                className="glass-panel p-5 rounded-xl border border-orange-500/20 bg-orange-500/5 hover:bg-orange-500/10 hover:border-orange-500 flex flex-col items-center justify-center gap-3 transition-all group"
            >
                <Ban className="text-orange-500 group-hover:scale-110 transition-transform" size={24} />
                <span className="text-white font-bold">Complain User</span>
            </button>
        </div>

      </div>
    </div>
  );
};
