import { useMemo } from "react";
import { useSkillLoopStore } from "../../store/useSkillLoopStore";
import {
  CalendarIcon,
  TargetIcon,
  TrophyIcon,
  ChartIcon,
  BookIcon,
  LightbulbIcon,
  FlameIcon,
} from "../../components/Icons";
import "./Home.css";

type HomeProps = {
  onNavigate: (view: "home" | "dashboard") => void;
};

export function Home({ onNavigate }: HomeProps) {
  const program = useSkillLoopStore((s) => s.program);

  const loops = useMemo(
    () => program.paths.flatMap((p) => p.modules).flatMap((m) => m.loops),
    [program]
  );

  const formations = useMemo(
    () =>
      program.paths.map((path) => {
        const loopsCount = path.modules.reduce(
          (sum, m) => sum + m.loops.length,
          0
        );
        const exercisesCount = path.modules.reduce(
          (sum, m) =>
            sum + m.loops.reduce((acc, l) => acc + l.exercises.length, 0),
          0
        );
        return {
          id: path.id,
          title: path.title,
          objective: path.objective,
          modulesCount: path.modules.length,
          loopsCount,
          exercisesCount,
          estimatedHours: loopsCount * program.estimatedHoursPerLoop,
        };
      }),
    [program]
  );

  const previewLoops = useMemo(() => loops.slice(0, 3), [loops]);
  const totalLoops = loops.length;
  const totalExercises = loops.reduce(
    (sum, loop) => sum + loop.exercises.length,
    0
  );

  return (
    <div className="home-landing">
      <section className="home-hero">
        <div className="hero-badge">
          <span>Parcours IA</span>
          <span className="hero-badge-pill">{totalLoops} jours guidés</span>
        </div>
        <h1 className="home-title">{program.title}</h1>
        <p className="home-subtitle">{program.description}</p>
        <div className="hero-meta">
          <div className="hero-meta-item">
            <CalendarIcon size={18} />
            <span>{totalLoops} loops, {program.estimatedHoursPerLoop}h chacune</span>
          </div>
          <div className="hero-meta-item">
            <BookIcon size={18} />
            <span>{totalExercises} exercices concrets</span>
          </div>
          <div className="hero-meta-item">
            <TargetIcon size={18} />
            <span>Focus: assistant IA crédible</span>
          </div>
        </div>
        <div className="hero-actions">
          <button
            className="hero-button primary"
            onClick={() => onNavigate("dashboard")}
          >
            Lancer le parcours
          </button>
          <a className="hero-button ghost" href="#formations">
            Découvrir les formations
          </a>
        </div>
      </section>

      <section className="home-pillars">
        <div className="section-header">
          <div className="section-kicker">Pourquoi SkillLoop ?</div>
          <h2>Un parcours pensé pour livrer un projet, pas des slides</h2>
          <p className="section-subtitle">
            Des boucles courtes, des exercices actionnables et un accompagnement
            pour construire un assistant IA prêt à l'emploi.
          </p>
        </div>
        <div className="pillars-grid">
          <div className="pillar-card">
            <div className="pillar-icon">
              <TargetIcon size={24} />
            </div>
            <h3>Parcours guidé</h3>
            <p>Chaque jour, un objectif clair et des ressources ciblées.</p>
          </div>
          <div className="pillar-card">
            <div className="pillar-icon">
              <ChartIcon size={24} />
            </div>
            <h3>Pratique immédiate</h3>
            <p>Des exercices concrets pour intégrer l'IA dans un vrai flux.</p>
          </div>
          <div className="pillar-card">
            <div className="pillar-icon">
              <FlameIcon size={24} />
            </div>
            <h3>Rythme durable</h3>
            <p>Des boucles courtes pour avancer sans sacrifier la qualité.</p>
          </div>
        </div>
      </section>

      <section className="home-formations" id="formations">
        <div className="section-header">
          <div className="section-kicker">Formations incluses</div>
          <h2>Les parcours que tu vas suivre</h2>
          <p className="section-subtitle">
            Un fil rouge unique avec plusieurs modules pour progresser étape par étape.
          </p>
        </div>
        <div className="formations-grid">
          {formations.map((formation) => (
            <div key={formation.id} className="formation-card">
              <div className="formation-top">
                <div className="formation-badge">
                  {formation.loopsCount} jours • {formation.modulesCount} modules
                </div>
                <h3>{formation.title}</h3>
                <p>{formation.objective}</p>
              </div>
              <div className="formation-meta">
                <div className="meta-item">
                  <CalendarIcon size={18} />
                  <span>{formation.estimatedHours}h estimées</span>
                </div>
                <div className="meta-item">
                  <BookIcon size={18} />
                  <span>{formation.exercisesCount} exercices</span>
                </div>
              </div>
              <button
                className="formation-button"
                onClick={() => onNavigate("dashboard")}
              >
                Accéder au parcours
              </button>
            </div>
          ))}
        </div>
      </section>

      <section className="home-preview">
        <div className="section-header">
          <div className="section-kicker">Aperçu</div>
          <h2>Ce que tu vas construire dès les premiers jours</h2>
          <p className="section-subtitle">
            Un aperçu des premières boucles pour te mettre en confiance.
          </p>
        </div>
        <div className="preview-grid">
          {previewLoops.map((loop) => (
            <div key={loop.id} className="preview-card">
              <div className="preview-day">Jour {loop.day}</div>
              <h3 className="preview-title">{loop.title}</h3>
              <p className="preview-goal">{loop.goal}</p>
              <div className="preview-meta">
                <div className="meta-item">
                  <TargetIcon size={16} />
                  <span>Objectif clair</span>
                </div>
                <div className="meta-item">
                  <BookIcon size={16} />
                  <span>{loop.exercises.length} exercices</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="home-cta">
        <div className="cta-card">
          <div className="cta-content">
            <div className="cta-kicker">Prêt à démarrer ?</div>
            <h2>Commence ton assistant IA dès aujourd'hui</h2>
            <p>
              Accède au tableau de bord, lance la première boucle et suis le guide pas à pas.
            </p>
            <div className="cta-actions">
              <button className="hero-button primary" onClick={() => onNavigate("dashboard")}>
                Accéder au dashboard
              </button>
              <button className="hero-button ghost" onClick={() => onNavigate("dashboard")}>
                Voir le programme complet
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
