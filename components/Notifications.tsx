
import React, { useState, useEffect, useCallback } from 'react';
import { Bell, Zap, User, BarChart2, FileText, Settings, Check, Trash2, ChevronRight, AlertCircle, Info, RefreshCw, ShieldCheck, Globe, Bookmark, ExternalLink, Loader2 } from 'lucide-react';
import { notificationService } from '../services/notificationService';
import { nta } from '../services/backend';
import { ZuakiNotification, NotificationCategory, NTAUpdate } from '../types';

const SYNC_INTERVAL = 5 * 60 * 60 * 1000; // 5 Hours in ms

export const Notifications: React.FC<{ onChangeView?: (v: string) => void }> = ({ onChangeView }) => {
    const [activeTab, setActiveTab] = useState<'NTA' | 'MISSION'>('NTA');
    const [ntaUpdates, setNtaUpdates] = useState<NTAUpdate[]>([]);
    const [notifications, setNotifications] = useState<ZuakiNotification[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [lastSync, setLastSync] = useState<number>(0);

    const loadData = useCallback(async (isManual = false) => {
        setLoading(true);
        setError(null);
        try {
            // 1. Fetch live NTA news via search grounding
            const news = await nta.fetchUpdates();
            setNtaUpdates(news);

            // 2. Fetch live Mission log (App internal notifications)
            const log = notificationService.getAll();
            setNotifications(log);

            const now = Date.now();
            setLastSync(now);
            localStorage.setItem('zuaki_last_sync', now.toString());
        } catch (err: any) {
            setError(err.message || "Failed to sync with live data sources.");
        } finally {
            setLoading(false);
        }
    }, []);

    // 5-Hour Auto Sync Logic
    useEffect(() => {
        const storedSync = localStorage.getItem('zuaki_last_sync');
        const now = Date.now();
        
        if (!storedSync || (now - parseInt(storedSync)) > SYNC_INTERVAL) {
            loadData();
        } else {
            setLastSync(parseInt(storedSync));
            // Just load mission log from local store if NTA news is still "fresh" (< 5h)
            setNotifications(notificationService.getAll());
            // We still want the fresh NTA from memory or a cached list? 
            // For true "live" feel, we fetch if empty
            if (ntaUpdates.length === 0) loadData();
        }

        // Periodic check while app is open
        const interval = setInterval(() => {
            const current = Date.now();
            const last = parseInt(localStorage.getItem('zuaki_last_sync') || '0');
            if ((current - last) > SYNC_INTERVAL) {
                loadData();
            }
        }, 60000); // Check every minute

        return () => clearInterval(interval);
    }, [loadData]);

    const handleNtaClick = (update: NTAUpdate) => {
        nta.markRead(update.id);
        setNtaUpdates(prev => prev.map(n => n.id === update.id ? { ...n, isRead: true } : n));
        if (update.link) window.open(update.link, '_blank');
    };

    const handleMissionClick = (n: ZuakiNotification) => {
        notificationService.markAsRead(n.id);
        setNotifications(prev => prev.map(m => m.id === n.id ? { ...m, read: true } : m));
        if (onChangeView && n.deepLink) onChangeView(n.deepLink);
    };

    const clearMissions = () => {
        if (window.confirm("Purge all system notifications?")) {
            notificationService.markAllRead();
            setNotifications(prev => prev.map(n => ({...n, read: true})));
        }
    };

    const formatLastSync = () => {
        if (!lastSync) return 'Never';
        return new Date(lastSync).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="h-full w-full bg-[#020617] flex flex-col relative overflow-hidden font-sans">
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5 pointer-events-none"></div>

            {/* SYNC HEADER */}
            <div className="p-6 bg-black/20 backdrop-blur-xl border-b border-white/5 z-20">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-3xl font-display font-bold text-white uppercase tracking-widest flex items-center gap-3">
                            <Globe className="text-cyber-cyan shadow-[0_0_10px_#00f3ff]" /> Comms Hub
                        </h1>
                        <p className="text-slate-500 text-[10px] font-mono uppercase tracking-[0.2em] mt-1">
                            Live Node Sync • Last: {formatLastSync()}
                        </p>
                    </div>
                    <button 
                        onClick={() => loadData(true)}
                        disabled={loading}
                        className={`p-3 rounded-2xl bg-white/5 border border-white/10 text-white transition-all hover:bg-white/10 active:scale-95 ${loading ? 'animate-spin-slow' : ''}`}
                    >
                        {loading ? <Loader2 size={20} className="animate-spin" /> : <RefreshCw size={20} />}
                    </button>
                </div>

                <div className="flex bg-white/5 rounded-2xl p-1 border border-white/10 max-w-sm">
                    <button 
                        onClick={() => setActiveTab('NTA')}
                        className={`flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${activeTab === 'NTA' ? 'bg-cyber-cyan text-black shadow-[0_0_15px_#00f3ff]' : 'text-slate-500 hover:text-white'}`}
                    >
                        <ShieldCheck size={16} /> NTA Portal
                    </button>
                    <button 
                        onClick={() => setActiveTab('MISSION')}
                        className={`flex-1 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${activeTab === 'MISSION' ? 'bg-cyber-purple text-white shadow-[0_0_15px_#9d00ff]' : 'text-slate-500 hover:text-white'}`}
                    >
                        <Zap size={16} /> Mission Log
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto custom-scrollbar p-6 z-10">
                {error && (
                    <div className="max-w-2xl mx-auto p-6 bg-red-900/20 border border-red-500/30 rounded-[32px] text-center mb-8 animate-in slide-in-from-top-4">
                        <AlertCircle size={40} className="text-red-500 mx-auto mb-4" />
                        <h3 className="text-white font-bold mb-2 uppercase">Neural Link Failure</h3>
                        <p className="text-red-400 text-sm mb-6">{error}</p>
                        <button onClick={() => loadData(true)} className="px-8 py-3 bg-red-600 text-white font-bold rounded-xl text-xs uppercase tracking-widest hover:bg-red-500">Retry Sync</button>
                    </div>
                )}

                {loading && ntaUpdates.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 animate-pulse opacity-50">
                        <Loader2 size={64} className="text-cyber-cyan animate-spin mb-4" />
                        <p className="text-sm font-mono uppercase tracking-[0.3em] text-white">Fetching Live Archives...</p>
                    </div>
                ) : (
                    <div className="max-w-3xl mx-auto space-y-4 pb-20">
                        {activeTab === 'NTA' ? (
                            ntaUpdates.map((update) => (
                                <div 
                                    key={update.id} 
                                    onClick={() => handleNtaClick(update)}
                                    className={`group relative p-6 rounded-[32px] border transition-all cursor-pointer bg-[#0b0f1a] hover:bg-black/60 overflow-hidden ${update.isRead ? 'border-white/5 opacity-60' : 'border-cyber-cyan/30 shadow-[0_0_20px_rgba(0,243,255,0.05)] hover:border-cyber-cyan'}`}
                                >
                                    {!update.isRead && <div className="absolute top-6 right-6 w-2 h-2 bg-cyber-cyan rounded-full shadow-[0_0_10px_#00f3ff] animate-pulse"></div>}
                                    
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className={`px-3 py-1 rounded-full text-[9px] font-bold uppercase tracking-widest border ${
                                            update.type === 'CRITICAL' ? 'bg-red-500/20 border-red-500/50 text-red-400' : 
                                            update.type === 'IMPORTANT' ? 'bg-yellow-500/20 border-yellow-500/50 text-yellow-400' : 
                                            'bg-blue-500/20 border-blue-500/50 text-blue-400'
                                        }`}>
                                            {update.type}
                                        </span>
                                        <span className="text-[10px] text-slate-500 font-mono">{update.date}</span>
                                    </div>

                                    <h3 className={`text-lg font-bold mb-2 leading-tight ${update.isRead ? 'text-slate-400' : 'text-white'}`}>
                                        {update.title}
                                    </h3>
                                    <p className="text-slate-400 text-sm line-clamp-2 mb-4 leading-relaxed">{update.description}</p>
                                    
                                    <div className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-cyber-cyan">
                                        Verified Source <ExternalLink size={12} />
                                    </div>
                                </div>
                            ))
                        ) : (
                            <>
                                <div className="flex justify-between items-center mb-6 px-2">
                                    <h3 className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">Active System Protocols</h3>
                                    <button onClick={clearMissions} className="text-red-400 hover:text-white text-[10px] uppercase font-bold tracking-widest flex items-center gap-2">
                                        <Trash2 size={12} /> Purge Log
                                    </button>
                                </div>
                                {notifications.map((n) => (
                                    <div 
                                        key={n.id} 
                                        onClick={() => handleMissionClick(n)}
                                        className={`p-5 rounded-[28px] border transition-all cursor-pointer flex gap-5 items-center group ${n.read ? 'bg-white/5 border-white/5 opacity-50' : 'bg-[#0b0f1a] border-white/10 hover:border-cyber-purple shadow-xl'}`}
                                    >
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border ${
                                            n.category === 'MISSION' ? 'bg-cyber-yellow/10 border-cyber-yellow/30 text-cyber-yellow' : 
                                            n.category === 'PERFORMANCE' ? 'bg-green-500/10 border-green-500/30 text-green-400' : 
                                            'bg-cyber-purple/10 border-cyber-purple/30 text-cyber-purple'
                                        }`}>
                                            <Zap size={20} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-baseline mb-1">
                                                <span className="text-[9px] font-bold uppercase text-slate-500 tracking-widest">{n.category}</span>
                                                <span className="text-[8px] text-slate-600 font-mono">{new Date(n.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                            </div>
                                            <h4 className="text-white font-bold text-sm truncate group-hover:text-cyber-purple transition-colors">{n.title}</h4>
                                            <p className="text-slate-500 text-xs truncate">{n.body}</p>
                                        </div>
                                        <ChevronRight size={16} className="text-slate-700 group-hover:text-white transition-all" />
                                    </div>
                                ))}
                            </>
                        )}

                        {!loading && ntaUpdates.length === 0 && activeTab === 'NTA' && (
                            <div className="text-center py-32 opacity-20">
                                <ShieldCheck size={80} className="mx-auto mb-4" />
                                <p className="text-lg font-mono uppercase tracking-[0.4em]">Zero Notifications</p>
                                <p className="text-xs mt-2 italic">Neural Network silent...</p>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};
