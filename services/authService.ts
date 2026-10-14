
import { LocalAuth } from '../types';

const STORAGE_KEY = 'zuaki_local_auth';

/**
 * Generate a production-ready permanent identifier.
 */
const generateUUID = () => {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16).toUpperCase();
    });
};

export const authService = {
    /**
     * Get the current authentication payload from device storage.
     */
    getAuth: (): LocalAuth | null => {
        try {
            const data = localStorage.getItem(STORAGE_KEY);
            return data ? JSON.parse(data) : null;
        } catch (e) {
            console.error("Local Auth Corrupted", e);
            return null;
        }
    },

    /**
     * Permanent save for authentication data.
     */
    saveAuth: (data: LocalAuth) => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    },

    /**
     * Handles both NEW SIGNUP and RETURNING LOGIN.
     * Guaranteed to never regenerate an existing ZA-ID.
     */
    login: async (selectedEmail: string): Promise<{ success: boolean; data?: LocalAuth; error?: string }> => {
        const existing = authService.getAuth();
        
        if (!existing) {
            // --- NEW USER FLOW ---
            const newData: LocalAuth = {
                zaId: generateUUID(),
                email: selectedEmail,
                createdAt: Date.now(),
                lastLogin: Date.now(),
                isLoggedIn: true
            };
            authService.saveAuth(newData);
            return { success: true, data: newData };
        } else {
            // --- RETURNING USER FLOW ---
            // If the user has a stored account but selected a DIFFERENT one
            if (existing.email.toLowerCase() !== selectedEmail.toLowerCase()) {
                return { 
                    success: false, 
                    error: `Neural Link Mismatch: Please use the account bound to this device (${existing.email}).` 
                };
            }
            
            // Re-authenticate existing user
            const updated: LocalAuth = {
                ...existing,
                lastLogin: Date.now(),
                isLoggedIn: true
            };
            authService.saveAuth(updated);
            return { success: true, data: updated };
        }
    },

    /**
     * Logout logic: Sets state to false but DOES NOT delete permanent IDs or data.
     */
    logout: () => {
        const current = authService.getAuth();
        if (current) {
            authService.saveAuth({ ...current, isLoggedIn: false });
        }
    },

    /**
     * Fast check for active session.
     */
    isSessionActive: (): boolean => {
        const auth = authService.getAuth();
        return !!auth && auth.isLoggedIn;
    },

    /**
     * Checks if this is a fresh install with zero data.
     */
    isNewDevice: (): boolean => {
        return !localStorage.getItem(STORAGE_KEY);
    }
};
