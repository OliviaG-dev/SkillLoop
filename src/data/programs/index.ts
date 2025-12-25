import type { Program } from "../../types/skillloop.readonly";
import aiFoundationsData from "../skillloop-ai-foundations.json";
import promptEngineeringData from "../skilloop-prompt-engineering.json";
import aiAutomationProData from "../skillloop-ai-automation-pro.json";
import creativePromptingData from "../skillloop-creative-prompting.json";
import iaProductivityData from "../skillloop-ia-productivity.json";
import dataStorytellingData from "../skillloop-data-storytelling-ai.json";

/**
 * Métadonnées d'une formation pour l'affichage dans la liste
 */
export interface ProgramMetadata {
  id: string;
  title: string;
  description: string;
  estimatedHoursPerLoop: number;
  color?: string;
  icon?: string;
}

/**
 * Chargeur de programme - fonction qui retourne les données complètes d'une formation
 */
export type ProgramLoader = () => Program;

/**
 * Configuration d'une formation avec ses métadonnées et son chargeur
 */
export interface ProgramConfig {
  metadata: ProgramMetadata;
  loader: ProgramLoader;
}

/**
 * Liste de toutes les formations disponibles
 * 
 * Pour ajouter une nouvelle formation :
 * 1. Ajoutez le fichier JSON dans src/data/
 * 2. Importez-le ici
 * 3. Ajoutez une entrée dans programsRegistry avec metadata et loader
 */
export const programsRegistry: Record<string, ProgramConfig> = {
  "skillloop-ai-foundations": {
    metadata: {
      id: "skillloop-ai-foundations",
      title: "Fondations IA & Intégration",
      description: "Construire un assistant IA fonctionnel avec streaming, backend propre et UX crédible",
      estimatedHoursPerLoop: 5,
      color: "#667eea",
    },
    loader: () => aiFoundationsData as Program,
  },
  "skilloop-prompt-engineering": {
    metadata: {
      id: "skilloop-prompt-engineering",
      title: "Prompt Engineering & Maîtrise IA",
      description: "Apprendre à écrire des prompts clairs, puissants et réutilisables pour exploiter pleinement les IA",
      estimatedHoursPerLoop: 2,
      color: "#8b7fb8",
    },
    loader: () => promptEngineeringData as Program,
  },
  "skillloop-ai-automation-pro": {
    metadata: {
      id: "skillloop-ai-automation-pro",
      title: "Automatisation avec l'IA pour les pros",
      description: "Automatiser des tâches métiers concrètes avec l'IA, des prompts jusqu'aux workflows complets",
      estimatedHoursPerLoop: 2,
      color: "#6b9bd2",
    },
    loader: () => aiAutomationProData as Program,
  },
  "skillloop-creative-prompting": {
    metadata: {
      id: "skillloop-creative-prompting",
      title: "Prompting pour Creative Professionals",
      description: "Créer du contenu créatif cohérent, différenciant et réutilisable avec l'IA.",
      estimatedHoursPerLoop: 2,
      color: "#6bc7a6",
    },
    loader: () => creativePromptingData as Program,
  },
  "skillloop-ia-productivity": {
    metadata: {
      id: "skillloop-ia-productivity",
      title: "IA & Productivité",
      description: "Optimiser votre productivité avec l'IA au quotidien",
      estimatedHoursPerLoop: 2,
      color: "#f59e0b",
    },
    loader: () => iaProductivityData as Program,
  },
  "skillloop-data-storytelling-ai": {
    metadata: {
      id: "skillloop-data-storytelling-ai",
      title: "Data Storytelling assisté par IA",
      description: "Transformer des données brutes en récits clairs, visuels et décisionnels grâce à l'IA",
      estimatedHoursPerLoop: 2,
      color: "#ec4899",
    },
    loader: () => dataStorytellingData as Program,
  },
};

/**
 * Récupère toutes les métadonnées des formations disponibles
 */
export function getAllProgramsMetadata(): ProgramMetadata[] {
  return Object.values(programsRegistry).map((config) => config.metadata);
}

/**
 * Récupère les métadonnées d'une formation par son ID
 */
export function getProgramMetadata(programId: string): ProgramMetadata | undefined {
  return programsRegistry[programId]?.metadata;
}

/**
 * Charge les données complètes d'une formation par son ID
 */
export function loadProgram(programId: string): Program | undefined {
  const config = programsRegistry[programId];
  if (!config) return undefined;
  return config.loader();
}

/**
 * Vérifie si une formation existe
 */
export function programExists(programId: string): boolean {
  return programId in programsRegistry;
}

