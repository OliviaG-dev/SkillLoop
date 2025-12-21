import { useSkillLoopStore } from '../store/useSkillLoopStore';
import {
  useLoop,
  useLoopProgress,
  useExerciseProgress,
  useLoopStats,
  useProgramStats,
} from '../store/selectors';

/**
 * Hook principal pour utiliser SkillLoop avec tous les selectors optimisés
 */
export function useSkillLoop() {
  const store = useSkillLoopStore();

  // Créer un objet progress pour compatibilité avec les selectors
  const progress = {
    totalXp: store.totalXp,
    loops: store.loops,
  };

  return {
    // Store de base
    ...store,
    progress, // Pour compatibilité avec les selectors

    // Selectors optimisés
    getLoop: (loopId: string) => useLoop(store.program, loopId),
    getLoopProgress: (loopId: string) => store.getLoopProgress(loopId),
    getExerciseProgress: (loopId: string, exerciseId: string) => {
      const loopProgress = store.getLoopProgress(loopId);
      return useExerciseProgress(loopProgress, exerciseId);
    },
    getLoopStats: (loopId: string) => {
      const loop = useLoop(store.program, loopId);
      const loopProgress = store.getLoopProgress(loopId);
      if (!loop) return null;
      return useLoopStats(loop, loopProgress);
    },
    getProgramStats: () => useProgramStats(store.program, progress),
  };
}

/**
 * Hook simplifié pour un loop spécifique
 */
export function useLoopData(loopId: string) {
  const store = useSkillLoopStore();
  const loop = useLoop(store.program, loopId);
  const loopProgress = store.getLoopProgress(loopId);
  const stats = loop ? useLoopStats(loop, loopProgress) : null;

  return {
    loop,
    loopProgress,
    stats,
    isExerciseCompleted: (exerciseId: string) => {
      const progress = store.getLoopProgress(loopId);
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

