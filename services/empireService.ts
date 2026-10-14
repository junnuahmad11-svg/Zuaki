
import { EmpireState, EmpireBuilding, EmpireFloor, ZuakiCard } from '../types';

const STORAGE_KEY = 'zuaki_empire_pro_v1';

export const ZUAKI_CARDS: ZuakiCard[] = [
  { id: 'c1', title: 'The Architect', quote: 'A strong empire is built on clear concepts, not rote memory.', rarity: 'COMMON' },
  { id: 'c2', title: 'Neural Surge', quote: 'Your brain adapts to the pressure you consistently apply.', rarity: 'ELITE' },
  { id: 'c3', title: 'Vanguard Spirit', quote: 'The harder the question, the greater the growth.', rarity: 'MYTHIC' }
];

const INITIAL_STATE: EmpireState = {
  brainCoins: 500,
  empireLevel: 1,
  rank: 150000,
  activeManagers: [],
  hasSeenTutorial: false,
  collectedCards: [],
  buildings: [
    {
      id: 'math-tower',
      subject: 'Maths',
      level: 1,
      unlocked: true,
      floors: [
        { id: 'm1', name: 'Sets & Relations', mastery: 0, status: 'ACTIVE', stability: 100 },
        { id: 'm2', name: 'Trigonometry', mastery: 0, status: 'LOCKED', stability: 100 },
        { id: 'm3', name: 'Quadratic Equations', mastery: 0, status: 'LOCKED', stability: 100 }
      ]
    },
    {
      id: 'physics-lab',
      subject: 'Physics',
      level: 1,
      unlocked: true,
      floors: [
        { id: 'p1', name: 'Kinematics', mastery: 0, status: 'ACTIVE', stability: 100 },
        { id: 'p2', name: 'Laws of Motion', mastery: 0, status: 'LOCKED', stability: 100 }
      ]
    },
    {
      id: 'chem-center',
      subject: 'Chemistry',
      level: 1,
      unlocked: false,
      floors: [
        { id: 'c1', name: 'Mole Concept', mastery: 0, status: 'LOCKED', stability: 100 }
      ]
    }
  ]
};

type EmpireListener = (state: EmpireState) => void;
const listeners: Set<EmpireListener> = new Set();

export const empireService = {
  getState: (): EmpireState => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) return JSON.parse(saved);
    return INITIAL_STATE;
  },

  updateState: (updates: Partial<EmpireState>) => {
    const current = empireService.getState();
    const updated = { ...current, ...updates };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    listeners.forEach(l => l(updated));
  },

  subscribe: (l: EmpireListener) => {
    listeners.add(l);
    return () => listeners.delete(l);
  },

  collectCard: (cardId: string) => {
    const state = empireService.getState();
    if (!state.collectedCards.includes(cardId)) {
        empireService.updateState({
            collectedCards: [...state.collectedCards, cardId]
        });
    }
  },

  processSession: (floorId: string, correct: number, total: number, difficulty: string) => {
    const state = empireService.getState();
    const accuracy = (correct / total) * 100;
    
    // Earnings Logic: Strategic and Hard-Earned
    let earned = 0;
    if (difficulty === 'Advanced') earned = correct * 25;
    else if (difficulty === 'Hard') earned = correct * 15;
    else earned = correct * 8;

    // Guessing Penalty: Heavy logic error deductions
    const penalty = accuracy < 50 ? 50 : accuracy < 75 ? 20 : 0;
    const finalEarned = earned - penalty;

    const buildings = [...state.buildings];
    let floorName = "";
    let newlyMastered = false;

    buildings.forEach(b => {
      const floor = b.floors.find(f => f.id === floorId);
      if (floor) {
        floorName = floor.name;
        if (accuracy >= 80) {
          floor.mastery = Math.min(100, floor.mastery + 25);
          floor.stability = Math.min(100, floor.stability + 15);
          if (floor.mastery >= 100 && floor.status !== 'MASTERED') {
            floor.status = 'MASTERED';
            newlyMastered = true;
            const idx = b.floors.indexOf(floor);
            if (idx < b.floors.length - 1) b.floors[idx+1].status = 'ACTIVE';
          }
        } else {
          floor.stability = Math.max(0, floor.stability - 20);
          if (floor.stability < 30) floor.status = 'WEAK';
        }
      }
    });

    // Building Unlock Logic
    if (newlyMastered && state.empireLevel < 5) {
       // Logic to potentially unlock Chem Center if Physics/Maths are strong
    }

    empireService.updateState({
      brainCoins: Math.max(0, state.brainCoins + finalEarned),
      buildings,
      empireLevel: newlyMastered ? state.empireLevel + 1 : state.empireLevel,
      rank: Math.max(1, state.rank - (accuracy > 80 ? 1500 : 0))
    });

    return { 
      earned: finalEarned, 
      accuracy, 
      success: accuracy >= 80, 
      floorName,
      newlyMastered
    };
  }
};
