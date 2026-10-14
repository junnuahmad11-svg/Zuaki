
import { ZuakiNotification, UserProfile, UserStats, NotificationCategory } from '../types';
import { statsService } from './statsService';

const STORAGE_KEY = 'zuaki_znc_store';
const MAX_PUSHES_PER_DAY = 2;

interface NotificationStore {
    notifications: ZuakiNotification[];
    lastPushTime: number;
    pushesToday: number;
    lastPushDate: string;
}

const getStore = (): NotificationStore => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) return JSON.parse(stored);
    } catch(e) {}
    return { notifications: [], lastPushTime: 0, pushesToday: 0, lastPushDate: '' };
};

const saveStore = (store: NotificationStore) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
};

export const notificationService = {
    // Core: Fetch all
    getAll: (): ZuakiNotification[] => {
        return getStore().notifications.sort((a,b) => b.timestamp - a.timestamp);
    },

    // Core: Mark Read
    markAsRead: (id: string) => {
        const store = getStore();
        store.notifications = store.notifications.map(n => n.id === id ? { ...n, read: true } : n);
        saveStore(store);
    },

    markAllRead: () => {
        const store = getStore();
        store.notifications = store.notifications.map(n => ({ ...n, read: true }));
        saveStore(store);
    },

    // Core: Delete
    delete: (id: string) => {
        const store = getStore();
        store.notifications = store.notifications.filter(n => n.id !== id);
        saveStore(store);
    },

    // INTERNAL: Push Logic (Rate Limited)
    push: (category: NotificationCategory, title: string, body: string, deepLink: string, force = false) => {
        const store = getStore();
        const today = new Date().toDateString();

        // Reset counter if new day
        if (store.lastPushDate !== today) {
            store.pushesToday = 0;
            store.lastPushDate = today;
        }

        // Rate Limit Check
        if (!force && store.pushesToday >= MAX_PUSHES_PER_DAY) {
            console.log("ZNC: Rate limit reached. Notification suppressed.");
            return;
        }

        const newNotification: ZuakiNotification = {
            id: `znc-${Date.now()}-${Math.random().toString(36).substr(2,5)}`,
            category,
            title,
            body,
            deepLink,
            timestamp: Date.now(),
            read: false
        };

        store.notifications.unshift(newNotification);
        store.pushesToday += 1;
        store.lastPushTime = Date.now();
        saveStore(store);
        
        // Browser Native Notification (Optional / If allowed)
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(title, { body, icon: '/favicon.ico' });
        }
    },

    // --- SMART TRIGGERS ---

    // 1. Welcome Push
    checkWelcome: (user: Partial<UserProfile>) => {
        const store = getStore();
        // If user exists but no notifications ever sent, this is the first run
        if (user.name && store.notifications.length === 0) {
            notificationService.push(
                'MISSION',
                `Welcome to Zuaki, Operative!`,
                `${user.name}, your mission console is online. Choose your Power Dragon and unlock today’s starter run.`,
                '/setup/avatar-selection',
                true // Force bypass rate limit
            );
        }
    },

    // 2. Daily Reminders
    checkDaily: (user: Partial<UserProfile>) => {
        const store = getStore();
        const now = new Date();
        const hour = now.getHours();
        
        // Simple heuristic: If last push was > 12 hours ago
        if (Date.now() - store.lastPushTime > 12 * 60 * 60 * 1000) {
            if (hour >= 6 && hour < 12) {
                notificationService.push(
                    'MISSION',
                    'Morning Boost Activated',
                    'Start your day with a 10-minute Zuaki warmup. Your brain will thank you.',
                    '/missions/today'
                );
            } else if (hour >= 20) {
                notificationService.push(
                    'MISSION',
                    'Night-Focus Mode Online',
                    `${user.name || 'Operative'}, 20 minutes of revision now = +30 XP and stronger memory.`,
                    '/missions/today'
                );
            }
        }
    },

    // 3. Streak & Weakness
    checkPerformance: (stats: UserStats) => {
        const store = getStore();
        
        // Streak Warning (If streak > 2 and haven't studied today)
        const today = new Date().toDateString();
        if (stats.dailyStreak > 2 && stats.lastStudyDate !== today && new Date().getHours() > 18) {
            // Check if we already warned today
            const hasWarned = store.notifications.some(n => n.title === 'Streak at Risk!' && new Date(n.timestamp).toDateString() === today);
            if (!hasWarned) {
                notificationService.push(
                    'PERFORMANCE',
                    'Streak at Risk!',
                    `You’re hours away from losing your ${stats.dailyStreak}-day study streak. Do a 5-minute booster.`,
                    '/missions/booster',
                    true
                );
            }
        }

        // Weak Zone
        if (stats.weakSubjects.length > 0 && Math.random() > 0.7) { // 30% chance to trigger
             notificationService.push(
                'PERFORMANCE',
                'Weak Zone Detected',
                `Your accuracy dropped in ${stats.weakSubjects[0]}. Zuaki prepared a flash set to fix it fast.`,
                '/flashcards'
            );
        }
    },

    // 4. Manual Triggers (Called by other components)
    triggerLevelUp: (level: number, name: string) => {
        notificationService.push(
            'AVATAR',
            `Level ${level} Unlocked!`,
            `Your XP surge is crazy, ${name}. New perks activated in your progression path.`,
            '/profile',
            true
        );
    },

    triggerMockTest: () => {
        notificationService.push(
            'MISSION',
            'Fresh Mock Test Ready',
            'A new JEE mock (75 Qs) is generated from PYQs + Abhyas patterns. Attempt before 11 PM for bonus XP.',
            '/tests/latest'
        );
    },

    triggerUpdate: () => {
        notificationService.push(
            'UPDATE',
            'New Zuaki Features Dropped!',
            'Dragon Powers • XP Engine • Smart Notes. Update inside for full control.',
            '/updates',
            true
        );
    }
};
