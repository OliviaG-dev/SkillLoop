import { Outlet, useLocation } from "react-router-dom";
import { Header } from "./components/Header/Header";
import { Footer } from "./components/Footer/Footer";
import "./App.css";

function App() {
  const location = useLocation();
  
  // Déterminer la vue actuelle depuis l'URL
  const getCurrentView = () => {
    const path = location.pathname;
    if (path === "/") return "home";
    if (path === "/programs") return "programs";
    if (path.startsWith("/programs/") && path.includes("/day/")) return "loopday";
    if (path.startsWith("/programs/")) return "dashboard";
    return "home";
  };

  const currentView = getCurrentView();

  return (
    <div className="app">
      <Header currentView={currentView} />

      <main className="app-main">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

export default App;
