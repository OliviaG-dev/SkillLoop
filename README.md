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
- **Call-to-action** vers le dashboard

### 📊 Dashboard

- **Vue d'ensemble de tous les jours** avec grille de progression
- **Statistiques globales** :
  - Niveau actuel et XP total
  - Pourcentage de progression
  - Streak (jours consécutifs complétés)
  - Badges obtenus
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
│   └── Icons/              # Bibliothèque d'icônes SVG
├── pages/                  # Pages principales
│   ├── Home/               # Page d'accueil (landing)
│   ├── Dashboard/          # Vue d'ensemble avec grille des jours
│   └── LoopDay/            # Page détaillée d'un jour spécifique
├── store/                  # Gestion d'état
│   └── useSkillLoopStore.ts  # Store Zustand avec persistance
├── types/                  # Types TypeScript
│   ├── skillloop.readonly.ts  # Types du programme de formation
│   └── progress.ts         # Types de progression utilisateur
├── data/                   # Données de formation
│   └── skillloop-ai-foundations.json  # Programme de formation
├── hooks/                 # Hooks personnalisés
├── App.tsx                # Composant principal avec routing
└── main.tsx               # Point d'entrée
```

## 🎨 Design

Interface moderne et élégante avec :

- **Palette de couleurs** basée sur le logo :
  - Violet (#8b7fb8)
  - Bleu (#6b9bd2)
  - Vert (#6bc7a6)
- **Dégradés colorés** pour une identité visuelle forte
- **Design responsive** pour mobile et desktop
- **Animations fluides** pour une meilleure UX
- **Cartes vitrées** avec effets de profondeur
- **Système de badges** visuellement attractif

## 📈 Fonctionnalités techniques

### Gestion d'état

- **Zustand** pour une gestion d'état simple et performante
- **Persistance automatique** dans LocalStorage
- **Actions atomiques** pour mettre à jour la progression
- **Calculs automatiques** de XP, niveaux et badges

### Structure des données

- **Programme de formation** : JSON structuré avec paths → modules → loops → exercises
- **Progression utilisateur** : Stockée localement avec état de chaque exercice et loop
- **Débrief** : Notes, insights et questions pour chaque loop

### Navigation

- **Routing simple** avec état React (home, dashboard, loopday)
- **Navigation fluide** entre les différentes vues
- **Deep linking** vers un jour spécifique

## 📈 Roadmap

### Version 1 (Actuelle) ✅

- ✅ Page d'accueil avec présentation des formations
- ✅ Dashboard avec vue d'ensemble de tous les jours
- ✅ Page LoopDay pour un jour spécifique
- ✅ Système XP et niveaux
- ✅ Badges de progression
- ✅ Section débrief (notes, insights, questions)
- ✅ Ressources par exercice
- ✅ Possibilité de décocher les exercices
- ✅ Persistance locale (LocalStorage via Zustand)
- ✅ Design moderne et responsive

### Version 2 (À venir)

- [ ] Gestion de multiples formations
- [ ] Export des données (JSON, PDF)
- [ ] Intégration avec un backend
- [ ] Statistiques avancées et graphiques
- [ ] Mode sombre
- [ ] Recherche dans les ressources

### Version 3 (Futur)

- [ ] Intégration avec assistant IA personnel
- [ ] Recommandations automatiques basées sur la progression
- [ ] Partage de progression et badges
- [ ] Communauté et classements
- [ ] Notifications de rappel

## 💡 Philosophie

> **"Parce que la maîtrise est une boucle, pas un événement."**

SkillLoop transforme la formation en un système d'entraînement, où la pratique régulière devient le moteur de la maîtrise. Chaque jour (loop) est conçu pour être complété en quelques heures, avec des objectifs clairs et des exercices actionnables.

## 🎓 Formation actuelle

**Fondations IA & Intégration**

Un parcours complet pour construire un assistant IA fonctionnel avec streaming, backend propre et UX crédible. Le programme est structuré en plusieurs modules couvrant les fondations de l'IA, l'intégration pratique et la mise en production.

## 📝 License

MIT

---

**SkillLoop** — Transformer la pratique en compétences
