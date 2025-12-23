# Changelog : Support Multi-Formations

## Résumé des changements

Le système SkillLoop a été refactorisé pour supporter plusieurs formations simultanément. Chaque formation a maintenant sa propre progression indépendante.

## Nouveaux fichiers

### Data
- `src/data/programs/index.ts` : Registre centralisé de toutes les formations

### Stores
- `src/store/useProgramsStore.ts` : Store pour les métadonnées des formations

### Pages
- `src/pages/Programs/Programs.tsx` : Page de liste des formations
- `src/pages/Programs/Programs.css` : Styles de la page Programs

### Composants
- `src/components/ProgramCard/ProgramCard.tsx` : Carte d'affichage d'une formation
- `src/components/ProgramCard/ProgramCard.css` : Styles de la carte

### Documentation
- `docs/MULTI-PROGRAMS.md` : Documentation complète du système multi-formations

## Fichiers modifiés

### `src/store/useSkillLoopStore.ts`
- **Refactorisation majeure** : Support de plusieurs formations
- Nouvelle structure de données : `programsProgress` (objet avec programId comme clé)
- Nouvelle méthode : `loadProgram(programId)` pour charger une formation
- Migration automatique depuis l'ancienne structure (version 1 → version 2)
- Toutes les actions fonctionnent maintenant avec la formation actuelle

### `src/App.tsx`
- Ajout de la vue "programs"
- Gestion de `selectedProgramId` pour suivre la formation sélectionnée
- Chargement automatique de la formation via `useEffect`
- Navigation vers la page Programs

### `src/components/Header/Header.tsx`
- Ajout du bouton "Formations" dans la navigation
- Mise à jour des types pour inclure "programs"

### `src/pages/Home/Home.tsx`
- Ajout du bouton "Voir les formations"
- Mise à jour des types de navigation

### `src/pages/Dashboard/SkillLoopDashboard.tsx`
- Ajout de la prop `programId`
- Chargement automatique de la formation si nécessaire

### `src/pages/LoopDay/LoopDay.tsx`
- Ajout de la prop `programId`
- Chargement automatique de la formation si nécessaire

## Changements de structure de données

### Avant (Version 1)
```typescript
{
  totalXp: 500,
  loops: {
    "loop-1": { ... }
  }
}
```

### Après (Version 2)
```typescript
{
  currentProgramId: "skillloop-ai-foundations",
  programsProgress: {
    "skillloop-ai-foundations": {
      totalXp: 500,
      loops: { ... }
    },
    "skilloop-prompt-engineering": {
      totalXp: 200,
      loops: { ... }
    }
  }
}
```

## Migration automatique

Le système gère automatiquement la migration des données existantes :
- Les anciennes données sont converties et assignées à `skillloop-ai-foundations`
- Aucune perte de données
- Migration transparente pour l'utilisateur

## Breaking changes

### Pour les développeurs

1. **Store** : `useSkillLoopStore` nécessite maintenant de charger une formation avant d'utiliser les données
   ```typescript
   // Avant
   const program = useSkillLoopStore((s) => s.program);
   
   // Après
   const loadProgram = useSkillLoopStore((s) => s.loadProgram);
   loadProgram("skillloop-ai-foundations");
   const program = useSkillLoopStore((s) => s.program);
   ```

2. **Composants** : Les composants Dashboard et LoopDay nécessitent maintenant un `programId`
   ```typescript
   // Avant
   <SkillLoopDashboard onNavigateToDay={handleNavigate} />
   
   // Après
   <SkillLoopDashboard programId="skillloop-ai-foundations" onNavigateToDay={handleNavigate} />
   ```

## Améliorations

1. **Séparation des responsabilités** : Métadonnées et progression sont maintenant séparées
2. **Performance** : Chargement à la demande des formations
3. **Extensibilité** : Facile d'ajouter de nouvelles formations
4. **UX** : Navigation claire entre les formations

## Prochaines étapes

- [ ] Ajouter des statistiques globales (toutes formations confondues)
- [ ] Implémenter le lazy loading des formations
- [ ] Ajouter des filtres et recherche sur la page Programs
- [ ] Améliorer le calcul de progression (cache des totaux)

## Notes importantes

- Les données existantes sont automatiquement migrées
- Aucune action manuelle requise pour les utilisateurs existants
- Le système reste rétrocompatible avec les anciennes données

