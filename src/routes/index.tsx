import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import { Home } from "../pages/Home/Home";
import { Programs } from "../pages/Programs/Programs";
import { SkillLoopDashboard } from "../pages/Dashboard/SkillLoopDashboard";
import { LoopDay } from "../pages/LoopDay/LoopDay";

/**
 * Configuration des routes de l'application avec React Router
 * 
 * Routes disponibles :
 * - / : Page d'accueil
 * - /programs : Liste des formations
 * - /programs/:programId : Dashboard d'une formation
 * - /programs/:programId/day/:dayNumber : Page d'un jour spécifique
 * 
 * Les composants SkillLoopDashboard et LoopDay récupèrent automatiquement
 * les paramètres depuis l'URL via useParams() et chargent la formation correspondante.
 */
export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "programs",
        element: <Programs />,
      },
      {
        path: "programs/:programId",
        element: <SkillLoopDashboard />,
      },
      {
        path: "programs/:programId/day/:dayNumber",
        element: <LoopDay />,
      },
    ],
  },
]);

