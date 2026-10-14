
import React, { useState, useRef, useEffect } from 'react';
import { Send, Plus, X, Brain, Sparkles, Loader2, Copy, Check, FileText, Paperclip, Mic, ArrowLeft } from 'lucide-react';
import { getGenZResponse, FilePart } from '../services/geminiService';
import { statsService } from '../services/statsService';
import { UserProfile, ChatMessage, Attachment } from '../types';
import { VoiceChatOverlay } from './VoiceChatOverlay';

interface GenZAssistantProps {
    userProfile?: Partial<UserProfile>;
    onBack?: () => void;
}

export const GenZAssistant: React.FC<GenZAssistantProps> = ({ userProfile = {} as Partial<UserProfile>, onBack }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [pendingAttachments, setPendingAttachments] = useState<Attachment[]>([]);
  const [showVoiceOverlay, setShowVoiceOverlay] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const handleSend = async () => {
    if ((!input.trim() && pendingAttachments.length === 0) || loading) return;
    
    const userText = input.trim();
    const attachments = [...pendingAttachments];
    setInput('');
    setPendingAttachments([]);

    const newUserMsg: ChatMessage = { 
        id: Date.now().toString(), 
        role: 'user', 
        content: userText || `[Attached ${attachments.length} file(s)]`, 
        attachments,
        timestamp: new Date() 
    };

    setMessages(prev => [...prev, newUserMsg]);
    setLoading(true);
    statsService.askAI();

    try {
        const history = messages.slice(-10).map(m => ({ 
          role: m.role, 
          parts: [{ text: m.content }] 
        }));
        
        const userContext = `Language: ${userProfile?.language || 'English'}. Student Class: ${userProfile?.studentClass || '11'}. Built by Zubair & Akhil. Identity: ZUAKI.`;
        const fileParts: FilePart[] = attachments.map(att => ({
          mimeType: att.mimeType,
          data: att.base64.split(',')[1]
        }));

        const responseText = await getGenZResponse(userText, history, fileParts, userContext);
        
        const modelMsg: ChatMessage = { 
            id: (Date.now() + 1).toString(), 
            role: 'model', 
            content: responseText, 
            timestamp: new Date() 
        };
        setMessages(prev => [...prev, modelMsg]);
    } catch (error) {
        console.error("Neural Error:", error);
    } finally {
        setLoading(false);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || []) as File[];
      if (files.length === 0) return;
      const newAttachments: Attachment[] = [];
      for (const file of files) {
          const reader = new FileReader();
          const promise = new Promise<Attachment>((resolve) => {
              reader.onloadend = () => {
                  resolve({
                      id: Math.random().toString(36).substr(2, 9),
                      url: reader.result as string,
                      base64: reader.result as string,
                      mimeType: file.type || 'application/octet-stream',
                      name: file.name,
                      type: file.type.startsWith('image/') ? 'image' : 'file'
                  });
              };
          });
          reader.readAsDataURL(file);
          newAttachments.push(await promise);
      }
      setPendingAttachments(prev => [...prev, ...newAttachments]);
  };

  const clearChat = () => {
      if (confirm("Reset the current neural link? (Clear chat)")) {
          setMessages([]);
      }
  };

  return (
    <div className="h-full w-full bg-[#02040a] text-white flex flex-col relative overflow-hidden font-sans">
      {/* Header */}
      <div className="h-16 px-4 flex items-center justify-between border-b border-white/5 bg-black/40 backdrop-blur-xl z-20">
          <div className="flex items-center gap-3">
              {onBack && (
                  <button onClick={onBack} className="p-2 rounded-xl hover:bg-white/10 text-slate-400 transition-all">
                      <ArrowLeft size={20}/>
                  </button>
              )}
              <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-cyber-cyan to-cyber-purple flex items-center justify-center text-black font-black text-xs shadow-[0_0_10px_#00f3ff60]">Z</div>
                  <h1 className="font-display font-bold text-white tracking-widest text-sm uppercase">GenZ AI Mentor</h1>
              </div>
          </div>
          <button onClick={clearChat} className="p-2 rounded-xl hover:bg-white/10 text-slate-500 hover:text-white transition-all" title="New Session">
              <Plus size={20}/>
          </button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto px-4 space-y-8 custom-scrollbar relative z-10 pb-40 pt-6">
          {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center animate-in fade-in zoom-in-95">
                  <div className="w-20 h-20 bg-cyber-cyan/5 border border-cyber-cyan/20 rounded-[32px] flex items-center justify-center text-cyber-cyan mb-6 shadow-[0_0_30px_rgba(0,243,255,0.1)]">
                      <Brain size={40} className="animate-pulse" />
                  </div>
                  <h2 className="text-3xl font-display font-bold text-white mb-2 uppercase tracking-widest">I am ZUAKI</h2>
                  <p className="text-slate-500 text-[10px] font-mono uppercase tracking-[0.3em]">Created by Zubair and Akhil</p>
                  
                  <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-md">
                      <PromptSuggestion label="Who made you?" onClick={() => setInput("Who made you?")} />
                      <PromptSuggestion label="Derive Projectile Motion" onClick={() => setInput("Explain projectile motion formula derivation step-by-step.")} />
                      <PromptSuggestion label="Organic Chemistry Trick" onClick={() => setInput("Give me a trick to remember the Markovnikov rule.")} />
                      <PromptSuggestion label="Study Plan for Today" onClick={() => setInput("Can you make a quick 3-hour study plan for Physics and Math?")} />
                  </div>
              </div>
          ) : (
              messages.map((msg) => (
                  <div key={msg.id} className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                      <div className="max-w-[85%] md:max-w-[75%] animate-in fade-in slide-in-from-bottom-2">
                          {msg.role === 'model' && (
                              <div className="flex items-center gap-2 mb-1.5 ml-1">
                                  <Sparkles size={10} className="text-cyber-purple" />
                                  <span className="text-[9px] font-bold text-cyber-purple uppercase tracking-widest">Zuaki Intelligence</span>
                              </div>
                          )}
                          <div className={`p-4 rounded-3xl text-sm leading-relaxed border backdrop-blur-md ${msg.role === 'user' ? 'bg-cyber-cyan/10 border-cyber-cyan/30 text-white rounded-tr-none' : 'bg-[#1e293b]/40 border-white/10 text-slate-200 rounded-tl-none'}`}>
                              {msg.attachments?.map(att => (
                                  <div key={att.id} className="mb-3 rounded-2xl overflow-hidden border border-white/10 bg-black/40">
                                      {att.type === 'image' ? (
                                          <img src={att.url} className="w-full object-contain max-h-60" alt="Attachment" />
                                      ) : (
                                          <div className="p-4 flex items-center gap-3">
                                              <FileText className="text-cyber-cyan" size={20} />
                                              <span className="text-xs truncate text-slate-300">{att.name}</span>
                                          </div>
                                      )}
                                  </div>
                              ))}
                              <div className="whitespace-pre-wrap">{msg.content}</div>
                          </div>
                      </div>
                  </div>
              ))
          )}
          {loading && (
              <div className="flex justify-start">
                  <div className="p-4 bg-white/5 border border-white/5 rounded-3xl rounded-tl-none flex gap-1.5 items-center">
                      <div className="w-1.5 h-1.5 bg-cyber-purple rounded-full animate-bounce"></div>
                      <div className="w-1.5 h-1.5 bg-cyber-purple rounded-full animate-bounce delay-150"></div>
                      <div className="w-1.5 h-1.5 bg-cyber-purple rounded-full animate-bounce delay-300"></div>
                  </div>
              </div>
          )}
          <div ref={messagesEndRef} />
      </div>

      {/* Input UI */}
      <div className="absolute bottom-6 left-4 right-4 z-30">
          <div className="max-w-4xl mx-auto space-y-4">
              {pendingAttachments.length > 0 && (
                <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                    {pendingAttachments.map(att => (
                        <div key={att.id} className="relative bg-black/80 border border-cyber-cyan/30 rounded-2xl p-2 flex items-center gap-2 shrink-0">
                            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                                {att.type === 'image' ? <img src={att.url} className="w-full h-full object-cover rounded-lg" /> : <FileText size={16} />}
                            </div>
                            <span className="text-[10px] text-white truncate max-w-[80px]">{att.name}</span>
                            <button onClick={() => setPendingAttachments(p => p.filter(a => a.id !== att.id))} className="absolute -top-1 -right-1 p-1 bg-red-500 rounded-full text-white shadow-lg">
                                <X size={10}/>
                            </button>
                        </div>
                    ))}
                </div>
              )}
              
              <div className="bg-[#0b0f1a]/80 backdrop-blur-2xl border border-white/10 rounded-[28px] p-2 flex items-end shadow-2xl transition-all focus-within:border-cyber-cyan/50">
                  <button onClick={() => fileInputRef.current?.click()} className="p-3 text-slate-500 hover:text-cyber-cyan transition-colors" title="Attach Files">
                      <Paperclip size={20} />
                  </button>
                  <input type="file" ref={fileInputRef} onChange={handleFileSelect} className="hidden" multiple />
                  
                  <textarea 
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      onKeyDown={e => { if(e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); } }}
                      placeholder="Message GenZ..."
                      className="flex-1 bg-transparent border-none outline-none text-white text-sm py-3 px-2 resize-none max-h-48 min-h-[48px] custom-scrollbar"
                      rows={1}
                      onInput={(e: any) => { e.target.style.height = 'auto'; e.target.style.height = e.target.scrollHeight + 'px'; }}
                  />
                  
                  <div className="flex items-center gap-1 mb-1 mr-1">
                      <button onClick={() => setShowVoiceOverlay(true)} className="p-3 text-slate-500 hover:text-cyber-purple transition-all" title="Voice Input">
                          <Mic size={20}/>
                      </button>
                      <button 
                        onClick={handleSend} 
                        disabled={loading || (!input.trim() && pendingAttachments.length === 0)} 
                        className={`p-3 rounded-full transition-all ${ (input.trim() || pendingAttachments.length > 0) ? 'bg-cyber-cyan text-black shadow-[0_0_15px_#00f3ff]' : 'bg-white/5 text-slate-700'}`}
                      >
                          {loading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} fill="currentColor" />}
                      </button>
                  </div>
              </div>
              <div className="flex justify-center gap-4 text-[9px] font-bold text-slate-600 uppercase tracking-[0.4em]">
                  <span>Neural Link Established</span>
                  <span className="text-cyber-cyan">Zuaki V4.1 Stable</span>
              </div>
          </div>
      </div>

      {showVoiceOverlay && (
          <VoiceChatOverlay 
            userProfile={userProfile} 
            onClose={() => setShowVoiceOverlay(false)} 
            onTranscriptReady={(u, m) => {
                const uMsg: ChatMessage = { id: `v-u-${Date.now()}`, role: 'user', content: u, timestamp: new Date() };
                const mMsg: ChatMessage = { id: `v-m-${Date.now()}`, role: 'model', content: m, timestamp: new Date() };
                setMessages(prev => [...prev, uMsg, mMsg]);
            }}
          />
      )}
    </div>
  );
};

const PromptSuggestion = ({ label, onClick }: { label: string, onClick: () => void }) => (
    <button 
        onClick={onClick} 
        className="p-4 bg-white/5 border border-white/5 rounded-2xl text-left text-xs text-slate-400 hover:bg-white/10 hover:border-cyber-cyan/30 hover:text-white transition-all group"
    >
        <p className="text-cyber-cyan opacity-40 group-hover:opacity-100 block mb-1 uppercase font-bold text-[9px] tracking-widest">Suggestion</p>
        <span className="line-clamp-1">{label}</span>
    </button>
);
