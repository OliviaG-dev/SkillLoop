import { useCallback, useMemo, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { Program } from "../types/skillloop.readonly";
import type { UserProgress, LoopProgress } from "../types/progress";
import { calculateTotalXp } from "./helpers";
import { SkillLoopContext } from "./context";
import programData from "../data/skillloop-ai-foundations.json";

// =======================
// Types du Store
// =======================

interface SkillLoopState {
  program: Program;
  progress: UserProgress;
  currentLoopId: string | null;
}

interface SkillLoopActions {
  // Progression des exercices
  completeExercise: (loopId: string, exerciseId: string) => void;
  uncompleteExercise: (loopId: string, exerciseId: string) => void;

  // Progression des loops
  updateLoopDebrief: (
    loopId: string,
    debrief: { notes: string; insights: string; questions: string }
  ) => void;
  markLoopCompleted: (loopId: string) => void;
  markLoopUncompleted: (loopId: string) => void;

  // Navigation
  setCurrentLoopId: (loopId: string | null) => void;

  // Reset
  resetProgress: () => void;
}

export interface SkillLoopContextValue
  extends SkillLoopState, SkillLoopActions {}

// =======================
// Constantes
// =======================

const STORAGE_KEY = "skillloop-progress";
const DEFAULT_PROGRESS: UserProgress = {
  totalXp: 0,
  loops: {},
};

// =======================
// Helpers de persistence
// =======================

function loadProgressFromStorage(): UserProgress {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Validation basique
      if (parsed && typeof parsed === "object") {
        return {
          totalXp: parsed.totalXp || 0,
          loops: parsed.loops || {},
        };
      }
    }
  } catch (error) {
    console.error("Erreur lors du chargement de la progression:", error);
  }
  return DEFAULT_PROGRESS;
}

function saveProgressToStorage(progress: UserProgress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (error) {
    console.error("Erreur lors de la sauvegarde de la progression:", error);
  }
}

// Context est exporté depuis context.ts

// =======================
// Provider
// =======================

interface SkillLoopProviderProps {
  children: ReactNode;
}

export function SkillLoopProvider({ children }: SkillLoopProviderProps) {
  const [program] = useState<Program>(programData as Program);
  const [progress, setProgress] = useState<UserProgress>(
    loadProgressFromStorage
  );
  const [currentLoopId, setCurrentLoopId] = useState<string | null>(null);

  // Synchroniser avec localStorage
  useEffect(() => {
    const updatedProgress = {
      ...progress,
      totalXp: calculateTotalXp(program, progress),
    };
    saveProgressToStorage(updatedProgress);
  }, [progress, program]);

  // Actions
  const completeExercise = useCallback((loopId: string, exerciseId: string) => {
    setProgress((prev) => {
      const loopProgress = prev.loops[loopId] || {
        loopId,
        completedExercises: [],
        xpEarned: 0,
        completed: false,
        debrief: { notes: "", insights: "", questions: "" },
      };

      if (!loopProgress.completedExercises.includes(exerciseId)) {
        const updatedLoopProgress: LoopProgress = {
          ...loopProgress,
          completedExercises: [...loopProgress.completedExercises, exerciseId],
        };

        return {
          ...prev,
          loops: {
            ...prev.loops,
            [loopId]: updatedLoopProgress,
          },
        };
      }

      return prev;
    });
  }, []);

  const uncompleteExercise = useCallback(
    (loopId: string, exerciseId: string) => {
      setProgress((prev) => {
        const loopProgress = prev.loops[loopId];
        if (!loopProgress) return prev;

        const updatedLoopProgress: LoopProgress = {
          ...loopProgress,
          completedExercises: loopProgress.completedExercises.filter(
            (id) => id !== exerciseId
          ),
          completed: false, // Si on décomplète un exercice, la loop n'est plus complète
        };

        return {
          ...prev,
          loops: {
            ...prev.loops,
            [loopId]: updatedLoopProgress,
          },
        };
      });
    },
    []
  );

  const updateLoopDebrief = useCallback(
    (
      loopId: string,
      debrief: { notes: string; insights: string; questions: string }
    ) => {
      setProgress((prev) => {
        const loopProgress = prev.loops[loopId] || {
          loopId,
          completedExercises: [],
          xpEarned: 0,
          completed: false,
          debrief: { notes: "", insights: "", questions: "" },
        };

        const updatedLoopProgress: LoopProgress = {
          ...loopProgress,
          debrief,
        };

        return {
          ...prev,
          loops: {
            ...prev.loops,
            [loopId]: updatedLoopProgress,
          },
        };
      });
    },
    []
  );

  const markLoopCompleted = useCallback((loopId: string) => {
    setProgress((prev) => {
      const loopProgress = prev.loops[loopId] || {
        loopId,
        completedExercises: [],
        xpEarned: 0,
        completed: false,
        debrief: { notes: "", insights: "", questions: "" },
      };

      const updatedLoopProgress: LoopProgress = {
        ...loopProgress,
        completed: true,
      };

      return {
        ...prev,
        loops: {
          ...prev.loops,
          [loopId]: updatedLoopProgress,
        },
      };
    });
  }, []);

  const markLoopUncompleted = useCallback((loopId: string) => {
    setProgress((prev) => {
      const loopProgress = prev.loops[loopId];
      if (!loopProgress) return prev;

      const updatedLoopProgress: LoopProgress = {
        ...loopProgress,
        completed: false,
      };

      return {
        ...prev,
        loops: {
          ...prev.loops,
          [loopId]: updatedLoopProgress,
        },
      };
    });
  }, []);

  const resetProgress = useCallback(() => {
    setProgress(DEFAULT_PROGRESS);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  // Calculer totalXp à chaque changement
  const progressWithXp = useMemo(() => {
    return {
      ...progress,
      totalXp: calculateTotalXp(program, progress),
    };
  }, [progress, program]);

  const value: SkillLoopContextValue = useMemo(
    () => ({
      program,
      progress: progressWithXp,
      currentLoopId,
      setCurrentLoopId,
      completeExercise,
      uncompleteExercise,
      updateLoopDebrief,
      markLoopCompleted,
      markLoopUncompleted,
      resetProgress,
    }),
    [
      program,
      progressWithXp,
      currentLoopId,
      completeExercise,
      uncompleteExercise,
      updateLoopDebrief,
      markLoopCompleted,
      markLoopUncompleted,
      resetProgress,
    ]
  );

  return (
    <SkillLoopContext.Provider value={value}>
      {children}
    </SkillLoopContext.Provider>
  );
}
