# Documentation : Gestion Multi-Formations

## Vue d'ensemble

Le système SkillLoop a été refactorisé pour supporter plusieurs formations simultanément. Chaque formation a sa propre progression indépendante, permettant aux utilisateurs de suivre plusieurs parcours d'apprentissage en parallèle.

## Architecture

### Structure des fichiers

```
src/
├── data/
│   ├── programs/
│   │   └── index.ts              # Registre de toutes les formations
│   ├── skillloop-ai-foundations.json
│   ├── skillloop-ai-automation-pro.json
│   ├── skillloop-creative-prompting.json
│   ├── skillloop-ia-productivity.json
│   └── skilloop-prompt-engineering.json
│
├── store/
│   ├── useProgramsStore.ts       # Store pour les métadonnées des formations
│   └── useSkillLoopStore.ts      # Store pour la progression (multi-formations)
│
├── pages/
│   ├── Programs/
│   │   ├── Programs.tsx          # Page de liste des formations
│   │   └── Programs.css
│   ├── Dashboard/
│   │   └── SkillLoopDashboard.tsx  # Dashboard d'une formation spécifique
│   └── LoopDay/
│       └── LoopDay.tsx          # Page d'un jour spécifique
│
└── components/
    └── ProgramCard/
        ├── ProgramCard.tsx      # Carte d'affichage d'une formation
        └── ProgramCard.css
```

## Composants principaux

### 1. Registre des formations (`src/data/programs/index.ts`)

Le fichier `index.ts` centralise toutes les formations disponibles. Il exporte :

- **`ProgramMetadata`** : Interface pour les métadonnées d'une formation (titre, description, couleur, etc.)
- **`ProgramConfig`** : Configuration complète avec métadonnées et chargeur
- **`programsRegistry`** : Objet contenant toutes les formations disponibles
- **Fonctions utilitaires** :
  - `getAllProgramsMetadata()` : Récupère toutes les métadonnées
  - `getProgramMetadata(programId)` : Récupère les métadonnées d'une formation
  - `loadProgram(programId)` : Charge les données complètes d'une formation
  - `programExists(programId)` : Vérifie si une formation existe

#### Ajouter une nouvelle formation

1. Ajoutez le fichier JSON dans `src/data/`
2. Importez-le dans `src/data/programs/index.ts`
3. Ajoutez une entrée dans `programsRegistry` :

```typescript
"nouvelle-formation-id": {
  metadata: {
    id: "nouvelle-formation-id",
    title: "Titre de la formation",
    description: "Description",
    estimatedHoursPerLoop: 2,
    color: "#667eea",
  },
  loader: () => nouvelleFormationData as Program,
},
```

### 2. Store des métadonnées (`useProgramsStore.ts`)

Store léger pour gérer les métadonnées des formations sans charger toutes les données.

**État :**
- `programs` : Liste de toutes les formations disponibles
- `currentProgramId` : ID de la formation actuellement sélectionnée

**Actions :**
- `setCurrentProgram(programId)` : Définit la formation actuelle
- `getCurrentProgramMetadata()` : Récupère les métadonnées de la formation actuelle
- `refreshPrograms()` : Rafraîchit la liste des formations

### 3. Store de progression (`useSkillLoopStore.ts`)

Store principal pour gérer la progression de toutes les formations.

**État :**
- `currentProgramId` : ID de la formation actuellement chargée
- `program` : Données complètes de la formation actuelle
- `programsProgress` : Progression de toutes les formations (clé = programId)

