# SkillLoop

**Apprendre, pratiquer, progresser**

SkillLoop est une application de formation conçue pour transformer l'apprentissage en un cycle continu de pratique et d'amélioration.

Chaque formation est structurée en parcours clairs, découpés en sessions quotidiennes, avec des objectifs précis, des temps de pratique, et un suivi de progression mesurable.

## 🎯 Concept

SkillLoop repose sur une idée simple : **les compétences se construisent par la répétition intentionnelle**.

L'objectif n'est pas de consommer du contenu, mais de pratiquer régulièrement, d'analyser ce qui est compris, d'identifier les blocages et de progresser durablement.

## ✨ Features

### 📅 Vue "Jour"

Pour chaque jour de formation :

- ✅ **Checklist des tâches prévues** avec suivi de progression
- 📝 **Notes personnelles** pour capturer tes réflexions
- 🔥 **"Ce que j'ai compris aujourd'hui"** pour consolider tes apprentissages
- ❓ **"Ce qui reste flou"** pour identifier les points à revoir

### 📊 Vue Progression

- **% de complétion** globale de ta formation
- **Streak actuel** - nombre de jours consécutifs complétés
- **Meilleure série** - ton record personnel
- Visualisation graphique de ta progression

## 🚀 Technologies

- **React 19** - Interface utilisateur moderne
- **TypeScript** - Typage fort pour une meilleure maintenabilité
- **Vite** - Build tool ultra-rapide
- **LocalStorage** - Persistance des données localement

## 📦 Installation

```bash
# Installer les dépendances
npm install

# Lancer le serveur de développement
npm run dev

# Build pour la production
npm run build
```

## 🏗️ Structure du projet

```
src/
├── components/          # Composants React
│   ├── TrainingDayView.tsx    # Vue journal du jour
│   ├── ProgressView.tsx       # Vue progression
│   └── *.css                  # Styles des composants
├── hooks/
│   └── useTrainingData.ts     # Hook de gestion des données
├── types/
│   └── index.ts               # Types TypeScript
├── App.tsx                    # Composant principal
└── main.tsx                   # Point d'entrée
```

## 🎨 Design

Interface moderne avec :

- Dégradés colorés pour une identité visuelle forte
- Responsive design pour mobile et desktop
- Animations fluides pour une meilleure UX
- Accessibilité prise en compte

## 📈 Roadmap

### Version 1 (Actuelle)

- ✅ Vue journal quotidien
- ✅ Vue progression
- ✅ Persistance locale (LocalStorage)

### Version 2 (À venir)

- [ ] Gestion de multiples formations
- [ ] Export des données
- [ ] Intégration avec un backend
- [ ] Statistiques avancées

### Version 3 (Futur)

- [ ] Intégration avec assistant IA personnel
- [ ] Recommandations automatiques
- [ ] Partage de progression

## 💡 Philosophie

> **"Parce que la maîtrise est une boucle, pas un événement."**

SkillLoop transforme la formation en un système d'entraînement, où la pratique régulière devient le moteur de la maîtrise.

## 📝 License

MIT

---

**SkillLoop** — Transformer la pratique en compétences
