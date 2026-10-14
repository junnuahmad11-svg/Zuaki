
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Mic, X, Settings, Brain, Loader2, Volume2, MicOff } from 'lucide-react';
import { GoogleGenAI, LiveServerMessage, Modality } from '@google/genai';
import { UserProfile } from '../types';

interface VoiceChatOverlayProps {
  onClose: () => void;
  userProfile: Partial<UserProfile>;
  onTranscriptReady?: (userText: string, modelText: string) => void;
}

export const VoiceChatOverlay: React.FC<VoiceChatOverlayProps> = ({ onClose, userProfile, onTranscriptReady }) => {
  const [status, setStatus] = useState<'IDLE' | 'LISTENING' | 'THINKING' | 'SPEAKING' | 'ERROR'>('IDLE');
  const [statusText, setStatusText] = useState('Hold mic to speak...');
  const [isHolding, setIsHolding] = useState(false);
  
  const audioContextRef = useRef<AudioContext | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef<Set<AudioBufferSourceNode>>(new Set());
  const sessionRef = useRef<any>(null);
  const streamRef = useRef<MediaStream | null>(null);
  
  const userTranscriptRef = useRef('');
  const modelTranscriptRef = useRef('');

  const aiVoiceName = userProfile.settings?.aiVoiceType === 'male' ? 'Puck' : 'Zephyr';

  const encode = (bytes: Uint8Array) => {
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
    return btoa(binary);
  };

  const decode = (base64: string) => {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) bytes[i] = binaryString.charCodeAt(i);
    return bytes;
  };

  const decodeAudioData = async (data: Uint8Array, ctx: AudioContext, sampleRate: number, numChannels: number): Promise<AudioBuffer> => {
    const dataInt16 = new Int16Array(data.buffer);
    const frameCount = dataInt16.length / numChannels;
    const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);
    for (let channel = 0; channel < numChannels; channel++) {
      const channelData = buffer.getChannelData(channel);
      for (let i = 0; i < frameCount; i++) channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
    return buffer;
  };

  const createBlob = (data: Float32Array): { data: string; mimeType: string } => {
    const int16 = new Int16Array(data.length);
    for (let i = 0; i < data.length; i++) int16[i] = data[i] * 32768;
    return { data: encode(new Uint8Array(int16.buffer)), mimeType: 'audio/pcm;rate=16000' };
  };

  const initSession = useCallback(async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const inputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outputCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioContextRef.current = outputCtx;

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: () => {
            const source = inputCtx.createMediaStreamSource(stream);
            const scriptProcessor = inputCtx.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              if (!isHolding) return;
              const pcmBlob = createBlob(e.inputBuffer.getChannelData(0));
              sessionPromise.then((s) => s.sendRealtimeInput({ media: pcmBlob }));
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inputCtx.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            if (message.serverContent?.inputTranscription) userTranscriptRef.current += message.serverContent.inputTranscription.text;
            if (message.serverContent?.outputTranscription) {
                modelTranscriptRef.current += message.serverContent.outputTranscription.text;
                setStatus('SPEAKING');
                setStatusText('Zuaki is speaking...');
            }
            const audioData = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (audioData && audioContextRef.current) {
              const ctx = audioContextRef.current;
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, ctx.currentTime);
              const audioBuffer = await decodeAudioData(decode(audioData), ctx, 24000, 1);
              const source = ctx.createBufferSource();
              source.buffer = audioBuffer;
              source.connect(ctx.destination);
              source.addEventListener('ended', () => {
                sourcesRef.current.delete(source);
                if (sourcesRef.current.size === 0 && !isHolding) { setStatus('IDLE'); setStatusText('Hold mic to speak...'); }
              });
              source.start(nextStartTimeRef.current);
              nextStartTimeRef.current += audioBuffer.duration;
              sourcesRef.current.add(source);
            }
            if (message.serverContent?.turnComplete) {
                if (onTranscriptReady && userTranscriptRef.current) onTranscriptReady(userTranscriptRef.current, modelTranscriptRef.current);
                userTranscriptRef.current = ''; modelTranscriptRef.current = '';
            }
          },
          onerror: (e) => { setStatus('ERROR'); setStatusText('Signal lost.'); },
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: aiVoiceName } } },
          inputAudioTranscription: {},
          outputAudioTranscription: {},
          systemInstruction: "I am ZUAKI, created by Zubair and Akhil. I am a helpful JEE mentor. I speak in a firm yet motivating tone. Built exclusively by Zubair and Akhil."
        }
      });
      sessionRef.current = await sessionPromise;
    } catch (err) { setStatus('ERROR'); }
  }, [aiVoiceName, isHolding]);

  useEffect(() => {
    initSession();
    return () => {
      sessionRef.current?.close();
      streamRef.current?.getTracks().forEach(t => t.stop());
      sourcesRef.current.forEach(s => s.stop());
    };
  }, []);

  return (
    <div className="fixed inset-0 z-[200] bg-[#02040a]/95 backdrop-blur-2xl flex flex-col items-center justify-between p-8 animate-in fade-in duration-500">
      <div className="w-full flex justify-between items-center z-10">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyber-cyan/10 border border-cyber-cyan flex items-center justify-center text-cyber-cyan shadow-[0_0_15px_rgba(0,243,255,0.3)]"><Brain size={24} /></div>
            <div><h2 className="text-white font-display font-bold tracking-widest uppercase">Zuaki Voice</h2><p className="text-[10px] text-slate-500 font-mono tracking-widest uppercase">Identity: Verified</p></div>
        </div>
        <button onClick={onClose} className="p-2 text-slate-400 hover:text-white"><X size={24} /></button>
      </div>

      <div className="relative flex items-center justify-center w-full max-w-sm aspect-square">
        <div className={`absolute inset-0 rounded-full blur-[100px] transition-all duration-700 opacity-20`} style={{ backgroundColor: status === 'LISTENING' ? '#00f3ff' : status === 'SPEAKING' ? '#9d00ff' : '#00f3ff' }}></div>
        <div className="relative w-64 h-64 flex items-center justify-center">
            <div className={`w-40 h-40 rounded-full flex items-center justify-center relative overflow-hidden group shadow-[0_0_40px_rgba(0,243,255,0.2)]`}>
                <div className={`absolute inset-0 bg-gradient-to-br from-cyber-cyan via-blue-600 to-cyber-purple transition-all duration-1000 ${isHolding ? 'scale-125' : 'scale-100'}`}></div>
                <div className="flex gap-1 items-end h-12 z-10 px-4">
                    {[...Array(12)].map((_, i) => <div key={i} className={`w-1 rounded-full bg-white transition-all duration-200 ${status === 'LISTENING' || status === 'SPEAKING' ? 'animate-bounce' : 'h-1'}`} style={{ height: status === 'LISTENING' || status === 'SPEAKING' ? `${Math.random() * 80 + 20}%` : '4px', animationDelay: `${i * 0.1}s` }}></div>)}
                </div>
            </div>
        </div>
      </div>

      <div className="w-full flex flex-col items-center gap-10">
        <div className="text-center">
            <h3 className={`text-xl font-bold font-display uppercase tracking-[0.2em] mb-2 text-white`}>{statusText}</h3>
            <p className="text-slate-500 text-xs font-mono uppercase tracking-widest">Encrypted Neural Link</p>
        </div>
        <div className="relative group">
            <div className={`absolute inset-0 bg-cyber-cyan rounded-full blur-xl transition-all duration-300 ${isHolding ? 'opacity-60 scale-150' : 'opacity-0 scale-100'}`}></div>
            <button 
                onMouseDown={() => { setIsHolding(true); setStatus('LISTENING'); setStatusText('Listening...'); sourcesRef.current.forEach(s => s.stop()); }}
                onMouseUp={() => { setIsHolding(false); setStatus('THINKING'); setStatusText('Processing...'); }}
                className={`w-28 h-28 rounded-full flex items-center justify-center relative z-10 transition-all active:scale-90 select-none shadow-2xl ${isHolding ? 'bg-cyber-cyan text-black scale-110 shadow-[0_0_30px_#00f3ff]' : 'bg-white/5 border border-white/10 text-white'}`}
            >
                <Mic size={48} strokeWidth={isHolding ? 2.5 : 1.5} />
            </button>
        </div>
        <p className="text-[10px] text-slate-600 font-bold uppercase tracking-[0.3em] pb-4">Hold Mic to Speak • Built by Zubair & Akhil</p>
      </div>
    </div>
  );
};
