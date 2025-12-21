import type { Program, Loop } from '../types/skillloop.readonly';
import type { UserProgress, LoopProgress } from '../types/progress';

// =======================
// Helpers de calcul XP
// =======================

export function calculateLoopXp(loop: Loop, loopProgress: LoopProgress): number {
  let xp = 0;

  // XP des exercices complétés
  loop.exercises.forEach((exercise) => {
    if (loopProgress.completedExercises.includes(exercise.id)) {
      xp += exercise.xpReward;
    }
  });

  // Bonus de complétion
  const allExercisesCompleted = loop.exercises.every((ex) =>
    loopProgress.completedExercises.includes(ex.id)
  );
  if (allExercisesCompleted) {
    xp += loop.xpBonus.completion;
  }

  // Bonus de complétion totale (loop marquée comme complétée)
  if (loopProgress.completed) {
    xp += loop.xpBonus.fullCompletion;
  }

  // Bonus de réflexion (debrief complété)
  const debriefCompleted =
    loopProgress.debrief.notes.trim() !== '' ||
    loopProgress.debrief.insights.trim() !== '' ||
    loopProgress.debrief.questions.trim() !== '';
  if (debriefCompleted) {
    xp += loop.xpBonus.reflectionCompleted;
  }

  return xp;
}

export function calculateTotalXp(program: Program, progress: UserProgress): number {
  let totalXp = 0;

  program.paths.forEach((path) => {
    path.modules.forEach((chapter) => {
      chapter.loops.forEach((loop) => {
        const loopProgress = progress.loops[loop.id];
        if (loopProgress) {
          totalXp += calculateLoopXp(loop, loopProgress);
        }
      });
    });
  });

  return totalXp;
}

