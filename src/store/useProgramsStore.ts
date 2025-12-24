import { create } from "zustand";
import { getAllProgramsMetadata, getProgramMetadata, type ProgramMetadata } from "../data/programs";

/**
 * Store pour gérer les métadonnées des formations disponibles
 * 
 * Ce store est séparé du store de progression pour permettre :
 * - Une liste légère des formations sans charger toutes les données
 * - Une navigation rapide entre les formations
 * - Une gestion centralisée des métadonnées
 */
interface ProgramsState {
  // Liste de toutes les formations disponibles
  programs: ProgramMetadata[];
  
  // Formation actuellement sélectionnée
  currentProgramId: string | null;
  
  // Actions
  setCurrentProgram: (programId: string | null) => void;
  getCurrentProgramMetadata: () => ProgramMetadata | undefined;
  refreshPrograms: () => void;
}

export const useProgramsStore = create<ProgramsState>((set, get) => ({
  // État initial : charger toutes les métadonnées
  programs: getAllProgramsMetadata(),
  currentProgramId: null,

  // Définir la formation actuelle
  setCurrentProgram: (programId) => {
    set({ currentProgramId: programId });
  },

  // Récupérer les métadonnées de la formation actuelle
  getCurrentProgramMetadata: () => {
    const { currentProgramId } = get();
    if (!currentProgramId) return undefined;
    return getProgramMetadata(currentProgramId);
  },

  // Rafraîchir la liste des formations (utile si on ajoute des formations dynamiquement)
  refreshPrograms: () => {
    set({ programs: getAllProgramsMetadata() });
  },
}));

