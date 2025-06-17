// src/main.tsx

import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from 'react-hot-toast'; // <-- MUDANÇA 1: Importe o Toaster

// Componentes e Contextos
import { AuthProvider } from "./contexts/AuthContext.tsx";
import { ProtectedRoute } from "./components/ProtectedRoute.tsx";
import { Layout } from './components/Layout.tsx';

// Páginas
import { Home } from "./pages/Home.tsx";
import { Login } from "./pages/Login.tsx";
import { Games } from "./pages/Games.tsx";
import { Profile } from "./pages/Profile.tsx";
import { Settings } from "./pages/Settings.tsx";
import { GameDetailPage } from "./pages/GameDetailPage.tsx";

import "./index.css";

const router = createBrowserRouter([
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
  {
    path: "/login",
    element: <Login />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      {/* MUDANÇA 2: Adicione o Toaster aqui. Ele é o componente que vai renderizar as notificações. */}
      <Toaster 
        position="top-right" // Posição das notificações na tela
        toastOptions={{
          // Estilos padrão para os toasts
          style: {
            background: '#363636',
            color: '#fff',
          },
          // Estilos específicos para sucesso e erro
          success: {
            iconTheme: {
              primary: '#4ade80',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#f87171',
              secondary: '#fff',
            },
          },
        }}
      />
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);