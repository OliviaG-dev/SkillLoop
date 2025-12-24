import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Program } from "../types/skillloop.readonly";
import type { UserProgress, LoopProgress } from "../types/progress";
import { loadProgram as loadProgramData, programExists } from "../data/programs";

/**
 * Progression par formation
 * Chaque formation a sa propre progression indépendante
 */
interface ProgramsProgress {
  [programId: string]: UserProgress;
}

interface SkillLoopState {
  // Formation actuellement chargée
  currentProgramId: string | null;
  program: Program | null;

  // Progression de toutes les formations
  programsProgress: ProgramsProgress;

  // Actions de gestion de formation
  loadProgram: (programId: string) => boolean;
  getCurrentProgramProgress: () => UserProgress;

  // Actions utilisateur (pour la formation actuelle)
  completeExercise: (loopId: string, exerciseId: string, xp: number) => void;
  uncompleteExercise: (loopId: string, exerciseId: string) => void;
  completeLoop: (loopId: string, bonusXp?: number) => void;
  updateDebrief: (
    loopId: string,
    debrief: { notes: string; insights: string; questions: string }
  ) => void;
  resetProgress: (programId?: string) => void;

  // Selectors helpers (pour la formation actuelle)
  getLoopProgress: (loopId: string) => LoopProgress | undefined;
  getTotalXp: () => number;
  getLoopXpRemaining: (loopId: string) => number;

  // Level System (pour la formation actuelle)
  getLevel: () => number;
  getXpForNextLevel: () => number;
  badgesEarned: () => string[];
}

