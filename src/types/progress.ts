// =======================
// Progression d’un exercice
// =======================

export interface ExerciseProgress {
  exerciseId: string;
  completed: boolean;
}

// =======================
// Progression d’une loop
// =======================

export interface LoopProgress {
  loopId: string;
  completedExercises: string[];
  xpEarned: number;
  completed: boolean;
  debrief: {
    notes: string;
    insights: string;
    questions: string;
  };
}

// =======================
// Progression globale utilisateur
// =======================

export interface UserProgress {
  totalXp: number;
  loops: Record<string, LoopProgress>;
}