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

// =======================
// Types pour useTrainingData
// =======================

export interface TrainingDay {
  id: string;
  day: number;
  title: string;
  date: string;
  tasks: Array<{
    id: string;
    label: string;
    done: boolean;
  }>;
  notes: string;
  insights: string;
  questions: string;
  completed: boolean;
}

export interface ProgressStats {
  totalDays: number;
  completedDays: number;
  currentStreak: number;
  longestStreak: number;
  completionPercentage: number;
}
