import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Program } from "../types/skillloop.readonly";
import type { UserProgress, LoopProgress } from "../types/progress";
import programData from "../data/skillloop-ai-foundations.json";

interface SkillLoopState extends UserProgress {
  // Lecture de la formation
  program: Program;

  // Actions utilisateur
  completeExercise: (loopId: string, exerciseId: string, xp: number) => void;
  uncompleteExercise: (loopId: string, exerciseId: string) => void;
  completeLoop: (loopId: string, bonusXp?: number) => void;
  updateDebrief: (
    loopId: string,
    debrief: { notes: string; insights: string; questions: string }
  ) => void;
  resetProgress: () => void;

  // Selectors helpers
  getLoopProgress: (loopId: string) => LoopProgress | undefined;
  getTotalXp: () => number;
  getLoopXpRemaining: (loopId: string) => number;

  // NEW LEVEL SYSTEM
  getLevel: () => number;
  getXpForNextLevel: () => number;
  badgesEarned: () => string[];
}

const initialState: UserProgress = {
  totalXp: 0,
  loops: {},
};

// =======================
// Level System Configuration
// =======================
const LEVEL_XP = [0, 100, 250, 450, 700, 1000, 1350, 1750]; // XP cumulatif pour chaque level

const BADGES = [
  { xp: 100, name: "Débutant" },
  { xp: 250, name: "Apprenti" },
  { xp: 450, name: "Compétent" },
  { xp: 700, name: "Expert" },
  { xp: 1000, name: "Maître" },
];

export const useSkillLoopStore = create<SkillLoopState>()(
  persist(
    (set, get) => ({
      // =======================
      // Formation (immutable)
      // =======================
      program: programData as Program,

      // =======================
      // Progression initiale
      // =======================
      ...initialState,

      // =======================
      // Actions
      // =======================
      completeExercise: (loopId, exerciseId, xp) =>
        set((state) => {
          const loop = state.loops[loopId] ?? {
            loopId,
            completedExercises: [],
            xpEarned: 0,
            completed: false,
            debrief: { notes: "", insights: "", questions: "" },
          };

          if (loop.completedExercises.includes(exerciseId)) return state;

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

      uncompleteExercise: (loopId, exerciseId) =>
        set((state) => {
          const loop = state.loops[loopId];
          if (!loop || !loop.completedExercises.includes(exerciseId))
            return state;

          // Trouver la loop dans le programme pour obtenir les bonus XP
          const programLoop = get()
            .program.paths.flatMap((p) => p.modules)
            .flatMap((m) => m.loops)
            .find((l) => l.id === loopId);

          if (!programLoop) return state;

          // Retirer l'exercice de la liste
          const updatedExercises = loop.completedExercises.filter(
            (id) => id !== exerciseId
          );

          // Recalculer l'XP gagné en fonction des exercices restants
          let newXpEarned = 0;

          // XP des exercices complétés restants
          updatedExercises.forEach((exId) => {
            const exercise = programLoop.exercises.find((e) => e.id === exId);
            if (exercise) {
              newXpEarned += exercise.xpReward;
            }
          });

          // Bonus de completion si tous les exercices restants sont complétés
          const allRemainingCompleted =
            updatedExercises.length === programLoop.exercises.length;
          if (allRemainingCompleted) {
            newXpEarned += programLoop.xpBonus.completion;
          }

          // Bonus de fullCompletion si la loop était complétée (on le garde si elle l'était)
          // Mais on décomplète la loop car un exercice a été décoché
          // Note: on ne retire pas le bonus fullCompletion car il a déjà été donné
          // et on ne veut pas pénaliser l'utilisateur

          // Calculer la différence d'XP à retirer du total
          const xpDifference = loop.xpEarned - newXpEarned;

          // Si la loop était complétée, décompléter la loop
          const updatedLoop: LoopProgress = {
            ...loop,
            completedExercises: updatedExercises,
            xpEarned: newXpEarned,
            completed: false, // Décompléter la loop si elle était complétée
          };

          return {
            totalXp: Math.max(0, state.totalXp - xpDifference),
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

          const calculatedBonus =
            bonusXp ??
            get()
              .program.paths.flatMap((p) => p.modules)
              .flatMap((m) => m.loops)
              .find((l) => l.id === loopId)?.xpBonus.completion ??
            0;

          return {
            totalXp: state.totalXp + calculatedBonus,
            loops: {
              ...state.loops,
              [loopId]: {
                ...loop,
                completed: true,
                xpEarned: loop.xpEarned + calculatedBonus,
              },
            },
          };
        }),

      updateDebrief: (loopId, debrief) =>
        set((state) => ({
          loops: {
            ...state.loops,
            [loopId]: {
              ...(state.loops[loopId] ?? {
                loopId,
                completedExercises: [],
                xpEarned: 0,
                completed: false,
                debrief: { notes: "", insights: "", questions: "" },
              }),
              debrief,
            },
          },
        })),

      resetProgress: () => {
        localStorage.removeItem("skillloop-progress");
        set(initialState);
      },

      // =======================
      // Selectors helpers
      // =======================
      getLoopProgress: (loopId) => get().loops[loopId],

      getTotalXp: () => get().totalXp,

      getLoopXpRemaining: (loopId) => {
        const loop = get()
          .program.paths.flatMap((p) => p.modules)
          .flatMap((m) => m.loops)
          .find((l) => l.id === loopId);

        if (!loop) return 0;

        const progress = get().loops[loopId];
        const earnedXp = progress?.xpEarned ?? 0;

        const exercisesXp = loop.exercises.reduce(
          (sum, ex) => sum + ex.xpReward,
          0
        );
        const bonusXp =
          loop.xpBonus.completion +
          loop.xpBonus.fullCompletion +
          loop.xpBonus.reflectionCompleted;

        return exercisesXp + bonusXp - earnedXp;
      },

      // =======================
      // Level System
      // =======================
      getLevel: () => {
        const xp = get().totalXp;
        let level = 0;
        for (let i = 0; i < LEVEL_XP.length; i++) {
          if (xp >= LEVEL_XP[i]) level = i;
        }
        return level;
      },

      getXpForNextLevel: () => {
        const xp = get().totalXp;
        const level = get().getLevel();
        if (level >= LEVEL_XP.length - 1) return 0;
        return LEVEL_XP[level + 1] - xp;
      },

      badgesEarned: () => {
        const xp = get().totalXp;
        return BADGES.filter((b) => xp >= b.xp).map((b) => b.name);
      },
    }),
    {
      name: "skillloop-progress",
      version: 1,
      partialize: (state) => ({
        totalXp: state.totalXp,
        loops: state.loops,
      }),
    }
  )
);
