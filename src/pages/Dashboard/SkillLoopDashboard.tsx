import { useState, useMemo } from "react";
import { useSkillLoopStore } from "../../store/useSkillLoopStore";
import { LoopOfTheDay } from "../../components/LoopLoopOfTheDay/LoopOfTheDay";
import {
  ChartIcon,
  TrophyIcon,
  TargetIcon,
  FlameIcon,
} from "../../components/Icons";
import "./SkillLoopDashboard.css";

export const SkillLoopDashboard: React.FC = () => {
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

  const [currentLoopIndex, setCurrentLoopIndex] = useState(0);

  // S'assurer que l'index est valide
  const validIndex =
    loops.length > 0
      ? Math.min(currentLoopIndex, Math.max(0, loops.length - 1))
      : 0;
  const loop = loops[validIndex];

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

  const prevLoop = () => {
    setCurrentLoopIndex((i) => Math.max(0, i - 1));
  };

  const nextLoop = () => {
    setCurrentLoopIndex((i) => Math.min(loops.length - 1, i + 1));
  };

  // Récupérer toutes les ressources uniques
  const allResources = useMemo(() => {
    if (!loop) return [];
    const resourcesMap = new Map<
      string,
      { label: string; url: string; type: string }
    >();
    loop.exercises.forEach((ex) => {
      ex.resources.forEach((res) => {
        const key = `${res.url}-${res.type}`;
        if (!resourcesMap.has(key)) {
          resourcesMap.set(key, {
            label: res.label,
            url: res.url,
            type: res.type,
          });
        }
      });
    });
    return Array.from(resourcesMap.values());
  }, [loop]);

  if (!loop) {
    return (
      <div className="skillloop-dashboard">
        <p>Aucune loop disponible</p>
      </div>
    );
  }

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

      {/* NAVIGATION LOOPS */}
      <nav className="dashboard-nav">
        <button
          className="nav-button nav-button-prev"
          onClick={prevLoop}
          disabled={validIndex === 0}
          aria-label="Jour précédent"
        >
          <span className="nav-button-icon">←</span>
          <span className="nav-button-text">Précédent</span>
        </button>
        <div className="nav-info">
          <span className="nav-day-label">Jour</span>
          <span className="nav-day-number">{loop.day}</span>
          <span className="nav-day-total">/ {loops.length}</span>
        </div>
        <button
          className="nav-button nav-button-next"
          onClick={nextLoop}
          disabled={validIndex === loops.length - 1}
          aria-label="Jour suivant"
        >
          <span className="nav-button-text">Suivant</span>
          <span className="nav-button-icon">→</span>
        </button>
      </nav>

      {/* LOOP DU JOUR */}
      <LoopOfTheDay loop={loop} />

      {/* RESSOURCES */}
      {allResources.length > 0 && (
        <section className="resources-section">
          <div className="resources-header">
            <h2 className="resources-title">Ressources disponibles</h2>
            <span className="resources-count">
              {allResources.length} ressource
              {allResources.length > 1 ? "s" : ""}
            </span>
          </div>
          <div className="resources-grid">
            {allResources.map((res, idx) => (
              <a
                key={`${res.url}-${idx}`}
                href={res.url}
                target="_blank"
                rel="noreferrer"
                className="resource-card"
              >
                <div className="resource-type-badge">{res.type}</div>
                <div className="resource-label">{res.label}</div>
                <div className="resource-arrow">→</div>
              </a>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
