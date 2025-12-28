import { useSkillLoopStore } from '../store/useSkillLoopStore';
import {
  useLoop,
  useExerciseProgress,
  useLoopStats,
  useProgramStats,
} from '../store/selectors';

/**
 * Hook principal pour utiliser SkillLoop avec tous les selectors optimisés
 */
export function useSkillLoop() {
  const store = useSkillLoopStore();

  // Récupérer la progression actuelle
  const currentProgress = store.getCurrentProgramProgress();

  return {
    // Store de base
    ...store,
    progress: currentProgress, // Pour compatibilité avec les selectors

    // Selectors optimisés
    getLoop: (loopId: string) => {
      if (!store.program) return null;
      return useLoop(store.program, loopId);
    },
    getLoopProgress: (loopId: string) => store.getLoopProgress(loopId),
    getExerciseProgress: (loopId: string, exerciseId: string) => {
      const loopProgress = store.getLoopProgress(loopId) ?? null;
      return useExerciseProgress(loopProgress, exerciseId);
    },
    getLoopStats: (loopId: string) => {
      if (!store.program) return null;
      const loop = useLoop(store.program, loopId);
      const loopProgress = store.getLoopProgress(loopId) ?? null;
      if (!loop) return null;
      return useLoopStats(loop, loopProgress);
    },
    getProgramStats: () => {
      if (!store.program) return null;
      return useProgramStats(store.program, currentProgress);
    },
  };
}

/**
 * Hook simplifié pour un loop spécifique
 */
export function useLoopData(loopId: string) {
  const store = useSkillLoopStore();
  const loop = store.program ? useLoop(store.program, loopId) : null;
  const loopProgress = store.getLoopProgress(loopId) ?? null;
  const stats = loop ? useLoopStats(loop, loopProgress) : null;

  return {
    loop,
    loopProgress,
    stats,
    isExerciseCompleted: (exerciseId: string) => {
      const progress = store.getLoopProgress(loopId) ?? null;
      return useExerciseProgress(progress, exerciseId);
    },
    completeExercise: (exerciseId: string, xp: number) =>
      store.completeExercise(loopId, exerciseId, xp),
    completeLoop: (bonusXp?: number) => store.completeLoop(loopId, bonusXp),
    updateDebrief: (debrief: { notes: string; insights: string; questions: string }) =>
      store.updateDebrief(loopId, debrief),
    getXpRemaining: () => store.getLoopXpRemaining(loopId),
  };
}

