import { useState } from "react";
import { Header } from "./components/Header/Header";
import { Footer } from "./components/Footer/Footer";
import { Home } from "./pages/Home/Home";
import { SkillLoopDashboard } from "./pages/Dashboard/SkillLoopDashboard";
import "./App.css";

type View = "home" | "dashboard";

function App() {
  const [currentView, setCurrentView] = useState<View>("home");

  const handleNavigate = (view: View) => {
    setCurrentView(view);
  };

  return (
    <div className="app">
      <Header currentView={currentView} onNavigate={handleNavigate} />

      <main className="app-main">
        {currentView === "home" && <Home onNavigate={handleNavigate} />}
        {currentView === "dashboard" && <SkillLoopDashboard />}
      </main>

      <Footer />
    </div>
  );
}

export default App;
