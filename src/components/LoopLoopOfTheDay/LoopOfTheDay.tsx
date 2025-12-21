import { useState, useMemo } from "react";
import { useSkillLoopStore } from "../../store/useSkillLoopStore";
import type { Loop } from "../../types/skillloop.readonly";
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
      <h2 className="loop-title">{loop.title}</h2>
      <p className="loop-goal">{loop.goal}</p>

      <div className="loop-progress-section">
        <div className="progress-bar-container">
          <div
            className="progress-bar-fill"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
        <p className="progress-text">
          Exercices complétés : {exercisesCompleted}/{exercisesTotal}
        </p>
        <p className="xp-text">
          XP total : {totalXp} | XP restant loop : {xpRemaining}
        </p>
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
              {isDone && <span className="exercise-check">✓</span>}
              {ex.label} (+{ex.xpReward} XP)
            </button>
          );
        })}
      </div>

      <div className="debrief-section">
        <h3 className="debrief-title">Débrief</h3>
        <textarea
          className="debrief-textarea"
          placeholder="Notes"
          value={localDebrief.notes}
          onChange={(e) => handleDebriefChange("notes", e.target.value)}
        />
        <textarea
          className="debrief-textarea"
          placeholder="Insights"
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
          Sauvegarder Débrief
        </button>
      </div>

      {!loopProgress?.completed && exercisesCompleted === exercisesTotal && (
        <button
          className="complete-loop-button"
          onClick={() => completeLoop(loop.id)}
        >
          Compléter Loop & Recevoir Bonus XP
        </button>
      )}

      {loopProgress?.completed && (
        <p className="loop-completed-message">Loop complétée ! 🎉</p>
      )}
    </div>
  );
};
