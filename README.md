# SkillLoop

**Apprendre, pratiquer, progresser**

SkillLoop est une application de formation conçue pour transformer l'apprentissage en un cycle continu de pratique et d'amélioration.

Chaque formation est structurée en parcours clairs, découpés en sessions quotidiennes (loops), avec des objectifs précis, des exercices pratiques, des ressources ciblées et un suivi de progression mesurable avec système XP et badges.

## 🎯 Concept

SkillLoop repose sur une idée simple : **les compétences se construisent par la répétition intentionnelle**.

L'objectif n'est pas de consommer du contenu, mais de pratiquer régulièrement, d'analyser ce qui est compris, d'identifier les blocages et de progresser durablement.

## ✨ Features

### 🏠 Page d'accueil (Home)

- **Présentation du projet** avec hero section élégante
- **Vue des formations disponibles** avec détails (nombre de jours, modules, exercices)
- **Aperçu des premières boucles** pour se mettre en confiance
- **Call-to-action** vers le dashboard des formations

### 📚 Page Formations (Programs)

- **Dashboard principal** avec vue d'ensemble de toutes les formations
- **Statistiques globales** avec cartes visuelles :
  - XP total accumulé (icône flamme)
  - Progression moyenne (icône tendance)
  - Formations finies (icône trophée)
  - Formations en cours (icône cible)
- **Organisation par sections** avec design cohérent :
  - **Formations en cours** : Affichage des formations avec progression active
  - **Nouvelles formations** : Formations disponibles mais non commencées
  - **Formations finies** : Formations complétées à 100%
- **Cartes de formation** avec :
  - Alignement uniforme du footer et de la barre de progression
  - Statistiques détaillées (jours complétés, XP gagné)
  - Barre de progression visuelle avec pourcentage
  - Design responsive et moderne
- **Navigation** vers le dashboard spécifique de chaque formation

### 📊 Dashboard d'une formation

- **Vue d'ensemble de tous les jours** avec grille de progression
- **Statistiques spécifiques à la formation** :
  - Niveau actuel et XP total pour cette formation
  - Pourcentage de progression
  - Badges obtenus
- **Thème de couleur dynamique** adapté à chaque formation
- **Navigation rapide** vers chaque jour de formation
- **Indicateurs visuels** pour les jours complétés, en cours et non commencés

### 📅 Page LoopDay (Jour spécifique)

Pour chaque jour de formation :

