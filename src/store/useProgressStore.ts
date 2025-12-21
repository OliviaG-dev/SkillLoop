import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserProgress, LoopProgress } from "../types/progress";

interface ProgressState extends UserProgress {
  // Actions
  completeExercise: (loopId: string, exerciseId: string, xp: number) => void;
  completeLoop: (loopId: string, bonusXp: number) => void;
  updateDebrief: (
    loopId: string,
    debrief: { notes: string; insights: string; questions: string }
  ) => void;
  resetProgress: () => void;
}

const initialState: UserProgress = {
  totalXp: 0,
  loops: {},
};

export const useProgressStore = create<ProgressState>()(
  persist(
    (set) => ({
      ...initialState,

      completeExercise: (loopId, exerciseId, xp) =>
        set((state) => {
          const loop = state.loops[loopId] ?? {
            loopId,
            completedExercises: [],
            xpEarned: 0,
            completed: false,
            debrief: { notes: "", insights: "", questions: "" },
          };

          if (loop.completedExercises.includes(exerciseId)) {
            return state; // déjà complété
          }

          const updatedLoop: LoopProgress = {
            ...loop,
            completedExercises: [...loop.completedExercises, exerciseId],
            xpEarned: loop.xpEarned + xp,
          };

          return {
            totalXp: state.totalXp + xp,
            loops: {
              ...state.loops,
              [loopId]: updatedLoop,
            },
          };
        }),

      completeLoop: (loopId, bonusXp) =>
        set((state) => {
          const loop = state.loops[loopId];
          if (!loop || loop.completed) return state;

          return {
            totalXp: state.totalXp + bonusXp,
            loops: {
              ...state.loops,
              [loopId]: {
                ...loop,
                completed: true,
                xpEarned: loop.xpEarned + bonusXp,
              },
            },
          };
        }),

      updateDebrief: (loopId, debrief) =>
        set((state) => {
          const existingLoop = state.loops[loopId] ?? {
            loopId,
            completedExercises: [],
            xpEarned: 0,
            completed: false,
            debrief: { notes: "", insights: "", questions: "" },
          };

          return {
            ...state,
            loops: {
              ...state.loops,
              [loopId]: {
                ...existingLoop,
                debrief,
              },
            },
          };
        }),

      resetProgress: () => set(initialState),
    }),
    {
      name: "skillloop-progress",
    }
  )
);
