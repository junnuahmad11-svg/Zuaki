
import React, { useState, useEffect, useRef } from 'react';
import { Send, Bug, Lightbulb, MessageSquare, MoreHorizontal, Paperclip, Image as ImageIcon, X, CheckCircle, AlertTriangle, Loader2, ArrowUpRight, Smartphone, Info } from 'lucide-react';
import { firebase } from '../services/backend';
import { FeedbackSubmission } from '../types';

export const Feedback: React.FC = () => {
  const [type, setType] = useState<'Bug' | 'Feature' | 'Suggestion' | 'Other'>('Bug');
  const [message, setMessage] = useState('');
  const [attachment, setAttachment] = useState<string | null>(null);
  const [status, setStatus] = useState<'IDLE' | 'LOADING' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [userInfo, setUserInfo] = useState({ id: '', name: '', device: '', version: '2.1.0' });
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Capture User Info on Mount
  useEffect(() => {
      const id = localStorage.getItem('zuaki_user_id') || 'Guest';
      const name = 'User'; // In real app, fetch from context
      const device = navigator.userAgent; // Basic device string
      setUserInfo({ id, name, device, version: '2.1.0' });
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
          const reader = new FileReader();
          reader.onloadend = () => setAttachment(reader.result as string);
          reader.readAsDataURL(file);
      }
  };

  const handleSubmit = async () => {
      if (!message.trim()) return;
      setStatus('LOADING');

      const payload: FeedbackSubmission = {
          type,
          message,
          screenshot: attachment || undefined,
          userId: userInfo.id,
          userName: userInfo.name,
          deviceInfo: userInfo.device,
          appVersion: userInfo.version,
          timestamp: Date.now()
      };

      try {
          await firebase.firestore().feedback.submit(payload);
          setStatus('SUCCESS');
          setMessage('');
          setAttachment(null);
      } catch (error) {
          console.error("Submission error", error);
          setStatus('ERROR');
      }
  };

  const resetForm = () => {
      setStatus('IDLE');
      setType('Bug');
  };

  const getTypeStyle = (t: string) => {
      if (type === t) {
          switch(t) {
              case 'Bug': return 'bg-red-500/20 border-red-500 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]';
              case 'Feature': return 'bg-cyber-purple/20 border-cyber-purple text-cyber-purple shadow-[0_0_15px_rgba(157,0,255,0.3)]';
              case 'Suggestion': return 'bg-cyber-cyan/20 border-cyber-cyan text-cyber-cyan shadow-[0_0_15px_rgba(0,243,255,0.3)]';
              default: return 'bg-white/10 border-white text-white shadow-[0_0_15px_rgba(255,255,255,0.3)]';
          }
      }
      return 'bg-white/5 border-white/10 text-slate-400 hover:bg-white/10 hover:text-white';
  };

  const mailSubject = `Zuaki Feedback: ${type}`;
  const mailBody = encodeURIComponent(`${message}\n\n--- System Info ---\nUser: ${userInfo.id}\nDevice: ${userInfo.device}\nVer: ${userInfo.version}`);
  const mailToLink = `mailto:zuaki.Ai@gmail.com?subject=${mailSubject}&body=${mailBody}`;

  // SUCCESS VIEW
  if (status === 'SUCCESS') {
      return (
          <div className="h-full w-full bg-[#0B0F1A] flex flex-col items-center justify-center p-6 relative overflow-hidden">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_#0f172a_0%,_#020617_80%)] pointer-events-none"></div>
              
              <div className="z-10 text-center max-w-md w-full glass-panel p-10 rounded-[40px] border border-green-500/30 shadow-[0_0_50px_rgba(34,197,94,0.1)] animate-in zoom-in-95 duration-300">
                  <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(34,197,94,0.3)]">
                      <CheckCircle size={40} className="text-green-500" />
                  </div>
                  <h2 className="text-3xl font-display font-bold text-white mb-2">Received</h2>
                  <p className="text-slate-400 mb-8 text-sm">
                      Your feedback has been encrypted and transmitted to <span className="text-white font-mono">zuaki.Ai@gmail.com</span>. Our founders will review it shortly.
                  </p>
                  
                  <button 
                      onClick={resetForm}
                      className="w-full py-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-bold transition-all"
                  >
                      Send Another
                  </button>
              </div>
          </div>
      );
  }

  // MAIN FORM VIEW
  return (
    <div className="h-full w-full bg-[#0B0F1A] p-6 overflow-y-auto custom-scrollbar relative flex flex-col items-center">
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none"></div>
      
      <div className="w-full max-w-2xl relative z-10 pb-20">
         {/* Header */}
         <div className="text-center mb-8">
             <h1 className="text-3xl font-display font-bold text-white uppercase tracking-[0.2em] mb-2">Feedback Loop</h1>
             <p className="text-slate-400 text-xs font-mono">Help us improve the Zuaki Neural Network.</p>
         </div>

         {/* Form Card */}
         <div className="glass-panel p-6 md:p-8 rounded-[30px] border border-white/10 shadow-2xl relative overflow-hidden">
             
             {/* Type Selector */}
             <label className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-3 block">Feedback Category</label>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
                 <button onClick={() => setType('Bug')} className={`flex flex-col items-center justify-center py-4 rounded-2xl border transition-all ${getTypeStyle('Bug')}`}>
                     <Bug size={24} className="mb-2" />
                     <span className="text-xs font-bold">Bug Report</span>
                 </button>
                 <button onClick={() => setType('Feature')} className={`flex flex-col items-center justify-center py-4 rounded-2xl border transition-all ${getTypeStyle('Feature')}`}>
                     <Lightbulb size={24} className="mb-2" />
                     <span className="text-xs font-bold">Feature</span>
                 </button>
                 <button onClick={() => setType('Suggestion')} className={`flex flex-col items-center justify-center py-4 rounded-2xl border transition-all ${getTypeStyle('Suggestion')}`}>
                     <MessageSquare size={24} className="mb-2" />
                     <span className="text-xs font-bold">Suggestion</span>
                 </button>
                 <button onClick={() => setType('Other')} className={`flex flex-col items-center justify-center py-4 rounded-2xl border transition-all ${getTypeStyle('Other')}`}>
                     <MoreHorizontal size={24} className="mb-2" />
                     <span className="text-xs font-bold">Other</span>
                 </button>
             </div>

             {/* Message Input */}
             <label className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-3 block">Details</label>
             <div className="relative mb-6 group">
                 <textarea 
                    value={message} onChange={e => setMessage(e.target.value)}
                    className="w-full h-40 bg-black/40 border border-white/10 rounded-2xl p-5 text-white text-sm outline-none focus:border-cyber-cyan focus:shadow-[0_0_20px_rgba(0,243,255,0.1)] transition-all resize-none placeholder-slate-600 leading-relaxed"
                    placeholder="Describe the issue, idea, or thought in detail..."
                 />
                 <div className="absolute bottom-4 right-4 text-[10px] text-slate-600 font-mono">
                     {message.length} chars
                 </div>
             </div>

             {/* Attachment */}
             <div className="mb-8">
                 <label className="text-xs text-slate-500 font-bold uppercase tracking-widest mb-3 block">Attachment (Optional)</label>
                 {!attachment ? (
                     <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full py-4 border border-dashed border-white/20 rounded-2xl flex items-center justify-center gap-3 text-slate-400 hover:text-white hover:bg-white/5 hover:border-white/40 transition-all group"
                     >
                         <Paperclip size={18} className="group-hover:text-cyber-cyan" />
                         <span className="text-sm">Attach Screenshot</span>
                     </button>
                 ) : (
                     <div className="relative w-full h-48 rounded-2xl overflow-hidden border border-white/20 group">
                         <img src={attachment} alt="Preview" className="w-full h-full object-cover opacity-80" />
                         <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                             <button onClick={() => setAttachment(null)} className="p-2 bg-red-600 text-white rounded-full hover:scale-110 transition-transform">
                                 <X size={20} />
                             </button>
                         </div>
                         <div className="absolute top-2 right-2 px-2 py-1 bg-black/60 rounded text-[10px] text-white flex items-center gap-1">
                             <ImageIcon size={10} /> Image Ready
                         </div>
                     </div>
                 )}
                 <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" className="hidden" />
             </div>

             {/* Auto Info Box */}
             <div className="mb-8 p-4 bg-white/5 border border-white/10 rounded-xl flex items-start gap-3">
                 <Info size={16} className="text-cyber-purple shrink-0 mt-0.5" />
                 <div className="text-[10px] text-slate-400 font-mono leading-relaxed">
                     <strong className="text-slate-300">System Auto-Capture:</strong> <br/>
                     User: {userInfo.name} ({userInfo.id}) <br/>
                     Device: {userInfo.device.substring(0, 30)}... <br/>
                     App Ver: {userInfo.version}
                 </div>
             </div>

             {/* Submit Actions */}
             <div className="space-y-4">
                 <button 
                    onClick={handleSubmit}
                    disabled={!message.trim() || status === 'LOADING'}
                    className="w-full py-4 bg-gradient-to-r from-cyber-cyan to-blue-600 rounded-xl font-bold text-white uppercase tracking-widest shadow-[0_0_20px_rgba(0,243,255,0.3)] hover:shadow-[0_0_30px_rgba(0,243,255,0.5)] transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed group active:scale-95"
                 >
                     {status === 'LOADING' ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} className="group-hover:translate-x-1 transition-transform" />}
                     {status === 'LOADING' ? 'Transmitting...' : 'Submit Feedback'}
                 </button>

                 <div className="text-center">
                     <p className="text-[10px] text-slate-500 mb-2">or use your native client</p>
                     <a 
                        href={mailToLink}
                        className="inline-flex items-center gap-2 text-xs font-bold text-slate-400 hover:text-white transition-colors"
                     >
                         Open Mail App <ArrowUpRight size={12} />
                     </a>
                 </div>
             </div>

             {/* Error Message */}
             {status === 'ERROR' && (
                 <div className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl flex items-center gap-2 text-red-400 text-xs font-bold justify-center animate-pulse">
                     <AlertTriangle size={14} /> Transmission Failed. Please try the mail link below.
                 </div>
             )}

         </div>
      </div>
    </div>
  );
};
