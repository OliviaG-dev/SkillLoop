import logo from '../../assets/logo.png';
import { ChartIcon, CalendarIcon, TrendUpIcon } from '../Icons';
import './Header.css';

type HeaderProps = {
  currentView: 'home' | 'dashboard' | 'day' | 'progress';
  onNavigate: (view: 'home' | 'dashboard' | 'day' | 'progress') => void;
};

export function Header({ currentView, onNavigate }: HeaderProps) {
  return (
    <header className="app-header">
      <div className="header-content">
        <div className="header-brand" onClick={() => onNavigate('home')} style={{ cursor: 'pointer' }}>
          <img src={logo} alt="SkillLoop Logo" className="header-logo" />
          <div className="header-text">
            <h1 className="app-title">SkillLoop</h1>
            <p className="app-tagline">Apprendre, pratiquer, progresser</p>
          </div>
        </div>
      </div>
      {currentView !== 'home' && (
        <nav className="app-nav">
          <button
            className={`nav-button ${currentView === 'dashboard' ? 'active' : ''}`}
            onClick={() => onNavigate('dashboard')}
          >
            <ChartIcon size={18} /> Dashboard
          </button>
          <button
            className={`nav-button ${currentView === 'day' ? 'active' : ''}`}
            onClick={() => onNavigate('day')}
          >
            <CalendarIcon size={18} /> Journal
          </button>
          <button
            className={`nav-button ${currentView === 'progress' ? 'active' : ''}`}
            onClick={() => onNavigate('progress')}
          >
            <TrendUpIcon size={18} /> Progression
          </button>
        </nav>
      )}
    </header>
  );
}

