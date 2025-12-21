import { useMemo } from "react";
import { useSkillLoopStore } from "../../store/useSkillLoopStore";
import {
  ChartIcon,
  TrophyIcon,
  TargetIcon,
  FlameIcon,
  CheckIcon,
  CalendarIcon,
} from "../../components/Icons";
import "./SkillLoopDashboard.css";

type SkillLoopDashboardProps = {
  onNavigateToDay: (dayNumber: number) => void;
};

export const SkillLoopDashboard: React.FC<SkillLoopDashboardProps> = ({
  onNavigateToDay,
}) => {
  const program = useSkillLoopStore((s) => s.program);
  const totalXp = useSkillLoopStore((s) => s.totalXp);

  // Calculer le niveau et les badges de manière stable
  const level = useMemo(() => {
    const xp = totalXp;
    const LEVEL_XP = [0, 100, 250, 450, 700, 1000, 1350, 1750];
    let level = 0;
    for (let i = 0; i < LEVEL_XP.length; i++) {
      if (xp >= LEVEL_XP[i]) level = i;
    }
    return level;
  }, [totalXp]);

  const xpToNext = useMemo(() => {
    const LEVEL_XP = [0, 100, 250, 450, 700, 1000, 1350, 1750];
    const xp = totalXp;
    if (level >= LEVEL_XP.length - 1) return 0;
    return LEVEL_XP[level + 1] - xp;
  }, [totalXp, level]);

  const badges = useMemo(() => {
    const BADGES = [
      { xp: 100, name: "Débutant" },
      { xp: 250, name: "Apprenti" },
      { xp: 450, name: "Compétent" },
      { xp: 700, name: "Expert" },
      { xp: 1000, name: "Maître" },
    ];
    return BADGES.filter((b) => totalXp >= b.xp).map((b) => b.name);
  }, [totalXp]);

  // Calculer loops avec useMemo pour éviter les re-renders infinis
  const loops = useMemo(
    () => program.paths.flatMap((p) => p.modules).flatMap((m) => m.loops),
    [program]
  );

  const loopsProgress = useSkillLoopStore((s) => s.loops);

  // Organiser les loops par jour et calculer la progression
  const daysData = useMemo(() => {
    const daysMap = new Map<
      number,
      {
        day: number;
        loop: (typeof loops)[0];
        progress: (typeof loopsProgress)[string] | undefined;
        progressPercent: number;
        isCompleted: boolean;
        isInProgress: boolean;
      }
    >();

    loops.forEach((loop) => {
      const progress = loopsProgress[loop.id];
      const exercisesCompleted = progress?.completedExercises.length ?? 0;
      const exercisesTotal = loop.exercises.length;
      const progressPercent =
        exercisesTotal > 0
          ? Math.round((exercisesCompleted / exercisesTotal) * 100)
          : 0;
      const isCompleted = progress?.completed ?? false;
      const isInProgress = exercisesCompleted > 0 && !isCompleted;

      daysMap.set(loop.day, {
        day: loop.day,
        loop,
        progress,
        progressPercent,
        isCompleted,
        isInProgress,
      });
    });

    return Array.from(daysMap.values()).sort((a, b) => a.day - b.day);
  }, [loops, loopsProgress]);

  // Progression globale
  const globalProgress = useMemo(() => {
    const totalExercises = loops.reduce(
      (sum, l) => sum + l.exercises.length,
      0
    );
    const completedExercises = loops.reduce((sum, l) => {
      const progress = loopsProgress[l.id];
      return sum + (progress?.completedExercises.length ?? 0);
    }, 0);
    const globalProgressPercent =
      totalExercises > 0
        ? Math.round((completedExercises / totalExercises) * 100)
        : 0;
    return { totalExercises, completedExercises, globalProgressPercent };
  }, [loops, loopsProgress]);

  return (
    <div className="skillloop-dashboard">
      {/* HEADER */}
      <header className="dashboard-header">
        <div className="dashboard-header-content">
          <div className="dashboard-title-section">
            <h1 className="dashboard-title">{program.title}</h1>
            <p className="dashboard-subtitle">{program.description}</p>
          </div>

          {/* Stats Cards */}
          <div className="dashboard-stats-grid">
            <div className="dashboard-stat-card stat-xp">
              <div className="stat-icon-wrapper">
                <FlameIcon size={24} />
              </div>
              <div className="stat-content">
                <div className="stat-value">{totalXp}</div>
                <div className="stat-label">XP Total</div>
              </div>
            </div>

            <div className="dashboard-stat-card stat-level">
              <div className="stat-icon-wrapper">
                <TargetIcon size={24} />
              </div>
              <div className="stat-content">
                <div className="stat-value">Niveau {level}</div>
                <div className="stat-label">
                  {xpToNext > 0 ? `${xpToNext} XP restants` : "Niveau max"}
                </div>
              </div>
            </div>

            <div className="dashboard-stat-card stat-progress">
              <div className="stat-icon-wrapper">
                <ChartIcon size={24} />
              </div>
              <div className="stat-content">
                <div className="stat-value">
                  {globalProgress.globalProgressPercent}%
                </div>
                <div className="stat-label">
                  {globalProgress.completedExercises} /{" "}
                  {globalProgress.totalExercises} exercices
                </div>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="dashboard-progress-section">
            <div className="progress-header">
              <span className="progress-label">Progression globale</span>
              <span className="progress-percentage">
                {globalProgress.globalProgressPercent}%
              </span>
            </div>
            <div className="progress-bar-container">
              <div
                className="progress-bar-fill"
                style={{ width: `${globalProgress.globalProgressPercent}%` }}
              />
            </div>
          </div>

          {/* Badges */}
          {badges.length > 0 && (
            <div className="dashboard-badges-section">
              <div className="badges-header">
                <TrophyIcon size={20} />
                <span className="badges-title">Badges obtenus</span>
              </div>
              <div className="badges-container">
                {badges.map((badge, idx) => (
                  <span key={idx} className="badge">
                    <TrophyIcon size={16} />
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </header>

      {/* GRILLE DES JOURS */}
      <section className="dashboard-days-section">
        <div className="days-section-header">
          <h2 className="days-section-title">
            <CalendarIcon size={24} />
            Tous les jours ({daysData.length})
          </h2>
        </div>
        <div className="days-grid">
          {daysData.map((dayData) => (
            <button
              key={dayData.day}
              className={`day-card ${
                dayData.isCompleted
                  ? "day-completed"
                  : dayData.isInProgress
                    ? "day-in-progress"
                    : "day-not-started"
              }`}
              onClick={() => onNavigateToDay(dayData.day)}
            >
              <div className="day-card-header">
                <div className="day-card-number">
                  <span className="day-number-label">Jour</span>
                  <span className="day-number-value">{dayData.day}</span>
                </div>
                {dayData.isCompleted && (
                  <div className="day-check-icon">
                    <CheckIcon size={20} />
                  </div>
                )}
              </div>
              <div className="day-card-content">
                <h3 className="day-card-title">{dayData.loop.title}</h3>
                <p className="day-card-goal">{dayData.loop.goal}</p>
              </div>
              <div className="day-card-progress">
                <div className="day-progress-bar-container">
                  <div
                    className="day-progress-bar-fill"
                    style={{ width: `${dayData.progressPercent}%` }}
                  />
                </div>
                <span className="day-progress-text">
                  {dayData.progressPercent}%
                </span>
              </div>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};
