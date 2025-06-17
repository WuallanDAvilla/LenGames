// src/main.tsx
import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Importando nossas páginas
import { Home } from "./pages/Home.tsx";
import { Login } from "./pages/Login.tsx";
import { Games } from "./pages/Games.tsx";
import { Profile } from "./pages/Profile.tsx";
import { Settings } from "./pages/Settings.tsx";
import { GameDetailPage } from "./pages/GameDetailPage.tsx";

import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/games",
    element: <Games />,
  },
  {
    // Rota dinâmica para cada jogo
    path: "/games/:gameId",
    element: <GameDetailPage />,
  },
  {
    path: "/profile",
    element: <Profile />,
  },
  {
    path: "/settings",
    element: <Settings />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
