
import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Circle } from 'lucide-react';

export const CalendarView: React.FC = () => {
    const [currentDate, setCurrentDate] = useState(new Date());
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

    const renderDays = () => {
        const days = [];
        // Empty slots for previous month
        for (let i = 0; i < (firstDay === 0 ? 6 : firstDay - 1); i++) {
            days.push(<div key={`empty-${i}`} className="h-24 bg-transparent"></div>);
        }
        
        for (let i = 1; i <= daysInMonth; i++) {
            const isToday = i === new Date().getDate() && currentDate.getMonth() === new Date().getMonth();
            days.push(
                <div key={i} className={`h-24 border border-white/5 p-2 relative group hover:bg-white/5 transition-colors ${isToday ? 'bg-cyber-cyan/10 border-cyber-cyan/30' : ''}`}>
                    <span className={`text-sm font-bold ${isToday ? 'text-cyber-cyan' : 'text-slate-400'}`}>{i}</span>
                    {/* Mock events */}
                    {(i % 3 === 0) && (
                        <div className="mt-2 text-[10px] bg-cyber-purple/20 text-cyber-purple px-1 rounded truncate">
                            Physics Test
                        </div>
                    )}
                    {(i % 5 === 0) && (
                        <div className="mt-1 text-[10px] bg-cyber-pink/20 text-cyber-pink px-1 rounded truncate">
                            Revision
                        </div>
                    )}
                </div>
            );
        }
        return days;
    };

    return (
        <div className="h-full w-full bg-[#020617] p-6 flex flex-col overflow-hidden">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <h1 className="text-2xl font-display font-bold text-white uppercase tracking-widest flex items-center gap-2">
                        <CalendarIcon className="text-cyber-cyan" /> Schedule
                    </h1>
                    <span className="text-xl text-slate-400 font-mono">
                        {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                    </span>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))} className="p-2 hover:bg-white/10 rounded-full text-white"><ChevronLeft /></button>
                    <button onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))} className="p-2 hover:bg-white/10 rounded-full text-white"><ChevronRight /></button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-px bg-white/10 border border-white/10 rounded-t-xl overflow-hidden text-center py-2 text-xs font-bold text-slate-400 uppercase tracking-widest">
                <div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div><div>Sun</div>
            </div>
            
            <div className="grid grid-cols-7 gap-px bg-white/10 border-x border-b border-white/10 rounded-b-xl overflow-hidden flex-1 overflow-y-auto custom-scrollbar">
                {renderDays()}
            </div>
        </div>
    );
};
