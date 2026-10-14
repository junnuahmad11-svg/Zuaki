
import { QuantumSession, QuantumConfig } from '../types';
import { statsService } from './statsService';

const STORAGE_KEY = 'zuaki_quantum_state';
const HISTORY_KEY = 'zuaki_quantum_history';
const CONFIG_KEY = 'zuaki_quantum_config';

export interface TimerState {
    mode: 'FOCUS' | 'SHORT_BREAK' | 'LONG_BREAK' | 'STOPWATCH';
    status: 'IDLE' | 'RUNNING' | 'PAUSED';
    timeLeft: number; // Seconds remaining (or elapsed for stopwatch)
    duration: number; // Total duration of current session type
    subject: string;
    task: string;
    endTime: number | null; // Timestamp when timer will end
    startTime: number | null; // For stopwatch
}

type TimerListener = (state: TimerState) => void;

class QuantumTimerService {
    private state: TimerState = {
        mode: 'FOCUS',
        status: 'IDLE',
        timeLeft: 25 * 60,
        duration: 25 * 60,
        subject: 'General',
        task: '',
        endTime: null,
        startTime: null
    };

    private config: QuantumConfig = {
        focusDuration: 25,
        shortBreak: 5,
        longBreak: 15,
        soundEnabled: true,
        notificationsEnabled: true,
        theme: 'CYAN'
    };

    private history: QuantumSession[] = [];
    private listeners: Set<TimerListener> = new Set();
    private intervalId: any = null;

    constructor() {
        this.loadData();
        this.requestNotificationPermission();
        
        // Recover state if page was reloaded while running
        if (this.state.status === 'RUNNING') {
            this.startTicker();
        }
    }

    private loadData() {
        try {
            const savedState = localStorage.getItem(STORAGE_KEY);
            if (savedState) this.state = JSON.parse(savedState);

            const savedConfig = localStorage.getItem(CONFIG_KEY);
            if (savedConfig) this.config = JSON.parse(savedConfig);

            const savedHistory = localStorage.getItem(HISTORY_KEY);
            if (savedHistory) this.history = JSON.parse(savedHistory);
        } catch (e) { console.error("Quantum Timer Load Error", e); }
    }

    private saveData() {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
        localStorage.setItem(CONFIG_KEY, JSON.stringify(this.config));
        localStorage.setItem(HISTORY_KEY, JSON.stringify(this.history));
        this.notify();
    }

    private requestNotificationPermission() {
        if ('Notification' in window && Notification.permission !== 'granted') {
            Notification.requestPermission();
        }
    }

    private sendNotification(title: string, body: string) {
        if (this.config.notificationsEnabled && 'Notification' in window && Notification.permission === 'granted') {
            new Notification(title, { body, icon: '/favicon.ico' });
        }
        if (this.config.soundEnabled) {
            // Simple beep logic or play audio file
            const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3'); 
            audio.volume = 0.5;
            audio.play().catch(e => console.log("Audio play blocked", e));
        }
    }

    // --- PUBLIC API ---

    public subscribe(cb: TimerListener) {
        this.listeners.add(cb);
        cb(this.state);
        return () => this.listeners.delete(cb);
    }

    private notify() {
        this.listeners.forEach(cb => cb({ ...this.state }));
    }

    public getState() { return { ...this.state }; }
    public getConfig() { return { ...this.config }; }
    public getHistory() { return [...this.history]; }

    public updateConfig(newConfig: Partial<QuantumConfig>) {
        this.config = { ...this.config, ...newConfig };
        
        // If idle, update current timeleft to match new config
        if (this.state.status === 'IDLE' && this.state.mode !== 'STOPWATCH') {
            const newDuration = this.getDurationForMode(this.state.mode) * 60;
            this.state.duration = newDuration;
            this.state.timeLeft = newDuration;
        }
        this.saveData();
    }

    public setTask(subject: string, task: string) {
        this.state.subject = subject;
        this.state.task = task;
        this.saveData();
    }

