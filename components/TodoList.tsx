
import React, { useState } from 'react';
import { Plus, CheckCircle, Circle, Trash } from 'lucide-react';
import { Task } from '../types';

export const TodoList: React.FC = () => {
    const [tasks, setTasks] = useState<Task[]>([
        { id: '1', title: 'Calculus Ch. 4 Review', completed: false, dueDate: new Date(), subject: 'Math' },
        { id: '2', title: 'Submit History Essay', completed: true, dueDate: new Date(), subject: 'History' },
        { id: '3', title: 'Physics Lab Report', completed: false, dueDate: new Date(), subject: 'Physics' },
    ]);
    const [newTaskTitle, setNewTaskTitle] = useState('');

    const toggleTask = (id: string) => {
        setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    };

    const addTask = () => {
        if (!newTaskTitle.trim()) return;
        const newTask: Task = {
            id: Date.now().toString(),
            title: newTaskTitle,
            completed: false,
            dueDate: new Date(),
            subject: 'General'
        };
        setTasks([...tasks, newTask]);
        setNewTaskTitle('');
    };

    const deleteTask = (id: string) => {
        setTasks(tasks.filter(t => t.id !== id));
    };

    return (
        <div className="h-full w-full max-w-2xl mx-auto pt-10 overflow-y-auto custom-scrollbar px-4 pb-20">
            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none"></div>
                
                <h2 className="text-3xl font-bold text-white mb-6">Tasks & Reminders</h2>
                
                <div className="flex gap-2 mb-8">
                    <input 
                        type="text" 
                        value={newTaskTitle}
                        onChange={(e) => setNewTaskTitle(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && addTask()}
                        placeholder="Add a new task..."
                        className="flex-1 bg-black/20 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition-colors"
                    />
                    <button 
                        onClick={addTask}
                        className="bg-purple-600 hover:bg-purple-500 text-white rounded-xl px-4 transition-colors shadow-[0_0_15px_rgba(147,51,234,0.4)]"
                    >
                        <Plus size={24} />
                    </button>
                </div>

                <div className="space-y-3">
                    {tasks.map(task => (
                        <div 
                            key={task.id}
                            className={`group flex items-center justify-between p-4 rounded-xl border transition-all duration-300 ${
                                task.completed 
                                ? 'bg-white/5 border-white/5 opacity-50' 
                                : 'bg-white/10 border-white/10 hover:bg-white/15'
                            }`}
                        >
                            <div className="flex items-center gap-4">
                                <button 
                                    onClick={() => toggleTask(task.id)}
                                    className={`transition-colors ${task.completed ? 'text-green-400' : 'text-slate-400 hover:text-white'}`}
                                >
                                    {task.completed ? <CheckCircle size={24} /> : <Circle size={24} />}
                                </button>
                                <div>
                                    <p className={`text-lg font-medium transition-all ${task.completed ? 'text-slate-400 line-through' : 'text-white'}`}>
                                        {task.title}
                                    </p>
                                    <span className="text-xs text-purple-300 bg-purple-500/10 px-2 py-0.5 rounded border border-purple-500/20">{task.subject}</span>
                                </div>
                            </div>
                            <button 
                                onClick={() => deleteTask(task.id)}
                                className="text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"
                            >
                                <Trash size={20} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
