import { useState } from "react";
import { Header } from "./components/Header/Header";
import { Footer } from "./components/Footer/Footer";
import { Home } from "./pages/Home/Home";
import { SkillLoopDashboard } from "./pages/Dashboard/SkillLoopDashboard";
import { LoopDay } from "./pages/LoopDay/LoopDay";
import "./App.css";

type View = "home" | "dashboard" | "loopday";

function App() {
  const [currentView, setCurrentView] = useState<View>("home");
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  const handleNavigate = (view: "home" | "dashboard", dayNumber?: number) => {
    setCurrentView(view);
    if (dayNumber !== undefined) {
      setSelectedDay(dayNumber);
    }
  };

  const handleNavigateToDay = (dayNumber: number) => {
    setSelectedDay(dayNumber);
    setCurrentView("loopday");
  };

  return (
    <div className="app">
      <Header currentView={currentView} onNavigate={handleNavigate} />

      <main className="app-main">
        {currentView === "home" && <Home onNavigate={handleNavigate} />}
        {currentView === "dashboard" && (
          <SkillLoopDashboard onNavigateToDay={handleNavigateToDay} />
        )}
        {currentView === "loopday" && selectedDay !== null && (
          <LoopDay dayNumber={selectedDay} onNavigate={handleNavigate} />
        )}
      </main>

      <Footer />
    </div>
  );
}

export default App;
