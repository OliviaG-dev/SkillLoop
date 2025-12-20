import { useState } from 'react';
import { Header } from './components/Header/Header';
import { Footer } from './components/Footer/Footer';
import { TrainingDayView } from './components/TrainingDayView/TrainingDayView';
import { ProgressView } from './components/ProgressView/ProgressView';
import { Home } from './pages/Home/Home';
import { Dashboard } from './pages/Dashboard/Dashboard';
import { useTrainingData } from './hooks/useTrainingData';
import type { TrainingDay } from './types';
import './App.css';

type View = 'home' | 'dashboard' | 'day' | 'progress';

function App() {
  const { currentDay, updateDay, progress, trainingDays, setCurrentDayIndex } = useTrainingData();
  const [currentView, setCurrentView] = useState<View>('home');
  const [selectedDay, setSelectedDay] = useState<TrainingDay | null>(currentDay || null);

  const handleNavigate = (view: 'day' | 'progress' | 'dashboard') => {
    setCurrentView(view);
  };

  const handleSelectDay = (day: TrainingDay) => {
    const dayIndex = trainingDays.findIndex((d) => d.id === day.id);
    if (dayIndex !== -1) {
      setCurrentDayIndex(dayIndex);
      setSelectedDay(day);
    }
  };

  const dayToDisplay = selectedDay || currentDay;

  return (
    <div className="app">
      <Header currentView={currentView} onNavigate={setCurrentView} />

      <main className="app-main">
        {currentView === 'home' && <Home onNavigate={handleNavigate} />}
        {currentView === 'dashboard' && (
          <Dashboard
            onNavigate={handleNavigate}
            onSelectDay={handleSelectDay}
          />
        )}
        {currentView === 'day' && dayToDisplay && (
          <TrainingDayView trainingDay={dayToDisplay} onUpdate={updateDay} />
        )}
        {currentView === 'progress' && <ProgressView stats={progress} />}
      </main>

      <Footer />
    </div>
  );
}

export default App;
