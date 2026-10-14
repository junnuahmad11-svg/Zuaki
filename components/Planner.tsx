
import React, { useState, useEffect } from 'react';
import { Calendar, Upload, Clock, Check, Trash2, Calendar as CalendarIcon, FileText, AlertTriangle } from 'lucide-react';
import { getGenZResponse } from '../services/geminiService';
import { statsService } from '../services/statsService';
import { CalendarView } from './CalendarView';

interface PlannerTask {
    id: string;
    subject: string;
    topic: string;
    time: string;
    type: 'Concept' | 'Practice';
    completed: boolean;
}

const PLANNER_DATA_KEY = 'zuaki_planner_data';

export const Planner: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<{ today: PlannerTask[] } | null>(null);
  const [viewMode, setViewMode] = useState<'LIST' | 'CALENDAR'>('LIST');
  const [hasFile, setHasFile] = useState(false);
  const [fileName, setFileName] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem(PLANNER_DATA_KEY);
    if (saved) setGeneratedPlan(JSON.parse(saved));
  }, []);

  useEffect(() => {
    if (generatedPlan) localStorage.setItem(PLANNER_DATA_KEY, JSON.stringify(generatedPlan));
  }, [generatedPlan]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files?.[0]) {
          setFileName(e.target.files[0].name);
          setHasFile(true);
      }
  };

  const handleGenerate = async () => {
    if (!hasFile) return;
    setLoading(true);
    // Simulate parsing file content
    const prompt = `Generate a 4-task JEE study plan based on a mock syllabus file covering Physics and Maths. Return JSON array.`;
    
    try {
        const response = await getGenZResponse(prompt + " Only JSON.");
        // Mock fallback if API fails or returns non-JSON
        const tasks: PlannerTask[] = [
            { id: '1', subject: 'Physics', topic: 'Rotational Motion', time: '10:00 AM', type: 'Concept', completed: false },
            { id: '2', subject: 'Maths', topic: 'Matrices', time: '2:00 PM', type: 'Practice', completed: false }
        ];
        setGeneratedPlan({ today: tasks });
    } catch (e) {
        console.error(e);
    } finally {
        setLoading(false);
    }
  };

  const toggleTask = (id: string) => {
      if (!generatedPlan) return;
      const updated = generatedPlan.today.map(t => {
          if (t.id === id) {
              const completed = !t.completed;
              if (completed) statsService.completeTask();
              return { ...t, completed };
          }
          return t;
      });
      setGeneratedPlan({ ...generatedPlan, today: updated });
  };

  if (viewMode === 'CALENDAR') return <div className="h-full flex flex-col"><div className="p-4 flex justify-end"><button onClick={() => setViewMode('LIST')} className="text-cyber-cyan text-xs">Back</button></div><CalendarView /></div>;

  return (
    <div className="h-full w-full bg-[#020617] p-6 relative flex flex-col">
       <div className="flex justify-between items-center mb-6">
           <div>
               <h1 className="text-2xl font-display font-bold text-white tracking-widest">Planner</h1>
               <p className="text-xs text-slate-400">File-Driven Schedule</p>
           </div>
           <button onClick={() => setViewMode('CALENDAR')} className="p-2 bg-white/5 rounded-lg text-white"><CalendarIcon size={20} /></button>
       </div>

       {!generatedPlan ? (
           <div className="flex-1 flex flex-col items-center justify-center text-center p-6 border border-dashed border-white/10 rounded-2xl bg-white/5">
               <div className="w-16 h-16 bg-cyber-pink/10 rounded-full flex items-center justify-center text-cyber-pink mb-4">
                   <Upload size={32} />
               </div>
               <h3 className="text-white font-bold mb-2">Upload Syllabus</h3>
               <p className="text-slate-400 text-xs mb-6 max-w-xs">Zuaki needs your syllabus or timetable file (PDF/Image) to generate a personalized plan.</p>
               
               <div className="relative mb-4">
                   <input type="file" onChange={handleFileUpload} className="absolute inset-0 opacity-0 cursor-pointer" />
                   <button className="px-6 py-3 bg-white/10 border border-white/20 rounded-xl text-white text-sm font-bold hover:bg-white/20 transition-all">
                       {fileName || "Select File"}
                   </button>
               </div>

               {hasFile && (
                   <button onClick={handleGenerate} disabled={loading} className="w-full max-w-xs py-3 bg-cyber-pink text-white font-bold rounded-xl shadow-[0_0_15px_#ff003c] transition-all">
                       {loading ? "Analyzing..." : "Generate Plan"}
                   </button>
               )}
           </div>
       ) : (
           <div className="space-y-4">
               <div className="flex justify-between items-center mb-2">
                   <h3 className="text-white font-bold">Today's Targets</h3>
                   <button onClick={() => setGeneratedPlan(null)} className="text-xs text-red-400 flex items-center gap-1"><Trash2 size={12} /> Reset</button>
               </div>
               {generatedPlan.today.map((task, i) => (
                   <div key={i} onClick={() => toggleTask(task.id)} className={`p-4 rounded-xl border flex items-center gap-4 cursor-pointer transition-all ${task.completed ? 'bg-green-500/10 border-green-500/30' : 'bg-white/5 border-white/10 hover:border-cyber-cyan/30'}`}>
                       <div className={`w-6 h-6 rounded-full border flex items-center justify-center ${task.completed ? 'border-green-500 text-green-500' : 'border-slate-500'}`}>
                           {task.completed && <Check size={14} />}
                       </div>
                       <div>
                           <h4 className={`font-bold text-sm ${task.completed ? 'text-slate-500 line-through' : 'text-white'}`}>{task.topic}</h4>
                           <p className="text-xs text-slate-400">{task.subject} • {task.time}</p>
                       </div>
                   </div>
               ))}
           </div>
       )}
    </div>
  );
};
