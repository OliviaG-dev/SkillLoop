import { useState, useMemo, useEffect } from "react";
import { useSkillLoopStore } from "../../store/useSkillLoopStore";
import type { Loop } from "../../types/skillloop.readonly";
import {
  ChartIcon,
  FlameIcon,
  TargetIcon,
  NoteIcon,
  SaveIcon,
  CelebrationIcon,
  SparkleIcon,
  CheckIcon,
} from "../Icons";
import "./LoopOfTheDay.css";

interface Props {
  loop: Loop;
  programColor?: string;
}

export const LoopOfTheDay: React.FC<Props> = ({ loop, programColor = "#8b7fb8" }) => {
  const completeExercise = useSkillLoopStore((s) => s.completeExercise);
  const uncompleteExercise = useSkillLoopStore((s) => s.uncompleteExercise);
  const updateDebrief = useSkillLoopStore((s) => s.updateDebrief);
  const completeLoop = useSkillLoopStore((s) => s.completeLoop);
  const getCurrentProgramProgress = useSkillLoopStore((s) => s.getCurrentProgramProgress);
  const getTotalXp = useSkillLoopStore((s) => s.getTotalXp);
  const getLoopProgress = useSkillLoopStore((s) => s.getLoopProgress);

  // Récupérer la progression de la formation actuelle
  const currentProgress = getCurrentProgramProgress();
  const loopsProgress = currentProgress.loops;
  const totalXp = getTotalXp();

  // Récupérer la progression de la loop directement
  const loopProgress = getLoopProgress(loop.id);

  // État local optimiste pour les exercices complétés
  const [optimisticCompleted, setOptimisticCompleted] = useState<Set<string>>(
    () => new Set(loopProgress?.completedExercises || [])
  );

  // Synchroniser l'état optimiste avec le store
  useEffect(() => {
    if (loopProgress?.completedExercises) {
      setOptimisticCompleted(new Set(loopProgress.completedExercises));
    }
  }, [loopProgress?.completedExercises]);

  // Calculer l'XP restant localement
  const xpRemaining = useMemo(() => {
    const progress = loopsProgress[loop.id];
    const earnedXp = progress?.xpEarned ?? 0;

    const exercisesXp = loop.exercises.reduce(
      (sum, ex) => sum + ex.xpReward,
      0
    );
    const bonusXp =
      loop.xpBonus.completion +
      loop.xpBonus.fullCompletion +
      loop.xpBonus.reflectionCompleted;

    return exercisesXp + bonusXp - earnedXp;
  }, [loop, loopsProgress]);

  const [localDebrief, setLocalDebrief] = useState(() => {
    const progress = loopsProgress[loop.id];
    return (
      progress?.debrief ?? {
        notes: "",
        insights: "",
        questions: "",
      }
    );
  });

  // Utiliser l'état optimiste pour le calcul de progression
  const exercisesCompleted = optimisticCompleted.size;
  const exercisesTotal = loop.exercises.length;
  const progressPercent =
    exercisesTotal > 0
      ? Math.round((exercisesCompleted / exercisesTotal) * 100)
      : 0;

  const handleDebriefChange = (
    field: keyof typeof localDebrief,
    value: string
  ) => {
    setLocalDebrief((prev) => ({ ...prev, [field]: value }));
  };

  const saveDebrief = () => {
    updateDebrief(loop.id, localDebrief);
  };

  // Fonction pour générer une couleur plus sombre pour le gradient
  const getDarkerColor = (color: string) => {
    const hex = color.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const darkerR = Math.max(0, r - 40);
    const darkerG = Math.max(0, g - 40);
    const darkerB = Math.max(0, b - 40);
    return `rgb(${darkerR}, ${darkerG}, ${darkerB})`;
  };

  // Fonction pour convertir hex en rgba
  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.substring(1, 3), 16);
    const g = parseInt(hex.substring(3, 5), 16);
    const b = parseInt(hex.substring(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  const gradientColor = getDarkerColor(programColor);

  // Style avec variables CSS pour la couleur du programme
  const cardStyle = {
    "--program-color": programColor,
    "--program-color-darker": gradientColor,
    "--program-color-rgba-08": hexToRgba(programColor, 0.08),
    "--program-color-rgba-10": hexToRgba(programColor, 0.1),
    "--program-color-rgba-15": hexToRgba(programColor, 0.15),
    "--program-color-rgba-20": hexToRgba(programColor, 0.2),
    "--program-color-rgba-25": hexToRgba(programColor, 0.25),
    "--program-color-rgba-40": hexToRgba(programColor, 0.4),
  } as React.CSSProperties;

  return (
    <div 
      className="loop-card"
      style={cardStyle}
    >
      <div className="loop-progress-section">
        <div className="progress-header">
          <div className="progress-header-left">
            <ChartIcon size={20} />
            <span className="progress-header-title">Progression</span>
          </div>
          <span className="progress-percentage">{progressPercent}%</span>
        </div>

        <div className="progress-bar-container">
          <div
            className="progress-bar-fill"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="progress-stats">
          <div className="progress-stat-item">
            <div className="progress-stat-icon progress-stat-icon-exercises">
              <TargetIcon size={18} />
            </div>
            <div className="progress-stat-content">
              <div className="progress-stat-value">
                {exercisesCompleted}/{exercisesTotal}
              </div>
              <div className="progress-stat-label">Exercices</div>
            </div>
          </div>

          <div className="progress-stat-divider"></div>

          <div className="progress-stat-item">
            <div className="progress-stat-icon progress-stat-icon-xp-total">
              <FlameIcon size={18} />
            </div>
            <div className="progress-stat-content">
              <div className="progress-stat-value">{totalXp}</div>
              <div className="progress-stat-label">XP Total</div>
            </div>
          </div>

          <div className="progress-stat-divider"></div>

          <div className="progress-stat-item">
            <div className="progress-stat-icon progress-stat-icon-remaining">
              <FlameIcon size={18} />
            </div>
            <div className="progress-stat-content">
              <div className="progress-stat-value">{xpRemaining}</div>
              <div className="progress-stat-label">XP Restant</div>
            </div>
          </div>
        </div>
      </div>

      <div className="exercises-list">
        {loop.exercises.map((ex) => {
          const isDone = optimisticCompleted.has(ex.id);
          const isDisabled = !isDone && loopProgress?.completed;
          return (
            <button
              key={ex.id}
              disabled={isDisabled}
              className={`exercise-button ${isDone ? "exercise-done" : "exercise-active"}`}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                
                // Mise à jour optimiste immédiate
                if (isDone) {
                  setOptimisticCompleted((prev) => {
                    const next = new Set(prev);
                    next.delete(ex.id);
                    return next;
                  });
                  uncompleteExercise(loop.id, ex.id);
                } else {
                  setOptimisticCompleted((prev) => {
                    const next = new Set(prev);
                    next.add(ex.id);
                    return next;
                  });
                  completeExercise(loop.id, ex.id, ex.xpReward);
                }
              }}
              title={
                isDone ? "Cliquer pour décocher" : "Cliquer pour compléter"
              }
            >
              {isDone && (
                <span className="exercise-check">
                  <CheckIcon size={16} />
                </span>
              )}
              <span className="exercise-label">
                <span className="exercise-label-first">
                  {ex.label.split(" ")[0]}
                </span>
                {ex.label.split(" ").length > 1 && (
                  <span className="exercise-label-rest">
                    {" "}
                    {ex.label.split(" ").slice(1).join(" ")}
                  </span>
                )}
              </span>
              <span className="exercise-xp">(+{ex.xpReward} XP)</span>
            </button>
          );
        })}
      </div>

      <div className="debrief-section">
        <h3 className="debrief-title">
          <NoteIcon size={20} />
          Débrief
        </h3>
        <textarea
          className="debrief-textarea"
          placeholder="Notes"
          value={localDebrief.notes}
          onChange={(e) => handleDebriefChange("notes", e.target.value)}
        />
        <textarea
          className="debrief-textarea"
          placeholder="Résumé"
          value={localDebrief.insights}
          onChange={(e) => handleDebriefChange("insights", e.target.value)}
        />
        <textarea
          className="debrief-textarea"
          placeholder="Questions"
          value={localDebrief.questions}
          onChange={(e) => handleDebriefChange("questions", e.target.value)}
        />
        <button className="save-debrief-button" onClick={saveDebrief}>
          <SaveIcon size={18} />
          Sauvegarder Débrief
        </button>
      </div>

      {!loopProgress?.completed && exercisesCompleted === exercisesTotal && (
        <button
          className="complete-loop-button"
          onClick={() => completeLoop(loop.id)}
        >
          <CelebrationIcon size={20} />
          Compléter Loop & Recevoir Bonus XP
        </button>
      )}

      {loopProgress?.completed && (
        <p className="loop-completed-message">
          <SparkleIcon size={20} />
          Loop complétée !
        </p>
      )}
    </div>
  );
};

