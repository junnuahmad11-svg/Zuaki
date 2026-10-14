
import { UserStats, StudyDay } from '../types';

const STORAGE_KEY = 'zuakiUserStats';

// Helper to get current day name
const getDayName = (date = new Date()) => {
  return date.toLocaleDateString('en-US', { weekday: 'short' });
};

// Initialize empty week for chart
const generateEmptyWeek = (): StudyDay[] => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return days.map(d => ({ day: d, date: new Date().toISOString(), seconds: 0, subjectBreakdown: {} }));
};

export const INITIAL_STATS: UserStats = {
  level: 1, 
  xp: 0,    
  dailyStreak: 0,
  lastStudyDate: null,
  
  dailyTime: 0,
  weeklyTime: 0,
  totalTime: 0,
  studyTimeHours: 0,
  
  studyHistory: generateEmptyWeek(),
  subjectTimes: { 'Physics': 0, 'Chemistry': 0, 'Maths': 0 },
  avgFocusSession: 0,
  avgBreakLength: 0,
  sessionsCount: 0,
  
  weeklyProgress: 0,
  quizzesAttempted: 0,
  /* Added missing pyqsAttempted */
  pyqsAttempted: 0,
  customTestsAttempted: 0,
  accuracy: 0,
  aiDoubtsAsked: 0,
  rankEstimate: 0,
  tasksCompleted: 0,
  
  rewardsTotal: 0,
  rewardsClaimed: 0,
  
  weakSubjects: [],
  strongSubjects: [],
  
  arenaWins: 0,
  arenaLosses: 0,
  botWins: 0,
  botLosses: 0,
  bestRank: 999999,
  avgAccuracy: 0
};

type Listener = (stats: UserStats) => void;
const listeners: Set<Listener> = new Set();

