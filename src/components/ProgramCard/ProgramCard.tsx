import React from "react";
import type { ProgramMetadata } from "../../data/programs";
import { CalendarIcon, TargetIcon } from "../Icons";
import "./ProgramCard.css";

type ProgramCardProps = {
  program: ProgramMetadata;
  onClick: () => void;
  progress?: {
    totalXp: number;
    completedLoops: number;
    totalLoops: number;
    progressPercent: number;
  };
};

export const ProgramCard: React.FC<ProgramCardProps> = ({
  program,
  onClick,
  progress,
}) => {
  const cardStyle = program.color
    ? { 
        borderTopColor: program.color,
        "--program-color": program.color
      } as React.CSSProperties
    : undefined;

  return (
    <button className="program-card" onClick={onClick} style={cardStyle}>
      <div className="program-card-content">
        <div className="program-card-header">
          <div className="program-card-icon" style={{ backgroundColor: program.color + "20" }}>
            <TargetIcon size={24} />
          </div>
          <div className="program-card-info">
            <h3 className="program-card-title">{program.title}</h3>
            <p className="program-card-description">{program.description}</p>
          </div>
        </div>

        {progress && (
          <div className="program-card-progress">
            <div className="program-progress-stats">
              <div className="program-stat">
                <span className="program-stat-value">{progress.completedLoops}</span>
                <span className="program-stat-label">/ {progress.totalLoops} jours</span>
              </div>
              <div className="program-stat">
                <span className="program-stat-value">{progress.totalXp}</span>
                <span className="program-stat-label">XP</span>
              </div>
            </div>
            <div className="program-progress-bar-wrapper">
              <div className="program-progress-bar-container">
                <div
                  className="program-progress-bar-fill"
                  style={{
                    width: `${Math.max(progress.progressPercent || 0, 0)}%`,
                    backgroundColor: program.color || "#8b7fb8",
                    backgroundImage: program.color
                      ? `linear-gradient(90deg, ${program.color} 0%, ${program.color}dd 100%)`
                      : "linear-gradient(90deg, #8b7fb8 0%, #764ba2 100%)",
                  }}
                />
              </div>
              <span
                className="program-progress-text"
                style={{
                  background: program.color
                    ? `linear-gradient(135deg, ${program.color} 0%, ${program.color}dd 100%)`
                    : undefined,
                }}
              >
                {progress.progressPercent || 0}%
              </span>
            </div>
          </div>
        )}
      </div>

      <div className="program-card-footer">
        <div className="program-card-meta">
          <CalendarIcon size={16} />
          <span>~{program.estimatedHoursPerLoop}h par jour</span>
        </div>
      </div>
    </button>
  );
};

