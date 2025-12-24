import { useNavigate, useLocation } from "react-router-dom";
import logo from "../../assets/logo.png";
import { ChartIcon } from "../Icons";
import "./Header.css";

type HeaderProps = {
  currentView: "home" | "programs" | "dashboard" | "loopday";
};

export function Header({ currentView }: HeaderProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigateToHome = () => {
    navigate("/");
  };

  const handleNavigateToDashboard = () => {
    // Si on est sur une route de formation, on reste dessus
    // Sinon, on va à la première formation ou à la liste
    if (location.pathname.startsWith("/programs/")) {
      // On reste sur la route actuelle
      return;
    }
    navigate("/programs");
  };

  return (
    <header className="app-header">
      <div className="header-content">
        <div
          className="header-logo-container"
          onClick={handleNavigateToHome}
          style={{ cursor: "pointer" }}
        >
          <img src={logo} alt="SkillLoop Logo" className="header-logo" />
        </div>
        <div className="header-title-container">
          <h1 className="app-title">SkillLoop</h1>
          <p className="app-tagline">Apprendre, pratiquer, progresser</p>
        </div>
        <nav className="app-nav">
          <button
            className={`nav-button ${currentView === "home" ? "active" : ""}`}
            onClick={handleNavigateToHome}
          >
            Home
          </button>
          <button
            className={`nav-button ${currentView === "dashboard" || currentView === "loopday" ? "active" : ""}`}
            onClick={handleNavigateToDashboard}
          >
            <ChartIcon size={18} /> Dashboard
          </button>
        </nav>
      </div>
    </header>
  );
}
