import React, { useMemo, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSkillLoopStore } from "../../store/useSkillLoopStore";
import { useProgramsStore } from "../../store/useProgramsStore";
import { getProgramMetadata } from "../../data/programs";
import { LoopOfTheDay } from "../../components/LoopOfTheDay/LoopOfTheDay";
import { BookIcon } from "../../components/Icons";
import "./LoopDay.css";

export const LoopDay: React.FC = () => {
  const { programId, dayNumber: dayNumberParam } = useParams<{ 
    programId: string; 
    dayNumber: string;
  }>();
  const navigate = useNavigate();
  const program = useSkillLoopStore((s) => s.program);
  const loadProgram = useSkillLoopStore((s) => s.loadProgram);
  const setCurrentProgram = useProgramsStore((s) => s.setCurrentProgram);

  const dayNumber = dayNumberParam ? parseInt(dayNumberParam, 10) : 0;

  // Récupérer les métadonnées de la formation (couleur, etc.)
  const programMetadata = useMemo(() => {
    if (!programId) return null;
    return getProgramMetadata(programId);
  }, [programId]);

  // Couleur de la formation (avec fallback)
  const programColor = programMetadata?.color || "#667eea";

  // Fonction pour générer un gradient à partir de la couleur
  const getGradient = (color: string) => {
    // Convertir hex en RGB pour créer un gradient
    const hex = color.replace("#", "");
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    // Créer une couleur plus sombre pour le gradient
    const darkerR = Math.max(0, r - 40);
    const darkerG = Math.max(0, g - 40);
    const darkerB = Math.max(0, b - 40);

    return `linear-gradient(135deg, ${color} 0%, rgb(${darkerR}, ${darkerG}, ${darkerB}) 100%)`;
  };

  // Fonction pour convertir hex en rgba
  const hexToRgba = (hex: string, alpha: number) => {
    const r = parseInt(hex.substring(1, 3), 16);
    const g = parseInt(hex.substring(3, 5), 16);
    const b = parseInt(hex.substring(5, 7), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  };

  // Style avec variables CSS pour la couleur du programme
  const pageStyle = {
    "--program-color": programColor,
    "--program-color-rgba-08": hexToRgba(programColor, 0.08),
    "--program-color-rgba-15": hexToRgba(programColor, 0.15),
    "--program-color-rgba-20": hexToRgba(programColor, 0.2),
    "--program-color-rgba-25": hexToRgba(programColor, 0.25),
    "--program-color-darker": (() => {
      const hex = programColor.replace("#", "");
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      const darkerR = Math.max(0, r - 40);
      const darkerG = Math.max(0, g - 40);
      const darkerB = Math.max(0, b - 40);
      return `rgb(${darkerR}, ${darkerG}, ${darkerB})`;
    })(),
  } as React.CSSProperties;

  // Charger la formation si nécessaire
  useEffect(() => {
    if (!programId || !dayNumber) {
      navigate("/programs");
      return;
    }

    if (!program || program.id !== programId) {
      const success = loadProgram(programId);
      if (success) {
        setCurrentProgram(programId);
      } else {
        navigate("/programs");
      }
    }
  }, [programId, dayNumber, program, loadProgram, setCurrentProgram, navigate]);

  // Trouver la loop correspondant au jour
  const loop = useMemo(() => {
    const allLoops = program.paths
      .flatMap((p) => p.modules)
      .flatMap((m) => m.loops);
    return allLoops.find((l) => l.day === dayNumber);
  }, [program, dayNumber]);

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
      <div className="loop-day-page">
        <div className="loop-day-error">
          <h2>Jour {dayNumber} introuvable</h2>
          <p>Ce jour n'existe pas dans le programme.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="loop-day-page" style={pageStyle}>
      <div className="loop-day-hero" style={{ background: getGradient(programColor) }}>
        <div className="loop-day-hero-content">
          <div className="loop-day-hero-badge">Jour {dayNumber}</div>
          <h1 className="loop-day-title">{loop.title}</h1>
          <p className="loop-day-subtitle">{loop.goal}</p>
        </div>
      </div>
      <LoopOfTheDay loop={loop} programColor={programColor} />

      {/* RESSOURCES */}
      {allResources.length > 0 && (
        <section className="loop-day-resources-section">
          <div className="loop-day-resources-header">
            <h2 className="loop-day-resources-title">
              <BookIcon size={24} />
              Ressources disponibles
            </h2>
            <span className="loop-day-resources-count">
              {allResources.length} ressource
              {allResources.length > 1 ? "s" : ""}
            </span>
          </div>
          <div className="loop-day-resources-grid">
            {allResources.map((res, idx) => (
              <a
                key={`${res.url}-${idx}`}
                href={res.url}
                target="_blank"
                rel="noreferrer"
                className="loop-day-resource-card"
              >
                <div className="loop-day-resource-type-badge">{res.type}</div>
                <div className="loop-day-resource-label">{res.label}</div>
                <div className="loop-day-resource-arrow">→</div>
              </a>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};
