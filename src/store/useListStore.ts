import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Platform, UserProfileSummary } from "@/types";

export interface SelectedProfile {
  profile: UserProfileSummary;
  platform: Platform;
  addedAt: number;
}

interface ListStore {
  selectedProfiles: SelectedProfile[];
  addProfile: (profile: UserProfileSummary, platform: Platform) => void;
  removeProfile: (userId: string) => void;
  clearList: () => void;
  isSelected: (userId: string) => boolean;
  reorderProfiles: (startIndex: number, endIndex: number) => void;
}

export const useListStore = create<ListStore>()(
  persist(
    (set, get) => ({
      selectedProfiles: [],

      addProfile: (profile, platform) => {
        const already = get().isSelected(profile.user_id);
        if (already) return; // no duplicates
        set((state) => ({
          selectedProfiles: [
            ...state.selectedProfiles,
            { profile, platform, addedAt: Date.now() },
          ],
        }));
      },

      removeProfile: (userId) => {
        set((state) => ({
          selectedProfiles: state.selectedProfiles.filter(
            (s) => s.profile.user_id !== userId
          ),
        }));
      },

      clearList: () => set({ selectedProfiles: [] }),

      isSelected: (userId) =>
        get().selectedProfiles.some((s) => s.profile.user_id === userId),

      reorderProfiles: (startIndex, endIndex) => {
        set((state) => {
          const result = Array.from(state.selectedProfiles);
          const [removed] = result.splice(startIndex, 1);
          result.splice(endIndex, 0, removed);
          return { selectedProfiles: result };
        });
      },
    }),
    {
      name: "wobb-selected-list",
    }
  )
);
