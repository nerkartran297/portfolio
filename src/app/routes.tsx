import { createBrowserRouter } from "react-router-dom";
import Home from "../pages/Home";
import AchievementsPage from "../pages/AchievementsPage";

export const router = createBrowserRouter([
  { path: "/", element: <Home /> },
  { path: "/achievements", element: <AchievementsPage /> },
]);