    public setMode(mode: 'FOCUS' | 'SHORT_BREAK' | 'LONG_BREAK' | 'STOPWATCH') {
        this.pause();
        this.state.mode = mode;
        this.state.status = 'IDLE';
        
        if (mode === 'STOPWATCH') {
            this.state.timeLeft = 0;
            this.state.duration = 0;
        } else {
            const dur = this.getDurationForMode(mode) * 60;
            this.state.timeLeft = dur;
            this.state.duration = dur;
        }
        this.saveData();
    }

    public start() {
        if (this.state.status === 'RUNNING') return;

        const now = Date.now();
        this.state.status = 'RUNNING';

        if (this.state.mode === 'STOPWATCH') {
            // For stopwatch, startTime is (Now - TimeElapsedSoFar)
            this.state.startTime = now - (this.state.timeLeft * 1000); 
        } else {
            // For timer, endTime is (Now + TimeLeft)
            this.state.endTime = now + (this.state.timeLeft * 1000);
        }

        this.startTicker();
        this.saveData();
    }

    public pause() {
        if (this.state.status !== 'RUNNING') return;
        
        this.state.status = 'PAUSED';
        this.stopTicker();
        this.state.endTime = null;
        this.state.startTime = null;
        this.saveData();
    }

    public reset() {
        this.pause();
        this.state.status = 'IDLE';
        if (this.state.mode === 'STOPWATCH') {
            this.state.timeLeft = 0;
        } else {
            this.state.timeLeft = this.state.duration;
        }
        this.saveData();
    }

    private startTicker() {
        if (this.intervalId) clearInterval(this.intervalId);
        this.intervalId = setInterval(() => this.tick(), 1000);
    }

    private stopTicker() {
        if (this.intervalId) clearInterval(this.intervalId);
        this.intervalId = null;
    }

    private tick() {
        const now = Date.now();

        if (this.state.mode === 'STOPWATCH') {
            if (this.state.startTime) {
                this.state.timeLeft = Math.floor((now - this.state.startTime) / 1000);
            }
        } else {
            // Countdown
            if (this.state.endTime) {
                const remaining = Math.ceil((this.state.endTime - now) / 1000);
                if (remaining <= 0) {
                    this.completeSession();
                } else {
                    this.state.timeLeft = remaining;
                }
            }
        }
        
        // Don't save to disk every second to save IO, only notify UI
        // We rely on endTime/startTime in localStorage for recovery
        this.notify();
    }

    private completeSession() {
        this.pause();
        this.state.timeLeft = 0;
        this.state.status = 'IDLE';
        
        const modeName = this.state.mode;
        
        // Reward Logic
        if (modeName === 'FOCUS') {
            const duration = this.state.duration; // seconds
            const minutes = Math.floor(duration / 60);
            
            // 1. Send Notification
            this.sendNotification("Quantum Focus Complete!", `You completed ${minutes} mins of ${this.state.subject}.`);
            
            // 2. Log History
            const session: QuantumSession = {
                id: Date.now().toString(),
                timestamp: Date.now(),
                duration: duration,
                subject: this.state.subject,
                task: this.state.task,
                mode: 'FOCUS',
                xpEarned: minutes + (minutes >= 25 ? 10 : 0) // Bonus for 25+ mins
            };
            this.history.unshift(session);
            
            // 3. Update Global Stats
            statsService.addStudyTime(duration, this.state.subject);
            
            // 4. Auto-Switch to Break? (Optional, let's just reset for now)
            this.state.timeLeft = this.state.duration; // Reset display
        } else {
            this.sendNotification("Break Over", "Ready to dive back in?");
            this.state.timeLeft = this.state.duration;
        }

        this.saveData();
    }

    // Helper
    private getDurationForMode(mode: string): number {
        switch(mode) {
            case 'FOCUS': return this.config.focusDuration;
            case 'SHORT_BREAK': return this.config.shortBreak;
            case 'LONG_BREAK': return this.config.longBreak;
            default: return 25;
        }
    }
}

export const timerService = new QuantumTimerService();
