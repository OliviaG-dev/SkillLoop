import type { ProgressStats } from '../../types';
import { ChartIcon, FlameIcon, TrophyIcon } from '../Icons';
import './ProgressView.css';

type ProgressViewProps = {
  stats: ProgressStats;
};

export function ProgressView({ stats }: ProgressViewProps) {
  return (
    <div className="progress-view">
      <div className="progress-header">
        <h2 className="progress-title">
          <ChartIcon size={28} />
          Suivi de progression
        </h2>
      </div>

      <div className="stats-grid">
        <div className="stat-card stat-primary">
          <div className="stat-value">{stats.completionPercentage.toFixed(0)}%</div>
          <div className="stat-label">Progression</div>
          <div className="stat-description">
            {stats.completedDays} / {stats.totalDays} jours
          </div>
        </div>

        <div className="stat-card stat-streak">
          <div className="stat-value">
            <FlameIcon size={32} />
            {stats.currentStreak}
          </div>
          <div className="stat-label">Série actuelle</div>
          <div className="stat-description">jours consécutifs</div>
        </div>

        <div className="stat-card stat-record">
          <div className="stat-value">
            <TrophyIcon size={32} />
            {stats.longestStreak}
          </div>
          <div className="stat-label">Meilleure série</div>
          <div className="stat-description">jours consécutifs</div>
        </div>
      </div>

      <div className="progress-visualization">
        <div className="progress-circle">
          <svg className="progress-ring" viewBox="0 0 200 200">
            <circle
              className="progress-ring-circle-bg"
              stroke="#e5e7eb"
              strokeWidth="12"
              fill="transparent"
              r="80"
              cx="100"
              cy="100"
            />
            <circle
              className="progress-ring-circle"
              stroke="url(#gradient)"
              strokeWidth="12"
              fill="transparent"
              r="80"
              cx="100"
              cy="100"
              strokeDasharray={`${2 * Math.PI * 80}`}
              strokeDashoffset={`${2 * Math.PI * 80 * (1 - stats.completionPercentage / 100)}`}
              strokeLinecap="round"
              transform="rotate(-90 100 100)"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#3b82f6" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
          </svg>
          <div className="progress-circle-text">
            <div className="progress-circle-value">{stats.completionPercentage.toFixed(0)}%</div>
            <div className="progress-circle-label">complété</div>
          </div>
        </div>
      </div>

      {stats.currentStreak > 0 && (
        <div className="streak-message">
          <FlameIcon size={24} />
          Excellente série ! Continue comme ça !
        </div>
      )}
    </div>
  );
}

