// src/main.tsx

import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Componentes e Contextos
import { AuthProvider } from "./contexts/AuthContext.tsx";
import { ProtectedRoute } from "./components/ProtectedRoute.tsx";
import { Layout } from './components/Layout.tsx'; // Importe o novo Layout

// Páginas
import { Home } from "./pages/Home.tsx";
import { Login } from "./pages/Login.tsx";
import { Games } from "./pages/Games.tsx";
import { Profile } from "./pages/Profile.tsx";
import { Settings } from "./pages/Settings.tsx";
import { GameDetailPage } from "./pages/GameDetailPage.tsx";

import "./index.css";

const router = createBrowserRouter([
  // --- MUDANÇA ESTRUTURAL IMPORTANTE ---
  // Agora temos uma rota "mãe" que renderiza o componente Layout.
  // Todas as rotas "filhas" (children) serão renderizadas dentro do <Outlet> do Layout.
  {
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/games", element: <Games /> },
      { path: "/games/:gameId", element: <GameDetailPage /> },
      {
        path: "/profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: "/settings",
        element: (
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        ),
      },
    ],
  },
  // A rota de Login fica FORA do Layout, pois não queremos a Navbar nela.
  {
    path: "/login",
    element: <Login />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);