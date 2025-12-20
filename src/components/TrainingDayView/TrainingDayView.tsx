import { useState } from 'react';
import type { TrainingDay, TrainingTask } from '../../types';
import { ClipboardIcon, NoteIcon, FlameIcon, QuestionIcon } from '../Icons';
import './TrainingDayView.css';

type TrainingDayViewProps = {
  trainingDay: TrainingDay;
  onUpdate: (updatedDay: TrainingDay) => void;
};

export function TrainingDayView({ trainingDay, onUpdate }: TrainingDayViewProps) {
  const [day, setDay] = useState<TrainingDay>(trainingDay);

  const handleTaskToggle = (taskId: string) => {
    const updatedTasks = day.tasks.map((task) =>
      task.id === taskId ? { ...task, done: !task.done } : task
    );
    const updatedDay = {
      ...day,
      tasks: updatedTasks,
      completed: updatedTasks.every((task) => task.done),
    };
    setDay(updatedDay);
    onUpdate(updatedDay);
  };

  const handleNotesChange = (value: string) => {
    const updatedDay = { ...day, notes: value };
    setDay(updatedDay);
    onUpdate(updatedDay);
  };

  const handleInsightsChange = (value: string) => {
    const updatedDay = { ...day, insights: value };
    setDay(updatedDay);
    onUpdate(updatedDay);
  };

  const handleQuestionsChange = (value: string) => {
    const updatedDay = { ...day, questions: value };
    setDay(updatedDay);
    onUpdate(updatedDay);
  };

  const completedTasks = day.tasks.filter((task) => task.done).length;
  const totalTasks = day.tasks.length;
  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <div className="training-day-view">
      <div className="day-header">
        <div className="day-title-group">
          <h2 className="day-number">Jour {day.day}</h2>
          <h3 className="day-title">{day.title}</h3>
        </div>
        <div className="day-progress">
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${progressPercentage}%` }}
            ></div>
          </div>
          <span className="progress-text">
            {completedTasks}/{totalTasks} tâches
          </span>
        </div>
      </div>

      <div className="day-content">
        <section className="tasks-section">
          <h3 className="section-title">
            <ClipboardIcon size={20} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '0.5rem' }} />
            Checklist des tâches
          </h3>
          <div className="tasks-list">
            {day.tasks.map((task) => (
              <label key={task.id} className="task-item">
                <input
                  type="checkbox"
                  checked={task.done}
                  onChange={() => handleTaskToggle(task.id)}
                  className="task-checkbox"
                />
                <span className={`task-label ${task.done ? 'task-done' : ''}`}>
                  {task.label}
                </span>
              </label>
            ))}
          </div>
        </section>

        <section className="notes-section">
          <h3 className="section-title">
            <NoteIcon size={20} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '0.5rem' }} />
            Notes personnelles
          </h3>
          <textarea
            className="notes-textarea"
            value={day.notes}
            onChange={(e) => handleNotesChange(e.target.value)}
            placeholder="Tes notes du jour..."
            rows={4}
          />
        </section>

        <section className="insights-section">
          <h3 className="section-title">
            <FlameIcon size={20} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '0.5rem' }} />
            Ce que j'ai compris aujourd'hui
          </h3>
          <textarea
            className="insights-textarea"
            value={day.insights}
            onChange={(e) => handleInsightsChange(e.target.value)}
            placeholder="Les points clés que tu as maîtrisés..."
            rows={4}
          />
        </section>

        <section className="questions-section">
          <h3 className="section-title">
            <QuestionIcon size={20} style={{ display: 'inline-block', verticalAlign: 'middle', marginRight: '0.5rem' }} />
            Ce qui reste flou
          </h3>
          <textarea
            className="questions-textarea"
            value={day.questions}
            onChange={(e) => handleQuestionsChange(e.target.value)}
            placeholder="Les points à revoir ou clarifier..."
            rows={4}
          />
        </section>
      </div>
    </div>
  );
}

