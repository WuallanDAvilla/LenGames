// src/main.tsx

import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from 'react-hot-toast';

import { AuthProvider } from "./contexts/AuthContext.tsx";
import { ProtectedRoute } from "./components/ProtectedRoute.tsx";
import { Layout } from './components/Layout.tsx';

import { Home } from "./pages/Home.tsx";
import { Login } from "./pages/Login.tsx";
import { Games } from "./pages/Games.tsx";
import { Profile } from "./pages/Profile.tsx";
import { Settings } from "./pages/Settings.tsx";
import { GameDetailPage } from "./pages/GameDetailPage.tsx";
import { Leaderboard } from './pages/Leaderboard.tsx';

import "./index.css";

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { path: "/", element: <Home /> },
      { path: "/games", element: <Games /> },
      { path: "/games/:gameId", element: <GameDetailPage /> },
      { path: "/leaderboard", element: <Leaderboard /> }, 
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
      <Toaster position="top-right" toastOptions={{ style: { background: '#363636', color: '#fff' } }} />
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);