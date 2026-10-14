
import React, { useEffect, useState } from 'react';
import { Trophy, Medal, Crown, Globe, Users, Star, ArrowUp } from 'lucide-react';
import { firebase } from '../services/backend';

export const Leaderboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'GLOBAL' | 'FRIENDS'>('GLOBAL');
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const currentUser = 'You'; // Mock current user name

  useEffect(() => {
      const fetchLB = async () => {
          setLoading(true);
          try {
              // Simulating Data Fetch based on tab
              const result = await firebase.firestore().collection('leaderboard/jee_mains').get();
              let data = result.docs.map(d => d.data());
              
              if (activeTab === 'FRIENDS') {
                  // Filter mock logic for friends
                  data = data.filter((_, i) => i % 2 === 0 || _.username === currentUser);
              }
              
              setUsers(data.sort((a,b) => b.xp - a.xp));
          } catch (e) { console.error(e); } 
          finally { setLoading(false); }
      };
      fetchLB();
  }, [activeTab]);

  const getRankBadge = (index: number) => {
      if (index === 0) return <div className="w-8 h-8 rounded-full bg-yellow-500/20 border border-yellow-500 flex items-center justify-center text-yellow-500 shadow-[0_0_15px_#eab308]"><Crown size={16} fill="currentColor" /></div>;
      if (index === 1) return <div className="w-8 h-8 rounded-full bg-slate-300/20 border border-slate-300 flex items-center justify-center text-slate-300"><Medal size={16} /></div>;
      if (index === 2) return <div className="w-8 h-8 rounded-full bg-amber-700/20 border border-amber-700 flex items-center justify-center text-amber-700"><Medal size={16} /></div>;
      return <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-400 font-bold text-sm">#{index + 1}</div>;
  };

  return (
    <div className="h-full w-full bg-[#020617] relative overflow-hidden flex flex-col">
        {/* Background Ambience */}
        <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-cyber-yellow/5 rounded-full blur-[100px] pointer-events-none"></div>
        
        {/* Header */}
        <div className="p-6 pb-4 z-10">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-3xl font-display font-bold text-white uppercase tracking-widest flex items-center gap-3">
                        <Trophy size={32} className="text-cyber-yellow" /> Leaderboard
                    </h1>
                    <p className="text-xs text-slate-400 font-mono mt-1">Season 4 • JEE Mains</p>
                </div>
            </div>

            {/* Toggle Tabs */}
            <div className="flex p-1 bg-white/5 rounded-xl border border-white/10 max-w-md">
                <button 
                    onClick={() => setActiveTab('GLOBAL')}
                    className={`flex-1 py-3 rounded-lg text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${activeTab === 'GLOBAL' ? 'bg-cyber-yellow text-black shadow-[0_0_15px_#fcee0a]' : 'text-slate-400 hover:text-white'}`}
                >
                    <Globe size={14} /> Global
                </button>
                <button 
                    onClick={() => setActiveTab('FRIENDS')}
                    className={`flex-1 py-3 rounded-lg text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${activeTab === 'FRIENDS' ? 'bg-cyber-purple text-white shadow-[0_0_15px_#9d00ff]' : 'text-slate-400 hover:text-white'}`}
                >
                    <Users size={14} /> Friends
                </button>
            </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-6 pb-24 z-10">
            {loading ? (
                <div className="text-center text-slate-500 py-20 animate-pulse">Syncing Rankings...</div>
            ) : users.length === 0 ? (
                <div className="text-center py-20 border border-white/10 rounded-2xl bg-white/5">
                    <p className="text-slate-400 mb-2">No data available.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {/* Top 3 Podium (Optional Visuals) */}
                    
                    {/* List Items */}
                    {users.map((u, i) => {
                        const isMe = u.username === currentUser;
                        return (
                            <div 
                                key={i} 
                                className={`p-4 rounded-2xl border flex items-center gap-4 transition-all hover:scale-[1.01] ${
                                    isMe 
                                    ? 'bg-cyber-cyan/10 border-cyber-cyan shadow-[0_0_20px_rgba(0,243,255,0.1)]' 
                                    : 'bg-white/5 border-white/5 hover:bg-white/10'
                                }`}
                            >
                                <div className="shrink-0">
                                    {getRankBadge(i)}
                                </div>
                                
                                <div className="relative">
                                    <img src={u.avatar} className="w-12 h-12 rounded-full border-2 border-white/10 object-cover" />
                                    {isMe && <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-cyber-cyan rounded-full border-2 border-black flex items-center justify-center"><Star size={8} className="text-black fill-current" /></div>}
                                </div>
                                
                                <div className="flex-1 min-w-0">
                                    <h4 className={`font-bold text-sm truncate ${isMe ? 'text-cyber-cyan' : 'text-white'}`}>{u.username}</h4>
                                    <div className="flex items-center gap-3 mt-1">
                                        <span className="text-[10px] text-slate-400 bg-white/5 px-1.5 rounded flex items-center gap-1">
                                            {u.streak} Day Streak
                                        </span>
                                        <span className="text-[10px] text-green-400 flex items-center gap-0.5">
                                            <ArrowUp size={10} /> 12
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="text-right">
                                    <div className="font-mono text-lg font-bold text-white">{u.xp.toLocaleString()}</div>
                                    <div className="text-[10px] text-slate-500 uppercase tracking-wider">Points</div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    </div>
  );
};
