
import { create } from 'zustand';

interface GameState {
  energy: number;
  maxEnergy: number;
  xp: number;
  level: number;
  discoveredBooks: Set<string>;
  achievements: Set<string>;
  activeBookId: string | null;
  isMultiplayerReady: boolean;
  notification: { title: string; type: 'info' | 'achievement' } | null;
  playerColor: string;
  playerAvatar: string;
  
  // Actions
  setMultiplayerReady: (ready: boolean) => void;
  setPlayerColor: (color: string) => void;
  setPlayerAvatar: (avatar: string) => void;
  decreaseEnergy: (amount: number) => void;
  regenerateEnergy: (amount: number) => void;
  discoverBook: (bookId: string) => void;
  setActiveBook: (bookId: string | null) => void;
  clearNotification: () => void;
}

const SAVED_COLOR = typeof window !== 'undefined' ? localStorage.getItem('aetheria-player-color') : null;
const SAVED_AVATAR = typeof window !== 'undefined' ? localStorage.getItem('aetheria-player-avatar') : null;

export const useGameStore = create<GameState>((set, get) => ({
  energy: 100,
  maxEnergy: 100,
  xp: 0,
  level: 1,
  discoveredBooks: new Set(),
  achievements: new Set(),
  activeBookId: null,
  isMultiplayerReady: false,
  notification: null,
  playerColor: SAVED_COLOR || '#00f0ff',
  playerAvatar: SAVED_AVATAR || 'mage',

  setMultiplayerReady: (ready) => set({ isMultiplayerReady: ready }),
  
  setPlayerColor: (color) => {
    localStorage.setItem('aetheria-player-color', color);
    set({ playerColor: color });
  },

  setPlayerAvatar: (avatar) => {
    localStorage.setItem('aetheria-player-avatar', avatar);
    set({ playerAvatar: avatar });
  },

  decreaseEnergy: (amount) => set((state) => ({
    energy: Math.max(0, state.energy - amount)
  })),

  regenerateEnergy: (amount) => set((state) => ({
    energy: Math.min(state.maxEnergy, state.energy + amount)
  })),

  discoverBook: (bookId) => set((state) => {
    if (state.discoveredBooks.has(bookId)) return {};

    const newSet = new Set(state.discoveredBooks);
    newSet.add(bookId);

    const xpGain = 150;
    const newXp = state.xp + xpGain;
    const newLevel = Math.floor(newXp / 500) + 1;
    const levelUp = newLevel > state.level;

    let achievementNotification = null;

    // Progressive achievement system
    if (newSet.size === 3) {
       achievementNotification = { title: "ACHIEVEMENT: NOVICE ARCHIVIST", type: 'achievement' as const };
    } else if (newSet.size === 6) {
       achievementNotification = { title: "ACHIEVEMENT: DATA COLLECTOR", type: 'achievement' as const };
    } else if (newSet.size === 9) {
       achievementNotification = { title: "ACHIEVEMENT: MASTER ARCHIVIST", type: 'achievement' as const };
    } else if (newSet.size === 12) {
       achievementNotification = { title: "ACHIEVEMENT: AETHERIA LEGEND", type: 'achievement' as const };
    }

    return {
      discoveredBooks: newSet,
      xp: newXp,
      level: newLevel,
      notification: achievementNotification || { title: `DATA FRAGMENT RECOVERED (+${xpGain} XP)`, type: 'info' }
    };
  }),

  setActiveBook: (bookId) => set({ activeBookId: bookId }),
  
  clearNotification: () => set({ notification: null }),
}));
