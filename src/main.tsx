// src/main.tsx

// MUDANÇA 1: Importamos 'lazy' e 'Suspense' do React
import React, { lazy, Suspense } from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Toaster } from "react-hot-toast";

// Componentes, Contextos e Loaders
import { AuthProvider } from "./contexts/AuthContext.tsx";
import { ProtectedRoute } from "./components/ProtectedRoute.tsx";
import { Layout } from "./components/Layout.tsx";
import { GlobalLoader } from "./components/GlobalLoader.tsx"; // Precisaremos do nosso loader aqui

// --- MUDANÇA 2: Lógica de Lazy Loading ---
// Em vez de importar os componentes diretamente, usamos a função 'lazy'.
// A função 'lazy' recebe uma função que chama um 'import()' dinâmico.
// Isso diz ao Vite/React para separar o código de cada página em seu próprio arquivo "chunk".
const Home = lazy(() =>
  import("./pages/Home.tsx").then((module) => ({ default: module.Home }))
);
const Login = lazy(() =>
  import("./pages/Login.tsx").then((module) => ({ default: module.Login }))
);
const Games = lazy(() =>
  import("./pages/Games.tsx").then((module) => ({ default: module.Games }))
);
const Profile = lazy(() =>
  import("./pages/Profile.tsx").then((module) => ({ default: module.Profile }))
);
const Settings = lazy(() =>
  import("./pages/Settings.tsx").then((module) => ({
    default: module.Settings,
  }))
);
const GameDetailPage = lazy(() =>
  import("./pages/GameDetailPage.tsx").then((module) => ({
    default: module.GameDetailPage,
  }))
);
const Leaderboard = lazy(() =>
  import("./pages/Leaderboard.tsx").then((module) => ({
    default: module.Leaderboard,
  }))
);

// A ErrorPage pode ser importada diretamente, pois é pequena e usada em caso de erro.
import { ErrorPage } from "./pages/ErrorPage.tsx";

import "./index.css";

// A função 'lazy' precisa ser envolvida por um componente 'Suspense'.
// O 'Suspense' mostra um 'fallback' (nosso loader) enquanto o código da página está sendo baixado.
const suspenseWrapper = (element: React.ReactElement) => (
  <Suspense fallback={<GlobalLoader />}>{element}</Suspense>
);

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: suspenseWrapper(<Home />) },
      { path: "games", element: suspenseWrapper(<Games />) },
      { path: "games/:gameId", element: suspenseWrapper(<GameDetailPage />) },
      { path: "leaderboard", element: suspenseWrapper(<Leaderboard />) },
      {
        path: "profile",
        element: suspenseWrapper(
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: "settings",
        element: suspenseWrapper(
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        ),
      },
      { path: "*", element: <ErrorPage /> },
    ],
  },
  {
    path: "/login",
    element: suspenseWrapper(<Login />),
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <Toaster
        position="top-right"
        toastOptions={{ style: { background: "#363636", color: "#fff" } }}
      />
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
