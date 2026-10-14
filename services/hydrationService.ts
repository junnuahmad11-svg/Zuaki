
import { ViewState } from '../types';
import { notificationService } from './notificationService';

const KEY_ENABLED = 'hydrationReminderEnabled';
const KEY_INTERVAL = 'hydrationIntervalMinutes';
const KEY_LAST_TIME = 'lastHydrationReminderTime';

const TITLES = [
  "Hydration Check 💧",
  "Zuaki Reminder",
  "Stay Sharp, Operative"
];

const BODIES = [
  "Time to drink some water. A hydrated brain solves faster.",
  "Small sip, big focus. Drink water now.",
  "Hydration boosts memory. Take a sip!"
];

// List of views where we SHOULD NOT disturb the user
const UNINTERRUPTIBLE_VIEWS: ViewState[] = [
  ViewState.TEST_LAB_INTERFACE,
  ViewState.QUIZ_ARENA,
  ViewState.TEST_INSTRUCTIONS,
  ViewState.TEST_RUNNER
];

export const hydrationService = {
  getSettings: () => {
    return {
      enabled: localStorage.getItem(KEY_ENABLED) === 'true',
      interval: parseInt(localStorage.getItem(KEY_INTERVAL) || '60'),
      lastReminder: parseInt(localStorage.getItem(KEY_LAST_TIME) || Date.now().toString())
    };
  },

  updateSettings: (enabled: boolean, interval: number) => {
    localStorage.setItem(KEY_ENABLED, enabled.toString());
    localStorage.setItem(KEY_INTERVAL, interval.toString());
  },

  checkAndNotify: (currentView: ViewState, isTimerRunning: boolean) => {
    const settings = hydrationService.getSettings();
    if (!settings.enabled) return;

    const now = Date.now();
    const intervalMs = settings.interval * 60 * 1000;
    const timeSinceLast = now - settings.lastReminder;

    if (timeSinceLast >= intervalMs) {
      // Check if we are in a protected state
      const isProtectedView = UNINTERRUPTIBLE_VIEWS.includes(currentView);
      if (isProtectedView || isTimerRunning) {
        // Delay: We wait until next check when view is safe.
        // We don't update lastReminder so it triggers as soon as they exit.
        return;
      }

      // Safe to notify
      const title = TITLES[Math.floor(Math.random() * TITLES.length)];
      const body = BODIES[Math.floor(Math.random() * BODIES.length)];

      notificationService.push(
        'UPDATE',
        title,
        body,
        ViewState.PROFILE, // Deep link to health section
        true // Force push for health
      );

      // Update timestamp to now
      localStorage.setItem(KEY_LAST_TIME, now.toString());
    }
  }
};
