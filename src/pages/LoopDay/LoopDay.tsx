import { useMemo } from "react";
import { useSkillLoopStore } from "../../store/useSkillLoopStore";
import { LoopOfTheDay } from "../../components/LoopLoopOfTheDay/LoopOfTheDay";
import "./LoopDay.css";

type LoopDayProps = {
  dayNumber: number;
  onNavigate: (view: "home" | "dashboard") => void;
};

export const LoopDay: React.FC<LoopDayProps> = ({ dayNumber, onNavigate }) => {
  const program = useSkillLoopStore((s) => s.program);

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
    <div className="loop-day-page">
      <div className="loop-day-hero">
        <div className="loop-day-hero-content">
          <div className="loop-day-hero-badge">Jour {dayNumber}</div>
          <h1 className="loop-day-title">{loop.title}</h1>
          <p className="loop-day-subtitle">{loop.goal}</p>
        </div>
      </div>
      <LoopOfTheDay loop={loop} />

      {/* RESSOURCES */}
      {allResources.length > 0 && (
        <section className="loop-day-resources-section">
          <div className="loop-day-resources-header">
            <h2 className="loop-day-resources-title">Ressources disponibles</h2>
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