export const statsService = {
  // Load from Local Storage or return Initial Zero State
  getStats: (): UserStats => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return { ...INITIAL_STATS, ...parsed, subjectTimes: { ...INITIAL_STATS.subjectTimes, ...parsed.subjectTimes } };
      }
    } catch (e) {
      console.error('Failed to load stats from local storage', e);
    }
    return { ...INITIAL_STATS };
  },

  // Calculate XP required for next level (Non-linear curve)
  getLevelThreshold: (level: number) => {
      return Math.floor(100 * Math.pow(level, 1.5));
  },

  // Save updates to Local Storage and notify listeners
  updateStats: (updates: Partial<UserStats>) => {
    const current = statsService.getStats();
    const updated = { ...current, ...updates };
    
    // Auto-calculate derived fields
    if (updates.totalTime !== undefined) {
        updated.studyTimeHours = parseFloat((updated.totalTime / 3600).toFixed(1));
    }

    let calculatedLevel = 1;
    let xpIterator = updated.xp;
    while (xpIterator >= (calculatedLevel * 500)) {
        xpIterator -= (calculatedLevel * 500);
        calculatedLevel++;
    }
    
    if (calculatedLevel !== updated.level) {
        updated.level = calculatedLevel;
    }

    // Streak Logic
    const today = new Date().toDateString();
    if (updates.dailyTime && updates.dailyTime > 0) {
        if (updated.lastStudyDate !== today) {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            
            if (updated.lastStudyDate === yesterday.toDateString()) {
                updated.dailyStreak += 1;
            } else if (updated.lastStudyDate !== today) {
                updated.dailyStreak = 1; // Reset if day skipped
            }
            updated.lastStudyDate = today;
        }
    }

    // Calculate Weak/Strong Subjects based on time
    const subjects = ['Physics', 'Chemistry', 'Maths'];
    const sortedSubjects = subjects.sort((a, b) => (updated.subjectTimes[b] || 0) - (updated.subjectTimes[a] || 0));
    updated.strongSubjects = [sortedSubjects[0]];
    updated.weakSubjects = [sortedSubjects[sortedSubjects.length - 1]];

    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    
    // Emit change
    listeners.forEach(l => l(updated));
    return updated;
  },

  // Add study seconds (used by timer/tracker)
  addStudyTime: (seconds: number, subject: string = 'General') => {
      const current = statsService.getStats();
      const newDaily = (current.dailyTime || 0) + seconds;
      const newTotal = (current.totalTime || 0) + seconds;
      
      // Update Subject Stats
      const currentSubjectTime = current.subjectTimes[subject] || 0;
      const newSubjectTimes = { ...current.subjectTimes, [subject]: currentSubjectTime + seconds };

      // Update Chart History
      const dayName = getDayName();
      const history = current.studyHistory.map(d => {
          if (d.day === dayName) {
              const prevSub = d.subjectBreakdown || {};
              return { 
                  ...d, 
                  seconds: d.seconds + seconds,
                  subjectBreakdown: { ...prevSub, [subject]: (prevSub[subject] || 0) + seconds }
              };
          }
          return d;
      });

      const xpGained = Math.floor(seconds / 60);

      statsService.updateStats({
          dailyTime: newDaily,
          totalTime: newTotal,
          xp: (current.xp || 0) + xpGained,
          studyHistory: history,
          subjectTimes: newSubjectTimes,
      });
  },
  
  completeTask: () => {
      const current = statsService.getStats();
      statsService.updateStats({
          tasksCompleted: (current.tasksCompleted || 0) + 1,
          xp: (current.xp || 0) + 15 
      });
  },

  completeQuiz: (score: number, subject: string) => {
      const current = statsService.getStats();
      statsService.updateStats({
          quizzesAttempted: (current.quizzesAttempted || 0) + 1,
          xp: (current.xp || 0) + 50
      });
  },

  completeCustomTest: (correctCount: number, accuracy: number, timeTaken: number, totalQ: number) => {
      const current = statsService.getStats();
      
      // XP Logic: (Correct × 10) + Accuracy Bonus
      let accuracyBonus = 0;
      if (accuracy >= 90) accuracyBonus = 100;
      else if (accuracy >= 80) accuracyBonus = 50;
      else if (accuracy >= 60) accuracyBonus = 20;

      const xpEarned = (correctCount * 10) + accuracyBonus;
      const totalTests = (current.customTestsAttempted || 0) + 1;
      
      // Update average accuracy
      const totalAccSum = (current.accuracy || 0) * (current.customTestsAttempted || 0) + accuracy;
      const newAvgAcc = Math.round(totalAccSum / totalTests);

      statsService.updateStats({
          customTestsAttempted: totalTests,
          xp: (current.xp || 0) + xpEarned,
          accuracy: newAvgAcc,
          quizzesAttempted: (current.quizzesAttempted || 0) + 1
      });

      return xpEarned;
  },

  recordArenaResult: (win: boolean, type: 'BOT' | 'CHALLENGE', xpEarned: number, accuracy: number, rank?: number) => {
      const current = statsService.getStats();
      const updates: Partial<UserStats> = {
          xp: (current.xp || 0) + xpEarned,
          quizzesAttempted: (current.quizzesAttempted || 0) + 1
      };

      if (type === 'BOT') {
          if (win) updates.botWins = (current.botWins || 0) + 1;
          else updates.botLosses = (current.botLosses || 0) + 1;
      } else {
          if (win) updates.arenaWins = (current.arenaWins || 0) + 1;
          else updates.arenaLosses = (current.arenaLosses || 0) + 1;
      }

      // Average accuracy calculation
      const totalQuizzes = (current.quizzesAttempted || 0) + 1;
      const prevAccSum = (current.avgAccuracy || 0) * (current.quizzesAttempted || 0);
      updates.avgAccuracy = Math.round((prevAccSum + accuracy) / totalQuizzes);

      // Best rank tracking
      if (rank && rank < (current.bestRank || 999999)) {
          updates.bestRank = rank;
      }

      statsService.updateStats(updates);
  },

  askAI: () => {
      const current = statsService.getStats();
      statsService.updateStats({
          aiDoubtsAsked: (current.aiDoubtsAsked || 0) + 1,
          xp: (current.xp || 0) + 5
      });
  },

  subscribe: (listener: Listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  }
};
