
import React, { useState, useEffect } from 'react';
import { Search, PlayCircle, X, Loader2, Youtube, Clock, ExternalLink, Globe, Play } from 'lucide-react';
import { youtube } from '../services/backend';
import { VideoResource } from '../types';

export const ZukaiTube: React.FC = () => {
  const [query, setQuery] = useState('');
  const [videos, setVideos] = useState<VideoResource[]>([]);
  const [loading, setLoading] = useState(false);
  const [playingVideo, setPlayingVideo] = useState<VideoResource | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (overrideQuery?: string) => {
    const searchTerm = overrideQuery || query;
    if (!searchTerm.trim()) return;
    
    setLoading(true);
    setError(null);
    try {
      const results = await youtube.searchVideos(searchTerm);
      if (results.length === 0) {
        setError("No lecture streams found on the global network.");
      }
      setVideos(results);
    } catch (err) {
      setError("Signal lost. Could not connect to YouTube API.");
    } finally {
      setLoading(false);
    }
  };

  const decodeHtml = (html: string) => {
    const txt = document.createElement("textarea");
    txt.innerHTML = html;
    return txt.value;
  };

  return (
    <div className="h-full w-full bg-[#020617] flex flex-col relative overflow-hidden font-sans">
      {/* Search Header */}
      <div className="p-6 border-b border-white/5 bg-[#0b0f1a]/80 backdrop-blur-xl z-20 sticky top-0">
        <div className="max-w-4xl mx-auto flex flex-col gap-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-red-600/10 border border-red-600/30 rounded-xl text-red-500">
                        <Youtube size={20} />
                    </div>
                    <h1 className="text-xl font-display font-bold text-white tracking-widest uppercase">ZukaiTube</h1>
                </div>
                <div className="flex items-center gap-2 px-3 py-1 bg-white/5 rounded-full border border-white/10">
                    <Globe size={12} className="text-cyber-cyan animate-pulse" />
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest">Global Link Active</span>
                </div>
            </div>

            <div className="relative group">
                <Search className="absolute left-4 top-3.5 text-slate-500 group-focus-within:text-cyber-cyan transition-colors" size={20} />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    placeholder="Search JEE One-Shots, PHY/CHE/MATH Lectures..."
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder-slate-600 focus:outline-none focus:border-cyber-cyan/50 focus:shadow-[0_0_25px_rgba(0,243,255,0.1)] transition-all font-sans text-sm"
                />
                {loading && (
                    <div className="absolute right-4 top-3.5 animate-spin text-cyber-cyan">
                    <Loader2 size={20} />
                    </div>
                )}
            </div>

            {/* Quick Filters */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar">
                {['JEE One Shot', 'Physics Galaxy', 'Organic Chem', 'Maths Pyqs'].map(tag => (
                    <button 
                        key={tag} 
                        onClick={() => { setQuery(tag); handleSearch(tag); }}
                        className="px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-[10px] font-bold text-slate-400 hover:text-white hover:border-white/30 whitespace-nowrap transition-all uppercase tracking-widest"
                    >
                        {tag}
                    </button>
                ))}
            </div>
        </div>
      </div>

      {/* Video Content Grid */}
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6 pb-20">
          {error && (
            <div className="col-span-full text-center py-20 opacity-50">
              <p className="text-slate-400 font-mono text-sm uppercase tracking-widest">{error}</p>
            </div>
          )}

          {!loading && videos.map((video) => (
            <div
              key={video.id}
              onClick={() => setPlayingVideo(video)}
              className="group flex flex-col bg-white/5 border border-white/5 rounded-[32px] hover:border-cyber-cyan/30 transition-all cursor-pointer relative overflow-hidden shadow-xl"
            >
              {/* Thumbnail */}
              <div className="relative aspect-video rounded-t-[32px] overflow-hidden bg-black shrink-0">
                <img
                  src={video.thumbnail}
                  className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  alt={video.title}
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="w-16 h-16 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20">
                        <Play size={32} fill="currentColor" className="ml-1" />
                    </div>
                </div>
                <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/80 backdrop-blur-md rounded text-[10px] font-mono font-bold text-white border border-white/10 flex items-center gap-1.5">
                  <Clock size={10} className="text-cyber-cyan" /> {video.duration}
                </div>
              </div>

              {/* Info */}
              <div className="p-5 flex flex-col flex-1">
                <h3 className="text-white font-bold text-sm mb-3 leading-tight group-hover:text-cyber-cyan transition-colors line-clamp-2">
                  {decodeHtml(video.title)}
                </h3>
                <div className="mt-auto flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-red-600/10 flex items-center justify-center border border-red-600/20">
                            <Youtube size={14} className="text-red-500" />
                        </div>
                        <p className="text-slate-500 text-[10px] font-bold uppercase tracking-wider truncate max-w-[120px]">{video.channel}</p>
                    </div>
                    <span className="text-cyber-cyan text-[10px] font-bold uppercase tracking-widest flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                        Watch <ExternalLink size={10} />
                    </span>
                </div>
              </div>
            </div>
          ))}

          {/* Empty State / Logo Background */}
          {!loading && videos.length === 0 && !error && (
            <div className="col-span-full flex flex-col items-center justify-center py-40 opacity-10 grayscale">
              <Youtube size={120} strokeWidth={1} className="mb-4" />
              <p className="text-3xl font-display font-bold uppercase tracking-[0.5em]">ZukaiTube</p>
              <p className="text-xs font-mono tracking-[0.3em] mt-2 uppercase">Neural Lecture Discovery Active</p>
            </div>
          )}
        </div>
      </div>

      {/* Premium Theater Overlay */}
      {playingVideo && (
        <div className="fixed inset-0 z-[100] bg-black/98 backdrop-blur-2xl flex flex-col items-center justify-center animate-in fade-in duration-300">
          <div className="w-full max-w-6xl h-full flex flex-col p-4 md:p-12">
            
            {/* Player Controls Header */}
            <div className="flex justify-between items-center bg-white/5 p-5 rounded-t-[32px] border border-white/10 border-b-0 backdrop-blur-xl">
               <div className="flex items-center gap-4 min-w-0">
                  <Youtube className="text-red-500 shrink-0" size={24} />
                  <div className="min-w-0">
                    <h2 className="text-white font-bold text-base truncate max-w-[200px] md:max-w-lg">
                        {decodeHtml(playingVideo.title)}
                    </h2>
                    <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">{playingVideo.channel}</p>
                  </div>
               </div>
               <button 
                onClick={() => setPlayingVideo(null)}
                className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-red-600/20 hover:border-red-600/50 transition-all flex items-center justify-center shadow-lg"
               >
                <X size={24} />
               </button>
            </div>

            {/* Embed Iframe */}
            <div className="flex-1 bg-black border-x border-white/10 relative shadow-[0_0_60px_rgba(0,0,0,1)]">
              <iframe
                src={`https://www.youtube.com/embed/${playingVideo.id}?autoplay=1&rel=0&modestbranding=1&showinfo=0`}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
            
            {/* Player Footer */}
            <div className="bg-white/5 p-4 rounded-b-[32px] border border-white/10 border-t-0 flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex gap-4">
                    <div className="flex flex-col">
                        <span className="text-[8px] text-slate-500 uppercase font-black tracking-widest">Network Speed</span>
                        <span className="text-[10px] text-green-500 font-mono">Ultra Low Latency</span>
                    </div>
                    <div className="flex flex-col border-l border-white/10 pl-4">
                        <span className="text-[8px] text-slate-500 uppercase font-black tracking-widest">Protocol</span>
                        <span className="text-[10px] text-cyber-cyan font-mono">Secure ZUKAI Stream</span>
                    </div>
                </div>
                <p className="text-center text-[10px] text-slate-500 uppercase tracking-[0.4em] font-mono opacity-50">
                    Proprietary Learning Environment • V4.1
                </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
