// =======================
// Ressources
// =======================

export type ResourceType =
  | "article"
  | "video"
  | "doc"
  | "repo"
  | "tool"
  | "course";

export interface Resource {
  readonly type: ResourceType;
  readonly label: string;
  readonly url: string;
}

// =======================
// Exercices
// =======================

export type ExerciseType = "read" | "watch" | "write" | "practice" | "reflect";

export interface Exercise {
  readonly id: string;
  readonly type: ExerciseType;
  readonly label: string;
  readonly estimatedMinutes: number;
  readonly xpReward: number;
  readonly resources: readonly Resource[];
}

// =======================
// Débrief (template)
// =======================

export interface Debrief {
  readonly notes: string;
  readonly insights: string;
  readonly questions: string;
}

// =======================
// XP Bonus Loop
// =======================

export interface XpBonus {
  readonly completion: number;
  readonly fullCompletion: number;
  readonly reflectionCompleted: number;
}

// =======================
// Loop
// =======================

export interface Loop {
  readonly id: string;
  readonly day: number;
  readonly title: string;
  readonly goal: string;
  readonly xpBonus: XpBonus;
  readonly exercises: readonly Exercise[];
  readonly debrief: Debrief;
}

// =======================
// Chapitre
// =======================

export interface Chapter {
  readonly id: string;
  readonly title: string;
  readonly loops: readonly Loop[];
}

// =======================
// Parcours
// =======================

export interface Path {
  readonly id: string;
  readonly title: string;
  readonly objective: string;
  readonly modules: readonly Chapter[];
}

// =======================
// Programme
// =======================

export interface Program {
  readonly id: string;
  readonly title: string;
  readonly description: string;
  readonly estimatedHoursPerLoop: number;
  readonly paths: readonly Path[];
}
