import { useTrainingData } from "../../hooks/useTrainingData";
import {
  ChartIcon,
  FlameIcon,
  CheckIcon,
  CalendarIcon,
  TargetIcon,
  LightbulbIcon,
  NoteIcon,
} from "../../components/Icons";
import "./Home.css";

type HomeProps = {
  onNavigate: (view: "day" | "progress" | "dashboard") => void;
};

export function Home({ onNavigate }: HomeProps) {
  const { progress, trainingDays } = useTrainingData();

  const nextDay = trainingDays.find((day) => !day.completed);

  return (
    <div className="home">
      <div className="home-hero">
        <h1 className="home-title">Bienvenue sur SkillLoop</h1>
        <p className="home-subtitle">
          Transforme la pratique quotidienne en progression mesurable
        </p>
      </div>

      <div className="home-stats">
        <div className="home-stat-card">
          <div className="home-stat-icon">
            <ChartIcon size={44} />
          </div>
          <div className="home-stat-content">
            <div className="home-stat-value">
              {progress.completionPercentage.toFixed(0)}%
            </div>
            <div className="home-stat-label">de progression</div>
          </div>
        </div>

        <div className="home-stat-card">
          <div className="home-stat-icon">
            <FlameIcon size={44} />
          </div>
          <div className="home-stat-content">
            <div className="home-stat-value">{progress.currentStreak}</div>
            <div className="home-stat-label">jours consécutifs</div>
          </div>
        </div>

        <div className="home-stat-card">
          <div className="home-stat-icon">
            <CheckIcon size={44} />
          </div>
          <div className="home-stat-content">
            <div className="home-stat-value">{progress.completedDays}</div>
            <div className="home-stat-label">jours complétés</div>
          </div>
        </div>
      </div>

      <div className="home-actions">
        {nextDay && (
          <button
            className="home-action-button home-action-primary"
            onClick={() => onNavigate("day")}
          >
            <span className="home-action-icon">
              <CalendarIcon size={40} />
            </span>
            <div className="home-action-content">
              <div className="home-action-title">
                Commencer le Jour {nextDay.day}
              </div>
              <div className="home-action-subtitle">{nextDay.title}</div>
            </div>
            <span className="home-action-arrow">→</span>
          </button>
        )}

        <button
          className="home-action-button home-action-secondary"
          onClick={() => onNavigate("dashboard")}
        >
          <span className="home-action-icon">
            <ChartIcon size={40} />
          </span>
          <div className="home-action-content">
            <div className="home-action-title">Voir le tableau de bord</div>
            <div className="home-action-subtitle">
              Vue d'ensemble complète et statistiques
            </div>
          </div>
          <span className="home-action-arrow">→</span>
        </button>
      </div>

      <div className="home-info">
        <div className="home-info-card">
          <h3 className="home-info-title">
            <TargetIcon size={24} />
            Comment ça marche ?
          </h3>
          <ul className="home-info-list">
            <li>
              <CheckIcon size={16} /> Complète les tâches quotidiennes de ta
              formation
            </li>
            <li>
              <NoteIcon size={16} /> Note tes apprentissages et réflexions
            </li>
            <li>
              <FlameIcon size={16} /> Maintiens une série pour rester motivé
            </li>
            <li>
              <ChartIcon size={16} /> Suis ta progression en temps réel
            </li>
          </ul>
        </div>

        <div className="home-info-card">
          <h3 className="home-info-title">
            <LightbulbIcon size={24} />
            Conseils
          </h3>
          <ul className="home-info-list">
            <li>Consacre 30-45 min par jour à ta formation</li>
            <li>Note ce que tu comprends pour mieux mémoriser</li>
            <li>Identifie les points flous pour y revenir</li>
            <li>Reste régulier, même pour de courtes sessions</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