- ✅ **Checklist interactive des exercices** avec suivi de progression
  - Possibilité de cocher/décocher les exercices
  - Système XP dynamique (augmente/diminue selon l'état)
- 📝 **Section débrief** pour capturer tes réflexions :
  - Notes personnelles
  - "Ce que j'ai compris aujourd'hui" (insights)
  - "Ce qui reste flou" (questions)
- 📚 **Ressources disponibles** pour chaque exercice (articles, docs, vidéos)
- 🎯 **Barre de progression** du jour avec statistiques détaillées
- 🏆 **Bonus XP** pour complétion de loop et réflexion complète

### 🎮 Système de gamification

- **Système XP** : Gagne des points en complétant les exercices
- **Niveaux** : Monte de niveau en accumulant de l'XP (8 niveaux disponibles)
- **Badges** : Débloque des badges en progressant (Débutant, Apprenti, Compétent, Expert, Maître)
- **Bonus** : Bonus XP pour complétion de loop, full completion et réflexion

## 🚀 Technologies

- **React 19** - Interface utilisateur moderne
- **TypeScript** - Typage fort pour une meilleure maintenabilité
- **Vite** - Build tool ultra-rapide
- **React Router** - Navigation déclarative avec gestion d'URL
- **Zustand** - Gestion d'état légère et performante avec persistance
- **LocalStorage** - Persistance des données localement via Zustand persist middleware

## 📦 Installation

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev

# Build pour la production
npm run build

# Prévisualiser le build de production
npm run preview
```

## 🏗️ Structure du projet

```
src/
├── components/              # Composants React réutilisables
│   ├── Header/             # En-tête avec navigation
│   ├── Footer/             # Pied de page
│   ├── LoopOfTheDay/       # Composant principal d'une loop/jour
│   ├── ProgramCard/        # Carte de formation avec progression
│   └── Icons/              # Bibliothèque d'icônes SVG
├── pages/                  # Pages principales
│   ├── Home/               # Page d'accueil (landing)
│   ├── Programs/           # Dashboard principal avec liste des formations
│   ├── Dashboard/          # Dashboard d'une formation spécifique
│   └── LoopDay/            # Page détaillée d'un jour spécifique
├── routes/                  # Configuration du routing
│   └── index.tsx           # Définition des routes React Router
├── store/                  # Gestion d'état
│   ├── useSkillLoopStore.ts  # Store Zustand pour la progression multi-formations
│   └── useProgramsStore.ts   # Store pour les métadonnées des formations
├── types/                  # Types TypeScript
│   ├── skillloop.readonly.ts  # Types du programme de formation
│   └── progress.ts         # Types de progression utilisateur
├── data/                   # Données de formation
│   ├── programs/           # Registre des formations
│   │   └── index.ts        # Métadonnées et chargeurs des formations
│   ├── skillloop-ai-foundations.json
│   ├── skilloop-prompt-engineering.json
│   ├── skillloop-ai-automation-pro.json
│   ├── skillloop-creative-prompting.json
│   └── skillloop-ia-productivity.json
├── hooks/                 # Hooks personnalisés
├── App.tsx                # Composant principal avec layout
└── main.tsx               # Point d'entrée avec RouterProvider
```

## 🎨 Design

Interface moderne et élégante avec :

- **Thèmes de couleurs dynamiques** : Chaque formation a sa propre couleur :
  - Fondations IA & Intégration : Violet-bleu (#667eea)
  - Prompt Engineering : Violet (#8b7fb8)
  - Automatisation IA Pro : Bleu (#6b9bd2)
  - Creative Prompting : Vert (#6bc7a6)
  - IA & Productivité : Orange (#f59e0b)
  - Data Storytelling : Rose (#ec4899)
- **Dégradés colorés** adaptés au thème de chaque formation
- **Design responsive** pour mobile et desktop
- **Animations fluides** pour une meilleure UX
- **Cartes vitrées** avec effets de profondeur
- **Système de badges** visuellement attractif
- **Indicateurs visuels** pour la progression (complété, en cours, non commencé)
- **Header avec dégradé** pour la page Programs avec effet de profondeur
- **Cartes statistiques** avec icônes colorées et effets hover
- **Sections organisées** avec headers cohérents et états vides stylisés
- **Grille de cartes** avec alignement uniforme et hauteur égale

## 📈 Fonctionnalités techniques

### Gestion d'état

- **Zustand** pour une gestion d'état simple et performante
- **Persistance automatique** dans LocalStorage
- **Actions atomiques** pour mettre à jour la progression
- **Calculs automatiques** de XP, niveaux et badges

### Structure des données

- **Programmes de formation** : JSON structurés avec paths → modules → loops → exercises
- **Registre des formations** : Système centralisé pour gérer plusieurs formations avec métadonnées (titre, description, couleur, etc.)
- **Progression utilisateur** : Stockée localement avec état de chaque exercice et loop, organisée par formation
- **Débrief** : Notes, insights et questions pour chaque loop

### Navigation

- **React Router** pour une navigation déclarative avec gestion d'URL
- **Routes disponibles** :
  - `/` : Page d'accueil
  - `/programs` : Liste des formations (dashboard principal)
  - `/programs/:programId` : Dashboard d'une formation spécifique
  - `/programs/:programId/day/:dayNumber` : Page d'un jour spécifique
- **Deep linking** : URLs partageables vers une formation ou un jour spécifique
- **Navigation fluide** entre les différentes vues avec historique du navigateur

## 📈 Roadmap

### Version 1 (Actuelle) ✅

- ✅ Page d'accueil avec présentation des formations
- ✅ Dashboard principal avec liste des formations
- ✅ Dashboard spécifique par formation avec thème de couleur
- ✅ Gestion de multiples formations (6 formations disponibles)
- ✅ Page LoopDay pour un jour spécifique
- ✅ Système XP et niveaux par formation
- ✅ Badges de progression
- ✅ Section débrief (notes, insights, questions)
- ✅ Ressources par exercice
- ✅ Possibilité de décocher les exercices
- ✅ Persistance locale (LocalStorage via Zustand)
- ✅ React Router pour la navigation
- ✅ Design moderne et responsive avec thèmes dynamiques
- ✅ Page Programs améliorée avec statistiques visuelles
- ✅ Organisation par sections (en cours, nouvelles, finies)
- ✅ Cartes de formation avec alignement uniforme
- ✅ États vides stylisés pour chaque section
- ✅ Icônes optimisées et modernes

### Version 2 (À venir)

- [ ] Export des données (JSON, PDF)
- [ ] Intégration avec un backend
- [ ] Statistiques avancées et graphiques
- [ ] Mode sombre
- [ ] Recherche dans les ressources
- [ ] Filtres et tri dans la liste des formations

### Version 3 (Futur)

- [ ] Intégration avec assistant IA personnel
- [ ] Recommandations automatiques basées sur la progression
- [ ] Partage de progression et badges
- [ ] Communauté et classements
- [ ] Notifications de rappel

## 💡 Philosophie

> **"Parce que la maîtrise est une boucle, pas un événement."**

SkillLoop transforme la formation en un système d'entraînement, où la pratique régulière devient le moteur de la maîtrise. Chaque jour (loop) est conçu pour être complété en quelques heures, avec des objectifs clairs et des exercices actionnables.

## 🎓 Formations disponibles

SkillLoop propose actuellement **6 formations** couvrant différents aspects de l'IA :

1. **Fondations IA & Intégration** (#667eea)
   - Construire un assistant IA fonctionnel avec streaming, backend propre et UX crédible
   - ~5h par loop

2. **Prompt Engineering & Maîtrise IA** (#8b7fb8)
   - Apprendre à écrire des prompts clairs, puissants et réutilisables pour exploiter pleinement les IA
   - ~2h par loop

3. **Automatisation avec l'IA pour les pros** (#6b9bd2)
   - Automatiser des tâches métiers concrètes avec l'IA, des prompts jusqu'aux workflows complets
   - ~2h par loop

4. **Prompting pour Creative Professionals** (#6bc7a6)
   - Créer du contenu créatif cohérent, différenciant et réutilisable avec l'IA
   - ~2h par loop

5. **IA & Productivité** (#f59e0b)
   - Optimiser votre productivité avec l'IA au quotidien
   - ~2h par loop

6. **Data Storytelling assisté par IA** (#ec4899)
   - Transformer des données brutes en récits clairs, visuels et décisionnels grâce à l'IA
   - ~2h par loop

## 📝 License

MIT

---

**SkillLoop** — Transformer la pratique en compétences
