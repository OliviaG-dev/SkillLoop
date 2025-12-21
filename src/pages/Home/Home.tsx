import { useMemo } from "react";
import { useSkillLoopStore } from "../../store/useSkillLoopStore";
import {
  ChartIcon,
  FlameIcon,
  CheckIcon,
  CalendarIcon,
  TargetIcon,
  LightbulbIcon,
  NoteIcon,
  TrophyIcon,
} from "../../components/Icons";
import "./Home.css";

type HomeProps = {
  onNavigate: (view: "home" | "dashboard") => void;
};

export function Home({ onNavigate }: HomeProps) {
  const program = useSkillLoopStore((s) => s.program);
  const totalXp = useSkillLoopStore((s) => s.totalXp);
  const loopsProgress = useSkillLoopStore((s) => s.loops);

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
    if (level >= LEVEL_XP.length - 1) return 0;
    return LEVEL_XP[level + 1] - totalXp;
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

  const loops = useMemo(
    () => program.paths.flatMap((p) => p.modules).flatMap((m) => m.loops),
    [program]
  );

  // Calculer les statistiques globales (comme dans Dashboard)
  const stats = useMemo(() => {
    const completedLoops = loops.filter(
      (loop) => loopsProgress[loop.id]?.completed
    ).length;
    const totalLoops = loops.length;
    const completionPercentage =
      totalLoops > 0 ? Math.round((completedLoops / totalLoops) * 100) : 0;

    // Calculer le streak (jours consécutifs complétés depuis le début)
    let currentStreak = 0;
    for (const loop of loops) {
      if (loopsProgress[loop.id]?.completed) {
        currentStreak++;
      } else {
        break;
      }
    }

    // Calculer la progression globale basée sur les exercices
    const totalExercises = loops.reduce(
      (sum, l) => sum + l.exercises.length,
      0
    );
    const completedExercises = loops.reduce((sum, l) => {
      const progress = loopsProgress[l.id];
      return sum + (progress?.completedExercises.length ?? 0);
    }, 0);
    const exercisesProgressPercent =
      totalExercises > 0
        ? Math.round((completedExercises / totalExercises) * 100)
        : 0;

    return {
      completionPercentage,
      currentStreak,
      completedLoops,
      totalLoops,
      totalExercises,
      completedExercises,
      exercisesProgressPercent,
    };
  }, [loops, loopsProgress]);

  // Trouver la prochaine loop non complétée
  const nextLoop = useMemo(() => {
    return loops.find((loop) => !loopsProgress[loop.id]?.completed);
  }, [loops, loopsProgress]);

  // Trouver la loop actuelle (en cours ou prochaine)
  const currentLoop = useMemo(() => {
    // Chercher la première loop non complétée
    return loops.find((loop) => {
      const progress = loopsProgress[loop.id];
      return !progress?.completed;
    });
  }, [loops, loopsProgress]);

  return (
    <div className="home">
      <div className="home-hero">
        <h1 className="home-title">{program.title}</h1>
        <p className="home-subtitle">{program.description}</p>
      </div>

      {/* Statistiques principales */}
      <div className="home-stats">
        <div className="home-stat-card home-stat-primary">
          <div className="home-stat-icon">
            <TrophyIcon size={44} />
          </div>
          <div className="home-stat-content">
            <div className="home-stat-value">Niveau {level}</div>
            <div className="home-stat-label">{totalXp} XP</div>
            {xpToNext > 0 && (
              <div className="home-stat-sublabel">
                {xpToNext} XP pour niveau {level + 1}
              </div>
            )}
          </div>
        </div>

        <div className="home-stat-card">
          <div className="home-stat-icon">
            <ChartIcon size={44} />
          </div>
          <div className="home-stat-content">
            <div className="home-stat-value">
              {stats.exercisesProgressPercent}%
            </div>
            <div className="home-stat-label">de progression</div>
            <div className="home-stat-sublabel">
              {stats.completedExercises} / {stats.totalExercises} exercices
            </div>
          </div>
        </div>

        <div className="home-stat-card">
          <div className="home-stat-icon">
            <FlameIcon size={44} />
          </div>
          <div className="home-stat-content">
            <div className="home-stat-value">{stats.currentStreak}</div>
            <div className="home-stat-label">jours consécutifs</div>
            <div className="home-stat-sublabel">
              {stats.completedLoops} / {stats.totalLoops} loops
            </div>
          </div>
        </div>

        <div className="home-stat-card">
          <div className="home-stat-icon">
            <CheckIcon size={44} />
          </div>
          <div className="home-stat-content">
            <div className="home-stat-value">{stats.completedLoops}</div>
            <div className="home-stat-label">loops complétées</div>
            <div className="home-stat-sublabel">
              {stats.completionPercentage}% du programme
            </div>
          </div>
        </div>
      </div>

      {/* Barre de progression globale */}
      <div className="home-progress-section">
        <div className="home-progress-header">
          <span className="home-progress-label">Progression globale</span>
          <span className="home-progress-percent">
            {stats.exercisesProgressPercent}%
          </span>
        </div>
        <div className="home-progress-bar">
          <div
            className="home-progress-fill"
            style={{ width: `${stats.exercisesProgressPercent}%` }}
          />
        </div>
        <p className="home-progress-text">
          {stats.completedExercises} exercices complétés sur{" "}
          {stats.totalExercises}
        </p>
      </div>

      {/* Badges */}
      {badges.length > 0 && (
        <div className="home-badges">
          <h3 className="home-badges-title">
            <TrophyIcon size={24} />
            Badges obtenus
          </h3>
          <div className="home-badges-list">
            {badges.map((badge, idx) => (
              <span key={idx} className="home-badge">
                {badge}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Aperçu de la loop actuelle/prochaine */}
      {currentLoop && (
        <div className="home-current-loop">
          <div className="home-current-loop-header">
            <CalendarIcon size={24} />
            <h3 className="home-current-loop-title">
              {loopsProgress[currentLoop.id]?.completed
                ? "Loop en cours"
                : "Prochaine loop"}
            </h3>
          </div>
          <div className="home-current-loop-card">
            <div className="home-current-loop-info">
              <span className="home-current-loop-day">
                Jour {currentLoop.day}
              </span>
              <h4 className="home-current-loop-name">{currentLoop.title}</h4>
              <p className="home-current-loop-goal">{currentLoop.goal}</p>
            </div>
            {loopsProgress[currentLoop.id] && (
              <div className="home-current-loop-progress">
                <div className="home-current-loop-progress-bar">
                  <div
                    className="home-current-loop-progress-fill"
                    style={{
                      width: `${
                        (loopsProgress[currentLoop.id]!.completedExercises
                          .length /
                          currentLoop.exercises.length) *
                        100
                      }%`,
                    }}
                  />
                </div>
                <p className="home-current-loop-progress-text">
                  {loopsProgress[currentLoop.id]!.completedExercises.length} /{" "}
                  {currentLoop.exercises.length} exercices
                </p>
              </div>
            )}
            <button
              className="home-current-loop-button"
              onClick={() => onNavigate("dashboard")}
            >
              Continuer →
            </button>
          </div>
        </div>
      )}

      {/* Actions principales */}
      <div className="home-actions">
        {nextLoop && (
          <button
            className="home-action-button home-action-primary"
            onClick={() => onNavigate("dashboard")}
          >
            <span className="home-action-icon">
              <CalendarIcon size={40} />
            </span>
            <div className="home-action-content">
              <div className="home-action-title">
                Commencer le Jour {nextLoop.day}
              </div>
              <div className="home-action-subtitle">{nextLoop.title}</div>
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
              Vue d'ensemble complète et navigation entre loops
            </div>
          </div>
          <span className="home-action-arrow">→</span>
        </button>
      </div>

      {/* Informations */}
      <div className="home-info">
        <div className="home-info-card">
          <h3 className="home-info-title">
            <TargetIcon size={24} />
            Comment ça marche ?
          </h3>
          <ul className="home-info-list">
            <li>
              <CheckIcon size={16} /> Complète les exercices de chaque loop
            </li>
            <li>
              <NoteIcon size={16} /> Note tes apprentissages dans le débrief
            </li>
            <li>
              <FlameIcon size={16} /> Maintiens une série pour gagner plus d'XP
            </li>
            <li>
              <ChartIcon size={16} /> Suis ta progression et monte de niveau
            </li>
            <li>
              <TrophyIcon size={16} /> Débloque des badges en progressant
            </li>
          </ul>
        </div>

        <div className="home-info-card">
          <h3 className="home-info-title">
            <LightbulbIcon size={24} />
            Conseils
          </h3>
          <ul className="home-info-list">
            <li>Consacre {program.estimatedHoursPerLoop}h par loop</li>
            <li>Note ce que tu comprends pour mieux mémoriser</li>
            <li>Identifie les points flous dans le débrief</li>
            <li>Reste régulier pour maintenir ta série</li>
            <li>Complète les loops pour obtenir les bonus XP</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
