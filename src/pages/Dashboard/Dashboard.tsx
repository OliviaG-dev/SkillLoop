import { useTrainingData } from '../../hooks/useTrainingData';
import type { TrainingDay } from '../../types';
import { ChartIcon, FlameIcon, CheckIcon, TrophyIcon, CalendarIcon, TrendUpIcon, RefreshIcon, ClockIcon, ClipboardIcon } from '../../components/Icons';
import './Dashboard.css';

type DashboardProps = {
  onNavigate: (view: 'day' | 'progress') => void;
  onSelectDay: (day: TrainingDay) => void;
};

export function Dashboard({ onNavigate, onSelectDay }: DashboardProps) {
  const { trainingDays, progress } = useTrainingData();

  const nextDay = trainingDays.find((day) => !day.completed);
  const completedDays = trainingDays.filter((day) => day.completed);
  const recentDays = trainingDays.slice(-5).reverse();

  const getDayStatus = (day: TrainingDay) => {
    if (day.completed) return 'completed';
    const completedTasks = day.tasks.filter((task) => task.done).length;
    if (completedTasks > 0) return 'in-progress';
    return 'not-started';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckIcon size={20} />;
      case 'in-progress':
        return <RefreshIcon size={20} />;
      default:
        return <ClockIcon size={20} />;
    }
  };

  const getProgressForDay = (day: TrainingDay) => {
    const completed = day.tasks.filter((task) => task.done).length;
    return day.tasks.length > 0 ? (completed / day.tasks.length) * 100 : 0;
  };

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Tableau de bord</h1>
        <p className="dashboard-subtitle">Vue d'ensemble de ta formation</p>
      </div>

      <div className="dashboard-stats-grid">
        <div className="dashboard-stat-card stat-primary">
          <div className="stat-icon">
            <ChartIcon size={48} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{progress.completionPercentage.toFixed(0)}%</div>
            <div className="stat-label">Progression globale</div>
            <div className="stat-description">
              {progress.completedDays} / {progress.totalDays} jours complétés
            </div>
          </div>
        </div>

        <div className="dashboard-stat-card stat-streak">
          <div className="stat-icon">
            <FlameIcon size={48} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{progress.currentStreak}</div>
            <div className="stat-label">Série actuelle</div>
            <div className="stat-description">jours consécutifs</div>
          </div>
        </div>

        <div className="dashboard-stat-card stat-record">
          <div className="stat-icon">
            <TrophyIcon size={48} />
          </div>
          <div className="stat-content">
            <div className="stat-value">{progress.longestStreak}</div>
            <div className="stat-label">Meilleure série</div>
            <div className="stat-description">jours consécutifs</div>
          </div>
        </div>

        <div className="dashboard-stat-card stat-tasks">
          <div className="stat-icon">
            <CheckIcon size={48} />
          </div>
          <div className="stat-content">
            <div className="stat-value">
              {trainingDays.reduce(
                (acc, day) =>
                  acc + day.tasks.filter((task) => task.done).length,
                0
              )}
            </div>
            <div className="stat-label">Tâches complétées</div>
            <div className="stat-description">
              sur{' '}
              {trainingDays.reduce((acc, day) => acc + day.tasks.length, 0)}{' '}
              total
            </div>
          </div>
        </div>
      </div>

      {nextDay && (
        <div className="dashboard-quick-action">
          <div className="quick-action-content">
            <h2 className="quick-action-title">
              <CalendarIcon size={24} />
              Prochain jour
            </h2>
            <p className="quick-action-subtitle">
              Jour {nextDay.day} : {nextDay.title}
            </p>
          </div>
          <button
            className="quick-action-button"
            onClick={() => {
              onSelectDay(nextDay);
              onNavigate('day');
            }}
          >
            Commencer →
          </button>
        </div>
      )}

      <div className="dashboard-sections">
        <div className="dashboard-section">
          <div className="section-header">
            <h2 className="section-title">
              <ClipboardIcon size={24} />
              Derniers jours
            </h2>
            <button
              className="section-link"
              onClick={() => onNavigate('progress')}
            >
              Voir tout →
            </button>
          </div>

          <div className="days-list">
            {recentDays.length > 0 ? (
              recentDays.map((day) => {
                const status = getDayStatus(day);
                const dayProgress = getProgressForDay(day);
                return (
                  <div
                    key={day.id}
                    className={`day-card day-${status}`}
                    onClick={() => {
                      onSelectDay(day);
                      onNavigate('day');
                    }}
                  >
                    <div className="day-card-header">
                      <span className="day-card-icon">
                        {getStatusIcon(status)}
                      </span>
                      <div className="day-card-info">
                        <div className="day-card-number">Jour {day.day}</div>
                        <div className="day-card-title">{day.title}</div>
                      </div>
                    </div>
                    <div className="day-card-progress">
                      <div className="day-card-progress-bar">
                        <div
                          className="day-card-progress-fill"
                          style={{ width: `${dayProgress}%` }}
                        ></div>
                      </div>
                      <span className="day-card-progress-text">
                        {Math.round(dayProgress)}%
                      </span>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="empty-state">Aucun jour disponible</div>
            )}
          </div>
        </div>

        <div className="dashboard-section">
          <div className="section-header">
            <h2 className="section-title">
              <TrendUpIcon size={24} />
              Vue d'ensemble
            </h2>
          </div>

          <div className="overview-card">
            <div className="overview-item">
              <span className="overview-label">Jours totaux :</span>
              <span className="overview-value">{progress.totalDays}</span>
            </div>
            <div className="overview-item">
              <span className="overview-label">Jours complétés :</span>
              <span className="overview-value success">
                {progress.completedDays}
              </span>
            </div>
            <div className="overview-item">
              <span className="overview-label">Jours restants :</span>
              <span className="overview-value">
                {progress.totalDays - progress.completedDays}
              </span>
            </div>
            <div className="overview-item">
              <span className="overview-label">Taux de complétion :</span>
              <span className="overview-value highlight">
                {progress.completionPercentage.toFixed(1)}%
              </span>
            </div>
          </div>

          {progress.currentStreak > 0 && (
            <div className="streak-banner">
              <span className="streak-icon">
                <FlameIcon size={32} />
              </span>
              <div className="streak-content">
                <div className="streak-title">
                  Excellente série en cours !
                </div>
                <div className="streak-description">
                  {progress.currentStreak} jour{progress.currentStreak > 1 ? 's' : ''}{' '}
                  consécutif{progress.currentStreak > 1 ? 's' : ''} de formation
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

