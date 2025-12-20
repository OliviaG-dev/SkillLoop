export type TrainingTask = {
  id: string;
  label: string;
  done: boolean;
  estimatedTime?: number; // en minutes
  actualTime?: number; // en minutes
};

export type TrainingDay = {
  id: string;
  day: number;
  title: string;
  date: string; // ISO date string
  tasks: TrainingTask[];
  notes: string;
  insights: string; // "Ce que j'ai compris aujourd'hui"
  questions: string; // "Ce qui reste flou"
  completed: boolean;
};

export type TrainingWeek = {
  weekNumber: number;
  days: TrainingDay[];
};

export type ProgressStats = {
  totalDays: number;
  completedDays: number;
  currentStreak: number;
  longestStreak: number;
  completionPercentage: number;
};

