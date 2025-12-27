import { useState } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import logo from "../../assets/logo.png";
import "./Header.css";

type HeaderProps = {
  currentView: "home" | "programs" | "dashboard" | "loopday";
};

export function Header({ currentView }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { programId } = useParams<{ programId?: string }>();

  const handleNavigateToHome = () => {
    navigate("/");
    setIsMenuOpen(false);
  };

  const handleNavigateToDashboard = () => {
    // Toujours naviguer vers la page des formations
    navigate("/programs");
    setIsMenuOpen(false);
  };

  const handleNavigateToProgramDashboard = () => {
    if (programId) {
      navigate(`/programs/${programId}`);
    } else {
      navigate("/programs");
    }
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
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
        <button 
          className="menu-toggle"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <span className={`hamburger ${isMenuOpen ? "open" : ""}`}>
            <span></span>
            <span></span>
            <span></span>
          </span>
        </button>
        <nav className={`app-nav ${isMenuOpen ? "open" : ""}`}>
          <button
            className={`nav-button ${currentView === "home" ? "active" : ""}`}
            onClick={handleNavigateToHome}
          >
            Home
          </button>
          {currentView === "loopday" ? (
            <button
              className="nav-button active"
              onClick={handleNavigateToProgramDashboard}
            >
              Retour à la formation
            </button>
          ) : (
            <button
              className={`nav-button ${currentView === "programs" || currentView === "dashboard" ? "active" : ""}`}
              onClick={handleNavigateToDashboard}
            >
              Mes Formations
            </button>
          )}
        </nav>
      </div>
    </header>
  );
}
