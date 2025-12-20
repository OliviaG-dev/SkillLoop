import { useState, useEffect } from 'react';
import type { TrainingDay, ProgressStats } from '../types';

const STORAGE_KEY = 'skillloop-training-data';

export function useTrainingData() {
  const [trainingDays, setTrainingDays] = useState<TrainingDay[]>([]);
  const [currentDayIndex, setCurrentDayIndex] = useState(0);

  // Initialiser avec des données de démo si aucune donnée n'existe
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setTrainingDays(parsed.days || []);
        setCurrentDayIndex(parsed.currentDayIndex || 0);
      } catch (error) {
        console.error('Erreur lors du chargement des données:', error);
        initializeDemoData();
      }
    } else {
      initializeDemoData();
    }
  }, []);

  const initializeDemoData = () => {
    const demoDays: TrainingDay[] = [
      {
        id: 'day-1',
        day: 1,
        title: 'Introduction et premiers pas',
        date: new Date().toISOString(),
        tasks: [
          { id: 'task-1-1', label: 'Configurer l\'environnement de développement', done: false },
          { id: 'task-1-2', label: 'Comprendre les bases du prompt engineering', done: false },
          { id: 'task-1-3', label: 'Créer un premier assistant simple', done: false },
        ],
        notes: '',
        insights: '',
        questions: '',
        completed: false,
      },
    ];
    setTrainingDays(demoDays);
    saveToStorage(demoDays, 0);
  };

  const saveToStorage = (days: TrainingDay[], index: number) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ days, currentDayIndex: index }));
  };

  const updateDay = (updatedDay: TrainingDay) => {
    const updatedDays = trainingDays.map((day) =>
      day.id === updatedDay.id ? updatedDay : day
    );
    setTrainingDays(updatedDays);
    saveToStorage(updatedDays, currentDayIndex);
  };

  const addDay = (day: TrainingDay) => {
    const updatedDays = [...trainingDays, day];
    setTrainingDays(updatedDays);
    saveToStorage(updatedDays, currentDayIndex);
  };

  const calculateProgress = (): ProgressStats => {
    if (trainingDays.length === 0) {
      return {
        totalDays: 0,
        completedDays: 0,
        currentStreak: 0,
        longestStreak: 0,
        completionPercentage: 0,
      };
    }

    const completedDays = trainingDays.filter((day) => day.completed).length;
    const completionPercentage = (completedDays / trainingDays.length) * 100;

    // Calculer la série actuelle (jours consécutifs complétés depuis le début)
    let currentStreak = 0;
    for (let i = 0; i < trainingDays.length; i++) {
      if (trainingDays[i].completed) {
        currentStreak++;
      } else {
        break;
      }
    }

    // Calculer la meilleure série
    let longestStreak = 0;
    let tempStreak = 0;
    for (const day of trainingDays) {
      if (day.completed) {
        tempStreak++;
        longestStreak = Math.max(longestStreak, tempStreak);
      } else {
        tempStreak = 0;
      }
    }

    return {
      totalDays: trainingDays.length,
      completedDays,
      currentStreak,
      longestStreak,
      completionPercentage,
    };
  };

  return {
    trainingDays,
    currentDay: trainingDays[currentDayIndex],
    currentDayIndex,
    setCurrentDayIndex,
    updateDay,
    addDay,
    progress: calculateProgress(),
  };
}