**Actions principales :**
- `loadProgram(programId)` : Charge une formation et initialise sa progression si nécessaire
- `getCurrentProgramProgress()` : Récupère la progression de la formation actuelle
- `completeExercise(loopId, exerciseId, xp)` : Complète un exercice (pour la formation actuelle)
- `resetProgress(programId?)` : Réinitialise la progression (d'une formation ou toutes)

**Migration automatique :**
Le store gère automatiquement la migration depuis l'ancienne structure (version 1) vers la nouvelle (version 2). Les anciennes données sont automatiquement converties.

### 4. Page Programs (`pages/Programs/Programs.tsx`)

Page principale affichant toutes les formations disponibles avec leur progression.

**Fonctionnalités :**
- Affichage de toutes les formations en grille
- Calcul automatique de la progression pour chaque formation
- Navigation vers le dashboard d'une formation au clic

**Calcul de progression :**
- Charge chaque formation pour compter le nombre total de loops
- Calcule le nombre de loops complétées
- Affiche le pourcentage de progression

### 5. Composant ProgramCard (`components/ProgramCard/ProgramCard.tsx`)

Carte réutilisable pour afficher une formation.

**Props :**
- `program` : Métadonnées de la formation
- `onClick` : Callback au clic
- `progress` : Progression optionnelle (XP, loops complétées, pourcentage)

**Affichage :**
- Titre et description
- Progression (si disponible)
- Métadonnées (heures estimées par jour)

## Navigation

### Flux de navigation

```
Home → Programs → Dashboard → LoopDay
  ↑                              ↓
  └──────────────────────────────┘
```

1. **Home** : Page d'accueil avec présentation
2. **Programs** : Liste de toutes les formations
3. **Dashboard** : Vue d'ensemble d'une formation spécifique
4. **LoopDay** : Détails d'un jour spécifique

### Routing dans App.tsx

Le composant `App.tsx` gère le routing avec les états suivants :

- `currentView` : Vue actuelle ("home" | "programs" | "dashboard" | "loopday")
- `selectedProgramId` : ID de la formation sélectionnée
- `selectedDay` : Numéro du jour sélectionné

**Chargement automatique :**
Quand `selectedProgramId` change, la formation est automatiquement chargée via `useEffect`.

## Persistance des données

### Structure de stockage

Les données sont persistées dans `localStorage` sous la clé `skillloop-progress` :

```typescript
{
  currentProgramId: "skillloop-ai-foundations",
  programsProgress: {
    "skillloop-ai-foundations": {
      totalXp: 500,
      loops: {
        "loop-1": {
          loopId: "loop-1",
          completedExercises: ["e1", "e2"],
          xpEarned: 100,
          completed: true,
          debrief: { notes: "", insights: "", questions: "" }
        }
      }
    },
    "skilloop-prompt-engineering": {
      totalXp: 200,
      loops: { ... }
    }
  }
}
```

### Migration

Le système gère automatiquement la migration depuis l'ancienne structure :

- **Version 1** : `{ totalXp, loops }` (une seule formation)
- **Version 2** : `{ currentProgramId, programsProgress }` (multi-formations)

Les anciennes données sont automatiquement converties et assignées à `skillloop-ai-foundations` (formation par défaut).

## Utilisation

### Charger une formation

```typescript
const loadProgram = useSkillLoopStore((s) => s.loadProgram);
loadProgram("skillloop-ai-foundations");
```

### Accéder à la progression

```typescript
const progress = useSkillLoopStore((s) => s.getCurrentProgramProgress());
const totalXp = useSkillLoopStore((s) => s.getTotalXp());
```

### Compléter un exercice

```typescript
const completeExercise = useSkillLoopStore((s) => s.completeExercise);
completeExercise("loop-1", "e1", 20);
```

### Réinitialiser la progression

```typescript
const resetProgress = useSkillLoopStore((s) => s.resetProgress);
resetProgress("skillloop-ai-foundations"); // Une formation
resetProgress(); // Toutes les formations
```

## Bonnes pratiques

1. **Toujours charger la formation avant d'accéder aux données**
   ```typescript
   useEffect(() => {
     if (!program || program.id !== programId) {
       loadProgram(programId);
     }
   }, [programId]);
   ```

2. **Utiliser les selectors du store pour la progression**
   - `getTotalXp()` : XP de la formation actuelle
   - `getLevel()` : Niveau de la formation actuelle
   - `getLoopProgress(loopId)` : Progression d'une loop spécifique

3. **Vérifier l'existence d'une formation**
   ```typescript
   if (programExists(programId)) {
     loadProgram(programId);
   }
   ```

4. **Gérer les cas où la formation n'est pas chargée**
   ```typescript
   if (!program) {
     return <div>Chargement...</div>;
   }
   ```

## Extensions futures

### Améliorations possibles

1. **Lazy loading** : Charger les formations uniquement quand nécessaire
2. **Cache** : Mettre en cache les formations chargées
3. **Synchronisation** : Synchroniser la progression entre appareils
4. **Statistiques globales** : Vue d'ensemble de toutes les formations
5. **Filtres et recherche** : Filtrer les formations par catégorie, niveau, etc.

## Dépannage

### La formation ne se charge pas

1. Vérifiez que l'ID de la formation existe dans `programsRegistry`
2. Vérifiez que le fichier JSON est valide
3. Vérifiez les erreurs dans la console du navigateur

### La progression ne s'affiche pas

1. Vérifiez que la formation est bien chargée (`loadProgram`)
2. Vérifiez que `currentProgramId` correspond à la formation attendue
3. Vérifiez les données dans `localStorage`

### Migration des données

Si vous avez des problèmes de migration :

1. Ouvrez la console du navigateur
2. Vérifiez les données dans `localStorage.getItem("skillloop-progress")`
3. Si nécessaire, supprimez les anciennes données : `localStorage.removeItem("skillloop-progress")`

## Conclusion

Le système multi-formations permet une flexibilité totale pour gérer plusieurs parcours d'apprentissage simultanément. Chaque formation est indépendante, avec sa propre progression, tout en partageant le même système de niveaux et badges.

