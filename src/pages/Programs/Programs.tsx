import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useProgramsStore } from "../../store/useProgramsStore";
import { useSkillLoopStore } from "../../store/useSkillLoopStore";
import { ProgramCard } from "../../components/ProgramCard/ProgramCard";
import { loadProgram } from "../../data/programs";
import {
  SparkleIcon,
  ChartIcon,
  TrophyIcon,
  FlameIcon,
  TargetIcon,
  TrendUpIcon,
} from "../../components/Icons";
import "./Programs.css";

import type { ProgramMetadata } from "../../data/programs";

type ProgramWithProgress = {
  program: ProgramMetadata;
  progress?: {
    totalXp: number;
    completedLoops: number;
    totalLoops: number;
    progressPercent: number;
    totalExercises: number;
    completedExercises: number;
  };
  status: "completed" | "in-progress" | "not-started";
};

export const Programs: React.FC = () => {
  const navigate = useNavigate();
  const programs = useProgramsStore((s) => s.programs);
  const programsProgress = useSkillLoopStore((s) => s.programsProgress);

  // Calculer la progression pour chaque formation et les statistiques globales
  const { programsWithProgress, globalStats } = useMemo(() => {
    const programsData: ProgramWithProgress[] = [];
    let totalXpGlobal = 0;
    let totalCompletedPrograms = 0;
    let totalInProgressPrograms = 0;
    const totalPrograms = programs.length;
    let totalProgressSum = 0;

    programs.forEach((program) => {
      const progress = programsProgress[program.id];
      const programData = loadProgram(program.id);

      if (!programData) {
        programsData.push({
          program,
          status: "not-started",
        });
        return;
      }

      const totalLoops = programData.paths
        .flatMap((p) => p.modules)
        .flatMap((m) => m.loops).length;

      const totalExercises = programData.paths
        .flatMap((p) => p.modules)
        .flatMap((m) => m.loops)
        .reduce((sum, loop) => sum + loop.exercises.length, 0);

      if (!progress) {
        programsData.push({
          program,
          status: "not-started",
          progress: {
            totalXp: 0,
            completedLoops: 0,
            totalLoops,
            progressPercent: 0,
            totalExercises,
            completedExercises: 0,
          },
        });
        return;
      }

      const completedLoops = Object.values(progress.loops).filter(
        (loop) => loop.completed
      ).length;

      const completedExercises = Object.values(progress.loops).reduce(
        (sum, loop) => sum + loop.completedExercises.length,
        0
      );

      const progressPercent =
        totalLoops > 0 ? Math.round((completedLoops / totalLoops) * 100) : 0;

      const status =
        progressPercent === 100
          ? "completed"
          : progressPercent > 0
            ? "in-progress"
            : "not-started";

      totalXpGlobal += progress.totalXp;
      totalProgressSum += progressPercent;

      if (status === "completed") {
        totalCompletedPrograms++;
      } else if (status === "in-progress") {
        totalInProgressPrograms++;
      }

      programsData.push({
        program,
        progress: {
          totalXp: progress.totalXp,
          completedLoops,
          totalLoops,
          progressPercent,
          totalExercises,
          completedExercises,
        },
        status,
      });
    });

    const averageProgress =
      totalPrograms > 0 ? Math.round(totalProgressSum / totalPrograms) : 0;

    return {
      programsWithProgress: programsData,
      globalStats: {
        totalXp: totalXpGlobal,
        completedPrograms: totalCompletedPrograms,
        inProgressPrograms: totalInProgressPrograms,
        totalPrograms,
        averageProgress,
      },
    };
  }, [programs, programsProgress]);

  const handleProgramClick = (programId: string) => {
    navigate(`/programs/${programId}`);
  };

  // Organiser les formations par statut
  const inProgressPrograms = programsWithProgress.filter(
    (p) => p.status === "in-progress"
  );
  const completedPrograms = programsWithProgress.filter(
    (p) => p.status === "completed"
  );
  const notStartedPrograms = programsWithProgress.filter(
    (p) => p.status === "not-started"
  );

  return (
    <div className="programs-dashboard">
      {/* Header avec titre */}
      <header className="dashboard-header">
        <div className="dashboard-header-content">
          <div className="dashboard-title-section">
            <div className="dashboard-icon-wrapper">
              <ChartIcon size={32} />
            </div>
            <div>
              <h1 className="dashboard-title">Dashboard</h1>
              <p className="dashboard-subtitle">
                Vue d'ensemble de toutes vos formations
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Statistiques globales */}
      <section className="dashboard-stats">
        <div className="stat-card stat-card-xp">
          <div className="stat-card-icon">
            <FlameIcon size={24} />
          </div>
          <div className="stat-card-content">
            <div className="stat-card-value">{globalStats.totalXp}</div>
            <div className="stat-card-label">XP Total</div>
          </div>
        </div>

        <div className="stat-card stat-card-progress">
          <div className="stat-card-icon">
            <TrendUpIcon size={24} />
          </div>
          <div className="stat-card-content">
            <div className="stat-card-value">
              {globalStats.averageProgress}%
            </div>
            <div className="stat-card-label">Progression Moyenne</div>
          </div>
        </div>

        <div className="stat-card stat-card-completed">
          <div className="stat-card-icon">
            <TrophyIcon size={24} />
          </div>
          <div className="stat-card-content">
            <div className="stat-card-value">
              {globalStats.completedPrograms}
            </div>
            <div className="stat-card-label">Formations Complétées</div>
          </div>
        </div>

        <div className="stat-card stat-card-active">
          <div className="stat-card-icon">
            <TargetIcon size={24} />
          </div>
          <div className="stat-card-content">
            <div className="stat-card-value">
              {globalStats.inProgressPrograms}
            </div>
            <div className="stat-card-label">En Cours</div>
          </div>
        </div>
      </section>

      {/* Section : Formations en cours */}
      {inProgressPrograms.length > 0 && (
        <section className="dashboard-section">
          <div className="section-header">
            <div className="section-header-left">
              <TargetIcon size={24} />
              <h2 className="section-title">Formations en cours</h2>
              <span className="section-count">{inProgressPrograms.length}</span>
            </div>
          </div>
          <div className="programs-grid">
            {inProgressPrograms.map(({ program, progress }) => (
              <ProgramCard
                key={program.id}
                program={program}
                progress={progress}
                onClick={() => handleProgramClick(program.id)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Section : Formations complétées */}
      {completedPrograms.length > 0 && (
        <section className="dashboard-section">
          <div className="section-header">
            <div className="section-header-left">
              <TrophyIcon size={24} />
              <h2 className="section-title">Formations complétées</h2>
              <span className="section-count">{completedPrograms.length}</span>
            </div>
          </div>
          <div className="programs-grid">
            {completedPrograms.map(({ program, progress }) => (
              <ProgramCard
                key={program.id}
                program={program}
                progress={progress}
                onClick={() => handleProgramClick(program.id)}
              />
            ))}
          </div>
        </section>
      )}

      {/* Section : Nouvelles formations */}
      {notStartedPrograms.length > 0 && (
        <section className="dashboard-section">
          <div className="section-header">
            <div className="section-header-left">
              <SparkleIcon size={24} />
              <h2 className="section-title">Nouvelles formations</h2>
              <span className="section-count">{notStartedPrograms.length}</span>
            </div>
          </div>
          <div className="programs-grid">
            {notStartedPrograms.map(({ program, progress }) => (
              <ProgramCard
                key={program.id}
                program={program}
                progress={progress}
                onClick={() => handleProgramClick(program.id)}
              />
            ))}
          </div>
        </section>
      )}

      {/* État vide */}
      {programs.length === 0 && (
        <div className="programs-empty">
          <SparkleIcon size={48} />
          <p>Aucune formation disponible pour le moment</p>
        </div>
      )}
    </div>
  );
};
