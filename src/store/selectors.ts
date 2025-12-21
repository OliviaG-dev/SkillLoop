import { useMemo } from "react";
import type { Program, Loop, Chapter, Path } from "../types/skillloop.readonly";
import type { UserProgress, LoopProgress } from "../types/progress";

// =======================
// Selectors pour éviter les recalculs
// =======================

export function useLoop(program: Program, loopId: string): Loop | null {
  return useMemo(() => {
    for (const path of program.paths) {
      for (const chapter of path.modules) {
        const loop = chapter.loops.find((l) => l.id === loopId);
        if (loop) return loop;
      }
    }
    return null;
  }, [program, loopId]);
}

export function useLoopProgress(
  progress: UserProgress,
  loopId: string
): LoopProgress | null {
  return useMemo(() => {
    return progress.loops[loopId] || null;
  }, [progress, loopId]);
}

export function useExerciseProgress(
  loopProgress: LoopProgress | null,
  exerciseId: string
): boolean {
  return useMemo(() => {
    return loopProgress?.completedExercises.includes(exerciseId) ?? false;
  }, [loopProgress, exerciseId]);
}

export function useAllLoops(program: Program): readonly Loop[] {
  return useMemo(() => {
    const loops: Loop[] = [];
    program.paths.forEach((path) => {
      path.modules.forEach((chapter) => {
        // Convertir readonly array en array mutable
        chapter.loops.forEach((loop) => loops.push(loop));
      });
    });
    return loops as readonly Loop[];
  }, [program]);
}

export function useLoopsByChapter(
  program: Program,
  chapterId: string
): readonly Loop[] {
  return useMemo(() => {
    for (const path of program.paths) {
      const chapter = path.modules.find((m) => m.id === chapterId);
      if (chapter) {
        return chapter.loops;
      }
    }
    return [] as readonly Loop[];
  }, [program, chapterId]);
}

export function useChapter(
  program: Program,
  chapterId: string
): Chapter | null {
  return useMemo(() => {
    for (const path of program.paths) {
      const chapter = path.modules.find((m) => m.id === chapterId);
      if (chapter) return chapter;
    }
    return null;
  }, [program, chapterId]);
}

export function usePath(program: Program, pathId: string): Path | null {
  return useMemo(() => {
    return program.paths.find((p) => p.id === pathId) || null;
  }, [program, pathId]);
}

export function useLoopStats(loop: Loop, loopProgress: LoopProgress | null) {
  return useMemo(() => {
    const totalExercises = loop.exercises.length;
    const completedExercises = loopProgress?.completedExercises.length ?? 0;
    const completionPercentage =
      totalExercises > 0 ? (completedExercises / totalExercises) * 100 : 0;
    const isCompleted = loopProgress?.completed ?? false;
    const allExercisesCompleted =
      totalExercises > 0 && completedExercises === totalExercises;

    // Calculer XP gagné
    let xpEarned = 0;
    if (loopProgress) {
      loop.exercises.forEach((exercise) => {
        if (loopProgress.completedExercises.includes(exercise.id)) {
          xpEarned += exercise.xpReward;
        }
      });

      if (allExercisesCompleted) {
        xpEarned += loop.xpBonus.completion;
      }

      if (isCompleted) {
        xpEarned += loop.xpBonus.fullCompletion;
      }

      const debriefCompleted =
        loopProgress.debrief.notes.trim() !== "" ||
        loopProgress.debrief.insights.trim() !== "" ||
        loopProgress.debrief.questions.trim() !== "";
      if (debriefCompleted) {
        xpEarned += loop.xpBonus.reflectionCompleted;
      }
    }

    return {
      totalExercises,
      completedExercises,
      completionPercentage,
      isCompleted,
      allExercisesCompleted,
      xpEarned,
    };
  }, [loop, loopProgress]);
}

export function useProgramStats(program: Program, progress: UserProgress) {
  return useMemo(() => {
    const allLoops: Loop[] = [];
    program.paths.forEach((path) => {
      path.modules.forEach((chapter) => {
        allLoops.push(...chapter.loops);
      });
    });

    const totalLoops = allLoops.length;
    const completedLoops = allLoops.filter(
      (loop) => progress.loops[loop.id]?.completed
    ).length;

    const totalExercises = allLoops.reduce(
      (sum, loop) => sum + loop.exercises.length,
      0
    );
    const completedExercises = allLoops.reduce((sum, loop) => {
      const loopProgress = progress.loops[loop.id];
      return sum + (loopProgress?.completedExercises.length ?? 0);
    }, 0);

    const completionPercentage =
      totalLoops > 0 ? (completedLoops / totalLoops) * 100 : 0;

    // Calculer le streak (jours consécutifs complétés depuis le début)
    let currentStreak = 0;
    for (const loop of allLoops) {
      if (progress.loops[loop.id]?.completed) {
        currentStreak++;
      } else {
        break;
      }
    }

    // Calculer la meilleure série
    let longestStreak = 0;
    let tempStreak = 0;
    for (const loop of allLoops) {
      if (progress.loops[loop.id]?.completed) {
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        tempStreak = 0;
      }
    }

    return {
      totalLoops,
      completedLoops,
      totalExercises,
      completedExercises,
      completionPercentage,
      currentStreak,
      longestStreak,
      totalXp: progress.totalXp,
    };
  }, [program, progress]);
}
