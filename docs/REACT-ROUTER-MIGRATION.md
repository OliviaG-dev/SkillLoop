# Migration vers React Router

## Vue d'ensemble

L'application a été migrée d'un système de navigation basé sur l'état React (`useState`) vers **React Router**, permettant une navigation basée sur les URLs et une meilleure expérience utilisateur.

## Structure des routes

### Routes disponibles

- **`/`** : Page d'accueil
- **`/programs`** : Liste de toutes les formations disponibles
- **`/programs/:programId`** : Dashboard d'une formation spécifique
- **`/programs/:programId/day/:dayNumber`** : Page d'un jour spécifique d'une formation

### Exemples d'URLs

```
/                                                    → Page d'accueil
/programs                                            → Liste des formations
/programs/skillloop-ai-foundations                  → Dashboard de "AI Foundations"
/programs/skillloop-ai-foundations/day/1             → Jour 1 de "AI Foundations"
/programs/skilloop-prompt-engineering/day/5         → Jour 5 de "Prompt Engineering"
```

## Architecture

### Fichiers principaux

1. **`src/routes/index.tsx`** : Configuration des routes avec `createBrowserRouter`
2. **`src/main.tsx`** : Point d'entrée qui utilise `RouterProvider`
3. **`src/App.tsx`** : Composant racine qui utilise `Outlet` pour afficher les routes enfants
4. **`src/components/Header/Header.tsx`** : Utilise `useNavigate` et `useLocation` pour la navigation

### Composants de pages

Tous les composants de pages ont été mis à jour pour utiliser React Router :

- **`Home`** : Utilise `useNavigate()` pour naviguer vers `/programs`
- **`Programs`** : Utilise `useNavigate()` pour naviguer vers `/programs/:programId`
- **`SkillLoopDashboard`** : Utilise `useParams()` pour récupérer `programId` et `useNavigate()` pour naviguer
- **`LoopDay`** : Utilise `useParams()` pour récupérer `programId` et `dayNumber`

## Changements techniques

### Avant (navigation par état)

```typescript
// App.tsx
const [currentView, setCurrentView] = useState<View>("home");
const [selectedProgramId, setSelectedProgramId] = useState<string | null>(null);

const handleNavigate = (view: View, programId?: string) => {
  setCurrentView(view);
  if (programId) setSelectedProgramId(programId);
};
```

### Après (React Router)

```typescript
// App.tsx
import { Outlet, useLocation } from "react-router-dom";

function App() {
  const location = useLocation();
  // Déterminer la vue depuis l'URL
  const currentView = getCurrentView();
  
  return (
    <div className="app">
      <Header currentView={currentView} />
      <main className="app-main">
        <Outlet /> {/* Affiche la route active */}
      </main>
    </div>
  );
}
```

### Navigation dans les composants

```typescript
// Avant
<button onClick={() => onNavigate("dashboard", programId)}>
  Voir le dashboard
</button>

// Après
import { useNavigate } from "react-router-dom";

const navigate = useNavigate();
<button onClick={() => navigate(`/programs/${programId}`)}>
  Voir le dashboard
</button>
```

### Récupération des paramètres

```typescript
// Avant
type Props = {
  programId: string;
  dayNumber: number;
};

// Après
import { useParams } from "react-router-dom";

const { programId, dayNumber } = useParams<{ 
  programId: string; 
  dayNumber: string;
}>();
const dayNumberNum = dayNumber ? parseInt(dayNumber, 10) : 0;
```

## Avantages de React Router

1. **URLs partageables** : Les utilisateurs peuvent partager des liens directs vers une formation ou un jour spécifique
2. **Navigation navigateur** : Utilisation du bouton retour/avant du navigateur
3. **Bookmarks** : Possibilité de créer des favoris pour des pages spécifiques
4. **SEO** : Meilleure indexation par les moteurs de recherche (si nécessaire)
5. **État de navigation** : L'URL reflète l'état de l'application

## Gestion du chargement des formations

Les composants `SkillLoopDashboard` et `LoopDay` chargent automatiquement la formation correspondante au `programId` de l'URL :

```typescript
useEffect(() => {
  if (!programId) {
    navigate("/programs");
    return;
  }

  if (!program || program.id !== programId) {
    const success = loadProgram(programId);
    if (success) {
      setCurrentProgram(programId);
    } else {
      navigate("/programs"); // Redirection si la formation n'existe pas
    }
  }
}, [programId, program, loadProgram, setCurrentProgram, navigate]);
```

## Migration des stores

Les stores (`useSkillLoopStore`, `useProgramsStore`) n'ont pas été modifiés pour cette migration. Ils continuent de fonctionner de la même manière, mais sont maintenant utilisés dans un contexte de routes React Router.

## Tests

Pour tester la migration :

1. Naviguer vers `/` → Page d'accueil
2. Cliquer sur "Voir les formations" → `/programs`
3. Cliquer sur une formation → `/programs/:programId`
4. Cliquer sur un jour → `/programs/:programId/day/:dayNumber`
5. Utiliser le bouton retour du navigateur → Navigation fonctionnelle
6. Copier/coller une URL → La page se charge correctement

## Notes importantes

- Les routes sont définies avec `createBrowserRouter` (React Router v6.4+)
- Toutes les routes sont des routes enfants de `/` dans `App.tsx`
- Le composant `Header` détermine la vue active en analysant `location.pathname`
- Les redirections sont gérées automatiquement si un `programId` invalide est fourni