const getInitialProgress = (): UserProgress => ({
  totalXp: 0,
  loops: {},
});

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
      // État initial
      // =======================
      currentProgramId: null,
      program: null,
      programsProgress: {},

      // =======================
      // Gestion des formations
      // =======================
      loadProgram: (programId) => {
        if (!programExists(programId)) {
          console.error(`Program ${programId} not found`);
          return false;
        }

        const program = loadProgramData(programId);
        if (!program) {
          console.error(`Failed to load program ${programId}`);
          return false;
        }

        // Initialiser la progression si elle n'existe pas
        const state = get();
        if (!state.programsProgress[programId]) {
          state.programsProgress[programId] = getInitialProgress();
        }

        set({
          currentProgramId: programId,
          program,
          programsProgress: { ...state.programsProgress },
        });

        return true;
      },

      getCurrentProgramProgress: () => {
        const state = get();
        if (!state.currentProgramId) {
          return getInitialProgress();
        }
        return state.programsProgress[state.currentProgramId] ?? getInitialProgress();
      },

      // =======================
      // Actions (pour la formation actuelle)
      // =======================
      completeExercise: (loopId, exerciseId, xp) =>
        set((state) => {
          if (!state.currentProgramId || !state.program) return state;

          const progress = state.programsProgress[state.currentProgramId] ?? getInitialProgress();
          const loop = progress.loops[loopId] ?? {
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

          const updatedProgress: UserProgress = {
            totalXp: progress.totalXp + xp,
            loops: {
              ...progress.loops,
              [loopId]: updatedLoop,
            },
          };

          return {
            programsProgress: {
              ...state.programsProgress,
              [state.currentProgramId]: updatedProgress,
            },
          };
        }),

      uncompleteExercise: (loopId, exerciseId) =>
        set((state) => {
          if (!state.currentProgramId || !state.program) return state;

          const progress = state.programsProgress[state.currentProgramId] ?? getInitialProgress();
          const loop = progress.loops[loopId];
          if (!loop || !loop.completedExercises.includes(exerciseId))
            return state;

          // Trouver la loop dans le programme pour obtenir les bonus XP
          const programLoop = state.program.paths
            .flatMap((p) => p.modules)
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

          const updatedProgress: UserProgress = {
            totalXp: Math.max(0, progress.totalXp - xpDifference),
            loops: {
              ...progress.loops,
              [loopId]: updatedLoop,
            },
          };

          return {
            programsProgress: {
              ...state.programsProgress,
              [state.currentProgramId]: updatedProgress,
            },
          };
        }),

      completeLoop: (loopId, bonusXp) =>
        set((state) => {
          if (!state.currentProgramId || !state.program) return state;

          const progress = state.programsProgress[state.currentProgramId] ?? getInitialProgress();
          const loop = progress.loops[loopId];
          if (!loop || loop.completed) return state;

          const calculatedBonus =
            bonusXp ??
            state.program.paths
              .flatMap((p) => p.modules)
              .flatMap((m) => m.loops)
              .find((l) => l.id === loopId)?.xpBonus.completion ??
            0;

          const updatedProgress: UserProgress = {
            totalXp: progress.totalXp + calculatedBonus,
            loops: {
              ...progress.loops,
              [loopId]: {
                ...loop,
                completed: true,
                xpEarned: loop.xpEarned + calculatedBonus,
              },
            },
          };

          return {
            programsProgress: {
              ...state.programsProgress,
              [state.currentProgramId]: updatedProgress,
            },
          };
        }),

      updateDebrief: (loopId, debrief) =>
        set((state) => {
          if (!state.currentProgramId) return state;

          const progress = state.programsProgress[state.currentProgramId] ?? getInitialProgress();
          const updatedProgress: UserProgress = {
            ...progress,
            loops: {
              ...progress.loops,
              [loopId]: {
                ...(progress.loops[loopId] ?? {
                  loopId,
                  completedExercises: [],
                  xpEarned: 0,
                  completed: false,
                  debrief: { notes: "", insights: "", questions: "" },
                }),
                debrief,
              },
            },
          };

          return {
            programsProgress: {
              ...state.programsProgress,
              [state.currentProgramId]: updatedProgress,
            },
          };
        }),

      resetProgress: (programId) => {
        const state = get();
        const targetProgramId = programId ?? state.currentProgramId;

        if (targetProgramId) {
          // Réinitialiser la progression d'une formation spécifique
          const updatedProgress = { ...state.programsProgress };
          updatedProgress[targetProgramId] = getInitialProgress();
          set({ programsProgress: updatedProgress });
        } else {
          // Réinitialiser toutes les progressions
          set({ programsProgress: {} });
        }
      },

      // =======================
      // Selectors helpers (pour la formation actuelle)
      // =======================
      getLoopProgress: (loopId) => {
        const state = get();
        if (!state.currentProgramId) return undefined;
        const progress = state.programsProgress[state.currentProgramId];
        return progress?.loops[loopId];
      },

      getTotalXp: () => {
        const state = get();
        if (!state.currentProgramId) return 0;
        const progress = state.programsProgress[state.currentProgramId];
        return progress?.totalXp ?? 0;
      },

      getLoopXpRemaining: (loopId) => {
        const state = get();
        if (!state.currentProgramId || !state.program) return 0;

        const loop = state.program.paths
          .flatMap((p) => p.modules)
          .flatMap((m) => m.loops)
          .find((l) => l.id === loopId);

        if (!loop) return 0;

        const progress = state.programsProgress[state.currentProgramId];
        const loopProgress = progress?.loops[loopId];
        const earnedXp = loopProgress?.xpEarned ?? 0;

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
      // Level System (pour la formation actuelle)
      // =======================
      getLevel: () => {
        const xp = get().getTotalXp();
        let level = 0;
        for (let i = 0; i < LEVEL_XP.length; i++) {
          if (xp >= LEVEL_XP[i]) level = i;
        }
        return level;
      },

      getXpForNextLevel: () => {
        const xp = get().getTotalXp();
        const level = get().getLevel();
        if (level >= LEVEL_XP.length - 1) return 0;
        return LEVEL_XP[level + 1] - xp;
      },

      badgesEarned: () => {
        const xp = get().getTotalXp();
        return BADGES.filter((b) => xp >= b.xp).map((b) => b.name);
      },
    }),
    {
      name: "skillloop-progress",
      version: 2, // Incrémenter la version car la structure a changé
      partialize: (state) => ({
        currentProgramId: state.currentProgramId,
        programsProgress: state.programsProgress,
      }),
      migrate: (persistedState: any, version: number) => {
        // Migration depuis la version 1 (ancienne structure)
        if (version === 1) {
          // Si on a l'ancienne structure avec totalXp et loops directement
          if (persistedState.totalXp !== undefined && persistedState.loops !== undefined) {
            // On migre vers la nouvelle structure
            // Par défaut, on assigne à "skillloop-ai-foundations" (l'ancienne formation par défaut)
            return {
              currentProgramId: "skillloop-ai-foundations",
              programsProgress: {
                "skillloop-ai-foundations": {
                  totalXp: persistedState.totalXp ?? 0,
                  loops: persistedState.loops ?? {},
                },
              },
            };
          }
        }
        return persistedState;
      },
    }
  )
);
