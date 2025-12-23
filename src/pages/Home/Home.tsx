import { useNavigate } from "react-router-dom";
import { TargetIcon, ChartIcon, FlameIcon } from "../../components/Icons";
import "./Home.css";

export function Home() {
  const navigate = useNavigate();
  return (
    <div className="home-landing">
      <section className="home-hero">
        <div className="hero-badge">
          <span>Méthode d'apprentissage</span>
          <span className="hero-badge-pill">Par la pratique</span>
        </div>
        <h1 className="home-title">SkillLoop</h1>
        <p className="home-subtitle">
          Transforme l'apprentissage en un cycle continu de pratique et
          d'amélioration. Chaque jour, une boucle d'exercices guidés pour
          construire des compétences durables.
        </p>
        <div className="hero-meta">
          <div className="hero-meta-item">
            <TargetIcon size={18} />
            <span>Objectifs clairs</span>
          </div>
          <div className="hero-meta-item">
            <FlameIcon size={18} />
            <span>Pratique régulière</span>
          </div>
          <div className="hero-meta-item">
            <ChartIcon size={18} />
            <span>Progression mesurable</span>
          </div>
        </div>
      </section>

      <section className="home-pillars" id="concept">
        <div className="section-header-home">
          <div className="section-kicker">Le concept</div>
          <h2>La maîtrise est une boucle, pas un événement</h2>
          <p className="section-subtitle">
            SkillLoop repose sur une idée simple : les compétences se
            construisent par la répétition intentionnelle. Chaque jour, une
            boucle d'exercices pour pratiquer, analyser et progresser.
          </p>
        </div>
        <div className="pillars-grid">
          <div className="pillar-card">
            <div className="pillar-icon">
              <TargetIcon size={24} />
            </div>
            <h3>Boucles quotidiennes</h3>
            <p>
              Chaque jour, un objectif clair et des exercices actionnables pour
              progresser étape par étape.
            </p>
          </div>
          <div className="pillar-card">
            <div className="pillar-icon">
              <ChartIcon size={24} />
            </div>
            <h3>Pratique guidée</h3>
            <p>
              Des ressources ciblées et un suivi de progression pour construire
              des compétences durables.
            </p>
          </div>
          <div className="pillar-card">
            <div className="pillar-icon">
              <FlameIcon size={24} />
            </div>
            <h3>Rythme soutenable</h3>
            <p>
              Des boucles courtes et régulières pour avancer sans sacrifier la
              qualité ni la motivation.
            </p>
          </div>
        </div>
      </section>

      <section className="home-how-it-works">
        <div className="section-header-home">
          <div className="section-kicker">Comment ça marche</div>
          <h2>Un système d'entraînement pour la maîtrise</h2>
          <p className="section-subtitle">
            SkillLoop transforme la formation en un cycle continu où la pratique
            régulière devient le moteur de l'apprentissage.
          </p>
        </div>
        <div className="how-it-works-grid">
          <div className="how-it-works-card">
            <div className="how-it-works-number">1</div>
            <h3>Exercices quotidiens</h3>
            <p>
              Chaque jour, une série d'exercices pratiques avec des objectifs
              précis et des ressources adaptées.
            </p>
          </div>
          <div className="how-it-works-card">
            <div className="how-it-works-number">2</div>
            <h3>Réflexion et débrief</h3>
            <p>
              Note ce que tu as compris, identifie les points flous et consolide
              tes apprentissages.
            </p>
          </div>
          <div className="how-it-works-card">
            <div className="how-it-works-number">3</div>
            <h3>Progression mesurable</h3>
            <p>
              Suis ta progression avec un système XP, des niveaux et des badges
              pour rester motivé.
            </p>
          </div>
          <div className="how-it-works-card">
            <div className="how-it-works-number">4</div>
            <h3>Boucle suivante</h3>
            <p>
              Passe à la boucle suivante et continue de construire tes
              compétences jour après jour.
            </p>
          </div>
        </div>
      </section>

      <section className="home-cta">
        <div className="cta-card">
          <div className="cta-content">
            <div className="cta-kicker">Prêt à commencer ?</div>
            <h2>Découvre la méthode SkillLoop</h2>
            <p>
              Accède au tableau de bord, explore les boucles disponibles et
              commence ton parcours d'apprentissage.
            </p>
            <div className="cta-actions">
              <button
                className="hero-button primary"
                onClick={() => navigate("/programs")}
              >
                Voir les formations
              </button>
              <button
                className="hero-button secondary"
                onClick={() => navigate("/programs")}
              >
                Accéder au dashboard
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
