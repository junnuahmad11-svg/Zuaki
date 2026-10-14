
import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, Smile, PenTool, Check, AlertTriangle, Search, Plus, 
  Users, UserPlus, Bell, X, Mic, Paperclip, Image as ImageIcon,
  MoreVertical, ArrowLeft, Copy, Trash2, VolumeX, MessageCircle, LogIn, Loader2, Sparkles, UserCheck, Share2
} from 'lucide-react';
import { Message, ChatContact, Group, FriendRequest, UserProfile } from '../types';
import { WhiteboardSession } from './WhiteboardSession';
import { firebase } from '../services/backend';
import { VoiceChatOverlay } from './VoiceChatOverlay';

interface ChatInterfaceProps {
    userProfile?: Partial<UserProfile>;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ userProfile = {} as Partial<UserProfile> }) => {
  const [activeChat, setActiveChat] = useState<(ChatContact | Group) | null>(null);
  const [activeTab, setActiveTab] = useState<'FRIENDS' | 'GROUPS'>('FRIENDS');
  const [friends, setFriends] = useState<ChatContact[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [groupModalMode, setGroupModalMode] = useState<'CREATE' | 'JOIN'>('CREATE');
  const [newGroupName, setNewGroupName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [isGroupLoading, setIsGroupLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [showWhiteboard, setShowWhiteboard] = useState(false);
  const [showVoiceOverlay, setShowVoiceOverlay] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const currentUser = localStorage.getItem('zuaki_user_id') || 'guest';

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
      const loadedFriends = await firebase.firestore().friends.list(currentUser);
      setFriends(loadedFriends);
      const loadedGroups = await firebase.firestore().groups.list(currentUser);
      setGroups(loadedGroups);
  };

  useEffect(() => {
      if (activeChat) {
          const stored = localStorage.getItem(`chat_msg_${activeChat.id}`);
          setMessages(stored ? JSON.parse(stored) : []);
      }
  }, [activeChat]);

  useEffect(() => {
      if (activeChat && messages.length > 0) {
          localStorage.setItem(`chat_msg_${activeChat.id}`, JSON.stringify(messages));
      }
  }, [messages, activeChat]);

  useEffect(() => { messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const handleSendMessage = (text = inputText, type: 'text'|'image'|'voice' = 'text', isEmergency = false) => {
      if (!text.trim() && type === 'text') return;
      const newMessage: Message = { id: `m-${Date.now()}`, sender: 'me', text, timestamp: Date.now(), type, isEmergency };
      setMessages(prev => [...prev, newMessage]);
      setInputText('');
      if (activeChat?.type === 'group') {
          firebase.firestore().groups.sendMessage(activeChat.id, { text, senderName: 'You', type });
      } 
  };

  const handleJoinGroup = async () => {
      const code = joinCode.trim().toUpperCase();
      if (!code) return;
      setIsGroupLoading(true);
      try {
          const group = await firebase.firestore().groups.join(code, currentUser);
          if (group) {
              setShowGroupModal(false);
              setJoinCode('');
              setActiveChat(group);
              loadData();
          }
      } catch (err) { alert("Invalid code."); }
      finally { setIsGroupLoading(false); }
  };

  const renderBubble = (msg: Message) => {
      const isMe = msg.sender === 'me';
      return (
          <div className={`flex w-full mb-4 ${isMe ? 'justify-end' : 'justify-start'} animate-in fade-in slide-in-from-bottom-2`}>
              <div className={`max-w-[80%] rounded-2xl p-3 border shadow-lg backdrop-blur-md ${msg.isEmergency ? 'bg-red-900/40 border-red-500 animate-pulse' : isMe ? 'bg-cyber-cyan/10 border-cyber-cyan/50 rounded-tr-none text-white' : 'bg-[#1e1e2e]/80 border-white/10 rounded-tl-none text-white'}`}>
                  {!isMe && activeChat?.type === 'group' && <span className="text-[9px] font-bold text-cyber-purple uppercase block mb-1">{msg.senderName || 'Peer'}</span>}
                  <p className="text-sm">{msg.text}</p>
                  <div className="flex items-center justify-end gap-1 mt-1 text-[8px] text-slate-500">
                      <span>{new Date(msg.timestamp).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
                      {isMe && <div className="flex"><Check size={10} className="text-blue-500" /><Check size={10} className="text-blue-500 -ml-1" /></div>}
                  </div>
              </div>
          </div>
      );
  };

  return (
    <div className="h-full w-full bg-[#020617] flex flex-col relative overflow-hidden">
        {activeChat ? (
            <div className="h-full flex flex-col relative">
                <header className="h-16 px-4 bg-black/40 backdrop-blur-xl border-b border-white/10 flex items-center justify-between z-20">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setActiveChat(null)} className="p-2 text-white"><ArrowLeft size={20} /></button>
                        <img src={(activeChat as any).avatar || (activeChat as any).icon || 'https://ui-avatars.com/api/?name=Group'} className="w-10 h-10 rounded-full border border-white/10" />
                        <div>
                            <h3 className="text-white font-bold text-sm">{activeChat.name}</h3>
                            <p className="text-[10px] text-green-500 font-mono">Online</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <button 
                            onClick={() => setShowWhiteboard(true)} 
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyber-cyan/15 border border-cyber-cyan/40 text-cyber-cyan text-xs font-bold hover:bg-cyber-cyan hover:text-black transition-all shadow-[0_0_10px_rgba(0,243,255,0.2)]"
                            title="Open live synchronized whiteboard with peer & AI solve"
                        >
                            <PenTool size={14} />
                            <span className="hidden sm:inline">Live Whiteboard</span>
                        </button>
                        {activeChat.type === 'group' && (
                            <button onClick={() => handleSendMessage("🚨 EMERGENCY PROTOCOL ACTIVATED!", 'text', true)} className="text-red-500 p-2" title="Emergency Protocol"><AlertTriangle size={20} /></button>
                        )}
                        <button className="text-slate-400 p-2"><MoreVertical size={20}/></button>
                    </div>
                </header>
                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar bg-black/20">
                    {messages.map(msg => renderBubble(msg))}
                    <div ref={messagesEndRef} />
                </div>
                <footer className="p-3 bg-black/60 border-t border-white/10 flex items-center gap-2">
                    <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-2 flex items-center">
                        <button className="p-2 text-slate-500"><Smile size={20}/></button>
                        <input value={inputText} onChange={e => setInputText(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleSendMessage()} placeholder="Type a message..." className="flex-1 bg-transparent py-3 px-2 text-white text-sm outline-none" />
                        <button onClick={() => setShowVoiceOverlay(true)} className="p-2 text-slate-500"><Mic size={18}/></button>
                    </div>
                    <button onClick={() => handleSendMessage()} className="p-3 bg-cyber-cyan text-black rounded-full shadow-[0_0_15px_#00f3ff]"><Send size={20} fill="currentColor" /></button>
                </footer>
                {showWhiteboard && <WhiteboardSession groupId={activeChat.id} onClose={() => setShowWhiteboard(false)} />}
                {showVoiceOverlay && <VoiceChatOverlay userProfile={userProfile} onClose={() => setShowVoiceOverlay(false)} onTranscriptReady={(u) => handleSendMessage(u)} />}
            </div>
        ) : (
            <div className="h-full flex flex-col">
                <header className="p-6 pb-2 flex items-center justify-between">
                    <h1 className="text-3xl font-display font-bold text-white uppercase tracking-widest">Zuaki Chats</h1>
                    <button className="p-3 bg-cyber-cyan/10 border border-cyber-cyan/30 rounded-2xl text-cyber-cyan shadow-[0_0_15px_rgba(0,243,255,0.2)] animate-pulse" title="Friend Requests">
                        <UserPlus size={22} />
                    </button>
                </header>
                <div className="px-6 py-4">
                    <div className="relative group">
                        <Search className="absolute left-4 top-3 text-slate-500 group-focus-within:text-cyber-cyan" size={18} />
                        <input 
                            value={searchQuery}
                            onChange={e => setSearchQuery(e.target.value)}
                            placeholder="Search chats..." 
                            className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-white text-sm outline-none focus:border-cyber-cyan/50 transition-all"
                        />
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto px-4 pb-24 space-y-1">
                    {friends.length === 0 && groups.length === 0 ? (
                        <div className="text-center py-20 animate-in fade-in">
                            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 opacity-30"><Users size={40}/></div>
                            <h3 className="text-white font-bold mb-1">No Zuakians yet</h3>
                            <p className="text-slate-500 text-xs mb-6">Build your rank together.</p>
                            <button onClick={() => alert("Invite link: zuaki.ai/invite")} className="px-6 py-3 bg-cyber-purple text-white font-bold rounded-xl flex items-center gap-2 mx-auto"><Share2 size={16}/> Share App</button>
                        </div>
                    ) : (
                        friends.concat(groups as any).filter(f => f.name.toLowerCase().includes(searchQuery.toLowerCase())).map(f => (
                            <div key={f.id} onClick={() => setActiveChat(f)} className="flex items-center gap-4 p-4 rounded-2xl hover:bg-white/5 transition-all cursor-pointer group">
                                <div className="relative">
                                    <img src={f.avatar || (f as any).icon} className="w-14 h-14 rounded-full border border-white/10" />
                                    {f.isOnline && <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#020617]"></div>}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-baseline mb-0.5">
                                        <h3 className="text-white font-bold group-hover:text-cyber-cyan truncate">{f.name}</h3>
                                        <span className="text-[10px] text-slate-600">Now</span>
                                    </div>
                                    <p className="text-slate-500 text-xs truncate">{f.lastMessage || 'Start a conversation'}</p>
                                </div>
                                {f.unread > 0 && <div className="w-5 h-5 bg-cyber-cyan text-black rounded-full flex items-center justify-center text-[10px] font-bold">{f.unread}</div>}
                            </div>
                        ))
                    )}
                </div>
                <button onClick={() => { setShowGroupModal(true); setGroupModalMode('CREATE'); }} className="fixed bottom-24 right-6 w-14 h-14 bg-cyber-cyan text-black rounded-2xl shadow-[0_0_20px_#00f3ff] flex items-center justify-center hover:scale-110 active:scale-95 transition-all z-30">
                    <Plus size={28} strokeWidth={3} />
                </button>
            </div>
        )}
        {showGroupModal && (
            <div className="fixed inset-0 z-50 flex items-end">
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !isGroupLoading && setShowGroupModal(false)}></div>
                <div className="w-full bg-[#0b0f1a] border-t border-cyber-cyan/30 rounded-t-[32px] p-8 relative z-10 animate-in slide-in-from-bottom duration-300">
                    {groupModalMode === 'CREATE' ? (
                        <div className="space-y-6">
                            <h3 className="text-white font-bold text-xl uppercase tracking-widest">Initialize Group</h3>
                            <input value={newGroupName} onChange={e => setNewGroupName(e.target.value)} placeholder="Tactical Name" className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white outline-none" />
                            <button onClick={async () => { setIsGroupLoading(true); const g = await firebase.firestore().groups.create(newGroupName, '', '', currentUser); setActiveChat(g); setShowGroupModal(false); loadData(); setIsGroupLoading(false); }} className="w-full py-4 bg-cyber-cyan text-black font-bold rounded-xl uppercase tracking-widest shadow-xl">Create Code</button>
                            <button onClick={() => setGroupModalMode('JOIN')} className="w-full text-cyber-purple font-bold text-xs uppercase tracking-widest">Join existing via code</button>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <h3 className="text-white font-bold text-xl uppercase tracking-widest">Join Mission</h3>
                            <input value={joinCode} onChange={e => setJoinCode(e.target.value.toUpperCase())} placeholder="ENTER 6-DIGIT CODE" className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-center text-2xl font-mono text-white outline-none" />
                            <button onClick={handleJoinGroup} className="w-full py-4 bg-cyber-purple text-white font-bold rounded-xl uppercase tracking-widest shadow-xl">Connect Hub</button>
                        </div>
                    )}
                </div>
            </div>
        )}
    </div>
  );
};
