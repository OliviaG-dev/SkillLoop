import { useState, useMemo } from "react";
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
}

export const LoopOfTheDay: React.FC<Props> = ({ loop }) => {
  const completeExercise = useSkillLoopStore((s) => s.completeExercise);
  const uncompleteExercise = useSkillLoopStore((s) => s.uncompleteExercise);
  const updateDebrief = useSkillLoopStore((s) => s.updateDebrief);
  const completeLoop = useSkillLoopStore((s) => s.completeLoop);
  const loopsProgress = useSkillLoopStore((s) => s.loops);
  const totalXp = useSkillLoopStore((s) => s.totalXp);

  // Récupérer la progression de la loop directement
  const loopProgress = loopsProgress[loop.id];

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

  const exercisesCompleted = loopProgress?.completedExercises.length ?? 0;
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

  return (
    <div className="loop-card">
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
            <div className="progress-stat-icon">
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
            <div className="progress-stat-icon">
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
          const isDone = loopProgress?.completedExercises.includes(ex.id);
          return (
            <button
              key={ex.id}
              disabled={!isDone && loopProgress?.completed}
              className={`exercise-button ${isDone ? "exercise-done" : "exercise-active"}`}
              onClick={() => {
                if (isDone) {
                  uncompleteExercise(loop.id, ex.id);
                } else {
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
