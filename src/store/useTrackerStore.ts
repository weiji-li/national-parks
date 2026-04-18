import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Visit } from '../types/nps';

interface TrackerStore {
  visits: Record<string, Visit>;
  wishlist: string[];

  addVisit: (parkCode: string, date: string, note?: string) => void;
  removeVisitDate: (parkCode: string, date: string) => void;
  updateNote: (parkCode: string, note: string) => void;
  toggleWishlist: (parkCode: string) => void;
  isVisited: (parkCode: string) => boolean;
  isWishlisted: (parkCode: string) => boolean;
  getVisit: (parkCode: string) => Visit | undefined;
  getVisitedCount: () => number;
  getAllVisitedParks: () => string[];
}

export const useTrackerStore = create<TrackerStore>()(
  persist(
    (set, get) => ({
      visits: {},
      wishlist: [],

      addVisit: (parkCode, date, note = '') => {
        set(state => {
          const existing = state.visits[parkCode];
          if (existing) {
            const dates = existing.dates.includes(date)
              ? existing.dates
              : [...existing.dates, date].sort();
            return {
              visits: {
                ...state.visits,
                [parkCode]: { ...existing, dates, notes: note || existing.notes },
              },
            };
          }
          return {
            visits: {
              ...state.visits,
              [parkCode]: { parkCode, dates: [date], notes: note },
            },
          };
        });
      },

      removeVisitDate: (parkCode, date) => {
        set(state => {
          const existing = state.visits[parkCode];
          if (!existing) return state;
          const dates = existing.dates.filter(d => d !== date);
          if (dates.length === 0) {
            const { [parkCode]: _, ...rest } = state.visits;
            return { visits: rest };
          }
          return {
            visits: { ...state.visits, [parkCode]: { ...existing, dates } },
          };
        });
      },

      updateNote: (parkCode, note) => {
        set(state => {
          const existing = state.visits[parkCode];
          if (!existing) return state;
          return {
            visits: { ...state.visits, [parkCode]: { ...existing, notes: note } },
          };
        });
      },

      toggleWishlist: (parkCode) => {
        set(state => {
          const inList = state.wishlist.includes(parkCode);
          return {
            wishlist: inList
              ? state.wishlist.filter(c => c !== parkCode)
              : [...state.wishlist, parkCode],
          };
        });
      },

      isVisited: (parkCode) => !!get().visits[parkCode],
      isWishlisted: (parkCode) => get().wishlist.includes(parkCode),
      getVisit: (parkCode) => get().visits[parkCode],
      getVisitedCount: () => Object.keys(get().visits).length,
      getAllVisitedParks: () => Object.keys(get().visits),
    }),
    {
      name: 'national-parks-tracker',
    }
  )
);
